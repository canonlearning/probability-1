// Two tosses of a coin as a tree, and d'Alembert's count of "at least one
// heads". Made for a slide: it is a flat drawing with large type.
//
// The tree has four leaves, each with probability 1/4, and three of them
// have heads. d'Alembert stopped the game at the first heads, which joins
// the leaves HH and HT into one outcome "H", and counted 2 outcomes of 3.
// His three outcomes are not equally likely: "H" is two of the four.
//
// The steps: the first toss, the second toss, the three leaves with heads,
// d'Alembert's three outcomes, his count, and the weight of each of his
// outcomes.
//
//   ::visual{name="toss-tree"}

import { ink, svg, textAt, Visual, type Figure } from "canon";

const WIDTH = 1600;
const HEIGHT = 780;

// Where the tree's points are, in the units of the drawing.
const ROOT = { x: 70, y: 335 };
const MIDDLE_X = 330;
const LEAF_X = 620;
const FIRST_TOSSES = [
  { name: "H", y: 175 },
  { name: "T", y: 495 },
];
// `first` is the leaf's first toss, as a place in FIRST_TOSSES.
const LEAVES = [
  { name: "HH", first: 0, y: 95, hasHeads: true },
  { name: "HT", first: 0, y: 255, hasHeads: true },
  { name: "TH", first: 1, y: 415, hasHeads: true },
  { name: "TT", first: 1, y: 575, hasHeads: false },
];
const QUARTER_X = 745; // the left edge of the "1/4" beside each leaf
const BRACKET_X = 850; // the bracket that joins HH and HT
const PANEL_X = 1340; // the middle of the space right of the tree

// d'Alembert's outcomes, top to bottom in the panel, each with its weight.
const HIS_OUTCOMES = [
  { name: "H", weight: "2/4", hasHeads: true },
  { name: "TH", weight: "1/4", hasHeads: true },
  { name: "TT", weight: "1/4", hasHeads: false },
];

const LAST_STEP = 5;

const CAPTIONS = [
  "The first toss: heads or tails.",
  "The second toss. Four outcomes, each as likely as any other.",
  "At least one heads: 3 of the 4 outcomes.",
  "d'Alembert: the game stops at the first heads. Three outcomes.",
  "He counted: 2 of the 3 outcomes have heads.",
  "H is two of the four equally likely outcomes. The answer is 3/4.",
];

type Point = { x: number; y: number };

export default class TossTree extends Visual {
  protected build(figure: Figure): void {
    const drawingAt = (step: number): string => {
      const parts: string[] = [];
      const line = (from: Point, to: Point, color: string, isNew: boolean) =>
        `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="${color}" stroke-width="5"` +
        ` stroke-linecap="round"${isNew ? ' class="new"' : ""}/>`;
      const dot = (at: Point, color: string) => `<circle cx="${at.x}" cy="${at.y}" r="10" fill="${color}"/>`;

      // From step 3 on, the game stops at a first H.
      const gameStops = step >= 3;
      // The color of d'Alembert's outcomes that have heads: red while he
      // counts them, blue when they are weighed.
      const hisHeadsColor = step === 4 ? ink.red : step === LAST_STEP ? ink.blue : ink.text;

      // The first toss. H is written above its point and T below.
      FIRST_TOSSES.forEach((toss, index) => {
        const middle = { x: MIDDLE_X, y: toss.y };
        const isUpper = index === 0;
        parts.push(line(ROOT, middle, ink.text, step === 0));
        parts.push(dot(middle, ink.text));
        parts.push(textAt(170, isUpper ? 232 : 462, "1/2", { size: 36, bold: true, isNew: step === 0 }));
        parts.push(textAt(middle.x, middle.y + (isUpper ? -28 : 58), toss.name, { size: 48, isNew: step === 0 }));
      });
      parts.push(dot(ROOT, ink.text));

      // The second toss: the four leaves, with "1/4" beside each.
      if (step >= 1) {
        LEAVES.forEach((leaf, index) => {
          const middle = { x: MIDDLE_X, y: FIRST_TOSSES[leaf.first].y };
          const end = { x: LEAF_X, y: leaf.y };
          const isUpper = index % 2 === 0;
          // The two branches after a first H are not played once the game stops.
          const notPlayed = gameStops && leaf.first === 0;
          let leafColor = ink.text;
          if (step === 2 && leaf.hasHeads) leafColor = ink.blue;
          if (notPlayed) leafColor = ink.muted;
          if (gameStops && leaf.name === "TH") leafColor = hisHeadsColor;
          const branchColor = notPlayed ? ink.faint : ink.text;

          parts.push(line(middle, end, branchColor, step === 1));
          parts.push(dot(end, notPlayed ? ink.faint : leafColor));
          parts.push(
            textAt(465, (middle.y + end.y) / 2 + (isUpper ? -23 : 50), "1/2", {
              size: 36,
              fill: notPlayed ? ink.muted : ink.text,
              bold: true,
              isNew: step === 1,
            }),
          );
          parts.push(textAt(end.x + 28, end.y + 16, leaf.name, { size: 46, fill: leafColor, anchor: "start", bold: true, isNew: step === 1 }));
          // At the last step, the three 1/4 that make 3/4 are blue.
          const isWeighed = step === LAST_STEP && leaf.hasHeads;
          parts.push(
            textAt(QUARTER_X, end.y + 14, "1/4", {
              size: 38,
              fill: isWeighed ? ink.blue : ink.muted,
              anchor: "start",
              bold: isWeighed,
              isNew: step === 1,
            }),
          );
        });
        // The first point of the H branches is drawn again, over their faint lines.
        parts.push(dot({ x: MIDDLE_X, y: FIRST_TOSSES[0].y }, ink.text));
      }

      // The bracket that joins HH and HT into d'Alembert's outcome "H".
      if (gameStops) {
        const top = LEAVES[0].y - 30;
        const bottom = LEAVES[1].y + 30;
        const isNew = step === 3;
        parts.push(
          `<path d="M ${BRACKET_X - 20} ${top} H ${BRACKET_X} V ${bottom} H ${BRACKET_X - 20}" fill="none"` +
            ` stroke="${hisHeadsColor}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"${isNew ? ' class="new"' : ""}/>`,
        );
        parts.push(textAt(BRACKET_X + 30, 200, "H", { size: 84, fill: hisHeadsColor, anchor: "start", bold: true, isNew }));
        parts.push(textAt(BRACKET_X + 30, 252, "stops here", { size: 32, fill: ink.muted, anchor: "start", isNew }));
      }

      // Right of the tree, at step 2: the count over the four leaves.
      if (step === 2) {
        parts.push(textAt(PANEL_X, 290, "at least one heads", { size: 40, fill: ink.muted, isNew: true }));
        parts.push(textAt(PANEL_X, 410, "3 of 4", { size: 96, fill: ink.blue, bold: true, isNew: true }));
      }

      // Right of the tree, from step 3: d'Alembert's three outcomes, then
      // his count, then the weight of each outcome and their sum.
      if (gameStops) {
        parts.push(textAt(PANEL_X, 110, "his three outcomes", { size: 38, fill: ink.muted, isNew: step === 3 }));
        HIS_OUTCOMES.forEach((outcome, index) => {
          const y = 210 + index * 90;
          const fill = outcome.hasHeads ? hisHeadsColor : ink.text;
          parts.push(textAt(PANEL_X - 20, y, outcome.name, { size: 56, fill, anchor: "end", bold: true, isNew: step === 3 }));
          if (step === LAST_STEP) {
            parts.push(textAt(PANEL_X + 30, y, outcome.weight, { size: 56, fill, anchor: "start", bold: true, isNew: true }));
          }
        });
      }
      if (step === 4) {
        parts.push(textAt(PANEL_X, 510, "his answer", { size: 38, fill: ink.muted, isNew: true }));
        parts.push(textAt(PANEL_X, 625, "2 of 3", { size: 96, fill: ink.red, bold: true, isNew: true }));
      }
      if (step === LAST_STEP) {
        parts.push(textAt(PANEL_X, 500, "2/4 + 1/4 = 3/4", { size: 54, fill: ink.blue, bold: true, isNew: true }));
        // His answer, smaller and struck through.
        parts.push(textAt(PANEL_X, 625, "2 of 3", { size: 60, fill: ink.muted }));
        parts.push(line({ x: PANEL_X - 110, y: 605 }, { x: PANEL_X + 110, y: 605 }, ink.muted, true));
      }

      parts.push(textAt(WIDTH / 2, HEIGHT - 35, CAPTIONS[step], { size: 38, isNew: true }));
      return parts.join("");
    };

    const box = figure.flatBox();
    figure.steps(LAST_STEP + 1, (step) => {
      box.innerHTML = svg(WIDTH, HEIGHT, drawingAt(step));
    });
  }
}
