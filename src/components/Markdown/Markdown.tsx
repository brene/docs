import * as React from 'react'
import {Node} from 'commonmark'
import * as ReactRenderer from 'commonmark-react-renderer'
import * as slug from 'slug'
import {PrismCode} from 'react-prism'

const styles: any = require('./Markdown.module.css')

interface Props {
  ast: Node
  documentTitle: string
}

function childrenToString(children): string {
  if (typeof children === 'string') {
    return children
  }

  return children
    .map((el) => {
      if (typeof el === 'string') {
        return el
      } else {
        return childrenToString(el.props.children)
      }
    })
    .join('')
}

export default class Markdown extends React.PureComponent<Props, {}> {

  _openChat (message: string) {
    analytics.track('documenation help: open chat', { message })

    if (!Smooch.isOpened()) {
      Smooch.open()
    }

    if (!window.localStorage.getItem('chat_initiated')) {
      Smooch.sendMessage(`Hey! Can you help me with this part of the ${this.props.documentTitle} docs?`)
        .then(() => Smooch.sendMessage(message.substr(0, 200) + '...'))
        .then(() => window.localStorage.setItem('chat_initiated', 'true'))
    }
  }

  render() {
    const context = this
    const renderers = {
      Heading (props) {
        const padding = {
          1: () => 2.3,
          2: () => 1.5,
          3: () => 1.3,
          4: () => 1.2,
          5: () => 1,
        }[props.level]()
        const elProps = {
          key: props.nodeKey,
          id: slug(childrenToString(props.children), {lower: true}),
          style: {
            paddingTop: 100,
            paddingBottom: `${padding * 0.7}rem`,
            marginTop: `calc(${padding}rem - 100px)`,
            marginBottom: 0,
          },
        }
        return React.createElement('h' + props.level, elProps, props.children)
      },
      Paragraph (props) {
        return (
          <div className={styles.paragraph}>
            <p>{props.children}</p>
            <div className={styles.helpWrapper}>
              <div className={styles.help} onClick={() => context._openChat(childrenToString(props.children))}>?</div>
            </div>
          </div>
        )
      },
      List (props) {
        return (
          <div className={styles.paragraph}>
            {ReactRenderer.renderers.List(props)}
            <div className={styles.helpWrapper}>
              <div className={styles.help} onClick={() => context._openChat(childrenToString(props.children))}>?</div>
            </div>
          </div>
        )
      },
      CodeBlock (props) {
        const className = props.language && 'language-' + props.language
        return (
          <pre>
            <PrismCode className={className}>
              {props.literal}
            </PrismCode>
          </pre>
        )
      },
    }

    const renderer = new ReactRenderer({renderers})

    return (
      <div className={`relative ${styles.content}`}>
        <div className='absolute right-0 gray-2 f6 tr' style={{ top: '2.3rem' }}>
          Last updated<br />
          {__LAST_UPDATE__}
        </div>
        {renderer.render(this.props.ast)}
      </div>
    )
  }
}
