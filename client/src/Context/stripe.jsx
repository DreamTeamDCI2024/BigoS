import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_test_51Ps9oxKc6TGOcmdDNqRgGIDY0qTbzxgDdqtEQ09ekUFvSMVelQSbaghFthc7OEAbhLGLfGWtiETwNYsnW6ZZw8zF00B0pHn5TU');
  }
  return stripePromise;
};

export default getStripe;