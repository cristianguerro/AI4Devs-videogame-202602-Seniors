# PRD: Project "Pixel-Tama" (Onitama Web)

- **Status:** Draft / Planning
- **Target Platform:** Web (Desktop/Mobile Browser)
- **Engine:** Phaser 3+
- **Date:** April 15, 2026

## 1. Executive Summary

The goal of this project is to develop a functional, browser-based version of the board game Onitama. The game will utilize a low-fidelity pixel art aesthetic to maximize charm while minimizing asset production time. This serves as a technical exercise in state management, grid-based movement, and UI/UX implementation in Phaser.

## 2. User Personas

- **The Casual Player:** Wants a quick 5-minute strategy fix.
- **The Retro Enthusiast:** Appreciates the "GameBoy-era" visual style.
- **The Developer (Self):** Needs to demonstrate proficiency in game loops and turn-based logic.

## 3. Functional Requirements

### 3.1 Game Mechanics (The "Way" of Onitama)

- **The Board:** A 5 x 5 grid.
- **The Units:** Each player has 1 Master and 4 Students.
- **The Cards:**
	- Total of 5 cards selected randomly from a pool at start.
	- 2 cards assigned to Player A, 2 to Player B, and 1 "Neutral" card on the side.
	- When a card is used, it is exchanged with the Neutral card after the turn.
- **Movement:** Pieces must move according to the relative coordinates defined on the active card.
- **Victory Conditions:**
	- **Way of the Stone:** Capture the opponent's Master.
	- **Way of the Stream:** Move your Master to the opponent's starting "Temple Arch" (center-back) square.

### 3.2 Technical Requirements (Phaser Specific)

- **Input System:** Point-and-click/touch interaction.
	- Click 1: Select piece.
	- Click 2: Select card (if not already selected).
	- Click 3: Select valid destination tile.
- **Visual Feedback:** Valid moves must be highlighted on the grid when a piece and card are selected.
- **State Machine:** Must handle `PLAYER_1_TURN`, `PLAYER_2_TURN`, `TRANSITIONING_CARD`, and `GAME_OVER`.

## 4. User Interface and Visuals

- **Perspective:** Top-down or "2.5D" slightly tilted view.
- **Resolution:** Low-res (e.g., 320 x 180 scaled up) to maintain pixel integrity.
- **UI Layout:**
	- Center: The 5 x 5 grid.
	- Top/Bottom: Player card slots.
	- Right Side: The "Next" (Neutral) card.

## 5. Non-Goals and Out of Scope

To ensure this remains a manageable exercise, the following features are strictly excluded from the MVP:

- **Online Multiplayer:** The game will be local multiplayer (pass-and-play) or single player vs. a "Random Move" AI only.
- **Advanced AI:** No Minimax or neural network AI. A simple "choose a random valid move" bot is sufficient.
- **Animations:** No complex skeletal animations. Simple "squash and stretch" or 2-frame idles only.
- **Save States:** No database or localStorage to save game progress mid-match.
- **Card Drafting:** The game will auto-select 5 cards; a manual drafting phase is out of scope.

## 6. Success Metrics

- **Game Loop Integrity:** A full match can be played from start to finish without console errors.
- **Logic Accuracy:** Cards rotate correctly between players and the neutral slot.
- **Visual Clarity:** A user who knows Onitama can understand the board state without a tutorial.
