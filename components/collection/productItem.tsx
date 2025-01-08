'use client';
import Badge from 'components/badge';
import ColorSwatch from 'components/colorSwatch';
import { PriceDisplay } from 'components/priceDisplay';
import { ProductColor, ProductImageProps, ProductTile } from 'lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export function ProductItem({ product, loading }: { product: ProductTile; loading?: boolean }) {
  const initialColor = product.colors?.[0]?.name ?? '';
  const initialImages = product.colors?.[0]?.images ?? null;
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [selectedVariantImage, setVariantImage] = useState(initialImages);
  const [isAvailable, setIsAvailable] = useState(true);

  // Calculate discounted price once
  const { discountedPrice, discount } = useMemo(
    () => ({
      discount: product.discount ?? 0,
      discountedPrice: product.discount
        ? String(product.price - (product.price * product.discount) / 100)
        : null
    }),
    [product.price, product.discount]
  );

  const handleChangeVariant = (color: string) => {
    setSelectedColor(color);
    const variant = product.colors?.find((c: any) => c.name === color);
    if (variant) {
      setVariantImage(variant.images);
      setIsAvailable(variant.isAvailable);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg">
      <Link href={`/product/${product.handle}`} key={product.id} prefetch={true}>
        <div className="relative flex overflow-hidden rounded-lg border bg-white">
          {discount > 0 && <Badge label="On Sales!" variant="sale" />}
          {!isAvailable && <Badge label="Sold Out!" variant="soldOut" />}
          {product.colors && product.colors.length > 1 ? (
            <>
              {selectedVariantImage && (
                <>
                  <div className="absolute bottom-0 left-0 flex h-full w-full items-end justify-center bg-white opacity-0 transition-all duration-150 ease-out hover:opacity-100">
                    <ProductImage
                      image={selectedVariantImage.secondary}
                      title={product.title}
                      loading={loading}
                      className="h-full w-auto"
                    />
                  </div>
                  <ProductImage
                    image={selectedVariantImage.primary}
                    title={product.title}
                    loading={loading}
                    className="h-full w-full object-cover object-center transition-all duration-300 ease-out hover:opacity-0 sm:h-full sm:w-full"
                  />
                </>
              )}
            </>
          ) : (
            <ProductImage
              image={product.featuredImage}
              title={product.title}
              loading={loading}
              className="h-full w-full object-cover object-center transition-all duration-300 ease-out sm:h-full sm:w-full"
            />
          )}
        </div>
      </Link>
      <div className="pt- px-4 pb-4 pt-2">
        {product.colors &&
          product.colors.map((color: ProductColor) => (
            <ColorSwatch
              key={color.name}
              isAvailable={color.isAvailable}
              color={color}
              isSelected={selectedColor === color.name}
              onClick={() => handleChangeVariant(color.name)}
            />
          ))}

        <p className="text-left text-sm text-[#111]">{product.brand}</p>
        <h4 className="text-left text-base font-bold text-[#0A4874]">{product.title}</h4>
        <PriceDisplay
          price={product.price}
          discountedPrice={discountedPrice}
          currency={product.currency}
          discount={discount}
        />
      </div>
    </div>
  );
}

function ProductImage({ image, title, loading, className = '' }: ProductImageProps) {
  return (
    <Image
      className={className}
      sizes="(max-width: 359px) 50vw, (max-width: 811px) 50vw, (max-width: 1099px) 25vw, (max-width: 1599px) 25vw, 25vw"
      src={image.url}
      alt={image.altText || title}
      width={image.width}
      height={image.height}
      loading={loading ? 'lazy' : 'eager'}
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="
      placeholder="blur"
    />
  );
}
