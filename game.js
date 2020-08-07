const handleCardClick = event => {
  event.preventDefault()

  const cardClicked = event.composedPath().find(element => (
    [...element.classList].includes('card'))
  )

  if (!cardClicked.disabled) {
    cardClicked.disabled = true

    const currentRotation = cardClicked.dataset.rotation
    const newRotation = `${Number(currentRotation) + 1}`

    cardClicked.dataset.rotation = newRotation

    const imageFragment = cardClicked.querySelector('.imageFragment')
    if (newRotation === "4") {
      cardClicked.addEventListener('transitionend', () => {
        imageFragment.style.transitionDuration = "0s"
        requestAnimationFrame(() => {
          cardClicked.dataset.rotation = "0"
          requestAnimationFrame(() => {
            imageFragment.style.transitionDuration = ""
          })
        })
      }, {once: true})
    }

    cardClicked.addEventListener('transitionend', () => {
      cardClicked.disabled = false
    }, {once: true})
  }
}

const setupBoard = (puzzle, size = 4) => {
  const board = document.getElementById('board')
  const getRandomRotation = () => Math.floor(Math.random() * 4)
  const renderCard = (x, y) => `
    <button
      class="card"
      data-rotation="${getRandomRotation()}"
      style="
        width: ${(80 / size)}vmin;
        height: ${(80 / size)}vmin;
      "
    >
      <div
        class="imageFragment"
        style="
          background-image: url('./assets/puzzles/${puzzle}.jpg');
          background-position: ${y * (100 / size)}% ${x * (100 / size)}%;
          background-size: ${(size + 1) * 100}% ${(size + 1) * 100}%;
        "
      ></div>
    </button>
  `
  const renderRow = children => `
    <div class="row">${children}</div>
  `
  const indices = Array.from(Array(size).keys())
  const boardHTML = indices.map(rowIndex => (
    renderRow(
      indices.map(columnIndex => (
        renderCard(rowIndex, columnIndex)
      )).join('')
    )
  )).join('')
  document.getElementById('board').innerHTML = boardHTML
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', handleCardClick)
    card.addEventListener('contextmenu', handleCardClick)
    card.addEventListener('auxclick', handleCardClick)
  })
}

setupBoard('locomotive', 4)
