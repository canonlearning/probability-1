// A probability tree with one first branch for each of several cases,
// built up one step at a time. Made for a slide: it is a flat drawing with
// large type.
//
// The steps: the cases, the second branches, the product along each path
// that ends in the event, the sum of those products, and each product as a
// share of the sum.
//
//   ::visual{name="case-tree" cases="north, middle, south"
//     shares="2/5, 2/5, 1/5" rates="1/10, 1/1, 1/1"
//     event="nothing" not-event="found" highlight="1"}
//
// `shares` are the probabilities of the cases and `rates` the
// probabilities of the event in each case. A second branch that has
// probability 0 is not drawn. `highlight` is the case drawn in red at the
// last step.

import {
  fractionFrom,
  fractionText,
  ink,
  oneMinus,
  percentText,
  plus,
  svg,
  textAt,
  times,
  Visual,
  type Figure,
  type Fraction,
} from "canon";

const WIDTH = 1600;
const HEIGHT = 780;

// Where the tree's points are, in the units of the drawing.
const ROOT = { x: 60, y: 345 };
const MIDDLE_X = 350;
const LEAF_X = 640;
const TREE_TOP = 120; // the height of the first case
const TREE_BOTTOM = 570; // the height of the last case
const LEAF_SPREAD = 58; // how far a case's two second branches are apart, each way
const PANEL_X = 1330; // the middle of the space right of the tree

const LAST_STEP = 4;

export default class CaseTree extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The case tree needs ${name}="..." on the ::visual line.`);
      return value;
    };
    const list = (name: string) => setting(name).split(",").map((item) => item.trim());
    const names = list("cases");
    const event = setting("event");
    const notEvent = setting("not-event");
    const highlight = Number(this.getAttribute("highlight") ?? names.length) - 1;
    const shares = list("shares").map(fractionFrom);
    const rates = list("rates").map(fractionFrom);

    const products = shares.map((share, index) => times(share, rates[index]));
    const total = products.reduce(plus);
    const written = overOneBottom([...products, total]);
    const productText = written.slice(0, -1);
    const totalText = written.at(-1)!;
    const totalTop = totalText.split("/")[0];
    const show = fractionText;

    const captions = [
      `First: which case it is. Exactly one of them happens.`,
      `Then: "${event}" or "${notEvent}", with a probability that depends on the case.`,
      `Multiply along each path that ends in "${event}".`,
      `"${event}" happens on ${names.length} paths, and never on two at once. Add them.`,
      `Given "${event}": each path as a share of the sum.`,
    ];

    const drawingAt = (step: number): string => {
      const parts: string[] = [];
      const line = (from: { x: number; y: number }, to: { x: number; y: number }, color: string, isNew: boolean) =>
        `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="${color}" stroke-width="5"` +
        ` stroke-linecap="round"${isNew ? ' class="new"' : ""}/>`;
      const dot = (at: { x: number; y: number }, color: string) =>
        `<circle cx="${at.x}" cy="${at.y}" r="10" fill="${color}"/>`;
      // The color of a case's path to the event, at this step.
      const eventColor = (index: number) =>
        step < 3 ? ink.text : step === LAST_STEP && index === highlight ? ink.red : ink.blue;

      names.forEach((name, index) => {
        const middle = { x: MIDDLE_X, y: TREE_TOP + (index * (TREE_BOTTOM - TREE_TOP)) / (names.length - 1) };
        const color = eventColor(index);
        parts.push(line(ROOT, middle, color, step === 0));
        parts.push(dot(middle, color));
        parts.push(
          textAt((ROOT.x + middle.x) / 2 - (middle.y === ROOT.y ? 0 : 50), (ROOT.y + middle.y) / 2 + (middle.y > ROOT.y ? 58 : -16), show(shares[index]), {
            size: 36,
            fill: color,
            bold: true,
          }),
        );
        // The name is above its point, or below it on a branch that goes down.
        parts.push(textAt(middle.x, middle.y + (middle.y > ROOT.y ? 52 : -26), name, { size: 34, fill: color }));
        if (step < 1) return;

        // The second branches: the event above, and not the event below. A
        // case with only one of them has it straight ahead.
        const rate = rates[index];
        const hasBoth = rate.top !== 0 && rate.top !== rate.bottom;
        const branches = [
          { words: event, probability: rate, isEvent: true, y: middle.y - (hasBoth ? LEAF_SPREAD : 0) },
          { words: notEvent, probability: oneMinus(rate), isEvent: false, y: middle.y + (hasBoth ? LEAF_SPREAD : 0) },
        ].filter((branch) => branch.probability.top !== 0);
        for (const branch of branches) {
          const end = { x: LEAF_X, y: branch.y };
          const branchColor = branch.isEvent ? color : step < 3 ? ink.text : ink.faint;
          parts.push(line(middle, end, branchColor, step === 1));
          parts.push(dot(end, branchColor));
          parts.push(
            textAt((middle.x + end.x) / 2 + 25, (middle.y + end.y) / 2 + (end.y > middle.y ? 46 : -18), show(branch.probability), {
              size: 34,
              fill: branchColor,
              bold: true,
              isNew: step === 1,
            }),
          );
          const product = `${show(shares[index])} × ${show(rate)} = ${productText[index]}`;
          const words = branch.isEvent && step >= 2 ? `${branch.words}:  ${product}` : branch.words;
          parts.push(
            textAt(end.x + 26, end.y + 12, words, {
              size: 34,
              fill: branchColor,
              anchor: "start",
              bold: branch.isEvent && step >= 2,
              isNew: step === 1 || (step === 2 && branch.isEvent),
            }),
          );
        }
      });
      parts.push(dot(ROOT, ink.text));

      // Right of the tree: the sum of the paths, then each path over it.
      if (step === 3) {
        parts.push(textAt(PANEL_X, 250, `P(${event})`, { size: 38, fill: ink.muted, isNew: true }));
        parts.push(textAt(PANEL_X, 325, productText.join(" + "), { size: 40, fill: ink.blue, bold: true, isNew: true }));
        parts.push(textAt(PANEL_X, 400, `= ${totalText}`, { size: 52, fill: ink.blue, bold: true, isNew: true }));
      }
      if (step === LAST_STEP) {
        parts.push(textAt(PANEL_X, 150, `given "${event}"`, { size: 38, fill: ink.muted, isNew: true }));
        names.forEach((name, index) => {
          const fill = index === highlight ? ink.red : ink.text;
          const top = productText[index].split("/")[0];
          const y = 250 + index * 110;
          parts.push(textAt(PANEL_X - 40, y, name, { size: 40, fill, anchor: "end", isNew: true }));
          parts.push(
            textAt(PANEL_X, y, `${top}/${totalTop}${index === highlight ? ` ≈ ${percentText(Number(top), Number(totalTop))}` : ""}`, { size: 46, fill, bold: true, anchor: "start", isNew: true }),
          );
        });
      }

      parts.push(textAt(WIDTH / 2, HEIGHT - 35, captions[step], { size: 38, isNew: true }));
      return parts.join("");
    };

    const box = figure.flatBox();
    figure.steps(LAST_STEP + 1, (step) => {
      box.innerHTML = svg(WIDTH, HEIGHT, drawingAt(step));
    });
  }
}

// Writes fractions over one bottom, the smallest that fits them all: 1/25,
// 2/5, and 1/5 become 1/25, 10/25, and 5/25.
function overOneBottom(fractions: Fraction[]): string[] {
  const greatestCommonDivisor = (a: number, b: number): number => (b === 0 ? a : greatestCommonDivisor(b, a % b));
  const bottom = fractions.reduce((common, fraction) => (common * fraction.bottom) / greatestCommonDivisor(common, fraction.bottom), 1);
  return fractions.map((fraction) => `${(fraction.top * bottom) / fraction.bottom}/${bottom}`);
}
