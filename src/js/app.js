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

const isWinner = (board, player, x, y) => {
  let i = x
  let j = y

  // count column
  let countColumn = 1
  while (j < BOARDHEIGHT - 1 && board[j + 1][x].className === player) {
    countColumn++
    j++
  }
  if (countColumn === 4) {
    return true
  }

  // count row
  let countRow = 1
  let countRowLeft = 0
  let countRowRight = 0
  while (i > 0 && board[y][i - 1].className === player) {
    countRowLeft++
    i--
  }
  i = x
  while (i < BOARDWIDTH - 1 && board[y][i + 1].className === player) {
    countRowRight++
    i++
  }
  countRow += countRowLeft + countRowRight
  if (countRow === 4) {
    return true
  }

  //count diagonal
  let countDiag1 = 1
  let countDiagUpLeft = 0
  i = x
  j = y
  while (j > 0 && i > 0 && board[j - 1][i - 1].className === player) {
    countDiagUpLeft++
    i--
    j--
  }
  let countDiagDownRight = 0
  i = x
  j = y
  while (
    j < BOARDHEIGHT - 1 &&
    i < BOARDWIDTH - 1 &&
    board[j + 1][i + 1].className === player
  ) {
    countDiagDownRight++
    i++
    j++
  }
  countDiag1 += countDiagUpLeft + countDiagDownRight
  if (countDiag1 === 4) {
    return true
  }

  let countDiag2 = 1
  let countDiagDownLeft = 0
  i = x
  j = y
  while (
    j < BOARDHEIGHT - 1 &&
    i > 0 &&
    board[j + 1][i - 1].className === player
  ) {
    countDiagDownLeft++
    i--
    j++
  }
  let countDiagUpRight = 0
  i = x
  j = y
  while (
    j > 0 &&
    i < BOARDWIDTH - 1 &&
    board[j - 1][i + 1].className === player
  ) {
    countDiagUpRight++
    i++
    j--
  }
  countDiag2 += countDiagDownLeft + countDiagUpRight
  if (countDiag2 === 4) {
    return true
  }

  return false
}

const drop = async (board, player, rowNumber, colNumber, currentRow) => {
  board[currentRow][colNumber].className = player
  if (currentRow < rowNumber) {
    await new Promise((resolve) => {
      setTimeout(() => {
        board[currentRow][colNumber].className = 'empty'
        drop(board, player, rowNumber, colNumber, currentRow + 1).then(resolve)
      }, 40)
    })
  }
}

const game = () => {
  const board = initBoard(BOARDHEIGHT, BOARDWIDTH)
  const maxNumberOfTurns = BOARDHEIGHT * BOARDWIDTH
  let turnCounter = 0
  let player = 'player1'
  let gameOver = false
  let playing = false

  document.querySelector('table').addEventListener('click', async function (e) {
    if (gameOver) {
      return
    }
    if (undefined === e.target.dataset.column) {
      return // Click on table but not td
    }
    const colNumber = parseInt(e.target.dataset.column, 10)
    const rowNumber = getLowestEmptyRowNumber(board, colNumber)
    if (rowNumber < 0) {
      return // Column is full
    }
    if (playing) {
      return
    }
    playing = true
    turnCounter++
    await drop(board, player, rowNumber, colNumber, 0)
    if (isWinner(board, player, colNumber, rowNumber)) {
      document.querySelector('#message').textContent = `${player} has won!`
      gameOver = true
      return
    }
    if (turnCounter >= maxNumberOfTurns) {
      document.querySelector('#message').textContent = `It's a draw game!`
      gameOver = true
      return
    }
    player = player === 'player1' ? 'player2' : 'player1'
    document.querySelector('#message').textContent = `${player} turn`
    playing = false
  })
}

window.addEventListener('DOMContentLoaded', () => {
  game()
})
