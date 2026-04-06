import { watch, ref, isRef } from 'vue'

function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function usePersistedState(storageKey, defaultValue) {
  // Attempt to rehydrate from localStorage
  let initialValue = isRef(defaultValue) ? defaultValue.value : defaultValue
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null) {
      initialValue = JSON.parse(stored)
    }
  } catch (e) {
    console.warn(`[S1zz Persist] Could not parse key "${storageKey}":`, e)
  }

  // Create the reactive ref with the (possibly rehydrated) value
  const state = ref(initialValue)

  // Debounced write to avoid flooding localStorage on rapid changes
  const persistDebounced = debounce((val) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(val))
    } catch (e) {
      console.error(`[S1zz Persist] Write failed for key "${storageKey}":`, e)
    }
  }, 200)

  // Deep watcher — triggers on nested object/array mutations
  watch(state, persistDebounced, { deep: true })

  return state
}

// ─── Pinia Plugin: piniaPersistedPlugin ───────────────────────
/**
 * Install into Pinia to give ALL stores an automatic persistence
 * behaviour when they declare a `persist` option.
 *
 * Options API store example:
 *   defineStore('cart', {
 *     state: () => ({ items: [] }),
 *     persist: { prefix: 's1zz', keys: ['items'] }
  const stateKeys = keys || Object.keys(store.$state)

  // ① Rehydrate: load from localStorage into store on plugin init
  stateKeys.forEach(key => {
    const storageKey = `${prefix}_${store.$id}_${key}`
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) {
        store.$patch({ [key]: JSON.parse(stored) })
      }
    } catch (e) {
      console.warn(`[S1zz Plugin] Rehydrate failed: ${storageKey}`, e)
    }
  })

  // Watch for changes and persist
  stateKeys.forEach(key => {
    const storageKey = `${prefix}_${store.$id}_${key}`
    const debouncedWrite = debounce((value) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value))
      } catch (e) {
        console.error(`[S1zz Plugin] Write failed: ${storageKey}`, e)
      }
    }, debounceMs)

    watch(
      () => store.$state[key],
      debouncedWrite,
      { deep: true }
    )
  })

  store.$persist = {
    clear() {
      stateKeys.forEach(key => {
        localStorage.removeItem(`${prefix}_${store.$id}_${key}`)
      })
      console.info(`[S1zz Plugin] Cleared persistence for store: ${store.$id}`)
    },
    flush() {
      stateKeys.forEach(key => {
        try {
          localStorage.setItem(
            `${prefix}_${store.$id}_${key}`,
            JSON.stringify(store.$state[key])
          )
        } catch (e) {
          console.error(`[S1zz Plugin] Flush failed: ${key}`, e)
        }
      })
      console.info(`[S1zz Plugin] Flushed store: ${store.$id}`)
    }
  }
}
