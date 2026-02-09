"use client";

import { api } from "@/lib/api";
import type { Contact } from "@/types";

import { Button } from "@/components/ui/button";
import {
  UserPlus,
  UserPlus2,
  Users,
  Trash2,
  Edit,
  ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { NewContactDialog } from "@/components/NewContactDialog";
import { NewUserDialog } from "@/components/NewUserDialog";
import { EditContactDialog } from "@/components/EditContactDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import Link from "next/link";

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isNewContactOpen, setIsNewContactOpen] = useState(false);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const data = await api.getContacts();
        setContacts(data);
      } catch (err: any) {
        setError(err.message ?? "Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, []);

  const handleContactCreated = (contact: Contact) => {
    setContacts(prev => [contact, ...prev]);
    setIsNewContactOpen(false);
  };

   const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsEditContactOpen(true);
  };

  const handleEditSave = async (updatedContact: Contact) => {
    try {
      const saved = await api.updateContact(updatedContact._id, {
        fullname: updatedContact.fullname,
        phone: updatedContact.phone,
        email: updatedContact.email,
      });
      setContacts((prev) => prev.map((c) => (c._id === saved._id ? saved : c)));
    } catch (err: any) {
      console.error("Update failed:", err);
    }
    setIsEditContactOpen(false);
  };


  const handleDelete = async () => {
    if (!deletingContactId) return;
    try {
      await api.deleteContact(deletingContactId);
      setContacts((prev) => prev.filter((c) => c._id !== deletingContactId));
    } catch (err: any) {
      console.error("Delete failed:", err);
    }
    setIsDeleteConfirmOpen(false);
    setDeletingContactId(null);
  };


  if (loading) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="glass p-8 rounded-3xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading contacts...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-12">
          <div>
            <div className="flex gap-2 items-start">
              <Link className="mt-1.5" href="/">
                <ChevronLeft width={25} />
              </Link>
              <div>
                <h1 className="text-2xl font-black bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text">
                  Dashboard
                </h1>
                <p className="text-slate-400 text-md">
                  Manage your contacts & users
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setIsNewContactOpen(true)}
              className="group bg-green-400 px-4 py-2 flex gap-3 text-white cursor-pointer hover:bg-white hover:text-green-400 hover:border-2 hover:border-green-300"
            >
              <UserPlus className="group-hover:translate-x-1 transition-transform" />
              <span>New Contact</span>
            </Button>
            <Button
              onClick={() => setIsNewUserOpen(true)}
              className="group text-green-400 border-2 border-green-400 px-4 py-2 flex gap-3 cursor-pointer hover:bg-green-400 hover:text-white hover:border-none"
            >
              <UserPlus2 className="group-hover:translate-x-1 transition-transform" />
              <span>New User</span>
            </Button>
          </div>
        </div>

        {/* ✅ ERROR STATE */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 mb-8 bg-rose-500/10 border border-rose-400/30"
          >
            <p className="text-rose-400 font-medium">Error: {error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-rose-500 text-white px-4 py-2"
            >
              Retry
            </Button>
          </motion.div>
        )}

        {/* Contacts Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-8 w-8 text-green-400" />
            <h2 className="text-2xl font-bold">Contacts ({contacts.length})</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-black bg-gray-500/20 ">
                  <th className="text-left pl-5 py-4 font-semibold ">ID</th>
                  <th className="text-left py-4 font-semibold">Full Name</th>
                  <th className="text-left py-4 font-semibold ">Phone</th>
                  <th className="text-left py-4 font-semibold">Email</th>
                  <th className="text-left py-4 font-semibold ">Added By</th>
                  <th className="py-4 font-semibold w-10">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, index) => (
                  <motion.tr
                    key={contact._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-300/10 border-b border-black/10 h-16"
                  >
                    <td className="pl-5 py-4 font-mono text-green-400">
                      {contact._id.slice(-8)}
                    </td>
                    <td className="py-4 font-semibold">{contact.fullname}</td>
                    <td className="py-4 text-slate-400">{contact.phone}</td>
                    <td className="py-4 text-slate-400">{contact.email}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-2 bg-green-300/20 text-green-400 px-3 py-1 rounded-full text-sm">
                        {contact.addedBy}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          className="h-10 w-10 p-0"
                          onClick={() => handleEditSave(contact)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          className="h-10 w-10 p-0"
                          onClick={() => {
                            setDeletingContactId(contact._id);
                            setIsDeleteConfirmOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* EMPTY STATE */}
            {contacts.length === 0 && !loading && (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-slate-500 mx-auto mb-4 opacity-50" />
                <p className="text-slate-400 text-lg mb-4">No contacts yet</p>
                <Button onClick={() => setIsNewContactOpen(true)}>
                  Create your first contact
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <NewContactDialog
        open={isNewContactOpen}
        onOpenChange={setIsNewContactOpen}
        onCreated={handleContactCreated}
      />

      <NewUserDialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen} />

      <EditContactDialog
        open={isEditContactOpen}
        onOpenChange={setIsEditContactOpen}
        contact={editingContact}
        onSave={handleEditSave}
      />
      <DeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleDelete}
        contactName={
          contacts.find((c) => c._id === deletingContactId)?.fullname || ""
        }
      />
    </main>
  );
}
