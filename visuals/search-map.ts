// A map of several zones, one of which holds a lost thing, and searches
// that find nothing. Made for a slide: it is a flat drawing with large
// type.
//
// A zone is darker when the thing is more likely to be in it. Each search
// takes two steps: first the searched zone's probability is multiplied by
// the probability that a search misses, then all the zones are divided by
// their sum so that they add to 1 again.
//
//   ::visual{name="search-map" zones="north, middle, south"
//     priors="2/5, 2/5, 1/5" detection="9/10" searches="north, middle" done="1"}
//
// `detection` is the probability that a search of the right zone finds the
// thing. `searches` are the zones searched, in order. `done` is how many
// of the searches are already finished at the first step (0 when it is
// left out).

import {
  dividedBy,
  fractionFrom,
  fractionText,
  ink,
  oneMinus,
  plus,
  svg,
  textAt,
  times,
  toNumber,
  Visual,
  type Figure,
  type Fraction,
} from "canon";

const WIDTH = 1600;
const HEIGHT = 780;

// Places, in the units of the drawing.
const MAP_LEFT = 110;
const MAP_TOP = 40;
const ZONE_HEIGHT = 500;
const MAP_WIDTH = 1380;

export default class SearchMap extends Visual {
  protected build(figure: Figure): void {
    const setting = (name: string) => {
      const value = this.getAttribute(name);
      if (value === null) throw new Error(`The search map needs ${name}="..." on the ::visual line.`);
      return value;
    };
    const list = (name: string) => setting(name).split(",").map((item) => item.trim());
    const zones = list("zones");
    const miss = oneMinus(fractionFrom(setting("detection")));
    const searches = list("searches").map((zone) => zones.indexOf(zone));
    const done = Number(this.getAttribute("done") ?? 0);

    // The probabilities before the first search and after each search.
    const rounds: { searched: number; before: Fraction[]; products: Fraction[]; total: Fraction; after: Fraction[] }[] = [];
    let current = list("priors").map(fractionFrom);
    for (const searched of searches) {
      const products = current.map((probability, zone) => (zone === searched ? times(probability, miss) : probability));
      const total = products.reduce(plus);
      const after = products.map((product) => dividedBy(product, total));
      rounds.push({ searched, before: current, products, total, after });
      current = after;
    }

    // Step 0 shows the map as it is after the `done` searches. Each search
    // after those adds two steps.
    const stepCount = 1 + 2 * (searches.length - done);

    const drawingAt = (step: number): string => {
      // How many searches are finished before the one this step shows.
      const finished = step === 0 ? done : done + Math.floor((step - 1) / 2);
      const round = rounds[finished];
      const isMultiplying = step >= 1 && step % 2 === 1;
      const isDivided = step >= 1 && step % 2 === 0;
      // The probabilities written large in the zones at this step.
      const shown = step === 0 ? (done === 0 ? rounds[0].before : rounds[done - 1].after) : isDivided ? round.after : round.before;
      const shownText = overOneBottom(shown);
      const parts: string[] = [];
      const zoneWidth = MAP_WIDTH / zones.length;

      zones.forEach((zone, index) => {
        const left = MAP_LEFT + index * zoneWidth;
        const middle = left + zoneWidth / 2;
        const isSearched = step >= 1 && index === round.searched;
        const wasSearched = !isSearched && searches.slice(0, finished).includes(index);
        const probability = toNumber(shown[index]);
        const type = ink.text;
        parts.push(
          `<rect x="${left}" y="${MAP_TOP}" width="${zoneWidth}" height="${ZONE_HEIGHT}" fill="#fff"/>` +
            `<rect x="${left}" y="${MAP_TOP}" width="${zoneWidth}" height="${ZONE_HEIGHT}" fill="${ink.blue}"` +
            ` fill-opacity="${(0.06 + 0.7 * probability).toFixed(3)}" stroke="#fff" stroke-width="6"${isDivided ? ' class="new"' : ""}/>`,
        );
        if (isSearched) {
          parts.push(
            `<rect x="${left + 14}" y="${MAP_TOP + 14}" width="${zoneWidth - 28}" height="${ZONE_HEIGHT - 28}" fill="none"` +
              ` stroke="${ink.red}" stroke-width="6" stroke-dasharray="18 12"${isMultiplying ? ' class="new"' : ""}/>`,
          );
        }
        if (wasSearched) {
          parts.push(
            `<rect x="${left + 14}" y="${MAP_TOP + 14}" width="${zoneWidth - 28}" height="${ZONE_HEIGHT - 28}" fill="none"` +
              ` stroke="${ink.muted}" stroke-width="4" stroke-dasharray="18 12"/>`,
          );
          parts.push(textAt(middle, MAP_TOP + 430, "searched before", { size: 38, fill: ink.muted }));
        }
        parts.push(textAt(middle, MAP_TOP + 80, zone, { size: 42, fill: type }));
        parts.push(textAt(middle, MAP_TOP + 250, shownText[index], { size: 110, fill: type, bold: true, isNew: isDivided }));

        if (isMultiplying) {
          const factor = isSearched ? fractionText(miss) : "1";
          const product = overOneBottom(round.products)[index];
          parts.push(
            textAt(middle, MAP_TOP + 340, `× ${factor} = ${product}`, { size: 44, fill: isSearched ? ink.red : type, bold: isSearched, isNew: true }),
          );
          if (isSearched) parts.push(textAt(middle, MAP_TOP + 430, "searched: nothing", { size: 38, fill: ink.red, isNew: true }));
        }
        if (isDivided) {
          parts.push(textAt(middle, MAP_TOP + 340, `was ${overOneBottom(round.before)[index]}`, { size: 40, fill: type, isNew: true }));
          if (isSearched) parts.push(textAt(middle, MAP_TOP + 430, "searched: nothing", { size: 38, fill: ink.red }));
        }
      });

      // Under the map: the sum of the products, then the division.
      if (step >= 1) {
        const written = overOneBottom([...round.products, round.total]);
        const sumText = `${written.slice(0, -1).join(" + ")} = ${written.at(-1)}`;
        parts.push(textAt(WIDTH / 2, 630, sumText, { size: 44, fill: isDivided ? ink.muted : ink.text, bold: isMultiplying, isNew: isMultiplying }));
      }

      const caption =
        step === 0
          ? done === 0
            ? `The wreck is in exactly one zone. A darker zone is more likely.`
            : `After the first search. These are the probabilities to start from now.`
          : isMultiplying
            ? `Nothing in the ${zones[round.searched]}: multiply it by ${fractionText(miss)}. The three no longer add to 1.`
            : `Divide each by the sum, so that the three add to 1 again.`;
      parts.push(textAt(WIDTH / 2, HEIGHT - 35, caption, { size: 38, isNew: true }));
      return parts.join("");
    };

    const box = figure.flatBox();
    figure.steps(stepCount, (step) => {
      box.innerHTML = svg(WIDTH, HEIGHT, drawingAt(step));
    });
  }
}

// Writes fractions over one bottom, the smallest that fits them all: 1/16,
// 5/8, and 5/16 become 1/16, 10/16, and 5/16.
function overOneBottom(fractions: Fraction[]): string[] {
  const greatestCommonDivisor = (a: number, b: number): number => (b === 0 ? a : greatestCommonDivisor(b, a % b));
  const bottom = fractions.reduce((common, fraction) => (common * fraction.bottom) / greatestCommonDivisor(common, fraction.bottom), 1);
  return fractions.map((fraction) => `${(fraction.top * bottom) / fraction.bottom}/${bottom}`);
}
