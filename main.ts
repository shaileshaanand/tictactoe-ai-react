import {
  generateNextMoves,
  newGame,
  registerMove,
  showGameState,
  findBestNextMove,
  type GameState,
  getScore,
  getGameStateString,
  getGameStateHash,
} from "./GameState";

export const convertStringToGameState: (s: string) => GameState = (s) => {
  if (s.length !== 10) {
    throw new Error("Invalid string");
  }
  const spaceToNull = (c: string | undefined) => {
    if (c === " ") {
      return null;
    }
    return c;
  };

  return {
    state: [
      [spaceToNull(s[0]), spaceToNull(s[1]), spaceToNull(s[2])],
      [spaceToNull(s[3]), spaceToNull(s[4]), spaceToNull(s[5])],
      [spaceToNull(s[6]), spaceToNull(s[7]), spaceToNull(s[8])],
    ],
    turn: s[9],
  } as GameState;
};

// let gameState = newGame();
// showGameState(gameState);
// gameState.turn = "O";
// gameState.state = [
//   ["O", "O", "X"],
//   [null, "X", null],
//   [null, null, null],
// ];

let gameStates = [
  convertStringToGameState("OXO X  OXX"),
  convertStringToGameState("OXO XX OXO"),
  convertStringToGameState("OXO X XOXO"),
  convertStringToGameState("OXOXX  OXO"),
];
// showGameState(gameState);
// gameState = findBestNextMove(gameState,5);
// showGameState(gameState);
gameStates.map((gameState) =>
  console.log(
    getGameStateHash(gameState),
    getScore(gameState, gameState.turn),
  ),
);
