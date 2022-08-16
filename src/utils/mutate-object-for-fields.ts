export function mutateObjectForFields(source, path, value, depth = 0) {
  if (depth >= path.length) {
    return value
  }
  const [type, key] = path[depth]
  if (type === 'array') {
    source[key] = mutateObjectForFields(source[key] || [], path, value, depth + 1)
  }
  if (type === 'object') {
    source[key] = mutateObjectForFields(source[key] || {}, path, value, depth + 1)
  }
  return source
}