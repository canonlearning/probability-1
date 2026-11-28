# Bayes' Rule

**Bayes' rule** turns a conditional probability around. We know how likely an
observation is in each of several cases, and the rule gives how likely each
case is, given the observation.

This lesson uses one example. A factory makes one kind of part on three
machines.

- Machine 1 makes 3 parts in 5, and 1 in 15 of its parts is defective.
- Machine 2 makes 3 parts in 10, and 1 in 10 of its parts is defective.
- Machine 3 makes 1 part in 10, and 1 in 5 of its parts is defective.

A part is found to be defective. We want the probability that each machine
made it.

## Count the parts

Suppose the factory makes 1000 parts. Machine 1 makes 600 of them, machine 2
makes 300, and machine 3 makes 100. Of the 600 parts from machine 1, 1 in 15
is defective, which is 40 parts. In the same way, 30 of the parts from
machine 2 are defective, and 20 of the parts from machine 3.

::visual{name="defective-parts"}

|           | Defective | Good | Total |
|-----------|-----------|------|-------|
| Machine 1 | 40        | 560  | 600   |
| Machine 2 | 30        | 270  | 300   |
| Machine 3 | 20        | 80   | 100   |
| Total     | 90        | 910  | 1000  |

We know the part is defective, so we look only at the 90 defective parts,
which are at the front of the figure. Machine 1 made 40 of them, so the
probability that machine 1 made the defective part is $40/90 = 4/9$. For
machine 2 it is $30/90 = 1/3$, and for machine 3 it is $20/90 = 2/9$.

Machine 3 makes a defective part 3 times as often as machine 1 (1 part in 5
against 1 in 15). However, the defective part is half as likely to have come
from machine 3 as from machine 1 ($2/9$ against $4/9$). The reason is that
machine 1 makes 6 times as many parts, so it makes more defective parts even
though a smaller share of its parts is defective.

## Bayes' rule for the three machines

The count used 1000 parts, but the answers do not depend on that number. We
now find them from the probabilities alone.

Choose one part at random. Let $M_1$, $M_2$, and $M_3$ be the events that
machine 1, machine 2, and machine 3 made it, and let $D$ be the event that
it is defective. We want $P(M_3 \mid D)$, and the same for the other two
machines.

> **On paper**
> Draw the tree for one part: first which machine makes it, with three
> branches, then whether it is defective. Write a probability on every
> branch and the product at the end of every path. Circle the three paths
> that end in a defective part.

The definition of conditional probability gives

$$
P(M_3 \mid D) = \frac{P(M_3 \cap D)}{P(D)}.
$$

The top is the path of the tree through machine 3 that ends in a defective
part. Its probability is the product along the path, by the multiplication
rule:

$$
P(M_3 \cap D) = P(M_3)\,P(D \mid M_3) = \frac{1}{10} \cdot \frac{1}{5} = \frac{2}{100}.
$$

The bottom is the probability that a part is defective. Three paths end in a
defective part, one for each machine, and no part follows two paths, so we
add the three:

$$
\begin{aligned}
P(D) &= P(M_1)\,P(D \mid M_1) + P(M_2)\,P(D \mid M_2) + P(M_3)\,P(D \mid M_3) \\[6pt]
&= \frac{3}{5} \cdot \frac{1}{15} + \frac{3}{10} \cdot \frac{1}{10} + \frac{1}{10} \cdot \frac{1}{5} \\[6pt]
&= \frac{4}{100} + \frac{3}{100} + \frac{2}{100} = \frac{9}{100}.
\end{aligned}
$$

Of all the parts, 9 in 100 are defective, which is the 90 of 1000 in the
count. With the top and the bottom written out, we have

$$
\begin{aligned}
P(M_3 \mid D) &= \frac{P(M_3)\,P(D \mid M_3)}{P(M_1)\,P(D \mid M_1) + P(M_2)\,P(D \mid M_2) + P(M_3)\,P(D \mid M_3)} \\[6pt]
&= \frac{2/100}{9/100} = \frac{2}{9}.
\end{aligned}
$$

This is Bayes' rule for the three machines. The bottom has one term for each
machine, and the top is the term of machine 3. For the other two machines
only the top changes, so $P(M_1 \mid D) = 4/9$ and
$P(M_2 \mid D) = 3/9 = 1/3$. These are the answers from the count.

In the figure, the thickness of a band is a probability.

::visual{name="case-flow" one="part" event="defective" cases="machine 1, machine 2, machine 3" shares="3/5, 3/10, 1/10" rates="1/15, 1/10, 1/5" highlight="3"}

## The rule in general

The same steps work for any number of cases, as long as exactly one of the
cases happens. Events $A_1, A_2, \dots, A_n$ form a **partition** when every
outcome is in exactly one of them (every part is made by exactly one
machine). Let $B$ be any event (the part is defective).

The sum on the bottom is the **law of total probability**:

$$
P(B) = P(A_1)\,P(B \mid A_1) + P(A_2)\,P(B \mid A_2) + \dots + P(A_n)\,P(B \mid A_n). \tag{1}
$$

It has one term for each case: the probability of the case, times the
probability of $B$ given that case.

Bayes' rule divides one of these terms by the sum:

$$
P(A_i \mid B) = \frac{P(A_i)\,P(B \mid A_i)}{P(A_1)\,P(B \mid A_1) + \dots + P(A_n)\,P(B \mid A_n)}, \tag{2}
$$

where $A_i$ is any one of the cases. Both rules hold when every
$P(A_i) > 0$, and (2) also needs $P(B) > 0$.

## Prior and posterior

Bayes' rule gave one probability for each machine. To see what the defective
part changed, we compare each of them with the probability of that machine
before we knew the part was defective.

The probability of a case before the observation is its **prior**
probability, and the probability of the case given the observation is its
**posterior** probability. For the machines:

|           | Prior  | Posterior |
|-----------|--------|-----------|
| Machine 1 | $3/5$  | $4/9$     |
| Machine 2 | $3/10$ | $1/3$     |
| Machine 3 | $1/10$ | $2/9$     |

In the figure, the width of a strip is a machine's prior probability, and
the bar at the front shows the posterior probabilities.

::visual{name="case-strips" one="part" event="defective" cases="machine 1, machine 2, machine 3" shares="3/5, 3/10, 1/10" rates="1/15, 1/10, 1/5" highlight="3" sliders="yes"}

A machine becomes more likely when its parts are defective more often than
parts are defective overall. For machine 3 this is $1/5$ against $9/100$, so
its probability rose from $1/10$ to $2/9$. For machine 1 it is $1/15$, which
is less than $9/100$, so its probability fell from $3/5$ to $4/9$.

Machine 3 rose, but it started from $1/10$, so it is still the least likely
of the three. The posterior probability depends on the prior probability as
well as on how often each machine makes a defective part.
