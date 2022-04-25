### get

```js
const _get = (obj, str, def) =>
  str
    .replace(/\[(\d+)\]/, `.$1`)
    .split('.')
    .reduce((acc, key) => Object(acc)[key], obj) || def

const object = { a: [{ b: { c: 3 } }] }

_get(object, 'a[0].b.c')
```

### 