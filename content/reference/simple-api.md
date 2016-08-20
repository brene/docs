# Simple API

Note: This API is meant for GraphQL clients like Apollo or lokka. If you're using Relay, check the [Relay API](./relay-api) instead.

## Structure

* Root query type
* Queries based on models
* Mutations based on models + relations
* Integrations (queries + mutations)

## Queries

A *query* enables you to declare data requirements in your app. If you send a query to your endpoint, the *query response* will contain information about all nodes that were specified in the query.

Every query you send has to be wrapped by the *root query type*. This root query acts as a starting point to more interesting sub queries and looks like this:


```graphql
query {
  <sub query>
}
```

For every model in your project, there is a query to fetch all nodes of this model and a query to fetch a specific node. Additionally there is a query with information on the currently logged in user.  

Queries can be parametrized with *query variables* and most queries additionally accept *query arguments* to further control which nodes will be included in the query response.

> As an example, the query returning a specific node has to be supplied with a unique argument that identifies that node, for example its `id`

### All nodes of a model

Accessible via the root query. Queries all nodes of a specific model:

```graphql
query {
  allPosts {
    id
    title
    text
  }
}
```

Note: The query uses the plural rules of the English language. For example, if your model is called `Todo`, the query will be called `allTodoes`; if the model is called `Hobby`, the query will be called `Hobbies`

### Specific node of a model

Accessible via the root query. Queries a node speficied by a unique query argument:

```graphql
query {
  Post(id: "my-post-id") {
    id
    title
    text
  }
}
```

Note: You can supply any unique field that is marked unique in your project. For example, if you declared the `title` field of the `Post` model to be unique, you could identify a post by specifying its unique title:

```graphql
query {
  Post(title: "My biggest adventure!") {
    id
    title
    text
  }
}
```

### Connected nodes

To traverse your data graph and collect information on a node that is connected to your currently select node by courtesy of a [relation](./platform#relation), you can add the connected node in your query and specify a sub selection on it.

> Consider the following project setup: the `Post` and `User` models are related via the `author` and `posts` fields. Then any query for posts will contain the connected `user` node, and any query for users will contain the connected `posts` node. To include information on the author of a specific post, you could send this query

```graphql
query {
  Post(id: "my-post-id") {
    id
    author {
      id
      name
      email
    }
  }
}
```

### Session user

Accessible via the root query. Queries information on the active user. Read [here](./platform#Security) how the active is determined. All fields of the `User` model are available as subselections:

```graphql
query {
  user {
    id
    name
  }
}
```

If no active user could be determined, the query response will look like this:

```graphql
{
  "data": {
    "user": null
  }
}
```

### Pagination

### Filtering

### Sorting

## Mutations

... Generated based on the models and relations


### CRUD Mutations

#### Create a node

#### Update a node

#### Delete a node

### Relation Mutations

* addTo/removeFrom
* set/unset
* set via update/create node mutation

## Integrations

... TODO


## Differences to Relay API

### Relay has
* viewer/edges/node/
* {pageInfo, edges, totalCount}
* (cursor, first&after/last&before)
* clientMutationId
