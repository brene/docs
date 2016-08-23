This guide will serve as a walkthrough throughout our dashboard. After this, you should be able to become a Graphcool Ninja!
# Project Selection
First things first. On the top left corner you can select the project you are working on. If you want to create a new project, click on the dropdown arrow and click on `+ New Project` below your existing projects.
*Try creating a new project called “Twitr” 🐦.* 
# Thinking in Graphs
The most important thing of using GraphQL is thinking of your data as a network of interconnected nodes and edges. Each node has fields that serves as their descriptor.
## Working with Models
The models are the most prominent things in the side bar. You can think of models as a schema if you come from an SQL world. They define a certain structure for the nodes of their type. In our example the `Tweet` model has a `content` field that describes the actual text of the tweet. To view this you can either look up the columns in the Data Browser or go to the Structure subpage to look at the all available fields at a glance.
*Let’s add a model called “Tweet”*
## Structure using Fields
By adding new fields with the `+ Create Field` button on the top left corner of the Structure page you can add additional descriptors to your model. You can add scalar value types such as string, boolean, integer and so on…
Tip: If you can’t give your field a descriptive name you can always set a description 😉
*Give your “Tweet” model some love by adding a “content” field of type “String”.*
## Populating Nodes with the Data Browser
In your data browser you can add nodes (instantiations of a model). In the SQL world you would say a data row. By clicking on `+ Add Node` a new node appears and as soon as you fill out all the required fields you can click add and it’s saved. You can always double-click on a field to edit the field.
*Get to work and add a few nodes for your tweet and user models. (Better have at least 3 Tweets and 2 Users before jumping to the next section🤓)*
## Context through Relations
Edges in a graph are the instantiations of relations. A relation symbolizes the connection between two models. You can see all your relations in the relations page. You can edit or delete your existing ones as well as add new ones. The relation can have different multiplicities, names and descriptions. Clearly think about your use case before creating a relation. Try to start with the multiplicities. Think in terms of *one “A” can have one/many “B” and one “B” can have one/many “A”.*

*Try adding a new relation called “Tweeting” and prepare it’s schema to represent a user can author many tweets and a tweet only has one author.*

*Solution: __One__ User in field __tweets__ <-> __Many__ [Tweet] in field __author__*
# Querying and Mutation your Nodes
The playground gives you a GraphiQL editor to easily query and mutate your nodes. If you don’t know what to enter, you can always rely on the docs or try your luck with the autocomplete. If you already understand what GraphQL is, it is notable to tell you that we have a simple API and a Relay API. You can find the endpoints on the top right corner of the window. You can also configure the GraphiQL editor to use that Relay endpoint by selecting it in the dropdown menu location in the top center of the playground.
If you don’t know how to query or mutate data using GraphQL, I highly encourage you to read through [this guide](www.example.com).
*Give the editor a shot and try to get the following information with one query. Every tweet’s content as well as the email of their authors.*

# Business Logic with Actions
Ever wanted to subscribe your user’s to a mailing list that sends out emails about product updates? Of course you do! Everyone wants to drive user engagement. If you want to implement business logic within Graphcool, the action feature is made for you. On the action page, you can create a new action by clicking on `+ New Action`. You’ll be prompted to specify a `trigger` and a `handler`. 
- A handler is your handles your business logic. For instance, creating subscribing an email to a mailing list. 
- A trigger contains the information on when to call the handler and provide it with which information. 
The handler payload is a GraphQL query that specifies which data should be passed on. If a node has been created you can find all its information under the edge `createdNode`.

*Try building an action that passes the email of a newly created user to a webhook that adds the email to your Mailchimp list. If you don’t have Mailchimp, you can also create a new web task at [webtaks.io](www.webtask.io).*
