// app.js

const BOARDHEIGHT = 6
const BOARDWIDTH = 7

const initBoard = (height, width) => {
  const boardElt = document.querySelector('#board')

  const tableElt = document.createElement('table')
  boardElt.appendChild(tableElt)
  const board = Array.from({ length: height }, () => [])
  for (let i = 0; i < height; i++) {
    const rowElt = document.createElement('tr')
    board.push([])
    for (let j = 0; j < width; j++) {
      const cellElt = document.createElement('td')
      cellElt.className = 'empty'
      cellElt.dataset.column = j
      rowElt.appendChild(cellElt)
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
  const countCells = (j, i, dj, di) => {
    let count = 0

    while (
      j >= 0 &&
      j < BOARDHEIGHT &&
      i >= 0 &&
      i < BOARDWIDTH &&
      board[j][i].className === player
    ) {
      count++
      j += dj
      i += di
    }

    return count
  }

  const countColumn = countCells(y + 1, x, 1, 0) + 1
  const countRow = countCells(y, x - 1, 0, -1) + countCells(y, x + 1, 0, 1) + 1
  const countDiagonal1 =
    countCells(y - 1, x - 1, -1, -1) + countCells(y + 1, x + 1, 1, 1) + 1
  const countDiagonal2 =
    countCells(y + 1, x - 1, 1, -1) + countCells(y - 1, x + 1, -1, 1) + 1

  return (
    countColumn >= 4 ||
    countRow >= 4 ||
    countDiagonal1 >= 4 ||
    countDiagonal2 >= 4
  )
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
  let blockedInput = false

  document.querySelector('table').addEventListener('click', async function (e) {
    if (gameOver || undefined === e.target.dataset.column || blockedInput) {
      return
    }
    const colNumber = parseInt(e.target.dataset.column, 10)
    const rowNumber = getLowestEmptyRowNumber(board, colNumber)
    if (rowNumber < 0) {
      return // Column is full
    }
    blockedInput = true
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
    blockedInput = false
  })
}

window.addEventListener('DOMContentLoaded', () => {
  game()
})
