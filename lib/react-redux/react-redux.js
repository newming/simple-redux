// react-redux
import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from './my-redux'
// const {Provider, Consumer} = React.createContext('username')

// connect 负责链接组件，给到 redux 里的数据放到组件的属性里，高阶函数
// 1. 负责接受一个组件，把 state 里的一些数据放进去，返回一个组件
// 2. 数据变化的时候，能够通知组件
export const connect = (mapStateToProps = state => state, mapDispatchToProps = {}) => (WrapComponent) => {
  return class ConnectComponent extends React.Component {
    static contextTypes = {
      store: PropTypes.object
    }
    constructor (props, context) {
      super(props, context)
      this.state = {
        props: {}
      }
    }
    componentDidMount () {
      // 订阅 store 数据变化，数据变化后需要重新 update
      const store = this.context.store
      store.subscribe(() => this.update())
      // 将 state, dispatch 等注入到 this.state.props
      this.update()
    }
    update () {
      const store = this.context.store
      const stateProps = mapStateToProps(store.getState())
      // console.log(stateProps)
      // 方法不能直接给，需要 dispatch 包裹一层，下面拿到的 dispatchProps 是通过 redux 中暴露的方法处理后得到的一个对象
      const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)
      this.setState({
        // 注意下边顺序，先是 state.props 为原有 props
        props: {
          ...this.state.props,
          ...stateProps,
          ...dispatchProps
        }
      })
    }
    render () {
      return (
        <WrapComponent {...this.state.props} {...this.props}></WrapComponent>
      )
    }
  }
}

// 用 function 写 connect
// export function connect(mapStateToProps, mapDispatchToProps) {
//   return function (WrapComponent) {
//     return class ConnectComponent extends React.Component {

//     }
//   }
// }

// provider 把 store 放到 context 里，所有的子元素可以直接取到 store 中的 state
export class Provider extends React.Component {
  static childContextTypes = {
    store: PropTypes.object
  }
  getChildContext () {
    return {
      store: this.store
    }
  }
  constructor (props, context) {
    super(props, context)
    this.store = props.store
  }
  render () {
    return this.props.children
  }
}