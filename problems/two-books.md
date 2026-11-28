---
title: Two books from a shelf
answer: 12, 16, and 6 outcomes, with book A taken at least once in 6, 7, and 3 of them
---

A shelf holds four books: A, B, C, and D. Here are three experiments with
this shelf, each with its own description of the result.

1. One book is taken, and then a second book is taken from the three that
   are left. An outcome says which book was first and which was second.
2. One book is taken, its title is noted, and it is put back. Then a book is
   taken again. An outcome says which book was first and which was second.
3. Two books are grabbed together in one hand. An outcome says which two
   books they are.

For each experiment, write out the sample space in an order in which no
outcome can be skipped, and count its outcomes. A short way to write an
outcome is AB for "A first, then B" and "A and B" for the two books A and B
with no order.

Then, in each sample space, write out the event "book A is taken at least
once" and count its outcomes.

## Solution

### Write the three sample spaces

We write AB for "A first, then B", and we go through the first book in the
order of the alphabet, and for each first book through the second book in
the same order.

In experiment 1 there are 4 books for the first place, and for each of them 3
books for the second place, so there are $4 \times 3 = 12$ outcomes:

$$
S_1 = \{\text{AB, AC, AD, BA, BC, BD, CA, CB, CD, DA, DB, DC}\}.
$$

In experiment 2 the first book is back on the shelf, so there are 4 books for
the second place as well. This gives $4 \times 4 = 16$ outcomes:

$$
\begin{aligned}
S_2 = \{&\text{AA, AB, AC, AD, BA, BB, BC, BD,} \\
&\text{CA, CB, CC, CD, DA, DB, DC, DD}\}.
\end{aligned}
$$

It is $S_1$ with the 4 outcomes AA, BB, CC, and DD added, in which the same
book is taken twice.

In experiment 3 there is no first or second book, so an outcome is a set of
two different books. We write "A and B" for it:

$$
S_3 = \{\text{A and B, A and C, A and D, B and C, B and D, C and D}\}.
$$

There are 3 outcomes with A, then 2 new ones with B, then 1 new one with C,
which is $3 + 2 + 1 = 6$ outcomes.

### Write the event in each

In $S_1$, book A is first in 3 outcomes and second in 3 outcomes. No outcome
is in both groups, because the first book is not on the shelf for the second
pick. The event has $3 + 3 = 6$ outcomes:

$$
\{\text{AB, AC, AD, BA, CA, DA}\}.
$$

In $S_2$, book A is first in 4 outcomes and second in 4 outcomes. The
outcome AA is in both groups, so the event has $4 + 4 - 1 = 7$ outcomes:

$$
\{\text{AA, AB, AC, AD, BA, CA, DA}\}.
$$

In $S_3$, the event has 3 outcomes:

$$
\{\text{A and B, A and C, A and D}\}.
$$

| Experiment                 | Outcomes | Book A is taken at least once |
|----------------------------|----------|-------------------------------|
| 1. One at a time           | 12       | 6                             |
| 2. One at a time, put back | 16       | 7                             |
| 3. Both together           | 6        | 3                             |

The same words, "book A is taken at least once", give three different
counts. The count depends on how the books are taken and on what an outcome
records, so both have to be settled before counting.
