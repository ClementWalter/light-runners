// See https://deepbsd.github.io/js,programming/2019/06/22/Run_Length_Encoding_in_Javascript.html

export const decode = (str: string): string => {
  return str.replace(/(\d+)(\w{2})/g, (_, count, chr) => chr.repeat(count));
};

export const encode = (str: string): string => {
  return str.replace(/(\w{2})\1*/g, (group, chr) => group.length / 2 + chr);
};
