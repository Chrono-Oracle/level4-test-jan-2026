"use client";
import { CustomDialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Mail, Phone, Save } from "lucide-react";

// ✅ PROPER Contact type (same as Dashboard)
type Contact = {
  id: number;
  name: string;
  phone: string;
  addedBy: string;
};

// ✅ PROPER FormData type
type FormData = {
  fullName: string;
  phone: string;
  email: string;
  addedBy: string;
};

// ✅ FIXED Select with proper props
interface SelectProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

function Select({ children, value, className }: SelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={` w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-left text-white transition-all duration-300 ${className || ""}`}
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


interface EditContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onSave: (updatedContact: Contact) => void;
}

export function EditContactDialog({
  open,
  onOpenChange,
  contact,
  onSave,
}: EditContactDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: contact?.name || "",
    phone: contact?.phone || "",
    email: "",
    addedBy: contact?.addedBy || "",
  });

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const users = [
    { id: 1, name: "Admin User", category: "Admin" },
    { id: 2, name: "Daniel Oracle", category: "Teacher" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact) {
      const updatedContact: Contact = {
        ...contact,
        name: formData.fullName,
        phone: formData.phone,
        addedBy: formData.addedBy,
      };
      onSave(updatedContact);
      onOpenChange(false);
    }
  };

  // ✅ Don't render if no contact selected
  if (!open || !contact) return null;

  return (
    <CustomDialog title="Edit Contact" contentClassName="w-120" open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <User className="h-4 w-4" />
              Full Name *
            </label>
            <Input
              placeholder="John Doe"
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
              placeholder="+237 699 123 456"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <Input
              placeholder="john@example.com"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              Added By *
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="flex items-center justify-between w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-left text-white hover:border-indigo-500 transition-all"
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute z-10 w-full mt-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-auto"
                >
                  {users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, addedBy: user.name });
                        setIsSelectOpen(false);
                      }}
                      className="w-full px-4 py-3  hover:bg-white/10 rounded-xl text-white flex items-center gap-3 transition-all"
                    >
                      <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                      <span>{user.name}</span>
                      <span className="text-xs text-slate-400 ml-auto">
                        ({user.category})
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Update Contact
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}
