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

const game = () => {
  const board = initBoard(BOARDHEIGHT, BOARDWIDTH)
}

window.addEventListener('DOMContentLoaded', () => {
  game()
})
