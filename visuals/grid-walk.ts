// Every outcome of an experiment as one square in a grid, where every
// square is equally likely, walked through one step at a time. Made for a
// slide: it is a flat drawing with large type.
//
// The steps: all the outcomes, the ones that fit what we are told (the
// given event), the others ruled out, the ones the question asks about,
// and the answer as a count over a count.
//
//   ::visual{name="grid-walk"
//     rows="1, 2, 3, 4, 5, 6" row-name="red die"
//     columns="1, 2, 3, 4, 5, 6" column-name="blue die"
//     given="3-6, 4-5, 4-6, 5-4, 5-5, 5-6, 6-3, 6-4, 6-5, 6-6"
//     given-name="the sum is at least 9"
//     event="1-1, 2-2, 3-3, 4-4, 5-5, 6-6" event-name="the two dice match"}
//
// A square is written row-column, and * stands for every row or every
// column, so "6-*, *-6" is every square with a 6.

import { fractionText, ink, reduce, stackedFraction, svg, textAt, Visual, type Figure } from "canon";

const WIDTH = 1600;
const HEIGHT = 780;

// The grid, in the units of the drawing. It is at most 580 on a side.
const GRID_LEFT = 250;
const GRID_TOP = 105;
const GRID_SIZE = 580;
const PANEL_X = 1240; // the middle of the space right of the grid

const LAST_STEP = 4;

export default class GridWalk extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The grid walk needs ${name}="..." on its ::visual line.`);
      return value;
    };
    const rows = listFrom(setting("rows"));
    const columns = listFrom(setting("columns"));
    const given = squaresFrom(setting("given"), rows, columns);
    const event = squaresFrom(setting("event"), rows, columns);
    const givenName = setting("given-name");
    const eventName = setting("event-name");

    const total = rows.length * columns.length;
    const kept = given.size;
    const asked = [...given].filter((square) => event.has(square)).length;
    const answer = fractionText(reduce({ top: asked, bottom: kept }));
    const answerText = answer === `${asked}/${kept}` ? answer : `${asked}/${kept} = ${answer}`;

    const captions = [
      `${total} outcomes, each equally likely.`,
      `We are told that ${givenName}. ${kept} outcomes fit.`,
      `The other ${total - kept} did not happen. Only ${kept} are left.`,
      `In ${asked} of those ${kept}, ${eventName}.`,
      `Given that ${givenName}: ${answerText}.`,
    ];

    const side = GRID_SIZE / Math.max(rows.length, columns.length);
    const xOf = (column: number) => GRID_LEFT + column * side;
    const yOf = (row: number) => GRID_TOP + row * side;

    const drawingAt = (step: number): string => {
      const parts: string[] = [];
      const columnName = this.getAttribute("column-name");
      const rowName = this.getAttribute("row-name");
      if (columnName) {
        parts.push(textAt(GRID_LEFT + (columns.length * side) / 2, 38, columnName, { size: 30, fill: ink.muted }));
      }
      if (rowName) {
        const y = GRID_TOP + (rows.length * side) / 2;
        parts.push(
          `<g transform="rotate(-90 ${GRID_LEFT - 110} ${y})">` +
            textAt(GRID_LEFT - 110, y, rowName, { size: 30, fill: ink.muted }) +
            `</g>`,
        );
      }
      columns.forEach((name, column) => {
        parts.push(textAt(xOf(column) + side / 2, GRID_TOP - 18, name, { size: 32, bold: true }));
      });
      rows.forEach((name, row) => {
        parts.push(textAt(GRID_LEFT - 28, yOf(row) + side / 2 + 11, name, { size: 32, bold: true }));
      });

      rows.forEach((rowLabel, row) => {
        columns.forEach((columnLabel, column) => {
          const square = `${row}-${column}`;
          const isKept = given.has(square);
          const isAsked = isKept && event.has(square);
          // An outcome in the asked event that was ruled out. It is
          // outlined, to show that it does not count.
          const isAskedButRuledOut = !isKept && event.has(square);

          let fill = "#fff";
          let textFill = ink.text;
          if (step >= 1 && isKept) fill = ink.blueTint;
          if (step >= 2 && !isKept) {
            fill = ink.wash;
            textFill = ink.faint;
          }
          if (step >= 3 && isAsked) {
            fill = ink.red;
            textFill = "#fff";
          }
          const outline =
            step >= 3 && isAskedButRuledOut
              ? `stroke="${ink.red}" stroke-width="3" stroke-dasharray="9 7"`
              : `stroke="#fff" stroke-width="6"`;
          const changedNow = (step === 1 && isKept) || (step === 2 && !isKept) || (step === 3 && event.has(square));
          parts.push(
            `<g${changedNow ? ' class="new"' : ""}>` +
              `<rect x="${xOf(column) + 3}" y="${yOf(row) + 3}" width="${side - 6}" height="${side - 6}" rx="6"` +
              ` fill="${fill}" ${outline}/>` +
              textAt(xOf(column) + side / 2, yOf(row) + side / 2 + side * 0.1, `${rowLabel}, ${columnLabel}`, {
                size: side * 0.28,
                fill: textFill,
              }) +
              `</g>`,
          );
        });
      });
      // A thin frame, so that white squares are seen at step 0.
      parts.push(
        `<rect x="${GRID_LEFT}" y="${GRID_TOP}" width="${columns.length * side}" height="${rows.length * side}"` +
          ` fill="none" stroke="${ink.faint}" stroke-width="3"/>`,
      );

      // Right of the grid: the count over the count, as it is found.
      if (step === 1) {
        parts.push(textAt(PANEL_X, 400, `${kept} of ${total} fit`, { size: 56, fill: ink.blue, bold: true, isNew: true }));
      }
      if (step >= 2) {
        parts.push(
          stackedFraction(
            PANEL_X,
            370,
            { words: step >= 3 ? String(asked) : "?", fill: step >= 3 ? ink.red : ink.muted },
            { words: String(kept), fill: ink.blue },
            { size: 110, isNew: step === 2 || step === 3 },
          ),
        );
      }
      if (step === LAST_STEP && answer !== `${asked}/${kept}`) {
        parts.push(textAt(PANEL_X, 620, `= ${answer}`, { size: 88, bold: true, isNew: true }));
      }

      parts.push(textAt(WIDTH / 2, HEIGHT - 28, captions[step], { size: 38, isNew: true }));
      return parts.join("");
    };

    const box = figure.flatBox();
    figure.steps(LAST_STEP + 1, (step) => {
      box.innerHTML = svg(WIDTH, HEIGHT, drawingAt(step));
    });
  }
}

// Reads "a, b, c" as a list of labels.
function listFrom(written: string): string[] {
  return written.split(",").map((item) => item.trim());
}

// Reads a list of squares such as "2-6, 6-*" and returns them as
// "row-column" numbers, counted from 0.
function squaresFrom(written: string, rows: string[], columns: string[]): Set<string> {
  const squares = new Set<string>();
  for (const pattern of listFrom(written)) {
    const [rowLabel, columnLabel] = pattern.split("-").map((label) => label.trim());
    for (const row of indexesOf(rowLabel, rows, pattern)) {
      for (const column of indexesOf(columnLabel, columns, pattern)) squares.add(`${row}-${column}`);
    }
  }
  return squares;
}

function indexesOf(label: string | undefined, labels: string[], pattern: string): number[] {
  if (label === "*") return labels.map((_, index) => index);
  const index = labels.indexOf(label ?? "");
  if (index === -1) {
    throw new Error(`The square "${pattern}" names no row or column. A square is written row-column, such as "2-6".`);
  }
  return [index];
}
