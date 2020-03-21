import React from 'react';
import * as Constants from "../constants";

export default class Cell extends React.Component {

    getValue(){
        return this.props.value.isRevealed || this.props.value.superman ? this.getCellContent() : Constants.CellContent.empty;
    }

    // get the value to display if the cell is revealed
    getCellContent = () => {
        if (this.props.value.isFlagged) {
            return Constants.CellContent.flag;
        } else if (this.props.value.isMine) {
            return Constants.CellContent.bomb;
        } else if (this.props.value.neighbour) {
            return Constants.CellContent.neighbourToString(this.props.value.neighbour);
        } else {
            return Constants.CellContent.empty;
        }
    }

    render(){
        let className = "cell" +
            (this.props.value.isRed ? " redCell" : "") +
            (this.props.value.isRevealed && !this.props.value.isRed && !this.props.value.isFlagged ? " revealed" : "");
        return (
            <div onClick={this.props.onClick} className={className}>
                {this.getValue()}
            </div>
        );
    }
}
