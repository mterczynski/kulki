export interface Position {
	x: number;
	y: number;
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
