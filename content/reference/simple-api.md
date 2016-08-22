# Simple API

This API is meant for GraphQL clients like Apollo or lokka. If you are using Relay, check the [Relay API](relay-api) instead.

The simple API [endpoint](platform#endpoint) for your project looks like this:

`https://api.graph.cool/simple/v1/__PROJECT_ID__`

## Differences to the Relay API

The Simple API can be thought of as a simpler subset of the [Relay API](relay-api).

Note: While you can choose to only use one of the Relay API and the Simple API, you can easily use both in the same project at the same time.

The biggest difference is that the simple API does not feature the `viewer` root query. Traversal through your data graph is also handled slightly differently, as you are always specifying the relation fields directly instead of using the `node` and `edges` fields as in the Relay API.

If you are not using Relay, you probably should use the simple API for now. If you decide to use Relay sometime later, you can easily switch to the Relay API or use both APIs.

## Structure

The Simple API provides several possibilities to fetch, modify or traverse your data. It features
* generated queries based on models
* traversal of the data graph
* generated mutations based on models and relations

## Generated Queries

A *query* enables you to declare data requirements in your app by supplying multiple [fields](platform#field).
All queries are automatically generated. To explore them, use the [playground](platform#playground) inside your project.

All queries look like this:

```graphql
query {
  <query> {
    <subselection of fields>
  }
}
```

After you send a query to your [endpoint](platform#endpoint) you will receive the *query response*. It contains the actual data for all fields that were specified in the query.

```graphql
{
  "data": {
    <response data>
  }
}
```

There are three categories of generated queries:
* queries to fetch [one specific node](#specific-node-of-a-model) for a certain [model](platform#model) in your project
* queries to fetch [all nodes](#all-nodes-for-a-certain-model) for a certain [model](platform#model) in your project
* one query with information on the [session user](#session-user)

To further control the response of a query, you can use different *query arguments*. Available arguments depend on the actual query.

### Specific node of a model

Returns a specific node.

> Query a specific post:

```graphql
query {
  Post(id: "my-post-id-1") {
    id, title, published
  }
}
```

```graphql
{
  "data": {
    "id": "my-post-id-1",
    "title": "My biggest Adventure",
    "published": false
  }
}
```

Note: To select the node, you can supply any [unique](platform#unique) field as an argument to the query. For example, if you already declared the `slug` field of the `Post` model to be unique, you could select a post by specifying its slug:

```graphql
query {
  Post(slug: "my-biggest-adventure") {
    id, slug, title, published
  }
}
```

```graphql
{
  "data": {
    "id": "my-post-id-1",
    "slug": "my-biggest-adventure",
    "title": "My biggest Adventure",
    "published": false
  }
}
```

You can always use the [system field](platform#id-field) `id` to uniquely identify a node.

Note: You cannot specify two or more unique arguments for one query at the same time.

### All nodes for a certain model

Returns all nodes of a specific model:

```graphql
query {
  allPosts {
    id, title, published
  }
}
```

```graphql
{
  "data": {
    "allPosts": [
      {
        "id": "my-post-id-1",
        "title": "My biggest Adventure",
        "published": false
      },
      {
        "id": "my-post-id-2",
        "title": "My latest Hobbies",
        "published": true
      },
      {
        "id": "my-post-id-3",
        "title": "My great Vacation",
        "published": true
      }
    ]
  }
}
```

> A few examples for query names
* model name: `Post`, query name: `allPosts`
* model name: `Todo`, query name: `allTodoes`
* model name: `Hobby`, query name: `allHobbies`.

Note: The query name uses the plural rules of the English language.

By supplying different arguments to the query, the response can be
* ordered ascending or descending by a specific field
* filtered by specifying a value for one or multiple
* grouped into multiple pages by fixing one specific node and either seeking forwards or backwards

#### Ordering

For every scalar field on the model, you can supply `orderBy: <field>_ASC` or `orderBy: <field>_DESC`.

> Order the list of all posts ascending by id:

```graphql
query {
  allPosts(orderBy: id_ASC) {
    id, title, published
  }
}
```

```graphql
{
  "data": {
    "allPosts": [
      {
        "id": "my-post-id-1",
        "title": "My biggest Adventure",
        "published": false
      },
      {
        "id": "my-post-id-2",
        "title": "My latest Hobbies",
        "published": true
      },
      {
        "id": "my-post-id-3",
        "title": "My great Vacation",
        "published": true
      }
    ]
  }
}
```

> Order the list of all posts descending by title:

```graphql
query {
  allPosts(orderBy: title_DESC) {
    id, title, published
  }
}
```

```graphql
{
  "data": {
    "allPosts": [
      {
        "id": "my-post-id-2",
        "title": "My latest Hobbies",
        "published": true
      },
      {
        "id": "my-post-id-3",
        "title": "My great Vacation",
        "published": true
      },
      {
        "id": "my-post-id-1",
        "title": "My biggest Adventure",
        "published": false
      }
    ]
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
    id, title, published
  }
}
```

```graphql
{
  "data": {
    "allPosts": [
      {
        "id": "my-post-id-1",
        "title": "My biggest Adventure",
        "published": false
      }
    ]
  }
}
```

Note: If you supply a value for multiple fields to the `filter` argument, only nodes that fulfill all the filter constraints will be shown.

#### Pagination

Pagination allows you to request a certain amount of nodes at the same time. You can seek forwards or backwards through the nodes and supply an optional starting node:
* to seek forwards, use `first`; specify a starting node with `after`.
* to seek backwards, use `last`; specify a starting node with `before`.

You can also skip an arbitrary amount of nodes in whichever direction you are seeking by supplying the `skip` argument.

> Consider a blog where only 3 posts are shown at the front page. To query the first page:

```graphql
query {
  allPosts(first: 3) {
    id, title
  }
}
```

```graphql
{
  "data": {
    "allPosts": [
      {
        "id": "my-post-id-1",
        "title": "My biggest Adventure",
        "published": false
      },
      {
        "id": "my-post-id-2",
        "title": "My latest Hobbies",
        "published": true
      },
      {
        "id": "my-post-id-3",
        "title": "My great Vacation",
        "published": true
      }
    ]
  }
}
```

> To show the second page, we query the first 3 posts after the last one of the first page, with the id `my-post-id-3`:

```graphql
query {
  allPosts(first: 3, after: "my-post-id-3") {
    id, title
  }
}
```

```graphql
{
  "data": {
    "allPosts": [
      {
        "id": "my-post-id-4",
        "title": "My favorite Movies",
        "published": true
      },
      {
        "id": "my-post-id-5",
        "title": "My favorite Actors",
        "published": true
      },
      {
        "id": "my-post-id-6",
        "title": "My biggest Secret",
        "published": true
      }
    ]
  }
}
```

> We could reach the same result by combining `first` and `skip`:

```graphql
query {
  allPosts(first: 3, skip: 3) {
    id, title
  }
}
```

```graphql
{
  "data": {
    "allPosts": [
      {
        "id": "my-post-id-4",
        "title": "My favorite Movies",
        "published": true
      },
      {
        "id": "my-post-id-5",
        "title": "My favorite Actors",
        "published": true
      },
      {
        "id": "my-post-id-6",
        "title": "My biggest Secret",
        "published": true
      }
    ]
  }
}
```

> Query the `last` 3 posts:

```graphql
query {
  allPosts(last: 3) {
    id, title
  }
}
```

```graphql
{
  "data": {
    "allPosts": [
      {
        "id": "my-post-id-42",
        "title": "My favorite Animals"
      },
      {
        "id": "my-post-id-43",
        "title": "My new Work"
      },
      {
        "id": "my-post-id-43",
        "title": "My first Post"
      }
    ]
  }
}
```

Note: You cannot combine `first` with `before` or `last` with `after`.
Note: If you query more nodes than exist, your response will simply contain all nodes that actually do exist in that direction.

### Session user

Queries information on the [session user](platform#session-user). All fields of the `User` model are available:

```graphql
query {
  user {
    id, name, email
  }
}
```

```graphql
{
  "data": {
    "user": {
      "id": "my-user-id",
      "name": "John Doe",
      "email": "john@doe.com"
    }
  }
}
```

If no user is signed in, the query response will look like this:

```graphql
{
  "data": {
    "user": null
  }
}
```

Note: No query arguments can be included to this query.

## Traverse the data graph

You can traverse the data graph in a query by including the field of a specific [relation](platform#relation) and adding nested fields inside the now selected node.

> Consider the following project setup: the `Post` and `User` models are related via the `author` and `posts` fields. Any query for posts will expose the `user` field, and any query for users will expose the `posts` field. To get information on the author node connected to a specific post, you could send this query:

```graphql
query {
  Post(id: "my-post-id-1") {
    id
    author {
      id, name, email
    }
  }
}
```

```graphql
{
  "data": {
    "id": "my-post-id-1",
    "author": {
      "id": "my-user-id"
      "name": "John Doe"
    }
  }
}
```

Note: You cannot add any query arguments to an inner field returning a single node.

> You can also get information on all posts of a certain author like this:

```graphql
query {
  User(id: "my-user-id") {
    id, name
    posts {
      id, published
    }
  }
}
```

```graphql
{
  "data": {
    "id": "my-user-id",
    "name": "John Doe"
    "posts": [
      {
        "id": "my-post-id-1",
        "published": false
      },
      {
        "id": "my-post-id-3",
        "published": true
      },
      {
        "id": "my-post-id-4",
        "published": true
      }
    ]
  }
}
```

Note: Query arguments for an inner field returning multiple nodes work exactly the same as query arguments for queries [returning multiple nodes](#all-nodes-for-a-certain-model).

## Generated Mutations

With a *mutation* you can modify the data of your project.
Similar to queries, all mutations are automatically generated. Explore them by using the [playground](platform#playground) inside your project.

All mutations look like this:

```graphql
mutation {
  <mutation>(<list of arguments>) {
    <subselection of fields>
  }
}
```

Note: The subselection of fields cannot be empty. If you have no specific data requirements, you can always select `id` as a default.

There are three categories of generated mutations:
* a [sign-in](#sign-in) mutation to authenticate further queries or mutations as a [session user](platform#session-user)
* mutations to [create, update or delete nodes](#modifying-nodes) for a certain [model](platform#model) in your project
* mutations to [create, update or delete edges](#modifying-edges) for a certain [relation](platform#relation) in your project

### Sign In

Signs in a user by supplying an email and password. Returns a [temporary authentication token](platform#temporary-authentication-token) that can be used to authenticate further queries or mutations as the signed in user.

> Sign in as user `john@doe.com` with password `mysecret` and query the newly created authentication token, as well as the user email:

```graphql
mutation {
  signinUser({email: "john@doe.", password: "mysecret") {
    token
  }
}
```

### Modifying nodes

#### Create a node

Creates a new node for a specific model that gets assigned a new `id`.
All [required](platform#required) fields of the model without a [default value](platform#default-value) have to be specified, the other fields are optional arguments.

You can also connect [connect this node](#creating-an-edge-when-creating-a-node) to another node.

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

```graphql
{
  "data": {
    "id": "my-post-id"
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

```graphql
{
  "data": {
    "id": "my-post-id"
  }
}
```

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

```graphql
{
  "data": {
    "id": "my-post-id"
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

```graphql
{
  "data": {
    "id": "my-post-id"
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

```graphql
{
  "data": {
    "id": "my-post-id"
  }
}
```

Note: This works for one-to-one and one-to-many relations.

#### Edges for one-to-one relations

A node in a one-to-one relation can at most be connected to one node.

##### Connect two nodes in a one-to-one relation

Creates a new edge between two nodes specified by their `id`. The according models have to be in the same [relation](platform#relation).

The query response can contain both nodes of the new edge.

> Consider a blog where every post at the most has one assigned category. Adds a new edge to the relation called `PostCategory` and query the category name and the post title:

```graphql
mutation {
  setPostCategory(categoryCategoryId: "my-category-id", postPostId: "my-post-id-1") {
    categoryCategory {
      name
    }
    postPost {
      title
    }
  }
}
```

```graphql
{
  "data": {
    "categoryCategory": {
      "name": "General"
    }
    "postPost": {
      "title": "My biggest Adventure"
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
    categoryCategory {
      name
    }
    postPost {
      title
    }
  }
}
```

```graphql
{
  "data": {
    "categoryCategory": {
      "name": "General"
    }
    "postPost": {
      "title": "My biggest Adventure"
    }
  }
}
```

#### Edges for one-to-many and many-to-many relations

A node of the one side of a one-to-many relation can be connected to multiple nodes.
A node of the many side of a one-to-many relation can at most be connected to one node.

##### Connect two nodes in a one-to-many relation

Creates a new edge between two nodes specified by their `id`. The according models have to be in the same [relation](platform#relation).

The query response can contain both nodes of the new edge.

> Adds a new edge to the relation called `UserPosts` and query the user name and the post title:

```graphql
mutation {
  addToAuthorPosts(authorUserid: "my-user-id" postPostId: "my-post-id-1") {
    authorUser {
      name
    }
    postPost {
      title
    }
  }
}
```

```graphql
{
  "data": {
    "authorUser": {
      "name": "John Doe"
    }
    "postPost": {
      "title": "My biggest Adventure"
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
    authorUser {
      id
    }
    postPost {
      slug
    }
  }
}
```

```graphql
{
  "data": {
    "authorUser": {
      "name": "John Doe"
    }
    "postPost": {
      "slug": "my-biggest-adventure"
    }
  }
}
```

## Errors

When an error occurs for one of your queries or mutations, the `data` field of the query response will usually be `null` and the error `code`, the error `message` and further information will be included in the `errors` field of the response JSON.

### Internal Server Errors

*Internal server errors* indicate that something went wrong with our service - whoops! Find us at our [Slack channel](http://slack.graph.cool) so we can help you out and fix the issue.

You do not have to investigate this issue further in your client application.

> This is how an internal server error might look like:

```graphql
{
  "data": {
    <some query>: null
  },
  "errors": [{
    "message": "Whoops. Looks like an internal server error. Please contact us in Slack (https://slack.graph.cool) and send us your Request ID: <some-request-id>",
    "requestId": <some-request-id>,
    "path": [<some path>],
    "locations": [{
      "line": 1,
      "column": 59
    }]
  }]
}
```

### Client API Errors

A client API error usually indicates that something is not correct with the query or mutation you are trying to send.

Try to investigate your application for possible errors related to the error message.

Maybe the syntax of a request is not correct, or you forgot to include a required query argument?
Another possibility is that the supplied data could not be resolved on our servers.

Here is an overview about all possible client errors:

**Code 1033: id not found**

**Code 1035: invalid id provided**

**Code 1036: unknown argument provided**

**Code 1037: id argument expected but not foundation**

**Code 1038: mutation would violate a unique key constraint**

**Code 1045: referencing a node that does not exist**

**Code 2001: something unexpected happened in a webhook**

**Code 2003: invalid model supplied**

**Code 2004: invalid field supplied**

**Code 2005: node not found**

**Code 2006: supplied both first and last**

**Code 2007: node not in the relation.**

**Code 2008: not allowed to access project**

**Code 2009: edge already exists**

> For example, when you try to update a post but specify a non-existing id:

```graphql
mutation {
  updatePost(id: "wrong-id" title: "My new Title") {
    id
  }
}
```

```graphql
{
  "data": {
    "updatePost": null
  },
  "errors": [
    {
      "locations": [
        {
          "line": 11,
          "column": 3
        }
      ],
      "path": [
        "updatePost"
      ],
      "code": 1033,
      "message": "'Post' has no item with id 'wrong-id'",
      "requestId": "cis68piccx0112azxzoh200ad"
    }
  ]
}
```
