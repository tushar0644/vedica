"use server";
import axios from "axios";
import { getBackendCookieHeader } from "../auth/get-auth";

const BASE_URL = process.env.BACKEND_URL!;

export const acceptOfferLetter = async (application: string) => {
  try {
    const cookie = await getBackendCookieHeader();
    const response = await axios.post(
      `${BASE_URL}/api/method/accept_offer_letter`,
      { application },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    return {
      success: true,
      data: response.data.message,
    };
  } catch (err: any) {
    console.error("[PAYMENTS][ACCEPT_OFFER][ERROR]", err.response?.data || err);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to accept offer letter",
    };
  }
};

export const getPaymentStatus = async (application: string) => {
  try {
    const cookie = await getBackendCookieHeader();
    const response = await axios.get(
      `${BASE_URL}/api/method/get_payment_status`,
      {
        params: { application },
        headers: {
          Cookie: cookie,
        },
      }
    );
    return {
      success: true,
      data: response.data.message,
    };
  } catch (err: any) {
    console.error("[PAYMENTS][GET_STATUS][ERROR]", err.response?.data || err);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch payment status",
    };
  }
};

export const createRazorpayOrder = async (application: string, amount: number) => {
  try {
    const cookie = await getBackendCookieHeader();
    const response = await axios.post(
      `${BASE_URL}/api/method/create_razorpay_order`,
      { application, amount },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    return {
      success: true,
      data: response.data.message,
    };
  } catch (err: any) {
    console.error("[PAYMENTS][CREATE_ORDER][ERROR]", err.response?.data || err);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to create Razorpay order",
    };
  }
};

export const verifyRazorpayPayment = async (payload: {
  application: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  try {
    const cookie = await getBackendCookieHeader();
    const response = await axios.post(
      `${BASE_URL}/api/method/verify_razorpay_payment`,
      payload,
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    return {
      success: true,
      data: response.data.message,
    };
  } catch (err: any) {
    console.error("[PAYMENTS][VERIFY_PAYMENT][ERROR]", err.response?.data || err);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to verify Razorpay payment",
    };
  }
};
