# Catch-or-Treat

## Project Overview
Catch or Treat is a browser-based Phaser game built with JavaScript. In the game, players catch candy to earn points while avoiding hazards that subtract from their score. The game includes real-time scoring, randomized item spawning, a 70-second round timer, and an end-of-game recommendation system that suggests a Halloween movie based on the player’s final score. I built this project to strengthen my JavaScript skills, practice game logic and state management, and create a fun interactive browser game from scratch.

## Features
- Built in Phaser with JavaScript for browser-based gameplay
- 5 candy types with texture-based point values
- 2 hazard types with score penalties
- Real-time score tracking and score refreshes during gameplay
- Collision handling for candies and hazards
- Score-floor validation to prevent negative scores
- Randomized spawn system for candies and hazards
- 70-second round timer for each game session
- End-of-game Halloween movie recommendation system with 5 score bands

## Tech Stack
- JavaScript
- HTML

## What I Implemented
- Wrote JavaScript collision callbacks for candy and hazard interactions, updating score, destroying objects, and refreshing the UI in real time
- Implemented score-floor logic to keep the player score from dropping below zero
- Created a 70-second round timer to control session length and drive end-of-game behavior
- Built a spawn decision function that randomly determines whether a candy or hazard appears on each tick, helping balance gameplay pacing
- Created randomized spawn functions for candies and hazards using texture keys, randomized x-positioning, and physics-based falling behavior
- Built end-of-game logic that maps final scores to 5 Halloween movie recommendations across non-overlapping score bands
- Used JavaScript throughout the game logic to control scoring, spawning, recommendations, and UI updates
