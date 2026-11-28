# Sample Spaces and Events

A **sample space** is a list of everything that can happen, and an **event**
is the part of the list that a question asks about. A probability is always
the probability of an event, so a problem starts with writing the list.

Our example is an exam week. A student has two final exams, chemistry and
history, in a week of 5 days, Monday to Friday. A computer picks a day for
the chemistry exam, and no day is favored. It then picks a day for the
history exam the same way, without regard to the first pick, so both exams
can land on the same day. We want the probability that the two exams land
on the same day or on back-to-back days.

## Count the ways

We find this probability by counting. First we write down every way the two
picks can come out. One way is chemistry on Tuesday and history on Thursday,
which we write (Tue, Thu), with the chemistry day first. Then (Thu, Tue) is
a different way, because the exams have traded days. There are 5 days for
the chemistry exam, and for each of them 5 days for the history exam, so
there are $5 \times 5 = 25$ ways. Each of them is called an **outcome**.

In the figure, the 25 outcomes are the tiles of a square, where the
chemistry day runs from left to right and the history day from front to
back. One pick of the two days is one tile.

::visual{name="exam-week"}

Next we count the outcomes that our question asks about. The exams are on
the same day in 5 outcomes, from (Mon, Mon) to (Fri, Fri). They are
on back-to-back days in 8 outcomes: 4 where the chemistry exam is the
earlier one, which are (Mon, Tue), (Tue, Wed), (Wed, Thu), and (Thu, Fri),
and 4 where the history exam is the earlier one. Monday and Friday are the
two ends of the week, so they are not back-to-back. No outcome is in both
groups, so $5 + 8 = \red{13}$ outcomes have the exams on the same day or on
back-to-back days. These are the red tiles at the end of the figure.

The 25 outcomes are equally likely. No day is favored for the chemistry
exam. Whichever day it gets, no day is favored for the history exam,
because the second pick is made without regard to the first. So no outcome
is favored over another. A later lesson makes this argument exact.

When all the outcomes are equally likely, a probability is a count divided
by a count: the outcomes the question asks about, out of all the outcomes.
So the probability that the exams land on the same day or on back-to-back
days is $\red{13}/25$, which is a little more than half. The next lesson
defines probability, and here we use only this one fact.

## The sample space and the event

The count used two sets of outcomes, and each has a name.

The first is the set of all 25 outcomes. It is the sample space, which we
call $S$ and write with braces:

$$
S = \{(\text{Mon}, \text{Mon}),\ (\text{Mon}, \text{Tue}),\ \dots,\ (\text{Fri}, \text{Fri})\}.
$$

Picking the two days is an **experiment**, and each time it is done is one
**run**. In the figure, every run lights exactly one tile. This is what
makes the 25 outcomes a sample space: every run has exactly one of them as
its result.

The second is the set of the $\red{13}$ outcomes that our question asks
about. A set of outcomes is an event, and we call this one $E$. An event
**happens** when the outcome of the run is in it. If the computer picks
(Wed, Wed) or (Mon, Tue), then $E$ happens. If it picks (Tue, Thu), then $E$
does not happen.

We write $|E|$ for the number of outcomes in $E$. With these names, the
count is

$$
\frac{|E|}{|S|} = \frac{\red{13}}{25}.
$$

## Or, and, not

We counted $E$ in two groups, and each group is an event too. Let $D$ be the
event that the exams are on the same day, which has 5 outcomes, and let $N$
be the event that they are on back-to-back days, which has 8. Our question
joins them with "or". There are three ways to build an event from other
events, and each has a symbol:

- $D \cup N$, read "$D$ or $N$", has the outcomes that are in $D$, in $N$,
  or in both. It is the **union** of $D$ and $N$.
- $D \cap N$, read "$D$ and $N$", has the outcomes that are in both. It is
  the **intersection** of $D$ and $N$.
- $D^c$, read "not $D$", has the outcomes that are not in $D$. It is the
  **complement** of $D$.

In the figure, an event is a sheet lying on its outcomes.

::visual{name="event-sheets" tile-label="column, row" rows="Fri, Thu, Wed, Tue, Mon" row-name="history exam" columns="Mon, Tue, Wed, Thu, Fri" column-name="chemistry exam" first="Mon-Mon, Tue-Tue, Wed-Wed, Thu-Thu, Fri-Fri" first-name="same day" first-letter="D" second="Mon-Tue, Tue-Mon, Tue-Wed, Wed-Tue, Wed-Thu, Thu-Wed, Thu-Fri, Fri-Thu" second-name="back-to-back days" second-letter="N"}

Our event is the union, $E = D \cup N$. The intersection $D \cap N$ has no
outcomes, because two exams on the same day are not on back-to-back days.
Two events with no outcome in common are **disjoint**. This is why we could
add $5 + 8$ to get 13: no outcome was counted twice.

The complement $E^c$ has the other $25 - 13 = 12$ outcomes, where at least
one day lies between the two exams.
