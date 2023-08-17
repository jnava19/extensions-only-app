import {
    reactExtension
  } from '@shopify/ui-extensions-react/checkout';
  
  import { Extension } from './extension.jsx';
  
  export default reactExtension(
    'customer-account.order-status.cart-line-item.render-after',
    () => <Extension />,
  );