const getRandomElementFromArray = array => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

const voiceFiles = {
  flip: [
    'flip'
  ],
  applause: [
    'wow1', 'wow2', 'wow3', 'wow4', 'wow5',
    'woo-hoo1', 'woo-hoo2', 'woo-hoo3', 'woo-hoo4',
  ]
}

const playSound = (type = 'applause') => {
  const voiceFile = getRandomElementFromArray(voiceFiles[type])
  const audio = new Audio(`./assets/sound/${voiceFile}.mp3`)
  audio.play()
}

const playMusic = () => {
  const musicFile = './assets/music/music.mp3'
  const audio = new Audio(musicFile)
  audio.volume = 0.35
  audio.loop = true
  audio.play()
}

const handleCardClick = event => {
  event.preventDefault()

  const cardClicked = event.composedPath().find(element => (
    [...element.classList].includes('card'))
  )

  if (!cardClicked.disabled) {
    cardClicked.disabled = true
    playSound('flip')

    const currentRotation = cardClicked.dataset.rotation
    const newRotation = `${Number(currentRotation) + 1}`

    cardClicked.dataset.rotation = newRotation

    if (newRotation === "4") {
      const imageFragment = cardClicked.querySelector('.imageFragment')
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

    const allCards = [...document.querySelectorAll('.card')]
    const isPuzzleComplete = allCards.every(card => ["0", "4"].includes(card.dataset.rotation))
    if (isPuzzleComplete) {
      allCards.forEach(card => card.disabled = true)
      setTimeout(playSound, 1000)
      setTimeout(() => {
        currentPuzzleIndex += 1
        if (currentPuzzleIndex === puzzles.length) {
          currentPuzzleIndex = 0
        }
        setupBoard(puzzles[currentPuzzleIndex], 3)
      }, 3000)
    }
    else {
      cardClicked.addEventListener('transitionend', () => {
        cardClicked.disabled = false
      }, {once: true})
    }
  }
}

const setupBoard = (puzzle, size = 4) => {
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
          background-image: url('./assets/puzzles/${puzzle}.webp');
          background-position: ${y * (100 / (size - 1))}% ${x * (100 / (size - 1))}%;
          background-size: ${(size) * 100}% ${(size) * 100}%;
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

const puzzles = [
  'balloons',
  'cake-slice',
  'candles',
  'blue-balloons',
  'cake',
  'flag',
  'party-hats',
  'cupcakes',
  'presents',
  'toy'
]

let currentPuzzleIndex = Math.floor(Math.random() * puzzles.length)

setupBoard(puzzles[currentPuzzleIndex], 3)

document.addEventListener('click', playMusic, {once: true})
