import withStyles from "@material-ui/core/styles/withStyles";
import green from "@material-ui/core/colors/green";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import React from "react";

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

export const ColorButton = withStyles(theme => ({
    root: {
        color: theme.palette.getContrastText(green[900]),
        backgroundColor: green[800],
        '&:hover': {
            backgroundColor: green[600],
        },
    },
}))(Button);

export const GameStatus = Object.freeze({"win":"You Win!", "lose":"You Lose!", "ongoing":" "});

export const CellContent = Object.freeze({
    bomb: "💣",
    flag: "🚩",
    neighbourToString: (nbr) => nbr.toString(),
    empty: null
});