---
title: A flagged email
answer: $4/13$
---

One in ten emails that arrive at an inbox is spam. A filter flags a spam email
with probability $4/5$, and it flags an email that is not spam with
probability $1/5$.

Draw the tree for one email: first whether it is spam, then whether it is
flagged. Write a probability on every branch and the product at the end of
every path.

An email is flagged. Use the tree to find the probability that it is spam, as
an exact fraction.

## Solution

### Draw the tree

Let $S$ be the event that the email is spam and $F$ the event that it is
flagged. The first branches are $S$ with probability $1/10$ and $S^c$ with
probability $9/10$. The second branches are $F$ and $F^c$. The tree has four
paths, and the probability of each is the product along it.

The products are also areas. In the figure, the width of a strip is the
probability of the first branch and the height of a rectangle is the
probability of the second, so the area of each rectangle is one of the four
products.

::visual{name="area-square" one="email" first="spam" first-symbol="S" probability="1/10" second="flagged" second-symbol="F" probability-if-first="4/5" probability-if-not="1/5"}

The four products are $2/25$, $1/50$, $9/50$, and $18/25$. They add to 1,
because together the four rectangles fill the square.

### Add the paths that end in a flag

An email is flagged along two paths: it is spam and flagged, or it is not spam
and flagged. No email follows both, so

$$P(F) = \frac{2}{25} + \frac{9}{50} = \frac{13}{50}.$$

### Divide

Only the first of those two paths is spam, so $P(S \cap F) = 2/25$ and

$$P(S \mid F) = \frac{P(S \cap F)}{P(F)} = \frac{2/25}{13/50} = \frac{4}{13}.$$

Most flagged emails are not spam, even though the filter catches most spam.
