import React from 'react'
import Board from './Board'
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from "@material-ui/core/styles/withStyles";
import green from "@material-ui/core/colors/green";
import Button from '@material-ui/core/Button';

export default class Game extends React.Component {
    state = {
        height: DefaultState.height,
        width: DefaultState.width,
        mines: DefaultState.mines,
        errorMessage: ErrorMessage.noError,
        superman: false
    };

    render () {
        const { height, width, mines, errorMessage, superman } = this.state;
        return (
        <div>
            <div>
                <div>
                    Superman<GreenCheckbox id="superman"/>
                </div>
                <div>
                    width: <input id="width" type="number" min="1" max="300" required defaultValue={DefaultState.width}/>
                    height: <input id="height" type="number" min="1" max="300" required defaultValue={DefaultState.height}/>
                    mines: <input id="mines" type="number" min="0" required defaultValue={DefaultState.mines}/>
                    <ColorButton variant="contained" onClick={this.startGame}>
                        New Game
                    </ColorButton>
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
            this.setState({errorMessage: ErrorMessage.emptyField});
        } else if ((height.length>0 && height<1) || (width.length>0 && width<1)) {
            this.setState({errorMessage: ErrorMessage.negativeValue});
        } else if ((height.length>0 && height>300) || (width.length>0 && width>300)) {
            this.setState({errorMessage: ErrorMessage.maxSize});
        } else if (mines.length>0 && mines<0) {
            this.setState({errorMessage: ErrorMessage.minesMin});
        } else if (mines.length>0 && mines>height*width) {
            this.setState({errorMessage: ErrorMessage.minesMax});
        } else {
            this.setState({errorMessage: ErrorMessage.noError});
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

export const DefaultState = Object.freeze({
    height: 8,
    width:8,
    mines: 10
});

export const ErrorMessage = Object.freeze({
    negativeValue: "Board height and width must have non-negative values",
    maxSize: "Board height and width cannot be bigger than 300",
    minesMax: "Mines amount cannot be bigger than height * width",
    minesMin: "Mines amount cannot be a negative number",
    emptyField: "All fields must be non-empty",
    noError: ""
});

export const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[500],
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

const ColorButton = withStyles(theme => ({
    root: {
        color: theme.palette.getContrastText(green[900]),
        backgroundColor: green[800],
        '&:hover': {
            backgroundColor: green[600],
        },
    },
}))(Button);