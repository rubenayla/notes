# Power delivery from first principles + ideal DC connector

A first-principles rebuild of "how should we send power to a domestic load" (vacuum, fridge, etc.). Starts from 230 V AC as the legacy baseline, then backtracks to DC for the long term (think Mars cities — greenfield, no legacy grid). The conclusion: the connector's *brain* and the *voltage architecture* matter far more than the pin silhouette, which is the last 10 %.

## Decisions at a glance

The whole architecture in five lines — each justified in its own section below.

1. **Active dead-front** — metal is dead until a handshake confirms full mating. One move designs out shock *and* arcing.
2. **DC, not AC** — the two 1890 reasons for AC are obsolete; the world already went DC-native.
3. **Two voltage tiers** — 48 V DC (touch-safe, low power) + ~350–400 V DC (high power). Nothing rests in the middle.
4. **Zero new standards on Earth** (USB-C ≤240 W + NACS for high power); **one negotiated connector** for greenfield/Mars.
5. **Connector shape is last** — circular coaxial, push-pull, dead-front. The easy 10 % once the above are fixed.

## Diagrams

![Coaxial dead-front connector — face & section](connector_section.svg)

![Dead-front mate / unmate sequence](mating_sequence.svg)

![Handshake state machine](handshake_state_machine.svg)

![Two-tier DC architecture](system_architecture.svg)

---

## Part 1 — The architecture

### First principles (the physics everything rests on)

The job, reduced: move energy from a fixed point (wall) to a movable load, with a human repeatedly mating/unmating the joint, without electrocution or fire.

`P = V·I`. You can deliver a given power as high-V/low-I or low-V/high-I, and the two choices stress **separate axes**:

- **Current drives heating** (`I²R`). Conductor thickness and — critically — *contact* quality are sized by current.
- **Voltage drives shock and insulation** — breakdown through air (clearance) and surface tracking (creepage, worse with dirt+humidity → CTI rating) scale with voltage.

Everything downstream falls out of these two axes and the hazards they create.

??? note "The five hazards we design against"
    1. **Shock.** ~10 mA = can't let go; ~50–100 mA through the heart = fibrillation. Wet skin ≈ 1 kΩ, so 230 V wet ≈ 200 mA = lethal; ~50 V is the survivable edge. That line is physics, not convention.
    2. **Contact `I²R` heating.** Dominant connector failure mode. Needs high contact force + good plating + metal mass. AC/DC-agnostic. (The "everything goes loose in Peru → fire" failure is pure `I²R`: bad contact = high R = local heat.)
    3. **Arcing on break.** Inductance sustains current as an arc across the opening gap. **AC self-extinguishes** at each zero-crossing (100×/s at 50 Hz); **DC has no zero-crossing** so a DC arc persists — the historical reason DC is hard to switch/unplug.
    4. **Tracking / breakdown.** Set by voltage.
    5. **Inrush.** Motors pull 5–10× at start; SMPS slam a spike charging the input cap. Contacts must not weld.

??? note "The tension that forces tiers"
    Safety caps touch-voltage at ~50 V, and heating caps current. Their product is a capped power → **you cannot have one voltage that is both touch-safe and high-power** (3 kW kettle at 48 V = 62 A, absurd). Two responses exist, every real system is one:

    - **(a) Accept the hazard and mitigate** — today's 230 V world: polarize, sleeve, shroud, shutter, earth, breaker.
    - **(b) Split into voltage tiers** — a touch-safe low bus + a high-power bus you don't touch live. The honest answer; nobody does it yet because of legacy.

    This tension is what forces both the tiered voltages (Decision 3) and the dead-front brain (Decision 1).

### Decision 1 — Active dead-front (the connector has a brain)

**Verdict:** the connector's exposed metal is never live; it energizes only after a handshake confirms full, correct mating, and de-energizes *before* separating. This is the single highest-leverage decision — worth more than any pin shape.

??? note "Why — shock and arc are the same problem, and dead-front is the complete fix"
    Shock and arcing are the same problem — an energized conductor exposed when a human or air gap can bridge it. The complete fix for both: **never energize until safely mated, de-energize before separating** = **dead-front** (exposed metal is dead until a handshake confirms full, correct mating).

    Shrouds/sleeves/shutters are partial mitigations; dead-front is the complete version. It requires the connector to be "active" (have a brain that decides when to switch power on). Once you have it, two of the five hazards (shock, arcing) are *designed out* rather than mitigated — and, as Decision 2 shows, it also removes the last real obstacle to DC.

### Decision 2 — DC, not AC

**Verdict:** for any greenfield system, deliver DC. The two real reasons AC won in 1890 are both obsolete, and the modern world is already DC-native.

??? note "Why — the 1890 reasons are dead and loads are DC anyway"
    AC won in 1890 for two real reasons, both now obsolete:

    1. **Transformers** made AC voltage trivial to change; DC then couldn't. → Killed by cheap, efficient solid-state DC-DC conversion.
    2. **Self-quenching arcs** (zero-crossing) made AC switchgear easy. → Killed by solid-state switching + dead-front connectors, which you want for safety anyway.

    Meanwhile the world went DC-native: **PV is DC, batteries are DC, and almost every modern load — LED lighting, all electronics, inverter-driven fridge/vacuum motors — rectifies the mains to DC the instant it gets it.** A solar+battery house does AC↔DC round-trips over and over (DC panel → AC inverter → DC supply in each device), each costing a few % and a box of silicon. That redundant waste is the real first-principles case against AC.

??? note "DC's honest downsides (and why they're handled)"
    - **Arc interruption** — solved by active/dead-front (Decision 1).
    - **Electrolytic corrosion** — steady DC + moisture migrates metal ions and eats *exposed* contacts (AC averages it out). But this only touches the unmated mating face, not cable runs; sealing + plating + dead-front handle the residual.
    - "No skin effect / no reactive power" — true but minor at household scale; don't oversell.

    **Cable-routing freedom (strong DC win):** an insulated AC cable is a capacitor; AC charges/discharges it continuously, so a charging current flows with no load and eats the conductor rating on long runs — which is why long underground/undersea links are HVDC and overhead AC uses bare conductors on towers. DC charges the cable capacitance once and then nothing — no charging current, no AC dielectric heating. So **you can fully encapsulate DC cable, any length, route/bury it anywhere.** The lever is capacitance + dielectric loss, not corrosion.

    **Touch safety (DC win):** at mains frequency, 50/60 Hz AC is near the worst case for fibrillation; DC's threshold is ~2–4× higher in mA. Standards encode it: safe "extra-low" ceiling is **50 V AC vs 120 V DC** (dry; both drop when wet). 48 V is the conservative wet-hands pick.

??? note "Mars: the clarifying greenfield"
    Mars deletes the only strong remaining argument for AC — legacy infrastructure. Sources are DC (PV, batteries, or a rectified reactor); no 50/60 Hz grid to inherit; a sealed habitat makes fire catastrophic so you want dead-front + solid-state protection everywhere anyway. → Mars lands on **DC, dead-front everywhere.**

### Decision 3 — Two voltage tiers: 48 V (touch) + ~400 V (power)

**Verdict:** stand in two attractor basins and avoid the middle — **48 V DC** for touchable/low-power, **~350–400 V DC** for high power. The tension above forbids a single voltage that is both.

??? note "Why these two basins — and why the middle is a trap"
    - **48 V DC — touchable / low-power.** Highest wet-hands-safe voltage; universal Schelling point (telecom −48, automotive 48, PoE ~48–57, USB-C PD 48). Below it current balloons; above it needs shock protection. Envelope ≈ 240 W on a USB-C-class conductor.
    - **~350–400 V DC — high-power.** EV packs (400 V class) and datacenters (380 V DC, Open Compute/ETSI) already converged → ecosystem exists (NACS/CCS, converters, protection). 400 V = **10 kW at just 25 A**, cables/contacts stay sane. 800 V halves current again but raises insulation/hazard — reserve for fast-charge/industrial.
    - **Avoid ~60–350 V DC as a resting standard.** Too high to touch, not high enough to justify dead-front's payoff, no ecosystem. (230 V only lives there for legacy AC.) Negotiation may sweep through, don't standardize a tap there.

??? note "Does a vacuum really run at 400 V? Yes — worked example"
    A corded vacuum is ~1–2 kW. Run the two tiers:

    - **On 48 V:** 1 kW = **21 A** (2 kW = 42 A) → 4 mm²+ cable, a chunky high-force connector. That blows past the low tier's whole point (touch-safe, USB-C-class, ≤5 A / 240 W). So it *can't* be a low-tier appliance.
    - **On 400 V:** 1 kW = **2.5 A** → thin cable, small pin. Easy.

    So the vacuum lands on the high tier — not because 400 V is *needed* for the power, but because the low tier is deliberately capped at touch-safe low current. Most home high-power loads (kettle, microwave, hairdryer, washer, iron) land here for the same reason; the 48 V tier is electronics + lighting + small stuff.

    **Is 400 V DC crazy for a home appliance? No — three reasons:**

    1. **It's barely above today's mains.** 230 V AC *peaks at 325 V* every cycle; 400 V DC is only ~23 % higher. Insulation, creepage and clearance for 400 V DC are essentially the **same class** as a 230 V AC appliance (IEC 60664 already designs 230 V mains for 400 V+ working/transient levels). No exotic materials.
    2. **The appliance already runs on it.** A modern vacuum's BLDC/universal-motor drive **rectifies mains to a ~325–400 V DC bus** internally (with power-factor correction, a regulated ~390–400 V bus). Feeding 400 V DC directly just **deletes the rectifier + PFC front-end** — you hand the motor controller the exact bus voltage it already synthesizes.
    3. **You never touch it.** Dead-front (Decision 1) means the 400 V is dead until fully mated and de-energized before separating — *physically un-touchable live*. Today's 230 V AC is the opposite: exposed pins on withdrawal, live sockets. So despite the higher number, the **shock risk is lower**, not higher.

    The honest cost: the vacuum's cable and connector ride the "don't touch it live" tier, so they lean entirely on the dead-front interlock working. That's the trade the whole architecture makes — move safety from *geometry you hope holds* to *a brain that guarantees dead metal*.

### Decision 4 — Standards: reuse on Earth, one negotiated connector for greenfield

**Verdict:** physics forces two voltage *regimes*, but the cost can be **zero new standards** — reuse USB-C + NACS on Earth; on Mars, invent the *one* unified connector precisely because it deletes all the others.

??? note "Why — two regimes need not mean two inventions"
    Physics forces two voltage **regimes** (can't avoid — `P=VI` + safety cap). But the cost can be **zero new standards**:

    - **Earth (legacy):** reuse what's already blessed in [Standards](../standards.md) — **USB-C** (≤240 W) + **NACS** (high power; already AC+DC, dead-front-class, latching). The "two" are two *pre-existing* standards, not two inventions.
    - **Mars / ideal (greenfield):** anti-new-standard logic is weakest with no legacy. The one place inventing a single unified connector is justified — *because it eliminates all the previous ones* (the stated dream). One connector + one protocol + **voltage negotiated like USB-C PD** (5→48 V), ceiling raised to 400 V. The two regimes become two negotiated states of ONE standard.

---

## Part 2 — The connector

With the architecture fixed, the pin geometry is the easy part — and dead-front deletes most of it.

### Shape

**Key unlock: dead-front deletes most of the geometry problem.** Metal never live when exposed → no deep shrouds, no sleeved pin bases, no arc-rated profiles, no geometric polarization. Shape is then free to optimize contact reliability + sealing + ergonomics. And **DC needs only 2 power conductors (+/−)** vs AC's 3 (L/N/E) — which resurrects coaxial.

**Recommendation: circular coaxial, push-pull self-latching, single-O-ring, dead-front.**

- **Concentric conductors:** center pin = +, outer ring = −, thin intermediate ring = handshake/PE. Two power conductors map perfectly onto coaxial (why coaxial fails for AC's 3 wires but wins for DC's 2).
- **Rotationally symmetric → reversible at any angle.** Beats USB-C's two-way; never orient it. Polarity set electrically by handshake, so symmetry is safe.
- **Push-pull latch (Lemo/Fischer-style):** push in → tactile **click = fully seated**, and only then does the handshake complete and power energize (seating-tied-to-power interlock → half-insertion is dead by construction). Pull outer sleeve to release; no twisting a stiff cable.
- **One circular gasket** → wet/dust-proof (Mars regolith, bathrooms, outdoors).
- **Self-shielding** (outer shields inner) → low EMI.
- **Scale by diameter into a family** — same XT30→XT150 pattern: same shape, bigger = more current. One geometry spans charger → appliance.
- **Contacts:** sprung beryllium-copper female (hyperboloid cage on the round center pin) for low, stable resistance under load; silver-plated power surfaces, gold flash on handshake ring. Phosphor-bronze (CuSn6) as the cost-down spring.
- **Limit:** coaxial traps inner-conductor heat → happy to ~25 A / 10 kW (all home appliances). Above that (EV fast-charge, 100s of A) separated side-by-side pins cool better → NACS's domain. Clean division: **coaxial family = home, NACS = EV-scale.**

??? note "Variants — magnetic and genderless"
    - **Magnetic dead-front** (MagSafe scaled): self-aligning + breakaway trip-safety (tripped cable releases instead of dragging the appliance). Great on Earth for low/medium power. **On Mars avoid** — iron-rich regolith is magnetic, would collect conductive dust. Mechanical push-pull only there.
    - **Genderless** (Anderson/XT90 taste): coaxial push-pull is usually gendered, but dead-front + any-angle reversibility already delivers what genderless chased (either end safe, orientation irrelevant). Accept gendered here.

### Water resistance (IP) — bathrooms, outdoors

Dead-front + circular geometry make this connector unusually good in the wet — arguably its strongest niche:

- **Dead-front means water is safe by default.** An unmated socket's contacts are dead, so water on the face carries no voltage → no shock, no electrolysis. A dead-front DC outlet could legally sit in a shower zone where AC mains is forbidden.
- **It also deletes DC's corrosion problem at the face.** Electrolytic corrosion needs sustained voltage across wet metal; with no voltage until mated, wet exposed contacts don't corrode. The one DC downside flagged earlier evaporates exactly where it would matter most.
- **Circular = trivial to seal.** One continuous radial O-ring, no corners — the reason M12 / Lemo / Buccaneer circular connectors own the waterproof market. A rectangular multi-pin plug can't match it.
- **Two seal cases:** *mated* — radial O-ring on the plug shell against the socket bore → IP67/IP68 when connected; *unmated* — a sprung self-closing membrane the plug pushes through, closing on withdrawal (marine-bung style), or a tethered cap; even if it leaks, the dead contacts only need to drain/dry.
- **Wet-detect interlock:** the isolation check (handshake step 5) refuses to energize on leakage → a flooded socket stays dead.
- **Target IPX6 mated (powerful jets) → IPX7 (brief immersion).** Specced housings (PPS/LCP, hydrolysis-resistant) + TPE cable-entry overmold + gold/silver-plated contacts carry it.

### Engineering detail

The specs behind the recommendation — open what you need.

??? note "Sizing — conductors & contacts"
    Using the [Standards](../standards.md) wire table (2 mm⌀ ≈ 4 mm² ≈ 30 A; 1 mm⌀ ≈ 0.75 mm² ≈ 16 A; 0.5 mm⌀ ≈ 0.25 mm² ≈ 6 A) and ρ_Cu ≈ 0.0172 Ω·mm²/m:

    | Tier | V | I | core pin | cable | connector OD |
    |---|---|---|---|---|---|
    | Low | 48 V | 5 A | Ø2 mm | 0.5 mm² (≈20–22 AWG) | ≈ 12 mm |
    | High | 400 V | 25 A | Ø4 mm | 2.5–4 mm² (≈14–12 AWG) | ≈ 26 mm |

    - **High tier is sized by heat, not voltage drop.** 25 A over 5 m of 2.5 mm² drops ~1.7 V = 0.4 %. Negligible.
    - **The whole case for the high tier, in one number:** the same 10 kW at 48 V would be **208 A → ~70 mm² cable** (garden-hose thick). 400 V buys an 8× thinner conductor.
    - **Low tier is drop-limited, not heat-limited:** 5 A / 3 m / 0.5 mm² ≈ 1 V ≈ 2 %. That's why you don't stretch 48 V to high power.
    - **Center pin Ø4 mm** is banana-plug class, rated 20–32 A — carries the 25 A and sets the connector's core dimension. Ø2 mm is plenty for 5 A.
    - **Contact spec is force-over-life, not area.** At 25 A a 1 mΩ contact dissipates 0.6 W locally — fine if the spring holds force, lethal if it relaxes (the Peru fire). → beryllium-copper hyperboloid (Multilam) female on the round pin: many parallel line-contacts, stable mΩ, thousands of cycles. Above ~25 A / 10 kW the inner conductor's trapped heat says hand off to NACS's coolable side-by-side pins.

??? note "Dimensions (tentative)"
    Radial stack from the axis (pollution-degree-2 creepage at 400 V ≈ 3 mm insulation walls; 48 V walls are mechanical minimums, not electrical):

    **400 V / 25 A member — OD 26 mm**

    | band | material | inner → outer radius |
    |---|---|---|
    | DC+ center pin | brass | 0 → 2.0 mm (Ø4.0) |
    | insulation | PPS / LCP | 2.0 → 5.0 mm |
    | DC− ring | brass | 5.0 → 6.5 mm |
    | insulation | | 6.5 → 8.5 mm |
    | CC ring | CuBe | 8.5 → 9.3 mm |
    | insulation | | 9.3 → 10.8 mm |
    | PE shell | brass | 10.8 → 13.0 mm (OD 26) |

    **48 V / 5 A member — OD 12 mm:** same band order scaled ~0.46×, insulation walls floored at ~1 mm → center pin Ø2.0, PE shell outer radius 6.0.

    **Axial / sequencing**

    - Engagement depth: ~18–20 mm (400 V) · ~10 mm (48 V).
    - Tip stagger (sets mate order): PE tip at 0 · DC± recessed 2 mm · CC recessed 4 mm → PE makes ~4 mm of travel before CC.
    - O-ring: 1.5 mm cross-section in a groove at Ø24 mm (400 V) · 1.0 mm at Ø11 mm (48 V).
    - Plug body incl. push-pull sleeve + strain relief: ~50 mm long, body OD ~33 mm (400 V) · ~16 mm (48 V).

    A CAD pass with real IEC 60664 creepage/clearance tables and a thermal sim would move these.

??? note "Handshake protocol (USB-C PD logic, scaled to 400 V)"
    Reuse, don't invent: USB-C CC (configuration channel) logic + a CCS-style isolation check. The brain lives in the **wall outlet**; the cable stays cheap (signature chip + contacts).

    1. **IDLE** — DC± dead; PE shell + a tiny safe sense voltage on CC (Rp pull-up).
    2. **Mate** — PE makes first (bond), DC± seat *dead*, CC makes **last** (its recess = "fully seated" proof).
    3. **DETECT** — device presents a known CC signature (resistor for dumb loads, chip for smart).
    4. **NEGOTIATE** — device states tier (48/400 V) + max current over CC.
    5. **ISOLATION CHECK** (400 V only) — verify no leakage before closing, like CCS before contactor close.
    6. **ENERGIZE** — close the SiC solid-state switch with **soft-start** (ramps voltage → swallows inrush, no weld).
    7. **MONITOR** (loop) — current, ground-fault, arc-fault, over-temp, CC keepalive.
    8. **Unplug** — CC breaks **first** → SiC opens in **microseconds** → DC± separate already dead (no arc) → PE breaks last.

    Invariant: **DC± is live only when fully mated + validated + fault-free.** Shock and arc are designed out, not mitigated. The per-outlet SiC switch also replaces the breaker — faster, resettable, per-socket.

## Materials

Mostly AC/DC-agnostic — a connector cares about heat, contact force, and tracking, not whether the current alternates. The one DC-specific note is at the end.

| Part | Material | Why |
|---|---|---|
| Male pin | free-machining brass **CuZn39Pb (CW614N)** | cheap, machinable, dumb solid part — conductivity is fine because it isn't the spring |
| Female spring contact | beryllium-copper **CuBe2 / C17200** (or phosphor-bronze **CuSn6** to cut cost) | holds contact force hot over thousands of cycles |
| Plating | **nickel** barrier + **silver** on power / **gold** flash on handshake | conductivity, tarnish, stable low-force resistance |
| Insulator | thermoset (melamine/phenolic) or high-temp thermoplastic (**PPS, PBT-GF, LCP**) | fault-heat safety + moldable walls |
| Seals / strain relief | **HNBR or silicone** O-ring, **TPE/TPU** overmold | temperature + hydrolysis resistance |

The load-bearing choices behind that table:

- **The spring must not be brass.** Brass stress-relaxes when it gets hot — it loses clamping force, contact resistance climbs, the joint heats more, and you're on the runaway path that is the "everything goes loose in Peru → fire" `I²R` failure. Beryllium-copper resists stress-relaxation and fatigue best (it's what Stäubli/Multilam hyperboloid contacts use); phosphor-bronze CuSn6 is the honest cost-down that gives up some life. This is the single most safety-critical material call in the whole part.
- **Plating is layered for three different jobs.** A nickel underlayer blocks the base metal from migrating up; **silver** on the power surfaces gives the highest conductivity and self-cleans as the contacts wipe on mating (or tin, if cheap beats best); **gold flash** on the low-current handshake ring, where there's no wiping force to break through tarnish, so you need a metal that never tarnishes and holds a stable resistance.
- **The insulator is specified by number, not by name:** **CTI ≥ 600** (Material Group I — resists surface tracking at voltage in damp, dirty air), **UL94 V-0** (self-extinguishing), and **glow-wire 850–960 °C** (mandatory for an unattended appliance like a fridge). Thermoset (melamine/phenolic) has the best fault-heat behaviour but can't do snap-fit latches; high-temp thermoplastic (PPS, PBT-GF, and LCP for the thin 48 V walls) moulds into latches with good — not thermoset-grade — heat tolerance.
- **The one DC-specific point:** steady DC across a wet, exposed contact drives electrolytic migration that eats the metal (AC averages it out). So the mating face wants corrosion-resistant plating — silver or gold over nickel. But dead-front removes the voltage from the exposed face entirely, so this drops from a primary requirement to a belt-and-braces one.

---

## The inversion (the takeaway)

We spent the conversation optimizing the pin when the load-bearing choices were the connector's **brain** (passive-mitigated vs active dead-front) and the **voltage architecture** (legacy 230 AC vs tiered DC). Pick dead-front and one move solves shock + arcing + reversibility *and* makes AC-vs-DC a flip-a-bit system choice. Geometry is the last 10 %.

- **Earth, today:** Type-N-class passive plug with sprung CuBe contacts, sleeved pins, earth-first sequencing, detent-click — the "mitigate accepted hazard" answer, correct *while stuck on legacy AC*. Build it dead-front-ready.
- **Long term / Mars:** tiered DC (48 V + ~400 V), universal dead-front, one unified coaxial push-pull negotiating connector family that subsumes mains/USB-C/barrel/EV.

## See also

- [Standards](../standards.md) → Electric connectors (Type N, NACS, USB-C, XT family)
- [Type N blog post](https://rubenayla.blogspot.com/2020/05/we-should-use-type-n-plugs.html)
