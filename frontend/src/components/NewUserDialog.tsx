"use client";
import { CustomDialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Users } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

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
        className={`flex items-center justify-between w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-left text-white hover:border-indigo-500 transition-all cursor-pointer ${className || ""}`}
      >
        <span className="block truncate">{value || "Select category..."}</span>
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
          className="absolute z-10 w-full mt-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-h-48 overflow-auto"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export function NewUserDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    category: "Student",
  });

  const getArticle = (word: string) => {
    const vowels = ["A", "E", "I", "O", "U"];
    return vowels.includes(word.charAt(0).toUpperCase()) ? "an" : "a";
  };

  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.category.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
        category: formData.category,
      });

      toast.success("User created successfully!", {
        description: `${formData.firstName} ${formData.lastName} has been added as ${getArticle(formData.category)} ${formData.category}.`,
      });

      onOpenChange(false);

      setFormData({ firstName: "", lastName: "", category: "Student" });
    } catch (err) {
      console.error(err);

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';

      toast.error("Failed to create user", {
          description: errorMessage,
        });
    }
  };

  return (
    <CustomDialog
      title="New User"
      contentClassName="w-120"
      open={open}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <User className="h-4 w-4" />
              First Name *
            </label>
            <Input
              placeholder="Daniel"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <User className="h-4 w-4" />
              Last Name *
            </label>
            <Input
              placeholder="Oracle"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Users className="h-4 w-4" />
              Category *
            </label>
            <Select
              value={formData.category}
              onValueChange={(val) =>
                setFormData({ ...formData, category: val })
              }
            >
              {["Admin", "Teacher", "Student"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, category: cat });
                    // Note: You might need to manage the 'open' state of Select if
                    // you want it to close automatically on click.
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-green-400 cursor-pointer transition-colors border-b border-white/5 last:border-none"
                >
                  {cat}
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
                : "text-white bg-green-500 cursor-pointer"
            }`}
            disabled={!isFormValid}
          >
            Add User
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}
