## **COMP4021 Group 19 Battleship multiplayer game**

Member: Anthony, Aidan, Nelson 


To run the following command to play the game:
1. `npm install`
2. `npm run start`

## Overview
This is a 2-player PvP board game. Each player will take turns to fire missiles into the opponent's territory until all ships from one player are completely destroyed. 

## Battleship Board 

* Size of board: 10 x 10

* Number of ship: 5

* Carrier (grey): 5x1 tile

* Battleship (blue): 4x1 tile

* Cruiser (purple): 3x1 tile  

* Submarine (green): 3x1 tile

* Destroyer (light blue): 2x1 tile

## Start of round: 
You can place and rotate your ships the way you like. You can also choose to randomise ship arrangement.

## Game round:
### Missile:
For each round, a player can fire N missiles according to N ships that are remaining (i.e 4 ships = 4 missiles), at the enemy territory on any selected block. A missile will destroy a 1x1 block of an opponent's territory, destroyed territory will be displayed on the map and can not be destroyed again. An explosion animation will be played after the missile is fired. If a missile hits an enemy’s ship, fire animation will be played continuously on that block.

### Sonic detection:
If a player has a submarine, he can either choose to fire N missiles or use sonic detection for a round. Sonic detection will relieve enemy territory with 3 x 3 tiles. The player can choose the dedicated block as the center of sonic detection to scan the area. A concentric wave animation will be played. 

## Cheats
Click the hidden text box at the bottom center of the game page and enter the cheat code "painpeko" then click submit. After that, **`"Reveal Enemy"`** and **`"!!! Tactical Nuke!!!"`** button will appear. Click **`"Reveal Enemy"`** to show the position of enemy's ships. Click **`"!!! Tactical Nuke!!!"`** to hit every grid in enemy's territory.

## Sound Effects
Background Music is played when a user is ready. An explosion sound effect is played when the player or the enemy fire missiles for the turn. Sonar sound effect is played when the player use sonar detection. Win or lose background music is played when the game is over.

## Login and Registration
To play the game, users are required to register for an account. Passwords are stored after hashing. Once an account is registered, users can log in using the corresponding credentials and join a game session.

## Game Animations
When a missile is fired and misses, there will be an explosion animation effect followed by a explosion hole svg added in the grid. If the missile hit enemy ship, a on-fire animation will be displayed on the grid, looping infinitely. These animation also will be displayed when enemy hit or miss your ships. Sonar detection animation will be displayed only if you successfully scan enemy ships location.

## Game Over Screen
When all ships on either side have been sunk, the game will end, and the game over screen will be shown. Statistics for both players in the game played will be display, including:
1. Turns elapsed
2. Winner/loser
3. Hit shots
4. Missed shots
5. Accuracy
6. Enemy ships sunk
7. Number of own ships intact
8. Overall damage received (%)

Each category will be compared between both players, with the better stats displayed in green, and red for the inferior stats. 

2 buttons will be avaiable in the game over screen, **`Play again`** and **`Back to Front Page`**. Clicking the **`Play again`** button will refresh the board, and prompt the user to login again. Clicking the **`Back to Front Page`** button will return the user to the front page of the game.

