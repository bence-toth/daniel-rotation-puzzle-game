const setupBoard = puzzle => {
  const board = document.getElementById('board')
  const getRandomRotation = () => Math.floor(Math.random() * 4)
  const renderCard = (x, y) => `
    <button
      class="card"
      data-rotation="${getRandomRotation()}"
    >
      <div
        class="imageFragment"
        style="
          background-image: url('./assets/puzzles/${puzzle}.jpg');
          background-position: ${y * 25}% ${x * 25}%;
        "
      ></div>
    </button>
  `
  const renderRow = children => `
    <div class="row">${children}</div>
  `
  const boardHTML = [0, 1, 2, 3].map(rowIndex => (
    renderRow(
      [0, 1, 2, 3].map(columnIndex => (
        renderCard(rowIndex, columnIndex)
      )).join('')
    )
  )).join('')
  console.log({boardHTML, board, ih: board.innerHTML})
  document.getElementById('board').innerHTML = boardHTML
  console.log({boardHTML, board, ih: board.innerHTML})
}

setupBoard('locomotive')
