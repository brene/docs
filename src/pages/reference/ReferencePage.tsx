import * as React from 'react'
import {findDOMNode} from 'react-dom'
import {Parser, Node} from 'commonmark'
import {Link} from 'react-router'
import {throttle} from 'lodash'
import {collectHeadings, buildHeadingsTree, HeadingNode, Heading} from '../../utils/markdown'
import {isElementInViewport, isElementVisibleInParentElement} from '../../utils/dom'
import {slug} from '../../utils/string'
import Markdown from '../../components/Markdown/Markdown'
import Icon from '../../components/Icon/Icon'
const styles: any = require('./ReferencePage.module.css')

interface Source {
  title: string
  ast: Node
}

const parser = new Parser()
const sources: { [key: string]: Source } = {
  platform: {
    title: 'Platform',
    ast: parser.parse(require('../../../content/reference/platform.md')),
  },
  api: {
    title: 'API',
    ast: parser.parse(require('../../../content/reference/api.md')),
  },
}

interface Props {
  children: Element
  params: any
  headerExpanded: boolean
}

interface State {
  selectedHeadingTitle: string | null
  headings: Heading[]
  headingsTree: HeadingNode[]
  scrollSidenav: boolean
}

export default class ReferencePage extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    const headings = collectHeadings(sources[props.params.document].ast)
    const headingsTree = buildHeadingsTree(headings)

    this.state = {
      headings,
      headingsTree,
      selectedHeadingTitle: null,
      scrollSidenav: true,
    }

    this._onScroll = throttle(this._onScroll.bind(this), 100)
  }

  componentDidMount() {
    window.addEventListener('scroll', this._onScroll, false)

    if (window.location.hash !== '') {
      const el = document.getElementById(window.location.hash.substr(1))
      if (el) {
        setTimeout(() => window.scrollTo(0, el.offsetTop), 100)
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScroll, false)
  }

  componentWillReceiveProps(props) {
    const headings = collectHeadings(sources[props.params.document].ast)
    const headingsTree = buildHeadingsTree(headings)

    this.setState(
      {
        headings,
        headingsTree,
      } as State,
      () => {
        this._onScroll()
      }
    )
  }

  _onScroll() {
    const selectedHeading = this.state.headings
      .filter((heading) => heading.level >= 2 && heading.level <= 4)
      .find((heading) => {
        const id = slug(heading.title)
        const el = document.getElementById(id)!
        return isElementInViewport(el)
      })

    if (selectedHeading && this.state.selectedHeadingTitle !== selectedHeading.title) {
      this.setState({selectedHeadingTitle: selectedHeading.title} as State)
    }

    if (selectedHeading && this.state.scrollSidenav) {
      const selectedLinkEl = findDOMNode<HTMLElement>(this.refs[slug(selectedHeading.title)])
      const parentEl = findDOMNode<HTMLElement>(this.refs['sidenav'])
      if (!isElementVisibleInParentElement(selectedLinkEl, parentEl, 0, 40)) {
        parentEl.scrollTop = selectedLinkEl.offsetTop - parentEl.clientHeight / 2
      }
    }
  }

  render() {
    const active = (headingTitle) => headingTitle === this.state.selectedHeadingTitle ? styles.active : ''

    return (
      <div
        className='flex'
        style={{
          paddingLeft: 335,
        }}
      >
        <div
          style={{
            width: 335,
            height: `calc(100% - ${this.props.headerExpanded ? 75 : 75 + 60}px)`,
            flex: '0 0 335px',
            top: this.props.headerExpanded ? 'auto' : 60,
            position: this.props.headerExpanded ? 'absolute' : 'fixed',
            padding: '3rem 0 7rem',
          }}
          ref='sidenav'
          className='overflow-y-scroll left-0 bg-gray-1 flex flex-column flex-auto'
          onMouseEnter={() => this.setState({ scrollSidenav: false } as State)}
          onMouseLeave={() => this.setState({ scrollSidenav: true } as State)}
        >
          {Object.keys(sources).map((key) => (
            <div key={key} className='flex flex-column flex-none'>
              <Link
                className={`${styles.lvl0} f3 pv3 ${this.props.params.document === key ? 'gray-4' : 'gray-3'}`}
                to={`/reference/${key}`}
              >
                {sources[key].title}
              </Link>
              {this.props.params.document === key && this.state.headingsTree.map((headingNodeLevel1, indexLevel1) => (
                <div key={indexLevel1} className='flex flex-column flex-none pv2'>
                  <a
                    ref={slug(headingNodeLevel1.title!)}
                    className={`${styles.lvl1} gray-4 f5 fw4 pv2 ${active(headingNodeLevel1.title)}`}
                    href={`#${slug(headingNodeLevel1.title!)}`}
                  >
                    {headingNodeLevel1.title}
                  </a>
                  {headingNodeLevel1.children.map((headingNodeLevel2, indexLevel2) => (
                    <div key={indexLevel2} className='flex flex-column flex-none'>
                      <a
                        ref={slug(headingNodeLevel2.title!)}
                        className={`${styles.lvl2} gray-3 f5 fw4 pv2 ${active(headingNodeLevel2.title)}`}
                        href={`#${slug(headingNodeLevel2.title!)}`}
                      >
                        {headingNodeLevel2.title}
                      </a>
                      {headingNodeLevel2.children.map((headingNodeLevel3, indexLevel3) => (
                        <div key={indexLevel3} className='flex flex-column flex-none'>
                          <a
                            ref={slug(headingNodeLevel3.title!)}
                            className={`${styles.lvl3} gray-4 f6 fw3 pv2 ${active(headingNodeLevel3.title)}`}
                            href={`#${slug(headingNodeLevel3.title!)}`}
                          >
                            {headingNodeLevel3.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          className={`fixed bottom-0 left-0 f6 fw6 gray-4 ${styles.chat}`}
          onClick={Smooch.open}
        >
          <Icon
            src={require('../../assets/icons/chat.svg')}
            width={35}
            height={35}
          />
          <div>
            Do you need help?<br />We're online. <span />
          </div>
        </div>
        <div className='pv5 ph6 flex'>
          <Markdown
            ast={sources[this.props.params.document].ast}
            documentTitle={sources[this.props.params.document].title}
          />
        </div>
      </div>
    )
  }
}
