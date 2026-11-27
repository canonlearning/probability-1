---
title: Three bakers
answer: $1/4$, $1/3$, and $5/12$
---

A bakery has three bakers.

- Baker 1 bakes $1/2$ of the loaves and burns 1 in 20 of them.
- Baker 2 bakes $1/3$ of the loaves and burns 1 in 10 of them.
- Baker 3 bakes $1/6$ of the loaves and burns 1 in 4 of them.

One loaf is chosen at random from all the loaves, and it is burnt.

Make a table with a row for each baker and four columns: the prior
probability, the probability of a burnt loaf for that baker, their product,
and the posterior probability. Fill it in, and write the total under the first,
third, and fourth columns.

Find the probability that each baker baked the burnt loaf, as exact
fractions.

## Solution

### Multiply across each row

The product in a row is the probability that the baker baked the loaf and
burnt it. Written over one denominator, the three products are $3/120$,
$4/120$, and $5/120$.

### Add the products

The products add to $12/120 = 1/10$. By the law of total probability, this
is the probability that a loaf is burnt.

### Divide each product by the total

Bayes' rule, (2) from the lesson, divides each product by their total.

|         | Prior | Burnt  | Product   | Posterior      |
|---------|-------|--------|-----------|----------------|
| Baker 1 | $1/2$ | $1/20$ | $3/120$   | $3/12 = 1/4$   |
| Baker 2 | $1/3$ | $1/10$ | $4/120$   | $4/12 = 1/3$   |
| Baker 3 | $1/6$ | $1/4$  | $5/120$   | $5/12$         |
| Total   | $1$   |        | $12/120$  | $1$            |

The same table can be counted. Of 120 loaves, the bakers bake 60, 40, and
20, and they burn 3, 4, and 5. Of the 12 burnt loaves, 3, 4, and 5 came from
each baker.

### Compare before and after

The burnt loaf made baker 3 more likely ($1/6$ to $5/12$) and baker 1 less
likely ($1/2$ to $1/4$). It left baker 2 at $1/3$.

To see why, write Bayes' rule for one baker as a product:

$$
P(\text{baker} \mid \text{burnt}) = P(\text{baker}) \times \frac{P(\text{burnt} \mid \text{baker})}{P(\text{burnt})}.
$$

The posterior probability is the prior probability times a factor. Baker 2
burns 1 loaf in 10, and 1 loaf in 10 is burnt overall, so the factor is 1. A
burnt loaf is no more likely from baker 2 than from the bakery as a whole,
so it says nothing about baker 2. For baker 3 the factor is
$\frac{1/4}{1/10} = 5/2$, and for baker 1 it is $\frac{1/20}{1/10} = 1/2$.

The division in the last column changes every row by the same factor. The
products are in the ratio 3 to 4 to 5, and so are the posterior
probabilities.
