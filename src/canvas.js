import utils from './utils'
import DATA from './data'
import Entity from './Entity'

const canvas = document.querySelector('canvas')
const canvasSun = document.getElementById('sun')
const canvasForeground = document.getElementById('foreground')
const canvasClouds = document.getElementById('clouds')
const ctx = canvas.getContext('2d')
const ctxF = canvasForeground.getContext('2d')
const ctxC = canvasClouds.getContext('2d')
const ctxS = canvasSun.getContext('2d')

let width = window.innerWidth
let height = window.innerHeight
let originX = 0
let originY = 0
let hills = []
let sun = {
  pos: getQuadraticBezierXYatPercent(
    {
      x: 0,
      y: canvas.height - 100
    },
    {
      x: canvas.width / 2,
      y: canvas.height / 2
    },
    {
      x: canvas.width,
      y: canvas.height - 100
    },
    -0.1),
  percent: -0.1
}

const mouse = {
  x: width / 2,
  y: height / 2
}

function setSize () {
  width = window.innerWidth
  height = window.innerHeight

  canvas.width = width
  canvas.height = height
  canvasSun.width = width
  canvasSun.height = height
  canvasForeground.width = width
  canvasForeground.height = height
  canvasClouds.width = width
  canvasClouds.height = height

  originX = 0
  originY = canvas.height

  sun = createSun(0, originY, canvas.width / 2, originY - (canvas.height /2), canvas.width)
  drawGrass(0, (originY) - 30, canvas.width, 30)
  clouds = createClouds(0, originY)
  mountains = createMountains(0, originY)
  trees = createTrees(0, originY)
  // hills = createHills(0, originY)

  drawMountains()
  drawHills(ctxF)
  drawTrees()
}

function createClouds (x, y) {
  let arr = []
  let len = utils.randomInt(5, 30)

  for (let i = 0; i < len; i += 1) {
    let r = utils.randomInt(DATA.cloudColours.length - 1)
    arr.push(new Entity.Entity({
      x: utils.randomInt(-10, canvas.width),
      y: utils.randomInt(y - 150, y - 300),
      vx: utils.randomInt(1, 3),
      c: DATA.cloudColours[r],
      w: utils.randomInt(30, 160)
    }))
  }

  return arr
}

function createHills (x, y) {
  let arr = []
  let len = utils.randomInt(10, 50)

  for (let i = 0; i < len; i += 1) {
    let rX = utils.randomInt(0, canvas.width)
    let c = DATA.hillColours[utils.randomInt(DATA.hillColours.length - 1)]
    arr.push(new Entity.Entity({
      x: rX,
      y: y - 30,
      w: utils.randomInt(30, 110),
      c: c
    }))
  }

  return arr
}

function createMountains (_x, y) {
  let arr = []
  let x = -30

  let len = utils.randomInt(4, 30)
  for (let i = 0; i < len; i += 1) {
    arr.push(new Entity.Entity({
      x: x,
      y: y - 30,
      w: utils.randomInt(100, 270)
    }))
    let r = utils.randomInt(150, 180)
    x += r
  }

  return arr
}

function createSun (x, y, x1, x2, w) {
  return {
    pos: getQuadraticBezierXYatPercent(
      {
        x: 0,
        y: y - 100
      },
      {
        x: x1,
        y: x2},
      {
        x: w,
        y: y - 100
      },
      -0.1),
    percent: -0.1
  }
}

function createTrees (x, y) {
  let arr = []
  let len = utils.randomInt(20, 65)

  for (let i = 0; i < len; i += 1) {
    let r = utils.randomInt(DATA.trees.length - 1)

    arr.push(new Entity.Entity({
      x: utils.randomInt(0, canvas.width),
      y: y - 30,
      w: utils.randomInt(8, 20),
      name: DATA.trees[r]
    }))
  }

  return arr
}

function setupEventListeners () {
  // document.addEventListener('mousemove', (e) => {
  //   mouse.x = e.clientX
  //   mouse.y = e.clientY
  // })

  document.addEventListener('resize', () => {
    init()
  })
}

setupEventListeners()

function init () {
  setSize()
}

let clouds = []
let mountains = []
let trees = []

function randomiseCloud (cloud, x, y) {
  let r = utils.randomInt(DATA.cloudColours.length - 1)
  cloud.x = 0 - 300
  cloud.y = utils.randomInt(y - 150, y - 300)
  cloud.vx = utils.randomInt(1, 3)
  cloud.c = DATA.cloudColours[r]
  cloud.w = utils.randomInt(30, 160)
}

function moveClouds () {
  clouds.forEach((cloud) => {
    cloud.x += cloud.vx

    if (cloud.x - 12 > canvas.width) {
      randomiseCloud(cloud, 0, originY)
    }
  })
}

function getQuadraticBezierXYatPercent (startPt, controlPt, endPt, percent) {
  var x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x
  var y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y

  return {
    x: x,
    y: y
  }
}

function drawClouds () {
  clouds.forEach((cloud) => {
    drawCloud(ctxC, cloud)
  })
}

function drawMountains () {
  mountains.forEach((mountain) => {
    drawMountain(ctxF, mountain.x, mountain.y, mountain.w)
  })
}

function drawTrees () {
  trees = trees || []
  trees.forEach((tree) => {
    switch (tree.name) {
      case 'pine':
        drawPineTree(tree.x, tree.y, tree.w)
        break
      case 'cherryblossom':
        // drawTree(tree.x, tree.y, false, 60)
        drawTree(tree.x, tree.y)
        break
      default:
        console.log('unknown tree nane')
        break
    }
  })
}

function moveSun (x, y, x1, y1, w) {
  sun.percent += 0.001
  if (sun.percent > 1.1) {
    sun.percent = -0.1
  }
  sun.pos = getQuadraticBezierXYatPercent(
    {
      x: 0,
      y: y - 100
    },
    {
      x: x1,
      y: y1
    },
    {
      x: w,
      y: y - 100
    },
    sun.percent)
}

function drawSunArc () {
  ctx.beginPath()
  ctx.moveTo(0, canvas.height - 100)
  ctx.quadraticCurveTo(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height - 100)
  ctx.stroke()
}

function animate () {
  requestAnimationFrame(animate)
  moveClouds()
  moveSun(0, originY, canvas.width / 2, originY - (canvas.height / 2), canvas.width)

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctxC.clearRect(0, 0, canvas.width, canvas.height)
  ctxS.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#88c2e7'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  drawSun(sun.pos.x, sun.pos.y, 50)

  drawClouds()
  // drawSunArc()
}

init()
animate()

function drawSun (x, y, r) {
  ctxS.fillStyle = '#ed433d'
  circle(ctxS, x, y, r)
}

function drawGrass (x, y, w, h) {
  ctxF.beginPath()
  ctxF.fillStyle = '#6b9335'
  ctxF.fillRect(x, y, w, h)
}

function circle (_ctx, x, y, r) {
  _ctx.beginPath()
  _ctx.arc(x, y, r, 0, 2 * Math.PI)
  _ctx.fill()
  _ctx.closePath()
}

function drawTree (x, y, mirrorX, mirrorY) {
  // background leaves
  ctxF.fillStyle = '#fb75cc'
  circle(ctxF, x - 15, y - 16, 6)
  circle(ctxF, x - 5, y - 16, 6)
  circle(ctxF, x + 10, y - 18, 8)

  if (mirrorY) {
    circle(ctxF, x - 15, y + mirrorY + 16, 6)
    circle(ctxF, x - 5, y + mirrorY + 16, 6)
    circle(ctxF, x + 10, y + mirrorY + 18, 8)
  }

  // mid leaves
  ctxF.fillStyle = '#f8cce7'
  circle(ctxF, x - 18, y - 33, 10)
  circle(ctxF, x, y - 38, 10)
  circle(ctxF, x + 10, y - 35, 9)
  circle(ctxF, x + 20, y - 30, 7)
  circle(ctxF, x + 25, y - 24, 8)

  if (mirrorY) {
    circle(ctxF, x - 18, y + mirrorY + 33, 10)
    circle(ctxF, x, y + mirrorY + 38, 10)
    circle(ctxF, x + 10, y + mirrorY + 35, 9)
    circle(ctxF, x + 20, y + mirrorY + 30, 7)
    circle(ctxF, x + 25, y + mirrorY + 24, 8)
  }

  // trunk
  ctxF.beginPath()
  ctxF.moveTo(x, y)
  ctxF.lineTo(x + 2, y - 10)
  ctxF.lineTo(x, y - 15)
  ctxF.lineTo(x - 8, y - 13)
  ctxF.lineTo(x - 16, y - 15)
  ctxF.lineTo(x - 16, y - 18)
  ctxF.lineTo(x - 8, y - 16)
  ctxF.lineTo(x, y - 18)
  ctxF.lineTo(x + 4, y - 15)
  ctxF.lineTo(x + 8, y - 20)
  ctxF.lineTo(x + 11, y - 20)
  ctxF.lineTo(x + 8, y - 15)
  ctxF.lineTo(x + 9, y - 10)
  ctxF.lineTo(x + 7, y)
  ctxF.lineTo(x, y)
  ctxF.fillStyle = '#31170a'
  ctxF.fill()
  ctxF.closePath()

  // front leaves
  ctxF.fillStyle = '#fce0f2'
  circle(ctxF, x - 24, y - 22, 7)
  circle(ctxF, x - 14, y - 30, 8)
  circle(ctxF, x - 3, y - 26, 9)
  circle(ctxF, x + 12, y - 29, 7)
  circle(ctxF, x + 20, y - 23, 8)

  if (mirrorY) {
    circle(ctxF, x - 24, y + mirrorY + 22, 7)
    circle(ctxF, x - 14, y + mirrorY + 30, 8)
    circle(ctxF, x - 3, y + mirrorY + 26, 9)
    circle(ctxF, x + 12, y + mirrorY + 29, 7)
    circle(ctxF, x + 20, y + mirrorY + 23, 8)
  }
}

function drawHills (_ctx) {
  hills = hills || []

  hills.forEach((hill) => {
    drawHill(_ctx, hill)
  })
}

function drawHill (_ctx, hill) {
  _ctx.beginPath()
  _ctx.arc(hill.x, hill.y, hill.w / 2, Math.PI, 0, false)
  _ctx.closePath()
  _ctx.fillStyle = hill.c
  _ctx.fill()
}

function drawCloud (_ctx, cloud) {
  let x = cloud.x
  let y = cloud.y
  let c = cloud.c
  let w = cloud.w
  _ctx.beginPath()
  _ctx.moveTo(x, y)
  _ctx.lineTo(x + w, y)
  _ctx.quadraticCurveTo(x + (w + 12), y - 6, x + w, y - 16)

  _ctx.lineTo(x, y - 16)
  _ctx.quadraticCurveTo(x - 12, y - 6, x, y)
  _ctx.fillStyle = c
  _ctx.fill()
  _ctx.closePath()
}

function drawPineTree (x, y, w) {
  // draw trunk
  ctxF.beginPath()
  ctxF.fillStyle = '#31170a'
  ctxF.moveTo(x + (w / 2 - 1), y)
  ctxF.lineTo(x + (w / 2 + 1), y)
  ctxF.lineTo(x + (w / 2 + 1), y - 5)
  ctxF.lineTo(x + (w / 2 - 1), y - 5)
  ctxF.lineTo(x + (w / 2 - 1), y)
  ctxF.fill()
  ctxF.closePath()

  // draw leaves
  ctxF.beginPath()
  ctxF.fillStyle = '#0b5e0e'
  ctxF.moveTo(x, y - 5)
  ctxF.lineTo(x + w, y - 5)
  ctxF.lineTo(x + w / 2, y - (w * 2.5))
  ctxF.lineTo(x, y - 5)
  ctxF.fill()
  ctxF.closePath()
}

function drawMountain (_ctx, x, y, w) {
  // base
  _ctx.beginPath()
  _ctx.moveTo(x, y)
  _ctx.lineTo(x + (w * 0.41), y - (w * 0.58))
  _ctx.lineTo(x + (w * 0.58), y - (w * 0.57))
  _ctx.lineTo(x + (w * 0.64), y - (w * 0.6))
  _ctx.lineTo(x + w, y)
  _ctx.lineTo(x, y)
  _ctx.fillStyle = '#c2c6e7'
  _ctx.fill()
  _ctx.closePath()

  // shadow
  _ctx.beginPath()
  _ctx.moveTo(x, y)
  _ctx.lineTo(x + (w * 0.41), y - (w * 0.58))
  _ctx.lineTo(x + (w * 0.52), y - (w * 0.57))
  _ctx.lineTo(x + (w * 0.29), y)
  _ctx.lineTo(x, y)
  _ctx.fillStyle = '#a3a5cf'
  _ctx.fill()
  _ctx.closePath()

  // snow cap
  _ctx.beginPath()
  _ctx.moveTo(x + (w * 0.28), y - (w * 0.41))
  _ctx.lineTo(x + (w * 0.41), y - (w * 0.59))
  _ctx.lineTo(x + (w * 0.58), y - (w * 0.57))
  _ctx.lineTo(x + (w * 0.64), y - (w * 0.60))
  _ctx.lineTo(x + (w * 0.72), y - (w * 0.46))
  _ctx.lineTo(x + (w * 0.64), y - (w * 0.41))
  _ctx.lineTo(x + (w * 0.58), y - (w * 0.44))
  _ctx.lineTo(x + (w * 0.54), y - (w * 0.42))
  _ctx.lineTo(x + (w * 0.50), y - (w * 0.41))
  _ctx.lineTo(x + (w * 0.41), y - (w * 0.45))
  _ctx.lineTo(x + (w * 0.28), y - (w * 0.41))
  _ctx.fillStyle = '#fff'
  _ctx.fill()
  _ctx.closePath()
}

// function drawMountain (_ctx, x, y) {
//   // base
//   _ctx.beginPath()
//   _ctx.moveTo(x, y)
//   _ctx.lineTo(x + 70, y - 100)
//   _ctx.lineTo(x + 100, y - 97)
//   _ctx.lineTo(x + 110, y - 102)
//   _ctx.lineTo(x + 170, y)
//   _ctx.lineTo(x, y)
//   _ctx.fillStyle = '#c2c6e7'
//   _ctx.fill()
//   _ctx.closePath()

//   // shadow
//   _ctx.beginPath()
//   _ctx.moveTo(x, y)
//   _ctx.lineTo(x + 70, y - 100)
//   _ctx.lineTo(x + 90, y - 97)
//   _ctx.lineTo(x + 50, y)
//   _ctx.lineTo(x, y)
//   _ctx.fillStyle = '#a3a5cf'
//   _ctx.fill()
//   _ctx.closePath()

//   // snow cap

//   _ctx.beginPath()
//   _ctx.moveTo(x + 48, y - 70)
//   _ctx.lineTo(x + 70, y - 101)
//   _ctx.lineTo(x + 100, y - 98)
//   _ctx.lineTo(x + 110, y - 103)
//   _ctx.lineTo(x + 124, y - 79)
//   _ctx.lineTo(x + 110, y - 70)
//   _ctx.lineTo(x + 100, y - 75)
//   _ctx.lineTo(x + 92, y - 73)
//   _ctx.lineTo(x + 86, y - 70)
//   _ctx.lineTo(x + 70, y - 77)
//   _ctx.lineTo(x + 49, y - 70)
//   _ctx.fillStyle = '#fff'
//   _ctx.fill()
//   _ctx.closePath()
// }
