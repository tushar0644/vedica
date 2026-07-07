"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import "react-phone-number-input/style.css";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";

import { Check, ChevronDown } from "lucide-react";

type Mode = "register" | "login" | "forgot" | "reset";

/* ---------------- DATA ---------------- */

const courses = ["PG Programme in Management Practice and Leadership"];
const years = ["Fresher", "0–1 Year", "1–2 Years", "2–4 Years", "4+ Years"];
const salutations = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."];
const registerSchema = z
  .object({
    salutation: z.string().trim().min(2, "Salutation is required"),
    firstName: z.string().trim().min(2, "First Name is required"),
    lastName: z.string().trim().min(2, "Last Name is required"),
    email: z.string().email("Enter a valid email"),
    mobile: z.string(),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    course: z.string().min(1, "Course is required"),
    currentYear: z.string().min(1, "Experience is required"),
    agree: z.boolean().refine((v) => v, "You must agree"),
  })
  .superRefine((data, ctx) => {
    if (!data.mobile?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mobile"],
        message: "Mobile number is required",
      });
    } else if (!isValidPhoneNumber(data.mobile)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mobile"],
        message: "Enter a valid mobile number",
      });
    }
  });

const loginSchema = z.object({
  usr: z.string("Required").min(1, "Email is required"),
  pwd: z.string("Required").min(1, "Password is required"),
});

const forgotSchema = z.object({
  email: z.string().email("Enter valid email"),
});

/* ---------------- SELECT BOX ---------------- */
function SelectBox({
  value,
  setValue,
  options,
  placeholder,
  disabled = false,
  search = true,
}: any) {
  const [open, setOpen] = useState(false);
  const formatLabel = (text?: string) => {
    if (!text) return "";
    return text.length > 20 ? text.slice(0, 20) + "..." : text;
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={`w-full min-w-0 justify-start bg-transparent border-input hover:bg-transparent ${
            !value ? "text-muted-foreground hover:text-muted-foreground" : ""
          }`}
        >
          <span className="flex w-full min-w-0 items-center">
            <span className="flex-1 min-w-0 truncate text-left">
              {value || placeholder}
            </span>

            <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          {search && <CommandInput placeholder={`Search ${placeholder}`} />}
          <CommandList>
            {options.map((opt: string) => (
              <CommandItem
                key={opt}
                onSelect={() => {
                  setValue(opt);
                  setOpen(false);
                }}
              >
                {opt}
                {value === opt && <Check className="ml-auto w-4 h-4" />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/* ---------------- REGISTER FORM ---------------- */
function RegisterForm({ onSwitch }: { onSwitch: (m: Mode) => void }) {
  const { states, getCities, cities } = useGeoStore();
  const [verificationSent, setVerificationSent] = useState(false);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      salutation: "Ms.",
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      state: "",
      city: "",
      course: "",
      currentYear: "",
      agree: false,
    },
  });

  const state = form.watch("state");
  useEffect(() => {
    if (!state) return;
    form.setValue("city", "");
    (async () => {
      await getCities(state);
    })();
  }, [state, states, getCities, form]);
  const onSubmit = async (d: {
    salutation: string;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    course: string;
    city: string;
    state: string;
    currentYear: string;
  }) => {
    const phone = parsePhoneNumberFromString(d.mobile);

    if (!phone?.isValid()) {
      throw new Error("Invalid phone number");
    }

    const formattedMobile = `+${phone.countryCallingCode}-${phone.nationalNumber}`;
    // console.log({
    //   custom_salutationss: d.salutation,
    //   first_name: d.firstName,
    //   last_name: d.lastName,
    //   mobile_no: formattedMobile,
    //   email: d.email,
    //   custom_emailss: d.email,
    //   custom_select_course: d.course,
    //   custom_select_city: d.city,
    //   custom_select_state: d.state,
    //   custom_select_current_total_work_experience: d.currentYear,
    // });
    try {
      const res = await register({
        custom_salutationss: d.salutation,
        first_name: d.firstName,
        last_name: d.lastName,
        custom_mobile_nos: formattedMobile,
        email: d.email,
        custom_emailss: d.email,
        custom_select_course: d.course,
        custom_select_city: d.city,
        custom_select_state: d.state,
        custom_select_current_total_work_experience: d.currentYear,
      });
      if (res.success) {
        toast.success(
          res.message || "Verification Link has been sent to your email",
        );

        setVerificationSent(true);
      } else {
        toast.error(
          res.message || "Failed to register user",
        );
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-5 gap-3">
            <FormField
              control={form.control}
              name="salutation"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <SelectBox
                    value={field.value}
                    setValue={field.onChange}
                    options={salutations || []}
                    placeholder="Title"
                    search={false}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input placeholder="First Name *" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input placeholder="Last Name *" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email *" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <SelectBox
                    value={field.value}
                    setValue={field.onChange}
                    options={states || []}
                    placeholder="State"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <SelectBox
                    value={field.value}
                    setValue={field.onChange}
                    options={cities || []}
                    disabled={!state || state === ""}
                    placeholder="City"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <SelectBox
                    value={field.value}
                    setValue={field.onChange}
                    options={courses}
                    placeholder="Course"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentYear"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <SelectBox
                    value={field.value}
                    setValue={field.onChange}
                    options={years}
                    placeholder="Experience"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="agree"
            render={({ field }) => (
              <FormItem className="flex items-start gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="text-xs">
                  I agree to receive information by signing up on Vedica
                  Scholars *
                </div>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={
              form.formState.isLoading ||
              // form.formState.isSubmitSuccessful ||
              form.formState.isSubmitting
            }
            className="w-full bg-maroon hover:bg-maroon"
          >
            REGISTER
          </Button>

          {verificationSent && (
            <div className="text-center mt-3">
              <p className="text-sm font-medium text-green-600">
                Verification link has been sent to your email.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Please check your inbox and spam folder to verify your account.
              </p>
            </div>
          )}
          <p className="text-xs text-center">
            Already have an account?{" "}
            <button
              type="button"
              className="underline"
              onClick={() => onSwitch("login")}
            >
              Login
            </button>
          </p>
        </form>
      </Form>
    </>
  );
}
import { login } from "@/actions/auth/login";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import PhoneInputWithCountry from "../ui/phone-input";
import { register } from "@/actions/auth/register";

function LoginForm({ onSwitch }: { onSwitch: (m: Mode) => void }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usr: "",
      pwd: "",
    },
  });

  const onSubmit = async (d: { usr: string; pwd: string }) => {
    try {
      const res = await login(d.usr, d.pwd);

      if (res.success) {
        toast.success(res.message || "Login successful");

        router.push("/dashboard");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="usr"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pwd"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-maroon hover:bg-maroon"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "LOGGING IN..." : "LOGIN"}
        </Button>

        <button
          type="button"
          className="text-xs underline w-full"
          onClick={() => onSwitch("forgot")}
        >
          Forgot Password?
        </button>

        <span className="text-xs flex gap-1 items-center mx-auto justify-center">
          Don't have an account!
          <button
            type="button"
            className="text-xs underline"
            onClick={() => onSwitch("register")}
          >
            Create account
          </button>
        </span>
      </form>
    </Form>
  );
}

import { forgetPassword } from "@/actions/auth/forget-password";
/* ---------------- FORGOT FORM ---------------- */
function ForgotForm({ onSwitch }: { onSwitch: (m: Mode) => void }) {
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });
  const onSubmit = async (d: { email: string }) => {
    try {
      const url = new URL(pathname, window.location.origin);
      url.searchParams.set("type", "reset");

      const res = await forgetPassword({
        email: d.email,
        redirectUrl: url.toString(),
      });
      toast.info(res.message);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full bg-maroon hover:bg-maroon">SEND OTP</Button>
      </form>
      <button
        type="button"
        className="text-xs underline w-full"
        onClick={() => onSwitch("login")}
      >
        Back to Login
      </button>
    </Form>
  );
}

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ResetPasswordForm({ onSwitch }: { onSwitch: (m: Mode) => void }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const searchParams = useSearchParams();
  const onSubmit = async (d: { password: string }) => {
    try {
      const token = searchParams.get("token");
      if (!token) {
        toast.success("Unauthorised request made");
        return;
      }
      const res = await resetPassword({ token, newPassword: d.password });
      toast.info(res.message);
      if (res.success) {
        onSwitch("login");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-700">
        Create a new password for your account. Make sure it is secure and easy
        to remember.
      </p>

      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          {/* PASSWORD */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New Password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* CONFIRM PASSWORD */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-maroon hover:bg-maroon"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "RESETTING PASSWORD..."
              : "RESET PASSWORD"}
          </Button>

          <button
            type="button"
            className="text-xs underline w-full"
            onClick={() => onSwitch("login")}
          >
            Back to Login
          </button>
        </form>
      </Form>
    </div>
  );
}

import { Suspense } from "react";
import { resetPassword } from "@/actions/auth/reset-password";
import { CustomInput } from "../common/mobile-input";
import { useGeoStore } from "@/store/geo.store";
import { ICity } from "country-state-city";
export default function AdmissionCardWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdmissionCard />
    </Suspense>
  );
}

function AdmissionCard() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const type = searchParams.get("type") as Mode | null;

  const [mode, setMode] = useState<Mode>("register");

  useEffect(() => {
    if (
      type === "register" ||
      type === "login" ||
      type === "forgot" ||
      type === "reset"
    ) {
      setMode(type);
    }
  }, [type]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);

    const params = new URLSearchParams(searchParams.toString());

    params.set("type", newMode);

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <Card className="w-full lg:w-[450px] shadow-2xl rounded-2xl border-0 bg-[#fff7ec]">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold">Admission Portal</h2>

        {mode === "register" && <RegisterForm onSwitch={handleModeChange} />}

        {mode === "login" && <LoginForm onSwitch={handleModeChange} />}

        {mode === "forgot" && <ForgotForm onSwitch={handleModeChange} />}

        {mode === "reset" && <ResetPasswordForm onSwitch={handleModeChange} />}
      </CardContent>
    </Card>
  );
}
