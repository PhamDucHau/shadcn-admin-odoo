import { useParams, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
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
import { employeesApi } from './api/employees'
import { useState } from 'react'

function formatField(value: unknown): string {
  if (value == null || value === '') return '—'
  if (Array.isArray(value)) return `${value[0]} - ${value[1]}`
  return String(value)
}

export function EmployeeDetail() {
  const { employeeId } = useParams({ from: '/_authenticated/employees/$employeeId' })
  const id = Number(employeeId)
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const res = await employeesApi.getById(id)
      return res.data
    },
    enabled: !Number.isNaN(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => employeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Employee deleted successfully')
      setDeleteDialogOpen(false)
      setConfirmDelete('')
      window.history.back()
    },
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      toast.error(err.response?.data?.detail ?? 'Failed to delete employee')
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
          <p className='text-destructive'>Failed to load employee</p>
          <Button asChild variant='outline'>
            <Link to='/employees'>Back to list</Link>
          </Button>
        </div>
      </Header>
    )
  }

  const employee = data.data

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
            <Link to='/employees'>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div className='flex-1'>
            <h2 className='text-2xl font-bold tracking-tight'>{employee.name}</h2>
            <p className='text-muted-foreground'>Employee details</p>
          </div>
        </div>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>Information</CardTitle>
              <CardDescription>Employee details and contact information</CardDescription>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' asChild>
                <Link to='/employees'>
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
              <p>{employee.id}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>Name</p>
              <p>{employee.name}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>Email</p>
              <p>{formatField(employee.work_email)}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-muted-foreground'>Phone</p>
              <p>{formatField(employee.work_phone)}</p>
            </div>
            {'department_id' in employee && (
              <div className='space-y-1'>
                <p className='text-sm font-medium text-muted-foreground'>Department</p>
                <p>{formatField(employee.department_id)}</p>
              </div>
            )}
            {'job_id' in employee && (
              <div className='space-y-1'>
                <p className='text-sm font-medium text-muted-foreground'>Job</p>
                <p>{formatField(employee.job_id)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </Main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {employee.name}? This action cannot be
              undone. Type the name to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='py-4'>
            <input
              type='text'
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder={employee.name}
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors'
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={
                confirmDelete !== employee.name || deleteMutation.isPending
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
