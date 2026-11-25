// A tree diagram with two steps, built one step at a time.
//
// The tree is painted on the floor. It grows by itself: the first branches,
// then the second branches, then the product along each path. Then the
// paths that end in the second event are highlighted and added, and last
// the one path that also goes through the first event. The readout says
// what each step does.
//
// The events and their probabilities are written on the ::visual line, so
// the same tree serves a lesson and any problem:
//
//   ::visual{name="probability-tree" one="email"
//     first="spam" first-symbol="S" probability="1/10"
//     second="flagged" second-symbol="F"
//     probability-if-first="4/5" probability-if-not="1/5"}
//
// Optional: not-first and not-second name the other branch of each step
// (the default is "not spam"), and slider="yes" adds a slider for the
// probability of the first event.

import {
  ball,
  dividedBy,
  evenSteps,
  floor,
  floorLine,
  fractionFrom,
  fractionText as text,
  oneMinus,
  palette,
  plus,
  reduce,
  Stage,
  sumText,
  THREE,
  times,
  Visual,
  type Figure,
  type StageLabel,
} from "canon";

// Timing, in seconds. The tree goes through six steps, numbered 0 to 5.
const STEP_TIME = 3;
const GROW_TIME = 1; // how long a branch takes to grow
const LAST_STEP = 5;

const FADED_COLOR = 0xcfcdc6;
const BRANCH_WIDTH = 0.06;

type Point = { x: number; y: number };

// Where the points of the tree sit on the floor. The first event is toward
// the back, which is the top of the picture.
const START: Point = { x: -5, y: 0 };
const FIRST: Point = { x: -1.8, y: -1.9 };
const NOT_FIRST: Point = { x: -1.8, y: 1.9 };
const LEAF_X = 1.6;

// A branch of the tree: a line that can grow from its start and change
// color, with the probability written beside it.
type Branch = {
  from: Point;
  to: Point;
  line: THREE.Mesh;
  endBall: THREE.Mesh;
  label: StageLabel;
};

export default class ProbabilityTree extends Visual {
  protected build(figure: Figure): void {
    // What the ::visual line says about the two events.
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The probability tree needs ${name}="..." on its ::visual line.`);
      return value;
    };
    const first = setting("first");
    const second = setting("second");
    const notFirst = this.getAttribute("not-first") ?? `not ${first}`;
    const notSecond = this.getAttribute("not-second") ?? `not ${second}`;
    const firstSymbol = setting("first-symbol");
    const secondSymbol = setting("second-symbol");
    const secondIfFirst = fractionFrom(setting("probability-if-first"));
    const secondIfNotFirst = fractionFrom(setting("probability-if-not"));
    let firstProbability = fractionFrom(setting("probability"));

    const stage = new Stage(figure, {
      halfWidth: 6.6,
      lookAt: [0.9, 0.1, 0],
      azimuth: 0,
      elevation: 52,
      gridSize: 30,
    });

    const startBall = ball(palette.dark, 0.13);
    startBall.position.copy(floor(START.x, START.y, 0.13));
    stage.scene.add(startBall);
    const startLabel = stage.label(`one ${this.getAttribute("one") ?? "trial"}`);
    startLabel.position.copy(floor(START.x, START.y, 0.25));

    const makeBranch = (from: Point, to: Point): Branch => {
      const branch = {
        from,
        to,
        line: floorLine(from, to, { color: palette.dark, width: BRANCH_WIDTH }),
        endBall: ball(palette.dark, 0.13),
        label: stage.label("", "fig-number"),
      };
      branch.endBall.position.copy(floor(to.x, to.y, 0.13));
      branch.label.position.copy(floor((from.x + to.x) / 2, (from.y + to.y) / 2, 0.1));
      stage.scene.add(branch.line, branch.endBall);
      return branch;
    };

    const toFirst = makeBranch(START, FIRST);
    const toNotFirst = makeBranch(START, NOT_FIRST);
    const firstLabel = stage.label(`${first}, <i>${firstSymbol}</i>`);
    firstLabel.position.copy(floor(FIRST.x, FIRST.y - 0.35));
    const notFirstLabel = stage.label(`${notFirst}, <i>${firstSymbol}<sup>c</sup></i>`);
    notFirstLabel.position.copy(floor(NOT_FIRST.x, NOT_FIRST.y + 1.0));

    // The four paths, from the top of the picture to the bottom.
    const paths = [
      { first: toFirst, endY: -2.9, throughFirst: true, endsInSecond: true },
      { first: toFirst, endY: -0.9, throughFirst: true, endsInSecond: false },
      { first: toNotFirst, endY: 0.9, throughFirst: false, endsInSecond: true },
      { first: toNotFirst, endY: 2.9, throughFirst: false, endsInSecond: false },
    ].map((path) => {
      const second = makeBranch(path.first.to, { x: LEAF_X, y: path.endY });
      const resultLabel = stage.label("");
      resultLabel.position.copy(floor(LEAF_X + 2.7, path.endY + 0.45));
      return { ...path, second, resultLabel };
    });

    const timeline = figure.timeline(evenSteps(LAST_STEP + 1, STEP_TIME));

    if (this.getAttribute("slider") === "yes") {
      // The slider moves in steps of half a percent, so the probability
      // is a whole number of 200ths.
      const fromPercent = (percent: number) => reduce({ top: percent * 2, bottom: 200 });
      figure.slider(
        `Probability of "${first}"`,
        {
          min: 0.5,
          max: 50,
          step: 0.5,
          value: (100 * firstProbability.top) / firstProbability.bottom,
          format: (percent) => `${percent}% (${text(fromPercent(percent))})`,
        },
        (percent) => {
          firstProbability = fromPercent(percent);
        },
      );
    }
    figure.button("Replay", () => {
      timeline.restart();
    });
    figure.caption(
      "Each branch carries the probability of that step, given the steps before it. " +
        "The probability of a path is the product of the probabilities along it.",
    );

    stage.onFrame = (seconds) => {
      const time = timeline.advance(seconds);
      const step = Math.min(Math.floor(time / STEP_TIME), LAST_STEP);
      // How far a branch that starts growing at `startStep` has grown.
      const grown = (startStep: number) =>
        THREE.MathUtils.clamp((time - startStep * STEP_TIME) / GROW_TIME, 0, 1);

      const withFirst = firstProbability;
      const withoutFirst = oneMinus(withFirst);

      // Step 1: the first branches.
      toFirst.label.element.textContent = text(withFirst);
      toNotFirst.label.element.textContent = text(withoutFirst);
      for (const branch of [toFirst, toNotFirst]) grow(branch, grown(1));
      firstLabel.shown = grown(1) === 1;
      notFirstLabel.shown = grown(1) === 1;

      const products = paths.map((path, index) => {
        const firstStep = path.throughFirst ? withFirst : withoutFirst;
        const secondGivenStep = path.throughFirst ? secondIfFirst : secondIfNotFirst;
        const probability = path.endsInSecond ? secondGivenStep : oneMinus(secondGivenStep);
        const product = times(firstStep, probability);

        // Step 2: the second branches.
        path.second.label.element.textContent = text(probability);
        grow(path.second, grown(2));

        // Step 3: the products appear one path at a time, from the top.
        const productShown = time >= 3 * STEP_TIME + index * 0.6;
        path.resultLabel.shown = grown(2) === 1;
        path.resultLabel.element.innerHTML =
          (path.endsInSecond
            ? `${second}, <i>${secondSymbol}</i>`
            : `${notSecond}, <i>${secondSymbol}<sup>c</sup></i>`) +
          (productShown ? `<br><b>${text(firstStep)} &times; ${text(probability)} = ${text(product)}</b>` : "");

        // Step 4 keeps the paths that end in the second event. Step 5
        // keeps only the one that goes through the first, and colors it red.
        const kept = step < 4 || (path.endsInSecond && (step < 5 || path.throughFirst));
        const color = !kept ? FADED_COLOR : step === 5 ? palette.red : palette.dark;
        setBranchColor(path.second, color);
        path.resultLabel.element.classList.toggle("dim", !kept);
        return product;
      });

      // A first branch stays dark while any kept path uses it.
      setBranchColor(toFirst, step === 5 ? palette.red : palette.dark);
      setBranchColor(toNotFirst, step === 5 ? FADED_COLOR : palette.dark);

      const eitherPath = plus(products[0], products[2]);
      const answer = dividedBy(products[0], eitherPath);
      figure.readout(
        [
          "The tree starts at one point.",
          `First: ${first}, or ${notFirst}.`,
          `Then: ${second}, or ${notSecond}. Each probability is given the first step.`,
          "We multiply along each path.",
          `Two paths end in "${second}": <b>${text(products[0])} + ${text(products[2])} = ${sumText(products[0], products[2])}</b>`,
          `One of them goes through "${first}": <b>${text(products[0])} &divide; ${sumText(products[0], products[2])} = ${text(answer)}</b>`,
        ][step],
      );
    };
  }
}

// Draws a branch grown part of the way from its start: 0 is not at all and
// 1 is all the way. The ball at its end and its label appear when it is
// fully grown.
function grow(branch: Branch, amount: number): void {
  branch.line.visible = amount > 0;
  branch.line.scale.x = Math.max(amount, 0.001);
  // The line is centered on its own middle, so it is moved to keep its
  // start fixed while it grows.
  branch.line.position.x = branch.from.x + ((branch.to.x - branch.from.x) * amount) / 2;
  branch.line.position.z = branch.from.y + ((branch.to.y - branch.from.y) * amount) / 2;
  branch.endBall.visible = amount === 1;
  branch.label.shown = amount === 1;
}

function setBranchColor(branch: Branch, color: number): void {
  (branch.line.material as THREE.MeshBasicMaterial).color.set(color);
  (branch.endBall.material as THREE.MeshLambertMaterial).color.set(color);
  branch.label.element.classList.toggle("dim", color === FADED_COLOR);
}
