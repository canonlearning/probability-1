// The 25 outcomes of the exam week, and the 13 that the lesson's question
// asks about.
//
// The experiment: a computer picks a day from Monday to Friday for the
// chemistry exam, and then a day for the history exam. The chemistry week
// is the row of five day slots along the front of the floor, and the
// history week is the row along its left. The floor between them has one
// white tile for each pair of days, with the pair written on it.
//
// The figure runs by itself through four steps:
//
//   1. One pick. A blue block drops into Tue of the chemistry week, then a
//      brass block drops into Thu of the history week. A faint band runs
//      from each block across its column or row of tiles, and a thin dark
//      frame lies around the tile where the bands cross: (Tue, Thu).
//   2. The pick goes away, and the 5 tiles where the exams are on the same
//      day turn red one after another.
//   3. The 8 tiles where the exams are on back-to-back days turn red.
//   4. The readout adds them: 13 of the 25 outcomes.
//
// "Pick again" shows one more pick, of a random pair of days, at any time.
// It leaves the red tiles as they are, and the readout says whether the
// pair is one of the 13.
//
// The camera and the size of the floor are those of event-sheets.ts, so
// the two figures show the same floor from the same view.
//
//   ::visual{name="exam-week"}

import { block, cssColor, floor, floorPatch, palette, seededRandom, Stage, THREE, Visual, type Figure, type StageLabel } from "canon";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
// On a narrow canvas a tile is too small for "Tue, Thu", so the pair is
// written shorter and larger there.
const SHORT_DAYS = ["Mo", "Tu", "We", "Th", "Fr"];
const NARROW_CANVAS = 480; // in pixels
const NARROW_FONT_SIZE = "0.6rem";
const OUTCOMES = DAYS.length * DAYS.length;

type Days = { chemistry: number; history: number }; // each 0 for Mon to 4 for Fri
type Tile = { days: Days; patch: THREE.Mesh; label: StageLabel };

const EXAMPLE_PICK: Days = { chemistry: 1, history: 3 }; // (Tue, Thu), as in the lesson
const SEED = 42438; // for the days of "Pick again"

// When each step starts, in seconds.
const SAME_DAY_STEP = 6.5;
const BACK_TO_BACK_STEP = 9.5;
const TOTAL_STEP = 12.5;
const STEP_STARTS = [0, SAME_DAY_STEP, BACK_TO_BACK_STEP, TOTAL_STEP];
const BETWEEN_RED_TILES = 0.25; // seconds from one tile turning red to the next

// When each part of a pick happens, in seconds from its start.
const CHEMISTRY_DROP = { from: 0, to: 0.9 };
const HISTORY_DROP = { from: 1.35, to: 2.25 };
const BANDS_GROW = { from: 2.5, to: 3.4 };
const FRAME_SHOWN = 3.4;

// Sizes and places, in floor units. Tiles are 1 apart, and the floor is
// centered on the origin.
const TILE_WIDTH = 0.9;
const FLOOR_EDGE = DAYS.length / 2;
const SLOT_OFFSET = FLOOR_EDGE + 0.75; // from the origin to the middle of a week's slots
const BLOCK = { width: 0.76, depth: 0.76, height: 0.3 };
const DROP_HEIGHT = 1;
const FLOOR_PATCH_EDGE = FLOOR_EDGE + 0.15; // the floor under the tiles reaches a little past them
// A band is as wide as a tile and faint, so the days on the tiles it
// crosses stay readable.
const BAND_OPACITY = 0.22;
// The dark frame around the tile that is the outcome: four thin lines that
// lie on the floor along the sides of the tile.
const FRAME_BAR = { width: 0.05, height: 0.03 };

const WHITE = 0xffffff;
const IN_EVENT = 0xefc3bb; // a light red, so the days on the tile stay readable

// Flat parts lie on the floor in layers, so that one is drawn over another.
const LAYER = { slot: 1, tile: 1, band: 2 };

// The time at which a tile turns red: the same-day tiles from Monday to
// Friday, then the back-to-back tiles, first those where the chemistry exam
// is the earlier one. A tile outside the event never turns red.
function turnsRedAt(days: Days): number {
  const daysApart = days.history - days.chemistry;
  if (daysApart === 0) return SAME_DAY_STEP + days.chemistry * BETWEEN_RED_TILES;
  if (daysApart === 1) return BACK_TO_BACK_STEP + days.chemistry * BETWEEN_RED_TILES;
  if (daysApart === -1) return BACK_TO_BACK_STEP + (DAYS.length - 1 + days.history) * BETWEEN_RED_TILES;
  return Infinity;
}

export default class ExamWeek extends Visual {
  protected build(figure: Figure): void {
    const stage = new Stage(figure, { halfWidth: 5.5, lookAt: [-0.7, 0.35, 0], azimuth: 8, elevation: 56, gridSize: 0 });

    // Chemistry's day runs left to right, and history's day runs from the
    // front of the floor to the back.
    const xOfChemistry = (day: number) => day - (DAYS.length - 1) / 2;
    const yOfHistory = (day: number) => (DAYS.length - 1) / 2 - day;
    const chemistryWeekY = SLOT_OFFSET;
    const historyWeekX = -SLOT_OFFSET;

    // The two weeks: five slots each, with the name of each day on the
    // outer side of its slot, and the exam's name outside the day names.
    DAYS.forEach((name, day) => {
      const chemistrySlot = { x: xOfChemistry(day), y: chemistryWeekY };
      const historySlot = { x: historyWeekX, y: yOfHistory(day) };
      for (const slot of [chemistrySlot, historySlot]) {
        stage.scene.add(flatRectangle(slot, { width: TILE_WIDTH, depth: TILE_WIDTH }, { color: palette.grid, opacity: 0.8 }, LAYER.slot));
      }
      stage.label(`<b>${name}</b>`).position.copy(floor(chemistrySlot.x, chemistrySlot.y + 0.95));
      stage.label(`<b>${name}</b>`).position.copy(floor(historySlot.x - 0.85, historySlot.y + 0.2));
    });
    stage.label(`${colored("chemistry", palette.blue)} exam`).position.copy(floor(0, chemistryWeekY + 1.5));
    stage.label(`${colored("history", palette.brass)}<br>exam`).position.copy(floor(historyWeekX - 1.7, 0.35));

    // The floor and its 25 tiles. tiles[tileNumber(days)] is the tile of one
    // outcome. The pair of days on a tile is written in onFrame, because it
    // is written shorter on a narrow canvas.
    stage.scene.add(
      floorPatch({ x: 0, y: 0 }, { width: DAYS.length + 0.3, depth: DAYS.length + 0.3 }, { color: palette.grid, opacity: 0.7 }),
    );
    const tileNumber = (days: Days) => days.history * DAYS.length + days.chemistry;
    const tiles: Tile[] = [];
    for (let history = 0; history < DAYS.length; history++) {
      for (let chemistry = 0; chemistry < DAYS.length; chemistry++) {
        const center = { x: xOfChemistry(chemistry), y: yOfHistory(history) };
        const patch = flatRectangle(center, { width: TILE_WIDTH, depth: TILE_WIDTH }, { color: WHITE, opacity: 1 }, LAYER.tile);
        stage.scene.add(patch);
        const label = stage.label("");
        // No chip behind the text, as on the tiles of event-sheets.ts.
        label.element.style.background = "none";
        label.element.style.padding = "0";
        label.position.copy(floor(center.x, center.y + 0.2));
        tiles.push({ days: { chemistry, history }, patch, label });
      }
    }

    // The parts of the pick that is being shown: two blocks, two bands, and
    // the frame around the outcome's tile.
    const chemistryBlock = block(0, chemistryWeekY, BLOCK, palette.blue);
    const historyBlock = block(historyWeekX, 0, BLOCK, palette.brass);
    const unitSquare = { width: 1, depth: 1 };
    const chemistryBand = flatRectangle({ x: 0, y: 0 }, unitSquare, { color: palette.blue, opacity: BAND_OPACITY }, LAYER.band);
    const historyBand = flatRectangle({ x: 0, y: 0 }, unitSquare, { color: palette.brass, opacity: BAND_OPACITY }, LAYER.band);
    const frame = new THREE.Group();
    for (const side of [-0.5, 0.5]) {
      const long = 1 + FRAME_BAR.width; // so that the bars meet at the corners
      frame.add(block(side, 0, { width: FRAME_BAR.width, depth: long, height: FRAME_BAR.height }, palette.dark));
      frame.add(block(0, side, { width: long, depth: FRAME_BAR.width, height: FRAME_BAR.height }, palette.dark));
    }
    stage.scene.add(chemistryBlock, historyBlock, chemistryBand, historyBand, frame);

    const timeline = figure.timeline(STEP_STARTS);

    // A pick made with the button. It has its own clock, and it stays on
    // the floor until the next pick or a replay. It is never the pair that
    // was shown last, so each press shows a different tile.
    const random = seededRandom(SEED);
    let pickedAgain: { days: Days; time: number } | undefined;
    figure.button("Pick again", () => {
      const last = pickedAgain?.days ?? EXAMPLE_PICK;
      let days = last;
      while (days.chemistry === last.chemistry && days.history === last.history) {
        days = { chemistry: Math.floor(random() * DAYS.length), history: Math.floor(random() * DAYS.length) };
      }
      pickedAgain = { days, time: 0 };
    });
    figure.button("Replay", () => {
      timeline.restart();
      pickedAgain = undefined;
    });
    figure.caption(
      `${colored("Blue", palette.blue)} is the chemistry exam and ${colored("brass", palette.brass)} is the ` +
        `history exam, and each tile is one way the two picks can come out. The ${colored("red", palette.red)} ` +
        `tiles are the 13 outcomes where the exams are on the same day or on back-to-back days.`,
    );

    const sameDayCount = tiles.filter((tile) => tile.days.chemistry === tile.days.history).length;
    const backToBackCount = tiles.filter((tile) => Math.abs(tile.days.chemistry - tile.days.history) === 1).length;

    stage.onFrame = (seconds) => {
      const time = timeline.advance(seconds);
      if (pickedAgain) pickedAgain.time += seconds;

      // The pick being shown: the one made with the button, or the example
      // pick during the first step, or none.
      let pick: { days: Days; time: number } | undefined = pickedAgain;
      if (!pick && time < SAME_DAY_STEP) pick = { days: EXAMPLE_PICK, time };
      const days = pick?.days ?? EXAMPLE_PICK;
      const pickTime = pick?.time ?? -1; // before the start of a pick, so no part of it is shown

      // The blue block falls into its day of the chemistry week, and then
      // the brass block into its day of the history week.
      const chemistryX = xOfChemistry(days.chemistry);
      const historyY = yOfHistory(days.history);
      chemistryBlock.visible = pickTime >= CHEMISTRY_DROP.from;
      chemistryBlock.position.copy(floor(chemistryX, chemistryWeekY, heightInFall(share(pickTime, CHEMISTRY_DROP))));
      historyBlock.visible = pickTime >= HISTORY_DROP.from;
      historyBlock.position.copy(floor(historyWeekX, historyY, heightInFall(share(pickTime, HISTORY_DROP))));

      // A band grows from each week across the floor, over the column or
      // row of the block's day.
      const grown = share(pickTime, BANDS_GROW);
      const bandLength = 2 * FLOOR_PATCH_EDGE * grown;
      chemistryBand.visible = historyBand.visible = grown > 0;
      chemistryBand.position.copy(floor(chemistryX, FLOOR_PATCH_EDGE - bandLength / 2, chemistryBand.position.y));
      chemistryBand.scale.set(TILE_WIDTH, 1, bandLength);
      historyBand.position.copy(floor(-FLOOR_PATCH_EDGE + bandLength / 2, historyY, historyBand.position.y));
      historyBand.scale.set(bandLength, 1, TILE_WIDTH);

      // The tile where the bands cross is the outcome, and the frame lies
      // around it.
      const framed = pickTime >= FRAME_SHOWN;
      frame.visible = framed;
      frame.position.copy(floor(chemistryX, historyY));

      const narrow = figure.canvasBox.clientWidth < NARROW_CANVAS;
      const names = narrow ? SHORT_DAYS : DAYS;
      const between = narrow ? "\u00b7" : ", ";
      for (const tile of tiles) {
        const pair = tinted(names[tile.days.chemistry], palette.blue) + between + tinted(names[tile.days.history], palette.brass);
        if (tile.label.element.innerHTML !== pair) tile.label.element.innerHTML = pair;
        (tile.patch.material as THREE.MeshBasicMaterial).color.set(time >= turnsRedAt(tile.days) ? IN_EVENT : WHITE);
        tile.label.element.style.fontSize = narrow ? NARROW_FONT_SIZE : "";
        tile.label.element.style.fontWeight = framed && tile === tiles[tileNumber(days)] ? "700" : "";
      }

      const pairOfDays = `<b>(${DAYS[days.chemistry]}, ${DAYS[days.history]})</b>`;
      if (pickedAgain) {
        const daysApart = Math.abs(days.chemistry - days.history);
        let where = "at least one day lies between the exams";
        if (daysApart === 1) where = "the exams are on back-to-back days";
        if (daysApart === 0) where = "the exams are on the same day";
        figure.readout(framed ? `${pairOfDays}: ${where}.` : "The computer picks a day for each exam.");
      } else if (time < SAME_DAY_STEP) {
        figure.readout(`One pick of the two days is one tile: ${pairOfDays}.`);
      } else if (time < BACK_TO_BACK_STEP) {
        figure.readout(`Same day: <b>${sameDayCount} outcomes</b>.`);
      } else if (time < TOTAL_STEP) {
        figure.readout(`Back-to-back days: <b>${backToBackCount} outcomes</b>.`);
      } else {
        const total = colored(String(sameDayCount + backToBackCount), palette.red);
        figure.readout(
          `Same day or back-to-back days: ${sameDayCount} + ${backToBackCount} = ` +
            `<b>${total} of the ${OUTCOMES} outcomes</b>.`,
        );
      }
    };
  }
}

// How far a pick is through the part of it that runs from `part.from` to
// `part.to`, at `seconds` from its start: 0 before the part, 1 after it.
function share(seconds: number, part: { from: number; to: number }): number {
  return THREE.MathUtils.clamp((seconds - part.from) / (part.to - part.from), 0, 1);
}

// The height of a falling block. It speeds up as it falls, and is on the
// floor when `fallen` is 1.
function heightInFall(fallen: number): number {
  return DROP_HEIGHT * (1 - fallen * fallen);
}

// Bold text in one of the figure's colors, for a label, the readout, or
// the caption.
function colored(text: string, color: number): string {
  return `<b style="color: ${cssColor(color)}">${text}</b>`;
}

// The same without the bold, for the pair of days on a tile.
function tinted(text: string, color: number): string {
  return `<span style="color: ${cssColor(color)}">${text}</span>`;
}

// A rectangle painted on the floor. A higher layer is drawn over a lower one.
function flatRectangle(
  center: { x: number; y: number },
  size: { width: number; depth: number },
  look: { color: number; opacity: number },
  layer: number,
): THREE.Mesh {
  const rectangle = new THREE.PlaneGeometry(size.width, size.depth);
  rectangle.rotateX(-Math.PI / 2); // lay it flat on the floor
  const material = new THREE.MeshBasicMaterial({ color: look.color, opacity: look.opacity, transparent: true, depthWrite: false });
  const mesh = new THREE.Mesh(rectangle, material);
  mesh.position.copy(floor(center.x, center.y, 0.006 + layer * 0.003));
  mesh.renderOrder = layer;
  return mesh;
}
