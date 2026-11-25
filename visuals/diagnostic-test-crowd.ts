// 1000 people take the diagnostic test, one after another.
//
// Each ball is one person. A person rolls to the test and is thrown onto one
// of four stacks: by the test result, and by whether they have the
// condition. The stacks grow as the people arrive, and the readout follows
// the share of positive tests that belong to people with the condition.

import { floor, floorPatch, palette, post, seededRandom, solid, Stage, THREE, Visual, type Figure } from "canon";

// The numbers of the example. They match the lesson text.
const PEOPLE = 1000;
const POSITIVE_IF_CONDITION = 9 / 10;
const POSITIVE_IF_NO_CONDITION = 1 / 10;
const STARTING_PERCENT_WITH_CONDITION = 1;

const CONDITION_COLOR = palette.red;
const NO_CONDITION_COLOR = palette.muted;

// Timing, in seconds.
const PEOPLE_PER_SECOND = 50;
const ROLL_TIME = 0.7; // from the start to the test
const THROW_TIME = 0.8; // from the test to a stack

// Sizes and places, in floor units.
const BALL_RADIUS = 0.09;
const BALL_SPACING = 0.2;
const BALLS_PER_SIDE = 10; // a stack is 10 balls wide and 10 deep
const START = { x: -5.6, y: 0 };
const TEST = { x: -2.6, y: 0 };

// The four stacks. The two for a positive test are at the front.
const STACKS = {
  positiveWithCondition: { x: 0.6, y: 1.7, name: "have the condition" },
  positiveWithout: { x: 3.4, y: 1.7, name: "false positives" },
  negativeWithCondition: { x: 0.6, y: -1.7, name: "have the condition" },
  negativeWithout: { x: 3.4, y: -1.7, name: "do not" },
};
type StackName = keyof typeof STACKS;
const STACK_NAMES = Object.keys(STACKS) as StackName[];

type Person = {
  hasCondition: boolean;
  stack: StackName;
  // The moment the person starts to roll, and where they come to rest.
  startTime: number;
  restingPlace: THREE.Vector3;
};

export default class DiagnosticTestCrowd extends Visual {
  protected build(figure: Figure): void {
    const stage = new Stage(figure, { halfWidth: 5.6, lookAt: [-0.4, 0, 0.9], azimuth: 14, elevation: 34 });

    // The scenery: the test, and a tinted patch under the positive stacks.
    stage.scene.add(
      post(TEST.x, -0.5, { color: palette.dark, height: 0.9 }),
      post(TEST.x, 0.5, { color: palette.dark, height: 0.9 }),
      floorPatch({ x: 2, y: 1.7 }, { width: 5.2, depth: 2.4 }, { color: palette.brass, opacity: 0.18 }),
    );
    stage.label("the test").position.copy(floor(TEST.x, 0, 1.4));
    stage.label("<b>test positive</b>").position.copy(floor(-1.5, 1.7));
    stage.label("<b>test negative</b>").position.copy(floor(-1.5, -1.7));

    const balls = new THREE.InstancedMesh(
      new THREE.SphereGeometry(BALL_RADIUS, 10, 8),
      solid(0xffffff),
      PEOPLE,
    );
    balls.frustumCulled = false;
    stage.scene.add(balls);

    const stackLabels = Object.fromEntries(
      STACK_NAMES.map((name) => [name, stage.label("")]),
    ) as Record<StackName, ReturnType<Stage["label"]>>;
    // Each stack's label sits on the floor in front of the stack, so it
    // does not cover the balls.
    for (const name of STACK_NAMES) {
      stackLabels[name].position.copy(floor(STACKS[name].x, STACKS[name].y + 1.55));
    }

    let percentWithCondition = STARTING_PERCENT_WITH_CONDITION;
    let runNumber = 0;
    let people: Person[] = [];
    let time = 0;

    const startRun = () => {
      runNumber += 1;
      people = createPeople(percentWithCondition / 100, runNumber);
      time = 0;
      const color = new THREE.Color();
      people.forEach((person, index) => {
        color.set(person.hasCondition ? CONDITION_COLOR : NO_CONDITION_COLOR);
        balls.setColorAt(index, color);
      });
      balls.instanceColor!.needsUpdate = true;
    };

    figure.slider(
      "Have the condition",
      {
        min: 0.5,
        max: 50,
        step: 0.5,
        value: percentWithCondition,
        format: (percent) => `${percent}% (${Math.round((PEOPLE * percent) / 100)} people)`,
      },
      (percent) => {
        percentWithCondition = percent;
        startRun();
      },
    );
    figure.button("Run again", startRun);

    figure.caption(
      `Each ball is one of ${PEOPLE} people. Red people have the condition and gray people ` +
        `do not. Of the people who have the condition, 9 in 10 test positive. Of the ` +
        `people who do not, 1 in 10 test positive. Drag to turn the view.`,
    );

    startRun();

    const placement = new THREE.Matrix4();
    stage.onFrame = (seconds) => {
      time += seconds;

      // Move every ball, and count the people who have reached a stack.
      const arrived: Record<StackName, number> = {
        positiveWithCondition: 0,
        positiveWithout: 0,
        negativeWithCondition: 0,
        negativeWithout: 0,
      };
      people.forEach((person, index) => {
        const position = positionAt(person, time - person.startTime);
        if (position) placement.makeTranslation(position.x, position.y, position.z);
        else placement.makeScale(0, 0, 0); // not started yet, so hidden
        balls.setMatrixAt(index, placement);
        if (time - person.startTime >= ROLL_TIME + THROW_TIME) arrived[person.stack] += 1;
      });
      balls.instanceMatrix.needsUpdate = true;

      for (const name of STACK_NAMES) {
        stackLabels[name].element.innerHTML = `${STACKS[name].name}: <b>${arrived[name]}</b>`;
      }

      const positive = arrived.positiveWithCondition + arrived.positiveWithout;
      const tested = positive + arrived.negativeWithCondition + arrived.negativeWithout;
      const share = positive === 0 ? "" : ` = <b>${((100 * arrived.positiveWithCondition) / positive).toFixed(1)}%</b>`;
      figure.readout(
        `<b>${tested}</b> tested · <b>${positive}</b> positive · ` +
          `<b>${arrived.positiveWithCondition} of ${positive}</b> positives have the condition${share}`,
      );
    };
  }
}

// Makes the 1000 people in a random order. The counts are the exact
// shares, rounded, and not random draws: with 1 person in 100 having the
// condition, exactly 10 people have it and exactly 9 of them test
// positive. Only the order in which they arrive is random.
function createPeople(shareWithCondition: number, seed: number): Person[] {
  const withCondition = Math.round(PEOPLE * shareWithCondition);
  const withoutCondition = PEOPLE - withCondition;
  const counts: Record<StackName, number> = {
    positiveWithCondition: Math.round(withCondition * POSITIVE_IF_CONDITION),
    positiveWithout: Math.round(withoutCondition * POSITIVE_IF_NO_CONDITION),
    negativeWithCondition: 0,
    negativeWithout: 0,
  };
  counts.negativeWithCondition = withCondition - counts.positiveWithCondition;
  counts.negativeWithout = withoutCondition - counts.positiveWithout;

  const stacks = STACK_NAMES.flatMap((name) => Array<StackName>(counts[name]).fill(name));
  shuffle(stacks, seededRandom(seed));

  // How many people have been sent to each stack so far.
  const sent: Record<StackName, number> = {
    positiveWithCondition: 0,
    positiveWithout: 0,
    negativeWithCondition: 0,
    negativeWithout: 0,
  };
  return stacks.map((stack, index) => ({
    hasCondition: stack === "positiveWithCondition" || stack === "negativeWithCondition",
    stack,
    startTime: index / PEOPLE_PER_SECOND,
    restingPlace: placeInStack(stack, sent[stack]++),
  }));
}

function shuffle<T>(items: T[], random: () => number): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

// A stack fills one layer of 10 by 10 balls, then the layer above it.
function placeInStack(stack: StackName, index: number): THREE.Vector3 {
  const column = index % BALLS_PER_SIDE;
  const row = Math.floor(index / BALLS_PER_SIDE) % BALLS_PER_SIDE;
  const layer = Math.floor(index / BALLS_PER_SIDE ** 2);
  const fromCenter = (step: number) => (step - (BALLS_PER_SIDE - 1) / 2) * BALL_SPACING;
  return floor(
    STACKS[stack].x + fromCenter(column),
    STACKS[stack].y + fromCenter(row),
    BALL_RADIUS + layer * BALL_SPACING,
  );
}

// Where a person's ball is, `elapsed` seconds after it started. Returns
// undefined before the start.
function positionAt(person: Person, elapsed: number): THREE.Vector3 | undefined {
  if (elapsed < 0) return undefined;
  const atStart = floor(START.x, START.y, BALL_RADIUS);
  const atTest = floor(TEST.x, TEST.y, BALL_RADIUS);

  // First the ball rolls along the floor to the test.
  if (elapsed < ROLL_TIME) return atStart.lerp(atTest, elapsed / ROLL_TIME);

  // Then it is thrown in an arc to its place in a stack.
  const progress = Math.min((elapsed - ROLL_TIME) / THROW_TIME, 1);
  const position = atTest.lerp(person.restingPlace, progress);
  position.y += 1.6 * 4 * progress * (1 - progress);
  return position;
}
