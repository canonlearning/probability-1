# Bayes' Rule

Probability 1 · Lecture slides

> **Notes** For the lesson "Bayes' Rule", which is the reading. These
> slides do not repeat it: in place of the three couriers they use the
> Titanic by class and a search for a wreck in three zones, with their own
> drawings. Two parts of about 50 minutes each, with a slide between them
> that says part 1 is done. The right arrow builds a slide up one piece at
> a time.

---

## The plan

- Several cases, and one thing we observe
- Part 1: which case is behind it, on the Titanic
- Part 2: the same with probabilities only, and then a second observation

---

## Last time: the late bus

- Rain on 3 mornings in 10
- The bus was late, and rain went up to about 7 in 10
- That was two cases: rain or dry
- Today: any number of cases, and the names of the two rules

> **Notes** The bus is from the slides for "Conditional Probability". A
> room that did not see them needs only the last two points.

---

## The Titanic, by class

- First class: 15% of the people on board. About 62% of them survived
- Second class: 13% of the people. About 41% survived
- Third class: 32% of the people. About 25% survived
- Crew: 40% of the people. About 24% survived

> **Notes** The same 2201 people as in the last slides: 325, 285, 706, and
> 885 in the four groups, of whom 203, 118, 178, and 212 survived. The
> counts are from the British Board of Trade inquiry of 1912, as given in
> Table 2 of Dawson (1995), Journal of Statistics Education 3(3). Every
> person is in exactly one of the four groups. Do not give the counts yet.

---

## What share of everyone on board survived?

1. About 24%
2. About 32%
3. About 38%
4. About 50%

> **Notes** Vote by hands and write the tally on the board. C is the
> popular wrong answer: it is the plain average of 62, 41, 25, and 24. Do
> not settle it yet.

---

## Each group counts by its size

$$
\begin{aligned}
P(\text{survived})
  &\approx 0.15 \cdot 0.62 + 0.13 \cdot 0.41 \\[1.5ex]
  &\qquad + 0.32 \cdot 0.25 + 0.40 \cdot 0.24 \\[2.5ex]
  &\approx 0.09 + 0.05 + 0.08 + 0.10 \\[2.5ex]
  &= 0.32
\end{aligned}
$$

> **Notes** Four lines. Each term is the share of the ship in a group,
> times the share of that group that survived. The crew and third class
> are 72% of the ship, so the answer is close to their 24% and 25%. The
> vote's answer is B. The exact share is 711 of 2201.

---

## The law of total probability

> **Rule**
>
> $$
> \begin{gathered}
> P(B) = P(A_1)\,P(B \mid A_1) \\[1ex]
> {} + \dots + P(A_n)\,P(B \mid A_n)
> \end{gathered}
> $$

$B$ is what we observe. The cases $A_1, \dots, A_n$ are a partition:
exactly one of them happens.

> **Notes** $B$ is "survived" and the four cases are the groups. One term
> for each case. This is (1) in the reading.

---

## Pick a survivor at random. Which group is most likely?

1. First class
2. Second class
3. Third class
4. Crew

> **Notes** Vote by hands. Most rooms pick A, because first class has the
> highest percentage. Do not settle it yet.

---

## Before we look

> **On paper**
> The four groups had 325, 285, 706, and 885 people, and about 62%, 41%,
> 25%, and 24% of them survived. About how many people survived in each
> group?

> **Notes** Give three minutes. The answers are near 200, 120, 180, and
> 210. The slip to look for is ranking the groups by percentage without
> multiplying by the size.

---

## The 2201 people, group by group

::visual{name="group-bars" many="people" event="survived" groups="first class, second class, third class, crew" short="1st, 2nd, 3rd, crew" sizes="325, 285, 706, 885" counts="203, 118, 178, 212" highlight="4"}

> **Notes** Five steps. (1) The four groups: the crew's bar is almost
> three times as long as first class. (2) The survivors in each. (3) The
> counts: 212 crew against 203 first class. (4) Only the survivors, 711 of
> them. (5) Given survived: crew is 30%, so the vote's answer is D, just
> ahead of first class at 29%. The group with the lowest rate is level
> with the group with the highest. The four percentages are rounded and
> add to 101.

---

## Bayes' rule

> **Rule**
>
> $$
> P(A_i \mid B) = \frac{P(A_i)\,P(B \mid A_i)}{P(B)}
> $$

One term of the sum, over the whole sum.

> **Notes** The bottom, $P(B)$, is the sum from the law of total
> probability. The reading writes it out in full as (2).

---

## The rule gives the same 30%

$$
\begin{aligned}
P(\text{crew} \mid \text{survived})
  &= \frac{P(\text{crew})\,P(\text{survived} \mid \text{crew})}{P(\text{survived})} \\[2.5ex]
  &= \frac{\dfrac{885}{2201} \cdot \dfrac{212}{885}}{711/2201} \\[3.5ex]
  &= \frac{212}{711} \approx 0.30
\end{aligned}
$$

> **Notes** Three lines. The top is the crew's term of the sum, 0.40
> times 0.24, written with the counts. The 885 cancels and then the 2201
> cancels, which is why counting inside the bars was enough.

---

## Your turn: use the rule

> **On paper**
> Second class was 13% of the people on board, and 41% of second class
> survived. Of everyone on board, 32% survived. Find the probability that
> a survivor was in second class.

> **Notes** Give four minutes. No counts this time, only three
> probabilities. The slip to look for is stopping at 0.13 times 0.41,
> which is the probability of second class and survived, without dividing
> by 0.32.

---

## Second class, given survived

$$
\begin{aligned}
P(\text{second} \mid \text{survived})
  &= \frac{P(\text{second})\,P(\text{survived} \mid \text{second})}{P(\text{survived})} \\[2.5ex]
  &\approx \frac{0.13 \cdot 0.41}{0.32} \\[2.5ex]
  &\approx 0.17
\end{aligned}
$$

> **Notes** Three lines. The bars gave the same: 118 of 711 is 17%.

---

## Your turn: a person who died

> **On paper**
> Survived: 203 of 325 in first class, 118 of 285 in second, 178 of 706 in
> third, and 212 of 885 in the crew. Pick a person who died at random.
> Find the probability that this person was in the crew, and the
> probability that this person was in first class.

> **Notes** Give five minutes. The likely wrong answers for the crew are
> 70%, from 1 minus the 30% given survived, and 76%, which is died given
> crew. A bottom of 711 or 2201 in place of the 1490 who died is the
> other slip.

---

## A person who died

$$
\begin{aligned}
P(\text{crew} \mid \text{died}) &= \frac{885 - 212}{2201 - 711} = \frac{673}{1490} \approx 0.45 \\[2.5ex]
P(\text{first class} \mid \text{died}) &= \frac{325 - 203}{2201 - 711} = \frac{122}{1490} \approx 0.08
\end{aligned}
$$

> **Notes** Two lines. Given survived, the crew and first class were
> almost level, at 30% and 29%. Given died, they are 45% and 8%.

---

A large group with a low rate can count for as much as a small group with
a high rate.

> **Notes** The crew had the lowest rate of survival and the most
> survivors.

---

# Part 1 is done

Part 2: no counts, and a second observation.

> **Notes** A class that ends here reads the lesson as far as "The two
> rules" and works its first two practice problems on paper.

---

## A wreck on the sea floor

- It lies in one of three zones: north, middle, or south
- North with probability 2/5, middle with 2/5, south with 1/5
- A search of the right zone finds it 9 times in 10
- A search of a wrong zone finds nothing

> **Notes** The 9 in 10 is the figure used for the sonar in the search for
> Air France flight 447 (Stone and others, 2014, Statistical Science
> 29(1)). The three zones and their probabilities are made up for this
> slide.

---

## The north zone is searched. Nothing. How likely is the north now?

1. 4%
2. About 6%
3. 10%
4. Still 40%

> **Notes** Vote by hands. C is the chance of finding nothing given that
> the wreck is in the north, which is the question turned around. A is 2/5
> times 1/10, a product that has not been divided by anything yet. Do not
> settle it.

---

## Nobody searched the south zone. What happens to its probability?

1. It goes up
2. It stays at 1/5
3. It goes down

> **Notes** Vote by hands. B is common: nothing was learned about the
> south directly. Ask one student from each side to say why.

---

## Draw it in stages

> **On paper**
> North 2/5, middle 2/5, south 1/5. A search of the right zone finds the
> wreck 9 times in 10. Draw a tree: first which zone holds the wreck, then
> whether the search of the north finds it. Write a probability on every
> branch.

> **Notes** Give four minutes. The slip to look for is "found" with 9/10
> on all three zones. The middle and the south have one second branch
> each, with probability 1, because a search of the north cannot find a
> wreck that is somewhere else.

---

## The tree for the search of the north

::visual{name="case-tree" cases="north, middle, south" shares="2/5, 2/5, 1/5" rates="1/10, 1/1, 1/1" event="nothing" not-event="found" highlight="1"}

> **Notes** Five steps. (1) The three zones. (2) The second branches:
> only the north has two. (3) The products on the three paths that end in
> "nothing". (4) Their sum, 16/25, by the law of total probability: the
> search finds nothing about two times in three. (5) Bayes' rule: each
> path over the sum. The north is 1/16, about 6%, so the first vote's
> answer is B. The south went from 1/5 to 5/16, so the second vote's
> answer is A.

---

## The map, before and after

::visual{name="search-map" zones="north, middle, south" priors="2/5, 2/5, 1/5" detection="9/10" searches="north"}

> **Notes** Three steps. (1) The map before the search. (2) The north is
> multiplied by 1/10 and the others by 1. The three no longer add to 1.
> (3) Each is divided by 16/25. The north drains, and what it lost goes to
> the middle and the south in proportion to what they had, so the middle
> is still twice as likely as the south.

---

## Prior and posterior

- Prior: the probability of a case before the observation
- Posterior: the probability of the case given the observation
- On the map, the large number is the posterior and "was" is the prior

> **Notes** Ask the room for the prior and the posterior of each zone.

---

## Search again: the middle zone. Nothing.

> **On paper**
> Start from 1/16, 10/16, and 5/16. The middle zone is searched, and a
> search of the right zone misses 1 time in 10. Nothing is found. Find the
> three new probabilities.

> **Notes** Give five minutes. The posterior of the first search is the
> prior of the second. The slip to look for is starting again from 2/5,
> 2/5, and 1/5.

---

## The second search: the middle zone

::visual{name="search-map" zones="north, middle, south" priors="2/5, 2/5, 1/5" detection="9/10" searches="north, middle" done="1"}

> **Notes** Three steps. (1) The map after the first search. (2) The
> middle is multiplied by 1/10. (3) Each is divided by 7/16. The north and
> the middle are level again, at 1/7 each.

---

## Both searches find nothing, in one step

$$
\begin{aligned}
P(\text{both})
  &= \frac{2}{5} \cdot \frac{1}{10} + \frac{2}{5} \cdot \frac{1}{10} + \frac{1}{5} \cdot 1 \\[2.5ex]
  &= \frac{1}{25} + \frac{1}{25} + \frac{5}{25} = \frac{7}{25} \\[2.5ex]
P(\text{north} \mid \text{both})
  &= \frac{1/25}{7/25} = \frac{1}{7}
\end{aligned}
$$

> **Notes** Three lines. "Both" is the event in the headline: both
> searches find nothing. Starting again from the first priors and using
> both searches at once gives the map's answer. This is why a posterior
> can be used as the prior for the next observation.

---

The south zone went from 1 in 5 to 5 in 7, and nobody searched it.

> **Notes** Every search that finds nothing somewhere else is evidence for
> the south.

---

## One more report

- The search ship reports a calm sea
- The sea is calm on 7 days in 10, wherever the wreck is
- Does the map change?

> **Notes** Take a show of hands after the last point. Suppose that a
> calm sea does not change how well the sonar works.

---

## Given a calm sea

$$
\begin{aligned}
P(\text{south} \mid \text{calm})
  &= \frac{\dfrac{5}{7} \cdot \dfrac{7}{10}}{\left(\dfrac{1}{7} + \dfrac{1}{7} + \dfrac{5}{7}\right) \cdot \dfrac{7}{10}} \\[3.5ex]
  &= \frac{5}{7}
\end{aligned}
$$

> **Notes** Two lines. Every term has the same 7/10, on the top and on the
> bottom, so it cancels. The same holds for the north and the middle.

---

An observation that is equally likely in every case changes nothing.

> **Notes** That is independence, in a later lesson.

---

## What to take away

- A partition: exactly one of the cases happens
- Total probability: add one term for each case
- Bayes' rule: one term over the sum
- A posterior is the prior for the next observation

---

## Before the next class

- Read the lesson "Bayes' Rule"
- Work its six practice problems on paper
- Bring your answer to "Three doors" and be ready to defend it
