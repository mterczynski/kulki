// Set up DOM before importing game module
const mockBoard = document.createElement('div');
mockBoard.id = 'board';
document.body.appendChild(mockBoard);

const mockInput = document.createElement('input');
mockInput.id = 'boardSizeInput';
mockInput.type = 'number';
mockInput.value = '9';
document.body.appendChild(mockInput);

const mockButton = document.createElement('button');
mockButton.id = 'restartGameButton';
document.body.appendChild(mockButton);

const mockPaintPath = document.createElement('input');
mockPaintPath.id = 'paintPath';
mockPaintPath.type = 'checkbox';
document.body.appendChild(mockPaintPath);

const mockNumberOfColors = document.createElement('input');
mockNumberOfColors.id = 'numberOfColorsInput';
mockNumberOfColors.type = 'number';
mockNumberOfColors.value = '6';
document.body.appendChild(mockNumberOfColors);

const mockScoreOutput = document.createElement('span');
mockScoreOutput.id = 'currentScoreOutput';
document.body.appendChild(mockScoreOutput);

const mockBestScoreOutput = document.createElement('span');
mockBestScoreOutput.id = 'bestScoreOutput';
document.body.appendChild(mockBestScoreOutput);

// Mock next ball color elements
for (let i = 0; i < 3; i++) {
	const mockNextBall = document.createElement('div');
	mockNextBall.classList.add('nextBallColor');
	document.body.appendChild(mockNextBall);
}

// Now import the game module after DOM is set up
import { restartGame } from './game';

describe('Game Over Timing', () => {
	beforeEach(() => {
		// Clear localStorage
		localStorage.clear();
		// Mock alert to prevent actual alert dialogs during tests
		global.alert = jest.fn();
	});

	it('should initialize game properly', () => {
		expect(() => restartGame()).not.toThrow();
		expect(mockScoreOutput.innerHTML).toBe('0');
	});

	// This test would require mocking the internal game state
	// For now, let's focus on the actual fix
});
