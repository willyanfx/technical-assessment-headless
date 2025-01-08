export type ImageData = {
  altText?: string | null;
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
  sizes?: string[] | boolean;
};

export type Reference = {
  image: ImageData;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type Price = {
  amount: string;
  currencyCode: string;
};

export type Metafield = {
  key: string;
  value: string;
  reference?: Reference | null;
};

export type BaseProductTileVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  image: ImageData;
  metafields: Metafield[];
  selectedOptions: SelectedOption[];
  price: Price;
  compareAtPrice: string | null;
};

export type ProductImageProps = {
  image: ImageData;
  title: string;
  loading?: boolean;
  className?: string;
};
