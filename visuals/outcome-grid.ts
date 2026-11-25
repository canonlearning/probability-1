// Every outcome of an experiment as one tile in a grid, where every tile is
// equally likely.
//
// The grid runs by itself. First all the tiles stand level. Then the tiles
// that fit what we are told (the given event) turn brass, and the other
// tiles sink into the floor. Last, the tiles of the event that is asked
// about turn red and rise, and they are counted among the tiles still
// standing.
//
// The outcomes and the two events are written on the ::visual line:
//
//   ::visual{name="outcome-grid" one="roll of the two dice"
//     rows="1, 2, 3, 4, 5, 6" row-name="red die"
//     columns="1, 2, 3, 4, 5, 6" column-name="blue die"
//     given="2-6, 3-5, 4-4, 5-3, 6-2" given-name="the sum is 8"
//     event="6-*, *-6" event-name="at least one die shows a 6"}
//
// A tile is written row-column, and * stands for every row or every column,
// so "6-*, *-6" is every tile with a 6. A label cannot hold a hyphen or a
// comma.
//
// Optional: then-given and then-given-name name a second given event. The
// grid then runs twice, once for each, so the two answers can be compared.

import { block, floor, floorPatch, palette, reduce, Stage, THREE, Visual, type Figure } from "canon";

// Timing, in seconds. Step 0 shows the whole grid. Then each given event
// takes four steps: mark its tiles, sink the others, raise the tiles of the
// asked event, and show the answer.
const STEP_TIME = 3;
const STEPS_PER_GIVEN = 4;
const TILE_DELAY = 0.03; // tiles change one after another, this far apart
const CHANGE_RATE = 7; // how quickly a tile moves toward its new look

// Sizes, in floor units. Tiles are 1 apart.
const TILE_WIDTH = 0.86;
const LEVEL_HEIGHT = 0.22;
const SUNK_HEIGHT = 0.03;
const RAISED_HEIGHT = 0.75;

const PLAIN_COLOR = 0xfbfaf6;
const SUNK_COLOR = 0xdcdad3;

type Tile = {
  row: number;
  column: number;
  box: THREE.Mesh;
  height: number;
  color: THREE.Color;
};

type Given = { name: string; tiles: Set<string> };

export default class OutcomeGrid extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The outcome grid needs ${name}="..." on its ::visual line.`);
      return value;
    };
    const rows = listFrom(setting("rows"));
    const columns = listFrom(setting("columns"));
    const one = this.getAttribute("one") ?? "outcome";
    const eventName = setting("event-name");
    const event = tilesFrom(setting("event"), rows, columns);

    const givens: Given[] = [{ name: setting("given-name"), tiles: tilesFrom(setting("given"), rows, columns) }];
    const secondGiven = this.getAttribute("then-given");
    if (secondGiven !== null) {
      givens.push({ name: setting("then-given-name"), tiles: tilesFrom(secondGiven, rows, columns) });
    }
    const lastStep = STEPS_PER_GIVEN * givens.length;
    const total = rows.length * columns.length;

    const stage = new Stage(figure, {
      halfWidth: Math.max(columns.length / 2 + 2.6, rows.length * 0.75 + 1.2),
      lookAt: [-0.4, 0.2, 0],
      azimuth: -10,
      elevation: 52,
      gridSize: 0,
    });

    // The floor under the grid, and the names along its back and left edges.
    const left = -columns.length / 2;
    const back = -rows.length / 2;
    stage.scene.add(
      floorPatch(
        { x: 0, y: 0 },
        { width: columns.length + 0.3, depth: rows.length + 0.3 },
        { color: palette.grid, opacity: 0.7 },
      ),
    );
    const xOf = (column: number) => left + column + 0.5;
    const yOf = (row: number) => back + row + 0.5;
    columns.forEach((name, column) => {
      stage.label(`<b>${name}</b>`).position.copy(floor(xOf(column), back - 0.1));
    });
    rows.forEach((name, row) => {
      stage.label(`<b>${name}</b>`).position.copy(floor(left - 0.5, yOf(row) + 0.3));
    });
    const columnName = this.getAttribute("column-name");
    const rowName = this.getAttribute("row-name");
    if (columnName) stage.label(columnName).position.copy(floor(0, back - 0.75));
    if (rowName) stage.label(rowName).position.copy(floor(left - 1.6, 0.3));

    const tiles: Tile[] = [];
    rows.forEach((_, row) => {
      columns.forEach((_, column) => {
        const box = block(
          xOf(column),
          yOf(row),
          { width: TILE_WIDTH, depth: TILE_WIDTH, height: 1 },
          PLAIN_COLOR,
        );
        stage.scene.add(box);
        tiles.push({ row, column, box, height: LEVEL_HEIGHT, color: new THREE.Color(PLAIN_COLOR) });
      });
    });
    const keyOf = (tile: Tile) => `${tile.row}-${tile.column}`;

    // The count of tiles, shown in front of the grid with each answer.
    const countLabel = stage.label("");
    countLabel.position.copy(floor(0, -back + 1.1));

    // For one given event: how many tiles fit it, and how many of those
    // are in the asked event.
    const counts = givens.map((given) => {
      const kept = given.tiles.size;
      const asked = [...given.tiles].filter((key) => event.has(key)).length;
      const answer = reduce({ top: asked, bottom: kept });
      return { kept, asked, answerText: answer.bottom === 1 ? String(answer.top) : `${answer.top}/${answer.bottom}` };
    });

    let time = 0;
    figure.button("Replay", () => {
      time = 0;
      for (const tile of tiles) {
        tile.height = LEVEL_HEIGHT;
        tile.color.set(PLAIN_COLOR);
      }
    });
    figure.caption(
      `Each tile is one ${one}, and every tile is equally likely. Brass tiles fit what we ` +
        `are told. Sunk tiles are ruled out. Red tiles are the ones the question asks about.`,
    );

    const targetColor = new THREE.Color();
    stage.onFrame = (seconds) => {
      time += seconds;
      const step = Math.min(Math.floor(time / STEP_TIME), lastStep);

      // Which given event is running, and how far through its four steps.
      const run = Math.max(Math.floor((step - 1) / STEPS_PER_GIVEN), 0);
      const part = step === 0 ? -1 : step - 1 - run * STEPS_PER_GIVEN;
      const partStartTime = (step === 0 ? 0 : step) * STEP_TIME;
      const given = givens[run];
      const count = counts[run];

      const amount = 1 - Math.exp(-seconds * CHANGE_RATE);
      tiles.forEach((tile, index) => {
        // Tiles change one after another, so the eye can follow the sweep.
        const reached = time >= partStartTime + index * TILE_DELAY;
        const partForTile = reached ? part : part - 1;
        const kept = given.tiles.has(keyOf(tile));
        const asked = kept && event.has(keyOf(tile));

        let height = LEVEL_HEIGHT;
        targetColor.set(PLAIN_COLOR);
        if (partForTile >= 0 && kept) targetColor.set(palette.brass);
        if (partForTile >= 1 && !kept) {
          height = SUNK_HEIGHT;
          targetColor.set(SUNK_COLOR);
        }
        if (partForTile >= 2 && asked) {
          height = RAISED_HEIGHT;
          targetColor.set(palette.red);
        }

        tile.height += (height - tile.height) * amount;
        tile.color.lerp(targetColor, amount);
        tile.box.scale.y = tile.height;
        (tile.box.material as THREE.MeshLambertMaterial).color.copy(tile.color);
      });

      countLabel.shown = part === 3;
      countLabel.element.innerHTML = `<b>${count.asked} of ${count.kept}</b>`;

      const earlier =
        run > 0 ? ` Given that ${givens[0].name}, it was <b>${counts[0].answerText}</b>.` : "";
      figure.readout(
        step === 0
          ? `Every ${one} is one tile: <b>${total}</b> outcomes, each equally likely.`
          : [
              `We are told that ${given.name}. <b>${count.kept}</b> of the ${total} outcomes fit.`,
              `The other ${total - count.kept} did not happen, so only these ${count.kept} are left.`,
              `In <b>${count.asked}</b> of these ${count.kept}, ${eventName}.`,
              `Given that ${given.name}, the probability that ${eventName} is ` +
                `<b>${count.asked}/${count.kept}${count.answerText === `${count.asked}/${count.kept}` ? "" : ` = ${count.answerText}`}</b>.${earlier}`,
            ][part],
      );
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
      for (const column of matchingColumns) tiles.add(`${row}-${column}`);
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
