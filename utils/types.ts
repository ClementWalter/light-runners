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

export type Layers = Layer[];
