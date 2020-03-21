import React from 'react';

export default class Cell extends React.Component {

    getValue(){
        return this.props.value.isRevealed || this.props.value.superman ? this.getCellContent() : CellContent.empty;
    }

    // get the value to display if the cell is revealed
    getCellContent = () => {
        if (this.props.value.isFlagged) {
            return CellContent.flag;
        } else if (this.props.value.isMine) {
            return CellContent.bomb;
        } else if (this.props.value.neighbour) {
            return CellContent.neighbourToString(this.props.value.neighbour);
        } else {
            return CellContent.empty;
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
export const CellContent = Object.freeze({
    bomb: "💣",
    flag: "🚩",
    neighbourToString: (nbr) => nbr.toString(),
    empty: null
});
