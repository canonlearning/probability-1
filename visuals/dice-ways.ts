// Three dice are thrown and their numbers added. For two sums, the ways to
// make each sum (1 + 2 + 6) and the number of throws that each way is.
// Made for a slide: it is a flat drawing with large type.
//
// A throw says what each of the three dice shows, so 1 + 2 + 6 is six
// throws, 1 + 4 + 4 is three, and 3 + 3 + 3 is one. The steps: the ways of
// each sum, three ways written out as their throws, the throws of each way of the first sum as a
// bar, the same for the second sum, the total of each sum out of all the
// throws, and each total as a percentage.
//
//   ::visual{name="dice-ways" sums="9, 10"}
//
// `sums` are the two sums to compare. The ways, the throws, and the totals
// are all counted here from the two sums.

import { ink, svg, textAt, Visual, type Figure } from "canon";

const WIDTH = 1600;
const HEIGHT = 780;

// Places, in the units of the drawing.
const COLUMN_LEFT = [70, 870]; // the left edge of each sum's column
const COLUMN_MIDDLE = 340; // from a column's left edge to its middle
const HEADING_Y = 52;
const ROWS_TOP = 84;
const ROW_HEIGHT = 64;
const SQUARE = 54; // the side of the square around one die's number
const SQUARE_GAP = 8;
const BAR_LEFT = 215; // from a column's left edge to the start of its bars
const BAR_UNIT = 70; // the length of the bar of one throw
const BAR_HEIGHT = 42;
const EXAMPLE_LEFT = 330; // where the throws of the example start
const EXAMPLE_SPACING = 205; // from one throw of the example to the next
const TOTAL_Y = 560;
const PERCENT_Y = 650;

const FACES = [1, 2, 3, 4, 5, 6];
const LAST_STEP = 5;

// One way to make a sum: its three numbers in order of size, and every
// throw of three dice that shows those numbers.
type Way = { numbers: number[]; throws: number[][] };

export default class DiceWays extends Visual {
  protected build(figure: Figure): void {
    const setting = this.getAttribute("sums");
    if (setting === null) throw new Error(`The dice ways need sums="..." on the ::visual line.`);
    const sums = setting.split(",").map((item) => Number(item.trim()));
    if (sums.length !== 2) throw new Error(`The dice ways need two sums, as in sums="9, 10".`);

    const allThrows = FACES.length ** 3;
    const ways = sums.map(waysToMake);
    const counts = ways.map((list) => list.map((way) => way.throws.length));
    const totals = counts.map(sum);
    const percents = totals.map((total) => `${((100 * total) / allThrows).toFixed(1)}%`);
    const larger = totals[0] > totals[1] ? 0 : 1;

    // The ways written out as their throws at step 1: the first way that is
    // six throws, the first that is three, and the first that is one, where
    // there is one of each kind.
    const everyWay = ways.flat();
    const examples = [6, 3, 1]
      .map((count) => everyWay.find((way) => way.throws.length === count))
      .filter((way) => way !== undefined);

    const captions = [
      `Each sum can be made in ${ways[0].length === 6 ? "six" : ways[0].length} ways.`,
      `A throw says what the red, the green, and the blue die show.`,
      `Sum of ${sums[0]}: ${counts[0].join(" + ")} throws.`,
      `Sum of ${sums[1]}: ${counts[1].join(" + ")} throws.`,
      `The ${allThrows} throws are equally likely. A sum of ${sums[larger]} comes up more often.`,
      `About ${percents[1 - larger]} against ${percents[larger]}.`,
    ];

    const drawingAt = (step: number): string => {
      const parts: string[] = [];

      sums.forEach((total, column) => {
        const left = COLUMN_LEFT[column];
        const middle = left + COLUMN_MIDDLE;
        parts.push(textAt(middle, HEADING_Y, `sum of ${total}`, { size: 46, bold: true, isNew: step === 0 }));

        // The bars of a column appear at step 2 or 3.
        const barsStep = 2 + column;
        ways[column].forEach((way, row) => {
          const top = ROWS_TOP + row * ROW_HEIGHT;
          way.numbers.forEach((number, place) => {
            const x = left + place * (SQUARE + SQUARE_GAP);
            parts.push(
              `<rect x="${x}" y="${top}" width="${SQUARE}" height="${SQUARE}" rx="8" fill="${ink.wash}"` +
                ` stroke="${ink.muted}" stroke-width="2"${step === 0 ? ' class="new"' : ""}/>`,
            );
            parts.push(textAt(x + SQUARE / 2, top + SQUARE / 2 + 13, String(number), { size: 38, isNew: step === 0 }));
          });
          if (step < barsStep) return;

          // One piece of bar for each throw, then the number of throws.
          const isNew = step === barsStep;
          const barTop = top + (SQUARE - BAR_HEIGHT) / 2;
          way.throws.forEach((_, piece) => {
            parts.push(
              `<rect x="${left + BAR_LEFT + piece * BAR_UNIT}" y="${barTop}" width="${BAR_UNIT}" height="${BAR_HEIGHT}"` +
                ` fill="${ink.blue}" stroke="#fff" stroke-width="3"${isNew ? ' class="new"' : ""}/>`,
            );
          });
          parts.push(
            textAt(left + BAR_LEFT + way.throws.length * BAR_UNIT + 18, top + SQUARE / 2 + 14, String(way.throws.length), {
              size: 40,
              anchor: "start",
              fill: ink.blue,
              bold: true,
              isNew,
            }),
          );
        });

        if (step >= 4) {
          const fill = column === larger ? ink.red : ink.text;
          parts.push(textAt(middle, TOTAL_Y, `${totals[column]} of ${allThrows}`, { size: 68, fill, bold: true, isNew: step === 4 }));
        }
        if (step === LAST_STEP) {
          const fill = column === larger ? ink.red : ink.text;
          parts.push(textAt(middle, PERCENT_Y, percents[column], { size: 50, fill, isNew: true }));
        }
      });

      // Under the columns, until the totals take the space: the examples,
      // each written out as its throws.
      if (step >= 1 && step <= 3) {
        const isNew = step === 1;
        examples.forEach((way, line) => {
          const y = 548 + line * 60;
          parts.push(textAt(COLUMN_LEFT[0], y, plusText(way.numbers), { size: 40, anchor: "start", bold: true, isNew }));
          way.throws.forEach((dice, place) => {
            parts.push(
              textAt(EXAMPLE_LEFT + place * EXAMPLE_SPACING, y, `(${dice.join(", ")})`, { size: 38, anchor: "start", isNew }),
            );
          });
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

// Every way to make `total` with three dice. Goes through all the throws
// in order, and puts each one with the way that has its numbers.
function waysToMake(total: number): Way[] {
  const ways: Way[] = [];
  for (const first of FACES) {
    for (const second of FACES) {
      for (const third of FACES) {
        if (first + second + third !== total) continue;
        const dice = [first, second, third];
        const numbers = [...dice].sort((a, b) => a - b);
        const way = ways.find((other) => other.numbers.join() === numbers.join());
        if (way) way.throws.push(dice);
        else ways.push({ numbers, throws: [dice] });
      }
    }
  }
  return ways;
}

// The numbers of a way with plus signs between them: "1 + 2 + 6".
function plusText(numbers: number[]): string {
  return numbers.join(" + ");
}

function sum(numbers: number[]): number {
  return numbers.reduce((total, number) => total + number, 0);
}
