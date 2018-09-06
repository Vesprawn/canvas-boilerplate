import utils from './utils'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let width = window.innerWidth
let height = window.innerHeight

const mouse = {
  x: width / 2,
  y: height / 2
}

function setSize () {
  width = window.innerWidth
  height = window.innerHeight

  canvas.width = width
  canvas.height = height
}

function setupEventListeners () {
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  document.addEventListener('resize', () => {
    init()
  })
}

setupEventListeners()

function init () {
  setSize()
}

function animate () {
  requestAnimationFrame(animate)

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y)
}

init()
animate()

