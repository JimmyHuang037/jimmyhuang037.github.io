/**
 * Pollock Drip Canvas — ink splatter + dripping paint
 */
;(function() {
  'use strict'

  const canvas = document.getElementById('drip-canvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let w, h

  const drips = []
  const MAX_DRIPS = 30

  const colors = [
    'rgba(26,26,26,0.6)',
    'rgba(255,45,120,0.4)',
    'rgba(0,212,255,0.3)',
    'rgba(110,13,173,0.4)',
    'rgba(255,230,0,0.3)',
  ]

  function resize() {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
  }
  window.addEventListener('resize', resize)
  resize()

  class Drip {
    constructor() {
      this.x = Math.random() * w
      this.y = -20
      this.speed = Math.random() * 1.5 + 0.3
      this.size = Math.random() * 8 + 2
      this.color = colors[Math.floor(Math.random() * colors.length)]
      this.wobble = Math.random() * 2
      this.alive = true
    }

    update() {
      this.y += this.speed
      this.x += Math.sin(this.y * 0.02) * this.wobble * 0.3
      if (this.y > h + 20) this.alive = false
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()

      // Trail
      ctx.beginPath()
      ctx.moveTo(this.x, this.y - this.size)
      ctx.lineTo(this.x + Math.sin(this.y * 0.05) * 1.5, this.y - this.size - Math.random() * 40 - 10)
      ctx.strokeStyle = this.color
      ctx.lineWidth = this.size * 0.3
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }

  // Splatter burst at random intervals
  function createSplatter(cx, cy) {
    const count = Math.floor(Math.random() * 5) + 3
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * 40 + 5
      const drip = new Drip()
      drip.x = cx + Math.cos(angle) * dist
      drip.y = cy + Math.sin(angle) * dist
      drip.speed = Math.random() * 0.5 + 0.2
      drip.size = Math.random() * 3 + 1
      drips.push(drip)
    }
  }

  let frameCount = 0

  function draw() {
    frameCount++

    // Fade trail instead of full clear
    ctx.fillStyle = 'rgba(245,240,232,0.05)'
    ctx.fillRect(0, 0, w, h)

    // Add new drips periodically
    if (drips.length < MAX_DRIPS && Math.random() < 0.05) {
      const drip = new Drip()
      drip.x = Math.random() * w
      drips.push(drip)
    }

    // Random splatter
    if (frameCount % 300 === 0) {
      createSplatter(Math.random() * w, Math.random() * h * 0.3)
    }

    // Update & draw
    for (let i = drips.length - 1; i >= 0; i--) {
      drips[i].update()
      drips[i].draw()
      if (!drips[i].alive) drips.splice(i, 1)
    }

    requestAnimationFrame(draw)
  }

  draw()
})()