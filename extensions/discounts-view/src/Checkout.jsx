import {
  reactExtension
} from '@shopify/ui-extensions-react/checkout';

import { Extension } from './extension.jsx';

export default reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);



