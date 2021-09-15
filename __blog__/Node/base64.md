```ts
export const base64 = {
  encode(str: string) {
    return Buffer.from(str).toString('base64');
  },
  decode(base64Str: string) {
    return Buffer.from(base64Str, 'base64').toString('ascii');
  },
};

```
