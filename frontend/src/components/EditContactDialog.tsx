"use client";
import { CustomDialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { UserRound, Mail, Phone, Save, UsersRound } from "lucide-react";
import { Contact, User } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface EditContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onSave: (updatedContact: Contact) => void;
}

function formatPhoneNumber(value: string | number) {
  const nums = String(value).replace(/\D/g, "");
  let coreNumbers = nums.startsWith("237") ? nums.slice(3) : nums;
  coreNumbers = coreNumbers.slice(0, 9);

  const parts = [];
  if (coreNumbers.length > 0) parts.push(coreNumbers.slice(0, 1));
  if (coreNumbers.length > 1) parts.push(coreNumbers.slice(1, 3));
  if (coreNumbers.length > 3) parts.push(coreNumbers.slice(3, 5));
  if (coreNumbers.length > 5) parts.push(coreNumbers.slice(5, 7));
  if (coreNumbers.length > 7) parts.push(coreNumbers.slice(7, 9));

  return `+237 ${parts.join(" ")}`.trim();
}

export function EditContactDialog({
  open,
  onOpenChange,
  contact,
  onSave,
}: EditContactDialogProps) {
  const [formData, setFormData] = useState({
    fullName: contact?.fullname || "",
    phone: contact ? formatPhoneNumber(contact.phone) : "",
    email: contact?.email || "",
    addedBy: contact?.addedBy || "",
  });

  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    if (open) {
      api.getUsers().then(setDbUsers).catch(console.error);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    try {
      const rawPhone = formData.phone.replace(/\D/g, "");

      const updated = await api.updateContact(contact._id, {
        fullname: formData.fullName,
        phone: rawPhone,
        email: formData.email,
        addedBy: formData.addedBy,
      });

      toast.success("Changes saved", {
        description: `${formData.fullName}'s information has been updated.`,
      });

      onSave(updated);
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed";
      toast.error(msg);
    }
  };

  if (!open || !contact) return null;

  return (
    <CustomDialog
      title="Edit Contact"
      contentClassName="w-120"
      open={open}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <UserRound className="h-4 w-4" />
              Full Name *
            </label>
            <Input
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Phone className="h-4 w-4" />
              Phone *
            </label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: formatPhoneNumber(e.target.value),
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Backspace" && formData.phone.length <= 5)
                  e.preventDefault();
              }}
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <UsersRound className="h-4 w-4" /> Added By *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="flex items-center justify-between w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-left text-white hover:border-indigo-500 transition-all cursor-pointer"
              >
                <span className="block truncate">
                  {formData.addedBy || "Select user..."}
                </span>
                <svg
                  className={`ml-2 h-4 w-4 transition-transform ${isSelectOpen ? "rotate-180" : ""}`}
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

              {isSelectOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full mt-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-h-48 overflow-auto"
                >
                  {dbUsers.map((user) => {
                    const name = `${user.first_name} ${user.last_name}`;
                    return (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, addedBy: name });
                          setIsSelectOpen(false);
                        }}
                        className="w-full px-4 py-3 hover:bg-white/10 text-left text-white flex items-center gap-3 cursor-pointer"
                      >
                        <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                        <span>{name}</span>
                        <span className="text-xs text-slate-500 ml-auto">
                          ({user.category})
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            className="flex-1 py-2 hover:bg-red-500 cursor-pointer text-white"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 py-2 bg-green-500 text-white cursor-pointer"
          >
            <Save className="mr-2 h-4 w-4" /> Update Contact
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}
