export const ONITAMA_CARDS = [
  { name: "Tiger", stamp: "blue", moves: [{ dx: 0, dy: -2 }, { dx: 0, dy: 1 }] },
  {
    name: "Dragon",
    stamp: "red",
    moves: [
      { dx: -2, dy: -1 },
      { dx: 2, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
    ],
  },
  {
    name: "Frog",
    stamp: "blue",
    moves: [
      { dx: -2, dy: 0 },
      { dx: -1, dy: -1 },
      { dx: 1, dy: 1 },
    ],
  },
  {
    name: "Rabbit",
    stamp: "red",
    moves: [
      { dx: 2, dy: 0 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
    ],
  },
  {
    name: "Crab",
    stamp: "blue",
    moves: [
      { dx: 0, dy: -1 },
      { dx: -2, dy: 0 },
      { dx: 2, dy: 0 },
    ],
  },
  {
    name: "Elephant",
    stamp: "red",
    moves: [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
    ],
  },
  {
    name: "Goose",
    stamp: "blue",
    moves: [
      { dx: -1, dy: 0 },
      { dx: -1, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 1, dy: 1 },
    ],
  },
  {
    name: "Rooster",
    stamp: "red",
    moves: [
      { dx: 1, dy: 0 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: -1, dy: 1 },
    ],
  },
  {
    name: "Monkey",
    stamp: "blue",
    moves: [
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
    ],
  },
  {
    name: "Mantis",
    stamp: "red",
    moves: [
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: 0, dy: 1 },
    ],
  },
  {
    name: "Horse",
    stamp: "blue",
    moves: [
      { dx: 0, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
    ],
  },
  {
    name: "Ox",
    stamp: "red",
    moves: [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
    ],
  },
  {
    name: "Crane",
    stamp: "blue",
    moves: [
      { dx: 0, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
    ],
  },
  {
    name: "Boar",
    stamp: "red",
    moves: [
      { dx: 0, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ],
  },
  {
    name: "Eel",
    stamp: "blue",
    moves: [
      { dx: -1, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 1 },
    ],
  },
  {
    name: "Cobra",
    stamp: "red",
    moves: [
      { dx: 1, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 1 },
    ],
  },
];

function shuffledCopy(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function dealCards() {
  const selection = shuffledCopy(ONITAMA_CARDS).slice(0, 5);
  return {
    player1: [selection[0], selection[1]],
    player2: [selection[2], selection[3]],
    neutral: selection[4],
  };
}
