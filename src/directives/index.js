// Custom Vue Directives for S1zz

// v-focus: automatically focuses the element on mount
export const vFocus = {
  mounted(el) {
    el.focus()
  }
}

// v-badge: adds a count badge to an element
export const vBadge = {
  mounted(el, binding) {
    const badge = document.createElement('span')
    badge.classList.add('v-badge')
    badge.textContent = binding.value || 0
    Object.assign(badge.style, {
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      background: '#ff6b6b',
      color: '#fff',
      borderRadius: '50%',
      width: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.65rem',
      fontWeight: '700'
    })
    el.style.position = 'relative'
    el.appendChild(badge)
  },
  updated(el, binding) {
    const badge = el.querySelector('.v-badge')
    if (badge) badge.textContent = binding.value || 0
  }
}

// v-tooltip: adds a native tooltip and aria-label to any element
export const vTooltip = {
  mounted(el, binding) {
    const text = binding.value || ''
    el.setAttribute('title', text)
    el.setAttribute('aria-label', text)
  },
  updated(el, binding) {
    const text = binding.value || ''
    el.setAttribute('title', text)
    el.setAttribute('aria-label', text)
  }
}
