---
title: Two batteries from a drawer
answer: $1/10$ and $1/4$
---

A drawer holds 5 batteries that look the same, and 2 of them are dead. We
take out two batteries without looking, one after the other. The first goes
into a flashlight. The second goes into a battery tester.

Draw the tree: first whether the first battery is dead, then whether the
second battery is dead. Write a probability on every branch and the product
at the end of every path.

Find each probability as an exact fraction.

1. Both batteries are dead.
2. The tester shows that the second battery is dead, and the flashlight has
   not been switched on. Find the probability that the first battery is
   dead, given that the second is dead.

## Solution

### Draw the tree

Let $A$ be the event that the first battery is dead and $B$ the event that
the second is dead. The first branches are $A$ with probability $2/5$ and
$A^c$ with probability $3/5$.

The second branches depend on the first, because the first battery is not
put back. If the first is dead, 4 batteries are left and 1 is dead, so
$P(B \mid A) = 1/4$. If the first is good, 4 are left and 2 are dead, so
$P(B \mid A^c) = 2/4 = 1/2$.

### Multiply along the first path

Both batteries are dead along one path, and (2) from the lesson gives

$$P(A \cap B) = P(A)\,P(B \mid A) = \frac{2}{5} \times \frac{1}{4} = \frac{1}{10}.$$

The other three products are $3/10$, $3/10$, and $3/10$. In the figure each
product is the area of a rectangle.

::visual{name="area-square" one="pair of batteries" first="first is dead" not-first="first is good" first-symbol="A" probability="2/5" second="second is dead" not-second="second is good" second-symbol="B" probability-if-first="1/4" probability-if-not="1/2"}

### Add the paths that end in a dead second battery

The second battery is dead along two paths, and no pair follows both, so

$$P(B) = \frac{1}{10} + \frac{3}{10} = \frac{2}{5}.$$

This is the same as $P(A)$. Before either battery is tested, the second is
as likely to be dead as the first.

### Divide

$$
\begin{aligned}
P(A \mid B) &= \frac{P(A \cap B)}{P(B)} \\[6pt]
&= \frac{1/10}{2/5} \\[6pt]
&= \frac{1}{4}.
\end{aligned}
$$

### What the later draw tells us

The second draw did not change the first battery. It changed what we know
about it. The battery in the tester is one of the 2 dead ones, so the battery
in the flashlight is one of the other 4, and 1 of those 4 is dead. That is
$1/4$, which is less than the $2/5$ we had before the test.
