# Dozenal (base 12)

Decimal (base 10) is an accident of anatomy — we have ten fingers. Base 12 is the better choice on its own merits, and it's the base the [fundamental distance unit](fundamental-distance-unit.md) is built on.

Main project repo: [github.com/rubenayla/basekit](https://github.com/rubenayla/basekit) — dozenal research, notation, references, and implementation notes.

## We already count in twelves

Here is the giveaway that twelve is special: in a world that *counts* in tens, the moment something needs to be **divided**, people quietly switch to twelve.

- **Time** — the day is two twelves (`18:00` is 6 in the afternoon, the dozen counted twice); the clock face has 12 hours; an hour holds 60 minutes and a minute 60 seconds (60 = 5 × 12); the year has 12 months.
- **Angles** — a full turn is 360° (= 30 × 12), chosen so half, third, quarter, sixth, and twelfth of a circle all come out whole (180°, 120°, 90°, 60°, 30°).
- **Music** — the octave divides into 12 semitones, which is what lets chords land on clean thirds, fourths, and fifths.
- **Trade** — eggs and pastries sell by the **dozen** (12) and the **gross** (144 = 12²); a foot is 12 inches; pre-decimal Britain ran 12 pence to the shilling for centuries.
- **Your own hand** — the four fingers have three segments each; tap them with the thumb and you count to twelve on one hand (several cultures did exactly this). The "ten fingers" that gave us base ten overlooked that the same hand already holds a tidy dozen.

None of these is coincidence or fashion. Every one is a case where a quantity gets *cut up* — into halves, thirds, quarters — and ten can't do that without remainders, so the system reached for twelve instead. **We already use base twelve wherever dividing matters; we just never made it the base we count in.** Ten won counting (we have ten fingers); twelve quietly won everything that gets divided.

## Why — twelve divides cleanly

A number base earns its keep by writing the amounts people actually use, and the thing people do most with amounts is **split them and scale them by small numbers** — halve a loaf, take a third of an hour, double a recipe, triple it. Start with dividing.

Whether a fraction comes out as a clean short number or an ugly endless one depends entirely on the base: **a fraction terminates only when the base divides evenly by its bottom number.** So the more numbers a base divides by — its **divisors** — the more everyday fractions it can write without the digits running off forever.

Twelve divides evenly by **2, 3, 4, and 6**, so the common cuts each land on a single clean digit:

- half = 0;6 · third = 0;4 · quarter = 0;3 · sixth = 0;2 — all exact.

Ten divides only by **2 and 5**. Halves and fifths are fine, but **thirds never terminate** — 1/3 = 0.333… forever — and a third is one of the cuts people make most. That endless third is the everyday tax of counting in tens.

![Divisor density for n = 5..60](divisors_density.png)

*The orange peaks — 6, 12, 24, 36, 48, 60 — pack in more divisors than any smaller number (the "highly composite" numbers); the grey valleys are primes, which divide by nothing but 1 and themselves.*

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

You learn those by seeing the pattern, not by memorising ten unrelated endings — base ten's 3× table ends in 3-6-9-2-5-8-1-4-7-0, with no short cycle to lean on.

??? note "Last-digit cycles, base 10 vs base 12"
    **Counting by threes**

    - base 10: 3 6 9 12 15 18 21 24 27 30 → last digits **3 6 9 2 5 8 1 4 7 0** (no repeat until the tenth)
    - base 12: 3 6 9 10; 13; 16; 19; 20; 23; 26; 29; 30; → last digits **3 6 9 0** repeating (every fourth)

    **Counting by fours**

    - base 10: 4 8 12 16 20 → last digits **4 8 2 6 0** (every fifth)
    - base 12: 4 8 10; 14; 18; 20; → last digits **4 8 0** repeating (every third)

    The shorter the cycle, the less there is to memorise — and the cycle is short exactly when the multiplier divides the base.

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

    Base ten terminates halves, quarters, and fifths but not thirds or sixths ($\tfrac{1}{3}=0.333\ldots_{10}$, $\tfrac{1}{6}=0.1666\ldots_{10}$), and even where it terminates it often runs a digit longer (a quarter is $0.25_{10}$ but only $0.3_{12}$). Twelve's one giveaway is fifths, which it loses ($\tfrac{1}{5}=0.2497\ldots_{12}$) — but fifths come up far less than the thirds, quarters, and sixths twelve nails.

    (Fraction expansions verified by exact rational arithmetic; plot from pure divisor counting. The `;` is the dozenal point from the Notation section below; worked fractions use a plain `.` for legibility.)

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
