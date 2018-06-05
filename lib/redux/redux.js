/**
 * createStore, redux 核心 api
 * @param {function} reducer 纯函数，修改 state
 * @param {function} enhance 中间件
 */
export function createStore(reducer, enhancer) {
  // 中间件处理
  if (enhancer) {
    return enhancer(createStore)(reducer)
  }
  let currentState = undefined // 注意这里 undefined 代表初始 state，必须是它，在下边初始化的时候，调用 reduce 传入 undefined 不会影响外部定义的 默认state，即这里的 undefined 只占位不影响值
  let currentListeners = []

  function getState() {
    return currentState
  }

  function subscribe(listener) {
    currentListeners.push(listener)
  }

  function dispatch(action) {
    currentState = reducer(currentState, action)
    currentListeners.forEach(v => v())
    return action
  }

  // 一上来调用一次 dispatch ，拿到传入的 action 的默认的 state
  dispatch({
    type: '@newming/initdispatch'
  })

  return {
    getState,
    subscribe,
    dispatch
  }
}

/**
 * 应用中间件
 * @param {...Function} middlewares 可以传入多个中间件函数
 */
export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args) // 到这里已经生成了上边普通的 store，需要对 dispatah 做包装
    let dispatch = store.dispatch

    const midApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args) // 注意这里的 args 是执行 dispatch 收到的 action 参数
    }
    let chain = middlewares.map(middleware => middleware(midApi))
    dispatch = compose(...chain)(store.dispatch)

    // dispatch = middleware(midApi)(store.dispatch) // 只有一个中间件的写法，注意这里是先用 middleware 将 midApi 包裹一次，后传入 dispatch

    // 最终返回 store 上的几个 api，其中 dispatch 已经不是原先的 diapatch
    return {
      ...store,
      dispatch
    }
  }
}
/**
 * 合并中间件 (fun1, fun2, fun3) => fn1(fun2(fun3))，依次调用
 */
export function compose(...funcs) {
  // 如果中间件的长度为 0
  if (funcs.length === 0) {
    return arg => arg
  }
  // 如果中间件的长度为 1
  if (funcs.length === 1) {
    return funcs[0]
  }
  // 难啊。。。
  return funcs.reduce((ret, item) => (...args) => ret(item(...args)))
}

/**
 * 工具函数，mapDispatchToProps 函数中调用，将传入的 action creator dispatch 出去
 * @param {object} creators {addNum, cutNum}
 * @param {function} dispatch connect 传入的第二个参数，store.dispatch
 */
export function bindActionCreators(creators, dispatch) {
  // let bound = {}
  // Object.keys(creators).forEach(v => {
  //   let creator = creators[v]
  //   bound[v] = bindActionCreator(creator, dispatch)
  // })
  // return bound
  // 作用同上
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = bindActionCreator(creators[item], dispatch)
    return ret
  }, {})
}

function bindActionCreator(creator, dispatch) {
  // 这里的 args 是组件内部调用 props 时传入的参数
  return (...args) => dispatch(creator(...args))
}