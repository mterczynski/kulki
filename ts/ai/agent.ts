// filepath: f:\projects\github\mterczynski\kulki\ts\ai\agent.ts

// AI agent for Kulki game

type BoardState = number[][]; // 0 = empty, >0 = color id
type Color = number;

export interface Move {
    from: [number, number];
    to: [number, number];
}

class KulkiAIAgent {
    private modelKey = 'ki-ai-model';

    constructor() {
        this.loadModel();
    }

    // Decide on a move based on board state and next colors
    public decideMove(board: BoardState, nextColors: Color[], allpossiblemoves: Move[]): Move | null {
        if (allpossiblemoves.length === 0) return null;

        // Helper to find the length and cells of all lines for a given color
        function findLines(board: BoardState, color: Color): { length: number, cells: [number, number][] }[] {
            const size = board.length;
            const visited = Array.from({ length: size }, () => Array(size).fill(false));
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
                            let line: [number, number][] = [];
                            let x = i, y = j;
                            while (x >= 0 && y >= 0 && x < size && y < size && board[x][y] === color) {
                                line.push([x, y]);
                                x += dx;
                                y += dy;
                            }
                            if (line.length > 1) {
                                // Avoid duplicates
                                const key = line.map(([x, y]) => `${x},${y}`).join('-');
                                if (!lines.some(l => l.cells.map(([x, y]) => `${x},${y}`).join('-') === key)) {
                                    lines.push({ length: line.length, cells: line });
                                }
                            }
                        }
                    }
                }
            }
            return lines.sort((a, b) => b.length - a.length);
        }

        // Try to extend the longest line for any color
        for (let color = 1; color <= 6; color++) {
            const lines = findLines(board, color);
            for (const line of lines) {
                // Try to extend this line by moving a ball of the same color to an adjacent empty cell
                for (const [x, y] of line.cells) {
                    const neighbors = [
                        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
                        [x + 1, y + 1], [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1]
                    ];
                    for (const [nx, ny] of neighbors) {
                        if (nx >= 0 && ny >= 0 && nx < board.length && ny < board.length && board[nx][ny] === 0) {
                            // Find a move that moves a ball of this color to (nx, ny)
                            const move = allpossiblemoves.find(m => board[m.from[0]][m.from[1]] === color && m.to[0] === nx && m.to[1] === ny);
                            if (move) return move;
                        }
                    }
                }
            }
        }
        // Fallback: random move
        return allpossiblemoves[Math.floor(Math.random() * allpossiblemoves.length)];
    }

    // Model persistence
    private loadModel() {
        try {
            const data = localStorage.getItem(this.modelKey);
            if (data) {
                // Load model data (expand as needed)
                // this.model = JSON.parse(data);
            }
        } catch (e) {
            // Fallback to indexedDB if needed
            this.loadModelFromIndexedDB();
        }
    }

    private saveModel(data: any) {
        try {
            localStorage.setItem(this.modelKey, JSON.stringify(data));
        } catch (e) {
            this.saveModelToIndexedDB(data);
        }
    }

    // IndexedDB fallback
    private loadModelFromIndexedDB() {
        // Implement as needed
    }

    private saveModelToIndexedDB(data: any) {
        // Implement as needed
    }
}

export default KulkiAIAgent;
