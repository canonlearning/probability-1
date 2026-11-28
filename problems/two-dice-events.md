---
title: Two events with two dice
answer: $11/36$
---

A red die and a blue die are rolled. An outcome is written with the red
die first: (1, 6) says that the red die shows 1 and the blue die shows 6.
The 36 outcomes are equally likely, and together they are the sample space
$S$.

Let $A$ be the event that the sum of the two numbers is 7, and let $B$ be
the event that the red die shows 1.

Draw a grid with one row for each number on the red die and one column for
each number on the blue die, so that each of the 36 cells is one outcome.
Shade the cells of $A$ one way and the cells of $B$ another way.

1. List the outcomes of $A$ and the outcomes of $B$.
2. List the outcomes of $A \cap B$, and say whether $A$ and $B$ are
   disjoint.
3. Count the outcomes of $A \cup B$ and of $(A \cup B)^c$.
4. Find the probability that the sum is 7 or the red die shows 1.

## Solution

### List the two events

The sum is 7 when the blue die shows 7 minus the number on the red die.
There is one such outcome for each number on the red die, so $A$ has 6
outcomes:

$$
A = \{(1, 6),\ (2, 5),\ (3, 4),\ (4, 3),\ (5, 2),\ (6, 1)\}.
$$

In the grid these cells are a diagonal. The red die shows 1 in the first
row of the grid, so $B$ also has 6 outcomes:

$$
B = \{(1, 1),\ (1, 2),\ (1, 3),\ (1, 4),\ (1, 5),\ (1, 6)\}.
$$

### Find the outcomes in both

An outcome in both events has a red die that shows 1 and a sum of 7, so its
blue die shows 6:

$$
A \cap B = \{(1, 6)\}.
$$

This is the one cell that is shaded both ways. The intersection has an
outcome, so $A$ and $B$ are not disjoint.

### Count the union and its complement

$A$ has 6 outcomes and $B$ has 6. Adding them counts (1, 6) twice, because
it is in both, so we take 1 away. The union $A \cup B$ has

$$
6 + 6 - 1 = 11
$$

outcomes, which are the shaded cells of the grid. The complement
$(A \cup B)^c$ is the cells with no shading. It has the other
$36 - 11 = 25$ outcomes, where the sum is not 7 and the red die does not
show 1.

In the figure, each event is a sheet lying on its outcomes.

::visual{name="event-sheets" rows="1, 2, 3, 4, 5, 6" row-name="red die" columns="1, 2, 3, 4, 5, 6" column-name="blue die" first="1-6, 2-5, 3-4, 4-3, 5-2, 6-1" first-name="a sum of 7" first-letter="A" second="1-*" second-name="a 1 on the red die" second-letter="B"}

### Divide the count by 36

"The sum is 7 or the red die shows 1" is the event $A \cup B$. The 36
outcomes are equally likely, so its probability is the number of its
outcomes, divided by the number of outcomes in the sample space:

$$
\frac{|A \cup B|}{|S|} = \frac{11}{36}.
$$

In the reading, the two events were disjoint and their counts were added
with nothing taken away. Here the events share an outcome, so adding the
counts gives 12, which is 1 too many.
