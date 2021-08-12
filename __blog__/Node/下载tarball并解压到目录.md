```ts
const got = require('got');
const unpackStream = require('unpack-stream');

/**
 * 下载tarball并解压到目录
 */
export const downloadTarball = async (
  tarballUrl: string,
  projectLocation: string
) => {
  const stream = got.stream(tarballUrl);
  await unpackStream.remote(stream, projectLocation);
}

```
