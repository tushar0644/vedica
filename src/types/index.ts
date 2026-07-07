export * from "./user";

export type Communication = {
  id: string;
  subject: string;
  createdAt: string;
};

export interface Field {
  label: string;
  fieldname: string;
  fieldtype: string;
  placeholder?: string;
  options?: string[];
  description?: string;
}

export type DocType = Record<string, Field>;

export enum FormStatus {
  Draft = 0,
  Submitted = 1,
  Cancelled = 2,
}

