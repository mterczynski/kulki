// filepath: f:\projects\github\mterczynski\kulki\ts\ai\agent.ts
import { BoardState, Color, Move } from '../types';
import { findLines } from './findLines';
// AI agent for Kulki game

class KulkiAIAgent {
    private modelKey = 'ki-ai-model';

    constructor() {
        this.loadModel();
    }

    // Decide on a move based on board state and next colors
    public decideMove(board: BoardState, nextColors: Color[], allpossiblemoves: Move[]): Move | null {
        if (allpossiblemoves.length === 0) return null;
        // Use imported findLines
        // Improved line finding: only start lines if previous cell in direction is not same color

        // Try to extend the longest line for any color
        for (let color = 1; color <= 6; color++) {
            const lines = findLines(board, color);
            for (const line of lines) {
                for (const [x, y] of line.cells) {
                    const neighbors = [
                        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
                        [x + 1, y + 1], [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1]
                    ];
                    for (const [nx, ny] of neighbors) {
                        if (nx >= 0 && ny >= 0 && nx < board.length && ny < board.length && board[nx][ny] === 0) {
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
