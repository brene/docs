import * as React from 'react'
import {Link} from 'react-router'

require('./style.css')

interface Props {
  children: React.ReactElement<any>
  params: any
}

interface State {
  headerExpanded: boolean
}

export default class App extends React.Component<Props, State> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  context: {
    router: any
  }

  state = {
    headerExpanded: true,
  }

  constructor(props) {
    super(props)

    this._onScroll = this._onScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this._onScroll, false)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScroll, false)
  }

  _onScroll() {
    const headerExpanded = window.scrollY < 90
    if (this.state.headerExpanded !== headerExpanded) {
      this.setState({headerExpanded})
    }
  }

  render() {
    const active = (path) => this.context.router.isActive(`/${path}/${this.props.params.document}`) ? 'active' : ''

    const children = React.cloneElement(
      this.props.children,
      {headerExpanded: this.state.headerExpanded}
    )

    return (
      <div>
        <div
          id='head'
          style={{
            height: 150,
            top: this.state.headerExpanded ? 'auto' : -90,
            position: this.state.headerExpanded ? 'relative' : 'fixed',
            zIndex: 10,
          }}
          className={'bg-accent white pv3 ph4 flex flex-column justify-between w-100'}
        >
          <h1 className='f2 fw3 ma0 pt3'>Documentation</h1>
          <div className='flex'>
            <Link
              className='nav white f6 fw3 ttu mr3'
              activeClassName='active'
              to='/'
            >
              Overview
            </Link>
            <Link
              className={`nav white f6 fw3 ttu mr3 ${active('guides')}`}
              to='/guides'
            >
              Guides
            </Link>
            <Link
              className={`nav white f6 fw3 ttu mr3 ${active('reference')}`}
              to='/reference'
            >
              Reference
            </Link>
            <Link
              className='nav white f6 fw3 ttu mr3'
              activeClassName='active'
              to='/examples'
            >
              Examples
            </Link>
          </div>
        </div>
        <div
          style={{ paddingTop: this.state.headerExpanded ? 0 : 150 }}
        >
          {children}
        </div>
      </div>
    )
  }
}
