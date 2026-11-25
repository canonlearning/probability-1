// A two-way table of counts, with one ball for each person or thing.
//
// The balls drop into the cells of the table. Then the figure counts the
// balls of the first cell (first row, first column) three ways: among
// everyone, among its column only, and among its row only. A brass patch
// marks the group being counted, and the balls outside it fade. The same
// red balls are a different share each time.
//
// The table is written on the ::visual line, with the counts row by row:
//
//   ::visual{name="crowd-table" one="student" many="students"
//     rows="instrument, no instrument" columns="choir, no choir"
//     counts="20, 20; 10, 70"}

import { floor, floorPatch, palette, reduce, seededRandom, solid, Stage, THREE, Visual, type Figure } from "canon";

// Timing, in seconds. The balls arrive, and then the figure goes through
// four steps: everyone, the column, the row, and all three side by side.
const ARRIVE_TIME = 3; // from the first ball to the last
const FALL_TIME = 0.6;
const FIRST_STEP_AT = 4.5;
const STEP_TIME = 3.5;
const LAST_STEP = 4;
const CHANGE_RATE = 6; // how quickly balls fade and patches appear

// Sizes, in floor units.
const CELL_WIDTH = 3;
// A cell is 10 balls wide, and at most 10 deep. A crowd of more than 500
// uses smaller balls, 20 to a side, so that a full cell stays low.
const LARGE_CROWD = 500;
const COLUMN_GAP = 0.9;
const ROW_GAP = 1.1;
const FALL_HEIGHT = 4;

const FADED_COLOR = 0xdddbd4;
const PATCH_OPACITY = 0.3;

// How the balls are packed into a cell.
type Packing = { ballsPerSide: number; spacing: number; radius: number };

type Cell = { row: number; column: number; count: number; x: number; back: number };

type Ball = {
  cell: Cell;
  restingPlace: THREE.Vector3;
  startTime: number;
  faded: number; // 0 for full color, 1 for faded
};

export default class CrowdTable extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The crowd table needs ${name}="..." on its ::visual line.`);
      return value;
    };
    const one = setting("one");
    const many = setting("many");
    const rowNames = listFrom(setting("rows"), ",");
    const columnNames = listFrom(setting("columns"), ",");
    const counts = listFrom(setting("counts"), ";").map((row) => listFrom(row, ",").map(Number));
    if (counts.length !== rowNames.length || counts.some((row) => row.length !== columnNames.length)) {
      throw new Error(`The crowd table needs one count for each row and column, as in counts="20, 20; 10, 70".`);
    }

    const grandTotal = counts.flat().reduce((sum, count) => sum + count, 0);
    const ballsPerSide = grandTotal > LARGE_CROWD ? 20 : 10;
    const spacing = CELL_WIDTH / ballsPerSide;
    const packing: Packing = { ballsPerSide, spacing, radius: spacing * 0.43 };

    // Lay out the table. Every column is one cell wide. A row is as deep
    // as its fullest cell.
    const tableWidth = columnNames.length * CELL_WIDTH + (columnNames.length - 1) * COLUMN_GAP;
    const rowDepths = counts.map((row) => Math.max(...row.map((count) => depthOfCell(count, packing))));
    const tableDepth = rowDepths.reduce((sum, depth) => sum + depth, 0) + (rowNames.length - 1) * ROW_GAP;
    const left = -tableWidth / 2 + 0.8;
    const back = -tableDepth / 2;

    const cells: Cell[] = [];
    let rowBack = back;
    counts.forEach((row, rowIndex) => {
      row.forEach((count, columnIndex) => {
        const x = left + columnIndex * (CELL_WIDTH + COLUMN_GAP) + CELL_WIDTH / 2;
        cells.push({ row: rowIndex, column: columnIndex, count, x, back: rowBack });
      });
      rowBack += rowDepths[rowIndex] + ROW_GAP;
    });
    const total = cells.reduce((sum, cell) => sum + cell.count, 0);
    const askedCell = cells[0];
    const columnTotal = cells.filter((cell) => cell.column === 0).reduce((sum, cell) => sum + cell.count, 0);
    const rowTotal = cells.filter((cell) => cell.row === 0).reduce((sum, cell) => sum + cell.count, 0);

    const stage = new Stage(figure, {
      // Wide enough for the table and its row names, and tall enough for
      // its depth as seen from this angle.
      halfWidth: Math.max(tableWidth / 2 + 2.1, tableDepth * 0.6 + 2.2),
      lookAt: [-0.5, 0.5, 0],
      azimuth: -10,
      elevation: 50,
      gridSize: 30,
    });

    // The names of the columns along the back, and of the rows on the left.
    columnNames.forEach((name, column) => {
      stage.label(`<b>${name}</b>`).position.copy(floor(cells[column].x, back - 0.15));
    });
    rowNames.forEach((name, row) => {
      const firstCell = cells[row * columnNames.length];
      stage.label(`<b>${name}</b>`).position.copy(floor(left - 1.5, firstCell.back + rowDepths[row] / 2 + 0.3));
    });
    // The count of each cell, in front of it.
    const countLabels = cells.map((cell) => {
      const label = stage.label("");
      label.position.copy(floor(cell.x, cell.back + rowDepths[cell.row] + 0.75));
      return label;
    });
    // A pale patch under each cell, so the table shows before it fills.
    for (const cell of cells) {
      stage.scene.add(
        floorPatch(
          { x: cell.x, y: cell.back + rowDepths[cell.row] / 2 },
          { width: CELL_WIDTH + 0.2, depth: rowDepths[cell.row] + 0.2 },
          { color: palette.grid, opacity: 0.8 },
        ),
      );
    }

    // The three groups a ball can be counted in: everyone, the first
    // column, and the first row. Each has a patch on the floor under it.
    const margin = 0.35;
    const patchOver = (width: number, depth: number, x: number, y: number) => {
      const patch = floorPatch({ x, y }, { width, depth }, { color: palette.brass, opacity: 0 });
      stage.scene.add(patch);
      return patch;
    };
    const tableCenter = left + tableWidth / 2;
    const patches = [
      patchOver(tableWidth + 2 * margin, tableDepth + 2 * margin, tableCenter, 0),
      patchOver(CELL_WIDTH + 2 * margin, tableDepth + 2 * margin, askedCell.x, 0),
      patchOver(tableWidth + 2 * margin, rowDepths[0] + 2 * margin, tableCenter, back + rowDepths[0] / 2),
    ];
    // Whether a ball is in the group that step 1, 2, or 3 counts.
    const inGroup = [
      () => true,
      (cell: Cell) => cell.column === 0,
      (cell: Cell) => cell.row === 0,
    ];

    // One ball for each person, arriving in a random order.
    const balls: Ball[] = cells.flatMap((cell) =>
      Array.from({ length: cell.count }, (_, index) => ({
        cell,
        restingPlace: placeInCell(cell, index, packing),
        startTime: 0,
        faded: 0,
      })),
    );
    const arrivalOrder = balls.map((_, index) => index);
    shuffle(arrivalOrder, seededRandom(1));
    arrivalOrder.forEach((ballIndex, position) => {
      balls[ballIndex].startTime = (position / total) * ARRIVE_TIME;
    });

    const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(packing.radius, 12, 9), solid(0xffffff), total);
    mesh.frustumCulled = false;
    stage.scene.add(mesh);

    // Step 0 is the balls arriving. The four steps after it are even.
    const timeline = figure.timeline([
      0,
      ...Array.from({ length: LAST_STEP }, (_, step) => FIRST_STEP_AT + step * STEP_TIME),
    ]);
    figure.button("Replay", () => {
      timeline.restart();
      for (const ball of balls) ball.faded = 0;
    });
    const both = `"${rowNames[0]}" and "${columnNames[0]}"`;
    figure.caption(
      `Each ball is one ${one}. The red balls are the ${many} in both ${both}. The brass ` +
        `patch marks the group that is counted on the bottom of the fraction.`,
    );

    const share = (bottom: number) => {
      const reduced = reduce({ top: askedCell.count, bottom });
      // A simple fraction is shown reduced, and any other as a percentage.
      if (reduced.bottom <= 20) return `${askedCell.count}/${bottom} = ${reduced.top}/${reduced.bottom}`;
      return `${askedCell.count}/${bottom} ≈ ${Math.round((100 * askedCell.count) / bottom)}%`;
    };

    const placement = new THREE.Matrix4();
    const color = new THREE.Color();
    const fadedColor = new THREE.Color(FADED_COLOR);
    stage.onFrame = (seconds) => {
      const time = timeline.advance(seconds);
      const step = time < FIRST_STEP_AT ? 0 : Math.min(1 + Math.floor((time - FIRST_STEP_AT) / STEP_TIME), LAST_STEP);
      const amount = 1 - Math.exp(-seconds * CHANGE_RATE);

      const arrived = cells.map(() => 0);
      balls.forEach((ball, index) => {
        // The ball drops onto its place, faster as it falls.
        const fallen = THREE.MathUtils.clamp((time - ball.startTime) / FALL_TIME, 0, 1);
        if (time < ball.startTime) placement.makeScale(0, 0, 0); // not here yet
        else {
          const height = ball.restingPlace.y + FALL_HEIGHT * (1 - fallen * fallen);
          placement.makeTranslation(ball.restingPlace.x, height, ball.restingPlace.z);
        }
        mesh.setMatrixAt(index, placement);
        if (fallen === 1) arrived[cells.indexOf(ball.cell)] += 1;

        // From step 1 the balls of the asked cell are red. In steps 2 and
        // 3 the balls outside the counted group fade.
        const counted = step === 0 || step === LAST_STEP || inGroup[step - 1](ball.cell);
        ball.faded += ((counted ? 0 : 1) - ball.faded) * amount;
        color.set(step >= 1 && ball.cell === askedCell ? palette.red : palette.muted);
        color.lerp(fadedColor, ball.faded);
        mesh.setColorAt(index, color);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.instanceColor!.needsUpdate = true;

      patches.forEach((patch, index) => {
        const material = patch.material as THREE.MeshBasicMaterial;
        const target = step === index + 1 ? PATCH_OPACITY : 0;
        material.opacity += (target - material.opacity) * amount;
      });

      cells.forEach((cell, index) => {
        const label = countLabels[index];
        label.element.innerHTML = `<b>${arrived[index]}</b>`;
        const counted = step === 0 || step === LAST_STEP || inGroup[step - 1](cell);
        label.element.classList.toggle("dim", !counted);
      });

      const count = askedCell.count;
      figure.readout(
        [
          `<b>${arrived.reduce((sum, here) => sum + here, 0)}</b> of ${total} ${many}`,
          `Nothing is known, so we count everyone: <b>${count} of ${total}</b> are ${both}. ${share(total)}`,
          `Given "${columnNames[0]}", only that column is left: <b>${count} of ${columnTotal}</b>. ${share(columnTotal)}`,
          `Given "${rowNames[0]}", only that row is left: <b>${count} of ${rowTotal}</b>. ${share(rowTotal)}`,
          `The same <b>${count}</b> ${many} are ${count}/${total} of everyone, ` +
            `${count}/${columnTotal} of "${columnNames[0]}", and ${count}/${rowTotal} of "${rowNames[0]}".`,
        ][step],
      );
    };
  }
}

function listFrom(written: string, separator: string): string[] {
  return written.split(separator).map((item) => item.trim());
}

// How deep a cell with `count` balls is on the floor. A cell fills one
// layer, then the layer above it.
function depthOfCell(count: number, packing: Packing): number {
  const rows = Math.min(Math.ceil(count / packing.ballsPerSide), packing.ballsPerSide);
  return rows * packing.spacing;
}

function placeInCell(cell: Cell, index: number, packing: Packing): THREE.Vector3 {
  const { ballsPerSide, spacing, radius } = packing;
  const acrossStep = index % ballsPerSide;
  const deepStep = Math.floor(index / ballsPerSide) % ballsPerSide;
  const layer = Math.floor(index / ballsPerSide ** 2);
  return floor(
    cell.x - CELL_WIDTH / 2 + (acrossStep + 0.5) * spacing,
    cell.back + (deepStep + 0.5) * spacing,
    radius + layer * spacing,
  );
}

function shuffle<T>(items: T[], random: () => number): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}
