export type LayerInput = {
  name: string;
  hexString: string;
  layerIndex: number;
  itemIndex: number;
};

export type Layer = {
  traitName: string;
  itemName: string;
  hexString: string;
  layerIndex: number;
  itemIndex: number;
};

export type LayerConcat = {
  itemName: string;
  hexString: string;
  layerIndex: string;
  itemIndex: string;
};

export type LayerConcatRLE = {
  itemName: string;
  hexString: string;
  layerIndex: string;
};

export type Layers = Layer[];
