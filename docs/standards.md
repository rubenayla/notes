# Standards

When I'm designing something, I sometimes doubt what size, distance, colour, or component to use. I keep these standards noted down so I don't have to re-decide each time. Defaults that play well with each other, so everything stays compatible across projects.

There's also an anti-standards section at the bottom: things that just don't make sense anymore. Noted so I remember not to use them, or at least try to move away from them where I can.

Some of these I wish were universal (they're just better). Others are personal preference.

## Units
- Reference: [Neufert — *Architects' Data*](https://en.wikipedia.org/wiki/Architects%27_Data)
- 7 fundamental units: m, kg, s, K, A, mol, cd.
- Billion = 10^9. Trillion (=Tera) = 10^12.
- Also ºC, Nit (cd/m2), lm, and lx (lm/m^2, illumination of surface instead of an angle).
- For engineering: mmgs or mks unit system, and Std number format for simple numbers, but Engineering format with 4 significant figures for >1000 and <0.01.

## Pneumatics
Air coupler (sorted by priority):

1. **`EU` - Euro High-Flow Interchange, PCL XF**, 1/4" flow, 10x7mm tip, 11.8mm protuberance, 21mm total depth (often 1/4" BSP thread profile)
2. Industrial, red, Milton M-style, Type D, 1/4" flow, 8mm OD tip, 10.85mm protuberance, 24mm total depth
3. Milton V-style high flow, S-765

## Switches and valves
- Along pipe = ALLOW FLOW, crossing pipe = BLOCK FLOW
- Vertical, UP = ON (high energy, active, not the default), Horizontal, DOWN = OFF (the default, gravity)
- / = Going down or inside, \ = going up or outside. For example in a folder tree or a date.
- Nomenclature for valves and relays that is not contradictory between fluids and electricity (closed valve blocks fluid, closed switch lets current):
    - Let flow: "let" (closed switch, opened valve)
    - Cut flow: "cut" (opened switch, closed valve)

## Dates
> Note: avoid ``:`` in filenames so this works on Windows/macOS/Linux. Prefer readable + easy to write + easy to parse.

- Primary (filename-friendly, portable):
    - ``1999-07-02--23-59-59+0200_other-info``
        - Meaning: Year-Month-Day--Hour-Minute-Second+TimezoneOffset, then ``_``, then other info.
        - Notation: ``other-info`` is a placeholder (the value changes); ``_`` and ``--`` are literal separators.
        - Short forms:
            - Date only: ``1999-07-02`` or ``1999-07-02_other-info``
            - Time only: ``--23-59-59+0200`` or ``--23-59+0200``
            - Month/day only: ``-07-02`` (when the year is implied by context)

- ISO 8601 basic (standard, compact): ``19990702T235959+0200``

- Other (common, but uses folders): ``1999/07/02/other-info``

- Other (standard, human-readable; not Windows filename-safe due to ``:``):
    - RFC 3339 / ISO 8601 extended: ``1999-07-02T23:59:59+02:00``

- Avoid:
    - ``02/07/1999_23:59:59``
- Address format: SPAIN, MADRID, FUENLABRADA 12345 (postal code), STREET ABCDE, 24, block 1, doorway 1, floor 3, door A


## Numbers
Preferred numbers:


- 1-2-5 Series: 0.1 0.2 0.5 **1 2 5** 10 20 50 100...
- **Dozenal 1-2-4-8 Series**: ;1 ;2 ;4 ;8 1 2 4 8 10;
- **Dozenal 1-2-4-6 Series**: ;1 ;2 ;4 ;6 1 2 4 6 10; 20; 40; 60;... (secondary to add are 1;6, 3, and 8)
- **Dozenal precise series:**
    - 1 (+1/2) 1;6 (+1/2) 2 (+2/2) 3 (+2/2) 4 (+4/2) 6 (+4/2) 8 (+8/2) 10;
    - **1 1;6 2 3 4 6 8 10;** 16; 20; 30; 40; 60; 80; 100;
    - Take a number and add half of it two times to get the two next ones, repeat with the last one until you get to 10; times the original one. Or, multiply by 3/2, 4/3, 3/2, 4/3, 2/3, 4/3, 3/2. Adds a half, then a third, then a half... until it adds the last half and gets to a dozen of the original.
- E Series IEC60063: E-12 10^(1/12) each number ~21.2% bigger. With 10% error they overlap. 10 12 15 18 22 27 33 39 47 56 58 82 100
- E-6_12 eq: 1 1.6 2.5 4 6 8 10

- Write decimal numbers using the decimal dot: "." and space or nothing as thousand's separator, " " (not comma to avoid confusion): .5, 0.5, 100 000, 2.54. Or just use unit prefixes or scientific notation.
- With dozenal, use a semicolon (";") to indicate the base and the fractional part, say "sub", write a long comma with handwriting. Use d3 for the equivalent of kilo, d3=10;^3 etc. 1 dometer = 1000; meters = 1; d3m = 1;d3 m.

- To express any arbitrary base: "last digit of the base 1,2,...,9,A,B,...Z"_"number"."fractional part". 12.5 = 9_12.5 = B_10.6 = F_C.8 (0xC.8) = 1_1100.1 (0b1100.1)


## Electric
Domestic AC power: 230+-10V 50-60Hz (240V supply at service entrance, with at least 220V at the loads). Be it with 2 hot wires (split phase transformer, US) or a phase and a neutral (EU)
DC voltages: 1,3.3,**5V**,9,**12V**,15,20,24,36,**48V**(max dc safe voltage wet hands),60V,72V,84V,**96V**,108V,**120V**
Soldering Iron Tips: T12 style (heater built into the tip)

### Color Code
- White: Generic. To use when we don't want it to be identified as anything in particular.
- 0V, GND, reference: Black
- +3.3V: Brown
- +5V: Red
<!-- - Interlock: Pink? yellow? brown? -->
<!-- - +12V: Yellow? -->
<!-- - +48V: Blue or red with blue stripe? -->
- ++V: Bright orange
- Signals: Green
- Cold colors for signal and negative voltages.
- AC color code:
    - black: Neutral
    - RGB: 3Lines
    - RYGCBM: 6Lines
    - brown, green, bare copper, brown/green stripes: Earth ground. (Like grass or soil, or something that doesn't need insulation)
- Chassis ground: Grey (Color similar to steel and dirty stuff), or Earth ground colors if always earthed.
- For lab tools: use the one of resistors, for numbers like 17 just paint the 7, the 10 is obvious, and for 4.5 you can stripe 4 and 5 colors. If you adjust the position of color 5 you could represent anything in between like an analog system to write decimals

### Electric connectors
- **USB-C** with USB-4 protocols for electronics (40Gb/s and 240W, 48V 5A)
- Type N (IEC 60906-1) plug and socket. https://rubenayla.blogspot.com/2020/05/we-should-use-type-n-plugs.html
- Ceeform: Industrial. (With plastic catches and good shrouding, like the shark ones)
- **NACS** (Tesla connector) for EV charging.
    - Same pins for AC and DC, better latching, similar power, smaller.
    - DC: 500V 500A (1000V 900A stated)
- **XT** (XT30 XT60 XT90 XT150): High current (and V), quite weather resistant, strong physical and electrical connection.
    - **XT90S** (antispark) - Electric motor and batteries
        - Generally XT90S-F gives power, XT90S-M receives power
- XT150 for a single wire, or stack 2 and make a gender-less connector.
- MT60 MR60 equivalent of XT60 for 3 wires. (30A)
- ATX (Many pins with ~12A it depends)
- DIN connectors (Many pins with 5A max)
- GX connectors (Many pins with 5A/240V max)
- Faston
- Speakon
<!-- - MC4 for solar panels? -->
<!-- - EC8? (190A cont 400A peak) - Electric motor and batteries -->
- Automotive
    - **AMPSEAL** https://www.youtube.com/watch?v=uXTkm_XV2OY
        - Very easy to put and remove pins from connector
        - Weatherproof
    - **AMP 'Superseal'**
        - Most used on formula and [street car modifications].
        - Bulky but cheap and high current (14A)
        - Weatherproof
    - **Deutsch DT and DTM**
        - Very easy to work with. A little bulky. Weather and vibration proof.
        - Used as the standard by several formula student teams
        - DT for power and DTM for signals
        - DTM13: DTM: signal, 13: Receptacle right angle
            - [DTM13-12PA](https://www.mouser.es/ProductDetail/TE-Connectivity-DEUTSCH/DTM13-12PA?qs=cgQJD%2FpJz0wRVbmAAJ6nZw%3D%3D): For panel mount with seal and pcb
    - Keyway Superseal Connector
        - Not very common, very practical. Doesn't need a tool to remove pins. Expensive. Average size.
    - GX series (Circular)
    - DEUTSCH AS (circular, many pins)
    - Deutsch Circular Connectors (HD30)
    - Deutsch DT S (Circular, Aircraft)
    - Delphi / Aptiv
    <!-- - Delphi Weatherpack, (GM, Metri-Pack)? -->
    - Molex MX150
    - Tessa tape to protect.
- Anderson (SB50): Weatherproof High current (and V) genderless connector
- **4mm banana**: Bench power supplies, test leads, DC distribution with frequent connect/disconnect.
    - Quality plugs (Staubli/Hirschmann/Pomona) carry 20–32A. Use shrouded "safety" type above ~30V.
    - No positive lock — for vibration / mobile / permanent high-current use XT90S instead.
    - Cheap spring-wire banana plugs are the unreliable ones: low contact force, several loose series joints, drifting resistance.
- Signals:
    - **JST-XH** 2.54mm pitch
        - Friction lock, easy to remove, small, cheap, high current (3A)
    - **MOLEX PICO-CLASP** (1mm pitch)
        - ~2€
        - Small locking connector, lets you fit as many pins as you want
        - With outer positive lock (it creates better seal, and it's easier to manipulate and the pins are more protected)
        - https://www.molex.com/en-us/products/connectors/wire-to-board-connectors/pico-clasp-connectors
        - https://www.mouser.es/new/molex/molex-pico-clasp-connectors/
        - 12 pin (inner positive lock)
            - https://www.mouser.es/ProductDetail/Molex/501568-1207?qs=uEWtSLL707WCwxY5o89Qlg%3D%3D
            - https://www.molex.com/en-us/products/part-detail/5015681207
        - Mouser, 8 pin (inner positive lock)
            - https://www.mouser.es/ProductDetail/Molex/203559-0807?qs=sGAEpiMZZMvlX3nhDDO4AE1Z0mSz9XmYnUs1fGTpPiM%3D
            - https://www.molex.com/en-us/products/part-detail/2035590807
    <!-- - JST-SH? (1mm pitch 28gauge) -->
    - MOLEX PicoBlade (1.25mm pitch. cameras. friction lock)
    <!-- - Molex SL (2.54mm pitch)? -->
    - JST-SM 2.5 mm (click in, very secure with tabs), Dupont or CRHO (2.54mm or 0.1" pitch)
    - M12 circular waterproof connectors
        - From Phoenix Contact, TE...
        - Around 30€
        - M12-08-A-P-1-R-F: M12 thread, 8 pin, A code, Male, right angle, pcb mount
        - RHT-634-3391-08
    - Fancy:
        - Molex Clik-mate (Used by maxon)
        - Amp-latch
- E27 for bulbs
- Handy: Bullet connector and heat shrink butt connector as solder, useful to have anti-corrosion lubricants (Boeshield, ACF50, dielectric grease)
- Phoenix Contact M12 Power
    - 630V 16A per pin
    - Push-lock
- **WAGO 2601 series** (PCB-to-wire, push-in CAGE CLAMP® with lever, 3.5mm pitch)
    - Replaces screw terminals on PCBs. Hands-free, vibration-resistant, accepts solid + stranded + ferruled wire.
    - Conductor range: 0.2–1.5 mm² (AWG 26–14). Compatible with team-standard 18 AWG / 0.75 mm² wire with headroom.
    - **Stock 2-pole + 3-pole only.** Per-pin price is essentially flat across pole counts ($1.12–1.21 each, DigiKey 1-off, 2026-05); higher-pole variants give no per-pin discount. With {2-pole, 3-pole} you can compose every integer pole count ≥ 2 (2, 3, 4=2+2, 5=2+3, 6=3+3, …) by abutting blocks — they share the same hole pattern, like Arduino headers.
    - 2-pole: **2601-3102** (power-in V+/GND)
    - 3-pole: **2601-3103** (CAN H/L/GND, I²C+pwr)
    - PCB footprint: 4 holes at 3.5 mm pitch accepts 1×4-pole or 2×2-pole — silkscreen a tick mark between the centre pair to make the split obvious. Body ≈13 mm tall × 17 mm deep — clear the full envelope, not just the pin holes.
    - For 0.75–6 mm² (power, 30 A range): step up to **2624 series** (5 mm or 7.5 mm pitch). The 2624 series has *no* 3.5 mm option — don't assume pitch options carry across WAGO series.
    - Datasheet retrieval: WAGO product pages use signed dynamic URLs (no static PDFs). **Bürklin** mirrors clean PDFs at `https://www.buerklin.com/.../Files_<hash>%252F<PN>-EN.pdf` — grep the product page HTML for the file hash.

<details>
    <summary>Aspects to value:</summary>

- Connector density (small size)
- Current rating
- Voltage rating
- High connection count (cycles)
- Locking
    - Inner Positive Lock (Latch inside, fixed part outside): Usually smaller, no exposed latch, solid rigid exterior casing, with no visible latch, may be harder to remove.
- Weatherproof
</details>

- **DuPont / Arduino-style (2.54mm) gender rule**: boards/devices carry **male** headers; cables are **female-to-female** (a female socket on *both* ends). So every cable is the same kind, and every board exposes pins. If a device comes with female headers, swap them for male — easier than building custom cables. For a rare male-ended connection, just use solid-core wire (~22 AWG).

    ??? note "Why males on boards, females on cables"
        A loose cable can fling around; an exposed male pin on it could touch something and short. A recessed female socket can't. So keep the females on the moving part (the cable) and the males fixed on the board.

        Standardising on one cable type (female-to-female) means every cable is interchangeable. The breadboard plays the same role as a bundle of female-to-female cables — both present female sockets to the boards' male pins.

        Given a connection to fix, you either modify the board or build a custom cable. Re-soldering a header to males is far less effort than crimping a custom cable, so modify the board to keep everything standard.

        From David Malawey: ["You can get rid of half of all these..."](https://youtube.com/shorts/VOrIf3qfez0) — he desolders female headers, replaces them with male, and uses only female-to-female cables (solid-core wire when a male end is genuinely needed).

### IC packages
**Nomenclature**: Package name + Pitch + 'P' + Lead Span X Height – Pin Qty.
Ej: SOIC127P600X175-8N
Length calculated with Pitch and Pin Qty, width is lead span, height given.


- DIP (Dual Inline Package 2.54mm)
- **SOP**/*SOIC*/SO (Small Outline Package/Integrated Circuit 1.27mm SOP wide, SOIC narrow), - **SSOP** (shrink small-outline package .635mm), TSSOP (0.65mm), for passive components: 0603 = .06 x .03 inches = 1.6 x .8mm

## Screws
- Nomenclature: M[diameter]x[pitch]x[length], M8x1;3x24, everything in mm
    - If you want to skip the pitch: M8xx24mm
- Screwdriver tip bit hexagonal connector sizes: 4mm, 1/4 in (6.35mm),
- Dremel tip: 1/8 in (3.175mm)
- A current standard: M0.6, M1, M1.6, M2.5 T8, M4 T20 E5, M6 T30 E8, M8, M10 T50 E12, M16, M24, M40
- TORX (hexalobular, 6lobe) internal Screw head (Flush) with ISO metric screw threads.
- I would also consider Robertson and torx plus, but forget about flat, philips, or pozidriv.
- Torx nuts (that can also be screwed with hex key and viceversa) with the same torx external head as the screw's one.

    ??? note "If the standard were redesigned"
        Introduce metric (dozenal multiples?) screw heads. Don't reduce the section until the very end, and then try to accomplish the Robertson grabbing feature, but only for bits that intend to grab the screw, like ttap, because that grabbing feature can be detrimental in mass production. Maybe add attachments to the bits that make them grab. Tubular torx screw with internal AND external torx profile.


## Sizes
It's more important to respect a standard size than change it to a round number in mm.
[Preferred sizes](https://en.wikipedia.org/wiki/Preferred_metric_sizes)

Reference dimensions: Paper thickness .1mm, mechanical pencil lead .5mm, tip 1mm, pen ink tube inside 2mm, outside 3mm, tip inside tube and notebook squares 4mm, tip outside tube 5mm,

Metric system https://youtu.be/hid7EJkwDNk, with its main structure, SI units, but not so sure about the decimal system. In the future, maybe The Harmonic System, based on fundamental physical constants, with dozenal base.

Sizes: .5mm,1mm,2mm,3mm,**4mm**,6mm,12mm,**60mm** (Ikea),240mm,,**600mm** (appliances) ...
Since decimal base is common, add 5mm, 10mm, 50mm, 100mm, etc.

- Bottle/Can:
    - Standard cocacola can: ~6 x 12 cm. 66.2mm diam, 122mm height
    - plastic bottle: 28-mm PCO 1881
    - wide mouth daily use: Nalgene 63 mm OD, 2-start, 3.5 mm pitch, 1.25 turns, flat rim with axial silicone gasket
    - wide mouth ideal not standard: 60mm OD, 3-start, 3mm pitch, 1.25 turns, flat rim with axial silicone gasket. 3 start means less cross-threading risk, faster open/close, better dent resistance. Just the higher lead causes more torque needed to compress the gasket the same amount, and achieve proper seal
- Grinder (small standard) disc diameter: 115mm (type 1 guard)
- Hose sizes (d_intxd_ext): ...x15mm, (10x17mm), **13x18mm** (1x2"), (...), 25x30mm (2.54cm = 1") (maybe with quick connect)
- Reinforced kink-free rubber hose with cast brass fittings, stored on a reel with a cart, inside a garage.
- Bike seatpost diameter: 25mm 28mm 30mm
- Pen tube diameters: 3mm  ext, 2mm int
- Mechanical pencil tips: 0.3mm, **0.5mm**, 0.7mm
- Mechanical pencil eraser dimensions diameter/length: 4, 16mm
- Perforated sorting panel hole distance: 1 in=25.4mm
- Universal Lighter Tip: 1mm
- T-slot aluminum extrusion: multiples of 20mm
    - 20-2020, 20-2040 - T-Slot 5 Type I - (M3 to M5) bolts 
    - 30-3030, T-Slot 8 Type B - M6 (8mm slot width)
    - 40-4040 - Type I - Slot 8
    - 60-6060
- Plate: 240mm
- Wire gauge sizes (copper, about the same diameter of plastic):
    + 2mm diam ~= 12AWG ~= 4mm^2 ~= 30A
    + 1mm diam ~= 18 AWG ~= .75mm^2 ~= 16A
    + .5mm diam ~= 24 AWG ~= .25mm^2 ~= 6A (JST-XH etc)
- Gavetas: LxWxH mm
    - N51: 100 x 170 x 80 mm 0.8L
    - N52: 236 x 160 x 130 mm 3.2L
    - N53: 336 x 160 x 130 mm 4.8L
    - N54: 336 x 216 x 155 mm 7.7L
    - N55: 336 x 216 x 200 mm 10.1L
- Filament spools
    - Inner diam: 50~52mm, >48mm
    - Outer diam: 200~250mm, <300mm
    - Width: 60mm


## Text
- Use [GitHub Flavored Markdown (GFM)](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) when possible
- Fonts
    - Fast to read: Inter, PTSans, Open Sans, Atkinson Hyperlegible
    - Monospace: JetBrains Mono, Roboto Slab, consolas
        <!-- - menlo? -->
- USA QWERTY keyboard.

    ??? note "Why QWERTY"
        Dvorak is cool, maybe qgmlwb, but the difference isn't big and it's easier to glide-type on QWERTY. Most application shortcuts are designed around the QWERTY layout. I would prefer an expanded version with common Greek letters (AltGr + A = α, AltGr + B = β …), and dropping the number row in favour of a numpad.

Scientific paper format: APA rules.

### Grouping symbols
Each symbol means one specific thing. I'd also like a separate symbol for *highlighting* (currently overloaded into these), but no clean candidate yet.

- `()`: Comment, clarification, contextual information. Not to replace, just info:
    - `(this is a comment) (this was happening...)`
- `[]`: Group stuff as a single item:
    - `The example code in [File > Examples > Adafruit 31855 Library > serialthermocouple] works great`
- `{}`: For placeholders:
    - examples: `{TOKEN_NAME}, {REPLACEME_BY_MY_MEANING}, "Hi {YOUR_NAME}"`
    - Escape them to get the actual { symbol by writing it twice `{{`
- `/**/`: Programming comments:
    - `/*comment*/, // comment`

## Hotkeys (Shortcuts)
| Shortcut                     | Function                                 |
| ---------------------------- | ---------------------------------------- |
| Alt                          | Show shortcuts linked to visible options |
| Ctrl + C                     | Copy                                     |
| Ctrl + V                     | Paste                                    |
| Ctrl + X                     | Cut                                      |
| Ctrl + Z                     | Undo                                     |
| Ctrl + Y or Ctrl + Shift + Z | Redo                                     |
| Ctrl + T                     | New Tab                                  |
| Ctrl + W                     | Close Tab                                |
| Ctrl + PgUp                  | Previous Tab                             |
| Ctrl + PgDown                | Next Tab                                 |
| Enter                        | Add new line                             |
| /                            | Search [options/commands]                |
| S                            | Custom menu (shortcuts)                  |

### Text editor
| Shortcut                                     | Function                                                   |
| -------------------------------------------- | ---------------------------------------------------------- |
| Ctrl + ,                                     | Settings                                                   |
| `?` or Ctrl + `?` or Alt + Enter or Ctrl + / | Hotkey Shortcuts sheet                                     |
| Alt + Click                                  | Add cursor                                                 |
| Ctrl + F                                     | Search. +Shift to search in files.                         |
| Ctrl + R                                     | Find and Replace. +Shift to search in files.               |
| Ctrl + Alt + Enter                           | Run                                                        |
| Alt + {Up,Down}                              | Move lines                                                 |
| Alt + {Left,Right}                           | Go back and forward between modifications or visited files |
| Shift + Alt + {Left,Right}                   | Expand selection (Whole block of code etc, this is magic)  |
| Ctrl + Space                                 | Autocomplete                                               |
| Shift + Enter (in text editor)               | Add new line                                               |
| Ctrl + /                                     | Comment                                                    |
| Ctrl + Shift + /                             | Uncomment                                                  |
| Ctrl + Click                                 | Go to definition                                           |
| Ctrl + D                                     | Add next occurrence                                        |
| ``Ctrl Alt ¡``, ``Ctrl Alt '``               | Toggle copilot suggestions ↔                               |



### Debugger
| Shortcut           | Function                              |
| ------------------ | ------------------------------------- |
| F5                 | Reset                                 |
| Shift + F5         | Stop                                  |
| F6                 | Clean and Compile                     |
| F7                 | Debug                                 |
| F8                 | Continue debugging (until breakpoint) |
| F9                 | Step out                              |
| F10                | Step over                             |
| F11                | Step into                             |
| F12                | Go to Definition                      |
| Shift + F12        | Find All References                   |
| Ctrl + K, Ctrl + B | Toggle breakpoint                     |

## Programming
References:

- [luismts — formatting rules gist](https://gist.github.com/luismts/495d982e8c5b1a0ced4a57cf3d93cf60#formatting-rules)
- [CMU C Coding Standard](https://users.ece.cmu.edu/~eno/coding/CCodingStandard.html)

Rules:

- Use English.
- All files start with a comment stating their path relative to the project root, unless clearly irrelevant.
- C: [OTBS](https://en.wikipedia.org/wiki/Indentation_style#Variant:_1TBS_%28OTBS%29) (One True Brace Style), with cuddled else, mandatory braces, or single line.

    ??? note "Why OTBS — and a note on Ratliff/Banner"
        Alone brackets are always ending, and long lines start the block: easy to read and shorter than K&R. (Opening and closing brackets can be hard to tell apart — they're very similar symbols.) Worth also considering Ratliff style, or Banner style, where the ending bracket lines up with the indentation of the nested block. Easier to read since the headers of any block are the only thing extended at that level. The closing control of the prior block interferes with the visual flow of the next block header.
- Function and variable names: lowercase, with words separated by underscores. No need to make them different since the parenthesis makes a function obviously different from a variable.
- Constants: Macros (#define) in uppercase and underscores. That's like the standard library.
- Include the scope (if global), type, and units (if it has) in the variable name: g_s32_target_position_perc; // Global, signed 32bits, target position, percentage
- Use 4 spaces for indentation (Python), or Tabs. Don't mix them.

    ??? note "Tabs vs spaces"
        Tabs are made for indentation, but having several invisible characters is kind of a mess. That depends on the font and editor though. Tabs are easier for navigation, lighter in file storage, separate looks from code functionality, and faster to write.

- Function name followed by "(" without spaces. Keywords like if, while, for... with a space between the name and the "(", to distinguish.
- Justify why a variable is global with a comment in the declaration, and describe it if necessary
- Variable type shortcuts (for the specified amount of bits):
    - u32, u8, u16... : unsigned integer
    - s32, s8, s16... : signed integer
    - f64, f32... : float number
    - bool : u8 with different name to express meaning
- `.csv`: RFC 4180
- Colormaps
    - Sequential
        - **Magma** (or Inferno) — default.

            ??? note "Why Magma"
                Looks very natural, non-distracting, perceptually uniform, and colorblind-friendly. Inferno looks too yellow, but is better for details at all scales. By "natural and non-distracting" I mean it makes me focus on the bright spots right away — I don't have to think about the colours.

        - **Viridis** — very common and good too. Doesn't use white or black at the extremes, so it won't get confused with the background (e.g. geographical maps with missing data).
    - Diverging
        - RdBu (red-blue): Very natural, white in the middle. Can assign 0 to white and the extremes to the colors.
        - Coolwarm has a strange gray by default and too saturated colors, looks odd compared to the others. However, it could be useful to distinguish missing data.
        <!-- - Spectral? -->
    - Qualitative
        - Tab10: They look good together and have good contrast with white background and with each other.
        - Tableau

Example of the C style above:

```C
// Function name + ( with no space. Keywords like `if`, `while`, `for` keep a space.
void set_gear(f64 engine_rpm) {
    /* Pick the gear for the given engine speed. */

    if (engine_rpm < 1500) {
        target_gear = 1;
    } else if (engine_rpm < 3000) {
        target_gear = 2;
    } else {
        target_gear = 3;
    }
}
```
### Python
- Single quotes for strings
- Poetry + pyproject.toml (PEP 621-compliant)
- Ruff linter, numpydoc docstrings
- Use guard clauses when possible, to avoid deep indentation and make the code easier to read.
- Use type hints
- Each test function should be independent, and parameters should be used when possible, to avoid rewriting the same test

## CAD File Formats
- STEP (or old IGES, .igs)(STandard for Exchange Product data): Has color, material properties, and tolerances  well defined curves. Cannot be 3d printed. ISO 10303. AP203 is general, AP214 has colors, layers, dimensioning, tolerance, design intent, AP242 adds product and manufacturing information.
- OBJ: Geometry definition. Mesh with vertices, normals, and color, UV, when paired to an MTL file (Material Template Library). Free-form curves and surfaces to not lose information.
- STL (Standard Triangle Format): Very simple. Lossy. For 3d printing.
- COLLADA (Collaborative Design Activity): Lossy XML mesh. Advanced: Color, texture, animation, physics. ISO/PAS 17506:2012.
- AMF (or 3MF, open source, free) (Additive or 3d Manufacturing File Format): Lossy XML mesh of curved triangles. Has color, material, tolerances, and extensive metadata.


## CAD Design Preferences
- Reference Frames, Coordinate Systems:
    - Python nomenclature:
        - Extended: Position vector FROM <reference> TO <target>, expressed in <frame> frame
        - `Compact: r_<target>_from_<reference>_in_<frame>`
            > from = centered in, in = fixed to = projected to
        - If `<frame> = <reference>`:
            - `r_<target>_from_<frame>`
                - or `r_<target>_<frame>`, `r_<target>_wrt_<frame>`
        > There are three main things to consider: What is being measured, from which reference is it being measured, and which coordinate system is being used to express the measurements.
    - MAIN BODY SYSTEM $S_b$, for an agent/vehicle/camera/entity: X forwards, Y left, Z up
        > Right handed, ROS (REP-103), standard aerospace
        - Positive horizontal rotation towards the left.
        - Relation to terms, to memorize easily:
            - Wheels (right ones): camber, -caster, toe (in)
            - Planes: roll, -pitch, and yaw.
    - ``IRF``: Inertial Reference Frame
    - ``ICRF``: International Celestial Reference System
        - From solar system baricenter, fixed to distant stars.
    - For Spherical coordinate angles, Dray–Manogue convention: https://bridge.math.oregonstate.edu/papers/spherical.pdf
        - e_r points outwards
        - e_theta points south, theta is the polar angle, from the zenith (z axis at North)
        - e_phi points east, phi is the azimuthal angle, positive causing rotation along axial North axis
    - `ITRF`: International Terrestrial Reference Frame (RTK)
        - Earth centered and fixed (from earth, in earth), Z rotation axis north, X to Greenwich. Used by GNSS
    - ``ORF``: Orbital Reference Frame
- mmgs
- Wheel forwards to zoom in (Me moving, not the object)
- 3rd angle projection (American).

    ??? note "Why 3rd-angle over 1st-angle"
        Same intuition as turning your head. The view at the right of the drawing is what you'd see if you walked around to the right of the part — the right side, seen from the right. Clearly more intuitive than 1st-angle (European), even after years of getting used to the European standard.

- Rotate about scene floor.

    ??? note "Why rotate about floor"
        2 screen dimensions map to 2 rotation dimensions. Humans don't usually roll their faces, so a third rotation axis isn't intuitive or necessary.

- Keep Z axis up.

    ??? note "Why Z-up"
        The screen is vertical. I start building on the flat X-Y floor, then add the third Z dimension. That's compliant with physics standards and the body system $S_b$.
- Front: Num 5, Left: Num4, Right: Num6, Top:Num8, Bottom: Num2, Back: Num0, Normal to: Num1, Isometric: Num3, Perspective: Num7, Num9 free for now.
- Space: Repeat last command


## Interfaces

### State vs Action Buttons
A button can communicate two things: what **is** (state) or what **will happen** (action). The visual depth of the element should distinguish them:

- **State (flat):** The element sits flush with the surface, visually embedded in it. No shadow, no elevation — it reads as a label or indicator, not something to interact with. It shows the current status (e.g., "Microphone is OFF").
- **Action (hovering):** The element appears raised above the surface, with shadow, highlight, or other depth cues. It looks clickable and invites interaction. It shows what will happen when pressed (e.g., "Turn microphone ON").

**Press animation (planned):** When clicking an action button, it should visually sink into the surface — as if momentarily becoming a state indicator — before returning to its raised position. This could also work as a click-and-drag: press down to see the resulting state, release to confirm. This reinforces the metaphor: pressing an action transitions it through the state it represents.


## Marking
- **Cut lines with barb**: when scribing a line to mark where to cut (or any precise edge), add a short barb at one end angled to one side of the line. The opposite side — the side with no barb — is the valid edge to align to. The barb is the same continuous stroke as the line, so the eye reads which side it attaches to instantly, removing the ambiguity caused by the thickness of the mark itself. Rule: **edge with no barb = precise edge**; the barbed side is the scrap side.
    - **Point on a marked line**: to mark a specific point along the line, draw a short perpendicular tick from the line into the scrap side at that location. The precise point is where that tick meets the precise (unbarbed) edge of the line. Perpendicular (not angled) so the tick's own width is symmetric about the point and doesn't add directional uncertainty.

## Other
- pneumatic or hydraulic connectors: G (=BSPP) series, binary fractions: 1/2 in, 1/4 in, 1/8 in...
- Multi Board System
    - Pegboards: 25mm (close to 1 inch, not quite)
- [Gridfinity](https://gridfinity.xyz/specification/)
    - magnet polarity: North-down, so the magnet would match the Earth's magnetic field at the North Pole.
    - Height: = to the grid size, so 42mm = 6*7mm or 6U (6 units of 7mm, including the base)
- Ways to talk about moments of inertia:
    1. First, second, third... depending on the order of the distance that gets integrated. So $\int r \, dm$ is the first moment, $\int r^2 \, dm$ is the second moment.
    2. Then say of mass or of area, depending on the other part of the integral.
    - Examples:
        - $\int r \, dm = Q = M_r$ is the first moment of mass = center of mass
        - $\int r^2 \, dm = I$ is the second moment of mass = moment of inertia
            - The one that links torque and angular acceleration. Multiplied by angular velocity gives angular momentum.
        - $\int y^2 \, dA = I_x$ is the second moment of area about an axis = area moment of inertia. That's why it has y instead of r. It'd be the bending stiffness of a beam with y as the distance to the neutral axis. After integrating, it's b*h^3/12 for a rectangular section, so making it twice the thickness makes it 8 times stiffer.
        - $\int r^2 \, dA = J$ is the second moment of area about a point = polar moment of inertia
            - This is the one for torsion
- Git:
    - Many commits, but just of completed work, not half-done stuff (consider stash, for saving changes without committing)
        - The message <50 chars, in English, starting with a verb in imperative, first letter capitalized, no period at the end.
        - The branches in lowercase with -, usually start by "feature/", "maintenance/", "fix/"
- FLRY cable for automotive, recommended by reprorace
- Manage csv-like info with little reserved characters
    - Use uncommon combo as special entity, like -- (-- is +, would never be used in math. It would in text though), then whenever you actually want to write --, just escape it: double the combo '----' is "'--''--'" -> '--'. If you want to write '---' then that's '----' and '-' so '-----', for '----' it would be '--------' and so on. This just takes twice the characters to write the reserved one, fixing the problem. You can always write twice of whatever you want to write.
- Quaternion convention: Hamilton. Not JPL.

    ??? note "Why Hamilton over JPL"
        JPL uses the terms [q1 q2 q3 q0], while Hamilton uses [q0 q1 q2 q3], [w x y z]. If you have a value that's different from all the others (the scalar part), it makes sense to put it first, with the single non-positive index: 0. Also, when writing a 4-dimensional complex number, you'd always put the real part first, then all the imaginary parts. It's just more natural.
- Video Format
    - DNxHR codec, .mov extension. Digital Nonlinear Extensible High Resolution. Avid family.
    - .tiff
- Vacuum cleaner:
    - taper of 1.5 deg relative to symmetry axis, narrowing toward the insertion tip. Air goes from female to male coupled together. (3 deg cone total. sometimes more but for 3d printing keep on the lower end since layers add friction)
    - Tool/cuff cone size: 32mm (USA) (German is 35mmm, but less common, cool to make it two step to include both. but choose 32mm)
    - https://youtu.be/wWQ2x0hBkBY?si=ChLO-f2m-MJ9iQMd
- In connectors usually the male-female differentiation is done by looking at the metal pins, but I think that's a bad idea since the pins don't have to go into each other, they can touch side by side like usb-c. However the plastic covering always has a part going inside of the other. Otherwise the interface would be exposed to the environment. If the plastic doesn't do that, then the connector probably can plug to itself, being genderless. Otherwise it's probably a bad and odd design.
- in n-dimensional arrays/tensors:
    > A tensor with shape (2,3,4) is rank 3 (3d matrix, array), with extents 2, 3, and 4, and size 24 (2*3*4). If it were (2,2,2), it's “length 2”. Our tensor itself has no dimension (it's an object, not a set); the tensor space has dimension 8 (8 things that can vary), and infinite cardinality since there are infinite possible values for each element.
    - shape = list of extents (=lengths) of each axis (index)
    - rank = number of indices
    - length or extent = size of each dimension (or the common value if all equal)
    - size = total number of elements (product of axis lengths)

## Anti-Standards, do not use
- **G3/8", NPT** — use G1/2".
- **DisplayPort** — use USB-C.

    ??? note "Why not"
        HDMI is the more common alternative, but USB-C now subsumes both. DP adapters to other formats are super expensive.

- **Micro-USB, Mini-USB** — use USB-C.
- **XLR for power** — XLR isn't supposed to carry high voltages.
- **Deans** — use XT60, or better XT90S.

    ??? note "Why not"
        XT90S is easier to connect by hand than Deans.

- **Screw terminals** — use Wago-style connectors.

    ??? note "Why not"
        Wago is easier to use, vibration-resistant, and compatible with both stranded and solid wire.

- **Molex Nano Fit** (UVigo Team does not recommend at all).
- **Jet colormap** — use Magma, Viridis, or Inferno.

    ??? note "Why not"
        Not perceptually uniform and not colorblind-friendly.

- **JST-PH (2mm pitch)** — use JST-XH instead.

    ??? note "Why not"
        Has a reputation for being unreliable. My EUC was hard to tune; I found the problem was bad contact of the PH connector, not the PID. Some people consider it fragile and hard to connect. JST-XH is more common and way more durable. PH is smaller than XH but carries less current (2A) — its only real advantage is being available in more pin counts.

- **12-hour format for time** — use 24-hour.

    ??? note "Why not"
        It doesn't make sense that the hour after 12:00 PM is 1:00 PM. The 0 exists. 11:00 AM → 12:00 PM → 1:00 PM makes no fucking sense. At least the switch from AM to PM should happen when we go from 12 back to 1, so PM would be equivalent to "+12 hr" — but it doesn't even line up with that.

- **camelCase / PascalCase** — use snake_case.

    ??? note "Why not"
        They break when you introduce acronyms. Sometimes acronyms are left uppercase, sometimes they're transformed to normal words with only the first letter capitalised. Inconsistent and error-prone. Example: yahoofinance has `trailingPE` and `enterpriseToEbitda` as names — `PE` and `Ebitda` are both acronyms, treated inconsistently.

- **"open valve" / "closed valve" / "normally open" / "normally closed"** — use "let" / "cut" instead (see [Switches and valves](#switches-and-valves)).

    ??? note "Why not"
        The word "open" flips meaning between fluids and electricity. An open switch blocks current; an open valve lets fluid through. "Let" / "cut" is unambiguous in both domains.
