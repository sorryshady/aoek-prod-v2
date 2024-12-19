export const handleOrder = async (amount: number) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ AMOUNT: amount }),
  });
  const data = await response.json();
  return data;
};

export const verifyPayment = async (successData: {
  orderCreationId: any;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}) => {
  const result = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/verify`, {
    method: "POST",
    body: JSON.stringify(successData),
    headers: { "Content-Type": "application/json" },
  });
  const res = await result.json();
  if (res.isOk) {
    return res;
  }
};
