---
id: conditional-probability
title: Conditional probability
---

A condition affects 1 person in 100. A test for it comes back positive for 9
in 10 people who have the condition, and for 1 in 20 people who do not.

A person tests positive. How likely is it that they have the condition?

> Before computing anything, write down a guess. Is it closer to 90%, 50%, or
> 10%?

## Counting the people who test positive

The question is about one person, but we answer it first for a crowd, because
people in a crowd can be counted. Suppose 2000 people take the test, and
suppose the shares come out exactly as stated.

- 1 person in 100 has the condition, so 20 people have it and 1980 do not.
- Of the 20 who have it, 9 in 10 test positive, so 18 test positive and 2
  test negative.
- Of the 1980 who do not, 1 in 20 test positive, so 99 test positive and 1881
  test negative.

| | Tests positive | Tests negative | Total |
|---|---|---|---|
| Has the condition | 18 | 2 | 20 |
| Does not have the condition | 99 | 1881 | 1980 |
| Total | 117 | 1883 | 2000 |

We are told that the person tested positive, so the person is one of the 117
people in the first column. The other 1883 people are ruled out. Of those 117
people, 18 have the condition. The answer is therefore

$$\frac{18}{117} = \frac{2}{13},$$

which is about 15%.

The test is right for 9 in 10 people who have the condition, and still most
people who test positive do not have it. The table shows the reason. Far more
people are without the condition than with it (1980 against 20). A small
share of the large group (99 people) is therefore larger than a large share
of the small group (18 people).

## The definition

Counting works when there is a crowd to count. We want a rule that uses
probabilities alone, so that it applies to any experiment (e.g., rolling dice
or drawing cards).

The count had two steps. First we kept only the people who tested positive.
Then, among those people, we took the share who have the condition. We now
write the same two steps with probabilities.

Choose one of the 2000 people at random. Let $D$ be the event that the person
has the condition, and let $T$ be the event that the person tests positive.
The event that both happen is written $D \cap T$. Each person is equally
likely to be chosen, so

$$P(T) = \frac{117}{2000} \quad \text{and} \quad P(D \cap T) = \frac{18}{2000}.$$

Dividing the second probability by the first gives the answer from the count,
because the 2000 cancels:

$$\frac{P(D \cap T)}{P(T)} = \frac{18/2000}{117/2000} = \frac{18}{117} = \frac{2}{13}.$$

This ratio is the definition. Let $A$ and $B$ be events with $P(B) > 0$. The
conditional probability of $A$ given $B$ is

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}.$$

The denominator keeps only the outcomes in $B$. The numerator keeps the
outcomes of $A$ that are also in $B$. The definition requires $P(B) > 0$
because we cannot divide by zero.

In this notation, the answer to the opening question is $P(D \mid T) = 2/13$.

## The multiplication rule

The opening question does not give $P(D \cap T)$. It gives $P(D) = 1/100$, and
it gives the probability of a positive test for a person who has the
condition, which is the conditional probability $P(T \mid D) = 9/10$. We
therefore need a way to get $P(D \cap T)$ from these two numbers.

The definition provides it. By the definition,
$P(T \mid D) = P(D \cap T) / P(D)$. Multiplying both sides by $P(D)$ gives

$$P(D \cap T) = P(D)\,P(T \mid D).$$

We call this the multiplication rule. It states that the probability that two
events both happen is the probability of the first, times the probability of
the second given the first. For the test,

$$P(D \cap T) = \frac{1}{100} \cdot \frac{9}{10} = \frac{9}{1000},$$

which equals the $18/2000$ from the count.

## Tree diagrams

The test is an experiment in two stages. First the person has the condition
or does not, and then the test is positive or negative. An experiment in
stages can be drawn as a tree, with one branch for each thing that can happen
at each stage. On each branch we write the probability of that step given the
steps before it.

A path is a route from the start of the tree to one of its ends (e.g., the
person has the condition and then tests positive). By the multiplication
rule, the probability of a path is the product of the probabilities along it.

The figure below is the tree for the test. We write $D^c$ for the event that
the person does not have the condition, and $T^c$ for the event that the test
is negative.

::visual{name="diagnostic-test-tree"}

Each run of the simulation chooses one person at random and follows one path.
The share of runs on each path is close to the product along that path, and
not exactly equal to it, because the people are chosen at random.

The tree has four paths.

| Path | Probability |
|---|---|
| $D$, then $T$ | $\frac{1}{100} \cdot \frac{9}{10} = \frac{9}{1000}$ |
| $D$, then $T^c$ | $\frac{1}{100} \cdot \frac{1}{10} = \frac{1}{1000}$ |
| $D^c$, then $T$ | $\frac{99}{100} \cdot \frac{1}{20} = \frac{99}{2000}$ |
| $D^c$, then $T^c$ | $\frac{99}{100} \cdot \frac{19}{20} = \frac{1881}{2000}$ |

Every person follows exactly one of the four paths, so the four probabilities
add to 1. We check this on every tree, because a sum other than 1 means that
a branch is wrong. Here the sum is

$$\frac{18}{2000} + \frac{2}{2000} + \frac{99}{2000} + \frac{1881}{2000} = 1.$$

## Answering the question from the tree

We can now answer the opening question without counting people. A positive
test happens along two paths, and no person follows both, so we add their
probabilities:

$$P(T) = \frac{9}{1000} + \frac{99}{2000} = \frac{117}{2000}.$$

Only the first of these two paths has the condition, so
$P(D \cap T) = 9/1000$. By the definition,

$$P(D \mid T) = \frac{P(D \cap T)}{P(T)} = \frac{9/1000}{117/2000} = \frac{2}{13}.$$

This is the same answer as the count, and it uses only the three
probabilities given in the question.

> $P(T \mid D) = 9/10$ and $P(D \mid T) = 2/13$. Say in words what each one
> measures, and who would care about each.

> Suppose the condition affects 1 person in 10 instead of 1 in 100. Redraw
> the tree and find $P(D \mid T)$.
