// Eighteen games of the three-doors problem, laid out to be counted.
//
// A game is three doors in a row, and we have chosen door 1, the left one.
// A brass ball marks the door with the car behind it. There are three rows
// of six games: the car is behind door 1 in the back row, door 2 in the
// middle row, and door 3 in the front row. The host opens one door in each
// game. The games in which the host does not do what we saw fade, and the
// games that are left are counted.
//
// The ::visual line says which host it is:
//
//   ::visual{name="door-games" host="knows"}     always opens a goat door
//   ::visual{name="door-games" host="guesses"}   opens door 2 or 3 at random
//
// The counts are exact and not random draws: when a host opens a door with
// probability 1/2, the host opens it in 3 of the 6 games of that row.

import { ball, evenSteps, floor, floorPatch, palette, Stage, THREE, Visual, type Figure } from "canon";

const GAMES_PER_ROW = 6;

// Timing, in seconds. The figure goes through four steps, numbered 0 to 3.
const STEP_TIME = 4;
const LAST_STEP = 3;
const CHANGE_TIME = 1;

// Sizes and places, in floor units.
const DOOR = { width: 0.5, depth: 1.25, gap: 0.09 };
const GAME_WIDTH = 3 * DOOR.width + 2 * DOOR.gap;
const GAME_GAP = 0.62;
const ROW_GAP = 3;
const GAMES_LEFT = -(GAMES_PER_ROW * GAME_WIDTH + (GAMES_PER_ROW - 1) * GAME_GAP) / 2 + 1.1;

const CLOSED_COLOR = 0xcfcabd;

type Game = {
  carDoor: number; // 1, 2, or 3
  openedDoor: number; // 2 or 3
  doors: THREE.Mesh[];
  car: THREE.Mesh;
  mark: THREE.Mesh; // the patch under a game that is counted at the end
};

export default class DoorGames extends Visual {
  protected build(figure: Figure): void {
    const hostKnows = this.getAttribute("host") !== "guesses";
    const stage = new Stage(figure, { halfWidth: 8, lookAt: [0, -0.9, 0], azimuth: 0, elevation: 50, gridSize: 0 });

    const games: Game[] = [];
    for (let carDoor = 1; carDoor <= 3; carDoor++) {
      for (let number = 0; number < GAMES_PER_ROW; number++) {
        const left = GAMES_LEFT + number * (GAME_WIDTH + GAME_GAP);
        const middle = (carDoor - 2) * ROW_GAP;
        const doorMiddle = (door: number) => left + (door - 1) * (DOOR.width + DOOR.gap) + DOOR.width / 2;

        const doors = [1, 2, 3].map((door) => {
          const slab = new THREE.Mesh(
            new THREE.BoxGeometry(DOOR.width, 0.08, DOOR.depth),
            new THREE.MeshLambertMaterial({ color: CLOSED_COLOR, transparent: true }),
          );
          slab.position.copy(floor(doorMiddle(door), middle, 0.04));
          stage.scene.add(slab);
          return slab;
        });
        const car = ball(palette.brass, 0.15);
        (car.material as THREE.MeshLambertMaterial).transparent = true;
        car.position.copy(floor(doorMiddle(carDoor), middle, 0.2));
        const mark = floorPatch(
          { x: left + GAME_WIDTH / 2, y: middle },
          { width: GAME_WIDTH + 0.3, depth: DOOR.depth + 0.35 },
          { color: palette.red, opacity: 0 },
        );
        stage.scene.add(car, mark);

        games.push({ carDoor, openedDoor: openedDoor(hostKnows, carDoor, number), doors, car, mark });
      }
    }

    // What we saw: the host opened door 3, and there was a goat behind it.
    const seen = (game: Game) => game.openedDoor === 3 && game.carDoor !== 3;
    const seenGames = games.filter(seen);
    const seenWithCarBehind2 = seenGames.filter((game) => game.carDoor === 2);

    // A label at the left of each row, and the door numbers over one game.
    const rowLabels = [1, 2, 3].map((carDoor) => {
      const label = stage.label("");
      label.position.copy(floor(GAMES_LEFT - 1.5, (carDoor - 2) * ROW_GAP + 0.45));
      return label;
    });
    for (const door of [1, 2, 3]) {
      const label = stage.label(String(door));
      label.position.copy(floor(GAMES_LEFT + (door - 1) * (DOOR.width + DOOR.gap) + DOOR.width / 2, -ROW_GAP - DOOR.depth / 2 - 0.05));
    }

    const timeline = figure.timeline(evenSteps(LAST_STEP + 1, STEP_TIME));
    figure.button("Replay", () => {
      timeline.restart();
    });
    figure.caption(
      `Each group of three doors is one game, and we chose door 1, the left one. The brass ball ` +
        `is the car. A dark door was opened by the host and has a goat behind it` +
        (hostKnows ? "." : ", and a red door was opened and has the car behind it.") +
        ` The games that fade are the ones in which we would not have seen door 3 open with a goat.`,
    );

    stage.onFrame = (seconds) => {
      const time = timeline.advance(seconds);
      const step = Math.min(Math.floor(time / STEP_TIME), LAST_STEP);
      // How far the change that starts at `startStep` has gone, from 0 to 1.
      const changed = (startStep: number) => THREE.MathUtils.clamp((time - startStep * STEP_TIME) / CHANGE_TIME, 0, 1);

      for (const game of games) {
        // Step 2 fades the games in which we did not see what we saw.
        const strength = seen(game) ? 1 : 1 - 0.85 * changed(2);
        game.doors.forEach((door, index) => {
          const material = door.material as THREE.MeshLambertMaterial;
          // Step 1 opens a door: dark for a goat, red for the car.
          const opened = index + 1 === game.openedDoor;
          const openColor = game.openedDoor === game.carDoor ? palette.red : palette.dark;
          material.color.set(CLOSED_COLOR);
          if (opened) material.color.lerp(new THREE.Color(openColor), changed(1));
          material.opacity = strength;
        });
        (game.car.material as THREE.MeshLambertMaterial).opacity = strength;
        // Step 3 marks the games that are left with the car behind door 2.
        (game.mark.material as THREE.MeshBasicMaterial).opacity = seen(game) && game.carDoor === 2 ? 0.28 * changed(3) : 0;
      }

      rowLabels.forEach((label, index) => {
        const carDoor = index + 1;
        const left = seenGames.filter((game) => game.carDoor === carDoor).length;
        label.element.innerHTML =
          step < 2 ? `car behind<br><b>door ${carDoor}</b>` : `car behind<br><b>door ${carDoor}</b>: ${left} left`;
      });

      const what = hostKnows ? "opens door 3" : "opens door 3 and shows a goat";
      figure.readout(
        [
          `<b>18</b> games: the car is behind each door in <b>6</b> of them.`,
          hostKnows
            ? `The host opens door 2 or door 3, and never the door with the car.`
            : `The host opens door 2 in half of the games of each row, and door 3 in the other half.`,
          `The host ${what} in <b>${seenGames.length}</b> of the 18 games.`,
          `The car is behind door 2 in <b>${seenWithCarBehind2.length} of the ${seenGames.length}</b>, ` +
            `which is <b>${hostKnows ? "2/3" : "1/2"}</b>.`,
        ][step],
      );
    };
  }
}

// Which door the host opens in game `number` (0 to 5) of a row. A host who
// knows where the car is opens a door with a goat: either door if the car
// is behind door 1, and otherwise the one door that is left. A host who
// guesses opens door 2 in the first three games of a row and door 3 in the
// last three.
function openedDoor(hostKnows: boolean, carDoor: number, number: number): number {
  const byTurns = number < GAMES_PER_ROW / 2 ? 2 : 3;
  if (!hostKnows || carDoor === 1) return byTurns;
  return carDoor === 2 ? 3 : 2;
}
