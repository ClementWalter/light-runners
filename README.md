# Light Runners

This project explores the possibilities to optimize the ChainRunners storage.

## Run Length Encoding

The Run Length Encoding is a simple compression algorithm. It is used to reduce the size of the data by storing the number of repetitions of the same value.
For more info, see Wikipedia: [https://en.wikipedia.org/wiki/Run-length_encoding](https://en.wikipedia.org/wiki/Run-length_encoding)

## The SSTORE2 storage

SSTORE2 is an improved sstore command, see https://github.com/0xsequence/sstore2. As visible in the herein charts, the longer the bytes the more efficient the storage is. Hence one save gas when storing all the data in one big `bytes`.

## Results

Gas reduction for deployment + setLayers call:
```
Base deploy cost: 75533478 gas
RLE deploy cost: 68162929 gas
SStore deploy cost: 65495118 gas
SStore-RLE deploy cost: 48417536 gas
SStore-Concat deploy cost: 47667555 gas
SStore-Concat-RLE deploy cost: 30427957 gas
```

Each Renderer contract is ~8M gas to deploy so focusing only on the `setLayers`, one has roughly:
```
Base deploy cost: 67M gas
RLE deploy cost: 60M gas
SStore deploy cost: 58M gas
SStore-RLE deploy cost: 41M gas
SStore-Concat deploy cost: 40M gas
SStore-Concat-RLE deploy cost: 22M gas
```

meaning that the final option is more than 3x lighter than the original one.

## Further improvements

One may want to:
 - create a global color paletette and use 2 bytes instead of 4 bytes as an index of this palette for each trait
 - concat everything into one single `bytes`, then RLE, then split in chunks < 24k
