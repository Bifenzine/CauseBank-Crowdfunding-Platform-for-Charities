import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.VITE_APP_STRIPE_PUBLISHABLE_KEY);
console.log("stripePromise", stripePromise);

// Test keys (for development, start with pk_test_ and sk_test_)
// Live keys (for production, start with pk_live_ and sk_live_)

const DonationPaymentForm = ({ donationId, amount, paymentProvider }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleStripePayment = async () => {
    const response = await fetch(
      `/api/v1/payments/create-payment/STRIPE/${donationId}`
    );
    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.error("Payment failed:", result.error);
      // Handle error UI
    } else {
      console.log("Payment successful");
      // Handle success UI
    }
  };

  const handlePayPalPayment = async () => {
    const response = await fetch(
      `/api/v1/payments/create-payment/PAYPAL/${donationId}`
    );
    const { approvalUrl } = await response.json();

    // Redirect to PayPal
    window.location.href = approvalUrl;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (paymentProvider === "STRIPE") {
      await handleStripePayment();
    } else if (paymentProvider === "PAYPAL") {
      await handlePayPalPayment();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {paymentProvider === "STRIPE" && (
        <>
          <CardElement />
          <button type="submit">Pay with Stripe ${amount}</button>
        </>
      )}
      {paymentProvider === "PAYPAL" && (
        <button type="submit">Pay with PayPal ${amount}</button>
      )}
    </form>
  );
};

// Only wrap with Stripe Elements if using Stripe
export const PaymentWrapper = (props) => {
  if (props.paymentProvider === "STRIPE") {
    return (
      <Elements stripe={stripePromise}>
        <DonationPaymentForm {...props} />
      </Elements>
    );
  }
  return <DonationPaymentForm {...props} />;
};
