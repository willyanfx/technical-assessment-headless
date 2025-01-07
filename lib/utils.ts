import { ReadonlyURLSearchParams } from 'next/navigation';
import { ProductVariant, ShopifyProduct } from './shopify/types';
import { ProductTile } from './types';

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

//  goal to transform the product data from the Shopify Storefront API into a more manageable format and **satisfy the typescript lint rules**.
const findMetafieldValue = (metafields: any[] | null | undefined, key: string): string => {
  if (!metafields || !Array.isArray(metafields)) return '0';

  const field = metafields.find((field) => field && typeof field === 'object' && field.key === key);
  return field?.value || '0';
};

export function transformProduct(product: ShopifyProduct): ProductTile {
  const variants = product.variants as unknown as ProductVariant[];

  const allSizes = product.options
    .flatMap((option) =>
      option?.name === 'Size' && Array.isArray(option?.values) ? option.values : []
    )
    .filter(Boolean);

  const colors = [
    ...new Set(
      variants
        .map(
          (variant: { selectedOptions: { name: string; value: string }[] }) =>
            variant.selectedOptions.find((option) => option.name === 'Color')?.value
        )
        .filter(Boolean)
    )
  ];

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
      discount: parseFloat(findMetafieldValue(product.metafields, 'discount')),
      colors: [],
      sizes: allSizes
    };
  }

  const newColors = colors.map((colorVariant) => {
    const color = colorVariant as string;
    // Find base variant with color metafield
    const baseVariant = variants.find(
      (variant) =>
        variant.selectedOptions.find((option) => option.name === 'Color')?.value === color &&
        variant.metafields?.[0]?.key === 'color'
    );

    console.log('BASE:::: ', baseVariant);

    // Get all variants for this color
    const colorVariants = variants.filter(
      (variant) =>
        variant.selectedOptions.find((option) => option.name === 'Color')?.value === color
    );

    // Images
    const primaryImage = baseVariant?.image || null;

    const secondaryImage = baseVariant?.metafields?.find((field) => field.key === 'second_image')
      ?.reference?.image;

    return {
      name: color,
      code: findMetafieldValue(baseVariant?.metafields, 'color') || 'transparent',
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

  const discount = parseFloat(findMetafieldValue(product.metafields, 'discount'));

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
