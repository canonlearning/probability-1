# Bayes' Rule

**Bayes' rule** turns a conditional probability around. We know how likely an
observation is in each of several cases, and the rule gives how likely each
case is, given the observation.

This lesson uses one example. A shop sends its parcels with three couriers.

- Courier 1 carries 3 parcels in 5, and 1 in 15 of its parcels arrives late.
- Courier 2 carries 3 parcels in 10, and 1 in 10 of its parcels arrives late.
- Courier 3 carries 1 parcel in 10, and 1 in 5 of its parcels arrives late.

A parcel arrives late. We want the probability that each courier carried it.

## Count the parcels

Suppose the shop sends 1000 parcels. Courier 1 carries 600 of them, courier
2 carries 300, and courier 3 carries 100. Courier 1 is late with 1 in 15 of
its 600, which is 40 parcels. In the same way, courier 2 is late with 30
parcels and courier 3 with 20.

::visual{name="late-parcels"}

|           | Late | On time | Total |
|-----------|------|---------|-------|
| Courier 1 | 40   | 560     | 600   |
| Courier 2 | 30   | 270     | 300   |
| Courier 3 | 20   | 80      | 100   |
| Total     | 90   | 910     | 1000  |

We know the parcel is late, so we look only at the 90 late parcels, which
are at the front of the figure. Courier 1 carried 40 of them, so the
probability that courier 1 carried the late parcel is $40/90 = 4/9$. For
courier 2 it is $30/90 = 1/3$, and for courier 3 it is $20/90 = 2/9$.

Courier 3 is late 3 times as often as courier 1 (1 parcel in 5 against 1 in
15). However, the late parcel is half as likely to have come with courier 3
as with courier 1 ($2/9$ against $4/9$). The reason is that courier 1
carries 6 times as many parcels, so it has more late parcels even though it
is late less often.

## The same count with probabilities

The count used 1000 parcels, but the answers do not depend on that number.
We now find them from the probabilities alone, in the same two steps: first
the probability that a parcel is late, then each courier's part of it.

Choose one parcel at random. Let $C_1$, $C_2$, and $C_3$ be the events that
courier 1, courier 2, and courier 3 carried it, and let $L$ be the event
that it is late.

> **On paper**
> Draw the tree for one parcel: first which courier carries it, with three
> branches, then whether it is late. Write a probability on every branch and
> the product at the end of every path. Circle the three paths that end in a
> late parcel.

Three paths end in a late parcel, one for each courier. The probability of
a path is the product along it, by the multiplication rule, and no parcel
follows two paths, so we add the three:

$$
\begin{aligned}
P(L) &= P(C_1)\,P(L \mid C_1) + P(C_2)\,P(L \mid C_2) + P(C_3)\,P(L \mid C_3) \\[6pt]
&= \frac{3}{5} \cdot \frac{1}{15} + \frac{3}{10} \cdot \frac{1}{10} + \frac{1}{10} \cdot \frac{1}{5} \\[6pt]
&= \frac{4}{100} + \frac{3}{100} + \frac{2}{100} = \frac{9}{100}.
\end{aligned}
$$

Of all the parcels, 9 in 100 arrive late, which is the 90 of 1000 in the
count.

The second step divides one path by this total. For courier 3, the
definition of conditional probability gives

$$
P(C_3 \mid L) = \frac{P(C_3 \cap L)}{P(L)} = \frac{2/100}{9/100} = \frac{2}{9}.
$$

In the same way, $P(C_1 \mid L) = 4/9$ and $P(C_2 \mid L) = 3/9 = 1/3$.
These are the answers from the count.

The figure shows both steps as a stream, where the thickness of a band is a
probability. The band of all the parcels splits into a branch for each
courier, and the dark band that leaves a branch is that courier's late
parcels. Its thickness is the product at the end of one late path of the
tree. The three dark bands meet in one stream of thickness $9/100$. Last,
that stream is widened to thickness 1, and each courier's part of it is the
probability that the courier carried the late parcel.

::visual{name="case-flow" one="parcel" event="late" cases="courier 1, courier 2, courier 3" shares="3/5, 3/10, 1/10" rates="1/15, 1/10, 1/5" highlight="3"}

## The two rules

Both steps hold for any number of cases, as long as exactly one of the
cases happens. Events $A_1, A_2, \dots, A_n$ form a **partition** when every
outcome is in exactly one of them (every parcel is carried by exactly one
courier). Let $B$ be any event (the parcel is late).

The first step is the **law of total probability**:

$$
P(B) = P(A_1)\,P(B \mid A_1) + P(A_2)\,P(B \mid A_2) + \dots + P(A_n)\,P(B \mid A_n). \tag{1}
$$

It has one term for each case: the probability of the case, times the
probability of $B$ given that case.

The second step is Bayes' rule:

$$
P(A_i \mid B) = \frac{P(A_i)\,P(B \mid A_i)}{P(A_1)\,P(B \mid A_1) + \dots + P(A_n)\,P(B \mid A_n)}, \tag{2}
$$

where $A_i$ is any one of the cases. The denominator is $P(B)$, written out
with (1), and the numerator is one of its terms. Both rules hold when every
$P(A_i) > 0$, and (2) also needs $P(B) > 0$.

## Prior and posterior

Bayes' rule gave one probability for each courier. To see what the late
parcel changed, we compare each of them with the probability of that courier
before we knew the parcel was late.

The probability of a case before the observation is its **prior**
probability, and the probability of the case given the observation is its
**posterior** probability. For the couriers:

|           | Prior  | Posterior |
|-----------|--------|-----------|
| Courier 1 | $3/5$  | $4/9$     |
| Courier 2 | $3/10$ | $1/3$     |
| Courier 3 | $1/10$ | $2/9$     |

In the figure, each courier is a strip, and the width of the strip is the
courier's prior probability. The bar at the front is the posterior
probabilities. The strips and the bar have the same total width, so a
courier whose part of the bar is wider than its strip became more likely.
The figure writes each probability as a percentage, and its sliders change
the prior probability of courier 3 and how often courier 3 is late.

::visual{name="case-strips" one="parcel" event="late" cases="courier 1, courier 2, courier 3" shares="3/5, 3/10, 1/10" rates="1/15, 1/10, 1/5" highlight="3" sliders="yes"}

A courier becomes more likely when it is late more often than parcels are
late overall. Courier 3 is late with probability $1/5$, against $9/100$
overall, so its probability rose from $1/10$ to $2/9$. Courier 1 is late
with probability $1/15$, which is less than $9/100$, so its probability fell
from $3/5$ to $4/9$.

Courier 3 rose, but it started from $1/10$, so it is still the least likely
of the three. The posterior probability depends on the prior probability as
well as on how often each courier is late.
