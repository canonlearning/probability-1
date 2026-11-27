---
title: An ice cream stand
answer: $19/50$
---

On a summer day at a beach, the weather is sunny with probability $1/2$,
cloudy with probability $3/10$, and rainy with probability $1/5$. An ice
cream stand sells out with probability $3/5$ on a sunny day, $1/5$ on a
cloudy day, and $1/10$ on a rainy day.

Draw the tree for one day: first the weather, with three branches, then
whether the stand sells out. Write a probability on every branch and the
product at the end of every path.

Find the probability that the stand sells out, as an exact fraction.

## Solution

### Name the cases

Let $S$, $C$, and $R$ be the events that the day is sunny, cloudy, and
rainy, and let $O$ be the event that the stand sells out. Every day has
exactly one kind of weather, so $S$, $C$, and $R$ form a partition.

### Multiply along the paths that end in a sold-out stand

Three paths end in a sold-out stand, one for each kind of weather. Their
probabilities are

$$
\frac{1}{2} \cdot \frac{3}{5} = \frac{15}{50}, \qquad
\frac{3}{10} \cdot \frac{1}{5} = \frac{3}{50}, \qquad\text{and}\qquad
\frac{1}{5} \cdot \frac{1}{10} = \frac{1}{50}.
$$

### Add the three paths

No day follows two paths, so the law of total probability, (1) from the
lesson, gives

$$
\begin{aligned}
P(O) &= P(S)\,P(O \mid S) + P(C)\,P(O \mid C) + P(R)\,P(O \mid R) \\[6pt]
&= \frac{15}{50} + \frac{3}{50} + \frac{1}{50} \\[6pt]
&= \frac{19}{50}.
\end{aligned}
$$

::visual{name="case-flow" one="day" event="sold out" cases="sunny, cloudy, rainy" shares="1/2, 3/10, 1/5" rates="3/5, 1/5, 1/10" highlight="1" until="sum"}

### Why the plain average is wrong

The average of the three probabilities of selling out is
$\frac{1}{3}\left(\frac{3}{5} + \frac{1}{5} + \frac{1}{10}\right) = \frac{15}{50}$.
This would be the answer only if the three kinds of weather were equally
likely. Half of the days are sunny, so $3/5$ counts for more than the other
two, and the answer, $19/50$, is greater than $15/50$.
