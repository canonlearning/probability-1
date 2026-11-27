---
title: The same filter at another inbox
answer: $3/5$
---

The filter in the problem "A flagged email" flags a spam email with
probability $3/4$ and an email that is not spam with probability $1/6$. At
the inbox of that problem, 1 email in 10 was spam, and the answer was that
a flagged email is spam with probability $1/3$.

The same filter is put on a second inbox, where 1 email in 4 is spam.

Draw the tree for one email at the second inbox: first whether it is spam,
then whether it is flagged. Write a probability on every branch and the
product at the end of every path.

An email at the second inbox is flagged. Find the probability that it is
spam, as an exact fraction.

## Solution

### Separate what changed from what did not

Let $S$ be the event that the email is spam and $F$ the event that it is
flagged. The filter is the same, so $P(F \mid S) = 3/4$ and
$P(F \mid S^c) = 1/6$ as before. Only the prior probability changed:
$P(S) = 1/4$ and $P(S^c) = 3/4$.

### Add the paths that end in a flag

By the law of total probability,

$$
P(F) = \frac{1}{4} \cdot \frac{3}{4} + \frac{3}{4} \cdot \frac{1}{6}
= \frac{3}{16} + \frac{2}{16} = \frac{5}{16}.
$$

### Divide

Bayes' rule gives

$$
P(S \mid F) = \frac{P(S)\,P(F \mid S)}{P(F)} = \frac{3/16}{5/16} = \frac{3}{5}.
$$

### Compare the two inboxes

The same filter gives $1/3$ at the first inbox and $3/5$ at the second. The
probability that a flagged email is spam is therefore not a number that
belongs to the filter. It also depends on how much spam arrives.

Counting 240 emails at each inbox shows the difference. At the first inbox,
24 are spam and 18 of them are flagged, and 216 are not spam and 36 of them
are flagged. So 18 of 54 flagged emails are spam. At the second inbox, 60
are spam and 45 of them are flagged, and 180 are not spam and 30 of them are
flagged. So 45 of 75 flagged emails are spam.

The figure shows the 240 emails of the second inbox.

::visual{name="crowd-table" one="email" many="emails" rows="spam, not spam" columns="flagged, not flagged" counts="45, 15; 30, 150"}

The share given "flagged", $45/75 = 3/5$, is the answer. The share given
"spam", $45/60 = 3/4$, is the number that belongs to the filter.
