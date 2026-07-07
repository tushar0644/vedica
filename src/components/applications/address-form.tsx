"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { getCountries } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";
import { StepComponentProps } from "./type";
import { Checkbox } from "../ui/checkbox";

import { useApplicationFormStore } from "@/store/application-form/get.store";
import { useApplication } from "./provider";
import { useApplicationFormDocTypeStore } from "@/store/application-form/doctype.store";
import { DynamicSelect } from "../common/select";
import { DynamicInput } from "../common/input";
import { useGeoStore } from "@/store/geo.store";
import { ICity } from "country-state-city";
import { ApplicationFormFooter } from "./application-footer";
const addressDetailsSchema = z
  .object({
    country: z.string().optional(),
    state_current_address: z.string().optional(),
    district_current_address: z.string().optional(),
    city_current_address: z.string().optional(),
    address_line_1: z.string().optional(),
    address_line_2: z.string().optional(),
    pincode: z.union([z.string(), z.number()]).optional(),
    other_sate: z.string().optional(),
    other_city: z.string().optional(),
    other_district: z.string().optional(),
    is_permanent_address_same_as_current_address: z
      .string()
      .optional()
      .default("true"),

    country_permanent_address: z.string().optional(),
    state_permanent_address: z.string().optional(),
    district_permanent_address: z.string().optional(),
    city_permanent_address: z.string().optional(),
    address_line1: z.string().optional(),
    address_line2: z.string().optional(),
    pincode_permanent_address: z.union([z.string(), z.number()]).optional(),

    if_other_state_permanent_address: z.string().optional(),
    if_other_city_permanent_address: z.string().optional(),
    if_other_district_permanent_address: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Current Address
    if (data.state_current_address === "Other" && !data.other_sate?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["other_sate"],
        message: "Please specify the state.",
      });
    }

    if (data.city_current_address === "Other" && !data.other_city?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["other_city"],
        message: "Please specify the city.",
      });
    }

    if (
      data.district_current_address === "Other" &&
      !data.other_district?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["other_district"],
        message: "Please specify the district.",
      });
    }

    if (data.is_permanent_address_same_as_current_address === "No") {
      // Permanent Address
      if (
        data.state_permanent_address === "Other" &&
        !data.if_other_state_permanent_address?.trim()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["if_other_state_permanent_address"],
          message: "Please specify the permanent state.",
        });
      }

      if (
        data.city_permanent_address === "Other" &&
        !data.if_other_city_permanent_address?.trim()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["if_other_city_permanent_address"],
          message: "Please specify the permanent city.",
        });
      }

      if (
        data.district_permanent_address === "Other" &&
        !data.if_other_district_permanent_address?.trim()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["if_other_district_permanent_address"],
          message: "Please specify the permanent district.",
        });
      }
    }
  });
export function AddressDetailsForm({
  onNext,
  onBack,
  onExit,
  step,
}: StepComponentProps) {
  const form = useForm<any>({
    resolver: zodResolver(addressDetailsSchema),

    defaultValues: {
      country: "India",
      state_current_address: "",
      district_current_address: "",
      address_line_1: "",
      city_current_address: "",
      address_line_2: "",
      pincode: "",

      is_permanent_address_same_as_current_address: "Yes",

      country_permanent_address: "India",
      state_permanent_address: "",
      district_permanent_address: "",
      address_line1: "",
      city_permanent_address: "",
      address_line2: "",
      pincode_permanent_address: "",
    },
  });
  const { states, getCities, getDistrict } = useGeoStore();
  const { data } = useApplicationFormStore();
  const { data: doctype } = useApplicationFormDocTypeStore();
  const { handleSubmit } = useApplication();
  const initialized = useRef(false);

  useEffect(() => {
    if (!data || initialized.current) return;
    form.reset(data);
    initialized.current = true;
  }, [data, form]);
  const onSubmit = async (values: any) => {
    try {
      await handleSubmit(values);
      onNext();
    } catch (error) {
      console.error(error);
    }
  };
  const is_permanent_address_same_as_current_address = form.watch(
    "is_permanent_address_same_as_current_address",
  );

  const currentValues = form.watch([
    "country",
    "state_current_address",
    "district_current_address",
    "city_current_address",
    "address_line_1",
    "address_line_2",
    "pincode",
  ]);

  const isPermanentSame = form.watch(
    "is_permanent_address_same_as_current_address",
  );

  const currentCountryValue = form.watch("country");
  const currentStateValue = form.watch("state_current_address");
  const currentDistrictValue = form.watch("district_current_address");
  const currentCityValue = form.watch("city_current_address");
  const currentAddress1 = form.watch("address_line_1");
  const currentAddress2 = form.watch("address_line_2");
  const currentPincode = form.watch("pincode");

  useEffect(() => {
    if (isPermanentSame !== "true") return;

    form.setValue("country_permanent_address", currentCountryValue, {
      shouldDirty: false,
      shouldTouch: false,
    });

    form.setValue("state_permanent_address", currentStateValue, {
      shouldDirty: false,
      shouldTouch: false,
    });

    form.setValue("district_permanent_address", currentDistrictValue, {
      shouldDirty: false,
      shouldTouch: false,
    });

    form.setValue("city_permanent_address", currentCityValue, {
      shouldDirty: false,
      shouldTouch: false,
    });

    form.setValue("address_line1", currentAddress1, {
      shouldDirty: false,
      shouldTouch: false,
    });

    form.setValue("address_line2", currentAddress2, {
      shouldDirty: false,
      shouldTouch: false,
    });

    form.setValue("pincode_permanent_address", currentPincode, {
      shouldDirty: false,
      shouldTouch: false,
    });
  }, [
    isPermanentSame,
    currentCountryValue,
    currentStateValue,
    currentDistrictValue,
    currentCityValue,
    currentAddress1,
    currentAddress2,
    currentPincode,
    form,
  ]);
  const currentState = form.watch("state_current_address");
  const permanentState = form.watch("state_permanent_address");

  const [currentCities, setCurrentCities] = useState<string[]>([]);
  const [permanentCities, setPermanentCities] = useState<string[]>([]);

  const [currentDistrict, setCurrentDistrict] = useState<string[]>([]);
  const [permanentDistrict, setPermanentDistrict] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (permanentState && permanentState !== "") {
        const res = await getCities(permanentState);
        setPermanentCities(res);
        const res2 = await getDistrict(permanentState);
        setPermanentDistrict(res2);
      }
    })();
  }, [permanentState]);

  useEffect(() => {
    (async () => {
      if (currentState && currentState !== "") {
        const res = await getCities(currentState);
        setCurrentCities(res);
        const res2 = await getDistrict(currentState);
        setCurrentDistrict(res2);
      }
    })();
  }, [currentState]);

  useEffect(() => {
    if (is_permanent_address_same_as_current_address === "true") {
      form.setValue("country_permanent_address", currentValues[0]);
      form.setValue("state_permanent_address", currentValues[1]);
      form.setValue("district_permanent_address", currentValues[2]);
      form.setValue("city_permanent_address", currentValues[3]);
      form.setValue("address_line1", currentValues[4]);
      form.setValue("address_line2", currentValues[5]);
      form.setValue("pincode_permanent_address", currentValues[6]);
    }
  }, [is_permanent_address_same_as_current_address, currentValues, form]);

  const countries = getCountries().map((country) => en[country]);

  const currentCountry = form.watch("country");
  const permanentCountry = form.watch("country_permanent_address");
  return (
    <div className="border border-[#d8d8d8] bg-white">
      <div className="relative border-b border-[#d8d8d8] px-4 py-4">
        <div className="absolute right-0 top-0 bg-[#293d8f] px-3 py-1 text-[11px] font-semibold text-white">
          Step {step + 1} of 8
        </div>

        <h2 className="text-[18px] font-semibold text-[#293d8f]">
          Address Details
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-4 py-5"
        >
          <section className="space-y-5">
            <h3 className="text-[16px] font-semibold text-[#293d8f]">
              Current Address
            </h3>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
              <DynamicSelect
                form={form}
                doctype={doctype}
                name="country"
                options={countries}
              ></DynamicSelect>
              {currentCountry === "India" && (
                <>
                  <DynamicSelect
                    form={form}
                    doctype={doctype}
                    name="state_current_address"
                    options={states}
                  ></DynamicSelect>
                  {form.watch("state_current_address") === "Other" && (
                    <DynamicInput
                      form={form}
                      doctype={doctype}
                      name="other_sate"
                    />
                  )}
                  <DynamicSelect
                    form={form}
                    doctype={doctype}
                    options={currentCities}
                    name="city_current_address"
                  ></DynamicSelect>
                  {form.watch("city_current_address") === "Other" && (
                    <DynamicInput
                      form={form}
                      doctype={doctype}
                      name="other_city"
                    />
                  )}
                  <DynamicSelect
                    form={form}
                    doctype={doctype}
                    options={currentDistrict}
                    name="district_current_address"
                  ></DynamicSelect>

                  {form.watch("district_current_address") === "Other" && (
                    <DynamicInput
                      form={form}
                      doctype={doctype}
                      name="other_district"
                    />
                  )}
                </>
              )}

              <DynamicInput
                form={form}
                doctype={doctype}
                name="address_line_1"
              ></DynamicInput>
              <DynamicInput
                form={form}
                doctype={doctype}
                name="address_line_2"
              ></DynamicInput>

              <DynamicInput
                form={form}
                doctype={doctype}
                name="pincode"
              ></DynamicInput>
            </div>
          </section>

          <section className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
              <DynamicSelect
                form={form}
                search={false}
                doctype={doctype}
                name="is_permanent_address_same_as_current_address"
              ></DynamicSelect>
            </div>
          </section>
          {is_permanent_address_same_as_current_address === "No" && (
            <>
              <section className="space-y-5">
                <h3 className="text-[16px] font-semibold text-[#293d8f]">
                  Permanent Address
                </h3>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
                  <DynamicSelect
                    form={form}
                    doctype={doctype}
                    name="country_permanent_address"
                    options={countries}
                  ></DynamicSelect>
                  {permanentCountry === "India" && (
                    <>
                      <DynamicSelect
                        form={form}
                        doctype={doctype}
                        name="state_permanent_address"
                        options={states}
                      ></DynamicSelect>
                      {form.watch("state_permanent_address") === "Other" && (
                        <DynamicInput
                          form={form}
                          doctype={doctype}
                          name="if_other_state_permanent_address"
                        />
                      )}
                      <DynamicSelect
                        form={form}
                        doctype={doctype}
                        options={permanentCities}
                        name="city_permanent_address"
                      ></DynamicSelect>
                      {form.watch("city_permanent_address") === "Other" && (
                        <DynamicInput
                          form={form}
                          doctype={doctype}
                          name="if_other_city_permanent_address"
                        />
                      )}
                      <DynamicSelect
                        form={form}
                        doctype={doctype}
                        name="district_permanent_address"
                        options={permanentDistrict}
                      ></DynamicSelect>

                      {form.watch("district_permanent_address") === "Other" && (
                        <DynamicInput
                          form={form}
                          doctype={doctype}
                          name="if_other_district_permanent_address"
                        />
                      )}
                    </>
                  )}
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="address_line1"
                  ></DynamicInput>
                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="address_line2"
                  ></DynamicInput>

                  <DynamicInput
                    form={form}
                    doctype={doctype}
                    name="pincode_permanent_address"
                  ></DynamicInput>
                </div>
              </section>
            </>
          )}

          <ApplicationFormFooter
            form={form}
            onSave={handleSubmit}
            onBack={onBack}
            onNext={onNext}
            onExit={onExit}
          />
        </form>
      </Form>
    </div>
  );
}
