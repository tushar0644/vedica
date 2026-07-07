"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { CustomInput } from "@/components/common/mobile-input";
import PhoneInput, {
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PhoneInputWithCountry from "@/components/ui/phone-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { updateUser } from "@/actions/profile/update-profile";
import { useAccountStore } from "@/store/user.store";

import { toast } from "sonner";

import { useGeoStore } from "@/store/geo.store";
import Link from "next/link";

const courses = ["PG Programme in Management Practice and Leadership"];
const experienceOptions = [
  "Fresher",
  "0–1 Year",
  "1–2 Years",
  "2–4 Years",
  "4+ Years",
];

const reachPreferences = ["Phone Call", "WhatsApp", "custom_emailss", "SMS"];

/* ------------------------------------------------------------ */
/* SCHEMA */
/* ------------------------------------------------------------ */

const phoneRegex = /^\+\d{10,15}$/;

const formSchema = z
  .object({
    name: z.string(),
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    custom_emailss: z.string().email("Enter valid custom_emailss"),
    custom_salutationss: z.string().min(2, "Salutation is required"),
    custom_mobile_nos: z.string(),
    phone: z.string().optional(),
    // custom_select_reach_out_prefrence: z.string().min(1, "Select reach out preference"),
    custom_select_reach_out_prefrence: z.string().optional(),
    custom_select_state: z.string().min(1, "Select state"),

    custom_select_city: z.string().min(1, "Select city"),

    custom_select_course: z.string().min(1, "Select course"),

    custom_select_current_total_work_experience: z
      .string()
      .min(1, "Select experience"),
  })
  .superRefine((data, ctx) => {
    if (!data.custom_mobile_nos?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["custom_mobile_nos"],
        message: "Mobile number is required",
      });
    } else if (!isValidPhoneNumber(data.custom_mobile_nos)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["custom_mobile_nos"],
        message: "Enter a valid mobile number",
      });
    }
    if (data.phone) {
      if (!data.phone?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Mobile number is required",
        });
      } else if (!isValidPhoneNumber(data.phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Enter a valid mobile number",
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

/* ------------------------------------------------------------ */
/* MAIN */
/* ------------------------------------------------------------ */

export default function ProfileForm() {
  const { data, refetch } = useAccountStore();

  const { states, getCities } = useGeoStore();

  const [cities, setCities] = React.useState<string[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      custom_salutationss: "",
      first_name: "",
      last_name: "",
      custom_emailss: "",
      custom_mobile_nos: "",
      phone: "",
      custom_select_reach_out_prefrence: "",
      custom_select_state: "",
      custom_select_city: "",
      custom_select_course: "",
      custom_select_current_total_work_experience: "",
    },
  });
  const selectedState = form.watch("custom_select_state");

  useEffect(() => {
    const loadCities = async () => {
      if (!states.length || !selectedState) {
        setCities([]);
        return;
      }

      const result = await getCities(selectedState);
      console.log(result);
      setCities(result);
    };

    loadCities();
  }, [selectedState, states, getCities]);

  useEffect(() => {
    if (!data) return;
    console.log(data);
    form.reset({
      name: data.name,
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      custom_emailss: data.custom_emailss || "",
      custom_mobile_nos: data.custom_mobile_nos || "",
      phone: data.phone || "",
      custom_select_reach_out_prefrence: data.custom_select_reach_out_prefrence,
      custom_select_state: data.custom_select_state,
      custom_select_city: data.custom_select_city,
      custom_select_course: data.custom_select_course,
      custom_select_current_total_work_experience:
        data.custom_select_current_total_work_experience,
    });
  }, [data, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await updateUser({ ...values });

      if (response.success) {
        refetch();
        toast.success(response.message);
      } else {
        toast.warning(response.message);
      }
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen">
      <Card className="rounded-md border bg-white p-4 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* ROW 1 */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* NAME */}
              <FormField
                control={form.control}
                name="custom_salutationss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Salutation <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Salutation" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."].map(
                            (item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* custom_emailss */}
              <FormField
                control={form.control}
                name="custom_emailss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      custom_emailss Address{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input readOnly disabled {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* REACH OUT */}
              <FormField
                control={form.control}
                name="custom_select_reach_out_prefrence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Reach Out Preference{" "}
                      {/* <span className="text-red-500">*</span> */}
                    </FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Reach Out Preference" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {reachPreferences.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MOBILE */}
              <FormField
                control={form.control}
                name="custom_mobile_nos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mobile Number <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        value={field.value?.replace("-", "") || undefined}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        readOnly
                        disabled
                        inputComponent={CustomInput}
                        className="border border-input h-9 w-full min-w-0 bg-transparent px-2.5 py-1  shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive  md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50"
                        placeholder={"Enter mobile number"}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ROW 3 */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* ALTERNATE MOBILE */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Mobile</FormLabel>

                    <FormControl>
                      <PhoneInput
                        international
                        defaultCountry="IN"
                        value={field.value?.replace("-", "") || undefined}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        inputComponent={CustomInput}
                        className="border border-input h-9 w-full min-w-0 bg-transparent px-2.5 py-1  shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive  md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50"
                        placeholder={"Enter mobile number"}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* STATE */}
              <FormField
                control={form.control}
                name="custom_select_state"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      State <span className="text-red-500">*</span>
                    </FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value || "Select State"}

                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Search state..." />

                          <CommandList>
                            <CommandEmpty>No state found.</CommandEmpty>

                            <CommandGroup>
                              {states.map((state) => (
                                <CommandItem
                                  key={state}
                                  value={state}
                                  onSelect={() => {
                                    field.onChange(state);
                                    form.setValue("custom_select_city", "");
                                  }}
                                >
                                  {state}

                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === state
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ROW 4 */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* CITY */}
              <FormField
                control={form.control}
                name="custom_select_city"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      City <span className="text-red-500">*</span>
                    </FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={!form.watch("custom_select_state")}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value || "Select City"}

                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Search city..." />

                          <CommandList>
                            <CommandEmpty>No city found.</CommandEmpty>

                            <CommandGroup>
                              {cities.map((city) => (
                                <CommandItem
                                  key={city}
                                  value={city}
                                  onSelect={() => {
                                    field.onChange(city);
                                  }}
                                >
                                  {city}

                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === city
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EXPERIENCE */}
              <FormField
                control={form.control}
                name="custom_select_current_total_work_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Current Work Experience
                      <span className="text-red-500"> *</span>
                    </FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Experience" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {experienceOptions.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ROW 5 */}
            <div className="grid grid-cols-1">
              <FormField
                control={form.control}
                name="custom_select_course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Course <span className="text-red-500">*</span>
                    </FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Link href="/dashboard">
                <Button type="button" variant="outline">
                  Back
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={
                  form.formState.isLoading || form.formState.isSubmitting
                }
                className="bg-base hover:bg-base"
              >
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
