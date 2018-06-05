// 请结合 my-redux 中 applyMiddleware 阅读，否则。。。
/**
 * redux-thunk 中间件的简单实现
 * @param {object} midApi 在 applyMiddleware 中修改 dispatch 时传入的第一个参数，然后返回一个函数
 * @param {function} next 这个是 middleware 执行后返回的函数执行时传入的参数，具体为 store.dispatch
 * @param {object} action 这个是在组件内部调用时传入的 action
 */
const thunk = ({dispatch, getState}) => next => action => {
  console.log(action)
  if (typeof action === 'function') {
    // 如果传入的时函数，就执行这个函数，并且传入 dispatch 以及 getState 作为参数，看看下面的 thunk 调用
    // 注意这里的 dispatch 其实是和 next 差不多都是 dispatch，但是却又不同，dispatch 是我们封装的，他会继续往下走中间件的流，而 next 则是直接继承 store.dispatch 来的，直接结束了当前的中间件流程控制。当中间件不为 1 则能看出区别
    return action(dispatch, getState)
  }
  // 所有的 dispatch 都会将 middleware 走一遍，默认什么都没干，直接 dispatch action
  return next(action)
}

export default thunk

// 调用 thunk 的例子
// function thunkDemo(num) {
//   // 这里的返回值为上边 thunk 中收到的 action
//   return (dispatch, getState) => {
//     setTimeout(() => {
//       dispatch({type: 'add', num})
//     }, 3000)
//   }
// }