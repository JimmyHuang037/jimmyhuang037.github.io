/**
 * Spider-Verse Theme — Main JS
 * Navigation, dark mode, random quotes, card effects, PJAX
 */
;(function() {
  'use strict'

  var mainContent = document.querySelector('.main-content')
  var transitionEl = document.getElementById('page-transition')

  // ====== PJAX: smooth internal navigation with persistent audio ======
  function initPjax() {
    // Intercept internal links
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a')
      if (!link) return

      var href = link.getAttribute('href')
      if (!href || !href.startsWith('/') || href.startsWith('//') || href === '#') return
      // Skip file downloads
      if (href.match(/\.(mp3|pdf|zip|png|jpg)$/i)) return

      e.preventDefault()
      navigateTo(href)
    })

    // Handle back/forward
    window.addEventListener('popstate', function(e) {
      if (e.state && e.state.url) {
        loadPage(e.state.url, true)
      }
    })
  }

  function navigateTo(url) {
    // Animate out
    if (transitionEl) transitionEl.classList.add('active')
    setTimeout(function() {
      loadPage(url, false)
      history.pushState({ url: url }, '', url)
    }, 300)
  }

  function loadPage(url, noTransition) {
    fetch(url)
      .then(function(res) { return res.text() })
      .then(function(html) {
        // Extract new main content
        var parser = new DOMParser()
        var doc = parser.parseFromString(html, 'text/html')
        var newContent = doc.querySelector('.main-content')
        var newTitle = doc.querySelector('title')

        if (!newContent) {
          // Fallback: full reload
          window.location.href = url
          return
        }

        // Swap content
        mainContent.innerHTML = newContent.innerHTML

        // Update title
        if (newTitle) document.title = newTitle.textContent

        // Update body class for page-specific styling
        var newBodyClass = doc.body.className
        document.body.className = newBodyClass

        // Re-init page-specific features
        reinitPage()

        // Animate in
        if (transitionEl) transitionEl.classList.remove('active')
        if (!noTransition) {
          mainContent.style.animation = 'none'
          void mainContent.offsetHeight  // reflow
          mainContent.style.animation = 'pageFadeIn .5s ease-out'
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' })
      })
      .catch(function() {
        // Network error: full reload
        window.location.href = url
      })
  }

  function reinitPage() {
    // Card random rotation
    document.querySelectorAll('.collage-card').forEach(function(card) {
      var rot = (Math.random() - 0.5) * 2
      card.style.setProperty('--hover-rotate', rot + 'deg')
      if (card.classList.contains('style-punk')) {
        card.style.setProperty('--punk-rot', (Math.random() - 0.5) * 3 + 'deg')
      }
    })

    // Scroll-in animation for cards
    document.querySelectorAll('.collage-card').forEach(function(card) {
      card.style.opacity = '0'
      card.style.transform = 'translateY(20px)'
      card.style.transition = 'opacity .5s ease, transform .5s ease'
      cardObserver.observe(card)
    })
  }

  // ====== Dark mode toggle ======
  var toggle = document.getElementById('dark-toggle')
  if (toggle) {
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode')
    }
    toggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode')
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'))
    })
  }

  // ====== Card entrance observer (persistent) ======
  var cardObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
      }
    })
  }, { threshold: 0.1 })

  // ====== Spider-Verse quotes ======
  var quotes = [
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

  var quoteEl = document.getElementById('footer-quote')
  if (quoteEl) {
    var idx = Math.floor(Math.random() * quotes.length)
    quoteEl.textContent = '🕷️ ' + quotes[idx]
    quoteEl.style.cursor = 'pointer'
    quoteEl.addEventListener('click', function() {
      var newIdx = Math.floor(Math.random() * quotes.length)
      this.textContent = '🕷️ ' + quotes[newIdx]
    })
  }

  // ====== Music player (persistent across PJAX) ======
  var audio = document.getElementById('bg-music')
  var musicBtn = document.getElementById('music-toggle')
  var musicStatus = document.querySelector('.music-status')

  if (audio && musicBtn) {
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

    audio.addEventListener('ended', function() {
      musicBtn.classList.remove('playing')
      musicBtn.textContent = '♪'
      if (musicStatus) musicStatus.textContent = 'paused'
    })
  }

  // ====== Back to top ======
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

  // ====== Console easter egg ======
  console.log('%c🕷️ JimmyDaily — Spider-Verse', 'font-size:24px; color:#ff2d78; text-shadow: 2px 2px 0 #00d4ff;')
  console.log('%c"Anyone can wear the mask."', 'font-size:14px; color:#6a0dad; font-style:italic;')

  // ====== Init ======
  reinitPage()
  initPjax()
})()