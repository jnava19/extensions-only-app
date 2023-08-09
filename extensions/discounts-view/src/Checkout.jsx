import React, { useEffect, useState } from 'react';
import {
  useApi, 
  Text,
  useTarget,
  reactExtension
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);

function Extension() {
  const { query } = useApi();
  const { title, lines } = useTarget();
  const [compareAtPrices, setCompareAtPrices] = useState({});

  useEffect(() => {
    const fetchCompareAtPrices = async () => {
      const newCompareAtPrices = {};

      for (const lineItem of lines) {
        const variantId = lineItem.merchandise.id;
        const result = await query(
           `query($variantId: ID!) {
            node(id: $variantId) {
              ... on ProductVariant {
                compareAtPrice{
                  amount
                }
              }
            }
          }`,
          {
            variables: {
              variantId: variantId,
            },
          },
          );
        const compareAtPrice = result.data?.node?.compareAtPrice?.amount;

        if (compareAtPrice) {
          newCompareAtPrices[lineItem.id] = compareAtPrice;
        } else {
          console.log('This product variant does not have a compare at price.');
        }
      }

      setCompareAtPrices(newCompareAtPrices);
    };

    fetchCompareAtPrices();
  }, [query, lines]);

  return (
    <>
      {lines.map((lineItem) => {
        const price = compareAtPrices[lineItem.id];
        if (!price) {
          return null;
        }

        return (
          <Text key={lineItem.id} appearance="subdued">
            Regular Price: {formatMoney(price, "USD")}
          </Text>
        );
      })}
    </>
  );

function formatMoney(amount = 0, currencyCode = 'USD') {
  const options = {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  };

  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  const formatter = new Intl.NumberFormat('en-US', options);

  return formatter.format(amount);
}

}




