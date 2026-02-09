"use client";
import { CustomDialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion"; // ← ADD THIS!
import { useState, useEffect } from "react";
import { UserRound, Mail, Phone } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Contact, User } from "@/types";

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
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (contact: Contact) => void;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "+237 ",
    email: "",
    addedBy: "",
  });

  const formatPhoneNumber = (value: string) => {
    // Remove everything except numbers
    const nums = value.replace(/\D/g, "");

    // Extract only the numbers after the country code (237)
    // If the user typed 237 again, we skip it
    let coreNumbers = nums.startsWith("237") ? nums.slice(3) : nums;

    coreNumbers = coreNumbers.slice(0, 9);

    //Apply the "6 91 45 02 11" pattern
    const parts = [];
    if (coreNumbers.length > 0) parts.push(coreNumbers.slice(0, 1)); // 6
    if (coreNumbers.length > 1) parts.push(coreNumbers.slice(1, 3)); // 91
    if (coreNumbers.length > 3) parts.push(coreNumbers.slice(3, 5)); // 45
    if (coreNumbers.length > 5) parts.push(coreNumbers.slice(5, 7)); // 02
    if (coreNumbers.length > 7) parts.push(coreNumbers.slice(7, 9)); // 11

    return `+237 ${parts.join(" ")}`.trim();
  };

  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (open) {
      const loadUsers = async () => {
        try {
          setLoadingUsers(true);
          const data = await api.getUsers();
          setDbUsers(data);
        } catch (err) {
          console.error("Failed to load users:", err);
        } finally {
          setLoadingUsers(false);
        }
      };
      loadUsers();
    }
  }, [open]);

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.addedBy.trim() !== "";

  const getArticle = (word: string) => {
    const vowels = ["A", "E", "I", "O", "U"];
    return vowels.includes(word.charAt(0).toUpperCase()) ? "an" : "a";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rawPhoneNumber = formData.phone.replace(/\D/g, "");

      const response = await api.createContact({
        fullname: formData.fullName,
        phone: rawPhoneNumber,
        email: formData.email,
        addedBy: formData.addedBy,
      });

      // Success Popup with Detail
      const selectedUser = dbUsers.find(
        (u) => `${u.first_name} ${u.last_name}` === formData.addedBy,
      );
      const category = selectedUser?.category || "User";

      toast.success("Contact created!", {
        description: `${formData.fullName} was successfully added by ${formData.addedBy} (${getArticle(category)} ${category}).`,
      });

      onCreated(response);
      onOpenChange(false);
      setFormData({ fullName: "", phone: "", email: "", addedBy: "" });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error("Failed to create contact", {
        description: errorMessage,
      });
    }
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
              <UserRound className="h-4 w-4" />
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
                placeholder="+237 6 91 45 02 11"
                value={formData.phone}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setFormData({ ...formData, phone: formatted });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && formData.phone.length <= 5) {
                    e.preventDefault();
                  }
                }}
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
              className="cursor-pointer"
              value={formData.addedBy}
              onValueChange={(val) =>
                setFormData({ ...formData, addedBy: val })
              }
            >
              {loadingUsers ? (
                <div className="p-4 text-slate-400 text-sm animate-pulse">
                  Loading users...
                </div>
              ) : dbUsers.length === 0 ? (
                <div className="p-4 text-slate-400 text-sm">
                  No users found in database
                </div>
              ) : (
                dbUsers.map((user) => {
                  const fullName = `${user.first_name} ${user.last_name}`;
                  return (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, addedBy: fullName })
                      }
                      className="w-full px-4 py-3 text-left cursor-pointer hover:bg-green-500/20 rounded-xl text-white flex items-center gap-3 transition-all"
                    >
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      <span>{fullName}</span>
                      <span className="text-xs text-slate-400 ml-auto bg-white/5 px-2 py-1 rounded-md">
                        {user.category}
                      </span>
                    </button>
                  );
                })
              )}
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
                : "text-white bg-green-500 cursor-pointer"
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
