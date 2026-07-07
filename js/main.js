/**
 * Spider-Verse Theme — Main JS
 * Navigation, dark mode, random quotes, card effects
 */
;(function() {
  'use strict'

  // ---- Dark mode toggle ----
  const toggle = document.getElementById('dark-toggle')
  if (toggle) {
    // Check saved preference
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode')
    }

    toggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode')
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'))
    })
  }

  // ---- Random card rotation ----
  document.querySelectorAll('.collage-card').forEach(function(card) {
    const rot = (Math.random() - 0.5) * 2  // -1 to 1 deg
    card.style.setProperty('--hover-rotate', rot + 'deg')

    // Punk cards get extra rotation
    if (card.classList.contains('style-punk')) {
      card.style.setProperty('--punk-rot', (Math.random() - 0.5) * 3 + 'deg')
    }
  })

  // ---- Spider-Verse quotes ----
  const quotes = [
    "Anyone can wear the mask.",
    "You're the best of all of us, Miles.",
    "That's all it is, Miles. A leap of faith.",
    "You got a spark in you, kid.",
    "I'm finally gonna be myself.",
    "It's a leap of faith. That's all it is.",
    "You're the one who gets to decide what kind of Spider-Man you want to be.",
    "Nobody knows what it's like to be the new guy.",
    "You can't be Spider-Man without the mask.",
    "Every universe has its own Spider-Man.",
    "The hardest part is the jump.",
    "You're amazing, but you gotta stop trying to be me.",
    "You're the only one who can save them.",
    "I'm the original, baby.",
    "In every universe, you're the best of us.",
  ]

  const quoteEl = document.getElementById('footer-quote')
  if (quoteEl) {
    const idx = Math.floor(Math.random() * quotes.length)
    quoteEl.textContent = '🕷️ ' + quotes[idx]

    // Change quote on click
    quoteEl.style.cursor = 'pointer'
    quoteEl.addEventListener('click', function() {
      const newIdx = Math.floor(Math.random() * quotes.length)
      this.textContent = '🕷️ ' + quotes[newIdx]
    })
  }

  // ---- Music player ----
  const audio = document.getElementById('bg-music')
  const musicBtn = document.getElementById('music-toggle')
  const musicStatus = document.querySelector('.music-status')

  if (audio && musicBtn) {
    // Preload first byte on hover so first click is instant
    musicBtn.addEventListener('mouseenter', function() {
      if (audio.readyState === 0) audio.load()
    }, { once: true })

    musicBtn.addEventListener('click', function() {
      if (audio.paused) {
        audio.play().then(function() {
          musicBtn.classList.add('playing')
          musicBtn.textContent = '♫'
          if (musicStatus) musicStatus.textContent = 'playing'
        }).catch(function(e) {
          console.warn('[Music] Play blocked:', e.message)
        })
      } else {
        audio.pause()
        musicBtn.classList.remove('playing')
        musicBtn.textContent = '♪'
        if (musicStatus) musicStatus.textContent = 'paused'
      }
    })

    // Reset when song ends
    audio.addEventListener('ended', function() {
      musicBtn.classList.remove('playing')
      musicBtn.textContent = '♪'
      if (musicStatus) musicStatus.textContent = 'paused'
    })
  }

  // ---- Card entrance animation on scroll ----
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.collage-card').forEach(function(card) {
    card.style.opacity = '0'
    card.style.transform = 'translateY(20px)'
    card.style.transition = 'opacity .5s ease, transform .5s ease'
    observer.observe(card)
  })

  // ---- Console easter egg ----
  console.log('%c🕷️ JimmyDaily — Spider-Verse', 'font-size:24px; color:#ff2d78; text-shadow: 2px 2px 0 #00d4ff;')
  console.log('%c"Anyone can wear the mask."', 'font-size:14px; color:#6a0dad; font-style:italic;')

  // ---- Page transition ----
  var transitionEl = document.getElementById('page-transition')
  if (transitionEl) {
    document.querySelectorAll('.nav-links a, .card-link, .nav-logo, .page-prev, .page-next, .post-nav-link').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var href = this.getAttribute('href')
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          e.preventDefault()
          transitionEl.classList.add('active')
          setTimeout(function() {
            window.location.href = href
          }, 400)
        }
      })
    })

    window.addEventListener('pageshow', function() {
      transitionEl.classList.remove('active')
    })
  }

  // ---- Back to top ----
  var backTop = document.getElementById('back-top')
  if (backTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backTop.classList.add('visible')
      } else {
        backTop.classList.remove('visible')
      }
    })

    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }
})()