# Dozenal (base 12)

Decimal (base 10) is an accident of anatomy — we have ten fingers. Base 12 is the better choice on its own merits, and it's the base the [fundamental distance unit](fundamental-distance-unit.md) is built on.

This page is the distilled argument; the exhaustive version — conversion code, the complete notation, and far more examples — lives in the project repo, [github.com/rubenayla/basekit](https://github.com/rubenayla/basekit).

## We already count in twelves

Here is the giveaway that twelve is special: in a world that *counts* in tens, the moment something needs to be **divided**, people quietly switch to twelve.

- **Time** — the day is two twelves (`18:00` is 6 in the afternoon, the dozen counted twice); the clock face has 12 hours; an hour holds 60 minutes and a minute 60 seconds (60 = 5 × 12); the year has 12 months. The Earth even turns a clean π/12 radians per hour.
- **Angles** — a full turn is 360° (= 30 × 12), chosen so half, third, quarter, sixth, and twelfth of a circle are all whole (180°, 120°, 90°, 60°, 30°).
- **Music** — the octave divides into 12 semitones, which is what lets chords land on clean thirds, fourths, and fifths. (Concert pitch is often 432 Hz = 3 × 144, a round `300;`.)
- **Trade** — eggs and pastries sell by the **dozen** (12) and the **gross** (144 = 12²); a foot is 12 inches; pre-decimal Britain ran 12 pence to the shilling for centuries.
- **Sharing** — 12 slices of pizza split evenly among 2, 3, 4, or 6 people; 10 slices only among 2 or 5.
- **Your own hand** — the four fingers have three segments each; tap them with the thumb and you count to twelve on one hand (several cultures did exactly this). The "ten fingers" that gave us base ten overlooked that the same hand already holds a tidy dozen.
- **Language** — "twelve" is the largest number in English with its own single word; "thirteen" onward are compounds (three-and-ten). We named the dozen, then gave up.

None of these is coincidence or fashion. Every one is a case where a quantity gets *cut up* — into halves, thirds, quarters — and ten can't do that without remainders, so the system reached for twelve instead. **We already use base twelve wherever dividing matters; we just never made it the base we count in.** Ten won counting; twelve quietly won everything that gets divided.

??? note "And once you start looking, it's everywhere"
    - **Frame rates** are dozenal: 24 fps film (`20;`), 60 fps video (`50;`), 120 fps phones (`A0;`), 144 fps gaming (`100;`, a gross). Each is a whole number of twelves, so a frame lasts a clean `0;06` of a second.
    - **Hexagons** — six, half a dozen — are nature's and engineering's favourite shape: honeycomb (the least-perimeter way to tile equal areas), the densest circle packing (six around one), hex bolt heads. And the *only* regular polygons that tile the plane have 3, 4, or 6 sides — every one a divisor of twelve, none a divisor of ten.
    - **Safe DC voltages** cluster on twelves: 12 V (cars), 24 V (`20;`, trucks/aircraft), 48 V (`40;`, the legal max-safe-DC — telecom, solar, e-bikes), 96 V (`80;`). Appliances, 3D printers, and their motors run on the same set.
    - **Scientific notation** wants twelve too: metric prefixes step every 3 zeros, so the exponents run 0, 3, 6, 9, 12, 15, 18… — an ugly scramble in decimal, but a clean `0 3 6 9` cycle in dozenal (`0 3 6 9 10; 13; 16; 19; 20;…`), because 3 divides 12.

## Why — twelve divides cleanly

A number base earns its keep by writing the amounts people actually use, and the thing people do most with amounts is **split them and scale them by small numbers** — halve a loaf, take a third of an hour, double a recipe, triple it. Start with dividing.

Whether a fraction comes out as a clean short number or an ugly endless one depends entirely on the base: **a fraction terminates only when the base divides evenly by its bottom number.** So the more numbers a base divides by — its **divisors** — the more everyday fractions it can write without the digits running off forever.

Twelve divides evenly by **2, 3, 4, and 6**; ten only by **2 and 5**. So the common cuts each land on a single clean digit in dozenal — including the one people use most after the half, the **third**, which in decimal never terminates:

- half = 0;6 · third = 0;4 · quarter = 0;3 · sixth = 0;2 — all exact, where ten gives 1/3 = 0.333… forever.

And this isn't a rare win: one integer in three is a multiple of 3, but only one in five is a multiple of 5 — so the cuts twelve nails come up far more often than the one (fifths) it gives up.

![Divisor density for n = 5..60](divisors_density.png)

*The orange peaks — 6, 12, 24, 36, 48, 60 — pack in more divisors than any smaller number (the "highly composite" numbers); the grey valleys are primes, which divide by nothing but 1 and themselves.*

??? note "The full fraction table (1/2 … 1/9)"
    | fraction | decimal | dozenal | better |
    |---|---|---|---|
    | 1/2 | 0.5 | 0;6 | tie |
    | 1/3 | 0.333… | 0;4 | **dozenal** |
    | 1/4 | 0.25 | 0;3 | **dozenal** |
    | 1/5 | 0.2 | 0;2497… | decimal |
    | 1/6 | 0.1666… | 0;2 | **dozenal** |
    | 1/7 | 0.142857… | 0;186A35… | tie (both ugly) |
    | 1/8 | 0.125 | 0;16 | **dozenal** |
    | 1/9 | 0.111… | 0;14 | **dozenal** |

    Twelve wins 1/3, 1/4, 1/6, 1/8, 1/9; ties on 1/2 and 1/7; loses only 1/5 — the fraction you need least. (Verified by exact rational arithmetic. basekit's table lists 1/9 as 0;13; the correct value is 0;14, since 1/12 + 4/144 = 16/144 = 1/9.)

??? note "The formal version — counting divisors"
    Let $d(n)$ be the number of whole numbers that divide $n$ evenly, and plot the density $d(n)/n$:

    $$d(n) = \sum_{k \mid n} 1 \qquad\Longrightarrow\qquad \frac{d(n)}{n}\ \text{(the bars above)}.$$

    Each orange bar is a new *record* in divisor count — the **highly composite numbers** (6, 12, 24, 36, 48, 60), which pack more divisors than anything smaller. Primes sit on the low $\tfrac{2}{n}$ floor. Concretely, $d(12) = 6$ (1, 2, 3, 4, 6, 12) against ten's $d(10) = 4$ (1, 2, 5, 10) — and ten wastes two of its four divisors on 5 and itself, where every one of twelve's is a useful everyday cut.

So why not an even *more* divisible base? **Six** has the highest divisibility for its size, but it is too small — everyday quantities keep spilling into two digits (12 becomes "20", 36 becomes "100"), so numbers get longer to read and write. **Twenty-four** has even more divisors but an unwieldy digit set and times tables. **Twelve** lands in the sweet spot: enough divisors, a comfortable digit count.

## The same property helps multiplication

The divisor advantage isn't only about cutting things up — it makes *building them up*, counting and multiplying, cleaner too.

**More round numbers.** A "round" number ends in 0 — a whole number of bases. In ten, round means a multiple of 10 = 2 × 5. In twelve, round means a multiple of 12 = 2 × 2 × 3 — far more small factors, so the quantities you reach counting by 2s, 3s, 4s, or 6s hit round numbers far more often. Three fours make `10;`, a clean round dozen; so do two sixes and four threes. In base ten, 3 × 4 = 12 isn't round at all.

**Shorter times tables.** Because 2, 3, 4, and 6 each divide twelve, their tables fall into short repeating patterns instead of base ten's long scramble:

- by 3s: `3 6 9 10; 13; 16; 19; 20;` — the last digit cycles **3-6-9-0** every four steps.
- by 4s: last digit cycles **4-8-0** every three steps.
- by 6s: last digit cycles **6-0** every two steps.

The smaller tables are the ones we use most, and twelve makes 3, 4, and 6 easy while decimal only makes 5 easy — a bad trade. You learn the dozenal ones by seeing the pattern, not by memorising ten unrelated endings.

**Divisibility at a glance.** You can read divisibility straight off the last digit far more often than in decimal. Ten's last digit only tells you about 2 and 5; twelve's tells you about 2, 3, 4, and 6 — a number ends in 0/3/6/9 exactly when it divides by 3, in 0/4/8 when by 4, in 0/6 when by 6.

??? note "Last-digit cycles, base 10 vs base 12"
    **Counting by threes**

    - base 10: 3 6 9 12 15 18 21 24 27 30 → last digits **3 6 9 2 5 8 1 4 7 0** (no repeat until the tenth)
    - base 12: 3 6 9 10; 13; 16; 19; 20; 23; 26; 29; 30; → last digits **3 6 9 0** repeating (every fourth)

    **Counting by fours**

    - base 10: 4 8 12 16 20 → last digits **4 8 2 6 0** (every fifth)
    - base 12: 4 8 10; 14; 18; 20; → last digits **4 8 0** repeating (every third)

    The cycle is short exactly when the multiplier divides the base — and the shorter the cycle, the less there is to memorise.

## In practice

The same property turns into concrete, everyday wins:

- **Bolt sizes.** Decimal nudges us into fussy in-between sizes like M5; in twelves you'd keep M4 and M6 — a third and a sixth — and drop the awkward middle. Fewer standards, cleaner ratios.
- **Round design dimensions.** Decimal design leans on multiples of 2.5 mm (5, 10, 12.5…) because that's a quarter of ten. Dozenal gives 2 mm (a sixth), 3 mm (a quarter), 4 mm (a third) — no fractional part, and more clean options to pick from.
- **A third in code.** You can't store 1/3 mm in a decimal field without `0.3333…` and rounding error; in dozenal it's exactly `0;4`. (Computers convert to binary regardless, where tenths are no more exact than twelfths — only halves are exact.)
- **Readable rulers.** A centimetre split into two groups of 5 mm is four near-identical lines that are hard to tell apart; a dozenal unit splits into clear quarters and thirds.
- **Angles as fractions of a turn.** Drop degrees and radians and write the angle as a fraction of one full turn: 90° = `0;3`, 60° = `0;2`, 30° = `0;1` — clean in dozenal, awkward in decimal (0.25, 0.1666…).

## The other extreme: base 11

To feel why twelve works, look at its neighbour eleven — a prime, divisible by nothing but 1 and itself. Take a plank one unit long (written `10` in any base, since `10` always means "one whole base") and cut it in half. Where do you mark the pencil?

- **Base 12** — half of `10` is `6`, an exact single digit. Measure six twelfths, mark, cut. Done.
- **Base 11** — half of `10` is `0;5555…`, repeating forever. Eleven is odd, so half of it isn't a whole digit and the fraction never closes. Your own number system can't name where the midpoint goes.

Every everyday fraction breaks the same way in a prime base. Eleven and twelve sit one apart on the number line and could not be further apart in use: the prime is the worst base you could pick for real measuring, the dozen near the best. Ten is the mediocre middle — clean halves, quarters, and fifths, but it chokes on thirds and sixths, the cuts people make most.

??? note "Exact expansions — base 11 vs 12 vs 10"
    In base eleven the everyday cuts all repeat forever:

    $$\tfrac{1}{2}=0.5555\ldots_{11},\quad \tfrac{1}{3}=0.3737\ldots_{11},\quad \tfrac{1}{4}=0.2828\ldots_{11},\quad \tfrac{1}{6}=0.1919\ldots_{11}$$

    In base twelve the same cuts are exact single digits:

    $$\tfrac{1}{2}=0.6_{12},\quad \tfrac{1}{3}=0.4_{12},\quad \tfrac{1}{4}=0.3_{12},\quad \tfrac{1}{6}=0.2_{12}$$

    Base ten terminates halves, quarters, and fifths but not thirds or sixths ($\tfrac{1}{3}=0.333\ldots_{10}$, $\tfrac{1}{6}=0.1666\ldots_{10}$), and even where it terminates it often runs a digit longer (a quarter is $0.25_{10}$ but only $0.3_{12}$).

## Notation

- **Radix point:** a semicolon `;` marks the dozenal point and the fractional part (a long comma in handwriting); say "sub" for the fractional part ( `A;6` → "dek sub six").
- **Digits past 9:** A and B, spoken **dek** and **il** — so the digits run 0 1 2 3 4 5 6 7 8 9 A B, then `10;` = twelve.
- **Magnitude names:** twelve `10;` is a **do** (from *dozen*), `100;` (= 144) a **gro** (*gross*), `1000;` (= 1728) a **mo**. Larger powers chain: do-mo, gro-mo, bi-mo (10⁶)…
- **Magnitude prefix:** `d3` is the kilo-equivalent (×12³): 1 dometer = 1000; m = 1 d3 m = 1;d3 m.
- **Any base, made explicit (for code):** `"last digit of the base"_"number"."fraction"`. E.g. decimal 12.5 = `9_12.5` = `B_10.6` = `F_C.8` (= 0xC.8) = `1_1100.1` (= 0b1100.1).

??? note "Spoken numbers — a sample"
    | decimal | dozenal | spoken |
    |---|---|---|
    | 10 | A; | dek |
    | 11 | B; | il |
    | 12 | 10; | do |
    | 14 | 12; | do two |
    | 24 | 20; | two do |
    | 30 | 26; | two do six |
    | 144 | 100; | gro |
    | 1728 | 1000; | mo |

Preferred-number series, the base-12 analogues of the decimal 1-2-5 series:

- **1-2-4-8 series:** `;1 ;2 ;4 ;8 1 2 4 8 10;`
- **1-2-4-6 series:** `;1 ;2 ;4 ;6 1 2 4 6 10; 20; 40; 60;` … (secondary values to insert: `1;6`, `3`, `8`)
- **Precise series:** `1 → 1;6 → 2 → 3 → 4 → 6 → 8 → 10;` (then 16; 20; 30; 40; 60; 80; 100;). Rule: take a number and add half of it twice to get the next two, then repeat — multiply by 3/2, 4/3, 3/2, 4/3, … — until you reach a dozen times the original.

## Further reading

- [basekit](https://github.com/rubenayla/basekit) — the full project: conversion code, complete notation, and far more examples than fit here.
- [The Argument for Dozenalism (hexnet.org)](https://hexnet.org/content/argument-dozenalism) · [Dozenal Society of Great Britain](http://www.dozenalsociety.org.uk/) · [Wikipedia: Duodecimal](https://en.wikipedia.org/wiki/Duodecimal)
- Video: [Numberphile on base 12](https://youtu.be/U6xJfP7-HCc) · [Base 10 vs base 12](https://youtu.be/HVk_viJEDII)

## Related

- [Fundamental distance unit](fundamental-distance-unit.md) — built on base 12: the unit scales by integer powers of twelve (12^N), so the dozenal "hops" are the only human-chosen part of an otherwise fully physical definition. (The Planck-length unit was first sketched in basekit's `Unit system` section.)
