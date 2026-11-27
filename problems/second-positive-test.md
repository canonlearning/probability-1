---
title: A second positive test
answer: $9/20$ and $81/92$
---

In the lesson on conditional probability, a condition affects 1 person in
100. Of the people who have it, 9 in 10 test positive, and of the people who
do not, 1 in 10 test positive. A person tests positive, and so has the
condition with probability $1/12$.

This person takes the test again. The result of each test depends only on
whether the person has the condition, and not on the results of the earlier
tests.

Use the probability after one test as the prior probability for the next
test. Find each probability as an exact fraction.

1. The second test is also positive. Find the probability that the person
   has the condition, given two positive tests.
2. A third test is also positive. Find the probability that the person has
   the condition, given three positive tests.

## Solution

### Start from the answer after one test

Let $D$ be the event that the person has the condition. After one positive
test, the probability of $D$ is $1/12$ and the probability of $D^c$ is
$11/12$. These are the prior probabilities for the second test.

### Apply Bayes' rule for the second test

A second positive test has probability $9/10$ if the person has the
condition and $1/10$ if not, whatever the first test showed. The two
products are

$$
\frac{1}{12} \cdot \frac{9}{10} = \frac{9}{120}
\qquad\text{and}\qquad
\frac{11}{12} \cdot \frac{1}{10} = \frac{11}{120}.
$$

They add to $20/120$, so the probability that the person has the condition,
given two positive tests, is

$$\frac{9/120}{20/120} = \frac{9}{20}.$$

### Do the same for the third test

The prior probabilities are now $9/20$ and $11/20$. The two products are
$\frac{9}{20} \cdot \frac{9}{10} = \frac{81}{200}$ and
$\frac{11}{20} \cdot \frac{1}{10} = \frac{11}{200}$, which add to
$92/200$. So the probability, given three positive tests, is

$$\frac{81/200}{92/200} = \frac{81}{92}.$$

### Check by counting

Take 100,000 people. The table follows the people who are positive on every
test so far.

|                    | Start  | One positive | Two positive | Three positive |
|--------------------|--------|--------------|--------------|----------------|
| Have the condition | 1,000  | 900          | 810          | 729            |
| Do not             | 99,000 | 9,900        | 990          | 99             |

After two tests, 810 of $810 + 990 = 1800$ people have the condition, which
is $9/20$. After three tests, 729 of $729 + 99 = 828$ have it, which is
$81/92$.

### What each test did

The probability went from $1/100$ to $1/12$, then $9/20$, then $81/92$:
about 1%, 8%, 45%, and 88%. Each positive test keeps 9 in 10 of the people
who have the condition and 1 in 10 of the people who do not. One positive
test is weak evidence here because so few people have the condition at the
start. Three positive tests are strong evidence.
