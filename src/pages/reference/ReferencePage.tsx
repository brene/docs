import * as React from 'react'
import {Parser, Node} from 'commonmark'
import {Link} from 'react-router'
import * as slug from 'slug'
import Markdown from '../../components/Markdown/Markdown'
const style: any = require('./ReferencePage.module.css')

const parser = new Parser()

interface Source {
  title: string
  ast: Node
  headings: NavElement[]
}

const sources: { [key: string]: Source } = {
  platform: {
    title: 'Platform',
    ast: parser.parse(require('../../../content/reference/platform.md')),
    get headings() {
      return collectHeadings(this.ast)
    },
  },
}

interface Props {
  children: Element
  params: any
  headerExpanded: boolean
}

interface NavElement {
  title: string | null
  children: NavElement[]
}

interface Heading {
  level: number
  title: string
}

function inject(root: NavElement, title: string, level: number): NavElement {
  if (level === 1) {
    root.title = title
  } else {
    if (level === 2 || root.children.length === 0) {
      root.children.push({
        title: null,
        children: [],
      })
    }
    const lastChild = root.children[root.children.length - 1]
    inject(lastChild, title, level - 1)
  }

  return root
}

function collectHeadings(ast: Node): NavElement[] {
  const walker = ast.walker()
  let e = walker.next() as any
  let headings: Heading[] = []
  while (e !== null) {
    if (e.entering && e.node._type === 'Heading') {
      headings.push({
        title: e.node._firstChild._literal,
        level: e.node._level,
      })
    }

    e = walker.next() as any
  }

  return headings
    .reduce(
      (root: NavElement, heading: Heading) => inject(root, heading.title, heading.level),
      {title: null, children: []}
    )
    .children
}

export default class ReferencePage extends React.Component<Props, {}> {

  render() {

    return (
      <div
        className='flex'
        style={{
          paddingLeft: this.props.headerExpanded ? 0 : 335,
        }}
      >
        <div
          style={{
            width: 335,
            flex: '0 0 335px',
            top: this.props.headerExpanded ? 'auto' : 60,
            position: this.props.headerExpanded ? 'relative' : 'fixed',
          }}
          className='h-100 overflow-y-scroll left-0 bg-gray-2 pv5 flex flex-column flex-auto'
        >
          {Object.keys(sources).map((key) => (
            <div key={key}>
              <Link
                className='gray-3 f3 pv3'
                style={{ paddingLeft: 30 }}
                to={`/reference/${key}`}
              >
                {sources[key].title}
              </Link>
              {this.props.params.document === key && sources[key].headings.map((navElementLevel1, indexLevel1) => (
                <div key={indexLevel1} className='flex flex-column'>
                  <a
                    className='gray-4 f5 fw4 pv2'
                    style={{ paddingLeft: 40 }}
                    href={`#${slug(navElementLevel1.title, {lower: true})}`}
                  >
                    {navElementLevel1.title}
                  </a>
                  {navElementLevel1.children.map((navElementLevel2, indexLevel2) => (
                    <div key={indexLevel2} className='flex flex-column'>
                      <a
                        className='gray-4 f5 fw3 pv1'
                        style={{ paddingLeft: 50 }}
                        href={`#${slug(navElementLevel2.title, {lower: true})}`}
                      >
                        {navElementLevel2.title}
                      </a>
                      {navElementLevel2.children.map((navElementLevel3, indexLevel3) => (
                        <div key={indexLevel3} className='flex flex-column'>
                          <a
                            className='gray-4 f6 fw3 pv1'
                            style={{ paddingLeft: 60 }}
                            href={`#${slug(navElementLevel3.title, {lower: true})}`}
                          >
                            {navElementLevel3.title}
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
        <div className={`pa2 ${style.content}`}>
          <Markdown ast={sources[this.props.params.document].ast} />
        </div>
      </div>
    )
  }
}
