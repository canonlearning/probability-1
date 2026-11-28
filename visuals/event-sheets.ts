// Two events as sheets laid over the outcomes of an experiment.
//
// The floor is a grid of tiles, and each tile is one outcome. The floor
// stays flat. An event is a thin colored sheet that lies just above the
// floor and covers exactly the tiles in the event.
//
// The first event is a red sheet and the second is a teal sheet. A dark
// outline goes around the tiles of "A or B", "A and B", or "not A", and the
// other tiles turn gray. The figure steps through these by itself until a
// control is used.
//
// The grid and the two events are written on the ::visual line. The exam
// week, where the two exams land on the same day (D) or on back-to-back
// days (N):
//
//   ::visual{name="event-sheets" tile-label="column, row"
//     rows="Fri, Thu, Wed, Tue, Mon" row-name="history exam"
//     columns="Mon, Tue, Wed, Thu, Fri" column-name="chemistry exam"
//     first="Mon-Mon, Tue-Tue, Wed-Wed, Thu-Thu, Fri-Fri"
//     first-name="same day" first-letter="D"
//     second="Mon-Tue, Tue-Mon, Tue-Wed, Wed-Tue, Wed-Thu, Thu-Wed, Thu-Fri, Fri-Thu"
//     second-name="back-to-back days" second-letter="N"}
//
// Two dice, where the sum is 7 (A) or the red die shows 1 (B):
//
//   ::visual{name="event-sheets"
//     rows="1, 2, 3, 4, 5, 6" row-name="red die"
//     columns="1, 2, 3, 4, 5, 6" column-name="blue die"
//     first="1-6, 2-5, 3-4, 4-3, 5-2, 6-1"
//     first-name="a sum of 7" first-letter="A"
//     second="1-*" second-name="a 1 on the red die" second-letter="B"}
//
// On a page, the ::visual line is written as one line.
//
// - Rows run from the back of the floor to the front, and columns from left
//   to right. The exam week lists its rows from Friday, so Monday is at the
//   front.
// - A tile is written row-column, and * stands for every row or every
//   column, so "1-*" is the whole of row 1. A label cannot hold a hyphen or
//   a comma.
// - An event's name is read after "A is" and after "not", so it is a phrase
//   such as "a sum of 7", not a sentence.
// - Optional: tile-label="column, row" writes the column first on each
//   tile, as (Tue, Thu) has the chemistry day first. Without it a tile
//   shows its row first.
//
// Every count in the readout is counted from the tiles of the two events.

import { block, cssColor, floor, floorPatch, palette, solid, Stage, THREE, Visual, type Figure } from "canon";

// On a canvas narrower than this many pixels (a phone), a tile is too small
// for "Tue, Thu", so each label on a tile is cut to two letters: "Tu, Th".
const NARROW_CANVAS = 500;

type Operation = "or" | "and" | "not";

// What the figure shows at one moment: the red sheet alone or both sheets,
// and the operation whose result is outlined, if any.
type Showing = { sheets: 1 | 2; operation?: Operation };
type Step = Showing & { start: number }; // `start` is in seconds

const STEPS: Step[] = [
  { start: 0, sheets: 1 },
  { start: 3, sheets: 2 },
  { start: 6, sheets: 2, operation: "or" },
  { start: 10.5, sheets: 2, operation: "and" },
  { start: 15, sheets: 2, operation: "not" },
];

// Timing, in seconds.
const TILE_DELAY = 0.05; // a sheet changes one tile after another, this far apart
const CHANGE_RATE = 7; // how quickly a part moves toward its new look

// Sizes, in floor units. Tiles are 1 apart.
const TILE = { width: 0.9, height: 0.1 };
const SHEET_GLIDE = 0.5; // a piece of sheet comes down from this far above its place
// A piece of a sheet covers its whole tile. It is made of two triangles
// that meet along the tile's diagonal. On a tile under both sheets, each
// sheet keeps only its own triangle, so the tile is half red and half teal.
const SHEET_HEIGHT = 0.13;
const SHEET_OPACITY = 0.6;
const RED_SHEET = { color: palette.red, ownHalf: "front left" as const };
const TEAL_SHEET = { color: palette.teal, ownHalf: "back right" as const };
// The corners of the two triangles of a piece, as (x, y) on the floor from
// the middle of the tile.
const HALVES = {
  "front left": [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]],
  "back right": [[-0.5, -0.5], [0.5, 0.5], [0.5, -0.5]],
};
// One side of the dark outline is a thin flat line that lies just above
// the sheets (`height` above the floor), so it reads as a drawn line and
// not as a wall.
const OUTLINE = { width: 0.035, thickness: 0.012, height: 0.2 };

const TILE_COLOR = 0xfbfaf6;
const DIM_TILE_COLOR = 0xd3d1ca; // a tile that is not in the outlined event
const DARK_TEXT = "#2a2a2e";
const RED = cssColor(palette.red);
const TEAL = cssColor(palette.teal);

// A tile's place in the grid, counted from 0, and the middle of the tile
// on the floor.
type Tile = { row: number; column: number; x: number; y: number };

// An event is the set of its tiles, each written "row-column" with the
// numbers of `Tile`.
type Event = { letter: string; name: string; tiles: Set<string> };

const keyOf = (place: { row: number; column: number }) => `${place.row}-${place.column}`;

// The four sides of a tile, as the step to the tile across that side.
const SIDES = [
  { row: 0, column: 1 },
  { row: 0, column: -1 },
  { row: 1, column: 0 },
  { row: -1, column: 0 },
];

type Sheet = {
  // One piece for each tile. `amount` goes from 0 (away) to 1 (in place),
  // and `shared` from 0 to 1 when the other sheet covers the tile as well.
  pieces: { own: THREE.Mesh; other: THREE.Mesh; wanted: boolean; amount: number; shared: number }[];
  tiles: Set<string> | undefined; // the tiles the sheet is moving to cover
  sinceChange: number; // seconds since `tiles` changed
};

export default class EventSheets extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The event sheets need ${name}="..." on their ::visual line.`);
      return value;
    };
    const rows = listFrom(setting("rows"));
    const columns = listFrom(setting("columns"));
    const first: Event = {
      letter: setting("first-letter"),
      name: setting("first-name"),
      tiles: tilesFrom(setting("first"), rows, columns),
    };
    const second: Event = {
      letter: setting("second-letter"),
      name: setting("second-name"),
      tiles: tilesFrom(setting("second"), rows, columns),
    };
    const tileLabel = this.getAttribute("tile-label") ?? "row, column";
    if (tileLabel !== "row, column" && tileLabel !== "column, row") {
      throw new Error(`tile-label is "row, column" or "column, row", not "${tileLabel}".`);
    }

    const stage = new Stage(figure, {
      // The view is wide enough for the row names at the left of the floor
      // and tall enough for the column names in front of it. The floor sits
      // low and turned a little, so its back right corner stays clear of
      // the Pause button on a phone.
      halfWidth: Math.max(columns.length / 2 + 2.2, rows.length * 0.75 + 0.95),
      lookAt: [-0.8, -0.25, 0],
      azimuth: 8,
      elevation: 56,
      gridSize: 0,
    });

    // The edges of the floor. Row 0 is at the back and column 0 at the left.
    const left = -columns.length / 2;
    const front = rows.length / 2;
    const xOf = (column: number) => left + column + 0.5;
    const yOf = (row: number) => front - rows.length + row + 0.5;
    stage.scene.add(
      floorPatch({ x: 0, y: 0 }, { width: columns.length + 0.3, depth: rows.length + 0.3 }, { color: palette.grid, opacity: 0.7 }),
    );

    // The tiles are listed from the front row to the back row, and from
    // left to right in a row. A sheet is laid down in this order.
    const tiles: Tile[] = [];
    for (let row = rows.length - 1; row >= 0; row--) {
      for (let column = 0; column < columns.length; column++) tiles.push({ row, column, x: xOf(column), y: yOf(row) });
    }

    // A plain box for each tile, with the outcome written on it.
    const tileParts = tiles.map((tile) => {
      const box = block(tile.x, tile.y, { width: TILE.width, depth: TILE.width, height: TILE.height }, TILE_COLOR);
      stage.scene.add(box);
      const label = stage.label("");
      // No chip behind the text, so the color of a sheet shows around it.
      label.element.style.background = "none";
      label.element.style.padding = "0";
      label.position.copy(floor(tile.x, tile.y + 0.2, TILE.height));
      return { box, label, dimmed: 0 }; // `dimmed` goes from 0 (plain) to 1
    });
    let tileLabelsAreShort: boolean | undefined;

    // The labels along the front and left edges, and the name of each
    // edge. The row name sits in the narrow margin at the left, so it is
    // written one word to a line.
    columns.forEach((name, column) => {
      stage.label(`<b>${name}</b>`).position.copy(floor(xOf(column), front + 0.5));
    });
    rows.forEach((name, row) => {
      stage.label(`<b>${name}</b>`).position.copy(floor(left - 0.45, yOf(row) + 0.2));
    });
    stage.label(`<b>${setting("column-name")}</b>`).position.copy(floor(0, front + 1.05));
    stage.label(`<b>${setting("row-name").replaceAll(" ", "<br>")}</b>`).position.copy(floor(left - 1.4, 0.35));

    const makeSheet = (look: { color: number; ownHalf: keyof typeof HALVES }): Sheet => ({
      tiles: undefined,
      sinceChange: 0,
      pieces: tiles.map((tile) => {
        const otherHalf = look.ownHalf === "front left" ? "back right" : "front left";
        const [own, other] = ([look.ownHalf, otherHalf] as const).map((half) => {
          const mesh = triangle(HALVES[half], look.color);
          mesh.position.copy(floor(tile.x, tile.y, SHEET_HEIGHT));
          mesh.renderOrder = 1;
          stage.scene.add(mesh);
          return mesh;
        });
        return { own, other, wanted: false, amount: 0, shared: 0 };
      }),
    });
    const redSheet = makeSheet(RED_SHEET);
    const tealSheet = makeSheet(TEAL_SHEET);

    // The dark outline around a set of tiles: a bar on each side of each
    // tile, which stands only where the tile across that side is not in
    // the set. Two tiles of the set that share a side have no bar between
    // them, and tiles that touch only at a corner are outlined apart.
    const outline = tiles.map((tile) =>
      SIDES.map((side) => {
        const bar = sideBar(tile, side);
        bar.visible = false;
        stage.scene.add(bar);
        return { bar, amount: 0 };
      }),
    );

    // The figure shows STEPS in turn until a control is used. From then
    // on it shows `own`, which is what the reader has chosen.
    const timeline = figure.timeline(STEPS.map((step) => step.start));
    let own: Showing | undefined;

    const pressOperation = pressableChoice<Operation>(
      this,
      figure,
      "event",
      [
        ["or", `${first.letter} or ${second.letter}`],
        ["and", `${first.letter} and ${second.letter}`],
        ["not", `not ${first.letter}`],
      ],
      (operation) => {
        own = { sheets: 2, operation };
      },
    );
    figure.button("Replay", () => {
      timeline.restart();
      own = undefined;
    });

    const inBoth = [...first.tiles].filter((key) => second.tiles.has(key)).length;
    figure.caption(
      `Each tile is one outcome. The <b style="color:${RED}">red</b> sheet covers the outcomes in event ` +
        `${first.letter}, and the <b style="color:${TEAL}">teal</b> sheet covers the outcomes in event ` +
        `${second.letter}. ` +
        (inBoth > 0 ? `A tile in both events is half red and half teal. ` : "") +
        `The dark outline goes around the event that is chosen below.`,
    );

    const dimColor = new THREE.Color(DIM_TILE_COLOR);
    stage.onFrame = (seconds) => {
      const time = timeline.advance(seconds);
      const now: Showing = own ?? STEPS.findLast((step) => step.start <= time) ?? STEPS[0];
      const amount = 1 - Math.exp(-seconds * CHANGE_RATE);

      pressOperation(now.operation);
      // The second event plays no part in "not", so its sheet is taken away.
      const tealTiles = now.sheets === 2 && now.operation !== "not" ? second.tiles : undefined;
      moveSheet(redSheet, tiles, first.tiles, tealTiles, seconds, amount);
      moveSheet(tealSheet, tiles, tealTiles, first.tiles, seconds, amount);

      // The outline goes around the result of the operation, and the tiles
      // that are not in the result turn gray.
      const result = resultOf(now.operation, first, second, tiles);
      outline.forEach((bars, number) => {
        const tile = tiles[number];
        bars.forEach((part, sideNumber) => {
          const side = SIDES[sideNumber];
          const across = keyOf({ row: tile.row + side.row, column: tile.column + side.column });
          const stands = result.has(keyOf(tile)) && !result.has(across);
          part.amount += ((stands ? 1 : 0) - part.amount) * amount;
          part.bar.scale.y = Math.max(part.amount, 0.001);
          part.bar.visible = part.amount > 0.02;
        });
      });

      const short = figure.canvasBox.clientWidth < NARROW_CANVAS;
      if (short !== tileLabelsAreShort) {
        tileLabelsAreShort = short;
        tiles.forEach((tile, number) => {
          const row = short ? rows[tile.row].slice(0, 2) : rows[tile.row];
          const column = short ? columns[tile.column].slice(0, 2) : columns[tile.column];
          tileParts[number].label.element.textContent = tileLabel === "row, column" ? `${row}, ${column}` : `${column}, ${row}`;
        });
      }
      tiles.forEach((tile, number) => {
        const part = tileParts[number];
        const key = keyOf(tile);
        const dim = now.operation !== undefined && !result.has(key);
        part.dimmed += ((dim ? 1 : 0) - part.dimmed) * amount;
        (part.box.material as THREE.MeshLambertMaterial).color.set(TILE_COLOR).lerp(dimColor, part.dimmed);

        const underSheet = first.tiles.has(key) || (tealTiles !== undefined && tealTiles.has(key));
        // The label is dark over a sheet, so it is read against the color.
        part.label.element.style.color = underSheet ? DARK_TEXT : "";
      });

      figure.readout(readoutText(now, first, second, result.size));
    };
  }
}

// Reads "a, b, c" as a list of labels.
function listFrom(written: string): string[] {
  return written.split(",").map((item) => item.trim());
}

// Reads a list of tiles such as "2-6, 6-*" and returns them as
// "row-column" numbers, counted from 0.
function tilesFrom(written: string, rows: string[], columns: string[]): Set<string> {
  const tiles = new Set<string>();
  for (const pattern of listFrom(written)) {
    const [rowLabel, columnLabel] = pattern.split("-").map((label) => label.trim());
    const matchingRows = indexesOf(rowLabel, rows, pattern);
    const matchingColumns = indexesOf(columnLabel, columns, pattern);
    for (const row of matchingRows) {
      for (const column of matchingColumns) tiles.add(keyOf({ row, column }));
    }
  }
  return tiles;
}

function indexesOf(label: string | undefined, labels: string[], pattern: string): number[] {
  if (label === "*") return labels.map((_, index) => index);
  const index = labels.indexOf(label ?? "");
  if (index === -1) {
    throw new Error(`The tile "${pattern}" names no row or column. A tile is written row-column, such as "2-6".`);
  }
  return [index];
}

// The tiles of the event that the operation builds from the two events.
// With no operation there are none.
function resultOf(operation: Operation | undefined, first: Event, second: Event, tiles: Tile[]): Set<string> {
  const inResult = (key: string) => {
    if (operation === "or") return first.tiles.has(key) || second.tiles.has(key);
    if (operation === "and") return first.tiles.has(key) && second.tiles.has(key);
    if (operation === "not") return !first.tiles.has(key);
    return false;
  };
  return new Set(tiles.map(keyOf).filter(inResult));
}

// A dark line along one side of a tile, lying OUTLINE.height above the
// floor. It is a little longer than the tile, so the lines of an outline
// meet at the corners.
function sideBar(tile: Tile, side: { row: number; column: number }): THREE.Mesh {
  const alongY = side.column !== 0; // a left or right side runs front to back
  const line = block(
    tile.x + side.column / 2,
    tile.y + side.row / 2,
    {
      width: alongY ? OUTLINE.width : 1 + OUTLINE.width,
      depth: alongY ? 1 + OUTLINE.width : OUTLINE.width,
      height: OUTLINE.thickness,
    },
    palette.dark,
  );
  line.position.y = OUTLINE.height;
  return line;
}

// Moves a sheet toward covering `wanted`, the tiles of its event, or no
// tiles for undefined. When `wanted` changes, the pieces change one after
// another, so the sheet glides across the floor. A piece that arrives comes
// down from above and fades in. On a tile that the other sheet covers too,
// the piece keeps only its own half.
function moveSheet(
  sheet: Sheet,
  tiles: Tile[],
  wanted: Set<string> | undefined,
  otherSheetTiles: Set<string> | undefined,
  seconds: number,
  amount: number,
): void {
  if (sheet.tiles !== wanted) {
    sheet.tiles = wanted;
    sheet.sinceChange = 0;
  }
  sheet.sinceChange += seconds;
  sheet.pieces.forEach((piece, number) => {
    const key = keyOf(tiles[number]);
    const reached = sheet.sinceChange > number * TILE_DELAY;
    if (reached) piece.wanted = wanted !== undefined && wanted.has(key);
    piece.amount += ((piece.wanted ? 1 : 0) - piece.amount) * amount;
    const isShared = piece.wanted && otherSheetTiles !== undefined && otherSheetTiles.has(key);
    piece.shared += ((isShared ? 1 : 0) - piece.shared) * amount;
    const height = SHEET_HEIGHT + (1 - piece.amount) * SHEET_GLIDE;
    const show = (mesh: THREE.Mesh, opacity: number) => {
      mesh.position.y = height;
      (mesh.material as THREE.MeshLambertMaterial).opacity = opacity;
      mesh.visible = opacity > 0.01;
    };
    show(piece.own, SHEET_OPACITY * piece.amount);
    show(piece.other, SHEET_OPACITY * piece.amount * (1 - piece.shared));
  });
}

// A flat triangle that lies level, with its corners given as (x, y) on the
// floor from the place where the triangle is put.
function triangle(corners: number[][], color: number): THREE.Mesh {
  const geometry = new THREE.BufferGeometry();
  const points = corners.flatMap(([x, y]) => [x, 0, y]);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  geometry.computeVertexNormals();
  const material = solid(color, 0);
  material.side = THREE.DoubleSide;
  return new THREE.Mesh(geometry, material);
}

function readoutText(showing: Showing, first: Event, second: Event, resultSize: number): string {
  const firstName = `<span style="color:${RED}">${first.name}</span>`;
  const secondName = `<span style="color:${TEAL}">${second.name}</span>`;
  const { operation } = showing;
  if (operation === undefined) {
    const firstSize = `${first.letter} is ${firstName}: <b>${first.tiles.size}</b> outcomes.`;
    const secondSize = ` ${second.letter} is ${secondName}: <b>${second.tiles.size}</b> outcomes.`;
    return showing.sheets === 2 ? firstSize + secondSize : firstSize;
  }
  const built = operation === "not" ? `not ${firstName}` : `${firstName} ${operation} ${secondName}`;
  if (resultSize === 0) return `${built}: <b>no outcomes</b>`;
  return `${built}: <b>${resultSize}</b> ${resultSize === 1 ? "outcome" : "outcomes"}`;
}

// A row of buttons where one is chosen, as figure.choice makes it, with a
// name in front. figure.choice has no way to change the pressed button from
// code, and the figure changes the event by itself, so this finds the
// buttons on the page and returns a function that presses one of them
// (or none, for undefined).
function pressableChoice<Value extends string>(
  host: HTMLElement,
  figure: Figure,
  name: string,
  options: [Value, string][],
  onChange: (value: Value) => void,
): (chosen: Value | undefined) => void {
  figure.choice(options, options[0][0], onChange);
  const row = [...host.querySelectorAll<HTMLElement>(".fig-choice")].at(-1);
  if (!row) throw new Error("The row of buttons was not added to the figure.");
  const buttons = [...row.querySelectorAll("button")];

  // The row takes a line of its own, and wraps on a narrow screen.
  row.style.flexWrap = "wrap";
  row.style.justifyContent = "center";
  row.style.alignItems = "center";
  row.style.flexBasis = "100%";
  const nameBox = document.createElement("span");
  nameBox.innerHTML = name;
  nameBox.style.marginRight = "0.3rem";
  nameBox.style.color = "#55555c";
  row.prepend(nameBox);

  let pressed: Value | undefined = options[0][0];
  return (chosen) => {
    if (chosen === pressed) return;
    pressed = chosen;
    buttons.forEach((button, index) => button.setAttribute("aria-pressed", String(options[index][0] === chosen)));
  };
}
