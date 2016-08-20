import * as React from 'react'

interface Props {
  children: Element
  params: any
  headerExpanded: boolean
}

interface State {
}

export default class GuidesPage extends React.Component<Props, State> {

  render() {
    return (
      <div>
        Guides
      </div>
    )
  }
}
