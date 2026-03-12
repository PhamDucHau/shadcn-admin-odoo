import { Link, useParams } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Trash2 } from 'lucide-react'
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
import { contactsApi } from './api/contacts'

function formatField(value: unknown): string {
  if (value == null || value === '') return '—'
  if (Array.isArray(value)) return `${value[0]} - ${value[1]}`
  return String(value)
}

export function ContactDetail() {
  const { contactId } = useParams({
    from: '/_authenticated/contacts/$contactId',
  })
  const id = Number(contactId)
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['contact', id],
    queryFn: async () => {
      const res = await contactsApi.getById(id)
      return res.data
    },
    enabled: !Number.isNaN(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => contactsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast.success('Contact deleted successfully')
      setDeleteDialogOpen(false)
      setConfirmDelete('')
      window.history.back()
    },
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      toast.error(err.response?.data?.detail ?? 'Failed to delete contact')
    },
  })

  const handleDelete = () => {
    if (confirmDelete === data?.data?.name) {
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
          <p className='text-destructive'>Failed to load contact</p>
          <Button asChild variant='outline'>
            <Link to='/contacts'>Back to list</Link>
          </Button>
        </div>
      </Header>
    )
  }

  const contact = data.data

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
            <Link to='/contacts'>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div className='flex-1'>
            <h2 className='text-2xl font-bold tracking-tight'>{contact.name}</h2>
            <p className='text-muted-foreground'>Contact details</p>
          </div>
        </div>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>Information</CardTitle>
              <CardDescription>
                Contact details and information
              </CardDescription>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' asChild>
                <Link to='/contacts'>
                  <ArrowLeft className='me-1 h-4 w-4' />
                  Back to list
                </Link>
              </Button>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className='me-1 h-4 w-4' />
                Delete
              </Button>
            </div>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>ID</p>
              <p>{contact.id}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>Name</p>
              <p>{contact.name}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>Email</p>
              <p>{formatField(contact.email)}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>Phone</p>
              <p>{formatField(contact.phone)}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>City</p>
              <p>{formatField(contact.city)}</p>
            </div>
            {'country_id' in contact && (
              <div className='space-y-1'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Country
                </p>
                <p>{formatField(contact.country_id)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </Main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {contact.name}? This action cannot be
              undone. Type the name to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='py-4'>
            <input
              type='text'
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder={contact.name}
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors'
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={
                confirmDelete !== contact.name || deleteMutation.isPending
              }
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
