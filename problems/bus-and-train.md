---
title: A bus and a train
answer: Areas 200, 25, and $175/2$, and the last is $7/32$ of the square
---

A bus arrives at a station $x$ minutes after noon, and a train arrives $y$
minutes after noon. Each of $x$ and $y$ is from 0 to 20, ends included, and
neither has to be a whole number ($x = 7.5$ is 30 seconds after 12:07). An
outcome is the pair $(x, y)$, which we draw as a point with $x$ across and
$y$ up. A length of 1 in the drawing is 1 minute, and areas are given as
plain numbers in these units.

Draw the sample space. Then draw it three more times, and on each copy shade
one of the events below and find the area of the shaded region.

1. The bus arrives before the train: $x < y$.
2. Both arrive in the first 5 minutes: $x \le 5$ and $y \le 5$.
3. The train arrives after the bus, and no more than 5 minutes after it:
   $0 < y - x \le 5$.

Last, say whether the outcomes of this sample space can be written out one
after another, as the outcomes HH, LL, HLL, LHH, and so on are in the
problem about readings of a gauge. Then find what part of the area of the
sample space the third event takes up.

## Solution

### Draw the sample space

Every pair $(x, y)$ with $0 \le x \le 20$ and $0 \le y \le 20$ is an
outcome. These points fill a square with corners $(0, 0)$, $(20, 0)$,
$(20, 20)$, and $(0, 20)$. Its side is 20, so its area is
$20 \times 20 = 400$.

In the figure, each event is a region of the square.

::visual{name="arrival-square"}

### The bus arrives before the train

The points with $x = y$ are the diagonal from
$(0, 0)$ to $(20, 20)$, and the points with $x < y$ are above it. The event
is the triangle with corners $(0, 0)$, $(0, 20)$, and $(20, 20)$.

The diagonal cuts the square into two equal triangles, so the area is
$400 / 2 = 200$. The diagonal itself is not in the event, because on it the
bus and the train arrive together. A line has no area, so the area would be
the same with the diagonal shaded.

### Both arrive in the first 5 minutes

This event is the intersection of "the bus arrives in the first 5 minutes"
and "the train arrives in the first 5 minutes". The first is the strip
$x \le 5$ along the left side, and the second is the strip $y \le 5$ along
the bottom. Each strip is 5 by 20 and has area 100.

The strips overlap in the small square with corners $(0, 0)$, $(5, 0)$,
$(5, 5)$, and $(0, 5)$. Its area is $5 \times 5 = 25$.

### The train arrives no more than 5 minutes after the bus

The train arrives $y - x$ minutes after the bus, which is why the condition
is $0 < y - x \le 5$. The points with $y - x = 0$ are the diagonal, and the
points with $y - x = 5$ are the line from $(0, 5)$ to $(15, 20)$, which is
the diagonal moved up by 5. The event is the band between the two lines,
with the second line and without the diagonal. Leaving out the diagonal does
not change the area, as before. The corners of the band are $(0, 0)$,
$(0, 5)$, $(15, 20)$, and $(20, 20)$.

We find its area by subtracting. The band is the triangle above the
diagonal, which has area 200, without the points where the train is more
than 5 minutes after the bus. Those points are the triangle above the second
line, with corners $(0, 5)$, $(0, 20)$, and $(15, 20)$. Its two short sides
are both 15, so

$$
\begin{aligned}
\text{area of the band} &= 200 - \frac{15 \times 15}{2} \\[6pt]
&= 200 - \frac{225}{2} \\[6pt]
&= \frac{175}{2}.
\end{aligned}
$$

This is 87.5.

### Can the outcomes be written one after another

There are infinitely many outcomes, because there are infinitely many times
from 0 to 20. In the problem about readings there are also infinitely many
outcomes, and they can be written one after another (HH, LL, HLL, LHH, and
so on): the writing never ends, but every outcome has a place in it. The
points of the square cannot be written one after another in this way,
whatever order is tried. We take this as a fact here. So we describe the
sample space by a condition and a drawing.

Events are still sets of outcomes. Each event above is a region of the
square, and a region holds infinitely many points, so counting outcomes says
nothing about the size of an event. What we can compare is area.

### The part of the square

$$
\frac{175/2}{400} = \frac{175}{800} = \frac{7}{32}.
$$

The third event is $7/32$ of the area of the square, which is a little more
than a fifth. The first event is $200/400 = 1/2$ of it and the second is
$25/400 = 1/16$.

Here $7/32$ is only a part of the square's area. A later lesson uses area to
measure how likely a region is, when no region is favored over another
region of the same area.