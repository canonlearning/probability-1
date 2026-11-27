// Several groups of different sizes, and the part of each group where an
// event happened. Made for a slide: it is a flat drawing with large type.
//
// Each group is a bar as long as the group is large. The steps: the
// groups, the part of each where the event happened, the count of each
// part, the parts moved into one bar of their own, and each part as a
// share of that bar.
//
//   ::visual{name="group-bars" many="people" event="survived"
//     groups="first class, second class, third class, crew"
//     short="1st, 2nd, 3rd, crew"
//     sizes="325, 285, 706, 885" counts="203, 118, 178, 212" highlight="4"}
//
// `sizes` are the groups and `counts` the part of each where the event
// happened. `short` names the groups where there is little room.
// `highlight` is the group drawn in red at the last step.

import { ink, percentText, svg, textAt, Visual, type Figure } from "canon";

const WIDTH = 1600;
const HEIGHT = 780;

// Places, in the units of the drawing.
const BARS_LEFT = 360;
const LONGEST_BAR = 900; // the length of the bar of the largest group
const ROW_HEIGHT = 92;
const BAR_HEIGHT = 62;
const BARS_TOP = 36;
const JOINED_TOP = 490; // the bar of the parts where the event happened
const JOINED_HEIGHT = 96;

const LAST_STEP = 4;

export default class GroupBars extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The group bars need ${name}="..." on the ::visual line.`);
      return value;
    };
    const list = (name: string) => setting(name).split(",").map((item) => item.trim());
    const names = list("groups");
    const shortNames = list("short");
    const sizes = list("sizes").map(Number);
    const counts = list("counts").map(Number);
    const event = setting("event");
    const many = this.getAttribute("many") ?? "outcomes";
    const highlight = Number(this.getAttribute("highlight") ?? names.length) - 1;

    const total = sum(counts);
    const everyone = sum(sizes);
    const unit = LONGEST_BAR / Math.max(...sizes); // the length of one of the `many`

    const captions = [
      `Each bar is one group. Its length is the number of ${many}: ${everyone} in all.`,
      `The blue part of each bar: ${event}.`,
      `A long bar with a small blue share can hold more blue than a short bar.`,
      `Keep only "${event}": ${total} ${many}, from ${names.length} groups.`,
      `Given "${event}": ${names[highlight]} is ${counts[highlight]} of ${total}.`,
    ];

    const drawingAt = (step: number): string => {
      const parts: string[] = [];
      const rect = (x: number, y: number, width: number, height: number, fill: string, isNew = false) =>
        `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="#fff"` +
        ` stroke-width="3"${isNew ? ' class="new"' : ""}/>`;
      const colorOf = (group: number) => (step === LAST_STEP && group === highlight ? ink.red : ink.blue);

      names.forEach((name, group) => {
        const top = BARS_TOP + group * ROW_HEIGHT;
        const middle = top + BAR_HEIGHT / 2 + 13;
        const length = sizes[group] * unit;
        const part = counts[group] * unit;
        // After the parts have moved to their own bar, the groups are faint.
        const moved = step >= 3;
        parts.push(textAt(BARS_LEFT - 24, middle, name, { size: 38, anchor: "end", fill: moved ? ink.muted : ink.text }));
        parts.push(rect(BARS_LEFT, top, length, BAR_HEIGHT, ink.faint));
        if (step >= 1) {
          parts.push(rect(BARS_LEFT, top, part, BAR_HEIGHT, moved ? ink.blueTint : ink.blue, step === 1));
        }
        // Right of the bar: the size of the group, then the share and the
        // count of its blue part.
        const percent = percentText(counts[group], sizes[group]);
        const words =
          step === 0
            ? String(sizes[group])
            : step === 1
              ? `${percent} of ${sizes[group]}`
              : `${counts[group]} of ${sizes[group]} (${percent})`;
        parts.push(
          textAt(BARS_LEFT + length + 22, middle, words, {
            size: 38,
            anchor: "start",
            fill: moved ? ink.muted : ink.text,
            bold: step === 2,
            isNew: step === 1 || step === 2,
          }),
        );
      });

      if (step >= 3) {
        let left = BARS_LEFT;
        counts.forEach((count, group) => {
          const length = count * unit;
          const middle = left + length / 2;
          parts.push(rect(left, JOINED_TOP, length, JOINED_HEIGHT, colorOf(group), step === 3));
          parts.push(
            textAt(middle, JOINED_TOP + JOINED_HEIGHT / 2 + 14, String(count), { size: 40, fill: "#fff", bold: true, isNew: step === 3 }),
          );
          parts.push(textAt(middle, JOINED_TOP - 18, shortNames[group], { size: 34, isNew: step === 3 }));
          if (step === LAST_STEP) {
            parts.push(
              textAt(middle, JOINED_TOP + JOINED_HEIGHT + 48, percentText(count, total), {
                size: 42,
                bold: true,
                fill: group === highlight ? ink.red : ink.text,
                isNew: true,
              }),
            );
          }
          left += length;
        });
        parts.push(
          textAt(left + 22, JOINED_TOP + JOINED_HEIGHT / 2 + 14, `${total} ${event}`, { size: 40, anchor: "start", bold: true, isNew: step === 3 }),
        );
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

function sum(numbers: number[]): number {
  return numbers.reduce((total, number) => total + number, 0);
}
