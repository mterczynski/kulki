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
            console.log('click');
            const allpossiblemoves = this.game.getAllPossibleMoves();
            const board = this.game['board'].map((row: any[]) => row.slice());
            const nextColors = this.game['nextBallColors'].slice();
            let move = null;
            move = this.agent.decideMove(board, nextColors, allpossiblemoves);

            console.log('AI decided move:', move);
            if (move) {
                this.game.move(move.from, move.to);
            }
        });
    }
}