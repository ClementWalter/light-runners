// See https://deepbsd.github.io/js,programming/2019/06/22/Run_Length_Encoding_in_Javascript.html

export const decode = (str: string): string => {
  return str.replace(/(\w{2})(\w{2})/g, (_, count, chr) =>
    chr.repeat(parseInt(count, 16))
  );
};

export const encode = (str: string): string => {
  return str.replace(
    /(\w{2})\1*/g,
    (group, chr) => intToHex(group.length / 2) + chr
  );
};

// See https://stackoverflow.com/a/34356351/4444546
// Convert a byte to a hex string
export const intToHex = (byte: number): string => {
  const current = byte < 0 ? byte + 256 : byte;
  return (current >>> 4).toString(16) + (current & 0xf).toString(16);
};
