import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FaHeart, FaLock } from "react-icons/fa";
import axios from "axios";
import config from "../../Config/config";
import { getCauseDetail } from "../../DataFetching/DataFetching";
import { useAuthContext } from "../../Context/AuthContext.jsx";

const stripePromise = loadStripe(config.StripePublishableKey);

console.log("stripePromise", stripePromise);
console.log("config.StripePublishableKey", config.StripePublishableKey);

const DonationPage = () => {
  const { authUser, token } = useAuthContext();
  const { causeId } = useParams();
  const [cause, setCause] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState(null);
  const [anonymous, setAnonymous] = useState(true);

  // Calculate remaining amount needed
  const getRemainingAmount = () => {
    if (!cause) return 0;
    const remaining = cause.goalAmount - cause.currentAmount;
    return Math.max(0, Math.min(remaining, 999999));
  };

  const predefinedAmounts = [10, 30, 50, 100, 250, 500].filter(
      amount => amount <= getRemainingAmount()
  );

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#3b82f6",
    },
  };

  useEffect(() => {
    fetchCause();
  }, [causeId]);

  const fetchCause = async () => {
    try {
      const response = await getCauseDetail(causeId);
      setCause(response.data.data);
    } catch (err) {
      setError("Failed to load cause details");
    } finally {
      setLoading(false);
    }
  };

  const validateAmount = (amount) => {
    const numAmount = parseFloat(amount);
    const remainingAmount = getRemainingAmount();

    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return false;
    }

    if (numAmount > remainingAmount) {
      setError(`Maximum donation amount for this cause is $${remainingAmount.toLocaleString()}`);
      return false;
    }

    if (numAmount > 999999) {
      setError("Maximum donation amount is $999,999");
      return false;
    }

    setError(null);
    return true;
  };

  const initializePayment = async (amount) => {
    if (!validateAmount(amount)) return;

    try {
      setLoading(true);
      const response = await axios.post(
          `${config.apiUrl}/api/v1/payments/create-intent`,
          {
            causeId: cause.id,
            amount: parseFloat(amount),
            currency: "USD",
            provider: "STRIPE",
            successUrl: `${window.location.origin}/donations`,
            cancelUrl: `${window.location.origin}/donations?cancel`,
            description: `Donation for ${cause.title}`,
            donorId: authUser?.id ? authUser?.id : null,
            isAnonymous: anonymous
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
      );

      if (response.data.success) {
        setClientSecret(response.data.data.clientSecret);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || (value.match(/^\d*\.?\d{0,2}$/) && !value.startsWith("."))) {
      setCustomAmount(value);
      setSelectedAmount(null);
      validateAmount(value);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
        </div>
    );
  }

  if (!cause) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500">Failed to load cause details</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Panel - Cause Information */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
                <div className="flex items-center gap-2 mb-6">
                  <FaHeart className="text-pink-400" />
                  <span className="text-pink-200 font-medium">
                  Make a Difference
                </span>
                </div>

                <h1 className="text-3xl font-bold mb-6">{cause.title}</h1>

                <div className="bg-white/10 rounded-xl p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Raised</span>
                    <span className="font-bold">
                    ${cause.currentAmount?.toLocaleString()}
                  </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div
                        className="bg-blue-400 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                              (cause.currentAmount / cause.goalAmount) * 100,
                              100
                          )}%`,
                        }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Goal: ${cause.goalAmount?.toLocaleString()}</span>
                    <span>
                    {((cause.currentAmount / cause.goalAmount) * 100).toFixed(1)}%
                  </span>
                  </div>
                </div>

                <div className="space-y-4 mt-auto">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <FaLock className="text-green-400" />
                      <span>Secure Payment</span>
                    </div>
                    <p className="text-sm mt-2 text-blue-100">
                      Your donation is secured by bank-grade encryption
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Panel - Payment Form */}
              <div className="p-8">
                {!clientSecret ? (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Select Amount
                      </h2>

                      <div className="grid grid-cols-3 gap-3">
                        {predefinedAmounts.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => {
                                  setSelectedAmount(amount);
                                  setCustomAmount("");
                                  setError(null);
                                }}
                                className={`py-3 px-4 rounded-xl transition-all ${
                                    selectedAmount === amount
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                                }`}>
                              ${amount}
                            </button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Amount (Max ${getRemainingAmount().toLocaleString()})
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={getRemainingAmount()}
                            step="0.01"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-blue-500 focus:border-blue-500 outline-none ${
                                error ? 'border-red-500' : 'border-gray-400'
                            }`}
                            placeholder={`Enter amount (1-${getRemainingAmount().toLocaleString()})`}
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                      </div>

                      {/* Anonymous Donation Section */}
                      {authUser && authUser?.id ? (
                          <div className="bg-gray-50 rounded-xl p-4 mt-4">
                            <div className="flex items-center gap-2">
                              <FaLock className="text-green-400" />
                              <span className="text-lg font-medium text-gray-700">
                          Anonymous Donation
                        </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                              Check this box if you'd like your donation to remain anonymous.
                              We respect your privacy, and your donation will not be publicly
                              associated with your name.
                            </p>
                            <div className="mt-4 flex items-center">
                              <input
                                  type="checkbox"
                                  checked={anonymous}
                                  onChange={(e) => setAnonymous(e.target.checked)}
                                  className="mr-2"
                              />
                              <span className="text-gray-700">
                          Make this donation anonymous
                        </span>
                            </div>
                          </div>
                      ) : null}

                      <button
                          onClick={() => initializePayment(customAmount || selectedAmount)}
                          disabled={
                              loading ||
                              (!selectedAmount && !customAmount) ||
                              error
                          }
                          className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? "Processing..." : "Continue to Payment"}
                      </button>
                    </div>
                ) : (
                    <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance,
                          loader: "auto",
                        }}>
                      <CheckoutForm />
                    </Elements>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donation/success`,
        },
      });

      if (submitError) {
        setError(submitError.message);
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <PaymentElement />
          </div>

          {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>
          )}

          <button
              type="submit"
              disabled={!stripe || processing}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {processing ? "Processing..." : "Complete Donation"}
          </button>
        </div>
      </form>
  );
};

export default DonationPage;