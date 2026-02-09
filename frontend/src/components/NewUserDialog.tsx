"use client";
import { CustomDialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Users } from "lucide-react";

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
    category: "",
  });

  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.category.trim() !== "";

  const categories = [
    { id: 1, label: "Admin", icon: "👑" },
    { id: 2, label: "Teacher", icon: "📚" },
    { id: 3, label: "Student", icon: "🎓" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New user:", formData);
    onOpenChange(false);
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
              onValueChange={(value: string) =>
                setFormData({ ...formData, category: value })
              }
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, category: cat.label })
                  }
                  className="w-full px-4 py-3 text-left hover:bg-white/10 rounded-xl text-white flex items-center gap-3 transition-all"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.label}</span>
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
            Add User
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}
