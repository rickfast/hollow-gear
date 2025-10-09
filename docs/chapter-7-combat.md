## Chapter 7: Combat & Overheat Rules

> _"Battle in the Hollowgear is not a clash of steel — it’s a dialogue between minds and
> machines."_  
> — Rhul Greypike, Tharn Vanguard

---

### ⚔️ Combat Overview

Combat in Hollowgear uses the **round-and-turn** structure of the 5E SRD, but adds new layers of
resource and environmental interaction.  
Every battle is a dance of heat, pressure, and psionic resonance.

---

### 🕰️ Combat Rounds

Each round represents 6 seconds of high-tension chaos.  
Turns proceed in order of **Initiative (Dex + modifiers)**.

During your turn, you may:

1. **Move** up to your Speed
2. **Take one Action** (attack, cast, mod, dash, etc.)
3. **Take one Bonus Action** (if applicable)
4. **Take one Reaction** (between turns, when triggered)

---

### ⚙️ New Action Types

| Action               | Description                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Overclock**        | Push a mod or weapon beyond its limit for temporary power. Costs 1d4 Heat and increases malfunction chance by 10%. |
| **Vent Steam**       | Release excess heat or fog (DC 10 Con save or blinded 1 round if adjacent). Clears 2 Heat.                         |
| **Stabilize Mod**    | Make a DC 13 Tinkering or Arcana check to suppress malfunction effects.                                            |
| **Channel Psionics** | Focus mind to regain 1d4 AFP (once/short rest). Take 1d6 psychic damage.                                           |
| **Calibrate Armor**  | Reroute power flow in powered armor; restore +5 ft movement or +1 AC for 1 round.                                  |

---

### 🔥 Heat & Overheat System

Hollowgear’s battlefield is not just about HP — it’s about **Heat Management**.  
Most mechanical gear and powered armor generate **Heat** when pushed too far.

---

#### Heat Basics

- You track **Heat Points (HPt)** separately from hit points.
- You can normally accumulate up to **10 Heat Points** safely.
- At **11+**, you enter **Overheat** and risk damage or malfunction.

| Source                                      | Heat Gain              |
| ------------------------------------------- | ---------------------- |
| Powered attack (Volt Blade, Aether Carbine) | +1 Heat                |
| Using a Steam Mod                           | +1–2 Heat              |
| Taking Fire or Lightning damage             | +1 Heat                |
| Overclock Action                            | +2–4 Heat              |
| Wearing Powered Armor                       | +1 per round in combat |

**Cooling Down:**

- End of combat: lose 1d4 Heat naturally.
- **Vent Steam action:** lose 2 Heat (risk blindness).
- **Overheat Regulator mod:** ignore 1 Heat per short rest.

---

#### Heat Stress Effects

When Heat Points exceed 10, roll **d6 on Overheat Table**:

| d6  | Overheat Result                                                              |
| --- | ---------------------------------------------------------------------------- |
| 1   | Steam leak – take 1d6 fire dmg, lose 1 AC until repaired.                    |
| 2   | Power flicker – lose next Bonus Action.                                      |
| 3   | Overpressure – weapon jams; requires Action to clear.                        |
| 4   | Psionic distortion – take 1d4 psychic dmg; cannot manifest powers next turn. |
| 5   | Core rupture – 10-ft explosion, 2d6 fire dmg (DEX save 12 half).             |
| 6   | System burnout – one mod permanently disabled until repaired.                |

---

#### Heat Stress Track (Long-Term)

Extended exposure to high Heat can impose **Heat Stress levels**:

| Level | Effect                                                   |
| ----- | -------------------------------------------------------- |
| 1     | Disadvantage on Stealth & Perception due to static hiss. |
| 2     | −1 Dex and −5 ft Speed.                                  |
| 3     | Exhaustion level 1 and random malfunction each combat.   |
| 4     | System collapse — armor shuts down, must be repaired.    |

Heat Stress resets after a **long rest** in a safe, cool environment or use of a **Steam Vent
Harness**.

---

### 💥 Overclocking Rules

Characters can **Overclock** weapons, armor, or mods to gain temporary bonuses at great risk.

| Type                | Effect                        | Cost                      |
| ------------------- | ----------------------------- | ------------------------- |
| **Weapon**          | +1d8 dmg next attack          | +2 Heat                   |
| **Armor**           | +2 AC until next turn         | +2 Heat                   |
| **Mod**             | Double its bonus for 1 round  | +3 Heat                   |
| **Psionic Channel** | Cast one Tier higher for free | +3 Heat & 1d6 psychic dmg |

On a roll of **natural 1** during Overclocked action → immediate **Overheat Table** roll.

---

### ⚡ Steam, Psionics & Machinery

Psionic power and mechanical tech interact in volatile ways. When **both systems overlap**, the
battlefield becomes unpredictable.

| Condition                  | Effect                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Psionic Feedback Field** | Spells, powers, and mods within 30 ft risk shorting out (10% malfunction chance).                            |
| **Aether Interference**    | Ranged attacks through active psionic zones take −2 to hit.                                                  |
| **Steam Fog**              | Grants half cover and imposes disadvantage on ranged attacks beyond 30 ft.                                   |
| **Aether Overload (rare)** | When powered weapon hits a psionic shield → roll d20; on 1–3, both fail spectacularly (5-ft blast, 2d6 dmg). |

---

### 🧩 Cover & Positioning

Steampunk battlefields are full of moving parts — gears, steam pipes, and scaffolds.  
DMs are encouraged to treat **terrain as active hazards**.

| Cover Type | Bonus to AC | Example                                      |
| ---------- | ----------- | -------------------------------------------- |
| Partial    | +2          | Steam pipes, railings, barrels               |
| Heavy      | +5          | Boiler tanks, collapsed machines             |
| Dynamic    | Variable    | Moving gears, retracting panels, lift shafts |

Creatures can use **Environment Actions** (lever pulls, vent valves, gear locks) as a bonus or free
action depending on complexity.

---

### 🧠 Psionics in Combat

Psionic powers interact seamlessly with normal actions. Unless stated otherwise:

- Manifesting a power = an **Action**
- Sustained powers require **Focus** (see Chapter 6)
- You can use **Psionic Surge** as a **Bonus Action**

#### Counter-Psionics

If two psionic users target the same effect or creature:

- Both roll opposed **Psionics checks (INT + proficiency)**.
- The higher roll wins; loser loses AFP equal to the difference.

---

### ⚙️ Environmental Hazards (Sample Table)

| Hazard               | Description                 | Mechanical Effect                                   |
| -------------------- | --------------------------- | --------------------------------------------------- |
| **Steam Vent**       | Bursts every 2 rounds       | DC 13 Dex save or 1d6 fire + blinded 1 round        |
| **Sparking Conduit** | Frayed high-voltage wire    | 1d8 lightning dmg on contact                        |
| **Aether Storm**     | Unstable psionic weather    | 10% chance per round of random power activation     |
| **Magnetic Pulse**   | Draws metal items to center | DC 12 Str save or drop metal weapon                 |
| **Coolant Flood**    | Slippery terrain            | Dex save or fall prone; extinguishes fire instantly |

---

### 🛡️ Repairs & Rest

After combat, characters can restore gear and cool their systems.

| Rest Type                         | Effect                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------- |
| **Short Rest (1 hr)**             | Regain AFP, clear 1d4 Heat, repair 10 HP worth of structure with tools.      |
| **Long Rest (8 hrs)**             | Reset Heat to 0, restore all mods, clear 1 level of Heat Stress.             |
| **Field Repair (Tinker’s Tools)** | Spend 30 mins and 10 ⚙️ per tier to repair 1 destroyed mod or armor section. |

---

### 🔥 Sample Combat Scenario

**The Broken Forge Skirmish**

1. A Vanguard’s Steam Rifle overheats after two volleys.
2. The Tweaker vents steam, obscuring line of sight.
3. The Mindweaver overloads _Resonant Pulse_, causing an Aether flare that shatters nearby pipes.
4. Boiling coolant floods the floor — forcing Dex saves each round to stay standing.
5. By round 4, the environment has become a living hazard — perfect Hollowgear chaos.

---

> _"Every battle is a storm of intent. Some win by surviving. Others by synchronizing."_  
> — Karnathi Templar motto
