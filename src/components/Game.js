import React from 'react'
import Board from './Board'
import * as Constants from "../constants";

export default class Game extends React.Component {
    state = {
        height: Constants.DefaultState.height,
        width: Constants.DefaultState.width,
        mines: Constants.DefaultState.mines,
        errorMessage: Constants.ErrorMessage.noError,
        superman: false
    };

    render () {
        const { height, width, mines, errorMessage, superman } = this.state;
        return (
        <div>
            <div>
                <div>
                    Superman<Constants.GreenCheckbox id="superman"/>
                </div>
                <div>
                    width: <input id="width" type="number" min="1" max="300" required defaultValue={Constants.DefaultState.width}/>
                    height: <input id="height" type="number" min="1" max="300" required defaultValue={Constants.DefaultState.height}/>
                    mines: <input id="mines" type="number" min="0" required defaultValue={Constants.DefaultState.mines}/>
                    <Constants.ColorButton variant="contained" onClick={this.startGame}>
                        New Game
                    </Constants.ColorButton>
                </div>
                <div className={"error"}>
                    {errorMessage}
                </div>
            </div>
            <br/>
            <div className="board">
                <Board height={height} width={width} mines={mines} errorMessage={errorMessage} superman={superman} />
            </div>
        </div>
        )
    }

    // set the relevant error message for the user input (if exists) in the state
    setErrorMessage(height, width, mines) {
        if (height.length === 0 || width.length === 0 || mines.length === 0) {
            this.setState({errorMessage: Constants.ErrorMessage.emptyField});
        } else if ((height.length>0 && height<1) || (width.length>0 && width<1)) {
            this.setState({errorMessage: Constants.ErrorMessage.negativeValue});
        } else if ((height.length>0 && height>300) || (width.length>0 && width>300)) {
            this.setState({errorMessage: Constants.ErrorMessage.maxSize});
        } else if (mines.length>0 && mines<0) {
            this.setState({errorMessage: Constants.ErrorMessage.minesMin});
        } else if (mines.length>0 && mines>height*width) {
            this.setState({errorMessage: Constants.ErrorMessage.minesMax});
        } else {
            this.setState({errorMessage: Constants.ErrorMessage.noError});
        }
    }

    // will be called upon starting a new game
    startGame = () => {
        const height = document.getElementById("height").value;
        const width = document.getElementById("width").value;
        const mines = document.getElementById("mines").value;
        this.setErrorMessage(height, width, mines);
        this.setState({
            height: height,
            width: width,
            mines: mines,
            superman: document.getElementById("superman").checked
        });
    }
}
