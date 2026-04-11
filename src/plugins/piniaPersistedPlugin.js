import { watch } from 'vue'
function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
export function piniaPersistedPlugin({ store, options }) {
  const persistOptions = options?.persist
  if (!persistOptions) return
  const prefix = persistOptions.prefix || 's1zz'
  const keys = persistOptions.keys
  const debounceMs = persistOptions.debounce ?? 250
  const stateKeys = keys || Object.keys(store.$state)
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
