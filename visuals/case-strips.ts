// Several cases and one event, drawn as areas, built one step at a time.
//
// A rectangle stands for every outcome, and its area is 1. It is cut by
// width into one strip for each case. The front part of each strip, as deep
// as the probability of the event in that case, is the event. The area of
// that part is the probability of the case and the event together. The
// parts then move out and line up as one bar, whose area is the probability
// of the event, and last the bar is stretched to the width of the
// rectangle, so each case's share of it can be compared with its strip.
//
// The cases and their probabilities are written on the ::visual line:
//
//   ::visual{name="case-strips" one="parcel" event="late"
//     cases="courier 1, courier 2, courier 3"
//     shares="3/5, 3/10, 1/10" rates="1/15, 1/10, 1/5" highlight="3"}
//
// `shares` are the probabilities of the cases and `rates` the probabilities
// of the event in each case. `highlight` is the case drawn in red.
// `until="sum"` stops after the bar is formed, and `from="sum"` starts
// there. `sliders="yes"` shows the last step at once, with sliders for the
// share and the rate of the highlighted case, and writes the numbers as
// percentages.

import {
  dividedBy,
  floor,
  floorPatch,
  fractionFrom,
  fractionText,
  oneMinus,
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

// Timing, in seconds. The figure goes through six steps, numbered 0 to 5,
// and this is when each one starts. Step 3 is longer, because it shows
// three products to read.
const STEP_STARTS = [0, 3.5, 7, 10.5, 16, 19.5];
const END = 23;
const CHANGE_TIME = 1.2; // how long a change of color or place takes

// The rectangle, in floor units. Its back edge is the top of the picture.
const WIDTH = 9;
const DEPTH = 5;
const LEFT = -WIDTH / 2;
const BACK = -4.9;
const GAP = 0.05; // between two strips
// The bar that the event's parts line up as, in front of the rectangle.
const BAR_BACK = 1.9;
const BAR_DEPTH = 1;

// A rectangle on the floor: its left and back edges, and its size.
type Box = { left: number; back: number; width: number; depth: number };

export default class CaseStrips extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The case strips need ${name}="..." on the ::visual line.`);
      return value;
    };
    const list = (name: string) => setting(name).split(",").map((item) => item.trim());
    const names = list("cases");
    const event = setting("event");
    const one = this.getAttribute("one") ?? "outcome";
    const highlight = Number(this.getAttribute("highlight") ?? names.length) - 1;
    const withSliders = this.getAttribute("sliders") === "yes";
    const firstStep = this.getAttribute("from") === "sum" ? 4 : 0;
    const lastStep = this.getAttribute("until") === "sum" ? 4 : 5;

    const writtenShares = list("shares").map(fractionFrom);
    let shares = writtenShares;
    let rates = list("rates").map(fractionFrom);
    if (shares.length !== names.length || rates.length !== names.length) {
      throw new Error("The case strips need one share and one rate for each case.");
    }

    const stage = new Stage(figure, { halfWidth: 7.6, lookAt: [0, -1.9, 0], azimuth: 0, elevation: 58, gridSize: 0 });

    // Each case has three patches: the part of its strip where the event
    // does not happen, the part where it does, and a faint copy of that
    // part, which stays in the strip when the part moves to the bar.
    const patches = names.map((_, index) => {
      const color = index === highlight ? palette.red : palette.muted;
      const patch = (opacity: number) => {
        const mesh = floorPatch({ x: 0, y: 0 }, { width: 1, depth: 1 }, { color, opacity });
        stage.scene.add(mesh);
        return mesh;
      };
      return { rest: patch(0.3), left: patch(0.3), part: patch(0.3) };
    });

    const title = stage.label(`every ${one}`);
    title.position.copy(floor(0, BACK - 0.15));
    const barTitle = stage.label("");
    barTitle.position.copy(floor(LEFT - 1.1, BAR_BACK + BAR_DEPTH + 0.1));
    const stripLabels = names.map(() => stage.label(""));
    const partLabels = names.map(() => stage.label(""));
    const barLabels = names.map(() => stage.label(""));

    // The clock of the figure starts at its first step.
    const timeline = figure.timeline(
      STEP_STARTS.slice(firstStep, lastStep + 1).map((start) => start - STEP_STARTS[firstStep]),
    );
    if (withSliders) {
      const percent = (fraction: Fraction) => Math.round(100 * toNumber(fraction));
      figure.slider(
        `Share of ${names[highlight]}`,
        { min: 5, max: 60, step: 5, value: percent(shares[highlight]), format: (value) => `${value}%` },
        (value) => {
          // The other cases keep their sizes in proportion to each other.
          const share = { top: value, bottom: 100 };
          const scale = dividedBy(oneMinus(share), oneMinus(writtenShares[highlight]));
          shares = writtenShares.map((written, index) => (index === highlight ? share : times(written, scale)));
        },
      );
      figure.slider(
        `${capitalized(event)}, given ${names[highlight]}`,
        { min: 5, max: 40, step: 5, value: percent(rates[highlight]), format: (value) => `${value}%` },
        (value) => {
          rates = rates.map((rate, index) => (index === highlight ? { top: value, bottom: 100 } : rate));
        },
      );
    } else {
      figure.button("Replay", () => {
        timeline.restart();
      });
    }
    figure.caption(
      withSliders
        ? `Each strip is one case, and its width is the probability of the case before ` +
            `"${event}" is known. The front of a strip is as deep as the probability of ` +
            `"${event}" in that case. The bar is the same cases given "${event}". ` +
            `${capitalized(names[highlight])} is red.`
        : `Each strip is one case, and its width is the probability of the case. The depth of its ` +
            `dark part is the probability of "${event}" in that case. The area of the dark part is ` +
            `the probability of both. ${capitalized(names[highlight])} is red.`,
    );

    stage.onFrame = (seconds) => {
      const time = withSliders ? END : STEP_STARTS[firstStep] + timeline.advance(seconds);
      const step = Math.min(STEP_STARTS.findLastIndex((start) => start <= time), lastStep);
      // How far the change that starts at `startStep` has gone, from 0 to 1.
      const changed = (startStep: number) =>
        smooth(THREE.MathUtils.clamp((time - STEP_STARTS[startStep]) / CHANGE_TIME, 0, 1));
      const arrived = (startStep: number) => time >= STEP_STARTS[startStep] + CHANGE_TIME;
      // The strips are one plain rectangle until step 1 cuts it.
      const gap = GAP * changed(1);
      // A bar with a narrow part has every second label behind the bar,
      // so that two labels do not cover each other.
      const narrowPart = posteriorsNarrow(shares, rates);

      const areas = shares.map((share, index) => times(share, rates[index]));
      const total = areas.reduce(plus);
      const posteriors = areas.map((area) => dividedBy(area, total));
      // In slider mode numbers are percentages. Otherwise the given
      // fractions are written as given, and the areas and the shares of
      // the bar are written over one bottom, so they can be compared.
      const shareText = shares.map(withSliders ? percentText : fractionText);
      const rateText = rates.map(withSliders ? percentText : fractionText);
      const areaText = withSliders ? areas.map(percentText) : overOneBottom(areas);
      const posteriorText = withSliders ? posteriors.map(percentText) : overOneBottom(posteriors);
      const totalText = withSliders ? percentText(total) : overOneBottom([...areas, total]).at(-1)!;

      let stripLeft = LEFT;
      let barLeft = LEFT;
      let stretchedLeft = LEFT;
      names.forEach((name, index) => {
        const width = WIDTH * toNumber(shares[index]);
        const partDepth = DEPTH * toNumber(rates[index]);
        const inStrip: Box = { left: stripLeft + gap, back: BACK + DEPTH - partDepth, width: width - 2 * gap, depth: partDepth };
        const rest: Box = { left: stripLeft + gap, back: BACK, width: width - 2 * gap, depth: DEPTH - partDepth };

        // In the bar the part keeps its area. Stretched, the bar is as wide
        // as the rectangle, and the part keeps its share of the bar.
        const barWidth = (width * partDepth) / BAR_DEPTH;
        const inBar: Box = { left: barLeft + GAP / 2, back: BAR_BACK, width: barWidth - GAP, depth: BAR_DEPTH };
        const stretchedWidth = WIDTH * toNumber(posteriors[index]);
        const stretched: Box = { left: stretchedLeft + GAP, back: BAR_BACK, width: stretchedWidth - 2 * GAP, depth: BAR_DEPTH };
        const part = mixBox(mixBox(inStrip, inBar, changed(4)), stretched, lastStep === 5 ? changed(5) : 0);

        const { rest: restPatch, left: leftPatch, part: partPatch } = patches[index];
        place(restPatch, rest);
        place(leftPatch, inStrip);
        place(partPatch, part);
        // Step 1 tells the strips apart. Step 2 makes the event's parts dark.
        opacity(restPatch, mix(0.3, index === highlight ? 0.22 : 0.3, changed(1)));
        opacity(partPatch, mix(0.3, 0.92, changed(2)));
        opacity(leftPatch, mix(0, 0.45, changed(4))); // shown once the part has left
        const color = step >= 1 && index === highlight ? palette.red : palette.muted;
        for (const patch of [restPatch, leftPatch]) (patch.material as THREE.MeshBasicMaterial).color.set(color);
        (partPatch.material as THREE.MeshBasicMaterial).color.set(
          step >= 2 && index !== highlight ? palette.dark : color,
        );

        // The label behind the strip: the case and its probability.
        const stripLabel = stripLabels[index];
        stripLabel.position.copy(floor(stripLeft + width / 2, BACK - 0.15));
        stripLabel.shown = step >= 1;
        stripLabel.element.innerHTML = `${name}<br><b>${shareText[index]}</b>`;

        // The label of the event's part, in front of its strip.
        const partLabel = partLabels[index];
        partLabel.position.copy(floor(stripLeft + width / 2, BACK + DEPTH + 1.1));
        partLabel.shown = step >= 2 && (step < 4 || withSliders);
        partLabel.element.innerHTML =
          step === 3
            ? `${shareText[index]} &times; ${rateText[index]}<br><b>= ${areaText[index]}</b>`
            : `${event}<br><b>${rateText[index]}</b>`;

        // The label in front of the part once it is in the bar.
        const barLabel = barLabels[index];
        const stretching = lastStep === 5 && step === 5;
        const labelBox = stretching ? stretched : inBar;
        const behindBar = stretching && narrowPart && index % 2 === 1;
        barLabel.position.copy(
          floor(labelBox.left + labelBox.width / 2, behindBar ? BAR_BACK - 0.05 : BAR_BACK + BAR_DEPTH + 1.15),
        );
        barLabel.shown = stretching ? arrived(5) : step === 4 && arrived(4);
        // A label behind the bar is on one line, to fit between the bar
        // and the labels of the strips.
        barLabel.element.innerHTML = !stretching
          ? `<b>${areaText[index]}</b>`
          : `${name}${behindBar ? " " : "<br>"}<b>${posteriorText[index]}</b>`;

        stripLeft += width;
        barLeft += barWidth;
        stretchedLeft += stretchedWidth;
      });

      title.shown = step === 0;
      barTitle.shown = step >= 4 && arrived(4);
      barTitle.element.innerHTML = step === 5 ? `given<br><b>${event}</b>` : `<b>${event}</b><br>${totalText}`;

      const chosen = names[highlight];
      figure.readout(
        withSliders
          ? `${capitalized(chosen)}: <b>${shareText[highlight]}</b> before, ` +
              `and <b>${posteriorText[highlight]}</b> given "${event}" · ` +
              `"${event}" overall: <b>${totalText}</b>`
          : [
              `The rectangle is every ${one}. Its area is 1.`,
              `We cut it by width: one strip for each case, as wide as its probability.`,
              `The front of each strip is "${event}" in that case.`,
              `The area of each dark part is its width times its depth.`,
              `The dark parts together: <b>${areaText.join(" + ")} = ${totalText}</b>`,
              `${capitalized(chosen)}'s share of the dark area: <b>${areaText[highlight]} &divide; ${totalText} = ${posteriorText[highlight]}</b>`,
            ][step],
      );
    };
  }
}

// Whether some case's share of the stretched bar is too narrow for a label.
function posteriorsNarrow(shares: Fraction[], rates: Fraction[]): boolean {
  const areas = shares.map((share, index) => toNumber(share) * toNumber(rates[index]));
  const total = areas.reduce((sum, area) => sum + area, 0);
  return areas.some((area) => (WIDTH * area) / total < 1.3);
}

// Writes fractions over one bottom, the smallest that fits them all: 1/25,
// 3/100, and 1/50 become 4/100, 3/100, and 2/100.
function overOneBottom(fractions: Fraction[]): string[] {
  const greatestCommonDivisor = (a: number, b: number): number => (b === 0 ? a : greatestCommonDivisor(b, a % b));
  const bottom = fractions.reduce((common, fraction) => (common * fraction.bottom) / greatestCommonDivisor(common, fraction.bottom), 1);
  return fractions.map((fraction) => `${(fraction.top * bottom) / fraction.bottom}/${bottom}`);
}

// A probability as a percentage with at most one decimal place.
function percentText(fraction: Fraction): string {
  return `${Math.round(1000 * toNumber(fraction)) / 10}%`;
}

function capitalized(words: string): string {
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// Puts a 1 by 1 patch over a box on the floor.
function place(patch: THREE.Mesh, box: Box): void {
  patch.scale.set(Math.max(box.width, 0.001), 1, Math.max(box.depth, 0.001));
  patch.position.x = box.left + box.width / 2;
  patch.position.z = box.back + box.depth / 2;
}

function opacity(patch: THREE.Mesh, value: number): void {
  (patch.material as THREE.MeshBasicMaterial).opacity = value;
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
