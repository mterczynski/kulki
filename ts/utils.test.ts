import { boardToTileNodeArray, getTilePosition, clearPaths, getTileFromEventTarget, randomInt, paintPath } from './utils';

describe('utils', () => {
  describe('randomInt', () => {
    it('returns an integer within the range (inclusive)', () => {
      for (let i = 0; i < 100; i++) {
        const val = randomInt(1, 3);
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(3);
        expect(Number.isInteger(val)).toBe(true);
      }
    });
  });

  describe('getTileFromEventTarget', () => {
    it('returns the parent node if CssClasses.ball is present', () => {
      const parent = document.createElement('div');
      const ball = document.createElement('div');
      ball.classList.add('ball');
      parent.appendChild(ball);
      expect(getTileFromEventTarget(ball)).toBe(parent);
    });
    it('returns the element itself if CssClasses.ball is not present', () => {
      const tile = document.createElement('div');
      expect(getTileFromEventTarget(tile)).toBe(tile);
    });
  });

  describe('clearPaths', () => {
    it('removes path classes from all tiles', () => {
      const tile = document.createElement('div');
      tile.classList.add('openList', 'closedList', 'finalPath');
      const tileNodes = [[tile]];
      clearPaths(tileNodes as any);
      expect(tile.classList.contains('openList')).toBe(false);
      expect(tile.classList.contains('closedList')).toBe(false);
      expect(tile.classList.contains('finalPath')).toBe(false);
    });
  });

  describe('paintPath', () => {
    it('adds finalPath class to tiles in finalPath', () => {
      const tile = document.createElement('div');
      const tileNodes = [[tile]];
      const path = { openList: [], closedList: [], finalPath: [{ x: 0, y: 0 }] };
      paintPath(path, tileNodes as any);
      expect(tile.classList.contains('finalPath')).toBe(true);
    });

		 it('adds closedList class to tiles in closedList', () => {
      const tile = document.createElement('div');
      const tileNodes = [[tile]];
      const path = { openList: [], closedList: [{ x: 0, y: 0 }], finalPath: [] };
      paintPath(path, tileNodes as any);
      expect(tile.classList.contains('closedList')).toBe(true);
    });
  });

  // boardToTileNodeArray and getTilePosition require a DOM structure, so only basic smoke tests here
  describe('boardToTileNodeArray', () => {
    it('returns a 2D array of elements', () => {
      const board = document.createElement('div');
      for (let i = 0; i < 9; i++) {
        const row = document.createElement('div');
        for (let j = 0; j < 9; j++) {
          row.appendChild(document.createElement('div'));
        }
        board.appendChild(row);
      }
      const array = boardToTileNodeArray(board, 9);
      expect(array.length).toBe(9);
      expect(array[0].length).toBe(9);
    });
  });

  describe('getTilePosition', () => {
    it('returns the correct x and y for a tile', () => {
      const board = document.createElement('div');
      const rows: HTMLDivElement[] = [];
      for (let i = 0; i < 3; i++) {
        const row = document.createElement('div');
        rows.push(row);
        for (let j = 0; j < 3; j++) {
          row.appendChild(document.createElement('div'));
        }
        board.appendChild(row);
      }
      const tile = rows[1].children[2];
      const pos = getTilePosition(tile, board, 3);
      expect(pos).toEqual({ x: 2, y: 1 });
    });
  });
});
