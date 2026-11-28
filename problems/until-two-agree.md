---
title: Reading until two agree
answer: 6 outcomes, the 2 outcomes HLHLL and LHLHH, and infinitely many outcomes in all
---

A gauge is read, and each reading is high (H) or low (L). It is read again
and again, and the readings stop as soon as two readings in a row agree.
Nothing else limits the number of readings. For a run that stops, the
outcome is the readings in order: HLL says that the readings were high, low,
low, and that they stopped after the third.

1. Write out every outcome with 2 readings, with 3 readings, and with 4
   readings.
2. Say in one sentence what the readings look like in every run that stops.
   Then say how many of these outcomes have $n$ readings, and for which $n$.
3. List the outcomes of the event "there are at most 4 readings" and of the
   event "there are exactly 5 readings".
4. Say why these outcomes cannot be written out in full. Then find a run
   that fits none of them, and say what has to be added so that the outcomes
   are a sample space.

## Solution

### Write the short outcomes

With 2 readings, the two readings agree, so the outcomes are HH and LL.

With 3 readings, the first two did not agree (the readings would have
stopped), and the third agrees with the second. If the first is H, the
second is L and the third is L. This gives HLL, and starting with L gives
LHH.

With 4 readings, the first three have no two in a row that agree, and the
fourth agrees with the third. This gives HLHH and LHLL.

| Readings | Outcomes     |
|----------|--------------|
| 2        | HH, LL       |
| 3        | HLL, LHH     |
| 4        | HLHH, LHLL   |
| 5        | HLHLL, LHLHH |

### Describe the pattern

In every run that stops, the readings alternate between H and L up to the
one before the last, and the last reading repeats the one before it.

The first reading and the number of readings decide all the others. Each
reading before the last has to differ from the one before it, and the last
has to agree with the one before it, so once the first reading and the
number of readings are known, nothing is left to choose. There are 2 first
readings, so there are 2 outcomes with $n$ readings, for every whole number
$n$ from 2 up. There is no outcome with 1 reading, because one reading has
nothing to agree with.

A string of letters that is not of this kind is not an outcome. HHL is not
one, because the readings stop after HH.

### List the two events

"There are at most 4 readings" has the outcomes with 2, 3, or 4 readings:

$$
\{\text{HH, LL, HLL, LHH, HLHH, LHLL}\}.
$$

It has $2 + 2 + 2 = 6$ outcomes. "There are exactly 5 readings" has the 2
outcomes of the last row of the table:

$$
\{\text{HLHLL, LHLHH}\}.
$$

The two events are disjoint, because no outcome has both at most 4 readings
and exactly 5 readings.

### Why the outcomes do not run out

There are 2 outcomes for each $n$ from 2 up, and there is no largest $n$:
for any number of readings, the readings can alternate that long and stop
later. So there are infinitely many outcomes, and they cannot be written out
in full, because the writing never ends. They can still be written one after
another, in order of the number of readings, so that every outcome has a
place. We write the start and the pattern,

$$
\{\text{HH, LL, HLL, LHH, HLHH, LHLL, HLHLL, LHLHH},\ \dots\},
$$

where the dots stand for 2 outcomes of each greater length.

### The runs that never stop

A run in which the readings alternate forever, HLHLHL and so on, never has
two readings in a row that agree. It does not stop, so it fits none of the
outcomes above. No gauge is read forever, but nothing in the experiment
limits the number of readings, so we allow such a run as an idealization.

A sample space has to give every run exactly one outcome, so we add one
outcome: "the readings never agree". With it, every run fits exactly one
outcome, and the set is a sample space. The new outcome can also be split in
two, "alternates forever, starting with H" and "alternates forever, starting
with L", which gives a sample space with more detail. How likely it is that
the readings never agree is a separate question, which this lesson does not
answer. The sample space only records what can happen.

This sample space has infinitely many outcomes. Events are still sets of
outcomes, and an event may now have infinitely many (the complement of
"there are at most 4 readings").
