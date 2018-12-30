# Overview

Every polly instance has a reference to a client-side server which you can leverage
to gain full control of all HTTP interactions as well as dictate how the Polly instance
should handle them.

## Usage

```js
const polly = new Polly('<Recording Name>');
const { server } = polly;

// Events & Middleware
server.any().on('request', (req, res) => {
  req.headers['X-Auth-Token'] = 'abc123';
});

// Intercept requests
server.get('/session').intercept((req, res) => {
  res.status(200).json({ user: { email: 'test@netflix.com' } });
});

// Passthrough requests
server.get('/coverage').passthrough();
```

## Defining Routes

The server uses [Route Recognizer](https://github.com/tildeio/route-recognizer)
under the hood. This allows you to define static routes, as well as dynamic,
and starred segments.

**Example**

```js
// Static Routes
server.get('/api/v2/users').intercept((req, res) => {
  res.sendStatus(200);
});

// Dynamic Segments
server.get('http://netflix.com/movies/:id').intercept((req, res) => {
  console.log(req.params.id); // http://netflix.com/movies/1 → '1'
  res.sendStatus(200);
});

// Starred Segments
server.get('/secrets/*path').intercept((req, res) => {
  console.log(req.params.path); // /secrets/foo/bar → 'foo/bar'
  res.status(401).send('Shhh!');
});
```

### Multi Route Handlers

HTTPS methods as well as `.any()` accept a single string
as well as an array of strings.

**Example**

```js
// Match against '/api/v2/users' as well as any child route
server.get(['/api/v2/users', '/api/v2/users/*path']).passthrough();

// Register the same event handler on both '/session' and '/users/session'
server.any(['/session', '/users/session']).on('request', () => {});
```
