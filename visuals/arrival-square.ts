// The sample space of the bus and the train, and three events as regions
// of it.
//
// A bus arrives x minutes after noon and a train arrives y minutes after
// noon, each from 0 to 20. An outcome is the point (x, y), so the sample
// space is a square, 20 by 20, which lies flat on the floor. The bus's time
// runs along the front edge and the train's time along the left edge.
//
// An event is a thin red sheet that lies on the square and covers exactly
// the points in the event. A row of buttons picks the event, and the readout
// gives its area. The sheet changes only when a button is pressed.
//
// A dark dot marks one outcome, (7.5, 12), to show that an outcome is a
// point of the square.
//
//   ::visual{name="arrival-square"}
//
// The area in the readout is worked out from the corners of each region
// (EVENTS below).

import { ball, cssColor, floor, floorLine, floorPatch, palette, solid, Stage, THREE, Visual, type Figure } from "canon";

const LAST_MINUTE = 20; // x and y go from 0 to this
const TICKS = [0, 5, 10, 15, 20]; // minutes with a tick, a number, and a grid line
const SQUARE_AREA = LAST_MINUTE * LAST_MINUTE;

// A point of the sample space: the minutes after noon at which the bus (x)
// and the train (y) arrive.
type Point = { x: number; y: number };

const SAMPLE_POINT: Point = { x: 7.5, y: 12 };

// The events to choose from. `corners` are the corners of the region, in
// order around it. `partOfSquare` is the area as a part of the square's
// area, for the event whose problem asks for it.
const EVENTS = {
  busFirst: {
    button: "Bus before train",
    words: "The bus arrives before the train",
    symbols: "x &lt; y",
    corners: [
      { x: 0, y: 0 },
      { x: 20, y: 20 },
      { x: 0, y: 20 },
    ],
    partOfSquare: "",
  },
  bothEarly: {
    button: "Both in the first 5 minutes",
    words: "Both arrive in the first 5 minutes",
    symbols: "x &le; 5 and y &le; 5",
    corners: [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: 5 },
      { x: 0, y: 5 },
    ],
    partOfSquare: "",
  },
  // The triangle above the diagonal without the triangle above the line
  // y = x + 5, which runs from (0, 5) to (15, 20).
  trainSoonAfter: {
    button: "Train up to 5 minutes after the bus",
    words: "The train arrives after the bus, and no more than 5 minutes after it",
    symbols: "0 &lt; y &minus; x &le; 5",
    corners: [
      { x: 0, y: 0 },
      { x: 20, y: 20 },
      { x: 15, y: 20 },
      { x: 0, y: 5 },
    ],
    partOfSquare: "7/32",
  },
};
type EventKey = keyof typeof EVENTS;
const EVENT_KEYS = Object.keys(EVENTS) as EventKey[];
const FIRST_EVENT: EventKey = "busFirst";

const CHANGE_RATE = 7; // how quickly a sheet fades in or out

// Sizes, in floor units. The square is 5 wide, so 1 minute is 0.25, and the
// square is centered on the origin.
const MINUTE = 0.25;
const SIDE = LAST_MINUTE * MINUTE;
const EDGE = SIDE / 2;
const GRID_LINE_WIDTH = 0.02;
const TICK_LENGTH = 0.14;
const DOT_RADIUS = 0.07;
// The sheet lies just above the square, and its outline is a thin flat line
// just above the sheet.
const SHEET_HEIGHT = 0.03;
const SHEET_OPACITY = 0.6;
const OUTLINE = { width: 0.035, height: 0.04 };

// On a canvas narrower than this many pixels (a phone), the names of the
// two axes are written shorter, so they stay inside the canvas.
const NARROW_CANVAS = 500;

const WHITE = 0xfbfaf6;
const SHEET_COLOR = palette.red;
const RED = cssColor(palette.red);

// Where a time is on the floor. The bus's time runs left to right, and the
// train's time runs from the front of the floor to the back.
const xOf = (minutes: number) => (minutes - LAST_MINUTE / 2) * MINUTE;
const yOf = (minutes: number) => (LAST_MINUTE / 2 - minutes) * MINUTE;

export default class ArrivalSquare extends Visual {
  protected build(figure: Figure): void {
    // The camera and the size of the floor are those of event-sheets.ts.
    // The floor sits low and turned a little, so its back right corner
    // stays clear of the Pause button on a phone.
    const stage = new Stage(figure, {
      halfWidth: 5.3,
      lookAt: [-0.8, -0.25, 0],
      azimuth: 8,
      elevation: 56,
      gridSize: 0,
    });

    // The sample space: a white square on a slightly larger gray patch,
    // with a faint line at every 5 minutes.
    const white = floorPatch({ x: 0, y: 0 }, { width: SIDE, depth: SIDE }, { color: WHITE, opacity: 1 });
    white.position.y = 0.009; // just above the gray patch
    white.renderOrder = 1;
    stage.scene.add(
      floorPatch({ x: 0, y: 0 }, { width: SIDE + 0.3, depth: SIDE + 0.3 }, { color: palette.grid, opacity: 0.7 }),
      white,
    );
    const faint = { color: palette.grid, width: GRID_LINE_WIDTH };
    for (const minutes of TICKS) {
      stage.scene.add(
        floorLine({ x: xOf(minutes), y: -EDGE }, { x: xOf(minutes), y: EDGE }, faint),
        floorLine({ x: -EDGE, y: yOf(minutes) }, { x: EDGE, y: yOf(minutes) }, faint),
      );
    }

    // The two axes: a tick and a number at every 5 minutes, outside the
    // front edge for the bus and outside the left edge for the train.
    const tick = { color: palette.muted, width: GRID_LINE_WIDTH };
    const tickStart = EDGE + 0.15; // past the gray patch
    const tickEnd = tickStart + TICK_LENGTH;
    for (const minutes of TICKS) {
      stage.scene.add(
        floorLine({ x: xOf(minutes), y: tickStart }, { x: xOf(minutes), y: tickEnd }, tick),
        floorLine({ x: -tickStart, y: yOf(minutes) }, { x: -tickEnd, y: yOf(minutes) }, tick),
      );
      stage.label(`<b>${minutes}</b>`).position.copy(floor(xOf(minutes), EDGE + 0.6));
      stage.label(`<b>${minutes}</b>`).position.copy(floor(-EDGE - 0.6, yOf(minutes) + 0.2));
    }
    // The names of the axes are written in onFrame, because they are
    // shorter on a narrow canvas.
    const busAxisName = stage.label("");
    busAxisName.position.copy(floor(0, EDGE + 1.15));
    const trainAxisName = stage.label("");
    trainAxisName.position.copy(floor(-EDGE - 1.55, 0.45));
    let namesAreShort: boolean | undefined;

    // One outcome: a dark dot at its point, with its pair of times.
    const dot = ball(palette.dark, DOT_RADIUS);
    dot.position.copy(floor(xOf(SAMPLE_POINT.x), yOf(SAMPLE_POINT.y), SHEET_HEIGHT + DOT_RADIUS));
    stage.scene.add(dot);
    stage
      .label(`<b>(${SAMPLE_POINT.x}, ${SAMPLE_POINT.y})</b>`)
      .position.copy(floor(xOf(SAMPLE_POINT.x), yOf(SAMPLE_POINT.y), SHEET_HEIGHT + 2 * DOT_RADIUS));

    // A sheet with its outline for each event. `amount` goes from 0 (not
    // shown) to 1 (shown), and only the chosen event's sheet goes to 1.
    const sheets = EVENT_KEYS.map((key) => {
      const sheet = flatPolygon(EVENTS[key].corners, SHEET_COLOR);
      const outline = outlineOf(EVENTS[key].corners, SHEET_COLOR);
      stage.scene.add(sheet, outline.lines);
      return { key, sheet, outline, amount: 0 };
    });

    let chosen: EventKey = FIRST_EVENT;
    const showReadout = () => {
      const event = EVENTS[chosen];
      const part = event.partOfSquare ? `, which is <b>${event.partOfSquare}</b> of the square` : "";
      figure.readout(
        `${event.words} (${event.symbols}): area <b style="color:${RED}">${areaOf(event.corners)}</b> of ${SQUARE_AREA}${part}.`,
      );
    };
    figure.choice(
      EVENT_KEYS.map((key): [EventKey, string] => [key, EVENTS[key].button]),
      chosen,
      (key) => {
        chosen = key;
        showReadout();
      },
    );
    // The three buttons are long, so the row wraps on a narrow screen.
    const row = this.querySelector<HTMLElement>(".fig-choice");
    if (row) {
      row.style.flexWrap = "wrap";
      row.style.justifyContent = "center";
    }
    showReadout();

    figure.caption(
      `Each point of the square is one outcome (the dark dot is one of them). The ` +
        `<b style="color:${RED}">red</b> sheet covers the outcomes in the chosen event, and its size is an area.`,
    );

    stage.onFrame = (seconds) => {
      const change = 1 - Math.exp(-seconds * CHANGE_RATE);
      for (const part of sheets) {
        part.amount += ((part.key === chosen ? 1 : 0) - part.amount) * change;
        const shown = part.amount > 0.01;
        (part.sheet.material as THREE.Material).opacity = SHEET_OPACITY * part.amount;
        part.sheet.visible = shown;
        part.outline.material.opacity = part.amount;
        part.outline.lines.visible = shown;
      }

      const short = figure.canvasBox.clientWidth < NARROW_CANVAS;
      if (short !== namesAreShort) {
        namesAreShort = short;
        busAxisName.element.innerHTML = short
          ? `<b>bus:</b> <i>x</i> minutes`
          : `<b>bus:</b> <i>x</i> minutes after noon`;
        trainAxisName.element.innerHTML = short
          ? `<b>train:</b><br><i>y</i> minutes`
          : `<b>train:</b><br><i>y</i> minutes<br>after noon`;
      }
    };
  }
}

// The area of a region from its corners, in square minutes. Each side adds
// the signed area between it and the origin (the shoelace formula).
function areaOf(corners: Point[]): number {
  let twiceArea = 0;
  corners.forEach((corner, index) => {
    const next = corners[(index + 1) % corners.length];
    twiceArea += corner.x * next.y - next.x * corner.y;
  });
  return Math.abs(twiceArea) / 2;
}

// A flat sheet that lies level over a region of the square. The region has
// no dents, so it is cut into triangles that all start at its first corner.
// The sheet starts out invisible.
function flatPolygon(corners: Point[], color: number): THREE.Mesh {
  const points: number[] = [];
  for (let index = 1; index < corners.length - 1; index++) {
    for (const corner of [corners[0], corners[index], corners[index + 1]]) {
      points.push(xOf(corner.x), SHEET_HEIGHT, yOf(corner.y));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  geometry.computeVertexNormals();
  const material = solid(color, 0);
  material.side = THREE.DoubleSide;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 2;
  return mesh;
}

// The outline of a region: a thin flat line along each side, in the color
// of the sheet. The lines share one material, so they fade together.
function outlineOf(corners: Point[], color: number): { lines: THREE.Group; material: THREE.MeshBasicMaterial } {
  const material = new THREE.MeshBasicMaterial({ color, opacity: 0, transparent: true, depthWrite: false });
  const lines = new THREE.Group();
  corners.forEach((corner, index) => {
    const next = corners[(index + 1) % corners.length];
    const line = floorLine(
      { x: xOf(corner.x), y: yOf(corner.y) },
      { x: xOf(next.x), y: yOf(next.y) },
      { color, width: OUTLINE.width },
    );
    line.material = material;
    line.position.y = OUTLINE.height;
    line.renderOrder = 3;
    lines.add(line);
  });
  return { lines, material };
}
