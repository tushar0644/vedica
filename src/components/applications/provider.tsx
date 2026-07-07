// provider.tsx
"use client";

import { submitApplicationForm } from "@/actions/application-forms/submit.action";
import { updateApplicationForm } from "@/actions/application-forms/update.action";
import { submitQualificationForm } from "@/actions/qualification-form/submit.action";
import { useApplicationFormStore } from "@/store/application-form/get.store";
import { useApplicationFormListStore } from "@/store/application-form/list.store";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

type ApplicationContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (values: any) => void;
  handleQualificationFormSubmit: (values: any) => void;
  handleFinalSubmit: (obj: any) => any;
};

const ApplicationContext = createContext<ApplicationContextType | null>(null);

export default function ApplicationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: application } = useApplicationFormStore();
  const [currentStep, setCurrentStep] = useState(0);
  const { refetch } = useApplicationFormListStore();
  const { replace } = useRouter();
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  const { id } = useParams();
  const queryClient = useQueryClient();

  const handleSubmit = async (values: any) => {
    if (!id) {
      toast.warning("ID not found");
      return;
    }

    const normalizedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        typeof value === "number" ? String(value) : value,
      ]),
    );

    // Merge existing application data with new values
    const payload = {
      ...application,
      ...normalizedValues,
    };

    try {
      const response = await updateApplicationForm({
        id: id as string,
        data: payload,
      });

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      queryClient.setQueryData(["application-form", id], (oldData: any) => ({
        ...oldData,
        ...normalizedValues,
      }));

      toast.success("Saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update application form");
    }
  };
  const handleFinalSubmit = async (values: any) => {
    if (!id) {
      toast.warning("ID not found");
      return;
    }

    const payload = {
      ...application,
      ...values,
    };

    try {
      const updateRes = await updateApplicationForm({
        id: id as string,
        data: payload,
      });

      if (!updateRes.success) {
        toast.error(updateRes.message);
        return;
      }

      const res = await submitApplicationForm({
        id: id as string,
      });

      queryClient.setQueryData(["application-form", id], (oldData: any) => ({
        ...oldData,
        ...values,
      }));

      replace("/dashboard");
      refetch();
      toast.success(res.message);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application form");
    }
  };

  const handleQualificationFormSubmit = async (values: any) => {
    if (!id) {
      toast.warning("ID not found");
      return;
    }

    try {
      const updateRes = await submitQualificationForm({
        payload: values,
        id: id as string,
        prev: application,
      });

      if (!updateRes.success) {
        toast.error(updateRes.message);
        return;
      }

      queryClient.setQueryData(["application-form", id], (oldData: any) => ({
        ...oldData,
        academic_details: updateRes.academicId,
      }));

      refetch();
      toast.success(updateRes.message);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application form");
    }
  };
  return (
    <ApplicationContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        handleQualificationFormSubmit,
        nextStep,
        prevStep,
        handleSubmit,
        handleFinalSubmit,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export const useApplication = () => {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error("useApplication must be used inside ApplicationProvider");
  }

  return context;
};
