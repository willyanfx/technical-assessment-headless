import { ReadonlyURLSearchParams } from 'next/navigation';
import { ShopifyProduct } from './shopify/types';
import { ProductColor, ProductTile } from './types';

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN'];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes('[') ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes(']')
  ) {
    throw new Error(
      'Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.'
    );
  }
};

export function transformProduct(product: ShopifyProduct): ProductTile {
  const allSizes = product.options
    .flatMap(
      (options: { name: string; values: string }) => options.name === 'Size' && options.values
    )
    .filter(Boolean);

  const colors = [
    ...new Set(
      product.variants
        .map((variant) => variant.selectedOptions.find((option) => option.name === 'Color')?.value)
        .filter(Boolean)
    )
  ];

  console.log('COLOR::::: ', colors);

  if (!colors.length) {
    return {
      id: product.id,
      handle: product.handle,
      availableForSale: product.availableForSale,
      title: product.title,
      brand: product.vendor,
      featuredImage: product.featuredImage,
      price: parseFloat(product.priceRange.minVariantPrice.amount),
      currency: product.priceRange.minVariantPrice.currencyCode,
      discount: parseFloat(
        product.metafields?.find((field: { key: string }) => field.key === 'discount')?.value || '0'
      ),
      colors: [],
      sizes: allSizes
    };
  }

  const newColors: ProductColor[] = colors.map((colorVariant) => {
    const color = colorVariant as string;
    // Find base variant with color metafield
    const baseVariant = product.variants.find(
      (variant) =>
        variant.selectedOptions.find((option) => option.name === 'Color')?.value === color &&
        variant.metafields?.[0]?.key === 'color'
    );

    // Get all variants for this color
    const colorVariants = product.variants.filter(
      (variant) =>
        variant.selectedOptions.find((option) => option.name === 'Color')?.value === color
    );

    // Find images
    const primaryImage = product.images.find((img: { altText: string }) =>
      img.altText?.toLowerCase().includes(color.toLowerCase())
    );

    const secondaryImage = baseVariant?.metafields?.find(
      (field: { key: string }) => field.key === 'second_image'
    )?.reference?.image;

    return {
      name: color,
      code:
        baseVariant?.metafields?.find((field: { key: string }) => field.key === 'color')?.value ||
        'transparent',
      isAvailable: colorVariants.some(
        (variant: { availableForSale: boolean }) => variant.availableForSale
      ),
      images: {
        primary: primaryImage
          ? {
              altText: primaryImage.altText,
              height: primaryImage.height,
              width: primaryImage.width,
              url: primaryImage.url
            }
          : null,
        secondary: secondaryImage
          ? {
              altText: secondaryImage.altText || primaryImage?.altText || null,
              height: secondaryImage.height,
              width: secondaryImage.width,
              url: secondaryImage.url
            }
          : null
      }
    };
  });

  const discount = parseFloat(
    product.metafields?.find((field: { key: string }) => field.key === 'discount')?.value || '0'
  );

  return {
    id: product.id,
    handle: product.handle,
    availableForSale: product.availableForSale,
    title: product.title,
    brand: product.vendor,
    featuredImage: product.featuredImage,
    price: parseFloat(product.priceRange.minVariantPrice.amount),
    currency: product.priceRange.minVariantPrice.currencyCode,
    discount,
    colors: newColors,
    sizes: allSizes
  };
}
