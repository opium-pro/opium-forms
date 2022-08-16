import { parseFieldName } from './parse-field-name.js'

export function getDeepFieldByPath(name, object = {}) {
  if (!name.includes('.') && !name.includes('[')) {
    return object[name]
  }

  const path = parseFieldName(name)
  return dig(object)

  function dig(initial, depth = 0, isArray = false) {
    const [type, key] = path[depth]
    const value = isArray ? initial[parseInt(key)] : initial[key]

    if (depth >= path.length - 1) {
      return value
    }
    if (value) {
      return dig(value, depth + 1, type === 'array')
    }
    return ''
  }
}