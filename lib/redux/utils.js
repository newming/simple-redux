/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
export function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto) // 纯对象的原型是 Object，这里只有一次循环。如果是 new 出来的就不行了
    console.log(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}

// import isPlainObject from './isPlainObject'
// function Person() {}
// let obj = new Person()
// console.log(isPlainObject(obj)) // false