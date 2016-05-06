---
title: Security
order: 130
description: 
---

Graph.cool has a strong security model built in. You can read about setting permissions on individual fields in the [Data Model](data-model.html#Permissions) chapter.

## Authentication

Users in your graph.cool project are just regular data nodes of the built-in [User model](data-model.html#User-Model). This means that to sign up a new user you simple run the createUser mutation. The User model has one special mutation to support sign-in using email and password:

```
mutation {
  signinUser(email: "email@domain.com", password: "secret"){ token }
}
```

Passwords are stored in a cryptographically secure way. Running the signinMutation will look up the user with the given email and check that the password matches.

> note: graph.cool will support signin via thirdparty platforms such as facebook and twitter in the near future.

The returned token uniquely identifies the user and must be supplied in the request whenever you query data or perform a mutation on behalf of the user.

The token can be supplied in two ways: as an `Authorization` header or the `access_token` query parameter.

If you use the query parameter the url would look like this:

```
https://api.graph.cool/simple/v1/__YOUR_PROJECT_ID__?access_token=token
```

If you load this url in a browser it will render the same playground available in a dashboard, so that's a quick way to test that everything is working correctly.

If you provide the token in a header it should look like this:

```
Authorization: Bearer {token}
```

If you are using [Lokka](https://github.com/kadirahq/lokka) it could look like this:

```
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
    
const headers = { Authorization: `Bearer ${token}` }
const transport = new Transport('https://api.graph.cool/simple/v1/__YOUR_PROJECT_ID__', { headers })
const lokka = new Lokka({ transport })
```

If you are using [Relay](https://facebook.github.io/relay/) it could look like this:

```
import { injectNetworkLayer, DefaultNetworkLayer } from 'react-relay'

const headers = { Authorization: `Bearer ${token}` }
const layer = new DefaultNetworkLayer('https://api.graph.cool/relay/v1/__YOUR_PROJECT_ID__', { headers, retryDelays: [] })
injectNetworkLayer(layer)
```
