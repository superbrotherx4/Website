document.querySelectorAll('[data-toggle="dropdown"]').forEach(item => {
  item.ariaExpanded  = false
  item.addEventListener('click', () => {
    toggleDropdown(item)
  })
})

function toggleDropdown(item) {
  let expandNow = true
  if (item.dataset.expanded == 'true') expandNow = false

  item.parentNode.classList.toggle('show', expandNow)
  getNextElement(item, '.dropdown-menu').classList.toggle('show', expandNow)
  item.dataset.expanded = expandNow

  if (expandNow) {
    setTimeout(() => {
      window.addEventListener('click', event => {
        if (!item.contains(event.target)) toggleDropdown(item)
      }, { once: true })
    }, 500)
  }
}

document.querySelectorAll('[data-toggle="collapse"]').forEach(item => {
  item.dataset.expanded  = false
  item.addEventListener('click', () => {
    toggleMenu(item)
  })
})

function toggleMenu(item) {
  let expandNow = true
  if (item.dataset.expanded == 'true') expandNow = false

  item.classList.toggle('collapsed', expandNow)
  getNextElement(item, item.dataset.target).classList.toggle('show', expandNow)
  item.dataset.expanded = expandNow
}

function getNextElement(element, selector) {
  let next = element.nextElementSibling
  while (next) {
		if (next.matches(selector)) return next
		next = next.nextElementSibling
	}
}

document.querySelectorAll('[data-ride="carousel"]').forEach(item => {
  let indicators = item.querySelector('.carousel-indicators').children
  let itemCount = indicators.length
  let currentItem = 0
  let blocking = false

  item.querySelector('[data-slide="prev"]').addEventListener('click', e => {
    e.preventDefault()
    if (currentItem == 0) goToSlide(item, itemCount - 1)
    else goToSlide(item, currentItem - 1)
  })

  item.querySelector('[data-slide="next"]').addEventListener('click', e => {
    e.preventDefault()
    if (currentItem == itemCount - 1) goToSlide(item, 0)
    else goToSlide(item, currentItem + 1)
  })

  setTimeout(function loop() {
    if (currentItem == itemCount - 1) goToSlide(item, 0)
    else goToSlide(item, currentItem + 1)
    setTimeout(loop, 5000)
  }, 5000)

  for (const child of indicators) {
    child.addEventListener('click', () => {
      goToSlide(item, parseInt(child.dataset.slideTo, 10))
    })
  }

  function goToSlide(carousel, index) {
    if (!blocking) {
      blocking = true

      let carouselIIndicators = carousel.querySelector('.carousel-indicators').children
      let carouselItems = carousel.querySelector('.carousel-inner').children

      carouselIIndicators.item(currentItem).classList.remove('active')
      carouselIIndicators.item(index).classList.add('active')

      let itemKeyLeftRight = ''
      let itemKeyPrevNext = ''
      if (index > currentItem) {
        itemKeyLeftRight = 'carousel-item-left'
        itemKeyPrevNext = 'carousel-item-next'
      } else {
        itemKeyLeftRight = 'carousel-item-right'
        itemKeyPrevNext = 'carousel-item-prev'
      }

      carouselItems.item(index).classList.add(itemKeyPrevNext)
      carouselItems.item(currentItem).classList.add(itemKeyLeftRight)
      setTimeout(() => {
        carouselItems.item(index).classList.remove(itemKeyPrevNext)
        carouselItems.item(currentItem).classList.remove(itemKeyLeftRight)
        carouselItems.item(index).classList.add('active')
        carouselItems.item(currentItem).classList.remove('active')
        currentItem = index

        blocking = false
      }, 600)
    }
  }
})
