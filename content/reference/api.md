# API

## Queries

### Basic query types

* All nodes
* One node
* Nested nodes
* Pagination

### Modifying a basic query

* Filter
* Sort
* Pagination with cursors
* Mutations

## Mutations

### CRUD Mutations

* Create
* Update
* Delete

### Relation Mutations

* Create
* Update
* Delete

## Differences Simple/Relay (this is a internal collection of the status quo)

### Relay has
* viewer/edges/node/
* {pageInfo, edges, totalCount}
* cursor, first&after/last&before
* clientMutationId

### Simple has
* skip/take
