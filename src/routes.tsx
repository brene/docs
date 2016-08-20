import * as React from 'react' // tslint:disable-line
import { Route, Redirect } from 'react-router'
import OverviewPage from './pages/overview/OverviewPage'
import GuidesPage from './pages/guides/GuidesPage'
import ReferencePage from './pages/reference/ReferencePage'
import ExamplesPage from './pages/examples/ExamplesPage'
import App from './components/App/App'

export default (
  <Route component={App}>
    <Route path='/' component={OverviewPage} />
    <Route path='guides' component={GuidesPage} />
    <Redirect path='reference' to='/reference/platform' />
    <Route path='reference/:document' component={ReferencePage} />
    <Route path='examples' component={ExamplesPage} />
  </Route>
)
