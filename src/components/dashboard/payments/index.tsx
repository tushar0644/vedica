"use client";

import React, { useEffect, useState } from "react";
import { useApplicationFormListStore } from "@/store/application-form/list.store";
import { useInterviewStatus } from "@/hooks/use-interview";
import { isPaymentEligible } from "@/lib/interview-eligibility";
const acceptOfferLetter = async (application: string) => {
  const res = await fetch("/api/v1/payments/accept-offer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ application })
  });
  return res.json();
};

const getPaymentStatus = async (application: string) => {
  const res = await fetch(`/api/v1/payments/status?application=${application}`);
  return res.json();
};

const createRazorpayOrder = async (application: string, amount: number) => {
  const res = await fetch("/api/v1/payments/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ application, amount })
  });
  return res.json();
};

const verifyRazorpayPayment = async (payload: any) => {
  const res = await fetch("/api/v1/payments/verify-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
};
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Script from "next/script";
import { 
  CheckCircle, 
  CreditCard, 
  Receipt, 
  Hourglass, 
  Info, 
  Sparkles, 
  ChevronRight,
  History
} from "lucide-react";
import NoPayments from "./no-payments";

interface PaymentStatusData {
  amount_paid: number;
  amount_due: number;
  is_fully_paid: boolean;
  payments?: any[];
  past_payments?: any[];
}

export default function Payments() {
  const { data: applications, refetch: refetchApps, isLoading: appsLoading } = useApplicationFormListStore();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusData | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentOption, setPaymentOption] = useState<"full" | "partial" | "custom">("full");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Find the first active/relevant application
  const activeApp = applications && applications.length > 0 ? (applications[0] as any) : null;
  const appId = activeApp?.name;
  const currentWorkflowState = activeApp?.workflow_state || "Draft";

  // Check if interview is booked (required for payment eligibility)
  const { data: interviewBooking, isLoading: interviewLoading } = useInterviewStatus();
  const paymentAllowed = isPaymentEligible(activeApp, !!interviewBooking);

  // Fetch payment status if in payment-relevant states
  const isPaymentState = [
    "Offer Letter Accepted", 
    "Payment Pending", 
    "Enrolled"
  ].includes(currentWorkflowState);

  const fetchStatus = async () => {
    if (!appId || !isPaymentState) return;
    setLoading(true);
    try {
      const res = await getPaymentStatus(appId);
      if (res.success && res.data) {
        setPaymentStatus(res.data);
        const due = res.data.amount_due || 0;
        setSelectedAmount(due);
        if (due > 25000) {
          setPaymentOption("partial");
        } else {
          setPaymentOption("full");
        }
      } else {
        toast.error(res.message || "Failed to load payment summary");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [appId, currentWorkflowState]);

  // Handle Offer Acceptance
  const handleAcceptOffer = async () => {
    if (!appId) return;
    setLoading(true);
    try {
      const res = await acceptOfferLetter(appId);
      if (res.success) {
        toast.success("Offer accepted successfully! Unlocking payment flow.");
        await refetchApps();
      } else {
        toast.error(res.message || "Failed to accept offer letter");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Set default payment amounts based on selection
  useEffect(() => {
    if (!paymentStatus) return;
    const due = paymentStatus.amount_due || 0;
    if (paymentOption === "full") {
      setSelectedAmount(due);
    } else if (paymentOption === "partial") {
      setSelectedAmount(Math.min(25000, due));
    } else if (paymentOption === "custom") {
      const val = parseFloat(customAmount) || 0;
      setSelectedAmount(val);
    }
  }, [paymentOption, customAmount, paymentStatus]);

  // Handle Razorpay Payment Checkout
  const handlePayNow = async () => {
    if (!appId || !paymentStatus) return;
    if (selectedAmount <= 0) {
      toast.warning("Please enter a valid payment amount.");
      return;
    }
    if (selectedAmount > paymentStatus.amount_due) {
      toast.error(`Payment amount cannot exceed the remaining due amount of ₹${paymentStatus.amount_due.toLocaleString()}`);
      return;
    }
    if (!razorpayLoaded) {
      toast.error("Razorpay SDK is loading. Please wait a moment.");
      return;
    }

    setLoading(true);
    try {
      const orderRes = await createRazorpayOrder(appId, selectedAmount);
      if (!orderRes.success || !orderRes.data) {
        toast.error(orderRes.message || "Failed to initiate transaction");
        setLoading(false);
        return;
      }

      const { order_id, amount: amountPaise, key_id } = orderRes.data;

      const options = {
        key: key_id,
        amount: amountPaise,
        currency: "INR",
        name: "Vedica Scholars Programme",
        description: `Admission Fee Payment for ${appId}`,
        order_id: order_id,
        handler: async function (response: any) {
          setLoading(true);
          try {
            const verifyRes = await verifyRazorpayPayment({
              application: appId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              toast.success("Payment verified and completed successfully!");
              await refetchApps();
              await fetchStatus();
            } else {
              toast.error(verifyRes.message || "Payment verification failed.");
            }
          } catch (e) {
            console.error(e);
            toast.error("An error occurred during verification.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment checkout cancelled.");
          },
        },
        prefill: {
          email: activeApp?.email_id || "",
          contact: activeApp?.mobile_number || "",
        },
        theme: {
          color: "#293d8f",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      toast.error("Failed to proceed with payment.");
    } finally {
      setLoading(false);
    }
  };

  const getPastPayments = () => {
    if (!paymentStatus) return [];
    return paymentStatus.payments || paymentStatus.past_payments || [];
  };

  if (appsLoading || interviewLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  // Case: No application exists or status is too early
  const isNoOfferState = !activeApp || ![
    "Offer Letter Sent",
    "Offer Letter Accepted",
    "Payment Pending",
    "Enrolled"
  ].includes(currentWorkflowState);

  if (isNoOfferState) {
    return (
      <div className="space-y-6">
        <NoPayments />
        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 flex gap-3 text-sm text-blue-700">
          <Info className="h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <p className="font-semibold">Offer Letter Dependent Access</p>
            <p className="text-blue-600/90 mt-1">
              Your application is currently in the <strong>{currentWorkflowState}</strong> state. Once your application is reviewed and an offer letter is issued, your payment methods and summary will unlock here automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Case: Interview not yet booked — gate payment behind interview completion
  if (!paymentAllowed) {
    return (
      <div className="space-y-6">
        <NoPayments />
        <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4 flex gap-3 text-sm text-amber-700">
          <Info className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">Interview Required</p>
            <p className="text-amber-600/90 mt-1">
              Complete your interview to unlock the payment section. Please schedule and complete your interview first, then return here to proceed with admission payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#293d8f] to-[#1e2d6b] p-6 rounded-xl text-white shadow-md">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-2">
            <Sparkles className="h-3 w-3" />
            Scholarship Dashboard
          </span>
          <h1 className="text-2xl font-bold">Admission Payment Workflow</h1>
          <p className="text-white/80 text-sm mt-1">Application ID: {appId}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-white/80">Status:</span>
          <span className={`px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${
            currentWorkflowState === "Enrolled" 
              ? "bg-emerald-500 text-white"
              : currentWorkflowState === "Offer Letter Sent"
              ? "bg-amber-500 text-white animate-pulse"
              : "bg-indigo-500 text-white"
          }`}>
            {currentWorkflowState === "Offer Letter Sent" ? "Offer Awaiting Acceptance" : currentWorkflowState}
          </span>
        </div>
      </div>

      {/* STATE 1: Offer Letter Sent (Waiting for acceptance) */}
      {currentWorkflowState === "Offer Letter Sent" && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center max-w-xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-50 text-[#293d8f] mb-2">
            <Receipt className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Congratulations! Offer Letter Issued</h2>
            <p className="text-sm text-gray-500">
              You have been selected for the Vedica Scholars Programme. Please accept the offer letter below to unlock your admission payment gateway.
            </p>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleAcceptOffer}
              disabled={loading}
              className="w-full bg-[#293d8f] hover:bg-[#1e2d6b] text-white py-6 rounded-lg text-base font-semibold transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Processing Acceptance...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  Accept Offer & Proceed
                  <ChevronRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STATE 2: Offer Accepted / Pending Payment / Enrolled Summary */}
      {isPaymentState && paymentStatus && (
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Total Amount Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-indigo-50 text-[#293d8f] flex items-center justify-center">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Program Fee</p>
              <h3 className="text-xl font-bold text-gray-800 mt-0.5">
                ₹{((paymentStatus.amount_paid || 0) + (paymentStatus.amount_due || 0)).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Amount Paid Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Amount Paid</p>
              <h3 className="text-xl font-bold text-emerald-600 mt-0.5">
                ₹{(paymentStatus.amount_paid || 0).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Amount Due Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Hourglass className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Amount Due</p>
              <h3 className="text-xl font-bold text-amber-600 mt-0.5">
                ₹{(paymentStatus.amount_due || 0).toLocaleString()}
              </h3>
            </div>
          </div>

        </div>
      )}

      {/* STATE 2a: Payment Portal Controls */}
      {isPaymentState && paymentStatus && !paymentStatus.is_fully_paid && (
        <div className="grid gap-6 md:grid-cols-12">
          
          {/* Payment amount selection */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs md:col-span-8 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[#293d8f]" />
                Choose Payment Option
              </h2>
              <p className="text-xs text-gray-500 mt-1">Select full or partial installment payment below.</p>
            </div>

            {/* Option Radios */}
            <div className="space-y-3">
              {/* Full payment */}
              <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentOption === "full" 
                  ? "border-[#293d8f] bg-indigo-50/20" 
                  : "border-gray-200 hover:border-gray-300"
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="full"
                    checked={paymentOption === "full"}
                    onChange={() => setPaymentOption("full")}
                    className="accent-[#293d8f] h-4 w-4"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Pay Outstanding Due</p>
                    <p className="text-xs text-gray-500">Settle the entire remaining balance of program fee</p>
                  </div>
                </div>
                <span className="text-base font-bold text-gray-900">
                  ₹{paymentStatus.amount_due.toLocaleString()}
                </span>
              </label>

              {/* Partial payment (₹25,000) */}
              {paymentStatus.amount_due > 25000 && (
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentOption === "partial" 
                    ? "border-[#293d8f] bg-indigo-50/20" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="partial"
                      checked={paymentOption === "partial"}
                      onChange={() => setPaymentOption("partial")}
                      className="accent-[#293d8f] h-4 w-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Standard Installment</p>
                      <p className="text-xs text-gray-500">Pay a standard partial installment amount</p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-gray-900">
                    ₹25,000
                  </span>
                </label>
              )}

              {/* Custom payment */}
              <label className={`flex flex-col gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentOption === "custom" 
                  ? "border-[#293d8f] bg-indigo-50/20" 
                  : "border-gray-200 hover:border-gray-300"
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="custom"
                    checked={paymentOption === "custom"}
                    onChange={() => setPaymentOption("custom")}
                    className="accent-[#293d8f] h-4 w-4"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Custom Partial Payment</p>
                    <p className="text-xs text-gray-500">Specify a custom amount you wish to pay now</p>
                  </div>
                </div>

                {paymentOption === "custom" && (
                  <div className="relative mt-1">
                    <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-gray-500">₹</span>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2 pl-8 pr-4 text-sm font-semibold focus:outline-none focus:border-[#293d8f]"
                    />
                  </div>
                )}
              </label>
            </div>

            {/* Pay Button */}
            <div className="pt-2">
              <Button
                onClick={handlePayNow}
                disabled={loading || selectedAmount <= 0}
                className="w-full bg-[#293d8f] hover:bg-[#1e2d6b] text-white py-6 rounded-lg text-base font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                {loading ? "Processing transaction..." : `Pay ₹${selectedAmount.toLocaleString()} Now`}
              </Button>
            </div>
          </div>

          {/* Guidelines / Info Card */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-[#293d8f]" />
                Important Instructions
              </h4>
              <ul className="text-xs text-gray-500 space-y-3 list-disc pl-4">
                <li>
                  Installment facility is supported. You can pay outstanding amounts in rounds of custom values.
                </li>
                <li>
                  Upon successful payment check, your workflow status will update to <span className="font-semibold text-gray-700">"Payment Pending"</span>.
                </li>
                <li>
                  Once the sum of all payments equals the program fee, your status will transition automatically to <span className="font-semibold text-[#293d8f]">"Enrolled"</span>.
                </li>
                <li>
                  Do not refresh or close the Razorpay window during the transaction.
                </li>
              </ul>
            </div>

            {/* Security Note */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 flex gap-2 text-xs text-emerald-800">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-semibold">Secure Payment Gateway</p>
                <p className="text-emerald-700/90 mt-0.5">
                  Payments are securely processed via Razorpay. Your card details are fully encrypted and never stored.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STATE 3: Enrolled success banner */}
      {currentWorkflowState === "Enrolled" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
            <CheckCircle className="h-10 w-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-emerald-900">Congratulations! You are Enrolled</h2>
            <p className="text-sm text-emerald-700 max-w-md mx-auto">
              Your admission fees have been fully paid. You are now officially enrolled in the Vedica Scholars Programme! Welcome onboard.
            </p>
          </div>
        </div>
      )}

      {/* PAYMENT HISTORY TABLE */}
      {isPaymentState && getPastPayments().length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <History className="h-5 w-5 text-[#293d8f]" />
            Transaction History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase font-semibold">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Order ID</th>
                  <th scope="col" className="px-6 py-3">Payment ID</th>
                  <th scope="col" className="px-6 py-3">Amount</th>
                  <th scope="col" className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {getPastPayments().map((pay: any, idx: number) => (
                  <tr key={pay.name || idx} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {pay.payment_date 
                        ? new Date(pay.payment_date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : pay.modified 
                        ? new Date(pay.modified).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"
                      }
                    </td>
                    <td className="px-6 py-4 font-mono text-xs max-w-[150px] truncate">
                      {pay.razorpay_order_id || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs max-w-[150px] truncate">
                      {pay.razorpay_payment_id || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{(pay.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pay.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : pay.status === "Failed"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {pay.status || "Created"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
