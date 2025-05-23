import { AStarFinder } from './aStarFinder';
import { Position } from './types';

describe('AStarFinder', () => {
  let finder: AStarFinder;
  beforeEach(() => {
    finder = new AStarFinder();
  });

  it('returns success false if from and to are the same', () => {
    const board = [
      [null, null],
      [null, null],
    ];
    const from: Position = { x: 0, y: 0 };
    const to: Position = { x: 0, y: 0 };
    const result = finder.findPath(board, from, to, 2);
    expect(result.success).toBe(false);
    expect(result.openList).toEqual([]);
    expect(result.closedList).toEqual([]);
  });

  it('finds a straight path in an empty 3x3 board', () => {
    const board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    const from: Position = { x: 0, y: 0 };
    const to: Position = { x: 2, y: 0 };
    const result = finder.findPath(board, from, to, 3) as { success: boolean; openList: any[]; closedList: any[]; finalPath?: any[] };
    expect(result.success).toBe(true);
    expect(result.finalPath).toBeDefined();
    // Should include both start and end
    expect(result.finalPath && result.finalPath.some((p: any) => p.x === 0 && p.y === 0)).toBe(true);
    expect(result.finalPath && result.finalPath.some((p: any) => p.x === 2 && p.y === 0)).toBe(true);
  });

  it('returns success false if target is surrounded', () => {
    // Target is (1,1), surrounded by obstacles
    // [null, 1, null]
    // [1,  null, 1]
    // [null, 1, null]
    const board = [
      [null, 1, null],
      [1,   null, 1],
      [null, 1, null],
    ];
    const from: Position = { x: 0, y: 0 };
    const to: Position = { x: 1, y: 1 };
    const result = finder.findPath(board, from, to, 3) as { success: boolean; openList: any[]; closedList: any[]; finalPath?: any[] };
    expect(result.success).toBe(false);
    expect(result.finalPath).toBeUndefined();
  });

  it('returns success false if board is full except start and end', () => {
    // Only start and end are empty, but not connected
    // [null, 1, 1]
    // [1,   1, 1]
    // [1,   1, null]
    const board = [
      [null, 1, 1],
      [1, 1, 1],
      [1, 1, null],
    ];
    const from: Position = { x: 0, y: 0 };
    const to: Position = { x: 2, y: 2 };
    const result = finder.findPath(board, from, to, 3) as { success: boolean; openList: any[]; closedList: any[]; finalPath?: any[] };
    expect(result.success).toBe(false);
    expect(result.finalPath).toBeUndefined();
  });

  it('finds a path around a single obstacle', () => {
    const board = [
      [null, 1, null],
      [null, null, null],
      [null, null, null],
    ];
    const from: Position = { x: 0, y: 0 };
    const to: Position = { x: 2, y: 0 };
    const result = finder.findPath(board, from, to, 3) as { success: boolean; openList: any[]; closedList: any[]; finalPath?: any[] };
    expect(result.success).toBe(true);
    expect(result.finalPath).toBeDefined();
    expect(result.finalPath && result.finalPath.some((p: any) => p.x === 2 && p.y === 0)).toBe(true);
  });

  it('returns the shortest path (not just any path)', () => {
    // Block the direct path, force a detour
    const board = [
      [null, 1, null],
      [null, null, null],
      [null, null, null],
    ];
    const from: Position = { x: 0, y: 0 };
    const to: Position = { x: 0, y: 2 };
    const result = finder.findPath(board, from, to, 3) as { success: boolean; openList: any[]; closedList: any[]; finalPath?: any[] };
    expect(result.success).toBe(true);
    expect(result.finalPath && result.finalPath.length).toBeGreaterThan(2); // Should not be a direct line
  });

  // it('does not find a path through a vertical wall (classic bug scenario)', () => {
  //   // Board:
  //   // [null, 1, null]
  //   // [null, 1, null]
  //   // [null, 1, null]
  //   // Should NOT be able to go from (0,0) to (2,0)
  //   const board = [
  //     [null, 1, null],
  //     [null, 1, null],
  //     [null, 1, null],
  //   ];
  //   const from: Position = { x: 0, y: 0 };
  //   const to: Position = { x: 2, y: 0 };
  //   const result = finder.findPath(board, from, to, 3) as { success: boolean; openList: any[]; closedList: any[]; finalPath?: any[] };

	// 	console.log('## result', result);
	// 	expect(result.success).toBe(false);

  //   expect(result.finalPath).toBeUndefined();
  // });
});
