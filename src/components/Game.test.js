import Game, {DefaultState, ErrorMessage} from './Game';
import React from 'react';
import renderer from 'react-test-renderer';

const gameTestRenderer = renderer.create(
    <Game />
);
const gameComponent = gameTestRenderer.getInstance();

test('Game component Snapshot test', () => {
    let data = gameTestRenderer.toJSON();
    expect(data).toMatchSnapshot();
});

test('Game component state error message test', () => {
    gameComponent.setErrorMessage(gameComponent.state.height, gameComponent.state.width, gameComponent.state.mines);
    expect(gameComponent.state.errorMessage).toBe(ErrorMessage.noError);
});