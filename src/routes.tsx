import * as React from 'react' // tslint:disable-line
import { Route, Redirect } from 'react-router'
import ReferencePage from './pages/reference/ReferencePage'
import App from './components/App/App'

export default (
  <Route component={App}>
    <Route path='/' component={ReferencePage} />
    <Route path='guides' component={ReferencePage} />
    <Redirect path='reference' to='/reference/platform' />
    <Route path='reference/:document' component={ReferencePage} />
    <Route path='examples' component={ReferencePage} />
  </Route>
)
