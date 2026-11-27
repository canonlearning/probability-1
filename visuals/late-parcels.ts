// 1000 parcels are sent with three couriers, and the late ones are set apart.
//
// Each square is one parcel. The parcels land in three bays, one for each
// courier, and a bay is as wide as its courier's share of the parcels. The
// late parcels are scattered through each bay, so a bay with more late
// parcels in every row looks darker. Then the late parcels leave their bays
// and line up at the front in columns of ten, where they can be counted.

import { cssColor, evenSteps, floor, floorPatch, palette, seededRandom, solid, Stage, THREE, Visual, type Figure } from "canon";

// The numbers of the example. They match the lesson text.
const COURIERS = [
  { name: "courier 1", parcels: 600, late: 40, lateColor: palette.dark },
  { name: "courier 2", parcels: 300, late: 30, lateColor: palette.dark },
  { name: "courier 3", parcels: 100, late: 20, lateColor: palette.red },
];
const PARCELS = 1000;
const LATE = 90;
const ON_TIME_COLOR = 0xd3cebf;

// Timing, in seconds. The figure goes through four steps, numbered 0 to 3.
const STEP_TIME = 5;
const LAST_STEP = 3;
const ARRIVING_TIME = 3.5; // how long it takes all the parcels to be sent
const DROP_TIME = 0.5; // one parcel, from the air to the floor
const MOVE_TIME = 1.6; // one late parcel, from its bay to the front

// Sizes and places, in floor units. The back of the scene is the top of
// the picture.
const BOX = 0.2; // a parcel is a flat square packet, this wide
const THICKNESS = 0.08;
const BAY_SPACING = 0.3;
const BAY_ROWS = 20;
const BAY_BACK = -5.6;
const BAY_GAP = 0.9;
const BAYS_LEFT = -(50 * BAY_SPACING + 2 * BAY_GAP) / 2;
const FRONT_SPACING = 0.46;
const FRONT_SCALE = 1.5; // a parcel at the front is drawn this much larger
const FRONT_ROWS = 10;
const FRONT_BACK = 2.2;
const FRONT_GAP = 1.5; // between the columns of two couriers

type Parcel = {
  courier: number;
  late: boolean;
  startTime: number;
  inBay: THREE.Vector3;
  // Where a late parcel goes, and how long after the others it sets off.
  atFront?: THREE.Vector3;
  moveDelay: number;
};

export default class LateParcels extends Visual {
  protected build(figure: Figure): void {
    const stage = new Stage(figure, { halfWidth: 10.6, lookAt: [0, -0.9, 0], azimuth: 0, elevation: 44, gridSize: 0 });

    const bays = bayPlaces();
    const front = frontPlaces();
    for (const bay of bays) {
      stage.scene.add(floorPatch(bay.center, bay.size, { color: palette.muted, opacity: 0.16 }));
    }
    // The patch at the front appears when the late parcels move there.
    const frontPatch = floorPatch(front.center, front.size, { color: palette.brass, opacity: 0 });
    stage.scene.add(frontPatch);

    const parcels = createParcels(bays, front.columnLeft);
    const boxes = new THREE.InstancedMesh(new THREE.BoxGeometry(BOX, THICKNESS, BOX), solid(0xffffff), PARCELS);
    boxes.frustumCulled = false;
    stage.scene.add(boxes);

    // A label behind each bay, one in front of each courier's columns at
    // the front, and one beside the front.
    const bayLabels = bays.map((bay) => {
      const label = stage.label("");
      label.position.copy(floor(bay.center.x, BAY_BACK - 0.35));
      return label;
    });
    const frontLabels = COURIERS.map((courier, index) => {
      const label = stage.label("");
      const middle = front.columnLeft[index] + ((courier.late / FRONT_ROWS) * FRONT_SPACING) / 2;
      label.position.copy(floor(middle, FRONT_BACK + FRONT_ROWS * FRONT_SPACING + 2));
      return label;
    });
    const frontTitle = stage.label(`<b>late</b><br>${LATE} parcels`);
    frontTitle.position.copy(floor(front.center.x - front.size.width / 2 - 1.5, front.center.y + 0.5));

    const timeline = figure.timeline(evenSteps(LAST_STEP + 1, STEP_TIME));
    figure.button("Replay", () => {
      timeline.restart();
    });
    figure.caption(
      `Each square is one of ${PARCELS} parcels, in the bay of the courier that carried it. A light ` +
        `parcel arrived on time. A dark or red parcel arrived late, and the red ones came with ` +
        `courier 3. Drag to turn the view.`,
    );

    const placement = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const size = new THREE.Vector3();
    const noTurn = new THREE.Quaternion();
    const color = new THREE.Color();
    const onTimeColor = new THREE.Color(ON_TIME_COLOR);

    stage.onFrame = (seconds) => {
      const time = timeline.advance(seconds);
      const step = Math.min(Math.floor(time / STEP_TIME), LAST_STEP);
      // How far the late parcels have changed color, from 0 to 1.
      const colored = THREE.MathUtils.clamp(time - STEP_TIME, 0, 1);

      (frontPatch.material as THREE.MeshBasicMaterial).opacity = 0.18 * THREE.MathUtils.clamp(time - 2 * STEP_TIME, 0, 1);

      const sent = [0, 0, 0];
      parcels.forEach((parcel, index) => {
        const sinceStart = time - parcel.startTime;
        if (sinceStart < 0) {
          placement.makeScale(0, 0, 0); // not sent yet, so hidden
        } else {
          sent[parcel.courier] += 1;
          // The parcel drops into its place in the bay.
          const dropped = smooth(Math.min(sinceStart / DROP_TIME, 1));
          position.copy(parcel.inBay);
          position.y += 2.5 * (1 - dropped);
          let scale = 1;
          // In step 2 a late parcel moves to the front in an arc.
          if (parcel.atFront) {
            const moved = smooth(THREE.MathUtils.clamp((time - 2 * STEP_TIME - parcel.moveDelay) / MOVE_TIME, 0, 1));
            position.lerp(parcel.atFront, moved);
            position.y += 1.2 * 4 * moved * (1 - moved);
            scale = 1 + (FRONT_SCALE - 1) * moved;
          }
          placement.compose(position, noTurn, size.setScalar(scale));
        }
        boxes.setMatrixAt(index, placement);

        color.copy(onTimeColor);
        if (parcel.late) color.lerp(new THREE.Color(COURIERS[parcel.courier].lateColor), colored);
        boxes.setColorAt(index, color);
      });
      boxes.instanceMatrix.needsUpdate = true;
      boxes.instanceColor!.needsUpdate = true;

      COURIERS.forEach((courier, index) => {
        const count = step >= 1 ? `<b>${courier.late}</b> of ${courier.parcels} late` : `<b>${sent[index]}</b>`;
        bayLabels[index].element.innerHTML = `${courier.name}<br>${count}`;
        const arrived = time >= 2 * STEP_TIME + MOVE_TIME + 1;
        frontLabels[index].shown = arrived;
        frontLabels[index].element.innerHTML =
          step < 3
            ? `${courier.name}<br><b>${courier.late}</b>`
            : `${courier.name}<br><b style="color: ${cssColor(courier.lateColor)}">${courier.late} of ${LATE}</b>`;
      });
      frontTitle.shown = step >= 2;

      const [first, second, third] = COURIERS;
      figure.readout(
        [
          `<b>${sent[0] + sent[1] + sent[2]}</b> parcels sent · courier 1 <b>${sent[0]}</b> · courier 2 <b>${sent[1]}</b> · courier 3 <b>${sent[2]}</b>`,
          `Late parcels: <b>${first.late}</b> of ${first.parcels}, <b>${second.late}</b> of ${second.parcels}, and <b>${third.late}</b> of ${third.parcels}.`,
          `We keep only the late parcels: <b>${first.late} + ${second.late} + ${third.late} = ${LATE}</b>.`,
          `Courier 3 carried <b>${third.late} of the ${LATE}</b> late parcels, which is <b style="color: ${cssColor(palette.red)}">2/9</b>.`,
        ][step],
      );
    };
  }
}

// The three bays, side by side. A bay is 20 parcels deep, and as many
// columns wide as it needs for its courier's parcels.
function bayPlaces() {
  let left = BAYS_LEFT;
  return COURIERS.map((courier) => {
    const columns = courier.parcels / BAY_ROWS;
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

// The front, where the late parcels line up in columns of ten, with a gap
// between the columns of two couriers.
function frontPlaces() {
  const width = (LATE / FRONT_ROWS) * FRONT_SPACING + (COURIERS.length - 1) * FRONT_GAP;
  const columnLeft: number[] = [];
  let left = -width / 2;
  for (const courier of COURIERS) {
    columnLeft.push(left);
    left += (courier.late / FRONT_ROWS) * FRONT_SPACING + FRONT_GAP;
  }
  const depth = FRONT_ROWS * FRONT_SPACING;
  return {
    columnLeft,
    center: { x: 0, y: FRONT_BACK + depth / 2 },
    size: { width: width + 0.5, depth: depth + 0.5 },
  };
}

// Makes the 1000 parcels. The counts are exact and not random draws. Only
// which places in a bay hold the late parcels, and the order in which the
// parcels are sent, are random.
function createParcels(bays: ReturnType<typeof bayPlaces>, frontColumnLeft: number[]): Parcel[] {
  const random = seededRandom(7);
  const parcels: Parcel[] = [];

  COURIERS.forEach((courier, courierIndex) => {
    const bay = bays[courierIndex];
    const places = Array.from({ length: courier.parcels }, (_, place) => place);
    shuffle(places, random);
    // The first places of the shuffled list hold the late parcels. They go
    // to the front in order from left to right, so that their paths do not
    // cross more than they must.
    const latePlaces = places.slice(0, courier.late).sort((a, b) => a - b);

    places.forEach((place) => {
      const column = Math.floor(place / BAY_ROWS);
      const row = place % BAY_ROWS;
      const parcel: Parcel = {
        courier: courierIndex,
        late: false,
        startTime: 0,
        inBay: floor(bay.left + (column + 0.5) * BAY_SPACING, BAY_BACK + (row + 0.5) * BAY_SPACING, THICKNESS / 2),
        moveDelay: 0,
      };
      const lateNumber = latePlaces.indexOf(place);
      if (lateNumber >= 0) {
        const frontColumn = Math.floor(lateNumber / FRONT_ROWS);
        const frontRow = lateNumber % FRONT_ROWS;
        parcel.late = true;
        parcel.atFront = floor(
          frontColumnLeft[courierIndex] + (frontColumn + 0.5) * FRONT_SPACING,
          FRONT_BACK + (frontRow + 0.5) * FRONT_SPACING,
          (THICKNESS * FRONT_SCALE) / 2,
        );
        parcel.moveDelay = lateNumber * 0.025;
      }
      parcels.push(parcel);
    });
  });

  // The parcels are sent in a random order, at an even pace.
  const order = parcels.map((_, index) => index);
  shuffle(order, random);
  order.forEach((parcelIndex, turn) => {
    parcels[parcelIndex].startTime = (turn / PARCELS) * ARRIVING_TIME;
  });
  return parcels;
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
