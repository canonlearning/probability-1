---
title: A ball on a peg board
answer: $3/8$ and $1/8$
---

A ball is dropped into the top of a board that has 4 rows of pegs. At each
row the ball hits a peg and bounces left (L) or right (R), and neither side
is favored. A path is written as four letters, with the top row first: LRRL
is left, right, right, left.

Under the last row are 5 bins, numbered 0 to 4 from left to right. The ball
ends in the bin whose number is the number of times it bounced right, so the
path LRRL ends in bin 2.

We take all the paths to be equally likely.

Write out every path in an order in which none can be skipped, count the
paths, and beside each write its bin. Then make a table with one row for
each bin, holding the paths that end in it and how many there are.

1. Say why the 5 bins are a sample space of this experiment, and whether
   the 5 bins are equally likely. We call this sample space $T$, and the
   sample space of all the paths $S$.
2. Find the probability that the ball ends in bin 2.
3. Find the probability that the ball ends in bin 0 or in bin 4.

## Solution

### Write the paths

There are 2 letters for each of the 4 rows, so there are
$2 \times 2 \times 2 \times 2 = 16$ paths. We put L before R, and change the
letter of the last row fastest. The bin is the number of R's.

| Path | Bin | Path | Bin | Path | Bin | Path | Bin |
|------|-----|------|-----|------|-----|------|-----|
| LLLL | 0   | LRLL | 1   | RLLL | 1   | RRLL | 2   |
| LLLR | 1   | LRLR | 2   | RLLR | 2   | RRLR | 3   |
| LLRL | 1   | LRRL | 2   | RLRL | 2   | RRRL | 3   |
| LLRR | 2   | LRRR | 3   | RLRR | 3   | RRRR | 4   |

### Group the paths by bin

| Bin   | Paths that end in it               | Number |
|-------|------------------------------------|--------|
| 0     | LLLL                               | 1      |
| 1     | LLLR, LLRL, LRLL, RLLL             | 4      |
| 2     | LLRR, LRLR, LRRL, RLLR, RLRL, RRLL | 6      |
| 3     | LRRR, RLRR, RRLR, RRRL             | 4      |
| 4     | RRRR                               | 1      |
| Total |                                    | 16     |

In the figure, each ball is one path.

::visual{name="peg-board"}

### The bins are a sample space

Every run ends with the ball in one bin, and a ball is not in two bins. So
every run fits exactly one of the 5 outcomes "bin 0" to "bin 4", which makes
them a sample space. This is $T$, with 5 outcomes, and $S$ has 16.

The outcomes of $T$ are not equally likely. "Bin 2" happens when any of 6
equally likely paths does, and "bin 0" happens when 1 path does, so bin 2 is
6 times as likely as bin 0.

### Count paths for bin 2

The fact that the probability of an event $A$ is $|A| / |S|$ needs equally
likely outcomes, so we count in $S$ and not in $T$. In $S$, "the ball ends
in bin 2" is the event $A$ of the 6 paths in the third row of the table:

$$
\frac{|A|}{|S|} = \frac{6}{16} = \frac{3}{8}.
$$

In $T$, "bin 2" is 1 of 5 outcomes, which would give $1/5$. Here the count
over the count is not justified, because the 5 outcomes are not equally
likely. The probability found from the paths is $3/8$, not $1/5$.

### Count paths for bin 0 or bin 4

Let $B$ be the event of $S$ that the ball ends in bin 0 or in bin 4. It is
the union of $\{\text{LLLL}\}$ and $\{\text{RRRR}\}$, which are disjoint, so
$|B| = 1 + 1 = 2$ and

$$
\frac{|B|}{|S|} = \frac{2}{16} = \frac{1}{8}.
$$

The matching event of $T$ has 2 of the 5 outcomes, and $2/5$ is more than 3
times the right number. The two end bins are the least likely outcomes of
$T$.
