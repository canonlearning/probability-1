---
title: Two batteries from a drawer
answer: $1/15$ and $1/5$
---

A drawer holds 6 batteries that look the same, and 2 of them are dead. We
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
the second is dead. The first branches are $A$ with probability
$2/6 = 1/3$ and $A^c$ with probability $4/6 = 2/3$.

The second branches depend on the first, because the first battery is not
put back. If the first is dead, 5 batteries are left and 1 is dead, so
$P(B \mid A) = 1/5$. If the first is good, 5 are left and 2 are dead, so
$P(B \mid A^c) = 2/5$.

### Multiply along the first path

Both batteries are dead along one path. Its probability is the product
along it, which is (2) from the lesson with $A$ as the event that comes
first:

$$P(A \cap B) = P(A)\,P(B \mid A) = \frac{1}{3} \times \frac{1}{5} = \frac{1}{15}.$$

The other three products are $4/15$, $4/15$, and $6/15 = 2/5$. In the
figure each product is the area of a rectangle.

::visual{name="area-square" one="pair of batteries" first="first is dead" not-first="first is good" first-symbol="A" probability="1/3" second="second is dead" not-second="second is good" second-symbol="B" probability-if-first="1/5" probability-if-not="2/5"}

### Add the paths that end in a dead second battery

The second battery is dead along two paths, and no pair follows both, so

$$P(B) = \frac{1}{15} + \frac{4}{15} = \frac{1}{3}.$$

This is the same as $P(A)$. Before either battery is tested, the second is
as likely to be dead as the first.

### Divide

$$
\begin{aligned}
P(A \mid B) &= \frac{P(A \cap B)}{P(B)} \\[6pt]
&= \frac{1/15}{1/3} \\[6pt]
&= \frac{1}{5}.
\end{aligned}
$$

### What the later draw tells us

The second draw did not change the first battery. It changed what we know
about it. The battery in the tester is one of the 2 dead ones, so the battery
in the flashlight is one of the other 5, and 1 of those 5 is dead. That is
$1/5$, which is less than the $1/3$ we had before the test.
