// Importation du hook useState pour gérer l'état local dans les composants React
import { useState } from 'react'
// Importation des logos (non utilisés ici, mais souvent pour affichage)
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// Importation du fichier de styles CSS
import './App.css'

// Composant Square : représente une case du jeu
// Props :
//   - value : ce qui s'affiche dans la case (X, O ou rien)
//   - onSquareClick : fonction appelée quand on clique sur la case
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
      return squares[a]; // retourne 'X' ou 'O' si gagnant
    }
  }
  return null; // pas de gagnant
}

// Composant principal App
// Composant Board : gère l'affichage du plateau et la logique de jeu pour chaque tour
// Props :
//   - xIsNext : booléen, indique si c'est au tour de X
//   - squares : tableau représentant l'état du plateau
//   - onPlay : fonction pour mettre à jour l'état dans le composant parent
function Board({ xIsNext, squares, onPlay }) {
  // Calcul du gagnant à partir du plateau actuel
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Fonction appelée lorsqu'on clique sur une case du plateau
  function handleClick(i) {
    // On ignore le clic si la case est déjà remplie ou si la partie est gagnée
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // Création d'une copie du plateau pour respecter l'immuabilité
    const nextSquares = squares.slice();
    // On modifie la case cliquée (ici, on met 'X' ou 'O')
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
  // On met à jour l'état via la fonction onPlay passée en prop
  onPlay(nextSquares);
  }

  // Affichage du plateau de jeu (3 lignes de 3 cases)
  return (
    <>
      {/* Affiche le statut du jeu (gagnant ou prochain joueur) */}
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

// Composant principal App : gère l'état global du jeu et l'historique des coups
export default function App() {
  // history : tableau contenant l'historique des plateaux
  // currentMove : index du coup actuellement affiché
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  // xIsNext : booléen, déduit du numéro du coup (pair = X, impair = O)
  const xIsNext = currentMove % 2 === 0;
  // currentSquares : plateau du coup courant
  const currentSquares = history[currentMove];

  // Fonction appelée quand un joueur joue un coup
  function handlePlay(nextSquares) {
    // On coupe l'historique si on revient en arrière et joue un nouveau coup
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Fonction pour revenir à un coup précédent
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Génération de la liste des boutons pour naviguer dans l'historique
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    // Chaque bouton permet de revenir à un état précédent du jeu
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Affichage principal du jeu : plateau + historique
  return (
    <div className="game">
      <div className="game-board">
        {/* Passage des props nécessaires au composant Board */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {/* Liste des coups joués pour naviguer dans l'historique */}
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
