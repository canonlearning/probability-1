---
title: A search that finds nothing
answer: $1/6$, $1/2$, and $1/3$
---

A set of keys is lost. The keys are in a coat with probability $1/2$, in a
bag with probability $3/10$, and in a car with probability $1/5$.

We search the coat. If the keys are in the coat, a search of the coat finds
them with probability $4/5$. If they are somewhere else, it finds nothing.
The search finds nothing.

Make a table with a row for each place and four columns: the prior
probability, the probability that the search of the coat finds nothing if
the keys are in that place, their product, and the posterior probability.
Write the total under the first, third, and fourth columns.

Find the probability that the keys are in each place, given that the search
found nothing, as exact fractions.

## Solution

### Find the probability of the observation in each case

The observation is that the search of the coat found nothing. If the keys
are in the coat, the search misses them with probability $1 - 4/5 = 1/5$. If
the keys are in the bag or in the car, the search of the coat is certain to
find nothing, so the probability is 1.

### Multiply and add

|       | Prior  | Finds nothing | Product | Posterior     |
|-------|--------|---------------|---------|---------------|
| Coat  | $1/2$  | $1/5$         | $1/10$  | $1/6$         |
| Bag   | $3/10$ | $1$           | $3/10$  | $3/6 = 1/2$   |
| Car   | $1/5$  | $1$           | $2/10$  | $2/6 = 1/3$   |
| Total | $1$    |               | $6/10$  | $1$           |

The products add to $6/10$. By the law of total probability, this is the
probability that the search finds nothing.

### Divide each product by the total

Bayes' rule divides each product by $6/10$, which gives $1/6$ for the coat,
$1/2$ for the bag, and $1/3$ for the car.

::visual{name="case-strips" one="search" event="nothing found" cases="coat, bag, car" shares="1/2, 3/10, 1/5" rates="1/5, 1/1, 1/1" highlight="1"}

### What the search changed

The coat fell from $1/2$ to $1/6$. It did not fall to 0, because a search
misses the keys 1 time in 5.

The bag and the car both rose, from $3/10$ to $1/2$ and from $1/5$ to $1/3$,
although nobody looked in either. The three probabilities add to 1, so what
the coat lost went to the other two. Their ratio is 3 to 2 before and after,
because the search of the coat is equally likely to find nothing whether the
keys are in the bag or in the car.
