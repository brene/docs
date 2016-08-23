# Thinking in Terms of Graphs

Thinking in terms of graphs helps a lot with building a mental model of the data schema used in your application.

In this guide we will explore the terminology related to graphs by looking at a fictional e-commerce platform *Buy Kitten Portraits Online*.

## Overview

* Mental model of graphs is natural, easier to realize in GrpahQL than previously in REST
* Models and Relations
* Nodes and Edges
* Wrapping up
* Further thoughts: permission model and other things are build upon this graph model

The goal of this guide is to introduce concepts and terminology useful
* when thinking about the data schema for your application
* when thinking about specific instantiations of your data schema

## Structuring your data

When you are working on a software project, you inevitably have to come up with a structure that works best for your data.

Using GraphQL, it is very easy to use a data schema in the shape of a *graph*. Graphs are constructs that we already have a natural understanding for. It is not only possible to represent *entities* in a graph but also the *relations* between those entities.

There are two levels to think about data: the data schema level and the actual data level.



If you want to achieve a clean design of your data schema, it proves advantageous to group your data into different *models* and define *relations* between them.

Then later, when thinking of your real data, you can think about indiviual *nodes* connected by *edges*.

> We want to sell awesome kitten portraits on our platform. What entities or processes are we dealing with in the real world that we have to keep track of? Let's list a few, including the properties we need to remember:



## Data Schema

On the data schema level, we think of the general structure of our data and divide it in different categories called [Models](#models). We think about how those categories interact using [relations](#relations).

### Models
* `Customer`: the customer is king - we are interested in the *name*, the *address* and the *payment information* of our customers.
* `Portrait`: kitten portraits are our biggest capital - they have a *size* and a *price*.
* `Order`: an order consists of a *total price* and the *due date*

Let's visualize the progress we made so far on our data schema:

Now we have a good overview of the models that we need. But how do they interact with each other? That's where the real action begins!

### Relations

Models on their own are pretty boring. We should think about how our models relate to each other. This is the meaning of a *relation*.

Let's look at a use case that might happen at our platform:
* A `customer` Sandra is `ordering` one `portrait`
* Sandra is so happy with her first order that next time she is `ordering` multiple `portraits`


We can extract the following relations from this use case:
#### Customers and Orders

* *One* `customer` can make *multiple* `orders`
* *One* `order` can only be issued by *one* `customer`

We name this relation *customerOrders*. It consists of the field *orders* on the `Customer` model and the field *customer* on the `Order` model.

#### Orders and Portraits
* *One* `order` contains *multiple* `portraits`
* *One* `portrait` can appear in *multiple* `orders`

We name this relation *ordersPortraits*. It consists of the field *portraits* on the `Order` model and the field *orders* on the `Portrait` model.

This is starting to get confusing... let's look at our current data schema to get a better understanding of our current situation:

## Data level

Our visualizations help us to think about all the models and relations for our application. But what about the previous use case we had?

* Sandra is `ordering` one `portrait`

On the actual data level, we are interested in specific data items, like the customer Sandra, called [nodes](#nodes). When two nodes are related, we say that they are connected by an [edge](#edges).

### Nodes

That's why we use the term *node* when we talk about actual instantiations of a model:

| Customer | Node 1 | Node 2
|---|---|---|
| name | Sandra | John
| address  | New York | Londong
| payment information  | American Express | Master Card

### Edges

In the same manner we don't want to think of relations when we think about two related nodes. We say that two related nodes are connected with an *edge*.

Let's look at the following graph to visually understand this terminology:

#### Connection

If we talk about all the edges for one specific relation, we call them the *connection*.
