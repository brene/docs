---
title: Webhooks
order: 104
description: graph.cool already covers most use-cases for your front-end application. For specific use-cases where you really have to do complex processing operations triggered by data updates, webhooks are a simple yet powerful tool. Setting up a webhook URL is easily done and will result in a POST request that allows you to react whenever your data changes.
---

graph.cool allows you to build very sophisticated applications without managing your own server. Sometimes you really need to do custom processing in response to data changes and that's when webhooks come in handy.

## Setup

To setup a webhook go to your dashboard, click on the settings button in the lower left corner and enter the webhook url.

graph.cool will now make a http POST request to your server whenever a node is created, updated and deleted as well as when a node is added to or removed from a connection.

## Payload Format

The request will include these headers:

```javascript
{
  'User-Agent': 'graph.cool',
  'Content-Type': 'application/json'
}
```

And the body will look like this:

```plain
{
  event: 'NODE_CREATED',
  mutation_id: unique id,
  data: {
    node: node,
    node_type: nodeType
  }
}
```

```plain
{
  event: 'NODE_UPDATED',
  mutation_id: unique id,
  data: {
    node: node,
    node_type: nodeType
  }
}
```

```plain
{
  event: 'NODE_DELETED',
  mutation_id: unique id,
  data: {
    node: node,
    node_type: nodeType
  }
}
```

```plain
{
  event: 'NODE_ADDED_TO_CONNECTION',
  mutation_id: unique id,
  data: {
    node: node,
    node_type: nodeType,
    connection_node: connectionNode,
    connection_node_type: connectionNodeType,
    connection_name: connectionName
  }
}
```

```plain
{
  event: 'NODE_REMOVED_FROM_CONNECTION',
  mutation_id: unique id,
  data: {
    node: node,
    node_type: nodeType,
    connection_node: connectionNode,
    connection_node_type: connectionNodeType,
    connection_name: connectionName
  }
}
```

## Debugging

If you are having trouble setting up the webhook, [request bin](http://requestb.in/) is a very useful tool. It simply captures all the requests to a url and displays them including headers, body and everything. If that doesn't help you are very welcome to contact us in the graph.cool [slack channel](https://slack.graph.cool/). We love to help!
