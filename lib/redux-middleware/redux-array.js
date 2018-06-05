/**
 * redux-array-thunk 中间件的简单实现，传入的 action 是数组，同时执行多个 action
 * @param {object} midApi 在 applyMiddleware 中修改 dispatch 时传入的第一个参数，然后返回一个函数
 * @param {function} next 这个是 middleware 执行后返回的函数执行时传入的参数，具体为 store.dispatch
 * @param {object} action 这个是在组建内部调用时传入的 action
 */
const arrayThunk = ({dispatch, getState}) => next => action => {
  console.log(action)
  if (Array.isArray(action)) {
    action.forEach(v => dispatch(v))
  }
  // 所有的 dispatch 都会将 middleware 走一遍，默认什么都没干，直接 dispatch action
  return next(action)
}

export default arrayThunk