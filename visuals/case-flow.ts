// Several cases and one event, drawn as a stream that splits and joins.
//
// A band flows from left to right, and its thickness is a probability. The
// whole band at the left is every outcome. It splits into one branch for
// each case. At a gate, the part of each branch where the event happens
// leaves the branch as a thin dark band, and the rest of the branch ends.
// The dark bands meet in one stream, whose thickness is the probability of
// the event. Last, the stream is widened to the thickness of the whole
// band, so each case's part of it can be compared with its branch.
//
// The cases and their probabilities are written on the ::visual line:
//
//   ::visual{name="case-flow" one="part" event="defective"
//     cases="machine 1, machine 2, machine 3"
//     shares="3/5, 3/10, 1/10" rates="1/15, 1/10, 1/5" highlight="3"}
//
// `shares` are the probabilities of the cases and `rates` the probabilities
// of the event in each case. `highlight` is the case drawn in red.
// `until="sum"` stops when the dark bands have met, and `from="sum"` starts
// there.

import {
  dividedBy,
  floor,
  fractionFrom,
  fractionText,
  palette,
  plus,
  Stage,
  THREE,
  times,
  toNumber,
  Visual,
  type Figure,
  type Fraction,
} from "canon";

// Timing, in seconds: when each of the six steps, numbered 0 to 5, starts.
// Step 3 is longer, because it shows one product for each case to read.
const STEP_STARTS = [0, 3, 6.5, 10.5, 16, 20];
const GROW_TIME = 1.6; // how long a band takes to grow to its full length

// Places, in floor units. A band runs from left to right, and the back of
// the scene is the top of the picture. A band of probability 1 is this
// thick:
const WHOLE = 6;
const CENTER = -0.7; // the middle of the whole band, from back to front
const BRANCH_GAP = 0.6;
// Where each stretch of the stream starts, from left to right.
const X = { start: -7.7, split: -6.4, branches: -5, gate: -1.5, rest: 0.2, meet: 1.3, widen: 2.3, wide: 4.6, end: 7.5 };
const SEAM = 0.05; // left between two parts of the widened stream

// One stretch of a band: where it starts and ends, and the back edge and
// thickness it has at each end.
type Stretch = { from: number; to: number; backs: [number, number]; thick: [number, number] };

export default class CaseFlow extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The case flow needs ${name}="..." on the ::visual line.`);
      return value;
    };
    const list = (name: string) => setting(name).split(",").map((item) => item.trim());
    const names = list("cases");
    const event = setting("event");
    const one = this.getAttribute("one") ?? "outcome";
    const highlight = Number(this.getAttribute("highlight") ?? names.length) - 1;
    const firstStep = this.getAttribute("from") === "sum" ? 4 : 0;
    const lastStep = this.getAttribute("until") === "sum" ? 4 : 5;

    const shares = list("shares").map(fractionFrom);
    const rates = list("rates").map(fractionFrom);
    if (shares.length !== names.length || rates.length !== names.length) {
      throw new Error("The case flow needs one share and one rate for each case.");
    }
    const products = shares.map((share, index) => times(share, rates[index]));
    const total = products.reduce(plus);
    const posteriors = products.map((product) => dividedBy(product, total));
    const productText = overOneBottom(products);
    const totalText = overOneBottom([...products, total]).at(-1)!;
    const posteriorText = overOneBottom(posteriors);

    const stage = new Stage(figure, { halfWidth: 8.3, lookAt: [0, -0.5, 0], azimuth: 0, elevation: 58, gridSize: 0 });

    // A band is added to the scene with the step at which it grows.
    const bands: { mesh: THREE.Mesh; step: number; faint?: boolean }[] = [];
    const add = (step: number, stretch: Stretch, color: number, opacity: number, height: number, faint = false) => {
      const mesh = band(stretch, color, opacity, height);
      stage.scene.add(mesh);
      bands.push({ mesh, step, faint });
    };
    const straight = (from: number, to: number, back: number, thick: number): Stretch => ({
      from,
      to,
      backs: [back, back],
      thick: [thick, thick],
    });

    const wholeBack = CENTER - WHOLE / 2;
    add(0, straight(X.start, X.split, wholeBack, WHOLE), palette.muted, 0.32, 0.01);

    // Where each case's band is, from back to front, in four places: in
    // the whole band, as a branch, in the stream of the event, and in the
    // widened stream.
    const branchesBack = CENTER - (WHOLE + (names.length - 1) * BRANCH_GAP) / 2;
    const streamBack = CENTER - (WHOLE * toNumber(total)) / 2;
    let inWhole = wholeBack;
    let branch = branchesBack;
    let inStream = streamBack;
    let inWide = wholeBack;
    const labelPlaces = names.map((_, index) => {
      const color = index === highlight ? palette.red : palette.muted;
      const strong = index === highlight ? palette.red : palette.dark;
      const thick = WHOLE * toNumber(shares[index]);
      const part = WHOLE * toNumber(products[index]);
      const wide = WHOLE * toNumber(posteriors[index]);
      const partBack = branch + thick - part;

      // Step 1: the whole band splits, and the branch runs to the gate.
      add(1, { from: X.split, to: X.branches, backs: [inWhole, branch], thick: [thick, thick] }, color, 0.32, 0.01);
      add(1, straight(X.branches, X.gate, branch, thick), color, 0.32, 0.01);
      // Step 2: past the gate, the rest of the branch runs on a little and
      // ends, and the event's part bends away to where the parts meet.
      add(2, straight(X.gate, X.rest, branch, thick - part), color, 0.32, 0.01, true);
      add(2, { from: X.gate, to: X.meet, backs: [partBack, inStream], thick: [part, part] }, strong, 0.95, 0.03);
      // Step 4: the parts run on together as one stream.
      add(4, straight(X.meet, X.widen, inStream, part), strong, 0.95, 0.03);
      // Step 5: the stream widens to the thickness of the whole band.
      add(5, { from: X.widen, to: X.wide, backs: [inStream, inWide], thick: [part, wide - SEAM] }, strong, 0.95, 0.03);
      add(5, straight(X.wide, X.end, inWide, wide - SEAM), strong, 0.95, 0.03);

      const places = {
        branch: floor(X.branches + 0.9, branch + thick / 2 + 0.4),
        gate: floor(X.gate - 1, partBack - 0.05),
        wide: floor((X.wide + X.end) / 2, inWide + wide / 2 + 0.4),
      };
      inWhole += thick;
      branch += thick + BRANCH_GAP;
      inStream += part;
      inWide += wide;
      return places;
    });

    const wholeLabel = stage.label(`every ${one}<br><b>1</b>`);
    wholeLabel.position.copy(floor((X.start + X.split) / 2, CENTER + 0.4));
    const branchLabels = names.map((name, index) => {
      const label = stage.label(`${name}<br><b>${fractionText(shares[index])}</b>`);
      label.position.copy(labelPlaces[index].branch);
      return label;
    });
    const gateLabels = labelPlaces.map((places) => {
      const label = stage.label("");
      label.position.copy(places.gate);
      return label;
    });
    const streamLabel = stage.label(`<b>${event}</b><br>${totalText}`);
    streamLabel.position.copy(floor((X.meet + X.widen) / 2, streamBack - 0.1));
    const wideLabels = names.map((name, index) => {
      const label = stage.label(`${name}<br><b>${posteriorText[index]}</b>`);
      label.position.copy(labelPlaces[index].wide);
      return label;
    });
    const givenLabel = stage.label(`given <b>${event}</b>`);
    givenLabel.position.copy(floor((X.wide + X.end) / 2, wholeBack + WHOLE + 0.75));

    // The clock of the figure starts at its first step.
    const timeline = figure.timeline(
      STEP_STARTS.slice(firstStep, lastStep + 1).map((start) => start - STEP_STARTS[firstStep]),
    );
    figure.button("Replay", () => {
      timeline.restart();
    });
    figure.caption(
      `The thickness of a band is a probability. The band at the left stands for every ${one}, and each ` +
        `branch is one case. The dark band that leaves a branch is "${event}" in that case. ` +
        `${capitalized(names[highlight])} is red.`,
    );

    stage.onFrame = (seconds) => {
      const time = STEP_STARTS[firstStep] + timeline.advance(seconds);
      const step = Math.min(STEP_STARTS.findLastIndex((start) => start <= time), lastStep);
      // How far a band that grows in `growStep` has grown, from 0 to 1. A
      // figure that starts at a later step shows the earlier bands whole.
      const grown = (growStep: number) => {
        if (growStep > lastStep) return 0;
        if (growStep < firstStep) return 1;
        return THREE.MathUtils.clamp((time - STEP_STARTS[growStep]) / GROW_TIME, 0, 1);
      };

      for (const { mesh, step: growStep, faint } of bands) {
        const triangles = mesh.geometry.index!.count;
        mesh.geometry.setDrawRange(0, 6 * Math.round((triangles / 6) * grown(growStep)));
        // The rest of a branch fades once the event's parts have met.
        if (faint) (mesh.material as THREE.MeshBasicMaterial).opacity = 0.32 - 0.2 * grown(4);
      }

      wholeLabel.shown = true;
      branchLabels.forEach((label) => (label.shown = grown(1) === 1));
      gateLabels.forEach((label, index) => {
        label.shown = grown(2) === 1 && step < 4;
        label.element.innerHTML =
          step < 3
            ? `${event}<br><b>${fractionText(rates[index])}</b>`
            : `${fractionText(shares[index])} &times; ${fractionText(rates[index])}<br><b>= ${productText[index]}</b>`;
      });
      streamLabel.shown = grown(4) === 1;
      wideLabels.forEach((label) => (label.shown = grown(5) === 1));
      givenLabel.shown = grown(5) === 1;

      const chosen = names[highlight];
      figure.readout(
        [
          `The band stands for every ${one}. Its thickness is 1.`,
          `It splits into one branch for each case, as thick as the probability of the case.`,
          `The dark band that leaves each branch is "${event}" in that case.`,
          `The thickness of each dark band is the product of two probabilities.`,
          `The dark bands together: <b>${productText.join(" + ")} = ${totalText}</b>`,
          `Widened to thickness 1, ${chosen}'s share of the stream is <b>${productText[highlight]} &divide; ${totalText} = ${posteriorText[highlight]}</b>`,
        ][step],
      );
    };
  }
}

// A flat band on the floor that runs from left to right along one stretch.
// Its back edge and its thickness change smoothly from one end to the
// other. It is made of many short pieces, so that it can be drawn up to any
// point along its length.
function band(stretch: Stretch, color: number, opacity: number, height: number): THREE.Mesh {
  const PIECES = 40;
  const corners: number[] = [];
  const triangles: number[] = [];
  for (let piece = 0; piece <= PIECES; piece++) {
    const along = piece / PIECES;
    const eased = along * along * (3 - 2 * along);
    const x = stretch.from + (stretch.to - stretch.from) * along;
    const back = stretch.backs[0] + (stretch.backs[1] - stretch.backs[0]) * eased;
    const thick = stretch.thick[0] + (stretch.thick[1] - stretch.thick[0]) * eased;
    corners.push(x, height, back, x, height, back + thick);
    if (piece < PIECES) {
      const corner = 2 * piece;
      triangles.push(corner, corner + 1, corner + 2, corner + 1, corner + 3, corner + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(corners, 3));
  geometry.setIndex(triangles);
  const material = new THREE.MeshBasicMaterial({ color, opacity, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  return mesh;
}

// Writes fractions over one bottom, the smallest that fits them all: 1/25,
// 3/100, and 1/50 become 4/100, 3/100, and 2/100.
function overOneBottom(fractions: Fraction[]): string[] {
  const greatestCommonDivisor = (a: number, b: number): number => (b === 0 ? a : greatestCommonDivisor(b, a % b));
  const bottom = fractions.reduce((common, fraction) => (common * fraction.bottom) / greatestCommonDivisor(common, fraction.bottom), 1);
  return fractions.map((fraction) => `${(fraction.top * bottom) / fraction.bottom}/${bottom}`);
}

function capitalized(words: string): string {
  return words.charAt(0).toUpperCase() + words.slice(1);
}
