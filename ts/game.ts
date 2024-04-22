import { CssClasses, Position } from "./types";
import { AStarFinder } from "./aStarFinder";
import { boardToTileNodeArray, clearPaths, getTileFromEventTarget, getTilePosition, paintPath, randomInt } from "./utils";

const aStarFinder = new AStarFinder();

// html elements:
const boardHTMLElement: Element = document.querySelector('#board') as Element;
const boardSizeInput: HTMLInputElement = document.querySelector('#boardSizeInput') as HTMLInputElement;
const restartGameButton: Element = document.querySelector('#restartGameButton') as Element;
const paintPathInput: HTMLInputElement = document.querySelector('#paintPath') as HTMLInputElement;
const numberOfColorsInput: HTMLInputElement = document.querySelector('#numberOfColorsInput') as HTMLInputElement;
const currentScoreOutput: Element = document.querySelector('#currentScoreOutput') as Element;
const nextBallColorHTMLElements: NodeListOf<Element> = document.querySelectorAll('.nextBallColor');
let tileNodes: any[][]; // two-dimensional array of tiles

// game variables:
let boardSize: number;
let currentScore = 0;
let isGameOver = false;
let board: any[][] = []; // two-dimensional array of colors
let nextBallColors: any[] = [];
let selectedTile: any; // tile with selected ball (first click to select, second click to move)
let numberOfColors: number;
let hoveredTile = { x: 0, y: 0, isPath: false } // only for moving active ball

restartGameButton.addEventListener('click', () => {
	restartGame();
});

export function restartGame(): void {
	isGameOver = false;
	boardSize = boardSizeInput.valueAsNumber;
	numberOfColors = numberOfColorsInput.valueAsNumber;
	currentScore = 0;
	currentScoreOutput.innerHTML = '0';
	randomNext3Colors();
	drawBoard();
	// add 3 balls to the board:
	for (let i = 0; i < 3;) {
		let x = randomInt(0, boardSize - 1);
		let y = randomInt(0, boardSize - 1);
		if (addNewBall(x, y)) {
			i++;
		}
	}
}


/**
 * @returns boolean informing whether all 3 balls were added
 */
function addNext3Balls(): boolean {
	const newlyAdded = [];

	for (let i = 0; i < 3;) {
		if (isBoardFull()) {
			return false; // board full, game over
		}

		// try to find a next free tile in board
		const posX = randomInt(0, boardSize - 1);
		const posY = randomInt(0, boardSize - 1);

		if (board[posX][posY] == null) {
			const color = nextBallColors[i];
			const ballNode = document.createElement('div');
			ballNode.classList.add(CssClasses.ball, 'color' + nextBallColors[i]);
			tileNodes[posX][posY].appendChild(ballNode);
			board[posX][posY] = color;
			newlyAdded.push({ posX, posY, color });
			i++;
		}
	}

	// for every nextBall: check for 5+ in a row after adding it
	newlyAdded.forEach((ball) => {
		checkFor5({ x: ball.posX, y: ball.posY }, board, ball.color, boardSize);
	});

	return !isBoardFull();
}

function addNewBall(x: number, y: number): boolean {
	const ballElement = document.createElement('div');
	const ballColor = randomInt(1, numberOfColors);
	ballElement.classList.add(CssClasses.ball);
	ballElement.classList.add('color' + ballColor);
	const tile = boardHTMLElement.querySelectorAll(':scope >*')[y].childNodes[x];
	if (tile.childNodes.length > 0) {
		return false;   // if tile is busy stop function, return false
	}
	tile.appendChild(ballElement);
	// numberOfBusyTiles++;
	board[x][y] = ballColor;
	return true;
}

function checkFor5(movedPos: Position, board: any[][], movedColor: any, boardSize: number) { // todo: fix, not always working
	// todo: fix vertical, horizontal
	function checkInDirection(dirX: number, dirY: number) {

		let line = [movedPos];
		let iDir = 1; // go in specified by dirX and dirY or direction (1) or go backwards (-1)
		let i = 1;

		for (; true; i += iDir) { // keep checking for the same color in that direction
			let x = i * dirX + movedPos.x; // posX
			let y = i * dirY + movedPos.y; // posY
			// 1. if position is not inside the board:
			if ((x >= 0 && y >= 0 && x < boardSize && y < boardSize) == false) {
				if (iDir == 1) {
					i = 0; // will be -1 after iteration
					iDir = -1;
					continue;
				} else {
					if (line.length >= 5) {
						return line;
					} else {
						return [];
					}
				}
			}

			// 2. if next color is the same, add it to line
			if (board[x][y] == movedColor) {
				line.push({ x, y });
			} else { // no more balls of the same color in this direction, change direction
				if (iDir == 1) {
					i = 0; // will be -1 after iteration
					iDir = -1;
				} else {
					if (line.length >= 5) {
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

	let ballsToRemove = diagonal1.concat(vertical).concat(diagonal2).concat(horizontal);

	if (ballsToRemove.length > 0) {
		let removedCount = 0;
		ballsToRemove.forEach((ball) => {
			if (board[ball.x][ball.y] == null) {
				return; // skip, it's a duplicate
			}
			board[ball.x][ball.y] = null;
			tileNodes[ball.x][ball.y].innerHTML = '';
			removedCount++;
		});
		setGameScore(currentScore + removedCount * removedCount);
		return true; // next turn
	} else {
		return false; // no next turn
	}
}

function drawBoard() {
	// Clear board:
	while (boardHTMLElement.firstChild) {
		boardHTMLElement.removeChild(boardHTMLElement.firstChild);
	}
	board = [];
	for (let i = 0; i < boardSize; i++) {
		board.push([]);
	}

	// Draw new rows and tiles:
	for (let i = 0; i < boardSize; i++) {
		const row = document.createElement('div');
		row.classList.add('board__row');
		for (let j = 0; j < boardSize; j++) {
			const tile = document.createElement('div');
			tile.classList.add('board__row__tile');
			(j % 2 == 0) ? tile.classList.add('board__row__tile__even') : tile.classList.add('board__row__tile__odd');
			tile.addEventListener('click', onTileClick);
			tile.addEventListener('mouseover', onTileHover);
			row.appendChild(tile);
		}
		boardHTMLElement.appendChild(row);
	}
	tileNodes = boardToTileNodeArray(boardHTMLElement, boardSize);
}

function drawPath(from: Position, to: Position) {
	let path = aStarFinder.findPath(board, from, to, { x: boardSize, y: boardSize });
	if (paintPathInput.checked) {
		paintPath(path as any, tileNodes);
	}

	hoveredTile = { x: to.x, y: to.y, isPath: path.success };
}

function gameOver(): void {
	alert('Game over. Your score: ' + currentScore);
}

function isBoardFull(): boolean {
	return board.every((row) => {
		return row.every((tile) => {
			return tile != null
		})
	});
}

function onTileClick(event: MouseEvent): void {
	if (isGameOver) {
		return;
	}

	const tile = getTileFromEventTarget(event.target as HTMLElement);

	let clickedPos = getTilePosition(tile, boardHTMLElement, boardSize) as Position;

	if (board[clickedPos.x][clickedPos.y]) {  // if there is ball on clicked tile: change selection
		// remove selection from all balls:
		document.querySelectorAll('.ball').forEach((el) => {
			el.classList.remove('selected');
		});
		// change selected tile, add css class
		selectedTile = { x: clickedPos.x, y: clickedPos.y, htmlElement: tile };
		selectedTile.htmlElement.children[0].classList.add('selected');
	} else { // if there is no ball on clicked tile
		if (selectedTile && hoveredTile.isPath) { // move, check if 5 in line
			const clickedTileNode = tileNodes[clickedPos.x][clickedPos.y];
			const selectedTileNode = tileNodes[selectedTile.x][selectedTile.y];
			const selectedBallColor = board[selectedTile.x][selectedTile.y];

			clickedTileNode.appendChild(selectedTileNode.children[0]);
			clickedTileNode.children[0].classList.remove('selected');
			board[clickedPos.x][clickedPos.y] = selectedBallColor;
			board[selectedTile.x][selectedTile.y] = null;
			selectedTile = null;

			clearPaths(tileNodes);
			if (!checkFor5(clickedPos, board, selectedBallColor, boardSize) && !addNext3Balls()) {
				gameOver();
			}
			randomNext3Colors();
		}
	}
}

function onTileHover(event: MouseEvent): void {
	// if there is a selected tile and target tile is empty:
	const isTargetTileEmpty = (event.target as any).childNodes.length == 0 &&
		!(event.target as any).classList.contains(CssClasses.ball)
	if (selectedTile && isTargetTileEmpty) {
		const tile = getTileFromEventTarget(event.target as any);
		drawPath(selectedTile, getTilePosition(tile, boardHTMLElement, boardSize) as Position);
	}
}

function randomNext3Colors(): void {
	nextBallColors = [
		randomInt(1, numberOfColors),
		randomInt(1, numberOfColors),
		randomInt(1, numberOfColors),
	];

	nextBallColorHTMLElements[0].className = '';
	nextBallColorHTMLElements[1].className = '';
	nextBallColorHTMLElements[2].className = '';

	nextBallColorHTMLElements[0].classList.add('color' + nextBallColors[0], 'nextBallColor');
	nextBallColorHTMLElements[1].classList.add('color' + nextBallColors[1], 'nextBallColor');
	nextBallColorHTMLElements[2].classList.add('color' + nextBallColors[2], 'nextBallColor');
}

function setGameScore(score: number): void {
	currentScore = score;
	currentScoreOutput.innerHTML = score + '';
}
