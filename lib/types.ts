export type ImageData = {
  altText: string | null;
  height: number;
  width: number;
  url: string;
};

export type ProductImages = {
  primary: ImageData;
  secondary: ImageData;
};

export type ProductColor = {
  name: string;
  code: string;
  isAvailable: boolean;
  images: ProductImages;
};

export type ProductTile = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  brand: string;
  price: number;
  featuredImage: ImageData;
  currency: string;
  discount?: number;
  colors?: ProductColor[] | null;
  sizes?: (string | boolean)[];
};
