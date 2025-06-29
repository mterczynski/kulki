import { AiAgentMoveHandler } from './ai-agent-move-handler';
import { Game } from './game';
const game = new Game();
const aiHandler = new AiAgentMoveHandler(game);


game.restartGame();