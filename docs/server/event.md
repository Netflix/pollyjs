# Event

## Properties

### type

_Type_: `String`

The event type. (e.g. `request`, `response`, `beforePersist`)

## Methods

### stopPropagation

If several event listeners are attached to the same event type, they are called in the order in which they were added. If `stopPropagation` is invoked during one such call, no remaining listeners will be called.

**Example**

```js
server.get('/session/:id').on('beforeResponse', (req, res, event) => {
  event.stopPropagation();
  res.setHeader('X-SESSION-ID', 'ABC123');
});

server.get('/session/:id').on('beforeResponse', (req, res, event) => {
  // This will never be reached
  res.setHeader('X-SESSION-ID', 'XYZ456');
});
```
