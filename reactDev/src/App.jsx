// Importation du hook useState pour gérer l'état local du composant
import { useState } from 'react'
// Importation des logos (non utilisés ici, mais souvent pour affichage)
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// Importation du fichier de styles CSS
import './App.css'

// Composant Square : représente une case du jeu
// Il reçoit une valeur à afficher et une fonction à appeler lors du clic
function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Composant principal App
export default function App() {
  // Déclaration d'une variable d'état 'squares' (tableau de 9 cases)
  // 'setSquares' permet de modifier cette variable d'état
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }


  // Fonction appelée lorsqu'on clique sur une case
  function handleClick(i) {
     if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // On crée une copie du tableau d'état
    const nextSquares = squares.slice();
    // On modifie la case cliquée (ici, on met 'X')
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // Affichage du plateau de jeu (3 lignes de 3 cases)
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      {/* Deuxième ligne du plateau */}
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      {/* Troisième ligne du plateau */}
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}


