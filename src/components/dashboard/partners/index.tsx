"use client";

import React from "react";

const loanPartners = [
  {
    bank: "IDFC First Bank",
    contacts: [
      {
        name: "Mr Nitant Srivastav",
        phone: "+91 7506941431",
      },
      {
        name: "Mr. Avishek Kumar",
        phone: "+91 9599035022",
      },
    ],
  },
  {
    bank: "HDFC Credila",
    contacts: [
      {
        name: "Mr Ojasvi Pandey",
        phone: "+91 9871395514",
      },
    ],
  },
  {
    bank: "Propelld",
    contacts: [
      {
        name: "Mr Unmesh",
        phone: "+91 9817093875",
      },
    ],
  },
  {
    bank: "Tata Capital",
    contacts: [
      {
        name: "Varun",
        phone: "+91 7827670937",
      },
    ],
  },
  {
    bank: "ICICI Bank",
    contacts: [
      {
        name: "Ms. Shreya Yogi",
        phone: "9755168260",
      },
    ],
  },
];

export default function LoanPartners() {
  return (
    <div className="min-h-screen">
      <div className="rounded-md border bg-white p-5 shadow-sm">
        <div className="space-y-6">
          {loanPartners.map((partner) => (
            <div key={partner.bank}>
              <h2 className=" font-bold text-black">{partner.bank}</h2>

              <div className="mt-3 space-y-4">
                {partner.contacts.map((contact, index) => (
                  <p key={index} className="text-sm">
                    {contact.name} - {contact.phone}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
