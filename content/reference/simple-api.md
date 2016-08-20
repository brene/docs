# Simple API

Note: This API is meant for GraphQL clients like Apollo or lokka. If you're using Relay, check the [Relay API](./relay-api) instead.

## Structure

* Root query type
* Queries based on models
* Mutations based on models + relations
* Integrations (queries + mutations)

## Generated Queries

A *query* enables you to declare data requirements in your app and by supplying multiple [fields](./platform#field).
All queries are automatically generated. To explore them, use the [playground](./platform#playground) inside your project.

Every query you send has to be wrapped by the *root query type*. It gives you access to all the generated queries for your project and looks like this:

```graphql
query {
  <inner query> {
    <subselection of fields>
  }
}
```

After you send a query to your [endpoint](./platform#endpoint) you will receive the *query response*. It contains the actual data for all fields that were specified in the query.

```graphql
{
  "data": {
    <response data>
  }
}

```

There are three categories of generated queries:
* queries to fetch all nodes for a certain model in your project
* queries to fetch one specific node for a certain each model in your project
* one query with information on the active [user](./platform#user-model)

To further control the response of a query, you can use different *query arguments*. Available arguments depend on the actual query.

### Specific node of a model

Returns a specific node.

> Query a specific post:

```graphql
query {
  Post(id: "my-post-id") {
    id
    slug
    title
    text
    published
  }
}
```

Note: To select the node, you can supply any field that is marked [unique](./platform#unique) in your project. For example, if you already declared the `slug` field of the `Post` model to be unique, you could select a post by specifying its slug:

```graphql
query {
  Post(slug: "my-biggest-adventure") {
    id
    slug
    title
    text
    published
  }
}
```

The unique query argument can be specified in two ways:
* the [system field](./platform#id-field) `id`, that automatically comes with every model
* another unique query argument that you added to the model yourself.

Note: You cannot specify two or more unique arguments for one query at the same time.

### All nodes for a certain model

Returns all nodes of a specific model:

```graphql
query {
  allPosts {
    id
    slug
    title
    text
    published
  }
}
```

> A few examples for query names
* model name: `Post`, query name: `allPosts`
* model name: `Todo`, query name: `allTodoes`
* model name: `Hobby`, query name: `allHobbies`.

Note: The query name uses the plural rules of the English language.

The query response can be
* ordered by specifying an order (ascending or descending) for a specific field
* filtered by specifying a value for one or multiple
* grouped into multiple pages by fixing one specific node and either seeking forwards or backwards

#### Ordering

For every scalar field on the model, you can supply `orderBy: <field>_ASC` or `orderBy: <field>_DESC`.

> Order the list of all posts ascending by id:

```graphql
query {
  allPosts(orderBy: id_ASC) {
    id
    slug
    title
    text
    published
  }
}
```

> Order the list of all posts descending by title:

```graphql
query {
  allPosts(orderBy: title_DESC) {
    id
    slug
    title
    text
    published
  }
}
```

Note: The field you are ordering by does not have to be selected in the actual query.
Note: If you do not specify an ordering, the response is implicitely ordered ascending by the `id` field

#### Filtering

You can supply a value for one or many fields to the `filter` argument to filter the query response accordingly.

> Query all posts not yet published:

```graphql
query {
  allPosts(filter: {published: false}) {
    id
    slug
    title
    text
    published
  }
}
```

Note: If you supply a value for multiple fields to the `filter` argument, only nodes that fulfill all the filter constraints will be shown.

#### Pagination

Pagination allows you to request a certain amount of nodes at the same time. You can seek forwards or backwards through the nodes, with an optional starting point:
* to seek forwards, use `first`; optionally specify a starting node with `after`.
* to seek backwards, use `last`; optionally specify a starting node with `before`.

> Consider a blog where only 5 posts are shown at the front page. The second page contains the next 5 posts and so on. Query the `first` 5 posts `after` the post with id "my-post-id":

```graphql
query {
  allPosts(first: 5 after: "my-post-id"}) {
    id
    slug
    title
    text
    published
  }
}
```

> Query the `last` 5 posts:

```graphql
query {
  allPosts(last: 5}) {
    id
    slug
    title
    text
    published
  }
}
```

Note: You cannot combine `first` with `before` or `last` with `after`.
Note: If you seek forwards or backwards for more nodes than exist, your response will simply contain all nodes that actually do exist in that direction.

### Session user

Queries information on the active user. All fields of the `User` model are available:

```graphql
query {
  user {
    id
    name
    email
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

Read [here](./platform#Security) how the active user is determined.

Note: No query arguments can be included to this query.

## Traverse the data graph

You can traverse the data graph in a query by including the field of a specific [relation](./platform#relation) and adding nested fields inside the now selected node.

> Consider the following project setup: the `Post` and `User` models are related via the `author` and `posts` fields. Any query for posts will expose the `user` field, and any query for users will expose the `posts` field. To get information on the author node connected to a specific post, you could send this query:

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

Note: You cannot add any query arguments to an inner field returning a single node.

> You can also get information on all posts of a certain author like this:
```graphql
query {
  User(id: "my-user-id") {
    id
    name
    posts {
      id
      slug
      title
      text
    }
  }
}
```

Note: Query arguments for an inner field returning multiple nodes work exactly the same as query arguments for queries [returning multiple nodes](#all-nodes-for-a-certain-model).

## Generated Mutations

With a *mutation* you can modify the data of your project.
Similar to queries, all mutations are automatically generated. Explore them by using the [playground](./platform#playground) inside your project.

Every mutation you send has to be wrapped by the *root mutation type* which looks like this:

```graphql
mutation {
  <inner mutation> {
    <subselection of fields>
  }
}
```

Note: The subselection of fields cannot be empty. If you have no specific data requirements, you can always select the id field as a default.

### Create a node

Creates a new node for a specific model and assigns a new `id` to that node.
For this mutation, the following fields have to be specified:
* all [required](./platform#required) fields without a [default value](./platform#default-value) of the model except for `id`
* no or some of the non-required fields have to be specified.

The subselection contains all fields of the newly created node, including the `id` field.

To create connect the new node to an existing one, simply specify the `id` of the existing node for the according field.

> Create a new post and query its id:

```graphql
mutation {
  createPost(slug: "my-biggest-adventure", title: "My biggest adventure", text: "...", published: false) {
    id
  }
}
```

> Create a new post and connect it to an existing author:

```graphql
mutation {
  createPost(slug: "my-biggest-adventure", title: "My biggest adventure", text: "...", published: false, userId: "my-user-id") {
    id
  }
}
```

Note: You can only specify list fields that are scalar and don't belong to a [relation](./platform#relation).


### Update a node

Updates fields of an existing node. To specify the node to be updated, you have to specify the `id` field.
Additionally, you only have to specify a value for each field that you want to update.

> Update an existing post and query its id:

```graphql
mutation {
  updatePost(id: "my-post-id" text: "This is the start of my biggest adventure!", published: true) {
    id
  }
}
```

### Delete a node

### Create an edge

### Update an edge

### Delete an edge

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
