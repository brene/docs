# Simple API

Note: This API is meant for GraphQL clients like Apollo or lokka. If you're using Relay, check the [Relay API](./relay-api) instead.

## Structure

* Root query type
* Queries based on models
* Mutations based on models + relations
* Integrations (queries + mutations)

## Queries

A *query* enables you to declare data requirements in your app and consists of a list of [fields](./platform#field).

Note: All available queries are automatically generated. To explore the queries available to you, you can use the [playground](./platform#playground)

Every query you send has to be wrapped by the *root query type*. It gives you access to all the generated queries for your project and looks like this:

```graphql
query {
  <sub query>
}
```

After you send a query to your [endpoint](./platform#endpoint) you will receive the *query response*, that contains the actual data for all field that were specified in the query.

```graphql
{
  "data": {
    <response data>
  }
}

```

### Generated Queries

There are three categories of generated queries:
* queries to fetch all nodes for a certain model in your project
* queries to fetch one specific node for a certain each model in your project
* one query with information on the active user

To further control the response of a query, you can use different *query arguments*. Available arguments depend on the actual query.

#### All nodes for a certain model

Returns all nodes of a specific model:

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

#### Specific node of a model

Returns a node speficied by a [unique](./platform#unique) query argument:

```graphql
query {
  Post(id: "my-post-id") {
    id
    title
    text
  }
}
```

Note: To select the node, you can supply any field that is marked unique in your project. For example, if you already declared the `title` field of the `Post` model to be unique, you could select a post by specifying its unique title:

```graphql
query {
  Post(title: "My biggest adventure!") {
    id
    title
    text
  }
}
```

### Traverse your data graph

You can traverse your data graph inside a query by including the field of a specific [relation](./platform#relation) and adding nested fields inside the now selected node.

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
### Query Arguments

#### Session user

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

#### Pagination

#### Filtering

Qu

#### Sorting

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
