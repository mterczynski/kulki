import { findLines } from './findLines';

describe('findLines', () => {
    it('finds horizontal, vertical, and diagonal lines', () => {
        const board = [
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 1],
        ];
        // Color 1
        const lines = findLines(board, 1);
        // Should find at least the main diagonal and horizontal/vertical lines
        expect(lines.some(l => l.length === 4 && l.cells[0][0] === 0 && l.cells[0][1] === 0)).toBeTruthy();
        expect(lines.some(l => l.length === 3)).toBeTruthy();
    });

    it('returns empty for no lines', () => {
        const board = [
            [0, 0],
            [0, 0],
        ];
        expect(findLines(board, 1)).toEqual([]);
    });

    it('does not duplicate lines', () => {
        const board = [
            [2, 2, 2],
            [0, 0, 0],
            [0, 0, 0],
        ];
        const lines = findLines(board, 2);
        // Only one horizontal line
        expect(lines.filter(l => l.length === 3).length).toBe(1);
    });
});
