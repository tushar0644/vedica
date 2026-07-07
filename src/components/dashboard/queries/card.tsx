"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, X, Paperclip, FileText } from "lucide-react";
import { Query } from "@/types/query";

type MessageType = {
  id: number;
  sender: string;
  text: string;
  time: string;
  attachments?: File[];
};

export default function QueryCard(data: Query) {
  const [openDetails, setOpenDetails] = useState(false);

  const [message, setMessage] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      sender: "You",
      text: "ftghfghfghfgh",
      time: "19 May 2026 10:47 AM",
    },
    {
      id: 2,
      sender: "You",
      text: "fgdfgdf",
      time: "19 May 2026 10:47 AM",
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Send Message
  const handleSend = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;

    try {
      const formData = new FormData();

      formData.append("message", message);

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      // Example API
      await fetch("/api/query-reply", {
        method: "POST",
        body: formData,
      });

      // Create Local Message
      const newMessage: MessageType = {
        id: Date.now(),
        sender: "You",
        text: message,
        time: new Date().toLocaleString(),
        attachments: selectedFiles,
      };

      setMessages((prev) => [...prev, newMessage]);

      // Reset
      setMessage("");
      setSelectedFiles([]);

      // Reset input value
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
    }
  };
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(data.creation.replace(" ", "T")))
    .replace(/\b(am|pm)\b/i, (match) => match.toUpperCase())
    .replace(",", "");
  return (
    <>
      {/* Query Card */}
      <Card className="border shadow-sm">
        <CardContent className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Query Id */}
            <div>
              <p className="text-sm text-muted-foreground">Query ID</p>

              <button
                onClick={() => setOpenDetails(true)}
                className="mt-1 text-sm font-semibold text-[#1b3c91] hover:underline"
              >
                {data.name}
              </button>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>

              <p className="mt-1 text-sm font-medium text-black">
                {formattedDate}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>

              <p
                className={`mt-1 text-sm font-semibold ${data.status === "" || data.status === "Open" ? "text-red-500" : "text-green-500"}`}
              >
                {data.status === "" ? "Open" : data.status}
              </p>
            </div>

            {/* Category */}
            <div>
              <p className="text-sm text-muted-foreground">Category</p>

              <p className="mt-1 text-sm font-medium text-black">
                {data.query_category}
              </p>
            </div>
          </div>

          {/* Feedback */}
          <div className="border-t pt-2">
            {/* <p className="text-sm text-muted-foreground">Give us a Feedback</p>

            <p className="flex items-center gap-1">
              <ThumbsUp className="size-4 fill-black" />

              <span>-</span>
            </p> */}
          </div>
        </CardContent>
      </Card>

      {/* Overlay */}
      {openDetails && (
        <div
          onClick={() => setOpenDetails(false)}
          className="fixed inset-0 z-40 h-screen bg-black/40"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-xl bg-white shadow-2xl transition-transform duration-300 ${
          openDetails ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-yellow-400 px-4 py-3">
          <h2 className="text-lg font-semibold">Query Details - {data.name}</h2>

          <button onClick={() => setOpenDetails(false)}>
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex h-[calc(100%-55px)] flex-col">
          {/* Messages */}
          <div className="flex-1 space-y-5 overflow-y-auto bg-gray-50 p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[80%]">
                  <p
                    className={`mb-1 text-sm text-gray-500 ${
                      msg.sender === "You" ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.sender}
                  </p>

                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      msg.sender === "You"
                        ? "rounded-br-sm bg-green-100"
                        : "rounded-bl-sm bg-white"
                    }`}
                  >
                    {/* Message */}
                    {msg.text && (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}

                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2"
                          >
                            <FileText className="size-4 text-blue-600" />

                            <span className="truncate text-sm">
                              {file.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <p
                    className={`mt-1 text-xs text-gray-400 ${
                      msg.sender === "You" ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t bg-white p-3">
            {/* Textarea */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="mb-3 h-24 w-full rounded-md border p-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
            />

            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full border bg-gray-100 px-3 py-1 text-sm"
                  >
                    <Paperclip className="size-3" />

                    <span className="max-w-[140px] truncate">{file.name}</span>

                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBrowseClick}
              >
                Browse...
              </Button>

              <Button
                onClick={handleSend}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
