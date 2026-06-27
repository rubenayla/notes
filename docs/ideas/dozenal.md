# Dozenal (base 12)

> **Proposed / tentative.** Base 12 isn't in use anywhere yet — this is an argued preference for what a number base *should* be, not a current convention.

Decimal (base 10) is an accident of anatomy: we have ten fingers. Base 12 is the better choice on its own merits, and it's the base the [fundamental distance unit](fundamental-distance-unit.md) is built on.

## Why twelve

12 is the smallest **highly composite** number — it divides evenly by 2, 3, 4, and 6. Base 10 divides only by 2 and 5. So in dozenal the everyday fractions terminate cleanly:

- half = 0;6, third = 0;4, quarter = 0;3, sixth = 0;2 — all exact.
- A third in decimal is 0.333… (never terminates); in dozenal it is exactly 0;4.

Thirds and quarters are the fractions people actually use — time, music, carpentry, cooking — so a base that renders them cleanly is genuinely more practical, not just prettier.

## Notation

- **Radix point:** a semicolon `;` marks the dozenal point (where decimal uses `.`). Say "sub" for the fractional part; by hand, write it as a long comma.
- **Digits past 9:** A and B — so the digits run 0 1 2 3 4 5 6 7 8 9 A B, then `10;` = twelve.
- **Magnitude prefix:** `d3` is the dozenal "kilo" (×12³), i.e. `d3 = 10;^3`. Example: 1 dometer = 1000; metres = 1 d3 m = 1;d3 m.
- **Any base, made explicit:** `"last digit of the base"_"number"."fraction"`. E.g. decimal 12.5 = `9_12.5` = `B_10.6` = `F_C.8` (= 0xC.8) = `1_1100.1` (= 0b1100.1).

## Preferred-number series (dozenal)

The base-12 analogues of the decimal 1-2-5 series:

- **1-2-4-8 series:** `;1 ;2 ;4 ;8 1 2 4 8 10;`
- **1-2-4-6 series:** `;1 ;2 ;4 ;6 1 2 4 6 10; 20; 40; 60;` … (secondary values to insert: 1;6, 3, 8)
- **Precise series:** `1 → 1;6 → 2 → 3 → 4 → 6 → 8 → 10;` (then 16; 20; 30; 40; 60; 80; 100;). Rule: take a number and add half of it twice to get the next two, then repeat — multiply by 3/2, 4/3, 3/2, 4/3, … — adding a half, then a third, then a half, and so on until you reach a dozen times the original.

## Related

- [Fundamental distance unit](fundamental-distance-unit.md) — the unit scales by integer powers of twelve (12^N), so the dozenal "hops" are the only human-chosen part of an otherwise fully physical definition.
