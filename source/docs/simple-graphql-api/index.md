---
title: Simple GraphQL API
order: 102
description: While Relay is a feature-rich framework that can be used to connect to the graph.cool backend, sometimes you don't need the advanced features in your application. In those cases you can use the Simple GraphQL API which is actually quite similar.
---

graph.cool supports two different schemas: Simple GraphQL API and Relay API. If you are not using relay you should probably use the Simple GraphQL API.

To experiment with the api you can go to the playground in the graph.cool dashboard as described in [getting started](/docs/getting-started).

## Queries

Reading data

### List all by type

To get all nodes of a specific type you can use one of the connections on the root query type. For example to list all nodes of the built-in User type you could do the following:

```plain
{
  allUsers {
    name
  }
}
```

### Get specific node

If you know the id of the User you want you can query for that specific node:

```plain
{
  User(id: "the id") {
    name
  }
}
```

### Sub nodes

The above query returned a User node and we specified in the query that we were interested in just the name from that node. We can use the same notation to retrieve fields from nodes in a connection from the current node. For example we could use this query to get a list of all of a users friends:

```plain
{
  User(id: "the id") {
    name
    friends {
      name
    }
  }
}
```

### Filter

In the above examples allUsers and friends are connections containing many nodes. When querying a connection you can specify one or more filters to apply. For example you could do the following to retrieve all users from Denmark:

```plain
{
  allUsers(filter: {country: "Denmark"}) {
    name
  }
}
```

### Sort

You can also sort the nodes in a connection by a specific field:

```plain
{
  allUsers(orderBy: age_DESC) {
    name
  }
}
```

Use field\_DESC to sort in descending order and field\_ASC to sort in ascending order.

Integer and Float fields are sorted in numeric order and String fields are sorted in lexicographical order.

### Skip and Take

If you have many nodes it is best to retrieve only a small set at a time. To get the first 10 users you can make this query:

```plain
{
  allUsers(take: 10) {
    name
  }
}
```

And to get the next 10:

```plain
{
  allUsers(skip: 10, take: 10) {
    name
  }
}
```

## Mutations

Storing data

Mutations are the way you create and change data in your graph.cool database. The general form looks like this:

```plain
mutation doSomething(input) { query }
```

`doSomething` is the name of the mutation you want to run. The following sections describe all the possible mutations.

`input` is the input parameters you want the mutation to use.

All mutations return a node. For example the create mutation returns the newly created node. Use `query` to specify the fields you want returned from the mutation result. You always have to specify a query, so if you don't care about the return value you can simply query the id like this: `{ id }`

### Create

To create a new node you use the create mutation like this:

```plain
mutation {
  createTodo(text: "Check out react native", complete: False) {
    id
  }
}
```

The createTodo mutation returns the new Todo and you can query all fields including the automatically generated id.

### Update

To update a node you use the update mutation like this:

```plain
mutation {
  updateTodo(id: "todoId", complete: True) {
    id
  }
}
```

### Delete

To delete a node you use the delete mutation like this:

```plain
mutation {
  deleteTodo(id: "todoId") {
    id
  }
}
```

### Connections

For an introduction to connections see the section in Data Model on [connections](/docs/data-model#Connections)

Recall our example blog application with a User model and a Post model.

#### Add to connection

You can add a node to a connection using the addToConnection mutation.

To add a Post to a User's posts connection do the following:

```plain
mutation {
  addTodoTopostsConnectionOnUser(fromId: "userId", toId: "todoId") {
    id
  }
}
```

#### Remove from connection

To remove a Post from a Users posts connection do the following:

```
mutation {
  removePostFrompostsConnectionOnUser(fromId: "userId", toId: "todoId") {
    id
  }
}
```

#### Creating a node

When creating a node you can add it to a connection by specifying the id of the node in the connection. For example this mutation will create a new Post and add it to the Users posts connection:

```
mutation {
  createPost(title: "Working with mutations", authorId: "user1") {
    id
  }
}
```

#### Updating a node

When updating a node you can change the connection it belongs to. For example to move a Post from one use to another:

```
mutation {
  updatePost(id: "post1", authorId: "user2") {
    id
  }
}
```

This will remove the post from user1 and add it to user2.
