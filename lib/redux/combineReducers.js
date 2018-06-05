// 每一个 action 都会依次进入所有的 reducer
export function combineReducers(reducers) {
  // 这里毛都没干，就是检测传进来的是否合法，所以简写了
  // const reducerKeys = Object.keys(reducers)
  // const finalReducers = {}
  // for (let i = 0; i < reducerKeys.length; i++) {
  //   const key = reducerKeys[i]

  //   if (typeof reducers[key] === 'function') {
  //     finalReducers[key] = reducers[key]
  //   }
  // }
  // const finalReducerKeys = Object.keys(finalReducers)
  // 上边注释的简写
  const finalReducers = reducers
  const finalReducerKeys = Object.keys(reducers)

  // 一个 reduce 就是一个函数，这里返回的也是个函数，接收 state 和 action
  return function combination(state = {}, action) {
    let hasChanged = false
    const nextState = {}
    // 遍历每个 reduce，执行，并拿到返回的结果，检测是否 changed 最终返回一个 state
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action) // 执行 reduce
      if (typeof nextStateForKey === 'undefined') {
        throw new Error('不能返回 undefined')
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
}
