export type Traits = Record<string, Record<string, string>>;

export type Layer = {
  [key: string]: string;
};

export type Layers = {
  [key: string]: Layer;
};
