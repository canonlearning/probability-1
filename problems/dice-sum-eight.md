---
title: Two dice that add to 8
answer: $2/5$
---

A red die and a blue die are rolled. The sum of the two numbers is 8.

Draw a grid with one row for each number on the red die and one column for
each number on the blue die, so that each of the 36 cells is one outcome.
Shade every cell where the sum is 8. Then circle the shaded cells where at
least one die shows a 6.

Find the probability that at least one die shows a 6, given that the sum is
8, as an exact fraction.

## Solution

### Count the outcomes

The grid has 36 cells. Each die is equally likely to show each of its
numbers, so every cell has probability $1/36$.

### Keep the cells where the sum is 8

Let $B$ be the event that the sum is 8. With the red die written first, its
cells are $(2,6)$, $(3,5)$, $(4,4)$, $(5,3)$, and $(6,2)$. That is 5 cells,
so $P(B) = 5/36$. The other 31 cells did not happen.

::visual{name="outcome-grid" one="roll of the two dice" rows="1, 2, 3, 4, 5, 6" row-name="red die" columns="1, 2, 3, 4, 5, 6" column-name="blue die" given="2-6, 3-5, 4-4, 5-3, 6-2" given-name="the sum is 8" event="6-*, *-6" event-name="at least one die shows a 6"}

### Count the sixes among them

Let $A$ be the event that at least one die shows a 6. Of the 5 cells in $B$,
$\red{2}$ are in $A$: $(2,6)$ and $(6,2)$. So $P(A \cap B) = \red{2}/36$.

### Divide

$$
\begin{aligned}
P(A \mid B) &= \frac{P(A \cap B)}{P(B)} \\[6pt]
&= \frac{\red{2}/36}{5/36} \\[6pt]
&= \frac{\red{2}}{5}.
\end{aligned}
$$

The 36 cancels, so the answer is a count of cells: $\red{2}$ of the 5 that
are left. The pair 2 and 6 is two cells and the pair 4 and 4 is one cell,
which is why the grid keeps the two dice apart.
