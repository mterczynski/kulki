import { CssClasses } from "types";

enum PathClass {
	openList = 'openList',
	closedList = 'closedList',
	finalPath = 'finalPath',
}

export function boardToTileNodeArray(htmlBoard: Element, boardSize: number): Element[][] {
	const tileNodes: Element[][] = [];
	const boardTiles = htmlBoard.querySelectorAll(':scope >*>*');

	for (let i = 0; i < boardSize; i++) {
		tileNodes.push([]);
	}

	for (let i = 0; i < boardSize * boardSize; i++) {
		tileNodes[i % boardSize].push(boardTiles[i]);
	}

	return tileNodes;
}

export function getTilePosition(tile: any, boardHTMLElement: Element, boardSize: number) {
	const boardRows = boardHTMLElement.querySelectorAll(':scope >*');

	let x: number | undefined;
	let y: number | undefined;

	for (let i = 0; i < boardSize; i++) {
		if (tile.parentNode === boardRows[i]) {
			y = i;
			const row = boardRows[i];
			for (let j = 0; j < boardSize; j++) {
				if (row.childNodes[j] === tile) {
					x = j;
				}
			}
		}
	}

	return { x, y };
}

export function clearPaths(tileNodes: Element[][]): void {
	tileNodes.forEach(row => {
		row.forEach(tile => {
			tile.classList.remove(PathClass.openList);
			tile.classList.remove(PathClass.closedList);
			tile.classList.remove(PathClass.finalPath);
		});
	});
}

export function getTileFromEventTarget(eventTarget: HTMLElement): HTMLElement | ParentNode | null {
	let tile = eventTarget;
	if (tile.classList.contains(CssClasses.ball)) {
		return tile.parentNode;
	}
	return tile;
}

export function randomFloat(min: number, max: number): number {
	return Math.random() * (max - min + 1) + min;
}

export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function paintPath(path: { openList: any[], closedList: any[], finalPath: any[] }, tileNodes: any[]): void {
	clearPaths(tileNodes);

	path.openList.forEach((tile) => {
		tileNodes[tile.x][tile.y].classList.add(PathClass.openList);
	});

	path.closedList.forEach((tile) => {
		tileNodes[tile.x][tile.y].classList.add(PathClass.closedList);
	});

	if (path.finalPath) {
		path.finalPath.forEach((tile) => {
			tileNodes[tile.x][tile.y].classList.add(PathClass.finalPath);
		});
	}
}
