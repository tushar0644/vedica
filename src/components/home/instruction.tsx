"use client";

import {
  User,
  CheckCircle2,
  FilePenLine,
  Upload,
  FileText,
} from "lucide-react";

const steps = [
  {
    title: "Register Yourself",
    icon: User,
  },
  {
    title: "Verify Email",
    icon: CheckCircle2,
  },
  {
    title: "Fill Application Form Online",
    icon: FilePenLine,
  },
  {
    title: "Submit Application",
    icon: Upload,
  },
];

function StepCard({
  title,
  icon: Icon,
  index,
}: {
  title: string;
  icon: any;
  index: number;
}) {
  return (
    <div className="bg-maroon text-white rounded-none flex flex-col items-center justify-center p-6 gap-3 min-h-[160px]">
      <p className="text-sm font-semibold tracking-wider">STEP {index + 1}</p>

      <Icon className="w-16 h-16 stroke-1" />

      <p className="text-md font-semibold text-center">{title}</p>
    </div>
  );
}

function Instructions() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-4xl mx-auto px-6 py-16">
      {/* Left Illustration */}
      <div className="flex justify-center lg:justify-start">
        <div className="w-65 h-65 flex items-center justify-center">
          <FileText className="w-60 stroke-[0.5] h-60 text-black" />
        </div>
      </div>

      {/* Right Text */}
      <div className="text-md space-y-4">
        <p>
          The email you register with will be used for all communication until
          enrollment is complete. It cannot be changed during the application
          process.
        </p>

        <h3 className="font-semibold text-base">Have a question?</h3>

        <p>
          Use the Vedica Scholars Query Management System (QMS) for the fastest
          response:
        </p>

        <ol className="list-decimal pl-5 space-y-2">
          <li>Register and verify your email.</li>
          <li>Click Any Queries? Ask Us on your dashboard.</li>
          <li>Pick a category and submit your query.</li>
        </ol>
      </div>
    </div>
  );
}

export default function InstructionSection() {
  return (
    <div className="w-full bg-white">
      {/* Title */}
      <div className="text-center py-10">
        <h2 className="text-xl md:text-2xl font-bold tracking-wide">
          STEPS TO FOLLOW
        </h2>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto px-6">
        {steps.map((step, i) => (
          <StepCard key={i} index={i} title={step.title} icon={step.icon} />
        ))}
      </div>

      {/* Instructions Section */}
      <Instructions />
    </div>
  );
}
