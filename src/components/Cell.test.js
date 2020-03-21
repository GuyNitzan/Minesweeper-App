import Cell from './Cell';
import React from 'react';
import renderer from 'react-test-renderer';

const cellData = {
    x: 2,
    y: 3,
    isMine: false,
    neighbour: 0,
    isRevealed: false,
    isEmpty: false,
    isFlagged: false,
    superman: false,
    isRed: false
}
const cellTestRenderer = renderer.create(
    <Cell value={cellData} />
);
const cellComponent = cellTestRenderer.getInstance();

test('Cell component Snapshot test', () => {
    let data = cellTestRenderer.toJSON();
    expect(data).toMatchSnapshot();
});

test('Cell not revealed test', () => {
    expect(cellComponent.getCellContent()).toBeNull();
});

test('Cell superman test', () => {
    cellComponent.props.value.isFlagged = true;
    cellComponent.props.value.superman = true;
    expect(cellComponent.getCellContent()).toBe("🚩");
    cellComponent.props.value.isFlagged = false;
    cellComponent.props.value.superman = false;
});

test('Cell neighbour test', () => {
    cellComponent.props.value.isRevealed = true;
    cellComponent.props.value.neighbour = 5;
    expect(cellComponent.getCellContent()).toBe("5");
    cellComponent.props.value.isRevealed = false;
});