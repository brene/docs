---
title: Relay API
order: 110
description: 
---

graph.cool supports two different schemas: Simple GraphQL API and Relay API. The Relay API includes extra information required for relay to work. If you are not using relay you should probably use the Simple GraphQL API. Both apis work with the same data, so you can always switch later or use both at the same time.

You can read more about the Relay specific elements on the [Relay Website](https://facebook.github.io/relay/) but we will explain all you need to know to get started.

To experiment with the api you can go to the playground in the graph.cool dashboard as described in [getting started](getting-started.html#Overview).

## Queries

Reading data

### List all by type

To get all nodes of a specific type you can use one of the connections on the viewer query type. For example to list all nodes of the built-in User type you could do the following:

```
{viewer { allUsers{ edges{ node{ name }}}}}
```

The `allUsers` connection returns a UserConnection type with 3 fields:

```
{
  pageInfo,
  edges,
  totalCount
}
```

`pageInfo` contains information relevant if you want to provide a paging or infinite scroll experience and `totalCount` is the number of nodes in the connection.

`edges` is a `UserEdge` that contains your actual data and looks like this:

```
{
  node,
  cursor
}
```

`node` is the User. That's why your query above looked like this: 

```
{ edges{ node{ name }}}
```

cursor is a string that contains information about the nodes position in the connection. You can use this together with pageInfo when building a paging or infinite scroll experience.

### Get specific node

If you know the id of the User you want you can query for that specific node:

```
{ User(id: "the id"){ name } }
```

### Sub nodes

The above query returned a User node and we specified in the query that we were interested in just the name from that node. We can use the same notation to retrieve fields from nodes in a connection from the current node. For example we could use this query to get a list of all of a users friends:

```
{ User(id: "the id"){ name, friends{ edges{ node{ name }}}}}
```

### Filter

In the above examples allUsers and friends are connections containing many nodes. When querying a connection you can specify one or more filters to apply. For example you could do the following to retrieve all users from Denmark:

```
{ allUsers(filter: { country: "Denmark" }){ edges{ node{ name }}}}
```

### Sort

You can also sort the nodes in a connection by a specific field:

```
{ allUsers(orderBy: age_DESC){ edges{ node{ name }}}}
```

Use field\_DESC to sort in descending order and field\_ASC to sort in ascending order.

Integer and Float fields are sorted in numeric order and String fields are sorted in lexicographical order.

### Skip and Take

If you have many nodes it is best to retrieve only a small set at a time. To get the first 10 users you can make this query:

```
{ allUsers(take: 10){ edges{ node{ name }}} }
```
 
And to get the next 10:

```
{ allUsers(skip: 10, take: 10){ edges{ node{ name }}} }
```

## Mutations

Storing data

Mutations are the way you create and change data in your graph.cool database. The general form look like this:

```
mutation doSomething(input: {input}) { query }
```
 
`doSomething` is the name of the mutation you want to run. The following sections describe all the possible mutations.

`input` is the input parameters you want the mutation to use. The Relay specification requires that all mutations has an input field called clientMutationId. If you use relay you don't have to think about it, but if you are writing mutations by hand you can simply supply a dummy value like `clientMutationId: "a"`

All mutations return the clientMutationId as well as fields relevant for the type of mutation. For example the create mutation returns the newly created node as well as the edge containing the node. Use `query` to specify the fields you want returned from the mutation result. You always have to specify a query, so if you don't care about the return value you can simply query the clientMutationId like this: `{ clientMutationId }`

### Create

To create a new node you use the create mutation like this:

```
mutation { 
  createTodo(input: {
    task: "Check out react native",
    complete: False,
    clientMutationId: "a"
  })
  {
    clientMutationId
  }
}
```

The createTodo mutation returns the new Todo in the `todo` field and you can query all fields including the automatically generated id.

### Update

To update a node you use the update mutation like this:

```
mutation { 
  updateTodo(input: {
    id: "todoId",
    complete: True,
    clientMutationId: "a"
  })
  {
    clientMutationId
  }
}
```

### Delete

To delete a node you use the delete mutation like this:

```
mutation { 
  deleteTodo(input: {
    id: "todoId",
    clientMutationId: "a"
  })
  {
    clientMutationId
  }
}
```

### Connections

For an introduction to connections see the section in Data Model on [connections](data-model.html#Connections)

Recall our example blog application with A User model and a Post model.

#### Add to connection

You can add a node to a connection using the addToConnection mutation.

To add a Post to a Users posts connection do the following:

```
mutation {
  addTodoTopostsConnectionOnUser(input: {
    fromId: "userId",
    toId: "todoId",
    clientMutationId: "a"
  })
  {
    clientMutationId
  }
}
```

#### Remove from connection

To remove a Post from a Users posts connection do the following:

```
mutation {
  removePostFrompostsConnectionOnUser(input: {
    fromId: "userId",
    toId: "todoId",
    clientMutationId: "a"
  })
  {
    clientMutationId
  }
}
```

#### Creating a node

When creating a node you can add it to a connection by specifying the id of the node in the connection. For example this mutation will create a new Post and add it to the Users posts connection:

```
mutation {
  createPost(input: {
	  title: "Working with mutations",
	  authorId: "user1",
	  clientMutationId: "a"
  })
  {
    clientMutationId
  }
}
```

#### Updating a node

When updating a node you can change the connection it belongs to. For example to move a Post from one use to another:

```
mutation {
  updatePost(input: {
    id: "post1",
    authorId: "user2",
    clientMutationId: "a"
  })
  {
    clientMutationId
  }
}
```

This will remove the post from user1 and add it to user2
