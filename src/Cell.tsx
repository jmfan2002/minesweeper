import { useState } from "react";
import "./Cell.css";

type CellValue = "bomb" | "flag" | number;

export class CellData {
  x: number;
  y: number;
  isRevealed: boolean = false;
  hasBomb: boolean = false;
  hasFlag: boolean = false;
  neighbours: CellData[] | undefined = undefined;
  neighBourCount: number = 0;
  setRevealed?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;

  constructor(
    x: number,
    y: number,
    setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    this.x = x;
    this.y = y;
    this.setIsGameOver = setIsGameOver;
  }

  getValue(): CellValue {
    if (this.hasFlag) return "flag";
    if (this.hasBomb) return "bomb";
    return this.neighBourCount;
  }

  // returns the number of mines revealed
  reveal() {
    let revealedCount = 0;
    if (!this.hasFlag && !this.isRevealed) {
      revealedCount++;
      this.isRevealed = true;
      this.setRevealed?.(true);
      if (this.getValue() === "bomb") {
        this.setIsGameOver(true);
        return revealedCount;
      }
      if (this.getValue() === 0) {
        this.neighbours?.forEach((neighbour) => {
          revealedCount += neighbour.reveal();
        });
      }
    }
    return revealedCount;
  }
}

interface CellProps {
  data: CellData;
  onCellClick: (i: number, j: number) => number;
}

const Cell = ({ data, onCellClick }: CellProps) => {
  const [revealed, setRevealed] = useState(data.isRevealed);
  data.setRevealed = setRevealed;
  const [hasFlag, setHasFlag] = useState(data.hasFlag);

  return (
    <div
      className={(revealed || data.hasFlag ? "value-" + data.getValue() : "") + " cell"}
      onClick={() => {
        onCellClick(data.x, data.y);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        data.hasFlag = !data.hasFlag;
        setHasFlag(data.hasFlag);
      }}
    >
      {revealed
        ? data.hasBomb
          ? "B"
          : data.neighBourCount > 0
          ? data.neighBourCount
          : ""
        : hasFlag
        ? "F"
        : "N"}
    </div>
  );
};

export default Cell;
