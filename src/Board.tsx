import { useEffect, useState } from "react";
import Cell from "./Cell";
import { CellData } from "./Cell";
import './Board.css'

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 10;
const BOMB_COUNT = 10;

const Board = () => {
  const [boardData, setBoardData] = useState<CellData[][]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const getNeighbours = (board: CellData[][], x: number, y: number) => {
    const neighbours = [];
    //up
    if (x > 0) neighbours.push(board[x - 1][y]);
    //down
    if (x < BOARD_HEIGHT - 1) neighbours.push(board[x + 1][y]);
    //left
    if (y > 0) neighbours.push(board[x][y - 1]);
    //right
    if (y < BOARD_WIDTH - 1) neighbours.push(board[x][y + 1]);
    // top left
    if (x > 0 && y > 0) neighbours.push(board[x - 1][y - 1]);
    // top right
    if (x > 0 && y < BOARD_WIDTH - 1) neighbours.push(board[x - 1][y + 1]);
    // bottom right
    if (x < BOARD_HEIGHT - 1 && y < BOARD_WIDTH - 1)
      neighbours.push(board[x + 1][y + 1]);
    // bottom left
    if (x < BOARD_HEIGHT - 1 && y > 0) neighbours.push(board[x + 1][y - 1]);
    return neighbours;
  };

  const getBoardData = () => {
    let newData: CellData[][] = [];

    // initialize array
    for (let i = 0; i < 10; i++) {
      let row: CellData[] = [];
      for (let j = 0; j < 10; j++) {
        row.push(new CellData(i, j, setIsGameOver));
      }
      newData[i] = row;
    }

    // place mines
    let mines: number[] = [];
    for (let i = 0; i < BOMB_COUNT; i++) {
      let newMine = Math.floor(Math.random() * BOARD_HEIGHT * BOARD_WIDTH);
      if (mines.indexOf(newMine) === -1) mines.push(newMine);
    }
    for (const mine of mines) {
      newData[Math.floor(mine / BOARD_HEIGHT)][mine % BOARD_WIDTH].hasBomb = true;
    }

    // set neighbour count and neighbours
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      for (let j = 0; j < BOARD_WIDTH; j++) {
        let neighbours = getNeighbours(newData, i, j);
        newData[i][j].neighbours = neighbours;
        if (newData[i][j].getValue() === 0)
          newData[i][j].neighBourCount = neighbours.filter(
            (val) => val.hasBomb
          ).length;
      }
    }

    return newData;
  };

  // returns the number of cells revealed
  const onCellClick = (i: number, j: number): number => {
    let revealed = boardData[i][j].reveal();
    let unrevealedCount = boardData.reduce((prev: number, curr: CellData[]) => {
      return prev + curr.filter((val) => !val.isRevealed).length;
    }, 0);
    if (unrevealedCount === BOMB_COUNT) {
      alert("You win!");
      window.location.reload();
    }
    return revealed;
  };

  useEffect(() => {
    if (isGameOver) {
      alert("Game over!");
      window.location.reload();
    }
  }, [isGameOver]);

  

  useEffect(() => {
    setBoardData(getBoardData());
  }, []);

  return (
    <div className="board">
      {boardData.map((boardRow, i) => {
        return (
          <div key={i} className="row">
            {boardRow.map((cell) => {
              return <Cell key={cell.x * BOARD_HEIGHT + cell.y} data={cell} onCellClick={onCellClick} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
