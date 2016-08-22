import * as React from 'react'
import {Link} from 'react-router'

interface Props {
  children: Element
  params: any
  headerExpanded: boolean
}

interface State {
}

export default class OverviewPage extends React.Component<Props, State> {

  render() {
    return (
      <div
        className='flex flex-wrap pv5'
        style={{
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <div className='w-100 pv4 lh-copy'>
          Welcome to the official Graphcool Documentation!
        </div>
        <div className='w-60 pr4'>
          <h2 className='mv4'>Getting Started</h2>
          <Link
            to='/guides/getting-started'
            className='relative pointer mb4 db'
            style={{
              height: 270,
              background: `url(${require('../../assets/images/login.png')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className='absolute bottom-0 pa3 w-100 bg-black-30 left-0 white f6 fw6'>
              Get started with Graphcool in 3 minutes
            </div>
          </Link>
          <div>
            <Link
              to='/guides'
              className='br3 ba pv3 ph4 accent f5 fw6 dib mr2 pointer'
            >
              View more guides
            </Link>
            <Link
              to='/examples'
              className='br3 ba pv3 ph4 accent f5 fw6 dib pointer'
            >
              Examples
            </Link>
          </div>
        </div>
        <div className='w-40'>
          <h2 className='mv4'>Reference</h2>
          <Link
            to='/reference/platform'
            className='br3 ba pv3 ph4 accent pointer mb3 db'
          >
            <div className='f4 gray-4 mb2'>Platform</div>
            <p className='f6 gray-3 ma0'>General Terminology and Concepts for the Graphcool platform</p>
          </Link>
          <Link
            to='/reference/simple-api'
            className='br3 ba pv3 ph4 accent pointer mb3 db'
          >
            <div className='f4 gray-4 mb2'>Simple API</div>
            <p className='f6 gray-3 ma0'>An API for GraphQL clients like Apollo Client or lokka</p>
          </Link>
          <Link
            to='/reference/relay-api'
            className='br3 ba pv3 ph4 accent pointer mb3 db'
          >
            <div className='f4 gray-4 mb2'>Relay API</div>
            <p className='f6 gray-3 ma0'>An API for the Relay GraphQL client</p>
          </Link>
        </div>
      </div>
    )
  }
}
