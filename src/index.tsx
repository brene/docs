import * as React from 'react' // tslint:disable-line
import * as ReactDOM from 'react-dom'
import {Router, browserHistory, applyRouterMiddleware} from 'react-router'
import {useScroll} from 'react-router-scroll'
import routes from './routes'

function useScrollCallback(prevRouterProps, {location}) {
  return location.hash === ''
}

ReactDOM.render(
  (
    <Router
      routes={routes}
      history={browserHistory}
      render={applyRouterMiddleware(useScroll(useScrollCallback))}
    />
  ),
  document.getElementById('root')
)
