import Board, {GameStatus} from './Board';
import React from 'react';
import renderer from 'react-test-renderer';

const boardTestRenderer = renderer.create(
    <Board height={10} width={10} mines={10} errorMessage={""} superman={false}  />
);

test('Board component Snapshot test', () => {
    let data = boardTestRenderer.toJSON();
    expect(data).toMatchSnapshot();
});

test('Board init test', () => {
    const boardComponent = boardTestRenderer.getInstance();
    let board = boardComponent.initBoard();
    let mineCount = 0;
    let emptyCount = 0;
    let neighbourCount = 0;
    expect(board.length).toBe(10);
    board.forEach(row => {
       expect(row.length).toBe(10);
       row.forEach(cell => {
           expect(cell.isRevealed).toBe(false);
           expect(cell.isFlagged).toBe(false);
           expect(cell.superman).toBe(false);
           expect(cell.isRed).toBe(false);
           mineCount += cell.isMine ? 1 : 0;
           emptyCount += cell.isEmpty ? 1 : 0;
           neighbourCount += cell.neighbour ? 1 : 0;
       });
    });
    expect(mineCount + emptyCount + neighbourCount === 100);
    expect(boardComponent.getSurroundingCells(1,1, board).length === 8);
    expect(boardComponent.getSurroundingCells(0,0, board).length === 3);
});

test('Board reveal mine test', () => {
    const boardComponent = boardTestRenderer.getInstance();
    boardComponent.state.board.forEach(row => {
        row.forEach(cell => {
            if (cell.isMine) {
                boardComponent.handleReveal(cell.x, cell.y);
            }
        });
    });
    expect(boardComponent.state.gameStatus).toBe(GameStatus.lose);
});

test('Board reveal cell test', () => {
    const boardComponent = boardTestRenderer.getInstance();
    boardComponent.state.board.forEach(row => {
        row.forEach(cell => {
            if (!cell.isMine) {
                boardComponent.handleReveal(cell.x, cell.y);
            }
        });
    });
    expect(boardComponent.state.board[0][0].isRevealed).toBe(true);
});

test('Board flag cell test', () => {
    const boardComponent = boardTestRenderer.getInstance();
    let mineCount = boardComponent.state.mineCount;
    boardComponent.state.board[1][1].isRevealed = false;
    boardComponent.handleFlag(1,1);
    expect(boardComponent.state.board[1][1].isFlagged).toBe(true);
    expect(boardComponent.state.board[1][1].isRevealed).toBe(true);
    expect(boardComponent.state.mineCount === boardComponent.state.board[1][1].isMine ? mineCount-1 : mineCount);
});

test('Board finish game test', () => {
    const boardComponent = boardTestRenderer.getInstance();
    boardComponent.state.mineCount = 10;
    boardComponent.state.board.forEach(row => {
        row.forEach(cell => {
            if (cell.isMine) {
                cell.isRevealed = false;
                boardComponent.handleFlag(cell.x, cell.y);
            }
        });
    });
    expect(boardComponent.state.mineCount === 0);
});