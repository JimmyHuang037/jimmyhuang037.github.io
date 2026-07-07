/**
 * Glitch Art Canvas — RGB split + scanline + displacement
 * Inspired by Spider-Verse portal effects
 */
;(function() {
  'use strict'

  const canvas = document.getElementById('glitch-canvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let w, h, time = 0

  function resize() {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
  }
  window.addEventListener('resize', resize)
  resize()

  function draw() {
    time += 0.02
    ctx.clearRect(0, 0, w, h)

    // Only active in dark mode or every 10 sec interval
    const isActive = document.body.classList.contains('dark-mode') || Math.sin(time) > 0.85
    if (!isActive) {
      requestAnimationFrame(draw)
      return
    }

    // Random horizontal glitch strips
    const stripCount = Math.floor(Math.random() * 4) + 1
    for (let i = 0; i < stripCount; i++) {
      const y = Math.random() * h
      const stripH = Math.random() * 20 + 3
      const offset = (Math.random() - 0.5) * 30

      // RGB split
      ctx.globalAlpha = 0.15
      ctx.fillStyle = '#ff2d78' // red channel
      ctx.fillRect(offset, y, w, stripH)
      ctx.fillStyle = '#00d4ff' // blue channel
      ctx.fillRect(-offset, y, w, stripH)

      // Displacement
      ctx.globalAlpha = 0.08
      ctx.fillStyle = '#fff'
      ctx.fillRect(Math.random() * w * 0.5, y, Math.random() * 100 + 20, stripH)
    }

    // Scanlines
    ctx.globalAlpha = 0.03
    for (let y = 0; y < h; y += 4) {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, y, w, 1)
    }

    // Occasional full-screen flash
    if (Math.random() < 0.005) {
      ctx.globalAlpha = 0.1
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, w, h)
    }

    ctx.globalAlpha = 1
    requestAnimationFrame(draw)
  }

  draw()
})()