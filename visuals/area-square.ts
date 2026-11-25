// Two events drawn as areas of a square, built one step at a time.
//
// The square stands for every outcome, and its area is 1. It is cut by
// width into the first event and its opposite, and then each strip is cut
// by height into the second event and its opposite. The area of each of the
// four rectangles is the probability of one pair of results. Last, the two
// rectangles for the second event move out and line up as one bar, and the
// share of the bar that belongs to the first event is the conditional
// probability.
//
// The events and their probabilities are written on the ::visual line, with
// the same settings as the probability tree:
//
//   ::visual{name="area-square" one="email"
//     first="spam" first-symbol="S" probability="1/10"
//     second="flagged" second-symbol="F"
//     probability-if-first="4/5" probability-if-not="1/5"}

import {
  dividedBy,
  floor,
  floorPatch,
  fractionFrom,
  fractionText as text,
  oneMinus,
  palette,
  plus,
  Stage,
  sumText,
  THREE,
  times,
  toNumber,
  Visual,
  type Figure,
  type Fraction,
} from "canon";

// Timing, in seconds. The figure goes through six steps, numbered 0 to 5.
const STEP_TIME = 3;
const CHANGE_TIME = 1; // how long a change of color or place takes
const LAST_STEP = 5;

// The square, in floor units. Its back edge is the top of the picture.
const SIDE = 5;
const SQUARE = { left: -4.5, back: -2.5 };
// The bar that the two rectangles line up as.
const BAR = { left: 2, width: 5 };

// A rectangle on the floor: its left and back edges, and its size.
type Box = { left: number; back: number; width: number; depth: number };

export default class AreaSquare extends Visual {
  protected build(figure: Figure): void {
    // What the ::visual line says about the two events.
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The area square needs ${name}="..." on its ::visual line.`);
      return value;
    };
    const first = setting("first");
    const second = setting("second");
    const notFirst = this.getAttribute("not-first") ?? `not ${first}`;
    const notSecond = this.getAttribute("not-second") ?? `not ${second}`;
    const one = this.getAttribute("one") ?? "outcome";
    const firstProbability = fractionFrom(setting("probability"));
    const secondIfFirst = fractionFrom(setting("probability-if-first"));
    const secondIfNotFirst = fractionFrom(setting("probability-if-not"));

    const stage = new Stage(figure, {
      halfWidth: 8.4,
      lookAt: [0.3, 0.2, 0],
      azimuth: 0,
      elevation: 58,
      gridSize: 30,
    });

    // The four rectangles. The strip for the first event is on the left,
    // and in each strip the part for the second event is at the front.
    const pieces = [
      { throughFirst: true, endsInSecond: true },
      { throughFirst: true, endsInSecond: false },
      { throughFirst: false, endsInSecond: true },
      { throughFirst: false, endsInSecond: false },
    ].map((piece) => {
      const width = piece.throughFirst ? firstProbability : oneMinus(firstProbability);
      const secondHere = piece.throughFirst ? secondIfFirst : secondIfNotFirst;
      const height = piece.endsInSecond ? secondHere : oneMinus(secondHere);
      const widthOnFloor = SIDE * toNumber(width);
      const depthOnFloor = SIDE * toNumber(height);
      const inSquare: Box = {
        left: SQUARE.left + (piece.throughFirst ? 0 : SIDE * toNumber(firstProbability)),
        back: SQUARE.back + (piece.endsInSecond ? SIDE - depthOnFloor : 0),
        width: widthOnFloor,
        depth: depthOnFloor,
      };
      const patch = floorPatch({ x: 0, y: 0 }, { width: 1, depth: 1 }, { color: palette.muted, opacity: 0.35 });
      stage.scene.add(patch);
      return { ...piece, width, height, area: times(width, height), inSquare, patch };
    });
    const [firstAndSecond, , secondOnly] = pieces;

    const eitherArea = plus(firstAndSecond.area, secondOnly.area);
    const answer = dividedBy(firstAndSecond.area, eitherArea);

    // In the bar, each of the two rectangles keeps its area. The bar is as
    // deep as it needs to be to hold both areas in its fixed width.
    const barDepth = (SIDE * SIDE * toNumber(eitherArea)) / BAR.width;
    const firstShareOfBar = BAR.width * toNumber(answer);
    const inBar = new Map<object, Box>([
      [firstAndSecond, { left: BAR.left, back: -barDepth / 2, width: firstShareOfBar, depth: barDepth }],
      [secondOnly, { left: BAR.left + firstShareOfBar, back: -barDepth / 2, width: BAR.width - firstShareOfBar, depth: barDepth }],
    ]);

    // Labels. Each is placed once, and shown from a certain step on.
    const labelFrom = (step: number, html: string, x: number, y: number) => {
      const label = stage.label(html);
      label.position.copy(floor(x, y));
      return { label, step };
    };
    const firstStripMiddle = SQUARE.left + (SIDE * toNumber(firstProbability)) / 2;
    const otherStripMiddle = SQUARE.left + SIDE * toNumber(firstProbability) + (SIDE * (1 - toNumber(firstProbability))) / 2;
    const labels = [
      labelFrom(0, `every ${one}`, SQUARE.left + SIDE / 2, SQUARE.back + SIDE + 0.9),
      labelFrom(1, `${first}<br><b>${text(firstProbability)}</b>`, firstStripMiddle - 0.6, SQUARE.back - 0.1),
      labelFrom(1, `${notFirst}<br><b>${text(oneMinus(firstProbability))}</b>`, otherStripMiddle + 0.4, SQUARE.back - 0.1),
      labelFrom(5, `${first}<br><b>${text(answer)}</b>`, BAR.left + firstShareOfBar / 2, -barDepth / 2 - 0.1),
      labelFrom(5, `${notFirst}<br><b>${text(oneMinus(answer))}</b>`, BAR.left + firstShareOfBar + (BAR.width - firstShareOfBar) / 2, -barDepth / 2 - 0.1),
      labelFrom(5, `every ${one}: ${second}`, BAR.left + BAR.width / 2, barDepth / 2 + 0.9),
    ];
    // One label per rectangle: the name and height of its cut, and then
    // its area. The labels of the left strip sit outside the square,
    // because the strip can be too thin to hold them.
    const pieceLabels = pieces.map((piece) => {
      const label = stage.label("");
      const middle = piece.inSquare.back + piece.inSquare.depth / 2;
      if (piece.throughFirst) label.position.copy(floor(SQUARE.left - 1.9, middle + 0.35));
      else label.position.copy(floor(piece.inSquare.left + piece.inSquare.width / 2, middle + 0.35));
      return label;
    });

    let time = 0;
    figure.button("Replay", () => {
      time = 0;
    });
    figure.caption(
      `The width of a strip is the probability of the first step. The height of a rectangle ` +
        `is the probability of the second step, given the first. The area of a rectangle is ` +
        `the probability of both.`,
    );

    stage.onFrame = (seconds) => {
      time += seconds;
      const step = Math.min(Math.floor(time / STEP_TIME), LAST_STEP);
      // How far the change that starts at `startStep` has gone, from 0 to 1.
      const changed = (startStep: number) =>
        THREE.MathUtils.clamp((time - startStep * STEP_TIME) / CHANGE_TIME, 0, 1);

      pieces.forEach((piece, index) => {
        const material = piece.patch.material as THREE.MeshBasicMaterial;

        // Step 1 colors the strip of the first event. Step 2 makes the
        // rectangles of the second event strong. Step 4 fades the others.
        material.color.set(step >= 1 && piece.throughFirst ? palette.red : palette.muted);
        const strong = piece.endsInSecond ? 0.9 : 0.3;
        const faded = piece.endsInSecond ? 0.9 : 0.07;
        material.opacity = mix(mix(0.35, strong, changed(2)), faded, changed(4));

        // Step 5 moves the rectangles of the second event into the bar.
        const barBox = inBar.get(piece);
        place(piece.patch, barBox ? mixBox(piece.inSquare, barBox, smooth(changed(5))) : piece.inSquare);

        const cut = piece.endsInSecond ? second : notSecond;
        const label = pieceLabels[index];
        label.shown = step >= 2 && (step < 4 || piece.endsInSecond) && step < 5;
        label.element.innerHTML =
          step < 3
            ? `${cut}<br><b>${text(piece.height)}</b>`
            : `${cut}<br><b>${text(piece.width)} &times; ${text(piece.height)} = ${text(piece.area)}</b>`;
      });

      for (const { label, step: firstStep } of labels) label.shown = step >= firstStep && changedEnough(step, firstStep, changed);

      figure.readout(
        [
          `The square is every ${one}. Its area is 1.`,
          `We cut it by width: ${first}, or ${notFirst}.`,
          `We cut each strip by height: ${second}, or ${notSecond}.`,
          "The area of each rectangle is its width times its height.",
          `The two "${second}" rectangles together: <b>${text(firstAndSecond.area)} + ${text(secondOnly.area)} = ${sumText(firstAndSecond.area, secondOnly.area)}</b>`,
          `The share of that area that is "${first}": <b>${text(firstAndSecond.area)} &divide; ${sumText(firstAndSecond.area, secondOnly.area)} = ${text(answer)}</b>`,
        ][step],
      );
    };
  }
}

// The labels of the bar wait until the rectangles have arrived in it.
function changedEnough(step: number, firstStep: number, changed: (step: number) => number): boolean {
  return firstStep < LAST_STEP || (step === LAST_STEP && changed(LAST_STEP) === 1);
}

// Puts a 1 by 1 patch over a box on the floor.
function place(patch: THREE.Mesh, box: Box): void {
  patch.scale.set(box.width, 1, box.depth);
  patch.position.x = box.left + box.width / 2;
  patch.position.z = box.back + box.depth / 2;
}

function mix(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function mixBox(from: Box, to: Box, amount: number): Box {
  return {
    left: mix(from.left, to.left, amount),
    back: mix(from.back, to.back, amount),
    width: mix(from.width, to.width, amount),
    depth: mix(from.depth, to.depth, amount),
  };
}

// Starts and ends a movement gently.
function smooth(amount: number): number {
  return amount * amount * (3 - 2 * amount);
}
