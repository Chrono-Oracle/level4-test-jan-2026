'use client'
import { CustomDialog } from './ui/dialog'
import { Button } from './ui/button'
import { Trash2, AlertTriangle } from 'lucide-react'

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  contactName?: string
}

export function DeleteConfirmDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  contactName 
}: DeleteConfirmDialogProps) {
  return (
    <CustomDialog title="Confirm Delete" open={open} onOpenChange={onOpenChange}>
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-400/30">
          <AlertTriangle className="w-10 h-10 text-rose-400" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">
          Delete {contactName || 'this contact'}?
        </h3>
        
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          This action cannot be undone. This will permanently delete the contact and remove it from your dashboard.
        </p>

        <div className="flex gap-4">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            className="flex-1 group hover:brightness-110"
            onClick={onConfirm}
          >
            <Trash2 className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Delete Contact
          </Button>
        </div>
      </div>
    </CustomDialog>
  )
}
