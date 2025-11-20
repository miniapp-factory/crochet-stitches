"use client";

import { useState, useEffect } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];
const fruitImages: Record<string, string> = {
  Apple: "/apple.png",
  Banana: "/banana.png",
  Cherry: "/cherry.png",
  Lemon: "/lemon.png",
};

export function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array(3).fill("Apple"))
  );
  const [spinning, setSpinning] = useState(false);
  const [winFruit, setWinFruit] = useState<string | null>(null);

  const randomFruit = () => fruits[Math.floor(Math.random() * fruits.length)];

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinFruit(null);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        // shift rows down
        for (let col = 0; col < 3; col++) {
          for (let row = 2; row > 0; row--) {
            newGrid[row][col] = newGrid[row - 1][col];
          }
          newGrid[0][col] = randomFruit();
        }
        return newGrid;
      });
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      // compute winner inline
      let winner: string | null = null;
      // rows
      for (let r = 0; r < 3; r++) {
        if (grid[r][0] === grid[r][1] && grid[r][1] === grid[r][2]) {
          winner = grid[r][0];
          break;
        }
      }
      // columns if no winner
      if (!winner) {
        for (let c = 0; c < 3; c++) {
          if (grid[0][c] === grid[1][c] && grid[1][c] === grid[2][c]) {
            winner = grid[0][c];
            break;
          }
        }
      }
      if (winner) setWinFruit(winner);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flatMap((row, r) =>
          row.map((fruit, c) => (
            <div
              key={`${r}-${c}`}
              className="w-20 h-20 flex items-center justify-center border rounded"
            >
              <img
                src={fruitImages[fruit]}
                alt={fruit}
                className="w-16 h-16"
              />
            </div>
          ))
        )}
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {winFruit && (
        <div className="mt-4 text-center">
          <p className="text-xl font-semibold">You won with {winFruit}!</p>
          <Share text={`I won with ${winFruit}! ${url}`} />
        </div>
      )}
    </div>
  );
}
