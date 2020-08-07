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
  document.getElementById('board').innerHTML = boardHTML
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', handleCardClick)
    card.addEventListener('contextmenu', handleCardClick)
    card.addEventListener('auxclick', handleCardClick)
  })
}

setupBoard('locomotive')
