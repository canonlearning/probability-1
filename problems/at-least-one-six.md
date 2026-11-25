---
title: At least one six
answer: $1/6$ and $1/11$
---

A red die and a blue die are rolled.

Draw the grid of 36 outcomes twice, with one row for each number on the red
die and one column for each number on the blue die. On the first grid, shade
the cells where the red die shows a 6. On the second grid, shade the cells
where at least one die shows a 6.

Find each probability as an exact fraction.

1. Both dice show a 6, given that the red die shows a 6.
2. Both dice show a 6, given that at least one die shows a 6.

## Solution

### Shade the first given event

The red die shows a 6 in one row of the grid. The row has 6 cells.

### Shade the second given event

At least one die shows a 6 in that row and in one column. The row and the
column share the cell $(6,6)$, so together they have $6 + 6 - 1 = 11$ cells.

::visual{name="outcome-grid" one="roll of the two dice" rows="1, 2, 3, 4, 5, 6" row-name="red die" columns="1, 2, 3, 4, 5, 6" column-name="blue die" given="6-*" given-name="the red die shows a 6" then-given="6-*, *-6" then-given-name="at least one die shows a 6" event="6-6" event-name="both dice show a 6"}

### Divide

Both dice show a 6 in $\red{1}$ cell, and that cell is in both shaded
regions. Every cell has probability $1/36$, so the two answers are

$$
\frac{\red{1}/36}{6/36} = \frac{\red{1}}{6}
\qquad\text{and}\qquad
\frac{\red{1}/36}{11/36} = \frac{\red{1}}{11}.
$$

### Compare

The numerator is the same cell both times. The second given event is true
for 11 outcomes and not 6, so that one cell is a smaller share of them.

"The red die shows a 6" names a die, so only the blue die is left to ask
about, and it shows a 6 with probability $1/6$. "At least one die shows a 6"
does not say which die, so it also keeps the 5 outcomes where only the blue
die shows a 6.
