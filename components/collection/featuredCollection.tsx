import { TAGS } from 'lib/constants';
import { removeEdgesAndNodes, reshapeProducts, shopifyFetch } from 'lib/shopify';
import imageFragment from 'lib/shopify/fragments/image';
import { Product, ShopifyCollectionProductsOperation } from 'lib/shopify/types';
import { transformProduct } from 'lib/utils';
import { ProductItem } from './productItem';

export default async function FeaturedCollection() {
  const homepageItems = await getCollectionProducts({
    collection: 'frontpage'
  });

  console.log('Structure::: ', homepageItems[2]);

  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
        {homepageItems.map((product) => {
          console.log('Product:::', product);
          return <ProductItem key={product.id} product={transformProduct(product)} />;
        })}
      </div>
    </section>
  );
}

// Similar to the product fragment in lib/shopify/fragments/product.ts, however, this one is more detailed such as expecific fields such as metafields to get the sales discount or variants color hex and second image.
//  TODO: make getCollectionProducts function flexible to accept custom fragments and variables
const productFragment = /* GraphQL */ `
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment product on Product {
    id
    handle
    availableForSale
    title
    vendor
    tags
    options {
      id
      name
      values
    }
    metafields(identifiers: [{ namespace: "sales", key: "discount" }]) {
      key
      value
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          image {
            altText
            height
            width
            url
          }
          metafields(
            identifiers: [
              { namespace: "color_variant", key: "color" }
              { namespace: "color_variant", key: "second_image" }
            ]
          ) {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  height
                  width
                  altText
                }
              }
            }
          }
          selectedOptions {
            name
            value
          }
          price {
            ...MoneyProductItem
          }
          compareAtPrice {
            ...MoneyProductItem
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
  }
  ${imageFragment}
`;

const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(sortKey: $sortKey, reverse: $reverse, first: 100) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;

async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
}
