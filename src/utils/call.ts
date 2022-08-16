export function call(func) {
  if (typeof func === 'function') {
    return func
  }
  return new Function
}