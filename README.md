# Light Runners

This project explores the possibilities to optimize the ChainRunners storage.

## Run Length Encoding

The Run Length Encoding is a simple compression algorithm. It is used to reduce the size of the data by storing the number of repetitions of the same value.
For more info, see Wikipedia: [https://en.wikipedia.org/wiki/Run-length_encoding](https://en.wikipedia.org/wiki/Run-length_encoding)

Achieved reduction got by running the light-runners task:
```
Original bytes count: 136864
Light bytes count: 54432
Ratio: 40%
Average light bytes length: 165 VS 416
Max light bytes length: 770 VS 416
```
