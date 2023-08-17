import React, { useEffect, useState } from 'react';
import {
  useApi, 
  Text,
  useTarget,
} from '@shopify/ui-extensions-react/checkout';

export function Extension() {
    const { query } = useApi();
    const { cost, merchandise , quantity } = useTarget();
    const [compareAtPrices, setCompareAtPrices] = useState({});
  console.log(merchandise.id);
    useEffect(() => {
      const fetchCompareAtPrices = async () => {
        const newCompareAtPrices = {};
        try {
  
          const variantId = merchandise.id;
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
            newCompareAtPrices[merchandise.id] = compareAtPrice;
          } else {
            console.log('This product variant does not have a compare at price.');
          }
        
  
        setCompareAtPrices(newCompareAtPrices);
      } catch (error) {
        console.error("Error fetching compareAtPrices: ", error);
      }
      };
  
      fetchCompareAtPrices();
    }, [query, merchandise]);
    const originalPrice = Number(compareAtPrices[merchandise.id]) * quantity;
    const currentPrice = Number(cost.totalAmount.amount);
    const discount = calculateDiscount(originalPrice, currentPrice);
    return (
      <>
            {originalPrice > 0 && (
            <Text key={merchandise.id} appearance="subdued">
              Regular Price: {formatMoney(originalPrice, "USD")} 
            </Text>
            )}
            {discount > 50 && (
              <Text appearance="critical" emphasis="bold">
                {' '} FINAL SALE
              </Text>
            )}
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
  
  function calculateDiscount(originalPrice, currentPrice) {
    console.log(originalPrice +' ORIGINAL PRICE');
    console.log(currentPrice +' CURRENT PRICE');
    const originalPriceInDollars = originalPrice / 100;
    const currentPriceInDollars = currentPrice / 100;
    const discount = ((originalPriceInDollars - currentPriceInDollars) / originalPriceInDollars) * 100;
    return Math.round(discount);
  }
  
  }
  