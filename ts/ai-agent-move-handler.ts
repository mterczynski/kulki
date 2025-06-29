import KulkiAIAgent from './ai/agent';
import { Game } from './game';

export class AiAgentMoveHandler {
    private agent: KulkiAIAgent;
    private game: Game;
    constructor(game: Game) {
        this.agent = new KulkiAIAgent();
        this.game = game;
        this.initButton();
    }
    private initButton() {
        const btn = document.createElement('button');
        btn.textContent = 'Make AI Move';
        btn.id = 'make-ai-move-btn';
        document.body.appendChild(btn);
        btn.addEventListener('click', () => {
            const board = this.game['board'].map((row: any[]) => row.slice());
            const nextColors = this.game['nextBallColors'].slice();
            const move = this.agent.decideMove(board, nextColors);
            if (move) {
                this.doMove(move.from, move.to);
            }
        });
    }
    private doMove(from: [number, number], to: [number, number]) {
        // Simulate a user move from 'from' to 'to' using the Game class logic
        const fromPos = { x: from[0], y: from[1] };
        const toPos = { x: to[0], y: to[1] };
        this.game['selectedTile'] = { x: fromPos.x, y: fromPos.y, htmlElement: this.game['tileNodes'][fromPos.x][fromPos.y] };
        const selectedBallColor = this.game['board'][fromPos.x][fromPos.y];
        const fromTileNode = this.game['tileNodes'][fromPos.x][fromPos.y];
        const toTileNode = this.game['tileNodes'][toPos.x][toPos.y];
        if (fromTileNode.children.length > 0) {
            toTileNode.appendChild(fromTileNode.children[0]);
            this.game['board'][toPos.x][toPos.y] = selectedBallColor;
            this.game['board'][fromPos.x][fromPos.y] = null;
            this.game['selectedTile'] = null;
            // clearPaths is imported in game.ts and available globally
            (window as any).clearPaths(this.game['tileNodes']);
            if (!this.game['checkFor5'](toPos, this.game['board'], selectedBallColor, this.game['boardSize']) && !this.game['addNext3Balls']()) {
                this.game['gameOver']();
            }
            this.game['randomNext3Colors']();
        }
    }
}