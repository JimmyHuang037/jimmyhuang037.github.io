/**
 * Spider-Verse Mouse Trail — glowing particle trail
 */
;(function() {
  'use strict'

  const canvas = document.createElement('canvas')
  canvas.id = 'trail-canvas'
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  let w, h
  const particles = []
  const MAX = 40
  let mx = -100, my = -100
  let trailActive = false

  function resize() {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
  }
  window.addEventListener('resize', resize)
  resize()

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX
    my = e.clientY
    trailActive = true

    // Add burst particles occasionally
    if (Math.random() < 0.3 && particles.length < MAX) {
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: mx + (Math.random() - 0.5) * 10,
          y: my + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          size: Math.random() * 4 + 2,
          life: 1,
          color: ['#ff2d78','#00d4ff','#ffe600','#6a0dad','#ffffff'][Math.floor(Math.random() * 5)],
          decay: Math.random() * 0.02 + 0.01
        })
      }
    }
  })

  document.addEventListener('mouseleave', function() {
    trailActive = false
  })

  function draw() {
    ctx.clearRect(0, 0, w, h)

    // Add trail particles
    if (trailActive && particles.length < MAX) {
      particles.push({
        x: mx + (Math.random() - 0.5) * 6,
        y: my + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.3,
        size: Math.random() * 5 + 2,
        life: 1,
        color: ['#ff2d78','#00d4ff','#ffe600','#6a0dad'][Math.floor(Math.random() * 4)],
        decay: Math.random() * 0.025 + 0.015
      })
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.02  // gravity
      p.life -= p.decay

      if (p.life <= 0) {
        particles.splice(i, 1)
        continue
      }

      ctx.globalAlpha = p.life * 0.6
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()

      // Glow
      ctx.shadowColor = p.color
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.shadowBlur = 0
    }

    ctx.globalAlpha = 1
    requestAnimationFrame(draw)
  }

  draw()
})()