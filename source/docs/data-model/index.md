---
title: Data Model
order: 101
description: The data model is the core concept of your graph.cool backend. It consists of several submodels which combine several typed fields. You can think of a model as a table in a relational database. To control read and write access to your data, you can define user roles and permissions in the dashboard on a field level, to realize your permission requirements.
---

## Models

Data in graph.cool is stored in models. If you are familiar with SQL databases you can think of a model as a database table. If you are not used to working with databases think of models as "things" in your application. If your application is a blog where people can write posts and comment on them you would probably need three models: User, Post and Comment.

### User Model

All graph.cool projects come with a predefined `User` model. You cannot delete the User model, but you can extend it to suit your needs.

#### Fields

All models have a default `id` field and the User model has 3 additional fields: `email`, `password` and `roles`.

The email field is used together with the password field to sign in a user of your application.

When you set a password for the user it is stored in a cryptographically secure way and it is impossible for you to retrieve the original password. If you query the password for a user you will get the hashed version.

The roles field is used in combination with [permissions](#Permissions) and is useful if you have more than one kind of user in your application. For example admin users might be able to do some things that regular users shouldn't.

#### Mutations

> See the [chapter on mutations](/docs/simple-graphql-api/#Mutations) for a general introduction to mutations. This example is using the Simple GraphQL API

To create a new user you can use the createUser mutation like this:

```
mutation {
  createUser(email: "email@domain.com", password: "secret") {
    id
  }
}
```

To sign in a user you can use the signinUser mutation like this:

```
mutation {
  signinUser(email: "email@domain.com", password: "secret") {
    token
  }
}
```

The returned token is a string that identifies the user. You should include this with all requests your application makes on behalf of the user. See the [Security chapter](/docs/security) for information about how to do this.

If you are using the playground in the graph.cool dashboard you can change the token for your requests by selecting a user from the dropdown in the top right corner. This is useful for testing permissions and user specific queries. For example you can get the email of the current user like this:

```
{
  user {
    email
  }
}
```

## Types

In addition to the models you create for your project graph.cool has these built-in types:

#### String

A `String` holds text. This is the type you would use for a username, the content of a blog post or anything else that is best represented as text.

#### Integer

An `Integer` is a number that cannot have decimals. Use this to store values such as the weight of an ingredient required for a recipe or the minimum age for an event.

#### Float

A `Float` is a number that can have decimals. Use this to store values such as the price of an item in a store or the result of complex calculations.

#### Boolean

A `Boolean` can have the value `true` or `false`. This is useful to keep track of settings such as whether the user wants to receive an email newsletter or if a recipe is appropriate for vegetarians.

#### DateTime

The `DateTime` type can be used to store date or time values. A good example might be a person's date of birth. The used format for `DateTime` values is [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and looks like this: `2015-11-22T13:57:31-03:00`

#### Enum

Like a boolean an enum can have one of a predefined set of values. The difference is that you get to decide the possible values. For example you could specify how an article should be formatted by creating an enum with the possible values COMPACT, WIDE and COVER.

#### ID

All nodes in graph.cool are automatically assigned an `id` field of type ID. You use this value when querying specific nodes or adding nodes to relations.

## Constraints

### Unique

Sometimes you want to make sure that two items can not have the same value. A typical example is the email field on the user model.

If you add the unique constraint to a field on a model that has existing data it will fail if there are multiple items with the same value.

If a field is not required multiple items are allowed to have the empty null value even when the field has a unique constraint.

> Please note that only the first 191 characters in a String field are considered unique. Storing two different strings is not possible if the first 191 characters are the same.

### Required

If a field is required, create mutations will fail if no data is specified for the field.

If you add a new required field to a model with existing items, you will have to specify a migrationValue that will be used for all existing items.

Similarly, if you change an existing field from optional to required you have to specify a migrationValue that will be used for all items where that field is empty.

## Default value

You can specify a default value for a field. This is especially useful if you want to make the field optional in create mutations, but ensure that the field always has a meaningful value when you read it. For example you could have an Employee model with a salary field that is required and has the default value 0. Now you can create an Employee without specifying a salary and still be sure that it will never contain null values.


## Permissions

> For a high level overview of the graph.cool security system see [Security](/docs/security/)

<!-- - synonym: ACL -->

In graph.cool permissions are specified on individual fields. This allows you to specify that a user's name should be public while her birthday should be private and her contact details only visible by friends.

### Actions

You can specify permissions for 4 different actions. Read, Create, Update, Delete.

#### Read

Returning the value of the field in a query

#### Create

Setting the value of the field when creating a new node

#### Update

Updating the value for an existing node

#### Delete

todo: what does this even mean? deleting a node vs a field value...

### Permission Types

To specify who should be allowed to perform a certain action you use a combination of three permission types. Guest, Authenticated and Related.

#### Guest

Guest means that anyone can perform the action, even if they are not signed in to your application. If you are creating a blog you probably want to have a Read action with the Guest permission on all blog posts and comments.

#### Authenticated

Authenticated works almost like the Guest permission except users have to be signed in to your application. If you are creating an app that requires users to sign up you can use this permission type instead of Guest.

In addition you can specify that this action is only available to users with a specific role. This is useful if you have more than one type of user in your application. For example you might want users with the `MODERATOR` role to be able to delete other users' comments while `NORMAL` users can only delete their own.

> Note: It is currently not possible to add user roles in the dashboard UI. Please contact us in the [graph.cool slack group](https://slack.graph.cool/) so we can help you out!

#### Related

> This permission type is based on [relations](#Relations) in your schema

If you are used to thinking about security for traditional apis it can be helpful to forget all of that for a moment. If you have never thought about api security before you are in luck. This will be easy for you :-)

A related permission on a certain node allows you to specify that only users who are related to this node in a certain way are allowed to perform a certain action. For example you could specify that only friends of a user can view their location or that only the author of a blog post can delete comments on that post.

When creating a rRelated permission you specify a path to the user who should have access from the node you are adding the permission for.

If you want to limit access to a user's friends the path could look like this:

```plain
User > friends
```

That means that the action will be only allowed if the current user is a friend of the user being queried.

If only the author of a blog post should be able to delete it you would create a permission with the Delete action and the `Related` type and specify the following path:

```plain
Post > author
```

An important thing to remember about related permissions is that the path has to always end in a field of the User type. This field can be then compared with the signed in user to allow or disallow the action.

> Note: It is currently not possible to specify a path longer than 1 step. This limitation will be removed in the near future

## Relations

If two models are related you can create a `Relation` between them. A relation consists of two fields, each one of them belonging to one of the models. If you are used to work with SQL databases you can think of a relation as a foreign key. Even if you are not used to work with databases it is pretty straight forward to use relations in graph.cool.

Let's look at an example. If you are creating a blog you could have two models: User and Post. To keep track of who wrote which post you could have an author relation, with the author field on the Post model and the field posts on the User model:

```plain
Post > author > User
User > posts > Post
```

Relations always go in both directions, so we can consider a path from Post to User (via the author) or from User to Post (via posts).

As you can imagine the `author` field will always contain a User who wrote the Post. The `posts` field on the other hand will contain a list of all the Posts made by a User.

Now, whenever you create a new post you will have to specify what User should be the author for that Post.

Relations are extremely useful when making [queries](/docs/simple-graphql-api/#Queries). This is how you would get all posts by a specific user:

```plain
{
  User(id: "user1") {
    name
    posts {
      title
      text
    }
  }
}
```

returns:

```plain
{
  User: {
    name: "Johannes Schickling",
    posts: [
      {title: "Getting Started with GraphQL", text: "..."},
      {title: "Using Relay with React Native", text: "..."}
    ]
  }
}
```

Imagine you want to make it possible to like a Post. You can accomplish this very easily by creating a likedBy relation between Post and User:

```plain
Post > likedBy > User
User > likedPosts > Post
```

Now you can extend your query to include the names of Users who liked a Post:

```plain
{
  User(id: "user1") {
    name
    posts {
      title
      text
      likedBy {
        name
      }
    }
  }
}
```
