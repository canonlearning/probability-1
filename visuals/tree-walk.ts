// A probability tree with two stages, built up one step at a time. Made
// for a slide: it is a flat drawing with large type.
//
// The steps: the first branches, the second branches on each side, the
// product along each path, the two paths that end in the second event,
// the one of them that goes through the first event, and the answer to
// the backward question (the first event, given the second).
//
//   ::visual{name="tree-walk"
//     first="rain" not-first="dry" probability="3/10"
//     second="late" not-second="on time"
//     probability-if-first="1/2" probability-if-not="1/10"}

import {
  dividedBy,
  fractionFrom,
  fractionText,
  ink,
  oneMinus,
  percentText,
  plus,
  stackedFraction,
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
const ROOT = { x: 70, y: 350 };
const MIDDLE_X = 400;
const LEAF_X = 740;
const MIDDLE_Y = [190, 510]; // the first event, then not
const LEAF_Y = [100, 280, 420, 600]; // the four paths, top to bottom
const PANEL_X = 1385; // the middle of the space right of the tree

const LAST_STEP = 6;

export default class TreeWalk extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The tree walk needs ${name}="..." on its ::visual line.`);
      return value;
    };
    const first = setting("first");
    const notFirst = setting("not-first");
    const second = setting("second");
    const notSecond = setting("not-second");
    const pFirst = fractionFrom(setting("probability"));
    const pSecondIfFirst = fractionFrom(setting("probability-if-first"));
    const pSecondIfNot = fractionFrom(setting("probability-if-not"));

    // The two first branches, and the four paths from top to bottom.
    const firstBranches = [
      { name: first, probability: pFirst },
      { name: notFirst, probability: oneMinus(pFirst) },
    ];
    const paths = [
      { side: 0, name: second, probability: pSecondIfFirst, endsInSecond: true },
      { side: 0, name: notSecond, probability: oneMinus(pSecondIfFirst), endsInSecond: false },
      { side: 1, name: second, probability: pSecondIfNot, endsInSecond: true },
      { side: 1, name: notSecond, probability: oneMinus(pSecondIfNot), endsInSecond: false },
    ].map((path) => ({ ...path, product: times(firstBranches[path.side].probability, path.probability) }));

    const both = paths[0].product;
    const secondOtherWay = paths[2].product;
    const pSecond = plus(both, secondOtherWay);
    const answer = dividedBy(both, pSecond);
    const show = fractionText;

    const captions = [
      `First: ${first} or ${notFirst}.`,
      `After "${first}": ${second} with probability ${show(pSecondIfFirst)}.`,
      `After "${notFirst}": ${second} with probability ${show(pSecondIfNot)}.`,
      `Multiply along each path. The four products add to 1.`,
      `"${second}" happens on two paths. Add them.`,
      `Only one of those two paths goes through "${first}".`,
      `Given "${second}": the share of it that is "${first}".`,
    ];

    const drawingAt = (step: number): string => {
      // The color of a path's second branch and of its end, at this step.
      const colorOf = (pathIndex: number) => {
        if (step < 4) return ink.text;
        if (step >= 5 && pathIndex === 0) return ink.red;
        return paths[pathIndex].endsInSecond ? ink.blue : ink.faint;
      };
      // A first branch takes the strongest color of the paths through it.
      const firstBranchColor = (side: number) => {
        if (step < 4) return ink.text;
        if (side === 0 && step >= 5) return ink.red;
        return ink.blue;
      };
      const line = (from: { x: number; y: number }, to: { x: number; y: number }, color: string, isNew: boolean) =>
        `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="${color}" stroke-width="5"` +
        ` stroke-linecap="round"${isNew ? ' class="new"' : ""}/>`;
      const dot = (at: { x: number; y: number }, color: string) =>
        `<circle cx="${at.x}" cy="${at.y}" r="11" fill="${color}"/>`;
      const parts: string[] = [];

      firstBranches.forEach((branch, side) => {
        const end = { x: MIDDLE_X, y: MIDDLE_Y[side] };
        const color = firstBranchColor(side);
        const above = side === 0 ? -22 : 52;
        parts.push(line(ROOT, end, color, step === 0));
        parts.push(dot(end, color));
        parts.push(
          textAt((ROOT.x + end.x) / 2 - 20, (ROOT.y + end.y) / 2 + above, show(branch.probability), {
            size: 36,
            fill: color,
            bold: true,
          }),
        );
        parts.push(textAt(end.x, end.y + (side === 0 ? -30 : 58), branch.name, { size: 34, fill: color }));
      });
      parts.push(dot(ROOT, ink.text));

      paths.forEach((path, pathIndex) => {
        const isShown = step >= (path.side === 0 ? 1 : 2);
        if (!isShown) return;
        const isNew = step === (path.side === 0 ? 1 : 2);
        const start = { x: MIDDLE_X, y: MIDDLE_Y[path.side] };
        const end = { x: LEAF_X, y: LEAF_Y[pathIndex] };
        const color = colorOf(pathIndex);
        const goesUp = end.y < start.y;
        parts.push(line(start, end, color, isNew));
        parts.push(dot(end, color));
        parts.push(
          textAt((start.x + end.x) / 2, (start.y + end.y) / 2 + (goesUp ? -20 : 50), show(path.probability), {
            size: 36,
            fill: color,
            bold: true,
            isNew,
          }),
        );
        parts.push(textAt(end.x + 30, end.y - 8, path.name, { size: 34, fill: color, anchor: "start", isNew }));
        if (step >= 3) {
          const product =
            `${show(firstBranches[path.side].probability)} × ${show(path.probability)} = ${show(path.product)}`;
          parts.push(
            textAt(end.x + 30, end.y + 36, product, { size: 34, fill: color, anchor: "start", bold: true, isNew: step === 3 }),
          );
        }
      });

      // Right of the tree: the sum of the two paths, then the answer.
      if (step >= 4) {
        parts.push(textAt(PANEL_X, 130, `P(${second})`, { size: 36, fill: ink.muted, isNew: step === 4 }));
        parts.push(
          textAt(PANEL_X, 195, `${show(both)} + ${show(secondOtherWay)} = ${show(pSecond)}`, {
            size: 44,
            fill: ink.blue,
            bold: true,
            isNew: step === 4,
          }),
        );
      }
      if (step === LAST_STEP) {
        parts.push(textAt(PANEL_X, 320, `P(${first}, given ${second})`, { size: 36, fill: ink.muted, isNew: true }));
        parts.push(
          stackedFraction(
            PANEL_X - 130,
            440,
            { words: show(both), fill: ink.red },
            { words: show(pSecond), fill: ink.blue },
            { size: 56, isNew: true },
          ),
        );
        parts.push(
          textAt(PANEL_X - 15, 460, `= ${show(answer)}`, { size: 56, bold: true, anchor: "start", isNew: true }),
        );
        parts.push(textAt(PANEL_X, 600, `≈ ${percentOf(answer)}`, { size: 52, fill: ink.muted, isNew: true }));
      }

      parts.push(textAt(WIDTH / 2, HEIGHT - 40, captions[step], { size: 38, isNew: true }));
      return parts.join("");
    };

    const box = figure.flatBox();
    figure.steps(LAST_STEP + 1, (step) => {
      box.innerHTML = svg(WIDTH, HEIGHT, drawingAt(step));
    });
  }
}

function percentOf(fraction: Fraction): string {
  return percentText(fraction.top, fraction.bottom);
}
