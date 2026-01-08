export const createPaymentIntent = async (amount) => {
  return {
    paymentId: "PAY_" + Math.random().toString(36).slice(2),
    amount,
    currency: "INR",
    status: "created"
  };
};

export const verifyPayment = async (paymentId) => {
  return paymentId.startsWith("PAY_");
};
