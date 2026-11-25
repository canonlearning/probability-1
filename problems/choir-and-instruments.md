---
title: Choir and instruments
answer: $1/6$, $2/3$, and $1/2$
---

A school has 120 students. Of these, 40 play an instrument, 30 sing in the
choir, and 20 do both.

Draw a table with two rows (plays an instrument, does not) and two columns
(sings in the choir, does not). Write a count in each of the four cells, and
write the total beside each row and under each column.

One student is chosen at random. Find each probability as an exact fraction.
For each one, write down which cells are counted in the numerator and which
in the denominator.

1. The student plays an instrument and sings in the choir.
2. The student plays an instrument, given that the student sings in the
   choir.
3. The student sings in the choir, given that the student plays an
   instrument.

## Solution

### Fill in the table

The 20 students who do both go in the first cell. The row of students who
play an instrument has 40, so its other cell is $40 - 20 = 20$. The choir
column has 30, so its other cell is $30 - 20 = 10$. The last cell is what is
left of the 120 students, which is 70.

|                    | Choir | Not choir | Total |
|--------------------|-------|-----------|-------|
| Plays an instrument | 20   | 20        | 40    |
| Does not           | 10    | 70        | 80    |
| Total              | 30    | 90        | 120   |

### Count all 120 students for "and"

Let $I$ be the event that the student plays an instrument and $C$ the event
that the student sings in the choir. Nothing is known about the student, so
the denominator is all 120 students:

$$P(I \cap C) = \frac{\red{20}}{120} = \frac{1}{6}.$$

### Count only the choir column

Given that the student sings in the choir, the student is one of the 30 in
the choir column, so

$$P(I \mid C) = \frac{\red{20}}{30} = \frac{2}{3}.$$

This is (1) from the lesson, $\dfrac{20/120}{30/120}$, with the 120
canceled.

### Count only the instrument row

Given that the student plays an instrument, the student is one of the 40 in
the first row, so

$$P(C \mid I) = \frac{\red{20}}{40} = \frac{1}{2}.$$

### Compare

The three fractions have the same numerator, the $\red{20}$ students who do
both. The denominators are 120, 30, and 40, because each question counts
those 20 among a different group.

::visual{name="crowd-table" one="student" many="students" rows="instrument, no instrument" columns="choir, no choir" counts="20, 20; 10, 70"}

"And" counts among everyone. "Given" counts among only the group that is
given, and the two given groups here are different, so $P(I \mid C)$ and
$P(C \mid I)$ are different.
