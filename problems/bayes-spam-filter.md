---
id: bayes-spam-filter
title: A flagged email
topic: bayes-rule
difficulty: 2
answer: $4/13$
---

One in ten emails that arrive at an inbox is spam. A filter flags a spam email
with probability $4/5$, and it flags an email that is not spam with
probability $1/5$.

An email is flagged. What is the probability that it is spam? Give the answer
as an exact fraction.

## Solution

### Name the events and the path that is spam and flagged

Let $S$ be the event that the email is spam and $F$ the event that it is
flagged. By the multiplication rule,

$$P(S \cap F) = P(S)\,P(F \mid S) = \frac{1}{10} \cdot \frac{4}{5} = \frac{2}{25}.$$

### Find the probability that an email is flagged

An email is flagged along two paths: it is spam and flagged, or it is not spam
and flagged.

$$P(F) = P(S \cap F) + P(S^c \cap F) = \frac{2}{25} + \frac{9}{10} \cdot \frac{1}{5} = \frac{4}{50} + \frac{9}{50} = \frac{13}{50}.$$

### Divide

$$P(S \mid F) = \frac{P(S \cap F)}{P(F)} = \frac{2/25}{13/50} = \frac{4}{13}.$$

Most flagged emails are not spam, even though the filter catches most spam.
