import React, { useState, useEffect } from 'react';

const BOARD_SIZE = 8;
const MINES_COUNT = 10;
const TOTAL_SAFE_CELLS = BOARD_SIZE * BOARD_SIZE - MINES_COUNT; // 54 safe cells

function generateEmptyBoard() {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() =>
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => ({
          mine: false,
          revealed: false,
          flagged: false,
          count: 0,
        }))
    );
}

function populateMines(initialBoard, startR, startC) {
  const newBoard = initialBoard.map((row) => row.map((cell) => ({ ...cell })));

  let planted = 0;
  while (planted < MINES_COUNT) {
    const r = Math.floor(Math.random() * BOARD_SIZE);
    const c = Math.floor(Math.random() * BOARD_SIZE);
    if ((r !== startR || c !== startC) && !newBoard[r][c].mine) {
      newBoard[r][c].mine = true;
      planted++;
    }
  }

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (newBoard[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
            if (newBoard[nr][nc].mine) count++;
          }
        }
      }
      newBoard[r][c].count = count;
    }
  }

  return newBoard;
}

export default function Minesweeper() {
  const [board, setBoard] = useState(generateEmptyBoard);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flagsRemaining, setFlagsRemaining] = useState(MINES_COUNT);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer = null;
    if (gameStarted && !gameOver && !gameWon) {
      timer = setInterval(() => {
        setSeconds((prev) => (prev < 999 ? prev + 1 : 999));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, gameWon]);

  const resetGame = () => {
    setBoard(generateEmptyBoard());
    setGameStarted(false);
    setGameOver(false);
    setGameWon(false);
    setFlagsRemaining(MINES_COUNT);
    setSeconds(0);
  };

  const revealCell = (r, c) => {
    if (gameOver || gameWon) return;

    let currentBoard = board;

    if (!gameStarted) {
      currentBoard = populateMines(board, r, c);
      setGameStarted(true);
    }

    if (currentBoard[r][c].flagged || currentBoard[r][c].revealed) return;

    if (currentBoard[r][c].mine) {
      const lostBoard = currentBoard.map((row) =>
        row.map((cell) => ({
          ...cell,
          revealed: cell.mine ? true : cell.revealed,
        }))
      );
      setBoard(lostBoard);
      setGameOver(true);
      return;
    }

    const nextBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));

    const flood = (row, col) => {
      if (
        row < 0 ||
        row >= BOARD_SIZE ||
        col < 0 ||
        col >= BOARD_SIZE ||
        nextBoard[row][col].revealed ||
        nextBoard[row][col].flagged ||
        nextBoard[row][col].mine
      ) {
        return;
      }

      nextBoard[row][col].revealed = true;

      if (nextBoard[row][col].count === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            flood(row + dr, col + dc);
          }
        }
      }
    };

    flood(r, c);

    let revealedCount = 0;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!nextBoard[row][col].mine && nextBoard[row][col].revealed) {
          revealedCount++;
        }
      }
    }

    setBoard(nextBoard);

    if (revealedCount === TOTAL_SAFE_CELLS) {
      setGameWon(true);
    }
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver || gameWon || board[r][c].revealed) return;

    const nextBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const target = nextBoard[r][c];

    if (!target.flagged && flagsRemaining > 0) {
      target.flagged = true;
      setFlagsRemaining((f) => f - 1);
    } else if (target.flagged) {
      target.flagged = false;
      setFlagsRemaining((f) => f + 1);
    }

    setBoard(nextBoard);
  };

  const numberColors = [
    '',
    '#0000ff',
    '#008000',
    '#ff0000',
    '#000080',
    '#800000',
    '#008080',
    '#000000',
    '#808080',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
      <div
        className="sunken-panel"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '3px 4px',
          marginBottom: '6px',
          backgroundColor: '#c0c0c0',
          boxSizing: 'border-box',
          borderTop: '2px solid #808080',
          borderLeft: '2px solid #808080',
          borderRight: '2px solid #ffffff',
          borderBottom: '2px solid #ffffff',
        }}
      >
        <SevenSegmentDisplay value={flagsRemaining}/>

        <button
          onClick={resetGame}
          style={{
            minWidth: '26px',
            minHeight: '26px',
            width: '26px',
            height: '26px',
            padding: 0,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
          }}
        >
          {gameOver ? 'X(' : gameWon ? ':)' : ':|'}
        </button>

        <SevenSegmentDisplay value={seconds}/>
      </div>

      <div
        className="sunken-panel"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 22px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 22px)`,
          gap: '0px',
          padding: '4px',
          backgroundColor: '#c0c0c0',
          width: 'max-content',
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            let content = '';
            if (cell.revealed) {
              if (cell.mine) content = '💣';
              else if (cell.count > 0) content = cell.count;
            } else if (cell.flagged) {
              content = '🚩';
            }

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => revealCell(r, c)}
                onContextMenu={(e) => toggleFlag(e, r, c)}
                aria-pressed={cell.revealed}
                className={cell.revealed && cell.count > 0 ? 'pixel-text' : ''}
                style={{
                  width: '22px',
                  height: '22px',
                  minWidth: '0',
                  minHeight: '0',
                  margin: '0',
                  padding: '0',
                  boxSizing: 'border-box',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: cell.revealed ? numberColors[cell.count] : '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 0,

                  backgroundColor: cell.revealed ? '#a6a6a6' : '#c0c0c0',

                  borderTop: cell.revealed ? '1px solid #707070' : '1px solid #ffffff',
                  borderLeft: cell.revealed ? '1px solid #707070' : '1px solid #ffffff',
                  borderRight: cell.revealed ? '1px solid #707070' : '1px solid #808080',
                  borderBottom: cell.revealed ? '1px solid #707070' : '1px solid #808080',
                  boxShadow: cell.revealed ? 'none' : undefined,
                }}
              >
                {content}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

const SEGMENTS_MAP = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'd', 'e', 'g'],
  '3': ['a', 'b', 'c', 'd', 'g'],
  '4': ['b', 'c', 'f', 'g'],
  '5': ['a', 'c', 'd', 'f', 'g'],
  '6': ['a', 'c', 'd', 'e', 'f', 'g'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
  '-': ['g'],
};

const PIXEL_SEGMENT_PATHS = {
  // Top horizontal bar
  a: 'M 2 1 H 12 V 3 H 11 V 4 H 3 V 3 H 2 Z',
  // Top-Right vertical bar
  b: 'M 11 3 H 13 V 9 H 11 V 8 H 10 V 4 H 11 Z',
  // Bottom-Right vertical bar
  c: 'M 11 12 H 13 V 18 H 11 V 17 H 10 V 13 H 11 Z',
  // Bottom horizontal bar
  d: 'M 2 18 H 3 V 17 H 11 V 18 H 12 V 20 H 2 Z',
  // Bottom-Left vertical bar
  e: 'M 1 12 H 3 V 13 H 4 V 17 H 3 V 18 H 1 Z',
  // Top-Left vertical bar
  f: 'M 1 3 H 3 V 4 H 4 V 8 H 3 V 9 H 1 Z',
  // Middle horizontal bar
  g: 'M 3 9 H 11 V 10 H 12 V 11 H 11 V 12 H 3 V 11 H 2 V 10 H 3 Z',
};

function SingleDigit({ digit = '0' }) {
  const activeSegments = SEGMENTS_MAP[digit] || [];

  return (
    <svg
      viewBox="0 0 14 22"
      style={{
        width: '13px',
        height: '21px',
        transform: 'skewX(-4deg)',
        shapeRendering: 'crispEdges',
      }}
    >
      {Object.entries(PIXEL_SEGMENT_PATHS).map(([segKey, path]) => {
        const isLit = activeSegments.includes(segKey);
        return (
          <path
            key={segKey}
            d={path}
            fill={isLit ? '#ff1a1a' : '#2b0303'}
            style={{
              shapeRendering: 'crispEdges',
              filter: isLit ? 'drop-shadow(0 0 1.5px #ff2222)' : 'none',
            }}
          />
        );
      })}
    </svg>
  );
}

function SevenSegmentDisplay({ value = 0 }) {
  const formatted = String(Math.min(999, Math.max(0, value)))
    .padStart(3, '0')
    .slice(-3);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        backgroundColor: '#0a0000',
        padding: '3px 5px',
        borderTop: '2px solid #505050',
        borderLeft: '2px solid #505050',
        borderRight: '2px solid #ffffff',
        borderBottom: '2px solid #ffffff',
        borderRadius: '1px',
        boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.9)',
      }}
    >
      {formatted.split('').map((char, index) => (
        <SingleDigit key={index} digit={char} />
      ))}
    </div>
  );
}
