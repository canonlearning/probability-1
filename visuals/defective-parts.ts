// 1000 parts are made on three machines, and the defective ones are set apart.
//
// Each square is one part. The parts land in three bays, one for each
// machine, and a bay is as wide as its machine's share of the parts. The
// defective parts are scattered through each bay, so a bay with more
// defective parts in every row looks darker. Then the defective parts leave
// their bays and line up at the front in columns of ten, where they can be
// counted.

import { cssColor, evenSteps, floor, floorPatch, palette, seededRandom, solid, Stage, THREE, Visual, type Figure } from "canon";

// The numbers of the example. They match the lesson text.
const MACHINES = [
  { name: "machine 1", parts: 600, defective: 40, defectiveColor: palette.dark },
  { name: "machine 2", parts: 300, defective: 30, defectiveColor: palette.dark },
  { name: "machine 3", parts: 100, defective: 20, defectiveColor: palette.red },
];
const PARTS = 1000;
const DEFECTIVE = 90;
const GOOD_COLOR = 0xd3cebf;

// Timing, in seconds. The figure goes through four steps, numbered 0 to 3.
const STEP_TIME = 5;
const LAST_STEP = 3;
const MAKING_TIME = 3.5; // how long it takes all the parts to be made
const DROP_TIME = 0.5; // one part, from the air to the floor
const MOVE_TIME = 1.6; // one defective part, from its bay to the front

// Sizes and places, in floor units. The back of the scene is the top of
// the picture.
const BOX = 0.2; // a part is a flat square plate, this wide
const THICKNESS = 0.08;
const BAY_SPACING = 0.3;
const BAY_ROWS = 20;
const BAY_BACK = -5.6;
const BAY_GAP = 0.9;
const BAYS_LEFT = -(50 * BAY_SPACING + 2 * BAY_GAP) / 2;
const FRONT_SPACING = 0.46;
const FRONT_SCALE = 1.5; // a part at the front is drawn this much larger
const FRONT_ROWS = 10;
const FRONT_BACK = 2.2;
const FRONT_GAP = 1.5; // between the columns of two machines

type Part = {
  machine: number;
  defective: boolean;
  startTime: number;
  inBay: THREE.Vector3;
  // Where a defective part goes, and how long after the others it sets off.
  atFront?: THREE.Vector3;
  moveDelay: number;
};

export default class DefectiveParts extends Visual {
  protected build(figure: Figure): void {
    const stage = new Stage(figure, { halfWidth: 10.6, lookAt: [0, -0.9, 0], azimuth: 0, elevation: 44, gridSize: 0 });

    const bays = bayPlaces();
    const front = frontPlaces();
    for (const bay of bays) {
      stage.scene.add(floorPatch(bay.center, bay.size, { color: palette.muted, opacity: 0.16 }));
    }
    // The patch at the front appears when the defective parts move there.
    const frontPatch = floorPatch(front.center, front.size, { color: palette.brass, opacity: 0 });
    stage.scene.add(frontPatch);

    const parts = createParts(bays, front.columnLeft);
    const boxes = new THREE.InstancedMesh(new THREE.BoxGeometry(BOX, THICKNESS, BOX), solid(0xffffff), PARTS);
    boxes.frustumCulled = false;
    stage.scene.add(boxes);

    // A label behind each bay, one in front of each machine's columns at
    // the front, and one beside the front.
    const bayLabels = bays.map((bay) => {
      const label = stage.label("");
      label.position.copy(floor(bay.center.x, BAY_BACK - 0.35));
      return label;
    });
    const frontLabels = MACHINES.map((machine, index) => {
      const label = stage.label("");
      const middle = front.columnLeft[index] + ((machine.defective / FRONT_ROWS) * FRONT_SPACING) / 2;
      label.position.copy(floor(middle, FRONT_BACK + FRONT_ROWS * FRONT_SPACING + 2));
      return label;
    });
    const frontTitle = stage.label(`<b>defective</b><br>${DEFECTIVE} parts`);
    frontTitle.position.copy(floor(front.center.x - front.size.width / 2 - 1.5, front.center.y + 0.5));

    const timeline = figure.timeline(evenSteps(LAST_STEP + 1, STEP_TIME));
    figure.button("Replay", () => {
      timeline.restart();
    });
    figure.caption(
      `Each square is one of ${PARTS} parts, in the bay of the machine that made it. A light ` +
        `part is good. A dark or red part is defective, and the red ones were made by ` +
        `machine 3. Drag to turn the view.`,
    );

    const placement = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const size = new THREE.Vector3();
    const noTurn = new THREE.Quaternion();
    const color = new THREE.Color();
    const goodColor = new THREE.Color(GOOD_COLOR);

    stage.onFrame = (seconds) => {
      const time = timeline.advance(seconds);
      const step = Math.min(Math.floor(time / STEP_TIME), LAST_STEP);
      // How far the defective parts have changed color, from 0 to 1.
      const colored = THREE.MathUtils.clamp(time - STEP_TIME, 0, 1);

      (frontPatch.material as THREE.MeshBasicMaterial).opacity = 0.18 * THREE.MathUtils.clamp(time - 2 * STEP_TIME, 0, 1);

      const made = [0, 0, 0];
      parts.forEach((part, index) => {
        const sinceStart = time - part.startTime;
        if (sinceStart < 0) {
          placement.makeScale(0, 0, 0); // not made yet, so hidden
        } else {
          made[part.machine] += 1;
          // The part drops into its place in the bay.
          const dropped = smooth(Math.min(sinceStart / DROP_TIME, 1));
          position.copy(part.inBay);
          position.y += 2.5 * (1 - dropped);
          let scale = 1;
          // In step 2 a defective part moves to the front in an arc.
          if (part.atFront) {
            const moved = smooth(THREE.MathUtils.clamp((time - 2 * STEP_TIME - part.moveDelay) / MOVE_TIME, 0, 1));
            position.lerp(part.atFront, moved);
            position.y += 1.2 * 4 * moved * (1 - moved);
            scale = 1 + (FRONT_SCALE - 1) * moved;
          }
          placement.compose(position, noTurn, size.setScalar(scale));
        }
        boxes.setMatrixAt(index, placement);

        color.copy(goodColor);
        if (part.defective) color.lerp(new THREE.Color(MACHINES[part.machine].defectiveColor), colored);
        boxes.setColorAt(index, color);
      });
      boxes.instanceMatrix.needsUpdate = true;
      boxes.instanceColor!.needsUpdate = true;

      MACHINES.forEach((machine, index) => {
        const count = step >= 1 ? `<b>${machine.defective}</b> of ${machine.parts}<br>defective` : `<b>${made[index]}</b>`;
        bayLabels[index].element.innerHTML = `${machine.name}<br>${count}`;
        const arrived = time >= 2 * STEP_TIME + MOVE_TIME + 1;
        frontLabels[index].shown = arrived;
        frontLabels[index].element.innerHTML =
          step < 3
            ? `${machine.name}<br><b>${machine.defective}</b>`
            : `${machine.name}<br><b style="color: ${cssColor(machine.defectiveColor)}">${machine.defective} of ${DEFECTIVE}</b>`;
      });
      frontTitle.shown = step >= 2;

      const [first, second, third] = MACHINES;
      figure.readout(
        [
          `<b>${made[0] + made[1] + made[2]}</b> parts made · machine 1 <b>${made[0]}</b> · machine 2 <b>${made[1]}</b> · machine 3 <b>${made[2]}</b>`,
          `Defective parts: <b>${first.defective}</b> of ${first.parts}, <b>${second.defective}</b> of ${second.parts}, and <b>${third.defective}</b> of ${third.parts}.`,
          `We keep only the defective parts: <b>${first.defective} + ${second.defective} + ${third.defective} = ${DEFECTIVE}</b>.`,
          `Machine 3 made <b>${third.defective} of the ${DEFECTIVE}</b> defective parts, which is <b style="color: ${cssColor(palette.red)}">2/9</b>.`,
        ][step],
      );
    };
  }
}

// The three bays, side by side. A bay is 20 parts deep, and as many
// columns wide as it needs for its machine's parts.
function bayPlaces() {
  let left = BAYS_LEFT;
  return MACHINES.map((machine) => {
    const columns = machine.parts / BAY_ROWS;
    const width = columns * BAY_SPACING;
    const bay = {
      left,
      columns,
      center: { x: left + width / 2, y: BAY_BACK + (BAY_ROWS * BAY_SPACING) / 2 },
      size: { width: width + 0.2, depth: BAY_ROWS * BAY_SPACING + 0.2 },
    };
    left += width + BAY_GAP;
    return bay;
  });
}

// The front, where the defective parts line up in columns of ten, with a
// gap between the columns of two machines.
function frontPlaces() {
  const width = (DEFECTIVE / FRONT_ROWS) * FRONT_SPACING + (MACHINES.length - 1) * FRONT_GAP;
  const columnLeft: number[] = [];
  let left = -width / 2;
  for (const machine of MACHINES) {
    columnLeft.push(left);
    left += (machine.defective / FRONT_ROWS) * FRONT_SPACING + FRONT_GAP;
  }
  const depth = FRONT_ROWS * FRONT_SPACING;
  return {
    columnLeft,
    center: { x: 0, y: FRONT_BACK + depth / 2 },
    size: { width: width + 0.5, depth: depth + 0.5 },
  };
}

// Creates the 1000 parts. The counts are exact and not random draws. Only
// which places in a bay hold the defective parts, and the order in which
// the parts are made, are random.
function createParts(bays: ReturnType<typeof bayPlaces>, frontColumnLeft: number[]): Part[] {
  const random = seededRandom(7);
  const parts: Part[] = [];

  MACHINES.forEach((machine, machineIndex) => {
    const bay = bays[machineIndex];
    const places = Array.from({ length: machine.parts }, (_, place) => place);
    shuffle(places, random);
    // The first places of the shuffled list hold the defective parts. They
    // go to the front in order from left to right, so that their paths do
    // not cross more than they must.
    const defectivePlaces = places.slice(0, machine.defective).sort((a, b) => a - b);

    places.forEach((place) => {
      const column = Math.floor(place / BAY_ROWS);
      const row = place % BAY_ROWS;
      const part: Part = {
        machine: machineIndex,
        defective: false,
        startTime: 0,
        inBay: floor(bay.left + (column + 0.5) * BAY_SPACING, BAY_BACK + (row + 0.5) * BAY_SPACING, THICKNESS / 2),
        moveDelay: 0,
      };
      const defectiveNumber = defectivePlaces.indexOf(place);
      if (defectiveNumber >= 0) {
        const frontColumn = Math.floor(defectiveNumber / FRONT_ROWS);
        const frontRow = defectiveNumber % FRONT_ROWS;
        part.defective = true;
        part.atFront = floor(
          frontColumnLeft[machineIndex] + (frontColumn + 0.5) * FRONT_SPACING,
          FRONT_BACK + (frontRow + 0.5) * FRONT_SPACING,
          (THICKNESS * FRONT_SCALE) / 2,
        );
        part.moveDelay = defectiveNumber * 0.025;
      }
      parts.push(part);
    });
  });

  // The parts are made in a random order, at an even pace.
  const order = parts.map((_, index) => index);
  shuffle(order, random);
  order.forEach((partIndex, turn) => {
    parts[partIndex].startTime = (turn / PARTS) * MAKING_TIME;
  });
  return parts;
}

function shuffle<T>(items: T[], random: () => number): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

// Starts and ends a movement gently.
function smooth(amount: number): number {
  return amount * amount * (3 - 2 * amount);
}
