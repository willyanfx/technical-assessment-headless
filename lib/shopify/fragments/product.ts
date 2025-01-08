import imageFragment from './image';
import seoFragment from './seo';

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
    description
    descriptionHtml
    options {
      id
      name
      values
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
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
