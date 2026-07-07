"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const formSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;

export default function ChangePasswordForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log(values);

    // call your action here
    // await changePassword(values);
  };

  return (
    <Card className="w-full max-w-lg rounded-md p-6 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>

                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your current password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Password */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>

                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your new password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>

                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/dashboard"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Back to Dashboard
            </Link>

            <Button
              disabled={form.formState.isLoading || form.formState.isSubmitting}
              type="submit"
              className="bg-base hover:bg-base/90"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
