import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className={props.highlight ? "square highlight" : "square"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true
  //   };
  // }

  renderSquare(i, highlight) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={highlight}
      />
    );
  }

  fillBoard() {
    let squares = [];
    let index = 0;
    let highlight;

    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        highlight = false;
        if (this.props.highlight.indexOf(index) !== -1) {
          highlight = true;
        }
        row.push(this.renderSquare(index++, highlight));
      }
      squares.push(<div className="board-row">{row}</div>);
    }

    return squares;
  }

  render() {
    return <div>{this.fillBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      descOrder: false
    };
  }

  handleClick(i) {
    const xIsNext = this.state.xIsNext;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = xIsNext ? "X" : "O";
    this.setState({
      history: history.concat({ squares }),
      xIsNext: !xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
    //event.target.style.border = "2px solid red";
  }

  handleOrderClick() {
    this.setState({
      descOrder: !this.state.descOrder
    });
  }

  render() {
    let history = this.state.history.slice();
    const current = history[this.state.stepNumber];

    const finishedGame = calculateWinner(current.squares);
    let status, highlight = [];

    if (finishedGame) {
      status = "Winner: " + finishedGame.winner;
      highlight = finishedGame.highlight;
    } else if (this.state.stepNumber < 9) {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    } else {
      status = "Results: DRAW!";
    }

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move # ${this.state.descOrder ? history.length - move : move}` : "Go to game start";
      return (
        <li key={this.state.descOrder ? history.length - move : move}>
          <button
            className={this.state.stepNumber === (this.state.descOrder ? history.length - move : move) ? "btn-active" : ""}
            onClick={() => this.jumpTo(this.state.descOrder && move !== 0 ? history.length - move : move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} highlight={highlight} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <span>Descending Order: </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={this.state.descOrder}
                onClick={() => this.handleOrderClick()}
              />
              <span className="slider round" />
            </label>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
      return {
        winner: squares[a],
        highlight: lines[i]
      };
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
