# Sample Spaces and Events

Probability 1 · Lecture slides

> **Notes** For the lesson "Sample Spaces and Events", which is the
> reading. These slides do not repeat it: in place of the two exams in a
> week they use letters picked from a page, d'Alembert's two tosses of a
> coin, and Galileo's three dice, with their own drawings. Two parts of
> about 40 minutes each, with a slide between them that says part 1 is
> done. The right arrow builds a slide up one piece at a time.

---

## The plan

- Part 1: a letter picked from a page, and how likely it is a vowel
- The names for what we write down: outcome, sample space, event
- Part 2: when counting gives a probability, with coins and dice

---

## A letter from a page

- Open a book and put a finger on the page without looking
- Write down the letter under the finger
- A capital and a small letter count as the same letter
- On a space or a comma, pick again

> **Notes** Do it once with a real book and say the letter aloud. Picking
> the letter is the experiment, one pick is a run, and the letter is the
> outcome.

---

## The letter is a vowel. How likely is that?

1. 19%: 5 of 26
2. About 25%
3. About 38%
4. About 50%

> **Notes** Vote and tally. The vowels are a, e, i, o, u, and y is not
> counted here. A is the answer the count gives. Do not settle it: the
> answer comes at the end of part 1, after the room has written down what
> can happen.

---

## The 26 outcomes

::visual{name="letter-tiles" show="outcomes"}

> **Notes** Two steps. The 26 letters. Then the two things that were
> settled when the pick was described, which are what make the list work:
> with them, no pick is left without a letter and no pick has two.

---

## The sample space

> **Sample space**
>
> $$
> S = \{a,\ b,\ c,\ \dots,\ z\}
> $$

A set of outcomes, where every pick has exactly one of them.

> **Notes** The two conditions are in "exactly one". Ask what would break
> it: a list of "vowel" and "consonant" still works, with 2 outcomes. A
> list of "vowel" and "a letter of the word chance" does not, because a
> pick of e fits both and a pick of z fits neither.

---

## An event

> **Event**
>
> $$
> V = \{a,\ e,\ i,\ o,\ u\}
> $$

A set of outcomes. It happens when the letter picked is in it.

> **Notes** This $V$ is "the letter is a vowel", the event of the vote. If
> the next pick is e, the event happens. If it is t, it does not. The whole
> sample space is an event too, and so is a single letter.

---

## Two events

- A vowel: a, e, i, o, u
- A letter of the word "chance": c, h, a, n, e

> **On paper**
> List the outcomes of "a vowel or a letter of chance", of "a vowel and a
> letter of chance", and of "not a vowel".

> **Notes** Three minutes. The common wrong answer is 10 outcomes for
> "or": 5 plus 5, with a and e counted twice. Some also read "or" as "one
> or the other but not both" and leave a and e out. For "not a vowel",
> nobody needs to write 21 letters: "every letter but a, e, i, o, u" is a
> full answer.

---

## Or, and, not

::visual{name="letter-tiles" show="sets" a="a vowel: a e i o u" b="a letter of the word chance: c h a n e"}

> **Notes** Five steps. A vowel in blue, 5 outcomes. A letter of "chance"
> in red, 5 outcomes, and a and e are half blue and half red because they
> are in both. Then "or": the outline goes around 8 outcomes, not 10. Then
> "and": the 2 outcomes in both. Then "not a vowel": the 21 outcomes
> outside the blue.

---

## Union, intersection, complement

> **Notation**
>
> $$
> A \cup B \qquad A \cap B \qquad A^c
> $$

"$A$ or $B$" is the union, "$A$ and $B$" is the intersection, and
"not $A$" is the complement.

> **Notes** "Or" in probability always includes "both". The reading has
> the same three with its own example. Ask for the intersection of "a
> vowel" and "the letter z": no outcome is in both, and two events like
> that are called disjoint.

---

## How often each letter appears

::visual{name="letter-shares" shares="8.04, 1.48, 3.34, 3.82, 12.49, 2.40, 1.87, 5.05, 7.57, 0.16, 0.54, 4.07, 2.51, 7.23, 7.64, 2.14, 0.12, 6.28, 6.51, 9.28, 2.73, 1.05, 1.68, 0.23, 1.66, 0.09" events="a vowel: a e i o u"}

> **Notes** Back to the vote. Three steps. First 26 equal bars: this is
> what 5 of 26 takes for granted, that each letter is 1 letter in 26. Then
> the share of each letter in English text: e is about 1 letter in 8, and
> z is under 1 in 1000. Then the five vowels in blue: their shares add to
> 38.5%, so C was right. The shares are from Peter Norvig, "English Letter
> Frequency Counts: Mayzner Revisited", counted from the Google Books
> corpus.

---

## The probability of a vowel

- Vowels are 5 of the 26 outcomes, and 5/26 is about 19%
- Vowels are 38.5% of the letters in English text
- So the probability of a vowel is 38.5%, not 19%
- 5/26 would be right only if every letter appeared equally often

> **Notes** The list of 26 outcomes is correct, and it is still not enough
> to find a probability. The shares had to come from counting letters in
> books. Part 2 is about the cases where the outcomes are equally likely,
> and a count is enough.

---

# Part 1 is done

Part 2: when counting does give a probability.

> **Notes** A class that ends here reads the lesson and works its first
> three practice problems on paper.

---

## Two tosses of a coin

- A fair coin is tossed twice
- We win if heads comes up at least once
- In 1754 d'Alembert wrote about this game in the Encyclopédie

> **Notes** Jean le Rond d'Alembert, article "Croix ou pile", Encyclopédie
> volume 4, 1754. He was one of the best mathematicians in Europe at the
> time. Do not say yet what he concluded.

---

## What is the probability of at least one heads?

1. 1/2
2. 2/3
3. 3/4
4. 1

> **Notes** Vote and tally. C is right. B is d'Alembert's own answer, and a
> room that has not seen this will give it some votes: "no heads, one
> heads, two heads" is three results, and two of them win.

---

> **On paper**
> Write every way the two tosses can come out, with the first toss first.
> Circle the ways with at least one heads.

> **Notes** Two minutes. The common wrong list has three entries: it stops
> after a first heads, or it joins "heads then tails" with "tails then
> heads".

---

## The two tosses as a tree

::visual{name="toss-tree"}

> **Notes** Six steps. The first toss. The second toss: four outcomes, and
> each is as likely as any other because the coin is fair on each toss.
> Then at least one heads, 3 of the 4. Then d'Alembert's game, which stops
> at the first heads: his three outcomes are heads, tails then heads, and
> tails then tails. Then his count, 2 of 3. Then the weights: his "heads"
> is two of the four, so it is 2/4, and the answer is still 3/4. His list
> is a sample space. Its outcomes are not equally likely.

---

## The rule for equally likely outcomes

> **Rule**
>
> $$
> \text{probability of } A = \frac{|A|}{|S|}
> $$

Only when $S$ has finitely many outcomes and all are equally likely.
$|A|$ is the number of outcomes in $A$.

> **Notes** This is the one rule about probability in this lesson, and the
> next lesson shows where it comes from. With the four outcomes it gives
> 3/4. With d'Alembert's three it does not apply. With the 26 letters it
> does not apply either.

---

## Three dice

- Three fair dice are thrown and the numbers are added
- Players had seen 10 come up more often than 9
- A sum of 9 can be made in six ways, such as 1 + 2 + 6
- A sum of 10 can also be made in six ways
- About 1620 they asked Galileo why

> **Notes** Galileo, "Sopra le scoperte dei dadi", written about 1620;
> English translation by E. H. Thorne in F. N. David, "Games, Gods and
> Gambling". He writes that long observation had made players consider 10
> and 11 more advantageous than 9 and 12.

---

## How many equally likely outcomes do three dice have?

1. 16, the sums from 3 to 18
2. 56, the ways such as 1 + 2 + 6
3. 216, which is 6 × 6 × 6
4. It depends on the question

> **Notes** Vote and tally. C is right. All three lists are sample spaces,
> so D is tempting, but only one of them has equally likely outcomes, and
> that does not depend on the question. B is the players' list.

---

> **On paper**
> Call the dice red, green, and blue. Write every throw that makes
> 1 + 2 + 6, as (red, green, blue). Then do the same for 3 + 3 + 4 and for
> 3 + 3 + 3.

> **Notes** Three minutes. The answers are 6 throws, 3 throws, and 1 throw.
> The common wrong answer is 6 for 3 + 3 + 4: trading the two 3s does not
> give a new throw.

---

## The throws for a sum of 9 and a sum of 10

::visual{name="dice-ways" sums="9, 10"}

> **Notes** Six steps. The six ways for each sum. Then three ways spelled
> out as throws: 1 + 2 + 6 is six, 1 + 4 + 4 is three, and 3 + 3 + 3 is
> one. That settles the paper task: 3 + 3 + 4 is three throws, like
> 1 + 4 + 4. Then the throws for each
> way of making 9. Then the same for 10. Then the totals, 25 and 27 of the
> 216. Then the percentages. The difference is under one throw in a
> hundred, and the players had found it by playing.

---

## The probability of each sum

$$
\begin{aligned}
\text{sum of } 9 &: \quad \frac{6 + 6 + 3 + 3 + 6 + 1}{216} = \frac{25}{216} \\[2.5ex]
\text{sum of } 10 &: \quad \frac{6 + 6 + 3 + 6 + 3 + 3}{216} = \frac{27}{216}
\end{aligned}
$$

> **Notes** Two lines. A sum of 9 has the way 3 + 3 + 3, which is a single
> throw. A sum of 10 has no way with three equal numbers. That is the whole
> difference.

---

A count over a count is a probability only when the outcomes are equally likely.

> **Notes** This is the mistake in d'Alembert's answer and in the players'
> six ways. The reading does not cover it. The practice problem with the
> peg board does: its 5 bins are a sample space, and they are not equally
> likely.

---

## Summary

- A sample space: every run has exactly one of its outcomes
- An event: a set of outcomes, built with or, and, not
- One experiment has more than one sample space
- Count over count only for equally likely outcomes

---

## Before the next class

- Read the lesson "Sample Spaces and Events"
- Work its six practice problems on paper
- Bring your list of outcomes from "Three buses"
