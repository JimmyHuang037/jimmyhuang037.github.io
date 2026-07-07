/**
 * Mandala Generator — rotating geometric patterns
 * Inspired by Indian mandala + Spider-Verse decorative motifs
 */
;(function() {
  'use strict'

  const canvas = document.getElementById('mandala-canvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let w, h, cx, cy
  let rotation = 0

  const PETAL_COLORS = [
    'rgba(212,160,23,0.25)',
    'rgba(255,45,120,0.15)',
    'rgba(0,212,255,0.15)',
    'rgba(110,13,173,0.12)',
  ]

  function resize() {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
    cx = w / 2
    cy = h / 2
  }
  window.addEventListener('resize', resize)
  resize()

  function drawMandala(time) {
    const radius = Math.min(w, h) * 0.15
    if (radius < 30) { requestAnimationFrame(drawMandala); return }

    ctx.clearRect(0, 0, w, h)
    rotation += 0.001

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rotation)

    // Outer ring — dots
    const outerDots = 24
    for (let i = 0; i < outerDots; i++) {
      const angle = (Math.PI * 2 / outerDots) * i
      const r = radius * 0.9
      ctx.beginPath()
      ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, 2, 0, Math.PI * 2)
      ctx.fillStyle = PETAL_COLORS[0]
      ctx.fill()
    }

    // Petal layer
    const petals = 8
    for (let i = 0; i < petals; i++) {
      const angle = (Math.PI * 2 / petals) * i
      const color = PETAL_COLORS[i % PETAL_COLORS.length]

      ctx.save()
      ctx.rotate(angle)

      // Petal shape
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(radius * 0.3, -radius * 0.5, 0, -radius * 0.8)
      ctx.quadraticCurveTo(-radius * 0.3, -radius * 0.5, 0, 0)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = 'rgba(212,160,23,0.15)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      ctx.restore()
    }

    // Inner circle
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(212,160,23,0.2)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Center dot
    ctx.beginPath()
    ctx.arc(0, 0, 3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(212,160,23,0.4)'
    ctx.fill()

    ctx.restore()
    requestAnimationFrame(drawMandala)
  }

  drawMandala(0)
})()