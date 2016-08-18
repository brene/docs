import * as React from 'react'
import {Node} from 'commonmark'
import * as ReactRenderer from 'commonmark-react-renderer'
import * as slug from 'slug'

interface Props {
  ast: Node
}

export default class Markdown extends React.PureComponent<Props, {}> {
  render() {
    const renderers = {
      Heading (props) {
        const elProps = {
          key: props.nodeKey,
          id: slug(props.children[0], {lower: true}),
          style: { paddingTop: 100, marginTop: -100 },
        }
        return React.createElement('h' + props.level, elProps, props.children)
      },
      Paragraph (props) {
        return (
          <div>
            <p>{props.literal}</p>
            Vote
          </div>
        )
      },
    }

    const renderer = new ReactRenderer({renderers})

    return (
      <div>
        {renderer.render(this.props.ast)}
      </div>
    )
  }
}
