---
title: Three buses
answer: 7, 1, 3, 4, and 2 outcomes
---

Three buses leave a station each morning: bus 1, bus 2, and bus 3. The
experiment is to watch them on one morning and note whether each bus is late
(L) or on time (O). An outcome is written as three letters, with bus 1
first: LOO says that bus 1 is late and the other two are on time.

Let $A_1$ be the event that bus 1 is late, and define $A_2$ and $A_3$ the
same way for bus 2 and bus 3.

A union or an intersection of three events is formed the same way as for
two: $A_1 \cup A_2 \cup A_3$ is the set of outcomes that are in at least one
of the three, and $A_1 \cap A_2 \cap A_3$ is the set of outcomes that are in
all three. Where unions and intersections are mixed, parentheses say what is
done first.

Write out the sample space in an order in which no outcome can be skipped.
Then, for each event below, list its outcomes, and write it in terms of
$A_1$, $A_2$, and $A_3$ with unions, intersections, and complements.

1. At least one bus is late.
2. No bus is late.
3. Exactly one bus is late.
4. At most one bus is late. This one may be written in terms of events
   already found.
5. Bus 1 is late and bus 2 is not.

Last, find two of the five events that are complements of each other.

## Solution

### Write the sample space

There are 2 letters for bus 1, and for each of them 2 for bus 2, and for
each of those 2 for bus 3, so there are $2 \times 2 \times 2 = 8$ outcomes.
We put L before O, and change the letter of bus 3 fastest:

$$
S = \{\text{LLL, LLO, LOL, LOO, OLL, OLO, OOL, OOO}\}.
$$

Each of the three given events has 4 outcomes, because it fixes one letter
and leaves $2 \times 2$ choices for the other two.

| Event | Outcomes           |
|-------|--------------------|
| $A_1$ | LLL, LLO, LOL, LOO |
| $A_2$ | LLL, LLO, OLL, OLO |
| $A_3$ | LLL, LOL, OLL, OOL |

### At least one bus is late

"At least one" means one, two, or three. An outcome is in this event when it
is in $A_1$, in $A_2$, or in $A_3$, and it may be in more than one of them.
This is what a union says, so the event is

$$
A_1 \cup A_2 \cup A_3 = \{\text{LLL, LLO, LOL, LOO, OLL, OLO, OOL}\}.
$$

It has 7 outcomes. Adding $4 + 4 + 4$ would give 12, which is wrong because
the three events share outcomes (LLL is in all three).

### No bus is late

"No bus is late" means that bus 1 is not late, and bus 2 is not late, and
bus 3 is not late. Each "not" is a complement and each "and" is an
intersection:

$$
A_1^c \cap A_2^c \cap A_3^c = \{\text{OOO}\}.
$$

It has 1 outcome.

### Exactly one bus is late

"Exactly one" means one and no more. There are three ways for this to
happen, one for each bus that could be the late one. If it is bus 1, then
bus 1 is late and the other two are not, which is
$A_1 \cap A_2^c \cap A_3^c = \{\text{LOO}\}$. The event is the union of the
three ways:

$$
(A_1 \cap A_2^c \cap A_3^c) \cup (A_1^c \cap A_2 \cap A_3^c) \cup
(A_1^c \cap A_2^c \cap A_3) = \{\text{LOO, OLO, OOL}\}.
$$

It has 3 outcomes. The three ways are disjoint, because each says a
different bus is the only late one, and no outcome has two such buses. So
here adding works: $1 + 1 + 1 = 3$.

### At most one bus is late

"At most one" means none or one. So this event is the union of the last two
events:

$$
\{\text{OOO}\} \cup \{\text{LOO, OLO, OOL}\} = \{\text{LOO, OLO, OOL, OOO}\}.
$$

Written out in $A_1$, $A_2$, and $A_3$, it is the union of the two
expressions above. It has $1 + 3 = 4$ outcomes, and adding works because
"none" and "exactly one" are disjoint.

### Bus 1 is late and bus 2 is not

This event is

$$
A_1 \cap A_2^c = \{\text{LOL, LOO}\}.
$$

It has 2 outcomes. The statement does not mention bus 3, so bus 3 is late in
one of them and on time in the other.

### Find the complements

"No bus is late" is the complement of "at least one bus is late". Every
outcome has no late bus or has at least one, and no outcome has both, so

$$
(A_1 \cup A_2 \cup A_3)^c = A_1^c \cap A_2^c \cap A_3^c.
$$

The counts agree: $8 - 7 = 1$. No other two of the five events are
complements. The counts of an event and its complement add to 8, and among
7, 1, 3, 4, and 2 only 7 and 1 do.

This gives a shorter way to count an "at least one" event. We count the
"none" event, which is small, and subtract from $|S|$.

The complement of "at most one bus is late" is not on the list. It is "at
least two buses are late", which is $\{\text{LLL, LLO, LOL, OLL}\}$ and has
$8 - 4 = 4$ outcomes.
