export interface Position {
	x: number;
	y: number;
}

export type BoardState = number[][]; // 0 = empty, >0 = color id
export type Color = number;

export interface Move {
	from: [number, number];
	to: [number, number];
}

export enum CssClasses {
	ball = 'ball',
}

export interface ScoreRecord {
	score: number;
	/** same format as used by `new Date().toISOString()` */
	dateAchieved: string;
	boardSize: number;
	numberOfColors: number;
}
