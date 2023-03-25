// app.js

const BOARDHEIGHT = 6
const BOARDWIDTH = 7

const initBoard = (height, width) => {
  const boardElt = document.querySelector('#board')

  const tableElt = document.createElement('table')
  boardElt.appendChild(tableElt)
  const board = []
  for (let i = 0; i < height; i++) {
    rowElt = document.createElement('tr')
    board.push([])
    for (let j = 0; j < width; j++) {
      cellElt = document.createElement('td')
      cellElt.className = 'empty'
      cellElt.dataset.column = j
      rowElt.appendChild(cellElt)
      board[i].push([])
      board[i][j] = cellElt
    }
    tableElt.appendChild(rowElt)
  }
  return board
}

const getLowestEmptyRowNumber = (board, columnNumber) => {
  if (board[0][columnNumber].className !== 'empty') {
    return -1 // Column is full
  }
  let i = 0
  while (i < BOARDHEIGHT - 1) {
    if (board[i + 1][columnNumber].className !== 'empty') {
      return i
    }
    i++
  }
  return i
}

const game = () => {
  const board = initBoard(BOARDHEIGHT, BOARDWIDTH)
  const maxNumberOfTurns = BOARDHEIGHT * BOARDWIDTH
  let turnCounter = 0
  let player = 'player1'

  document.querySelector('table').addEventListener('click', function (e) {
    const colNumber = parseInt(e.target.dataset.column, 10)
    if (!colNumber) {
      return //
    }
    const rowNumber = getLowestEmptyRowNumber(board, colNumber)
    if (rowNumber < 0) {
      return // Column is full
    }
    turnCounter++
    board[rowNumber][colNumber].className = player
    if (turnCounter >= maxNumberOfTurns) {
      return // Board is full
    }
    player = player === 'player1' ? 'player2' : 'player1'
    document.querySelector('#message').textContent = `${player} turn`
  })
}

window.addEventListener('DOMContentLoaded', () => {
  game()
})
