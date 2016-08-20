# Simple API

Note: This api is meant for Apollo, lokka otherwise see [Relay API](..)

## Structure

* Root query type
* Queries based on models
* Mutations based on models + relations
* Integrations (queries + mutations)

## Queries

... Generated based on the models

### All nodes of a model

### Specific node of a model

### Sub nodes

### Session user

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

