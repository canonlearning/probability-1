---
title: Three doors
answer: $2/3$ and $1/2$
---

A car is behind one of three doors, and each door is equally likely. There
is a goat behind each of the other two. We choose door 1. The host then
opens door 2 or door 3.

For each host below, imagine 18 games, with the car behind each door in 6 of
them. When a host opens a door with probability $1/2$, count half of the
games. Make a table with a row for each place the car can be.

1. The host knows where the car is and always opens a door with a goat
   behind it. If doors 2 and 3 both have goats, the host opens each with
   probability $1/2$. Count the games in which this host opens door 3. Find
   the probability that the car is behind door 2, given that the host opens
   door 3.
2. A different host does not know where the car is, and opens door 2 or
   door 3 with probability $1/2$ each. Count the games in which this host
   opens door 3 and there is a goat behind it. Find the probability that
   the car is behind door 2, given that the host opens door 3 and there is
   a goat behind it.

## Solution

### Count the games for the host who knows

| Car behind | Games | Host opens door 3 |
|------------|-------|-------------------|
| Door 1     | 6     | 3                 |
| Door 2     | 6     | 6                 |
| Door 3     | 6     | 0                 |
| Total      | 18    | 9                 |

If the car is behind door 1, the host may open either door, and opens door 3
in half of the 6 games. If the car is behind door 2, the host must open
door 3. If the car is behind door 3, the host never opens it.

The host opens door 3 in 9 games, and the car is behind door 2 in 6 of them.
The probability is $6/9 = 2/3$.

::visual{name="door-games" host="knows"}

### Write the same count with Bayes' rule

The three cases are where the car is, each with prior probability $1/3$.
The observation is that the host opens door 3, which has probability $1/2$,
$1$, and $0$ in the three cases. The products are $1/6$, $2/6$, and $0$, and
they add to $3/6$. So the posterior probabilities are $1/3$, $2/3$, and $0$.

### Count the games for the host who does not know

| Car behind | Games | Host opens door 3 and shows a goat |
|------------|-------|------------------------------------|
| Door 1     | 6     | 3                                  |
| Door 2     | 6     | 3                                  |
| Door 3     | 6     | 0                                  |
| Total      | 18    | 6                                  |

This host opens door 3 in half of the games, wherever the car is. If the car
is behind door 3, opening it shows the car and not a goat, so those games do
not count.

The host opens door 3 and shows a goat in 6 games, and the car is behind
door 2 in 3 of them. The probability is $3/6 = 1/2$.

::visual{name="door-games" host="guesses"}

### Compare the two hosts

We saw the same thing both times: door 3 open, with a goat behind it. The
prior probabilities are also the same. The answers differ because the
probability of what we saw, given that the car is behind door 2, differs.
The first host had to open door 3 in that case, so the probability is 1. The
second host opened it by chance, so the probability is $1/2$.

Bayes' rule needs the probability of the observation in every case. What was
observed is not enough to find it. We also have to know how the observation
came about.
