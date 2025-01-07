'use client';
import Price from 'components/price';
import { ProductColor, ProductTile } from 'lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function ProductItem({ product, loading }: { product: ProductTile; loading?: boolean }) {
  const initialColor = product.colors?.[0]?.name ?? '';
  const initialImages = product.colors?.[0]?.images ?? null;
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [selectedVariantImage, setVariantImage] = useState(initialImages);

  const discount = product.discount ?? 0;
  const discountedPrice = product.discount
    ? String(product.price - (product.price * product.discount) / 100)
    : null;

  const handleChangeVariant = (color: string) => {
    setSelectedColor(color);
    const variant = product.colors?.find((c: any) => c.name === color);
    if (variant) {
      setVariantImage(variant.images);
    }
  };

  console.log('Product:::', product);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg">
      <Link href={`/product/${product.handle}`} key={product.id} prefetch={true}>
        <div className="relative flex overflow-hidden rounded-lg border bg-white">
          {discount > 0 && <Promo discountedPrice={String(product.discount)} />}
          {product.colors && product.colors.length > 1 ? (
            <>
              {selectedVariantImage && (
                <>
                  <div className="absolute bottom-0 left-0 flex h-full w-full justify-center bg-white opacity-0 transition-opacity duration-150 ease-out hover:opacity-100">
                    <Image
                      className="h-fit object-cover object-center"
                      src={selectedVariantImage.secondary.url}
                      alt={selectedVariantImage.secondary.altText || product.title}
                      width={selectedVariantImage.secondary.width}
                      height={selectedVariantImage.secondary.height}
                      loading={loading ? 'lazy' : 'eager'}
                    />
                  </div>
                  <Image
                    className="h-full w-full object-cover object-center transition-opacity hover:opacity-0 sm:h-full sm:w-full"
                    src={selectedVariantImage.primary.url}
                    alt={selectedVariantImage.primary.altText || product.title}
                    width={selectedVariantImage.primary.width}
                    height={selectedVariantImage.primary.height}
                    loading={loading ? 'lazy' : 'eager'}
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="
                    placeholder="blur"
                  />
                </>
              )}
            </>
          ) : (
            <Image
              className=""
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              width={product.featuredImage.width}
              height={product.featuredImage.height}
              loading={loading ? 'lazy' : 'eager'}
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
        <small className="flex gap-2">
          {product.discount ? (
            <>
              <span>
                <s className="text-sm">
                  <Price
                    amount={String(product.price)}
                    currencyCode={product.currency}
                    currencyCodeClassName="hidden"
                  />
                </s>
              </span>
              <Price
                className="text-red-500"
                amount={discountedPrice!}
                currencyCode={product.currency}
                currencyCodeClassName="hidden"
              />
            </>
          ) : (
            <Price
              amount={String(product.price)}
              currencyCode={product.currency}
              currencyCodeClassName="hidden"
            />
          )}
        </small>
      </div>
    </div>
  );
}

function ColorSwatch({
  color,
  isAvailable,
  isSelected,
  onClick,
  onMouseEnter
}: {
  color: any;
  isAvailable: boolean;
  isSelected: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <>
      <button
        className={`h-6 w-6 rounded-full border-2 hover:border-black ${
          isSelected ? 'border-sky-900' : 'border-transparent'
        } relative mr-1 ${isAvailable ? 'cursor-pointer' : 'opacity-30'}`}
        aria-label={`Select ${color.name} color`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        <span className="absolute inset-0.5 rounded-full" style={{ backgroundColor: color.code }} />
        {!isAvailable && (
          <span className="absolute left-1/2 top-1/2 z-10 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white" />
        )}
      </button>
    </>
  );
}

function Promo({
  text = 'On Sale!',
  discountedPrice
}: {
  text?: string;
  discountedPrice?: string;
}) {
  return (
    <div className="absolute left-5 top-5 z-10 inline-flex h-7 items-center justify-center gap-3 overflow-hidden rounded-3xl border border-red-600 bg-white px-3 py-1.5">
      <div
        className="h-4 w-16 text-center text-base font-medium leading-none text-red-600"
        aria-label="{text}"
      >
        {text}
      </div>
    </div>
  );
}
