import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import "./TicTacToe.css";
import FancyButton from "../small/FancyButton";

/* 
  Esta tarea consiste en hacer que el juego funcione, para lograr eso deben completar el componente 
  TicTacToe y el custom hook `useTicTacToeGameState`, que como ven solamente define algunas variables.

  Para completar esta tarea, es requisito que la FIRMA del hook no cambie.
  La firma de una función consiste en los argumentos que recibe y el resultado que devuelve.
  Es decir, este hook debe recibir el argumento initialPlayer y debe devolver un objeto con las siguientes propiedades:
  {
    tiles: // un array de longitud 9 que representa el estado del tablero (es longitud 9 porque el tablero es 3x3)
    currentPlayer: // un string que representa el jugador actual ('X' o 'O')
    winner: // el ganador del partido, en caso que haya uno. si no existe, debe ser `null`
    gameEnded: // un booleano que representa si el juego terminó o no
    setTileTo: // una función que se ejecutará en cada click
    restart: // una función que vuelve a setear el estado original del juego
  }

  Verán que los diferentes componentes utilizados están completados y llevan sus propios propTypes
  Esto les dará algunas pistas
*/

const Square = ({ value, onClick = () => { } }) => {
  return (
    <div onClick={onClick} className="square">
      {value}
    </div>
  );
};
Square.propTypes = {
  value: PropTypes.oneOf(["X", "O", ""]),
  onClick: PropTypes.func,
};

const WinnerCard = ({ show, winner, onRestart = () => { } }) => {
  return (
    <div className={cx("winner-card", { "winner-card--hidden": !show })}>
      <span className="winner-card-text">{winner ? `Player ${winner} has won the game!` : "It's a tie!"}</span>
      <FancyButton onClick={onRestart}>Play again?</FancyButton>
    </div>
  );
};

WinnerCard.propTypes = {
  // Esta propiedad decide si el componente se muestra o está oculto
  // También se podría mostrar el componente usando un if (&&), pero usamos esta prop para mostrar los estilos correctamente.
  show: PropTypes.bool.isRequired,
  winner: PropTypes.oneOf(["X", "O"]),
  onRestart: PropTypes.func,
};

const getWinner = tiles => {
  const row1 = tiles.slice(0, 3);
  const row2 = tiles.slice(3, 6);
  const row3 = tiles.slice(6, 9);

  const col1 = [tiles[0], tiles[3], tiles[6]];
  const col2 = [tiles[1], tiles[4], tiles[7]];
  const col3 = [tiles[2], tiles[5], tiles[8]];

  const diag1 = [tiles[0], tiles[4], tiles[8]];
  const diag2 = [tiles[2], tiles[4], tiles[6]];

  const sections = [row1, row2, row3, col1, col2, col3, diag1, diag2];

  const result = sections
    .flatMap(section => (section.every(cell => cell === section[0]) ? section[0] : null))
    .reduce((acc, value) => value || acc, null);

  // calcular el ganador del partido a partir del estado del tablero
  // (existen varias formas de calcular esto, una posible es listar todos los
  // casos en los que un jugador gana y ver si alguno sucede)
  return result;
};

const useTicTacToeGameState = initialPlayer => {
  const initialTiles = Array.from({ length: 9 }, n => null);

  const [tiles, setTiles] = useState(initialTiles);
  const [currentPlayer, setCurrentPlayer] = useState(initialPlayer);
  const winner = getWinner(tiles);
  const gameEnded = !tiles.includes(null) || winner !== null;

  useEffect(() => {
    const changePLayer = () => {
      currentPlayer === "X" ? setCurrentPlayer("O") : setCurrentPlayer("X");
    };
    changePLayer();
  }, [tiles]);

  const setTileTo = tileIndex => {
    if (tiles[tileIndex] !== null) {
      return;
    }

    setTiles(prevTiles => prevTiles.map((tile, index) => (index === tileIndex ? currentPlayer : tile)));
    // convertir el tile en la posición tileIndex al jugador seleccionado
    // ejemplo: setTileTo(0, 'X') -> convierte la primera casilla en 'X'
  };
  const restart = () => {
    setTiles(initialTiles);
    // Reiniciar el juego a su estado inicial
  };

  // por si no reconocen esta sintáxis, es solamente una forma más corta de escribir:
  // { tiles: tiles, currentPlayer: currentPlayer, ...}
  return { tiles, currentPlayer, winner, gameEnded, setTileTo, restart };
};

const TicTacToe = () => {
  const { tiles, currentPlayer, winner, gameEnded, setTileTo, restart } = useTicTacToeGameState("X");
  return (
    <div className="tictactoe">
      <div className="board">
        {tiles.map((tile, index) => (
          <Square key={index} value={tile} onClick={() => setTileTo(index)} />
        ))}
      </div>
      <WinnerCard show={gameEnded} winner={winner} onRestart={restart} />
    </div>
  );
};
export default TicTacToe;
