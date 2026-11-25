# Conditional Probability

A **conditional probability** is the probability of an event, given that
another event is known to have happened. Knowing that the second event
happened rules out some outcomes, so the probability can change.

This lesson uses one example. A condition affects 1 person in 100, and there
is a test for it. Of the people who have the condition, 9 in 10 test
positive. Of the people who do not have it, 1 in 10 test positive. A person
tests positive. We want the probability
that this person has the condition, given the positive test.

## Count the people

We find this probability first for a crowd, because people in a crowd can be
counted. In the figure, 1000 people take the test one after another.

::visual{name="diagnostic-test-crowd"}

We look only at the two positive stacks, because we know the person tested
positive. At the end, $\red{9}$ of these people have the condition and 99 do
not. So $\red{9}$ of the 108 people who test positive have the condition,
which is about 8%.

A positive test for a person who does not have the condition is called a
**false positive**. Only 1 in 10 of the people without the condition get one,
and 9 in 10 of the people with the condition test positive. However, only 1
person in 100 has the condition, which is 10 of the 1000 people. The positive
tests from people with the condition and the false positives are therefore

$$\frac{9}{10} \times 10 = \red{9} \qquad\text{and}\qquad \frac{1}{10} \times 990 = 99.$$

## The definition

Let $A$ and $B$ be events with $P(B) > 0$. The conditional probability of $A$
given $B$ is

$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \tag{1}
$$

where $A \cap B$ is the event that both happen. The denominator keeps only
the outcomes in $B$, and the numerator keeps the outcomes of $A$ that are
also in $B$.

We apply the definition to the count. Choose one of the 1000 people at
random. Let $D$ be the event that the person has the condition, and let $T$
be the event that the person tests positive. Then $P(D \mid T)$ is the
probability that the person has the condition, given that the person tested
positive. This is the probability we want.

Of the 1000 people, 108 test positive, and $\red{9}$ both have the condition
and test positive. So $P(T) = 108/1000$ and $P(D \cap T) = \red{9}/1000$, and
(1) gives

$$
\begin{aligned}
P(D \mid T) &= \frac{P(D \cap T)}{P(T)} \\[6pt]
&= \frac{\red{9}/1000}{108/1000} \\[6pt]
&= \frac{\red{9}}{108} = \frac{1}{12}.
\end{aligned}
$$

Of the people who test positive, 1 in 12 has the condition. This is the
share from the count, because the 1000 cancels.

The total cancels whenever every outcome is equally likely (each of the 1000
people, each face of a die). Then $P(A \mid B)$ is the number of outcomes in
both $A$ and $B$, divided by the number of outcomes in $B$.

## The tree

A **probability tree** is a diagram of every possible outcome when events
happen one after another. It branches once for each result an event can have,
so each path from the start to an end is one possible outcome.

Each branch carries the probability of its result, given the branches before
it. The probability of a path is the product of the probabilities along it.
This is the **multiplication rule**, which is (1) with both sides multiplied
by $P(B)$:

$$
P(A \cap B) = P(B)\,P(A \mid B). \tag{2}
$$

We draw the tree for the test. The first event is whether the person has the
condition, and the second event is the test result. The three numbers we were
given go on the branches:

- $P(D) = 1/100$ is the probability that the person has the condition.
- $P(T \mid D) = 9/10$ is the probability of a positive test, given that the
  person has the condition.
- $P(T \mid D^c) = 1/10$ is the probability of a positive test, given that
  the person does not have the condition. $D^c$ is the event that the person
  does not have it.

> **On paper**
> Draw this tree, with a probability on every branch and the product at the
> end of every path. Then compare it with the figure.

::visual{name="probability-tree" one="person" slider="yes" first="has the condition" not-first="does not" first-symbol="D" probability="1/100" second="positive" not-second="negative" second-symbol="T" probability-if-first="9/10" probability-if-not="1/10"}

Two paths end in a positive test, and no person follows both, so we add
their probabilities: $P(T) = 9/1000 + 99/1000 = 108/1000$. Only the first of
the two goes through the condition, so $P(D \cap T) = \red{9}/1000$, and (1)
gives

$$
\begin{aligned}
P(D \mid T) &= \frac{P(D \cap T)}{P(T)} \\[6pt]
&= \frac{\red{9}/1000}{108/1000} \\[6pt]
&= \frac{1}{12}.
\end{aligned}
$$

This is the answer from the count. The tree needed no crowd, only the three
probabilities.

The two conditional probabilities in this lesson are different.
$P(T \mid D) = 9/10$ is the probability of a positive test for a person who
has the condition. $P(D \mid T) = 1/12$ is the probability of the condition
for a person who tests positive.
