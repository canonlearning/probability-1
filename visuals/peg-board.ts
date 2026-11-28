// The 16 paths of a ball through a peg board, and the bins they end in.
//
// The board lies on the floor and is seen from above. It has 4 rows of
// pegs (1, 2, 3, and 4 pegs) and 5 bins below them, numbered 0 to 4. A ball
// hits one peg in each row and bounces left (L) or right (R), so a path is
// four letters, and the ball ends in the bin whose number is the number of
// R's. Each of the 16 paths is shown once, by one ball. No ball is random.
//
// The figure runs by itself through four steps:
//
//   1. One ball follows the path LRRL slowly, with its letters written
//      beside it, and comes to rest in bin 2.
//   2. The other 15 balls follow their paths one after another, at an even
//      pace, in the order of the table in the solution. Each comes to rest
//      on the balls already in its bin.
//   3. All 16 balls rest in the bins, in stacks of 1, 4, 6, 4, and 1. The
//      number of balls is written above each stack.
//   4. The 6 balls in bin 2 turn red. The figure rests here.
//
// "Replay" starts again from step 1.
//
//   ::visual{name="peg-board"}

import { cssColor, floor, floorLine, floorPatch, palette, solid, Stage, THREE, Visual, type Figure, type StageLabel } from "canon";

const ROWS = 4;
const BINS = ROWS + 1;
const EXAMPLE_PATH = "LRRL"; // the path of step 1, as in the problem
const LIKELIEST_BIN = 2; // the bin whose balls turn red in step 4

// When each step starts, in seconds.
const OTHERS_STEP = 5.6;
const COUNTS_STEP = 16.5;
const RED_STEP = 20;
const STEP_STARTS = [0, OTHERS_STEP, COUNTS_STEP, RED_STEP];
const BETWEEN_DROPS = 0.6; // seconds from one ball of step 2 setting off to the next
const TURNING_RED = 0.6; // seconds for a ball to change color

// How fast a ball moves, in floor units per second. A path is about 7
// units long, so the first ball takes about 4.5 seconds and each of the
// others about 2.
const EXAMPLE_SPEED = 1.5;
const SPEED = 3.6;

// Sizes and places, in floor units. x runs from left to right, and y from
// the top of the board (negative) to its bottom.
const BIN_WIDTH = 1.3; // also the distance between two pegs of a row
const ROW_SPACING = 0.75;
const FIRST_ROW_Y = -3;
const START_Y = -3.9; // where a ball sets off, above the first peg
const ABOVE_PEG = 0.3; // a ball meets a peg this far above the peg's middle
const BINS_TOP = FIRST_ROW_Y + ROWS * ROW_SPACING - ABOVE_PEG; // where a ball enters its bin
const BINS_BOTTOM = 2.3;
const BALL_RADIUS = 0.19;
const STACK_SPACING = 0.42; // between the middles of two balls in a bin
const HOP_HEIGHT = 0.25; // how high a ball rises off the board in a bounce
const PEG = { radius: 0.06, height: 0.3 };
const LINE_WIDTH = 0.03;
const BOARD = { top: -4.2, bottom: 2.4, width: BINS * BIN_WIDTH + 0.3 };

// Below this width, in pixels, the labels would be too small to read at
// their usual size, so they are written larger.
const NARROW_CANVAS = 480;
const NARROW_FONT_SIZE = "0.6rem";

type Point = { x: number; y: number };

type Ball = {
  letters: string; // the path, as in "LRRL"
  bin: number;
  route: Point[]; // the points the ball moves through, from the start to its place in the bin
  dropTime: number; // when the ball sets off, in seconds
  speed: number;
  mesh: THREE.Mesh;
  material: THREE.MeshLambertMaterial;
};

export default class PegBoard extends Visual {
  protected build(figure: Figure): void {
    const stage = new Stage(figure, { halfWidth: 5.2, lookAt: [0, -0.55, 0], azimuth: 0, elevation: 68, gridSize: 0 });

    // The board, its pegs, and the thin lines between the bins.
    stage.scene.add(
      floorPatch(
        { x: 0, y: (BOARD.top + BOARD.bottom) / 2 },
        { width: BOARD.width, depth: BOARD.bottom - BOARD.top },
        { color: palette.grid, opacity: 0.7 },
      ),
    );
    const pegShape = new THREE.CylinderGeometry(PEG.radius, PEG.radius, PEG.height, 16);
    for (let row = 0; row < ROWS; row++) {
      for (let number = 0; number <= row; number++) {
        const peg = new THREE.Mesh(pegShape, solid(palette.dark));
        peg.position.copy(floor(pegX(row, number), pegY(row), PEG.height / 2));
        stage.scene.add(peg);
      }
    }
    const lines = { color: palette.muted, width: LINE_WIDTH };
    const binsLeft = binX(0) - BIN_WIDTH / 2;
    const binsRight = binX(BINS - 1) + BIN_WIDTH / 2;
    for (let wall = 0; wall <= BINS; wall++) {
      const x = binsLeft + wall * BIN_WIDTH;
      stage.scene.add(floorLine({ x, y: BINS_TOP }, { x, y: BINS_BOTTOM }, lines));
    }
    stage.scene.add(floorLine({ x: binsLeft, y: BINS_BOTTOM }, { x: binsRight, y: BINS_BOTTOM }, lines));

    const balls = createBalls();
    for (const ball of balls) stage.scene.add(ball.mesh);
    const ballsInBin = (bin: number) => balls.filter((ball) => ball.bin === bin).length;

    // The name of each bin under it, and the number of balls above each
    // stack. A label sits just above its point.
    const binLabels: StageLabel[] = [];
    const countLabels: StageLabel[] = [];
    for (let bin = 0; bin < BINS; bin++) {
      const binLabel = stage.label(`bin <b>${bin}</b>`);
      binLabel.position.copy(floor(binX(bin), BINS_BOTTOM + 0.6));
      binLabels.push(binLabel);

      const countLabel = stage.label("");
      const topBallY = placeInBin(bin, ballsInBin(bin) - 1).y;
      countLabel.position.copy(floor(binX(bin), topBallY - BALL_RADIUS - 0.05));
      countLabels.push(countLabel);
    }
    // The letters of the first ball's path so far, to the left of the ball.
    const pathLabel = stage.label("");
    const labels = [...binLabels, ...countLabels, pathLabel];

    const timeline = figure.timeline(STEP_STARTS);
    figure.button("Replay", () => {
      timeline.restart();
    });
    figure.caption(
      `Each ball follows one of the ${balls.length} paths through the ${ROWS} rows of pegs, and rests in the bin ` +
        `where that path ends. The ${balls.length} paths are equally likely, so a bin with more balls is more likely.`,
    );

    const blue = new THREE.Color(palette.blue);
    const red = new THREE.Color(palette.red);
    const counts = Array.from({ length: BINS }, (_, bin) => ballsInBin(bin));
    const example = balls[0];

    stage.onFrame = (seconds) => {
      const time = timeline.advance(seconds);

      // Each ball is where its route puts it at this time. A ball that has
      // not set off is hidden, and a ball at the end of its route stays
      // there. In step 4 the balls of bin 2 turn red.
      const reddened = THREE.MathUtils.clamp((time - RED_STEP) / TURNING_RED, 0, 1);
      let dropped = 0;
      for (const ball of balls) {
        const sinceDrop = time - ball.dropTime;
        ball.mesh.visible = sinceDrop >= 0;
        if (sinceDrop >= 0) dropped += 1;
        ball.mesh.position.copy(placeOnRoute(ball.route, sinceDrop * ball.speed).position);
        ball.material.color.copy(blue);
        if (ball.bin === LIKELIEST_BIN) ball.material.color.lerp(red, reddened);
      }

      // The first ball has one letter for each peg it has bounced off. The
      // label goes away when the ball enters its bin.
      const exampleNow = placeOnRoute(example.route, time * example.speed);
      const bounces = Math.min(exampleNow.leg, ROWS);
      pathLabel.element.innerHTML = `<b>${example.letters.slice(0, bounces)}</b>`;
      pathLabel.shown = time < OTHERS_STEP && bounces > 0 && exampleNow.leg <= ROWS;
      pathLabel.position.copy(exampleNow.position).add(floor(-0.85, 0.25));

      countLabels.forEach((label, bin) => {
        const count = String(counts[bin]);
        const isRed = bin === LIKELIEST_BIN && time >= RED_STEP;
        label.element.innerHTML = isRed ? colored(count, palette.red) : `<b>${count}</b>`;
        label.shown = time >= COUNTS_STEP;
      });

      const narrow = figure.canvasBox.clientWidth < NARROW_CANVAS;
      for (const label of labels) label.element.style.fontSize = narrow ? NARROW_FONT_SIZE : "";

      if (time < OTHERS_STEP) {
        figure.readout(`The path <b>${example.letters}</b> ends in <b>bin ${example.bin}</b>.`);
      } else if (time < COUNTS_STEP) {
        const latest = balls[dropped - 1];
        figure.readout(`Path <b>${dropped}</b> of ${balls.length}: <b>${latest.letters}</b> ends in bin ${latest.bin}.`);
      } else if (time < RED_STEP) {
        const list = `${counts.slice(0, -1).join(", ")}, and ${counts[BINS - 1]}`;
        figure.readout(`<b>${balls.length}</b> equally likely paths. The bins hold <b>${list}</b> of them.`);
      } else {
        const likeliest = counts[LIKELIEST_BIN];
        figure.readout(
          `Bin ${LIKELIEST_BIN}: <b>${likeliest} of the ${balls.length}</b> paths, so its probability is ` +
            `${colored(`${likeliest}/${balls.length} = 3/8`, palette.red)}.`,
        );
      }
    };
  }
}

// The x of a bin's middle. Bin 2 is in the middle of the board.
function binX(bin: number): number {
  return (bin - (BINS - 1) / 2) * BIN_WIDTH;
}

// Where a peg is. Row 0 is the top row and has 1 peg, and row 3 has 4. The
// pegs of a row are numbered from the left, starting at 0.
function pegX(row: number, number: number): number {
  return (number - row / 2) * BIN_WIDTH;
}

function pegY(row: number): number {
  return FIRST_ROW_Y + row * ROW_SPACING;
}

// Where a ball rests in a bin. Place 0 is at the bottom of the bin, and
// each later place is one ball further up.
function placeInBin(bin: number, place: number): Point {
  return { x: binX(bin), y: BINS_BOTTOM - 0.25 - place * STACK_SPACING };
}

// The 16 paths in the order of the solution's table: L before R, with the
// letter of the last row changing fastest. In the binary digits of the
// path's number, a 0 is an L and a 1 is an R.
function allPaths(): string[] {
  const paths: string[] = [];
  for (let number = 0; number < 2 ** ROWS; number++) {
    const digits = number.toString(2).padStart(ROWS, "0");
    paths.push(digits.replaceAll("0", "L").replaceAll("1", "R"));
  }
  return paths;
}

// Creates the 16 balls, in the order in which they are dropped: the
// example path first, and then the others in the order of the table.
function createBalls(): Ball[] {
  const others = allPaths().filter((letters) => letters !== EXAMPLE_PATH);
  const sphere = new THREE.SphereGeometry(BALL_RADIUS, 20, 14);
  const ballsInBinSoFar = new Array<number>(BINS).fill(0);

  return [EXAMPLE_PATH, ...others].map((letters, turn) => {
    const bin = letters.split("R").length - 1; // the number of R's
    const place = ballsInBinSoFar[bin];
    ballsInBinSoFar[bin] += 1;

    const material = solid(palette.blue);
    const isExample = turn === 0;
    return {
      letters,
      bin,
      route: routeOf(letters, placeInBin(bin, place)),
      dropTime: isExample ? 0 : OTHERS_STEP + (turn - 1) * BETWEEN_DROPS,
      speed: isExample ? EXAMPLE_SPEED : SPEED,
      mesh: new THREE.Mesh(sphere, material),
      material,
    };
  });
}

// The points a ball moves through: the start, the point just above the peg
// it hits in each row, the top of its bin, and its place in the bin. A
// bounce to the left moves the ball half a bin to the left by the next row,
// and a bounce to the right half a bin to the right.
function routeOf(letters: string, rest: Point): Point[] {
  const route: Point[] = [{ x: 0, y: START_Y }];
  let x = 0;
  for (let row = 0; row < ROWS; row++) {
    route.push({ x, y: pegY(row) - ABOVE_PEG });
    x += letters[row] === "R" ? BIN_WIDTH / 2 : -BIN_WIDTH / 2;
  }
  route.push({ x, y: BINS_TOP });
  route.push(rest);
  return route;
}

// Where a ball is after it has moved `distance` along its route, and which
// leg of the route it is on. Leg 0 runs from the start to the first peg,
// legs 1 to 4 are the bounces off the 4 pegs, and leg 5 is the fall into
// the bin. Before the start the ball is at the first point, and past the
// end it is at the last. In a bounce the ball rises off the board and
// comes down again.
function placeOnRoute(route: Point[], distance: number): { position: THREE.Vector3; leg: number } {
  const lastLeg = route.length - 2;
  let left = Math.max(distance, 0);
  for (let leg = 0; leg <= lastLeg; leg++) {
    const from = route[leg];
    const to = route[leg + 1];
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    if (left < length) {
      const done = left / length; // the share of this leg that is behind the ball
      const isBounce = leg >= 1 && leg <= ROWS;
      const hop = isBounce ? HOP_HEIGHT * 4 * done * (1 - done) : 0;
      const x = from.x + (to.x - from.x) * done;
      const y = from.y + (to.y - from.y) * done;
      return { position: floor(x, y, BALL_RADIUS + hop), leg };
    }
    left -= length;
  }
  const end = route[route.length - 1];
  return { position: floor(end.x, end.y, BALL_RADIUS), leg: lastLeg + 1 };
}

// Bold text in one of the figure's colors, for a label or the readout.
function colored(text: string, color: number): string {
  return `<b style="color: ${cssColor(color)}">${text}</b>`;
}
