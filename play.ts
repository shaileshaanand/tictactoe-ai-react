import {
  findBestNextMove,
  gameIndices,
  getGameStatus,
  newGame,
  registerMove,
  showGameState,
} from "./GameState";

import { input, confirm } from "@inquirer/prompts";

const play = async () => {
  const playerGoesFirst = await confirm({
    message: "Would you like to go first?",
  });
  let currentState = newGame();
  if (playerGoesFirst) {
    currentState.turn = "X";
  } else {
    currentState = findBestNextMove(currentState);
  }
  while (true) {
    console.log("Welcome to Tic Tac Toe!");
    while (true) {
      showGameState(currentState);
      console.log(`Player ${currentState.turn}'s turn.`);
      try {
        const line = await input({ message: "Enter your move" });

        const xpos = Number(line.split(" ")[0]);
        const ypos = Number(line.split(" ")[1]);

        if (xpos > 3 || xpos < 1 || ypos > 3 || ypos < 1) {
          console.log("Illegal move!");
          throw new Error("Illegal move!");
        }
        currentState = registerMove(
          currentState,
          [xpos as 1 | 2 | 3, ypos as 1 | 2 | 3],
          currentState.turn,
        );

        const gameStatus = getGameStatus(currentState);

        if ("winner" in gameStatus) {
          showGameState(currentState);
          console.log(`Player ${gameStatus.winner} wins!`);
          return;
        }
        if ("status" in gameStatus && gameStatus.status === "DRAW") {
          showGameState(currentState);
          console.log(`Game is a draw!`);
          return;
        }
        currentState = findBestNextMove(currentState);
        const gameStatus2 = getGameStatus(currentState);

        if ("winner" in gameStatus2) {
          showGameState(currentState);
          console.log(`Player ${gameStatus2.winner} wins!`);
          return;
        }
        if ("status" in gameStatus2 && gameStatus2.status === "DRAW") {
          showGameState(currentState);
          console.log(`Game is a draw!`);
          return;
        }
      } catch {
        console.log("Illegal move! Try Again!");
      }
    }
  }
};

play();
