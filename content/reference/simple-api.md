# Simple API

This API is meant for GraphQL clients like Apollo or lokka. If you're using Relay, check the [Relay API](./relay-api) instead.

## Differences to the Relay API

The Simple API can be thought of as a simpler subset of the [Relay API](./relay-api).

Note: While you can choose to only use one of the Relay API and the Simple API, you can easily use both in the same project at the same time.

The biggest difference is that the simple API does not feature the `viewer` root query. Traversal through your data graph is also handled slight differently, as you're always specifying the relation fields directly instead of using the `node` and `edges` fields as in the Relay API.

If you're not using Relay, you probably should use the simple API for now. If you decide to use Relay sometime later, you can easily switch to the Relay API or use both APIs.

## Structure

The Simple API provides several possibilities to fetch, modify or traverse your data. It features
* generated queries based on models
* traversal of the data graph
* generated mutations based on models + relations

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
* queries to fetch all nodes for a certain [model](./platform#model) in your project
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
  allPosts(first: 5, after: "my-post-id"}) {
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

There are two categories of generated mutations:
* mutations to create, update or delete nodes for a certain [model](./platform#model) in your project
* mutations to create, update or delete edges for a certain [relation](./platform#relation) in your project

### Modifying nodes

#### Create a node

Creates a new node for a specific model and assigns a new `id` to that node.
For this mutation, all [required](./platform#required) fields except the `id` field without a [default value](./platform#default-value) of the model have to be specified.
Additionally, the following fields can be specified:
* any non-required fields of the model
* any node `id` of a related model. This will also [create an edge](#creating-an-edge-when-creating-a-node) between the new node and any specified node.

The query response can contain all fields of the newly created node, including the `id` field.

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

#### Update a node

Updates fields of an existing node specified by the `id` field.
The node's fields will be updated according to the additionally provided values.

The query response can contain all fields of the updated node.

> Update the text and published fields for existing post and query its id:

```graphql
mutation {
  updatePost(id: "my-post-id", text: "This is the start of my biggest adventure!", published: true) {
    id
  }
}
```

#### Delete a node

Deletes a node specified by the `id` field.

The query response can contain all fields of the deleted node.

> Delete an existing post and query its id:

```graphql
mutation {
  deletePost(id: "my-post-id") {
    id
  }
}
```

### Modifying edges

Note: The names of the arguments and the selectable nodes in the mutation/query depend on the relation name and the relevant models.

#### Creating an edge when creating a node

You can create an edge when [creating a node](#create-a-node) on the one-side of a relation.

> Create a new post and connect it to an existing author:

```graphql
mutation {
  createPost(slug: "my-biggest-adventure", title: "My biggest adventure", text: "...", published: false, userId: "my-user-id") {
    id
  }
}
```

Note: This works for one-to-one and one-to-many relations.

#### Edges for one-to-one relations

A node in a one-to-one relation can at most be connected to one node.

##### Connect two nodes in a one-to-one relation

Creates a new edge between two nodes specified by their `id`. The according models have to be in the same [relation](./platform#relation).

The query response can contain both nodes of the new edge.

> Consider a blog where every post at the most has one assigned category. Adds a new edge to the relation called `PostCategory` and query the category name and the post title:

```graphql
mutation {
  setPostCategory(categoryCategoryId: "my-category-id", postPostId: "my-post-id") {
    category {
      name
    }
    post {
      title
    }
  }
}
```

Note: First removes existing connections containing one of the specified nodes, then adds the edge connecting both nodes.

##### Disconnect two nodes in a one-to-one relation

Removes an edge of a node speficied by `id`.

The query response can contain both nodes of the former edge.

> Removes an edge from the relation called `PostCategory` and query the category name and the post title:

```graphql
mutation {
  unsetPostCategory(categoryCategoryId: "my-category-id") {
    category {
      name
    }
    post {
      title
    }
  }
}
```

#### Edges for one-to-many and many-to-many relations

A node of the one side of a one-to-many relation can be connected to multiple nodes.
A node of the many side of a one-to-many relation can at most be connected to one node.

##### Connect two nodes in a one-to-many relation

Creates a new edge between two nodes specified by their `id`. The according models have to be in the same [relation](./platform#relation).

The query response can contain both nodes of the new edge.

> Adds a new edge to the relation called `UserPosts` and query the user name and the post title:

```graphql
mutation {
  addToAuthorPosts(authorUserid: "my-user-id" postPostId: "my-post-id") {
    author {
      name
    }
    post {
      title
    }
  }
}
```

Note: Adds the edge only if this node pair is not connected yet by this relation. Does not remove any edges.

##### Disconnect two nodes in a one-to-many relation

Removes one edge between two nodes specified by `id`

The query response can contain both nodes of the former edge.

> Removes an edge for the relation called `UserPosts` and query the user id and the post slug

```graphql
mutation {
  removeFromAuthorPosts(authorUserid: "my-user-id" postPostId: "my-post-id") {
    author {
      id
    }
    post {
      slug
    }
  }
}
```
