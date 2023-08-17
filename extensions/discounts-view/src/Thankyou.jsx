import {
  reactExtension
} from '@shopify/ui-extensions-react/checkout';

import { Extension } from './extension.jsx';

export default reactExtension(
  'purchase.thank-you.cart-line-item.render-after',
  () => <Extension />,
);

