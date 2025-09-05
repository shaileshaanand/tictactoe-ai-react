type GameCell = "O" | "X" | null;
type GameCellNotNull = "O" | "X";
type GameRow = [GameCell, GameCell, GameCell];
export type GameState = { state: [GameRow, GameRow, GameRow]; turn: "X" | "O" };

export const gameIndices = [0, 1, 2] as const;

export const newGame: () => GameState = () => {
  return {
    state: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    turn: "O",
  };
};

export const getGameStateString = (gameState: GameState) => {
  const state = gameState.state;
  let gameStateString = "";
  const replaceNull = (cell: GameCell) => {
    return cell === null ? " " : cell;
  };
  const showLine = () => {
    gameStateString += "\n-----------";
  };
  const showRow = (row: 0 | 1 | 2) => {
    showLine();
    gameStateString += `\n ${replaceNull(state[row][0])} | ${replaceNull(
      state[row][1],
    )} | ${replaceNull(state[row][2])} `;
  };
  showRow(0);
  showRow(1);
  showRow(2);
  showLine();
  return gameStateString;
};

export const showGameState = (gameState: GameState) => {
  console.log(getGameStateString(gameState));
};

export const registerMove = (
  currState: GameState,
  position: [1 | 2 | 3, 1 | 2 | 3],
  move: "X" | "O",
) => {
  const row = (position[0] - 1) as 0 | 1 | 2;
  const col = (position[1] - 1) as 0 | 1 | 2;
  if (currState.state[row][col] !== null) {
    throw new Error("Invalid Move");
  }

  if (currState.turn !== move) {
    throw new Error("Invalid Move");
  }
  const newState = structuredClone(currState);
  newState.state[row][col] = move;
  newState.turn = (currState.turn === "X" ? "O" : "X") as GameCellNotNull;
  return newState;
};

export const getGameStatus: (gameState: GameState) =>
  | {
      winner: "X" | "O";
    }
  | { status: "ONGOING" | "DRAW" } = (gameState: GameState) => {
  const state = gameState.state;

  const checkRow = (row: 0 | 1 | 2) => {
    if (
      state[row][0] === state[row][1] &&
      state[row][1] === state[row][2] &&
      state[row][0] !== null
    ) {
      return state[row][0] as GameCellNotNull;
    }
    return null;
  };
  const checkCol = (col: 0 | 1 | 2) => {
    if (
      state[0][col] === state[1][col] &&
      state[1][col] === state[2][col] &&
      state[0][col] !== null
    ) {
      return state[0][col] as GameCellNotNull;
    }
    return null;
  };
  const checkDiag = () => {
    if (
      state[0][0] === state[1][1] &&
      state[1][1] === state[2][2] &&
      state[0][0] !== null
    ) {
      return state[0][0] as GameCellNotNull;
    }
    if (
      state[0][2] === state[1][1] &&
      state[1][1] === state[2][0] &&
      state[0][2] !== null
    ) {
      return state[0][2] as GameCellNotNull;
    }
    return null;
  };

  for (const row of gameIndices) {
    const winner = checkRow(row);
    if (winner !== null) {
      return { winner };
    }
  }

  for (const col of gameIndices) {
    const winner = checkCol(col);
    if (winner !== null) {
      return { winner };
    }
  }
  const winner = checkDiag();

  if (winner !== null) return { winner };

  if (
    state[0].includes(null) ||
    state[1].includes(null) ||
    state[2].includes(null)
  ) {
    return { status: "ONGOING" };
  }

  return { status: "DRAW" };
};

export const getGameStateHash = (gameState: GameState) => {
  const { state } = gameState;
  return `${state[0][0]}${state[0][1]}${state[0][2]}${state[1][0]}${state[1][1]}${state[1][2]}${state[2][0]}${state[2][1]}${state[2][2]}${gameState.turn}`.replaceAll(
    "null",
    " ",
  );
};

export const generateNextMoves = (gameState: GameState) => {
  const nextMoves: GameState[] = [];
  const { state, turn } = gameState;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if ((state[i] as GameRow)[j] === null) {
        const newState = registerMove(
          gameState,
          [(i + 1) as 1 | 2 | 3, (j + 1) as 1 | 2 | 3],
          turn,
        );
        nextMoves.push(newState);
      }
    }
  }
  return nextMoves;
};

const cache = new Map<string, number>();

export const getScore: (
  gameState: GameState,
  turn: GameCellNotNull,
) => number = (gameState, turn) => {
  const hash = getGameStateHash(gameState);
  if (cache.has(hash)) {
    return cache.get(hash) as number;
  }
  const status = getGameStatus(gameState);
  if ("winner" in status) {
    if (status.winner === "O") {
      return 10;
    } else {
      return -10;
    }
  }
  if ("status" in status && status.status === "DRAW") {
    return 0;
  }
  const nextMoves = generateNextMoves(gameState);
  const nextTurn = turn === "O" ? "X" : "O";

  if (turn === "O") {
    let score = -Infinity;
    for (const move of nextMoves) {
      const moveScore = getScore(move, nextTurn);
      if (moveScore > score) {
        score = moveScore;
      }
    }
    return score;
  }
  let score = Infinity;
  for (const move of nextMoves) {
    const moveScore = getScore(move, nextTurn);
    if (moveScore < score) {
      score = moveScore;
    }
  }
  cache.set(hash, score);
  return score;
};

export const findBestNextMove: (gameState: GameState) => GameState = (
  gameState: GameState,
) => {
  const possibleNextMoves = generateNextMoves(gameState);
  const scores = possibleNextMoves.map((moveState) => {
    const score = getScore(moveState, moveState.turn);

    return score;
  });
  console.log({ scores });
  const maxScore = Math.max(...scores);
  const maxScoreIndex = scores.indexOf(maxScore);

  if (!possibleNextMoves[maxScoreIndex]) {
    throw new Error("No possible next moves");
  }
  return possibleNextMoves[maxScoreIndex];
};
