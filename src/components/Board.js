import React from 'react';
import Cell from './Cell';
import {ErrorMessage} from "./Game";

export default class Board extends React.Component {
    state = {
        board: this.initBoard(),
        gameStatus: GameStatus.ongoing,
        mineCount: this.props.mines
    };

    // get all cells that pass the condition
    getCells(board, condition) {
        let cells = [];
        board.forEach(row => {
            row.forEach((cell) => {
                if (condition(cell)) {
                    cells.push(cell);
                }
            });
        });
        return cells;
    }

    getRandomNumber(range) {
        return Math.floor(Math.random() * range);
    }

    initBoard() {
        let board = [];
        this.updateBoard(board);
        this.updateMines(board);
        this.updateNeighbours(board);
        return board;
    }

    // initialize a new board
    updateBoard(board) {
        let height = this.props.height, width = this.props.width;
        for (let row = 0; row < height; row++) {
            board.push([]);
            for (let col = 0; col < width; col++) {
                board[row][col] = {
                    x: row,
                    y: col,
                    isMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                    superman: this.props.superman,
                    isRed: false
                };
            }
        }
    }

    // put mines in random cells
    updateMines(board) {
        let height = this.props.height, width = this.props.width, mines = this.props.mines;
        let randomX, randomY, minesPlanted = 0;
        while (minesPlanted < mines) {
            randomX = this.getRandomNumber(width);
            randomY = this.getRandomNumber(height);
            if (!(board[randomY][randomX].isMine)) {
                board[randomY][randomX].isMine = true;
                minesPlanted++;
            }
        }
    }

    // update the amount of mine-neighbours of each cell
    updateNeighbours(board) {
        board.forEach(row => {
            row.forEach(cell => {
                if (!cell.isMine) {
                    let mine = 0;
                    const area = this.getSurroundingCells(cell.x, cell.y, board);
                    area.forEach(value => {
                        if (value.isMine) {
                            mine++;
                        }
                    });
                    if (mine === 0) {
                        cell.isEmpty = true;
                    }
                    cell.neighbour = mine;
                }
            });
        });
    };

    getSurroundingCells(x, y, board) {
        const surroundingCells = [];
        if (x > 0) {
            surroundingCells.push(board[x - 1][y]);
        }
        if (x < board.length - 1) {
            surroundingCells.push(board[x + 1][y]);
        }
        if (y > 0) {
            surroundingCells.push(board[x][y - 1]);
        }
        if (y < board[0].length - 1) {
            surroundingCells.push(board[x][y + 1]);
        }
        if (x > 0 && y > 0) {
            surroundingCells.push(board[x - 1][y - 1]);
        }
        if (x > 0 && y < board[0].length - 1) {
            surroundingCells.push(board[x - 1][y + 1]);
        }
        if (x < board.length - 1 && y < board[0].length - 1) {
            surroundingCells.push(board[x + 1][y + 1]);
        }
        if (x < board.length - 1 && y > 0) {
            surroundingCells.push(board[x + 1][y - 1]);
        }
        return surroundingCells;
    }

    // reveal the whole board
    revealBoard() {
        let updatedData = this.state.board;
        updatedData.forEach((row) => {
            row.forEach((cell) => {
                cell.isRevealed = true;
            });
        });
        this.setState({
            board: updatedData
        })
    }

    // reveal the "non-mine" neighborhood of the cell
    revealSurroundingCells(x, y, board) {
        let stack = this.getSurroundingCells(x, y, board).filter(nbr => !nbr.isRevealed && (nbr.isEmpty || !nbr.isMine));
        while (stack.length > 0) {
            const cell = stack.pop();
            board[cell.x][cell.y].isRevealed = true;
            if (cell.isEmpty) {
                stack = stack.concat(this.getSurroundingCells(cell.x, cell.y, board)).filter(nbr => !nbr.isRevealed && (nbr.isEmpty || !nbr.isMine));
            }
        }
        return board;
    }

    handleCellClick(event, x, y) {
        if (this.state.gameStatus !== GameStatus.ongoing) {
            return;
        }
        if (event.shiftKey) {
            this.handleCellFlagged(x, y);
        }
        else {
            this.handleCellRevealed(x, y);
        }
    }

    handleCellRevealed(x, y) {
        let updatedData = this.state.board;

        // check if revealed. return if true.
        if ((!this.props.superman && updatedData[x][y].isRevealed) || updatedData[x][y].isFlagged) {
            return;
        }
        let win = GameStatus.ongoing;
        // check if mine. game over if true
        if (updatedData[x][y].isMine) {
            updatedData[x][y].isRed = true;
            this.revealBoard();
            win = GameStatus.lose;
        }
        else {
            updatedData[x][y].isRevealed = true;
            if (updatedData[x][y].isEmpty) {
                updatedData = this.revealSurroundingCells(x, y, updatedData);
            }
            if (this.isWin(updatedData)) {
                win = GameStatus.win;
                this.revealBoard();
            }
        }
        this.setState({
            board: updatedData,
            mineCount: this.props.mines - this.getCells(updatedData, (cell) => cell.isFlagged).length,
            gameStatus: win
        });
    }

    handleCellFlagged(x, y) {
        let updatedData = this.state.board;
        let mines = this.state.mineCount;
        let win = GameStatus.ongoing;

        if (updatedData[x][y].isRevealed && !updatedData[x][y].isFlagged) return;
        if (updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false;
            updatedData[x][y].isRevealed = false;
            mines++;
        } else if (mines === 0) {
            alert("You Don't Have Any More Flags");
            return;
        } else {
            updatedData[x][y].isFlagged = true;
            updatedData[x][y].isRevealed = true;
            mines--;
            if (mines === 0 && this.isWin(updatedData)) {
                win = GameStatus.win;
                this.revealBoard();
            }
        }
        this.setState({
            board: updatedData,
            mineCount: mines,
            gameStatus: win
        });
    }

    isWin(updatedData) {
        const mineArray = this.getCells(updatedData, (cell) => cell.isMine);
        const flagArray = this.getCells(updatedData, (cell) => cell.isFlagged);
        return JSON.stringify(mineArray) === JSON.stringify(flagArray) ? true : false;
    }

    getCellKey(x, y) {
        return x * y + y;
    }

    renderCell = (cell) => (
        <td key={this.getCellKey(cell.x, cell.y)} className="hidden">
            <Cell onClick={(e) => this.handleCellClick(e, cell.x, cell.y)} value={cell}/>
        </td>
    );

    renderRow = (row) => (
        <tr key={row[0].x}>
            {row.map(cell => this.renderCell(cell))}
        </tr>
    );

    renderTable = (matrix) => (
            <table>
                <tbody>
                {matrix.map((row) => this.renderRow(row))}
                </tbody>
            </table>
        );

    // initializes a new board. called when the user starts a new game
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps && this.props.errorMessage === ErrorMessage.noError) {
            this.setState({
                board: this.initBoard(),
                gameStatus: GameStatus.ongoing,
                mineCount: this.props.mines,
                superman: this.props.superman
            });
        }
    }

    render() {
        return (
            <div>
                <div>
                    <div>Remaining Flags: {this.state.mineCount}</div>
                    <br/>
                    <h1 className={this.gamesStatusColor()}>{this.state.gameStatus}</h1>
                </div>
                <br/>
                <div>
                    {this.renderTable(this.state.board)}
                </div>
            </div>
        )
    }

    gamesStatusColor() {
        return this.state.gameStatus === GameStatus.win ? "winColor" : "loseColor";
    }
}
export const GameStatus = Object.freeze({"win":"You Win!", "lose":"You Lose!", "ongoing":" "});
