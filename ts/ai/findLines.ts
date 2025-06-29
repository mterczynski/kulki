// Find all maximal lines of a given color on the board

import { BoardState, Color } from "../types";

export function findLines(board: BoardState, color: Color): { length: number, cells: [number, number][] }[] {
    const size = board.length;
    const lines: { length: number, cells: [number, number][] }[] = [];
    const directions = [
        [1, 0], // horizontal
        [0, 1], // vertical
        [1, 1], // diagonal down
        [1, -1] // diagonal up
    ];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === color) {
                for (const [dx, dy] of directions) {
                    const prevX = i - dx;
                    const prevY = j - dy;
                    if (
                        prevX >= 0 && prevY >= 0 && prevX < size && prevY < size &&
                        board[prevX][prevY] === color
                    ) {
                        continue; // not a line start
                    }
                    let line: [number, number][] = [];
                    let x = i, y = j;
                    while (x >= 0 && y >= 0 && x < size && y < size && board[x][y] === color) {
                        line.push([x, y]);
                        x += dx;
                        y += dy;
                    }
                    if (line.length > 1) {
                        lines.push({ length: line.length, cells: line });
                    }
                }
            }
        }
    }
    return lines.sort((a, b) => b.length - a.length);
}
