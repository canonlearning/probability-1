// The share of each of the 26 letters in a text, as a row of bars from a
// to z. Made for a slide: it is a flat drawing with large type.
//
// The steps: the bars as they would be if every letter were equally
// likely, the real shares, and then one step for each event, with the bars
// of the event in blue and the total of their shares at the top right.
//
//   ::visual{name="letter-shares"
//     shares="8.04, 1.48, 3.34, 3.82, 12.49, 2.40, 1.87, 5.05, 7.57, 0.16, 0.54, 4.07, 2.51, 7.23, 7.64, 2.14, 0.12, 6.28, 6.51, 9.28, 2.73, 1.05, 1.68, 0.23, 1.66, 0.09"
//     events="a vowel: a e i o u"}
//
// `shares` are 26 percentages, in the order of the alphabet. An event is
// written as its name, a colon, and its letters with spaces between them,
// and the events have semicolons between them.
//
// There is room for four shares in figures: those of the three tallest
// bars and of the shortest bar. Not supported: two of those four bars side
// by side, where the figures would overlap.

import { ink, svg, textAt, Visual, type Figure } from "canon";

const WIDTH = 1600;
const HEIGHT = 780;

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

// Places, in the units of the drawing.
const TOTAL_Y = 62; // the line that gives the total of an event's shares
const BARS_TOP = 190; // the top of the tallest bar, under the total
const BARS_BOTTOM = 630;
const BARS_LEFT = 40;
const BARS_RIGHT = 1420; // right of this is the label of the dashed line
const BAR_WIDTH = 40;
const SMALLEST_BAR = 6; // so that a share under 0.2% can still be seen
const SHARE_SIZE = 34; // the type of the share above a bar

export default class LetterShares extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The letter shares need ${name}="..." on the ::visual line.`);
      return value;
    };
    const shares = setting("shares").split(",").map(Number);
    if (shares.length !== LETTERS.length || shares.some(Number.isNaN)) {
      throw new Error(`The letter shares need ${LETTERS.length} numbers in shares="...", one for each letter.`);
    }

    // Each event as its name and the places of its letters in the alphabet.
    const events = setting("events").split(";").map((written) => {
      const [name, list] = written.split(":").map((part) => part.trim());
      if (!name || !list) throw new Error(`An event is written as "name: a e i", not "${written}".`);
      const members = list.split(/\s+/).map((letter) => {
        const index = LETTERS.indexOf(letter);
        if (index === -1) throw new Error(`"${letter}" in the event "${name}" is not a small letter from a to z.`);
        return index;
      });
      return { name, members };
    });

    const equalShare = 100 / LETTERS.length;
    const unit = (BARS_BOTTOM - BARS_TOP) / Math.max(...shares, equalShare); // the height of 1%
    const equalY = BARS_BOTTOM - equalShare * unit;
    const pitch = (BARS_RIGHT - BARS_LEFT) / LETTERS.length; // from one bar to the next
    const middleOf = (index: number) => BARS_LEFT + index * pitch + pitch / 2;
    const topOf = (share: number) => BARS_BOTTOM - Math.max(SMALLEST_BAR, share * unit);

    // The bars whose shares are written out: the three tallest and the
    // shortest.
    const tallestFirst = LETTERS.map((_, index) => index).sort((one, other) => shares[other] - shares[one]);
    const labeled = [...tallestFirst.slice(0, 3), tallestFirst[LETTERS.length - 1]];

    // The share of one bar, written above it. The figures are wider than a
    // bar, so they sit above the bars on both sides too, with a thin line
    // down to their own bar where that lifts them. Where the dashed line
    // would cross them, they sit on the line.
    const shareLabel = (index: number, fill: string, isNew: boolean): string => {
      const ownTop = topOf(shares[index]);
      const neighbors = [index - 1, index + 1].filter((other) => other >= 0 && other < LETTERS.length);
      let y = Math.min(ownTop, ...neighbors.map((other) => topOf(shares[other]))) - 12;
      const crossesLine = y - 0.75 * SHARE_SIZE - 4 < equalY && equalY < y + 6;
      if (crossesLine) y = equalY - 12;

      const x = middleOf(index);
      const isLifted = ownTop - y > 30;
      const leader = isLifted
        ? `<line x1="${x}" y1="${y + 10}" x2="${x}" y2="${ownTop - 6}" stroke="${ink.muted}" stroke-width="3"/>`
        : "";
      const words = `${shares[index].toFixed(shares[index] < 0.1 ? 2 : 1)}%`;
      return `<g${isNew ? ' class="new"' : ""}>${leader}${textAt(x, y, words, { size: SHARE_SIZE, fill })}</g>`;
    };

    const drawingAt = (step: number): string => {
      const parts: string[] = [];
      const event = step >= 2 ? events[step - 2] : undefined;

      LETTERS.forEach((letter, index) => {
        const top = topOf(step === 0 ? equalShare : shares[index]);
        const middle = middleOf(index);
        const isIn = event?.members.includes(index) ?? false;
        const barFill = event ? (isIn ? ink.blue : ink.faint) : ink.muted;
        const letterFill = event ? (isIn ? ink.blue : ink.muted) : ink.text;

        parts.push(
          `<rect x="${middle - BAR_WIDTH / 2}" y="${top}" width="${BAR_WIDTH}" height="${BARS_BOTTOM - top}" fill="${barFill}"` +
            `${step === 1 ? ' class="new"' : ""}/>`,
        );
        parts.push(textAt(middle, BARS_BOTTOM + 48, letter, { size: 44, fill: letterFill, bold: true }));
      });

      // The level of equal shares, drawn over the bars.
      parts.push(
        `<line x1="${BARS_LEFT}" y1="${equalY}" x2="${BARS_RIGHT}" y2="${equalY}" stroke="${ink.muted}"` +
          ` stroke-width="3" stroke-dasharray="14 10"/>` +
          textAt(BARS_RIGHT + 20, equalY + 12, `1 in ${LETTERS.length}`, { size: 36, fill: ink.muted, anchor: "start" }),
      );

      if (step >= 1) {
        for (const index of labeled) parts.push(shareLabel(index, event ? ink.muted : ink.text, step === 1));
      }

      if (event) {
        const total = event.members.reduce((sum, index) => sum + shares[index], 0);
        const right = WIDTH - 40;
        parts.push(
          textAt(right, TOTAL_Y, `${capitalized(event.name)}: ${total.toFixed(1)}% of letters`, {
            size: 48,
            fill: ink.blue,
            anchor: "end",
            bold: true,
            isNew: true,
          }),
        );
        parts.push(
          textAt(right, TOTAL_Y + 54, `${event.members.length} of the ${LETTERS.length} outcomes`, {
            size: 38,
            anchor: "end",
            isNew: true,
          }),
        );
      }

      const caption =
        step === 0
          ? `If the ${LETTERS.length} outcomes were equally likely, each would be 1 in ${LETTERS.length}.`
          : step === 1
            ? `The share of each letter in English text.`
            : `${capitalized(event!.name)}: the shares of ${event!.members.map((index) => LETTERS[index]).join(", ")} add to ${event!.members.reduce((sum, index) => sum + shares[index], 0).toFixed(1)}%.`;
      parts.push(textAt(WIDTH / 2, HEIGHT - 35, caption, { size: 38, isNew: true }));
      return parts.join("");
    };

    const box = figure.flatBox();
    figure.steps(2 + events.length, (step) => {
      box.innerHTML = svg(WIDTH, HEIGHT, drawingAt(step));
    });
  }
}

function capitalized(words: string): string {
  return words[0].toUpperCase() + words.slice(1);
}
