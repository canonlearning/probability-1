// The 26 letters as two rows of tiles: a to m, then n to z. The experiment
// is to point at a letter in a book without looking, so each tile is one
// outcome. Made for a slide: it is a flat drawing with large type.
//
// `show` picks one of three drawings.
//
// The outcomes. The steps: the 26 tiles, then a note on what counts as a
// letter.
//
//   ::visual{name="letter-tiles" show="outcomes"}
//
// Events, one at a time. The steps: the 26 outcomes, then each event in
// blue.
//
//   ::visual{name="letter-tiles" show="events"
//     events="a vowel: a e i o u; the letter z: z"}
//
// Two events put together. The steps: event `a` in blue, event `b` in red,
// the outcomes in a or b, the outcomes in a and b, and the outcomes not in
// a.
//
//   ::visual{name="letter-tiles" show="sets" a="a vowel: a e i o u"
//     b="a letter of the word chance: c h a n e"}
//
// An event is written as its name, a colon, and its letters with spaces
// between them. The two names of "sets" sit side by side under the tiles,
// so each has room for about 30 characters.

import { ink, svg, textAt, Visual, type Figure } from "canon";

const WIDTH = 1600;
const HEIGHT = 780;

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const PER_ROW = 13;

// Places, in the units of the drawing.
const TILES_LEFT = 39;
const TILES_TOP = 40;
const TILE_WIDTH = 106;
const TILE_HEIGHT = 220;
const GAP = 12;
const LEGEND_Y = 590; // the names of the two events, under the tiles
const LEGEND_PITCH = 780; // from one name to the next
const NOTE_Y = 575; // the first line of the note under the tiles
const CAPTION_WIDTH = 1500;

const PLAIN = "#fff";

// What counts as a letter, on two lines.
const NOTE = ["capital or small counts as the same letter;", "spaces and punctuation are skipped"];

type Event = { name: string; has: boolean[] }; // `has` is in the order of LETTERS

// How one tile looks at one step.
type Tile = {
  fills: string[]; // one color, or two for a tile split along its diagonal
  letterFill: string;
  outlined: boolean;
  faded: boolean;
  // What this step has added to the tile, which fades in.
  added?: "fill" | "outline";
};

// Everything one step shows.
type Picture = {
  caption: string;
  tiles: Tile[];
  hasNote: boolean;
  legend: { words: string; fill: string; tint: string; isNew: boolean }[];
};

const plainTile: Tile = { fills: [PLAIN], letterFill: ink.text, outlined: false, faded: false };

export default class LetterTiles extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The letter tiles need ${name}="..." on the ::visual line.`);
      return value;
    };

    const show = setting("show");
    let pictures: Picture[];
    if (show === "outcomes") {
      pictures = outcomePictures();
    } else if (show === "events") {
      pictures = eventPictures(setting("events").split(";").map(eventFrom));
    } else if (show === "sets") {
      pictures = setPictures(eventFrom(setting("a")), eventFrom(setting("b")));
    } else {
      throw new Error(`The letter tiles need show="outcomes", "events", or "sets", not "${show}".`);
    }

    const box = figure.flatBox();
    figure.steps(pictures.length, (step) => {
      box.innerHTML = svg(WIDTH, HEIGHT, drawingOf(pictures[step]));
    });
  }
}

// The plain tiles, then the note under them.
function outcomePictures(): Picture[] {
  const tiles = LETTERS.map(() => plainTile);
  return [
    { caption: `The letter is one of ${LETTERS.length}.`, tiles, hasNote: false, legend: [] },
    { caption: `Every pick is exactly one of these ${LETTERS.length} outcomes.`, tiles, hasNote: true, legend: [] },
  ];
}

// The plain tiles, then one picture for each event, with its tiles blue.
function eventPictures(events: Event[]): Picture[] {
  const start: Picture = {
    caption: `The sample space: ${LETTERS.length} outcomes.`,
    tiles: LETTERS.map(() => plainTile),
    hasNote: false,
    legend: [],
  };
  const one = (event: Event): Picture => ({
    caption: `${capitalized(event.name)}: ${count(event.has)} of the ${LETTERS.length} outcomes.`,
    tiles: event.has.map((isIn) => (isIn ? { ...plainTile, fills: [ink.blue], letterFill: "#fff", added: "fill" } : plainTile)),
    hasNote: false,
    legend: [],
  });
  return [start, ...events.map(one)];
}

// Event a in blue, event b in red, then "a or b", "a and b", and "not a".
function setPictures(a: Event, b: Event): Picture[] {
  const either = LETTERS.map((_, index) => a.has[index] || b.has[index]);
  const both = LETTERS.map((_, index) => a.has[index] && b.has[index]);
  const notA = a.has.map((isIn) => !isIn);
  const bothLetters = LETTERS.filter((_, index) => both[index]);

  // The tint of a tile: blue for a, red for b, and half of each for both.
  const fillsOf = (index: number, withB: boolean): string[] => {
    const fills: string[] = [];
    if (a.has[index]) fills.push(ink.blueTint);
    if (withB && b.has[index]) fills.push(ink.redTint);
    return fills.length > 0 ? fills : [PLAIN];
  };
  // A picture with a thick outline around some tiles and the others faded.
  const outlining = (chosen: boolean[], withB: boolean): Tile[] =>
    LETTERS.map((_, index) => ({
      fills: fillsOf(index, withB),
      letterFill: ink.text,
      outlined: chosen[index],
      faded: !chosen[index],
      added: chosen[index] ? "outline" : undefined,
    }));

  const legendA = { words: capitalized(a.name), fill: ink.blue, tint: ink.blueTint };
  const legendB = { words: capitalized(b.name), fill: ink.red, tint: ink.redTint };
  const bothLegends = [
    { ...legendA, isNew: false },
    { ...legendB, isNew: false },
  ];
  const countedOnce =
    bothLetters.length === 0 ? "" : ` ${listed(bothLetters)} ${bothLetters.length === 1 ? "is" : "are"} counted once.`;

  return [
    {
      caption: `${capitalized(a.name)}: ${outcomes(count(a.has))}.`,
      tiles: LETTERS.map((_, index) => ({
        ...plainTile,
        fills: fillsOf(index, false),
        added: a.has[index] ? "fill" : undefined,
      })),
      hasNote: false,
      legend: [{ ...legendA, isNew: true }],
    },
    {
      caption: `${capitalized(b.name)}: ${outcomes(count(b.has))}.`,
      tiles: LETTERS.map((_, index) => ({
        ...plainTile,
        fills: fillsOf(index, true),
        added: b.has[index] ? "fill" : undefined,
      })),
      hasNote: false,
      legend: [
        { ...legendA, isNew: false },
        { ...legendB, isNew: true },
      ],
    },
    {
      caption: `${capitalized(a.name)} or ${b.name}: ${outcomes(count(either))}.${countedOnce}`,
      tiles: outlining(either, true),
      hasNote: false,
      legend: bothLegends,
    },
    {
      caption: `${capitalized(a.name)} and ${b.name}: ${outcomes(count(both))}.`,
      tiles: outlining(both, true),
      hasNote: false,
      legend: bothLegends,
    },
    {
      caption: `Not ${a.name}: ${outcomes(count(notA))}.`,
      tiles: outlining(notA, false),
      hasNote: false,
      legend: [{ ...legendA, isNew: false }],
    },
  ];
}

function drawingOf(picture: Picture): string {
  const parts: string[] = [];
  const newClass = (isNew: boolean) => (isNew ? ' class="new"' : "");

  picture.tiles.forEach((tile, index) => {
    const left = TILES_LEFT + (index % PER_ROW) * (TILE_WIDTH + GAP);
    const top = TILES_TOP + Math.floor(index / PER_ROW) * (TILE_HEIGHT + GAP);
    const right = left + TILE_WIDTH;
    const bottom = top + TILE_HEIGHT;
    const isAdded = (what: Tile["added"]) => newClass(tile.added === what);

    parts.push(`<g${tile.faded ? ' opacity="0.35"' : ""}>`);
    parts.push(`<rect x="${left}" y="${top}" width="${TILE_WIDTH}" height="${TILE_HEIGHT}" fill="${tile.fills[0]}"${isAdded("fill")}/>`);
    if (tile.fills.length === 2) {
      // The half below the diagonal takes the second color.
      parts.push(`<polygon points="${right},${top} ${right},${bottom} ${left},${bottom}" fill="${tile.fills[1]}"${isAdded("fill")}/>`);
    }
    parts.push(
      `<rect x="${left}" y="${top}" width="${TILE_WIDTH}" height="${TILE_HEIGHT}" fill="none" stroke="${ink.faint}" stroke-width="3"/>`,
    );
    if (tile.outlined) {
      parts.push(
        `<rect x="${left + 4}" y="${top + 4}" width="${TILE_WIDTH - 8}" height="${TILE_HEIGHT - 8}" fill="none"` +
          ` stroke="${ink.text}" stroke-width="8"${isAdded("outline")}/>`,
      );
    }
    parts.push(textAt(left + TILE_WIDTH / 2, top + TILE_HEIGHT / 2 + 22, LETTERS[index], { size: 72, fill: tile.letterFill, bold: true }));
    parts.push(`</g>`);
  });

  if (picture.hasNote) {
    NOTE.forEach((line, index) => {
      parts.push(textAt(WIDTH / 2, NOTE_Y + index * 60, line, { size: 44, isNew: true }));
    });
  }

  // Under the tiles: a square of each event's tint, then its name.
  picture.legend.forEach((entry, index) => {
    const left = TILES_LEFT + index * LEGEND_PITCH;
    parts.push(
      `<g${newClass(entry.isNew)}>` +
        `<rect x="${left}" y="${LEGEND_Y - 36}" width="40" height="40" fill="${entry.tint}" stroke="${entry.fill}" stroke-width="3"/>` +
        textAt(left + 58, LEGEND_Y, entry.words, { size: 42, fill: entry.fill, anchor: "start", bold: true }) +
        `</g>`,
    );
  });

  // A caption too long for the drawing at size 38 is set at 34.
  const captionSize = picture.caption.length * 0.55 * 38 <= CAPTION_WIDTH ? 38 : 34;
  parts.push(textAt(WIDTH / 2, HEIGHT - 35, picture.caption, { size: captionSize, isNew: true }));
  return parts.join("");
}

// Reads an event written as "a vowel: a e i o u".
function eventFrom(written: string): Event {
  const [name, list] = written.split(":").map((part) => part.trim());
  if (!name || !list) throw new Error(`An event is written as "name: a e i", not "${written}".`);
  const members = list.split(/\s+/);
  for (const member of members) {
    if (!LETTERS.includes(member)) throw new Error(`"${member}" in the event "${name}" is not a small letter from a to z.`);
  }
  return { name, has: LETTERS.map((letter) => members.includes(letter)) };
}

function capitalized(words: string): string {
  return words[0].toUpperCase() + words.slice(1);
}

function count(has: boolean[]): number {
  return has.filter((isIn) => isIn).length;
}

function outcomes(number: number): string {
  return number === 1 ? "1 outcome" : `${number} outcomes`;
}

// "a", "a and e", or "a, e, and i".
function listed(names: string[]): string {
  if (names.length <= 2) return names.join(" and ");
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}
