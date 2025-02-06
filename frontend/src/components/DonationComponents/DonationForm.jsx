import React, { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import config from "../../Config/config";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY
);

// // API service for payments
// const paymentApi = axios.create({
//   baseURL: `${Config?.apiUrl}/api/v1/payments`,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

const DonationForm = ({ causeId, successUrl, cancelUrl }) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);

  const handleInitiatePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        `${config?.apiUrl}/api/v1/payments/initiate`,
        {
          causeId,
          amount: parseFloat(amount),
          currency: "USD",
          provider: "STRIPE",
          successUrl,
          cancelUrl,
          description: `Donation for cause ${causeId}`,
        }
      );

      setClientSecret(response.data.data.clientSecret);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentStatus = async (donationId) => {
    try {
      const response = await axios.get(
        `${config?.apiUrl}/api/v1/payments/${donationId}/status`
      );
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch payment status:", err);
      return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Make a Donation
        </h2>

        {!clientSecret ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter donation amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <button
              onClick={handleInitiatePayment}
              disabled={!amount || isLoading}
              className={`w-full px-4 py-2 text-white font-medium rounded-md
                ${
                  !amount || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}>
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm onPaymentStatus={handlePaymentStatus} />
          </Elements>
        )}
      </div>
    </div>
  );
};

const CheckoutForm = ({ onPaymentStatus }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/donation/success",
      },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent) {
      const status = await onPaymentStatus(paymentIntent.id);
      if (status && status.status === "COMPLETED") {
        window.location.href = window.location.origin + "/donation/success";
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement className="mb-4" />

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full px-4 py-2 text-white font-medium rounded-md
          ${
            !stripe || isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}>
        {isProcessing ? "Processing..." : "Complete Donation"}
      </button>
    </form>
  );
};

export default DonationForm;
