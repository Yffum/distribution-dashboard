### What's the math behind this?

Each attempt is a Bernoulli trial. A Bernoulli trial is just a random experiment with two possible outcomes, success and failure, where the probability of success is always the same.

The graph is the geometric cumulative distribution function:

$$
f(x) = 1 - (1-p)^x
$$

where $p$ is the probability of success for a single Bernoulli trial, and $f(x)$ is the total probability of success for $x$ Bernoulli trials.

#### Where does that formula come from?

Let's say we're doing Bernoulli trials with success probability $p$.  

For this formula, it's easier to think about the probability of failure, which is just $1 - p$.

- For one trial, the probability of failure is $1 - p$
- For two trials, the probability of failing every trial is $(1 - p)(1 - p)$
- For three trials, the probability of failing every trial is $(1 - p)(1 - p)(1 - p)$

In other words, the probability of failing $x$ trials in a row is:

$$
(1 - p)^x
$$

And the probability of **not** failing $x$ trials in a row is just $1$ minus that expression:

$$
1 - (1-p)^x
$$

And “not failing $x$ trials in a row” is the same as “succeeding at least once in $x$ trials”, so that’s our formula!
