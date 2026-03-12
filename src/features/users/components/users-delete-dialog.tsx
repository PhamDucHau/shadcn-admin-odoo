'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { usersApi } from '../api/users'
import type { User } from '../data/schema'

type UsersDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UsersDeleteDialogProps) {
  const [value, setValue] = useState('')
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deactivated successfully')
      onOpenChange(false)
      setValue('')
    },
    onError: (error: { response?: { data?: { detail?: string } } }) => {
      toast.error(error.response?.data?.detail ?? 'Failed to deactivate user')
    },
  })

  const handleDelete = () => {
    if (value.trim() !== currentRow.login) return
    deleteMutation.mutate(currentRow.id)
  }

  const isConfirmed = value.trim() === currentRow.login

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={!isConfirmed || deleteMutation.isPending}
      isLoading={deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Deactivate User
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to deactivate{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            The user will no longer be able to sign in.
          </p>

          <Label className='my-2'>
            Type the login to confirm:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={currentRow.login}
              className='mt-1'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              This will deactivate the user account. They can be reactivated
              later if needed.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Deactivate'
      destructive
    />
  )
}
