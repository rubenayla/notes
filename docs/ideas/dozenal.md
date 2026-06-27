# Dozenal (base 12)

Decimal (base 10) is an accident of anatomy — we have ten fingers. Base 12 is the better choice on its own merits, and it's the base the [fundamental distance unit](fundamental-distance-unit.md) is built on.

Main project repo: [github.com/rubenayla/basekit](https://github.com/rubenayla/basekit) — dozenal research, notation, references, and implementation notes.

## Why twelve — the divisors fact

![Divisor density d(n)/n for n = 5..60](divisors_density.png)

Let $d(n)$ be the number of whole numbers that divide $n$ evenly:

$$d(n) = \sum_{k \mid n} 1 \qquad\text{and the bars plot the density}\qquad \frac{d(n)}{n}.$$

The orange bars are each new record in divisor count: 6, 12, 24, 36, 48, 60. These are the *highly composite numbers*, the values that pack more divisors than anything smaller. The grey bars are primes, stuck on the low $\tfrac{2}{n}$ floor (only 1 and themselves divide them).

Twelve is the sweet spot. $d(12) = 6$ (1, 2, 3, 4, 6, 12), far ahead of ten's $d(10) = 4$ (1, 2, 5, 10). Ten wastes two of its four divisors on 5 and itself; twelve divides evenly by 2, 3, 4, and 6, so halves, thirds, quarters, and sixths all stay whole. As a base, ten is genuinely horrible — thirds alone (the most common everyday fraction after halves) never terminate.

Six is also strong for its size — $d(6) = 4$ and it has the *highest* density in the whole chart — but it is too small to use as a base: everyday quantities would constantly spill into two digits (writing 12 as "20", 36 as "100"), so numbers get longer to read and write. Twenty-four is the opposite problem — even more divisors ($d(24) = 8$), but the digit set and times tables get unwieldy. This part is less fundamental than the divisor count, but the trade is real: 6 is too small, 24 too large, and 12 lands in between with enough divisors and a comfortable digit count.

### The other extreme: base 11

To feel why twelve works, look at its neighbour eleven, which is prime — nothing divides it except 1 and itself. Take a plank one unit long (written `10` in any base, since `10` always means "one whole base") and cut it in half. Where do you mark the pencil?

- **Base 12** — half of `10` is `6`, an exact single digit. Measure six twelfths, mark, cut. Done.
- **Base 11** — half of `10` is `0;5555…`, repeating forever. Eleven is odd, so half of it is not a whole digit and the fraction never closes. Your own number system cannot name where the midpoint goes.

Every everyday fraction breaks the same way in a prime base. Verified expansions:

$$\tfrac{1}{2}=0.5555\ldots_{11},\quad \tfrac{1}{3}=0.3737\ldots_{11},\quad \tfrac{1}{4}=0.2828\ldots_{11},\quad \tfrac{1}{6}=0.1919\ldots_{11}$$

against base twelve, where the same cuts are all exact single digits:

$$\tfrac{1}{2}=0.6_{12},\quad \tfrac{1}{3}=0.4_{12},\quad \tfrac{1}{4}=0.3_{12},\quad \tfrac{1}{6}=0.2_{12}$$

Eleven and twelve sit one apart on the number line and could not be further apart in use: the prime is the worst base you could pick for real measuring, the dozen is near the best. Ten lands in the mediocre middle — it halves, quarters, and fifths cleanly ($\tfrac{1}{2}=0.5_{10}$, $\tfrac{1}{4}=0.25_{10}$, $\tfrac{1}{5}=0.2_{10}$) but chokes on thirds and sixths ($\tfrac{1}{3}=0.333\ldots_{10}$, $\tfrac{1}{6}=0.1666\ldots_{10}$) — and thirds are one of the cuts people make most. Even where ten does terminate it often runs a digit longer than twelve: a quarter is $0.25_{10}$ but only $0.3_{12}$. Twelve's one giveaway is fifths, which it loses ($\tfrac{1}{5}=0.2497\ldots_{12}$), but fifths come up far less than the thirds, quarters, and sixths twelve nails.

Plot from pure divisor counting; fraction expansions verified by exact rational arithmetic. (The `;` above is the dozenal fractional point from the Notation section below; the worked fractions use a plain `.` for legibility.)

## Notation

- **Radix point:** a semicolon `;` marks the dozenal point and the fractional part (a long comma in handwriting); say "sub" for the fractional part.
- **Digits past 9:** A and B — so the digits run 0 1 2 3 4 5 6 7 8 9 A B, then `10;` = twelve.
- **Magnitude prefix:** `d3` is the kilo-equivalent (×12³), i.e. `d3 = 10;^3`. Example: 1 dometer = 1000; metres = 1 d3 m = 1;d3 m.
- **Any base, made explicit:** `"last digit of the base"_"number"."fraction"`. E.g. decimal 12.5 = `9_12.5` = `B_10.6` = `F_C.8` (= 0xC.8) = `1_1100.1` (= 0b1100.1).

Preferred-number series, the base-12 analogues of the decimal 1-2-5 series:

- **1-2-4-8 series:** `;1 ;2 ;4 ;8 1 2 4 8 10;`
- **1-2-4-6 series:** `;1 ;2 ;4 ;6 1 2 4 6 10; 20; 40; 60;` … (secondary values to insert: `1;6`, `3`, `8`)
- **Precise series:** `1 → 1;6 → 2 → 3 → 4 → 6 → 8 → 10;` (then 16; 20; 30; 40; 60; 80; 100;). Rule: take a number and add half of it twice to get the next two, then repeat — multiply by 3/2, 4/3, 3/2, 4/3, … — until you reach a dozen times the original.

## Related

- [Fundamental distance unit](fundamental-distance-unit.md) — built on base 12: the unit scales by integer powers of twelve (12^N), so the dozenal "hops" are the only human-chosen part of an otherwise fully physical definition.
