import { Link, useParams } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, KeyRound, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { usersApi } from './api/users'
import { UsersChangePasswordDialog } from './components/users-change-password-dialog'

function formatField(value: unknown): string {
  if (value == null || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Active' : 'Inactive'
  return String(value)
}

export function UserDetail() {
  const { userId } = useParams({ from: '/_authenticated/users/$userId' })
  const id = Number(userId)
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState('')
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await usersApi.getById(id)
      return res.data
    },
    enabled: !Number.isNaN(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deactivated successfully')
      setDeleteDialogOpen(false)
      setConfirmDelete('')
      window.history.back()
    },
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      toast.error(err.response?.data?.detail ?? 'Failed to deactivate user')
    },
  })

  const handleDelete = () => {
    if (confirmDelete === data?.data?.login) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <Header fixed>
        <div className='flex flex-1 items-center justify-center py-12'>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </Header>
    )
  }

  if (error || !data) {
    return (
      <Header fixed>
        <div className='flex flex-1 flex-col items-center justify-center gap-4 py-12'>
          <p className='text-destructive'>Failed to load user</p>
          <Button asChild variant='outline'>
            <Link to='/users'>Back to list</Link>
          </Button>
        </div>
      </Header>
    )
  }

  const user = data.data

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-center gap-2'>
          <Button variant='ghost' size='icon' asChild>
            <Link to='/users'>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div className='flex-1'>
            <h2 className='text-2xl font-bold tracking-tight'>{user.name}</h2>
            <p className='text-muted-foreground'>User details</p>
          </div>
        </div>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>Information</CardTitle>
              <CardDescription>User details</CardDescription>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' asChild>
                <Link to='/users'>
                  <ArrowLeft className='me-1 h-4 w-4' />
                  Back to list
                </Link>
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setChangePasswordOpen(true)}
              >
                <KeyRound className='me-1 h-4 w-4' />
                Change Password
              </Button>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className='me-1 h-4 w-4' />
                Deactivate
              </Button>
            </div>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>ID</p>
              <p>{user.id}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>Name</p>
              <p>{user.name}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>Login</p>
              <p>{user.login}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>Email</p>
              <p>{formatField(user.email)}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>Phone</p>
              <p>{formatField(user.phone)}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>Status</p>
              <Badge
                variant='outline'
                className={cn(
                  user.active !== false
                    ? 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'
                    : 'bg-neutral-300/40 border-neutral-300'
                )}
              >
                {formatField(user.active)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Main>

      <UsersChangePasswordDialog
        currentRow={user}
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate user</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {user.name}? They will no longer
              be able to sign in. Type the login to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='py-4'>
            <input
              type='text'
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder={user.login}
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors'
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={
                confirmDelete !== user.login || deleteMutation.isPending
              }
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {deleteMutation.isPending ? 'Deactivating...' : 'Deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
