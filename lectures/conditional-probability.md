# Conditional Probability

Probability 1 · Lecture slides

> **Notes** For the lesson "Conditional Probability", which is the reading.
> These slides do not repeat it: they use other examples (the Titanic, two
> dice, a late bus, two students) and their own drawings. Two parts of about
> 50 minutes each, with a slide between them that says part 1 is done. The
> right arrow builds a slide up one piece at a time: a step of a drawing, a
> point of a list, or a line of a calculation. The dots at the bottom show
> how many presses the slide has left.

---

## The plan

- A new piece of information changes a probability
- Part 1: tables and grids, where we can count
- Part 2: trees, where things happen in stages

---

## The Titanic, April 1912

- 2201 people on board
- 470 female, 1731 male
- 711 survived

> **Notes** The counts are from the British Board of Trade inquiry of 1912,
> as given in Table 2 of Dawson (1995), Journal of Statistics Education 3(3).
> The table gives the people on board and the deaths, and the survivors are
> the difference. Other sources differ by a few people. Say nothing about
> probability yet.

---

## Pick a survivor at random. How likely is it a female?

1. About 25%
2. About 50%
3. About 75%
4. About 90%

> **Notes** Vote by hands and write the tally on the board. Most rooms pick
> C or D, from "women and children first". Do not settle it yet.

---

## The same 2201 people, sorted two ways

::visual{name="table-walk" many="people" rows="female, male" columns="survived, died" counts="344, 126; 367, 1364"}

> **Notes** Six steps. (1) The four counts. (2) The totals: check that 711
> and 470 are the numbers from before. (3) Nothing known: 344 of 2201. (4)
> Given survived, keep the column: 48%, so the vote's answer is B. (5)
> Given female, keep the row: 73%. (6) All three. The top never changes.

---

## What changed between 48% and 73%?

- The top stayed the same: 344 people
- The bottom changed: 711 survivors, then 470 females
- The bottom is the group we were told about
- "Given" means: keep that group, and throw the rest away

> **Notes** Ask the room for each point before showing it. Then ask why
> 48% is so much lower: there were almost four males for each female, so a
> small share of the males is still more people.

---

## The definition

> **Definition**
>
> $$
> P(A \mid B) = \frac{P(A \cap B)}{P(B)}
> $$

Read the bar as "given". $B$ is the group we keep.

> **Notes** $A \cap B$ is the part of the kept group that we ask about.
> This holds only when $P(B) > 0$. This is (1) in the reading.

---

## The definition gives the same 48%

$$
\begin{aligned}
P(\text{female} \mid \text{survived})
  &= \frac{P(\text{female} \cap \text{survived})}{P(\text{survived})} \\[2.5ex]
  &= \frac{344/2201}{711/2201} \\[2.5ex]
  &= \frac{344}{711} \approx 0.48
\end{aligned}
$$

> **Notes** Three lines. The 2201 cancels, which is why counting inside the
> table was enough.

---

## Your turn: the males

> **On paper**
> From the table, find $P(\text{survived} \mid \text{male})$. Write the
> fraction before the decimal.

> **Notes** Give two minutes. Put the table back up if the room asks (two
> slides back). The slip to look for is 367/711, which is male given
> survived.

---

## The males

$$
\begin{aligned}
P(\text{survived} \mid \text{male})
  &= \frac{\text{males who survived}}{\text{all males}} \\[2.5ex]
  &= \frac{367}{1731} \approx 0.21
\end{aligned}
$$

> **Notes** 73% of the females survived and 21% of the males. Knowing the
> sex of a passenger changes the probability a great deal.

---

## Two dice

- A red die and a blue die: 36 outcomes, each equally likely
- We are told one thing: the sum is at least 9
- Question: how likely is it that the two dice match?

> **Notes** No table of data this time. The outcomes are equally likely, so
> a probability is a count over a count.

---

## Before we count

> **On paper**
> Draw the 6 by 6 grid. Shade the outcomes where the sum is at least 9.
> Then find the probability that the dice match.

> **Notes** Give four minutes. Students who do not draw the grid often list
> the sums 9, 10, 11, 12 as four equally likely cases and answer 2/4.

---

## Given that the sum is at least 9

::visual{name="grid-walk" rows="1, 2, 3, 4, 5, 6" row-name="red die" columns="1, 2, 3, 4, 5, 6" column-name="blue die" given="3-6, 4-5, 4-6, 5-4, 5-5, 5-6, 6-3, 6-4, 6-5, 6-6" given-name="the sum is at least 9" event="1-1, 2-2, 3-3, 4-4, 5-5, 6-6" event-name="the two dice match"}

> **Notes** Five steps. At step 4 the four dashed squares are doubles that
> were ruled out: they match, but they did not happen.

---

## Now turn it around

The two dice match. How likely is it that the sum is at least 9?

1. $1/5$, the same as before
2. $1/3$
3. $1/2$
4. $2/3$

> **Notes** Vote first, then two minutes on the same paper grid.

---

## Given that the two dice match

::visual{name="grid-walk" rows="1, 2, 3, 4, 5, 6" row-name="red die" columns="1, 2, 3, 4, 5, 6" column-name="blue die" given="1-1, 2-2, 3-3, 4-4, 5-5, 6-6" given-name="the two dice match" event="3-6, 4-5, 4-6, 5-4, 5-5, 5-6, 6-3, 6-4, 6-5, 6-6" event-name="the sum is at least 9"}

> **Notes** The red squares are 5, 5 and 6, 6 both times. They were 2 of
> 10, and now they are 2 of 6.

---

## Same top, different bottom

$$
\begin{aligned}
P(\text{match} \mid \text{sum} \ge 9) &= \frac{2}{10} = \frac{1}{5} \\[2.5ex]
P(\text{sum} \ge 9 \mid \text{match}) &= \frac{2}{6} = \frac{1}{3}
\end{aligned}
$$

> **Notes** Both tops are the two outcomes in both events. The bottoms are
> the two different groups. The Titanic did the same with 344.

---

$P(A \mid B)$ and $P(B \mid A)$ are different questions.

> **Notes** 48% and 73%, then 1/5 and 1/3.

---

# Part 1 is done

Part 2: what to do when there is nothing to count.

> **Notes** A class that ends here reads the lesson as far as "The tree" and
> works its first two practice problems on paper.

---

## A late bus

- It rains on 3 mornings in 10
- On a rainy morning, the bus is late 1 time in 2
- On a dry morning, the bus is late 1 time in 10

> **Notes** There are no people or outcomes to count here, only three
> probabilities.

---

## Which of these is conditional?

- $P(\text{rain}) = 3/10$ is about all mornings
- $P(\text{late} \mid \text{rain}) = 1/2$ is about rainy mornings only
- $P(\text{late} \mid \text{dry}) = 1/10$ is about dry mornings only
- Nobody has told us $P(\text{late})$

> **Notes** Ask the room to name each one before showing it. The last
> point is what the tree is for.

---

## The bus is late this morning. Is it raining?

1. About 30%
2. About 50%
3. About 70%
4. About 85%

> **Notes** Vote by hands. B is the popular wrong answer: it is the chance
> of a late bus given rain, and the question asks for rain given a late bus.

---

## Draw it in stages

> **On paper**
> Draw a tree: rain or dry first, then late or on time. Write a
> probability on every branch.

> **Notes** Give four minutes and walk the room. Do not ask for the answer
> yet, only the tree.

---

## The tree for the bus

::visual{name="tree-walk" first="rain" not-first="dry" probability="3/10" second="late" not-second="on time" probability-if-first="1/2" probability-if-not="1/10"}

> **Notes** Seven steps. (1) Rain or dry. (2) and (3) The second branches:
> these are the conditional probabilities from two slides back. (4) The
> products; have the room check that they add to 1. (5) The two paths that
> end in a late bus. (6) The one through rain. (7) The answer: 15/22, about
> 68%, so the vote's answer is C.

---

## Why we multiply

> **Rule**
>
> $$
> P(A \cap B) = P(B)\,P(A \mid B)
> $$

This is the definition, with both sides multiplied by $P(B)$.

> **Notes** Rain and late: 3/10 of mornings are rainy, and the bus is late
> on 1/2 of those. This is (2) in the reading.

---

## How often is the bus late?

$$
\begin{aligned}
P(\text{late})
  &= P(\text{rain and late}) + P(\text{dry and late}) \\[2ex]
  &= \frac{3}{10} \cdot \frac{1}{2} + \frac{7}{10} \cdot \frac{1}{10} \\[2ex]
  &= \frac{3}{20} + \frac{7}{100} = \frac{11}{50}
\end{aligned}
$$

> **Notes** Three lines. A late bus comes on a rainy morning or on a dry
> one, and never on both, so the two paths add.

---

## The bus is late. Is it raining?

$$
\begin{aligned}
P(\text{rain} \mid \text{late})
  &= \frac{P(\text{rain and late})}{P(\text{late})} \\[2.5ex]
  &= \frac{3/20}{11/50} \\[2.5ex]
  &= \frac{15}{22} \approx 0.68
\end{aligned}
$$

> **Notes** Three lines. The top is one path of the tree and the bottom is
> the sum of two.

---

Before the bus came, rain was 3 mornings in 10. Given a late bus, it is
about 7 in 10.

> **Notes** The late bus did not cause the rain. It changed what we know.

---

## Two students are called on

- A class has 10 students, and 4 have done the reading
- Two are called on, one after the other
- Question: how likely is it that both have done the reading?

---

## Both have done the reading?

1. $4/25$
2. $2/15$
3. $1/5$
4. $2/5$

> **Notes** A is 4/10 times 4/10. It is the popular wrong answer, and it
> would be right if the same student could be called on twice.

---

## Your turn: the tree for the two students

> **On paper**
> Draw the tree: has the first done the reading, then has the second. Be
> careful with the second branches.

> **Notes** Give five minutes. After the first student has read, 3 of the
> other 9 have. After the first has not, 4 of the other 9 have.

---

## The tree for the two students

::visual{name="tree-walk" first="1st read" not-first="1st did not" probability="2/5" second="2nd read" not-second="2nd did not" probability-if-first="1/3" probability-if-not="4/9"}

> **Notes** Seven steps. Stop at step 4: both have read is the top path,
> 2/15, so the vote's answer is B. Step 5: the second has read with
> probability 2/5, the same as the first. Steps 6 and 7 read the tree
> backward: given that the second has read, the first has with probability
> 1/3.

---

## What the tree showed

- Both have read: $2/5 \times 1/3 = 2/15$
- The second branches differ: $1/3$ on one side, $4/9$ on the other
- The second has read: $2/5$, the same as the first
- Backward: given the second has read, the first has with $1/3$

> **Notes** Ask what would make the two sides of the tree the same (the
> same student can be called on twice). That is independence, in a later
> lesson.

---

## What to take away

- "Given" keeps one group and looks only inside it
- When we can count: a count over a count
- When things happen in stages: multiply along a path, add the paths
- $P(A \mid B)$ and $P(B \mid A)$ are different questions

---

## Before the next class

- Read the lesson "Conditional Probability"
- Work its five practice problems on paper
