import Price from './price';

export function PriceDisplay({ price, discountedPrice, currency, discount }: PriceDisplayProps) {
  return (
    <small className="flex gap-2 text-sm">
      {discount > 0 ? (
        <>
          <span>
            <s>
              <Price
                amount={String(price)}
                currencyCode={currency}
                currencyCodeClassName="hidden"
              />
            </s>
          </span>
          <Price
            className="text-red-500"
            amount={discountedPrice ?? String(price)} //
            currencyCode={currency}
            currencyCodeClassName="hidden"
          />
        </>
      ) : (
        <Price amount={String(price)} currencyCode={currency} currencyCodeClassName="hidden" />
      )}
    </small>
  );
}

export type PriceDisplayProps = {
  price: number;
  discountedPrice: string | null;
  currency: string;
  discount: number;
};
