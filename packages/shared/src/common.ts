/**
 * 防抖
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  immediate = false,
) {
  let timeout: number | null = null
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    // eslint-disable-next-line
    const context = this
    const callNow = immediate && !timeout
    if (timeout) clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      timeout = null
      if (!immediate) fn.apply(context, args)
    }, wait)
    if (callNow) fn.apply(context, args)
  } as T
}

/**
 * 节流
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  immediate = false,
) {
  let timeout: number | null = null
  let initialCall = true
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    // eslint-disable-next-line
    const context = this
    if (initialCall) {
      if (immediate) fn.apply(context, args)
      initialCall = false
    } else {
      if (timeout) return
      timeout = window.setTimeout(() => {
        fn.apply(context, args)
        clearTimeout(timeout!)
        timeout = null
      }, wait)
    }
  } as T
}
