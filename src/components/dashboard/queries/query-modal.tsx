"use client";

import React, { ReactNode, useEffect, useState } from "react";

import { z } from "zod";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

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

import { Check, ChevronDown, Search, Upload } from "lucide-react";
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
import { queryCategories } from "@/constants/ui";
import Link from "next/link";
import { useAccountStore } from "@/store/user.store";
import { createQuery } from "@/actions/queries/create.action";
import { toast } from "sonner";
import { uploadFile } from "@/actions/upload/upload.action";
import { useQueryStore } from "@/store/query.store";
const formSchema = z.object({
  lead: z.string(),
  student_name: z.string().min(1, "Name is required"),

  query_category: z.string().min(1, "Please select query category"),

  form: z.string().min(1, "Please select form"),

  query_description: z
    .string("Required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Maximum 500 characters allowed"),

  query_attachment: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function QueriesModal({ children }: { children: ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data } = useAccountStore();
  const { refetch } = useQueryStore();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      lead: data?.name,
      student_name: `${data?.first_name ?? ""} ${data?.last_name ?? ""}`.trim(),
      query_category: "",
      form: "",
      query_description: "",
    },
  });
  useEffect(() => {
    if (data && form) {
      form.reset({
        lead: data?.name,
        student_name:
          `${data?.first_name ?? ""} ${data?.last_name ?? ""}`.trim(),
        query_category: "",
        form: "",
        query_description: "",
      });
    }
  }, [data, form]);

  const attachment = form.watch("query_attachment");

  const description = form.watch("query_description");

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      let attachmentUrl: any = "";

      if (values.query_attachment) {
        const fileRes = await uploadFile(values.query_attachment);
        attachmentUrl = fileRes.url;
      }

      const res = await createQuery({
        ...values,
        query_attachment: attachmentUrl,
      });
      if (res.success) {
        form.reset({
          student_name:
            `${data?.first_name ?? ""} ${data?.last_name ?? ""}`.trim(),
          query_category: "",
          form: "",
          query_description: "",
        });
        refetch();
        setOpenDialog(false);
      }
      toast.info(res.message);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const onError = (err: any) => console.log(err);
  return (
    <Dialog open={openDialog} onOpenChange={(prev) => setOpenDialog(prev)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-[900px]! p-0 max-h-[90vh] w-[95%] md:w-[75%] overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="border-b px-6 py-2 bg-muted">
          <div className="flex items-center md:flex-row flex-col gap-3 justify-between">
            <DialogTitle className="text-lg font-semibold">
              Ask your Query
            </DialogTitle>

            <div className="flex items-center gap-3">
              <Link href="/dashboard/faqs" onClick={() => setOpenDialog(false)}>
                <Button
                  variant="outline"
                  size={"sm"}
                  className="border-[#E3B183] text-[#D38E4A]"
                >
                  ? View FAQs
                </Button>
              </Link>
              <Link
                href="/dashboard/queries"
                onClick={() => setOpenDialog(false)}
              >
                <Button
                  variant="outline"
                  size={"sm"}
                  className="border-[#E3B183] text-[#D38E4A]"
                >
                  My Queries
                </Button>
              </Link>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-5 px-6 pb-5"
          >
            {/* Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <FormField
                control={form.control}
                name="student_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Query Category */}
              <FormField
                control={form.control}
                name="query_category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Query Category <span className="text-red-500">*</span>
                    </FormLabel>

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value || "Select Query Category"}

                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-(--radix-popover-trigger-width) p-0"
                        align="start"
                      >
                        <Command>
                          {/* Search */}
                          <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 opacity-50" />

                            <CommandInput
                              placeholder="Search query..."
                              className="h-11 border-0 focus:ring-0"
                            />
                          </div>

                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>

                            {queryCategories.map((group) => (
                              <CommandGroup
                                key={group.heading}
                                heading={group.heading}
                              >
                                {group.items.map((item) => (
                                  <CommandItem
                                    key={item}
                                    value={item}
                                    onSelect={(value) => {
                                      field.onChange(value);

                                      // Auto close
                                      setOpen(false);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === item
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />

                                    {item}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Select Form */}
            <FormField
              control={form.control}
              name="form"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select Form <span className="text-red-500">*</span>
                  </FormLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full!">
                        <SelectValue placeholder="Application Form 2026 - 2027" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="w-full!">
                      <SelectItem value="Application Form 2026 - 2027">
                        Application Form 2026 - 2027
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="query_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Query&apos;s Description{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Ask your query."
                      className="min-h-[120px]"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>

                  <div className="flex items-center justify-between">
                    <FormMessage />

                    <p className="text-xs text-muted-foreground">
                      {description?.length ?? 0}/500
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Upload */}
            <FormField
              control={form.control}
              name="query_attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Attachment (If any)</FormLabel>

                  <div className="flex gap-3">
                    <Input
                      readOnly
                      value={attachment?.name || "No file selected"}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      asChild
                    >
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4" />
                        Browse...
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </label>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Maximum size: 2MB. Formats allowed: PDF, DOC, JPG, PNG, JPEG
                  </p>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Captcha */}
            {/* <div className="space-y-2">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={(token) => setCaptchaToken(token)}
              />

              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
            </div> */}

            {/* Submit */}
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:min-w-[180px] bg-maroon! hover:bg-maroon!"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
