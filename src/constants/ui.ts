import {
  FileText,
  CreditCard,
  MessageSquare,
  Mail,
  Landmark,
  Briefcase,
  BookOpen,
  HelpCircle,
  Calendar,
} from "lucide-react";

export const menuItems = [
  {
    label: "All Application Form(s)",
    icon: FileText,
    href: "/dashboard/applications",
  },
  {
    label: "My Payments",
    icon: CreditCard,
    href: "/dashboard/payments",
  },
  {
    label: "My Interview",
    icon: Calendar,
    href: "/dashboard/interview",
  },
  {
    label: "My Queries",
    icon: MessageSquare,
    href: "/dashboard/queries",
  },
  {
    label: "My Communication",
    icon: Mail,
    href: "/dashboard/communications",
  },
  {
    label: "FAQs",
    icon: HelpCircle,
    href: "/dashboard/faqs",
  },
  {
    label: "Loan Partners",
    icon: Landmark,
    href: "/dashboard/partners",
  },
  {
    label: "Placement report",
    icon: Briefcase,
    href: "https://static.npfs.co/accounts/729/documents/2025/9/24/6d82b0c6618949a0a25d1d307bfd2d92_Placement%20report%20%20Class%20of%202024%20(2)%20(1).pdf",
  },
  {
    label: "Brochure",
    icon: BookOpen,
    href: "https://static.npfs.co/accounts/729/documents/2025/9/24/bc4a3b470d43454a86017a7f5419d99b_Brochure%20vFinal%202025.pdf",
  },
];


export const communications = [
  {
    id: "1",
    subject: "Your Vedica application is complete | VS20263524.",
    createdAt: "2026-03-16T02:44:00",
  },
  {
    id: "2",
    subject: "Vedica Dashboard Login Details",
    createdAt: "2026-03-16T02:30:00",
  },
  {
    id: "3",
    subject: "Interview round scheduled for 21 March 2026",
    createdAt: "2026-03-14T11:10:00",
  },
  {
    id: "4",
    subject: "Verify Your New Email Varun@makeamine.com",
    createdAt: "2026-02-11T10:22:00",
  },
  {
    id: "5",
    subject: "Payment received successfully for Application",
    createdAt: "2026-02-09T18:45:00",
  },
  {
    id: "6",
    subject: "Your scholarship eligibility has been updated",
    createdAt: "2026-02-03T09:20:00",
  },
  {
    id: "7",
    subject: "Reminder: Complete your pending application",
    createdAt: "2026-01-18T15:15:00",
  },
  {
    id: "8",
    subject: "Scholarship details for shortlisted candidates",
    createdAt: "2026-01-12T11:02:00",
  },
  {
    id: "9",
    subject: "Welcome to Vedica Scholars Programme",
    createdAt: "2026-01-04T09:30:00",
  },
  {
    id: "10",
    subject: "Upload your updated academic documents",
    createdAt: "2025-12-17T13:14:00",
  },
  {
    id: "11",
    subject: "Application portal maintenance scheduled",
    createdAt: "2025-12-09T20:05:00",
  },
  {
    id: "12",
    subject: "Your profile verification is pending",
    createdAt: "2025-12-01T16:40:00",
  },
  {
    id: "13",
    subject: "Your account has been successfully created",
    createdAt: "2025-10-22T16:20:00",
  },
  {
    id: "14",
    subject: "Start your Vedica Application today",
    createdAt: "2025-10-15T19:55:00",
  },
  {
    id: "15",
    subject: "Important admission dates announced",
    createdAt: "2025-10-02T09:00:00",
  },
];

export const queryCategories = [
  {
    heading: "Admission Query",
    items: [
      "Course Details",
      "Eligibility Criteria",
      "Fees Details",
      "Form Correction",
    ],
  },
  {
    heading: "General Query",
    items: ["Infrastructure", "Other General Queries"],
  },
];
