// See https://deepbsd.github.io/js,programming/2019/06/22/Run_Length_Encoding_in_Javascript.html

export const decode = (str: string): string => {
  return str.replace(/(\w{2})(\w{2})/g, (_, count, chr) =>
    chr.repeat(parseInt(count, 16))
  );
};

export const encode = (str: string): string => {
  return str.replace(/(\w{2})\1*/g, encodeGroup);
};

// See https://stackoverflow.com/a/34356351/4444546
// Convert a byte to a hex string
export const intToHex = (byte: number): string => {
  if (byte >= 256) {
    throw RangeError(
      `Input byte should be lower than 256 but received ${byte}`
    );
  }
  const current = byte < 0 ? byte + 256 : byte;
  return (current >>> 4).toString(16) + (current & 0xf).toString(16);
};

export const encodeGroup = (group: string, chr: string): string => {
  let length = group.length / 2;
  let hexString = "";
  while (length > 255) {
    hexString += "ff" + chr;
    length -= 255;
  }
  return hexString + intToHex(length) + chr;
};
