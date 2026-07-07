import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <img src="/sidebar-logo.webp" alt="Vedica Scholars" className="h-32" />

      <div className="text-left text-sm">
        <p className="font-semibold">Contact Us:</p>

        <a href="tel:+919643894938" className="block hover:underline">
          +91 9643894938
        </a>

        <a
          href="mailto:info@vedicacholars.com"
          className="block text-red-700 hover:underline"
        >
          info@vedicacholars.com
        </a>
      </div>
    </header>
  );
}
