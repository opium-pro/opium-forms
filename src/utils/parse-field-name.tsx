export function parseFieldName(name) {
  const result = [] as Array<['array' | 'object', any]>

  name.split('.').forEach((object) => {
    if (object.includes('[')) {
      const arrays = object.split('[',).map(array => array.replace(']', ''))
      arrays.forEach((array, index) => {
        if (index === 0) {
          result.push(['array', array])
          return
        }
        if (index === arrays.length - 1) {
          result.push(['object', array])
          return
        }
        result.push(['array', array])
      })
    } else {
      result.push(['object', object])
    }
  })

  return result
}