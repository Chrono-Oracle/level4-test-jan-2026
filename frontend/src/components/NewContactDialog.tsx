"use client";
import { CustomDialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion"; // ← ADD THIS!
import { useState } from "react";
import { User, Mail, Phone } from "lucide-react";

function Select({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-left text-white hover:border-indigo-500 transition-all ${className || ""}`}
      >
        <span className="block truncate">{value || "Select user..."}</span>
        <svg
          className={`ml-2 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-10 w-full mt-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-auto"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export function NewContactDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    addedBy: "",
  });

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.addedBy.trim() !== "";

  // Mock users
  const users = [
    { id: 1, name: "Admin User", category: "Admin" },
    { id: 2, name: "Daniel Oracle", category: "Teacher" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log("New contact:", formData);
    onOpenChange(false);
  };

  return (
    <CustomDialog
      title="New Contact"
      contentClassName="w-150"
      open={open}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit} className="space-y-6 ">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              {" "}
              {/* ← flex not block */}
              <User className="h-4 w-4" />
              Full Name *
            </label>
            <Input
              placeholder="Daniel Tankeu"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          <div className="flex gap-5">
            <div className="w-1/2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Phone className="h-4 w-4" />
                Phone *
              </label>
              <Input
                placeholder="+237 699 123 456"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="w-1/2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <Input
                placeholder="danny@example.com"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              Added By *
            </label>
            <Select
              value={formData.addedBy}
              onValueChange={(value: string) =>
                setFormData({ ...formData, addedBy: value })
              }
            >
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, addedBy: user.name })
                  } // ← FIXED: direct call
                  className="w-full px-4 py-3 text-left hover:bg-white/10 rounded-xl text-white flex items-center gap-3 transition-all"
                >
                  <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                  <span>{user.name}</span>
                  <span className="text-xs text-slate-400 ml-auto">
                    ({user.category})
                  </span>
                </button>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            className="flex-1 text-white hover:bg-red-600 cursor-pointer py-2"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={`flex-1 py-2 ${
              !isFormValid
                ? "text-white/30 cursor-not-allowed bg-black/30" 
                : "text-white bg-green-500" 
            }`}
            disabled={!isFormValid}
          >
            Create Contact
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}
