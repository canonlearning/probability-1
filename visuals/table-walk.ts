// A two-way table of counts, walked through one step at a time. Made for a
// slide: it is a flat drawing with large type.
//
// The steps: the counts, the totals, then one cell as a share of three
// different groups (everyone, its column, its row), and last the three
// shares side by side. The cell asked about is the first row and first
// column.
//
//   ::visual{name="table-walk" many="people"
//     rows="female, male" columns="survived, died"
//     counts="344, 126; 367, 1364"}

import { ink, percentText, stackedFraction, svg, textAt, Visual, type Figure } from "canon";

const WIDTH = 1600;
const HEIGHT = 780;

// The table, in the units of the drawing.
const TABLE_LEFT = 250;
const TABLE_TOP = 130;
const CELL_WIDTH = 250;
const CELL_HEIGHT = 170;
const PANEL_X = 1300; // the middle of the space right of the table

const LAST_STEP = 5;

export default class TableWalk extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The table walk needs ${name}="..." on its ::visual line.`);
      return value;
    };
    const rows = listFrom(setting("rows"), ",");
    const columns = listFrom(setting("columns"), ",");
    const counts = listFrom(setting("counts"), ";").map((row) => listFrom(row, ",").map(Number));
    const many = this.getAttribute("many") ?? "outcomes";

    const rowTotals = counts.map((row) => sum(row));
    const columnTotals = columns.map((_, column) => sum(counts.map((row) => row[column])));
    const total = sum(rowTotals);
    const asked = counts[0][0];

    // The three groups the asked cell is a share of, in the order shown.
    const groups = [
      { name: "of everyone", shortName: "everyone", size: total },
      { name: `given "${columns[0]}"`, shortName: columns[0], size: columnTotals[0] },
      { name: `given "${rows[0]}"`, shortName: rows[0], size: rowTotals[0] },
    ];
    const captions = [
      `Each of the ${total} ${many} is in exactly one cell.`,
      `Add across and down to get the totals.`,
      `Nothing known: ${asked} of all ${total} ${many}.`,
      `Given "${columns[0]}": keep only that column.`,
      `Given "${rows[0]}": keep only that row.`,
      `The same ${asked} ${many}, as a share of three different groups.`,
    ];

    const xOf = (column: number) => TABLE_LEFT + column * CELL_WIDTH;
    const yOf = (row: number) => TABLE_TOP + row * CELL_HEIGHT;
    const numberAt = (column: number, row: number, count: number, fill: string, bold: boolean, isNew = false) =>
      textAt(xOf(column) + CELL_WIDTH / 2, yOf(row) + CELL_HEIGHT / 2 + 24, String(count), {
        size: 68,
        fill,
        bold,
        isNew,
      });

    const drawingAt = (step: number): string => {
      // Which cells are in the group that is kept at this step.
      const isKept = (row: number, column: number) =>
        step === 3 ? column === 0 : step === 4 ? row === 0 : true;
      const showsAGroup = step >= 2 && step <= 4;
      const parts: string[] = [];

      columns.forEach((name, column) => {
        parts.push(textAt(xOf(column) + CELL_WIDTH / 2, TABLE_TOP - 30, name, { size: 40, bold: true }));
      });
      rows.forEach((name, row) => {
        parts.push(
          textAt(TABLE_LEFT - 30, yOf(row) + CELL_HEIGHT / 2 + 14, name, { size: 40, bold: true, anchor: "end" }),
        );
      });

      counts.forEach((rowCounts, row) => {
        rowCounts.forEach((count, column) => {
          const kept = isKept(row, column);
          const isAsked = row === 0 && column === 0 && step >= 2;
          const fill = isAsked ? ink.redTint : showsAGroup && kept ? ink.blueTint : "#fff";
          parts.push(
            `<rect x="${xOf(column)}" y="${yOf(row)}" width="${CELL_WIDTH}" height="${CELL_HEIGHT}"` +
              ` fill="${fill}" stroke="${ink.faint}" stroke-width="3"/>`,
          );
          parts.push(numberAt(column, row, count, isAsked ? ink.red : kept ? ink.text : ink.faint, isAsked));
        });
      });

      if (step >= 1) {
        // A total is blue and bold when it is the size of the kept group.
        const totalAt = (column: number, row: number, count: number, isGroupSize: boolean) =>
          numberAt(column, row, count, isGroupSize ? ink.blue : ink.muted, isGroupSize, step === 1);
        parts.push(textAt(xOf(columns.length) + CELL_WIDTH / 2, TABLE_TOP - 30, "total", { size: 32, fill: ink.muted }));
        parts.push(
          textAt(TABLE_LEFT - 30, yOf(rows.length) + CELL_HEIGHT / 2 + 12, "total", {
            size: 32,
            fill: ink.muted,
            anchor: "end",
          }),
        );
        rowTotals.forEach((count, row) => {
          parts.push(totalAt(columns.length, row, count, step === 4 && row === 0));
        });
        columnTotals.forEach((count, column) => {
          parts.push(totalAt(column, rows.length, count, step === 3 && column === 0));
        });
        parts.push(totalAt(columns.length, rows.length, total, step === 2));
      }

      // Right of the table: the share at this step, or all three at the end.
      const shareAt = (x: number, groupName: string, groupSize: number, size: number) =>
        textAt(x, 360 - size * 2.1, groupName, { size: Math.max(size * 0.42, 30), fill: ink.muted, isNew: true }) +
        stackedFraction(
          x,
          360,
          { words: String(asked), fill: ink.red },
          { words: String(groupSize), fill: ink.blue },
          { size, isNew: true },
        ) +
        textAt(x, 360 + size * 2.4, `≈ ${percentText(asked, groupSize)}`, { size: size * 0.8, isNew: true });
      if (showsAGroup) {
        const group = groups[step - 2];
        parts.push(shareAt(PANEL_X, group.name, group.size, 96));
      }
      if (step === LAST_STEP) {
        groups.forEach((group, index) => {
          parts.push(shareAt(PANEL_X - 195 + index * 195, group.shortName, group.size, 58));
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

function listFrom(written: string, separator: string): string[] {
  return written.split(separator).map((item) => item.trim());
}

function sum(numbers: number[]): number {
  return numbers.reduce((total, number) => total + number, 0);
}
