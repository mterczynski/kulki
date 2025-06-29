import { CssClasses, Position, ScoreRecord } from './types';
import { AStarFinder } from './aStarFinder';
import {
	boardToTileNodeArray,
	clearPaths,
	getTileFromEventTarget,
	getTilePosition,
	paintPath,
	randomInt,
} from './utils';

export class Game {
	private aStarFinder = new AStarFinder();
	private localStorageKey = 'kulki_scores';
	private boardHTMLElement: Element = document.querySelector('#board') as Element;
	private boardSizeInput: HTMLInputElement = document.querySelector(
		'#boardSizeInput'
	) as HTMLInputElement;
	private restartGameButton: Element = document.querySelector(
		'#restartGameButton'
	) as Element;
	private paintPathInput: HTMLInputElement = document.querySelector('#paintPath') as HTMLInputElement;
	private numberOfColorsInput: HTMLInputElement = document.querySelector(
		'#numberOfColorsInput'
	) as HTMLInputElement;
	private currentScoreOutput: Element = document.querySelector('#currentScoreOutput') as Element;
	private nextBallColorHTMLElements: NodeListOf<Element> = document.querySelectorAll('.nextBallColor');
	private tileNodes: any[][] = [];
	private boardSize: number = 0;
	private currentScore = 0;
	private isGameOver = false;
	private board: any[][] = [];
	private nextBallColors: any[] = [];
	private selectedTile: any = null;
	private numberOfColors: number = 0;
	private hoveredTile = { x: 0, y: 0, isPath: false };

	constructor() {
		this.restartGameButton.addEventListener('click', () => {
			this.restartGame();
		});
	}

	restartGame(): void {
		this.isGameOver = false;
		this.boardSize = this.boardSizeInput.valueAsNumber;
		this.numberOfColors = this.numberOfColorsInput.valueAsNumber;
		this.currentScore = 0;
		this.currentScoreOutput.innerHTML = '0';
		this.randomNext3Colors();
		this.drawBoard();
		this.displayBestScore();
		for (let i = 0; i < 3;) {
			let x = randomInt(0, this.boardSize - 1);
			let y = randomInt(0, this.boardSize - 1);
			if (this.addNewBall(x, y)) {
				i++;
			}
		}
	}

	private addNext3Balls(): boolean {
		const newlyAdded = [];
		for (let i = 0; i < 3;) {
			if (this.isBoardFull()) {
				return false;
			}
			const posX = randomInt(0, this.boardSize - 1);
			const posY = randomInt(0, this.boardSize - 1);
			if (this.board[posX][posY] == null) {
				const color = this.nextBallColors[i];
				const ballNode = document.createElement('div');
				ballNode.classList.add(CssClasses.ball, 'color' + this.nextBallColors[i]);
				this.tileNodes[posX][posY].appendChild(ballNode);
				this.board[posX][posY] = color;
				newlyAdded.push({ posX, posY, color });
				i++;
			}
		}
		newlyAdded.forEach((ball) => {
			this.checkFor5({ x: ball.posX, y: ball.posY }, this.board, ball.color, this.boardSize);
		});
		return !this.isBoardFull();
	}

	private addNewBall(x: number, y: number): boolean {
		const ballElement = document.createElement('div');
		const ballColor = randomInt(1, this.numberOfColors);
		ballElement.classList.add(CssClasses.ball);
		ballElement.classList.add('color' + ballColor);
		const tile = this.boardHTMLElement.querySelectorAll(':scope >*')[y].childNodes[x];
		const isTileBusy = tile.childNodes.length > 0;
		if (isTileBusy) {
			return false;
		}
		tile.appendChild(ballElement);
		this.board[x][y] = ballColor;
		return true;
	}

	private checkFor5(movedPos: Position, board: any[][], movedColor: any, boardSize: number) {
		const minLineLength = 5;
		function checkInDirection(dirX: number, dirY: number) {
			let line = [movedPos];
			let iDir = 1;
			let i = 1;
			for (; true; i += iDir) {
				let x = i * dirX + movedPos.x;
				let y = i * dirY + movedPos.y;
				if ((x >= 0 && y >= 0 && x < boardSize && y < boardSize) == false) {
					if (iDir == 1) {
						i = 0;
						iDir = -1;
						continue;
					} else {
						if (line.length >= minLineLength) {
							return line;
						} else {
							return [];
						}
					}
				}
				if (board[x][y] == movedColor) {
					line.push({ x, y });
				} else {
					if (iDir == 1) {
						i = 0;
						iDir = -1;
					} else {
						if (line.length >= minLineLength) {
							return line;
						} else {
							return [];
						}
					}
				}
			}
		}
		let diagonal1 = checkInDirection(-1, 1);
		let vertical = checkInDirection(0, 1);
		let diagonal2 = checkInDirection(1, 1);
		let horizontal = checkInDirection(1, 0);
		let ballsToRemove = [...diagonal1, ...diagonal2, ...vertical, ...horizontal];
		if (ballsToRemove.length > 0) {
			let removedCount = 0;
			ballsToRemove.forEach((ball) => {
				if (board[ball.x][ball.y] == null) {
					return;
				}
				board[ball.x][ball.y] = null;
				this.tileNodes[ball.x][ball.y].innerHTML = '';
				removedCount++;
			});
			this.setGameScore(this.currentScore + removedCount * removedCount);
			return true;
		} else {
			return false;
		}
	}

	private drawBoard() {
		while (this.boardHTMLElement.firstChild) {
			this.boardHTMLElement.removeChild(this.boardHTMLElement.firstChild);
		}
		this.board = [];
		for (let i = 0; i < this.boardSize; i++) {
			this.board.push(Array(this.boardSize).fill(null));
		}
		for (let i = 0; i < this.boardSize; i++) {
			const row = document.createElement('div');
			row.classList.add('board__row');
			for (let j = 0; j < this.boardSize; j++) {
				const tile = document.createElement('div');
				tile.classList.add('board__row__tile');
				j % 2 == 0
					? tile.classList.add('board__row__tile__even')
					: tile.classList.add('board__row__tile__odd');
				tile.addEventListener('click', (event) => this.onTileClick(event));
				tile.addEventListener('mouseover', (event) => this.onTileHover(event));
				row.appendChild(tile);
			}
			this.boardHTMLElement.appendChild(row);
		}
		this.tileNodes = boardToTileNodeArray(this.boardHTMLElement, this.boardSize);
	}

	private drawPath(from: Position, to: Position) {
		let path = this.aStarFinder.findPath(this.board, from, to, this.boardSize);
		if (this.paintPathInput.checked) {
			paintPath(path as any, this.tileNodes);
		}
		this.hoveredTile = { x: to.x, y: to.y, isPath: path.success };
	}

	private gameOver(): void {
		this.saveScore(this.currentScore);
		this.displayBestScore();
		alert('Game over. Your score: ' + this.currentScore);
	}

	private saveScore(score: number): void {
		try {
			const scores: ScoreRecord[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
			if (!Array.isArray(scores)) {
				throw new Error('Invalid scores data in localStorage');
			}
			const recordIndex = scores.findIndex(
				(scoreRecord) =>
					scoreRecord.boardSize === this.boardSize && scoreRecord.numberOfColors === this.numberOfColors
			);
			const newRecord: ScoreRecord = {
				dateAchieved: new Date().toISOString(),
				score,
				boardSize: this.boardSize,
				numberOfColors: this.numberOfColors,
			};
			if (recordIndex === -1) {
				scores.push(newRecord);
			} else {
				scores[recordIndex] = scores[recordIndex].score > score ? scores[recordIndex] : newRecord;
			}
			localStorage.setItem(this.localStorageKey, JSON.stringify(scores));
		} catch (error) {
			console.error('Failed to save score:', error);
		}
	}

	private isBoardFull(): boolean {
		return this.board.every((row) => {
			return row.every((tile) => {
				return tile != null;
			});
		});
	}

	private onTileClick(event: MouseEvent): void {
		if (this.isGameOver) {
			return;
		}
		const tile = getTileFromEventTarget(event.target as HTMLElement);
		let clickedPos = getTilePosition(tile, this.boardHTMLElement, this.boardSize) as Position;
		if (this.board[clickedPos.x][clickedPos.y]) {
			document.querySelectorAll('.ball').forEach((el) => {
				el.classList.remove('selected');
			});
			this.selectedTile = { x: clickedPos.x, y: clickedPos.y, htmlElement: tile };
			this.selectedTile.htmlElement.children[0].classList.add('selected');
		} else {
			if (this.selectedTile && this.hoveredTile.isPath) {
				// Use the move method for actual move logic
				this.move([this.selectedTile.x, this.selectedTile.y], [clickedPos.x, clickedPos.y]);
			}
		}
	}

	private onTileHover(event: MouseEvent): void {
		const isTargetTileEmpty =
			(event.target as any).childNodes.length == 0 &&
			!(event.target as any).classList.contains(CssClasses.ball);
		if (this.selectedTile && isTargetTileEmpty) {
			const tile = getTileFromEventTarget(event.target as any);
			this.drawPath(this.selectedTile, getTilePosition(tile, this.boardHTMLElement, this.boardSize) as Position);
		}
	}

	private randomNext3Colors(): void {
		this.nextBallColors = Array.from({ length: 3 }, () => randomInt(1, this.numberOfColors));
		this.nextBallColorHTMLElements.forEach((element, index) => {
			element.className = '';
			element.classList.add('color' + this.nextBallColors[index], 'nextBallColor');
		});
	}

	private setGameScore(score: number): void {
		this.currentScore = score;
		this.currentScoreOutput.innerHTML = score + '';
	}

	private getBestScore(): number {
		const scores: ScoreRecord[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
		const bestScore = scores.find(
			(scoreRecord) =>
				scoreRecord.boardSize === this.boardSize && scoreRecord.numberOfColors === this.numberOfColors
		);
		return bestScore?.score || 0;
	}

	private displayBestScore(): void {
		const bestScoreElement = document.querySelector('#bestScoreOutput') as HTMLSpanElement;
		bestScoreElement.innerHTML = this.getBestScore() + '';
	}

	public getAllPossibleMoves(): { from: [number, number], to: [number, number] }[] {
		const moves: { from: [number, number], to: [number, number] }[] = [];
		for (let i = 0; i < this.boardSize; i++) {
			for (let j = 0; j < this.boardSize; j++) {
				if (this.board[i][j] > 0) {
					for (let x = 0; x < this.boardSize; x++) {
						for (let y = 0; y < this.boardSize; y++) {
							if (this.board[x][y] === null) {
								const path = this.aStarFinder.findPath(this.board, { x: i, y: j }, { x, y }, this.boardSize);
								if (path.success) {
									moves.push({ from: [i, j], to: [x, y] });
								}
							}
						}
					}
				}
			}
		}
		return moves;
	}

	public move(from: [number, number], to: [number, number]): boolean {
		if (this.isGameOver) return false;
		const fromPos = { x: from[0], y: from[1] };
		const toPos = { x: to[0], y: to[1] };
		if (!this.board[fromPos.x][fromPos.y] || this.board[toPos.x][toPos.y]) return false;
		// Simulate selection
		this.selectedTile = { x: fromPos.x, y: fromPos.y, htmlElement: this.tileNodes[fromPos.x][fromPos.y] };
		// Check if path exists
		const path = this.aStarFinder.findPath(this.board, fromPos, toPos, this.boardSize);
		if (!path.success) return false;
		// Move logic (similar to onTileClick)
		const fromTileNode = this.tileNodes[fromPos.x][fromPos.y];
		const toTileNode = this.tileNodes[toPos.x][toPos.y];
		const selectedBallColor = this.board[fromPos.x][fromPos.y];
		if (fromTileNode.children.length > 0) {
			toTileNode.appendChild(fromTileNode.children[0]);
			this.board[toPos.x][toPos.y] = selectedBallColor;
			this.board[fromPos.x][fromPos.y] = null;
			this.selectedTile = null;
			clearPaths(this.tileNodes);
			if (!this.checkFor5(toPos, this.board, selectedBallColor, this.boardSize) && !this.addNext3Balls()) {
				this.gameOver();
			}
			this.randomNext3Colors();
			return true;
		}
		return false;
	}
}
