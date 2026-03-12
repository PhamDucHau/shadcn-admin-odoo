import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TableSkeleton } from '@/components/ui/skeleton-enhanced'
import { SelectDropdown } from '@/components/select-dropdown'
import { approvalRequestsApi } from '../api/approval-requests'
import { approvalTypesApi } from '../api/approval-types'
import {
  createApprovalRequestInputSchema,
  type ApprovalRequest,
  type CreateApprovalRequestInput,
} from '../data/schema'

type ApprovalRequestsListProps = {
  preselectedTypeId?: number | null
}

export function ApprovalRequestsList({
  preselectedTypeId,
}: ApprovalRequestsListProps) {
  const [page, setPage] = useState(0)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [openDialog, setOpenDialog] = useState(false)
  const [editingRequest, setEditingRequest] = useState<ApprovalRequest | null>(
    null
  )

  const queryClient = useQueryClient()

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['approval-requests', page, limit, statusFilter],
    queryFn: async () => {
      const res = await approvalRequestsApi.getAll({
        limit,
        offset: page * limit,
        status: statusFilter,
      })
      return res.data
    },
  })

  const { data: typesData } = useQuery({
    queryKey: ['approval-types', 'all'],
    queryFn: async () => {
      const res = await approvalTypesApi.getAll({
        limit: 1000,
        offset: 0,
      })
      return res.data
    },
  })

  const typeOptions =
    typesData?.data.map((t) => ({
      label: t.name,
      value: String(t.id),
    })) ?? []

  const form = useForm<CreateApprovalRequestInput>({
    resolver: zodResolver(createApprovalRequestInputSchema),
    defaultValues: {
      category_id: preselectedTypeId ?? undefined,
      name: '',
      request_owner_id: undefined,
      request_date: '',
      amount: undefined,
      reference: '',
      reason: '',
    },
  })

  const resetForm = () => {
    form.reset({
      category_id: preselectedTypeId ?? undefined,
      name: editingRequest?.name ?? '',
      request_owner_id: editingRequest?.request_owner_id ?? undefined,
      request_date: editingRequest?.request_date ?? '',
      amount: editingRequest?.amount ?? undefined,
      reference: editingRequest?.reference ?? '',
      reason: editingRequest?.reason ?? '',
    })
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateApprovalRequestInput) =>
      approvalRequestsApi.create(payload),
    onSuccess: () => {
      toast.success('Approval request created')
      queryClient.invalidateQueries({ queryKey: ['approval-requests'] })
      setOpenDialog(false)
      setEditingRequest(null)
    },
    onError: (e: { response?: { data?: { detail?: string } } }) => {
      toast.error(e.response?.data?.detail ?? 'Failed to create request')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<CreateApprovalRequestInput>
    }) => approvalRequestsApi.update(id, payload),
    onSuccess: () => {
      toast.success('Approval request updated')
      queryClient.invalidateQueries({ queryKey: ['approval-requests'] })
      setOpenDialog(false)
      setEditingRequest(null)
    },
    onError: (e: { response?: { data?: { detail?: string } } }) => {
      toast.error(e.response?.data?.detail ?? 'Failed to update request')
    },
  })

  const actionMutation = useMutation({
    mutationFn: ({
      id,
      action,
    }: {
      id: number
      action: 'approve' | 'reject' | 'cancel'
    }) => {
      if (action === 'approve') return approvalRequestsApi.approve(id)
      if (action === 'reject') return approvalRequestsApi.reject(id)
      return approvalRequestsApi.cancel(id)
    },
    onSuccess: (_, variables) => {
      const verb =
        variables.action === 'approve'
          ? 'approved'
          : variables.action === 'reject'
            ? 'rejected'
            : 'cancelled'
      toast.success(`Request ${verb}`)
      queryClient.invalidateQueries({ queryKey: ['approval-requests'] })
      queryClient.invalidateQueries({ queryKey: ['approval-requests', 'to-review'] })
    },
    onError: (e: { response?: { data?: { detail?: string } } }) => {
      toast.error(e.response?.data?.detail ?? 'Failed to update request status')
    },
  })

  const onSubmit = (values: CreateApprovalRequestInput) => {
    const payload: CreateApprovalRequestInput = {
      ...values,
      amount: values.amount ?? undefined,
      reference: values.reference || undefined,
      reason: values.reason || undefined,
    }

    if (editingRequest) {
      updateMutation.mutate({ id: editingRequest.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  if (isLoading) {
    return <TableSkeleton rows={5} columns={5} />
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 py-8'>
        <div className='text-sm text-destructive'>
          Failed to load approval requests.
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ['approval-requests'] })
          }
        >
          Retry
        </Button>
      </div>
    )
  }

  const total = data?.count ?? 0
  const pageCount = total ? Math.ceil(total / limit) : 1

  return (
    <>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='text-xl font-semibold'>Approval Requests</h2>
          <p className='text-sm text-muted-foreground'>
            View and manage approval requests, similar to Odoo&apos;s flow.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <SelectDropdown
            placeholder='Status'
            items={[
              { label: 'All', value: '' },
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'Cancelled', value: 'cancelled' },
            ]}
            defaultValue={statusFilter ?? ''}
            onValueChange={(v) => setStatusFilter(v || undefined)}
          />
          <Button
            onClick={() => {
              setEditingRequest(null)
              resetForm()
              setOpenDialog(true)
            }}
          >
            New Request
          </Button>
        </div>
      </div>

      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='min-w-[180px]'>Name</TableHead>
              <TableHead>Approval Type</TableHead>
              <TableHead className='min-w-[120px]'>Owner</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[220px] text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.length ? (
              data.data.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className='font-medium'>{request.name}</TableCell>
                  <TableCell>
                    {typesData?.data.find(
                      (t) => t.id === request.category_id
                    )?.name || '-'}
                  </TableCell>
                  <TableCell>{request.request_owner_id}</TableCell>
                  <TableCell>{request.request_date}</TableCell>
                  <TableCell className='text-right'>
                    {request.amount != null ? request.amount.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={request.status ?? 'pending'} />
                  </TableCell>
                  <TableCell className='space-x-2 text-right'>
                    <Button
                      size='xs'
                      variant='outline'
                      onClick={() => {
                        setEditingRequest(request)
                        resetForm()
                        setOpenDialog(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size='xs'
                      variant='outline'
                      disabled={actionMutation.isPending}
                      onClick={() =>
                        actionMutation.mutate({
                          id: request.id,
                          action: 'approve',
                        })
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      size='xs'
                      variant='outline'
                      disabled={actionMutation.isPending}
                      onClick={() =>
                        actionMutation.mutate({
                          id: request.id,
                          action: 'reject',
                        })
                      }
                    >
                      Reject
                    </Button>
                    <Button
                      size='xs'
                      variant='ghost'
                      className='text-destructive hover:text-destructive'
                      disabled={actionMutation.isPending}
                      onClick={() =>
                        actionMutation.mutate({
                          id: request.id,
                          action: 'cancel',
                        })
                      }
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='h-24 text-center text-sm text-muted-foreground'
                >
                  No approval requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className='mt-4 flex items-center justify-between gap-4 text-xs text-muted-foreground'>
          <span>
            Page {page + 1} of {pageCount}
          </span>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={page === 0 || isFetching}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              disabled={page + 1 >= pageCount || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          if (!open) setEditingRequest(null)
          setOpenDialog(open)
        }}
      >
        <DialogContent className='sm:max-w-xl'>
          <DialogHeader className='text-start'>
            <DialogTitle>
              {editingRequest ? 'Edit Approval Request' : 'New Approval Request'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id='approval-request-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid gap-4 md:grid-cols-2'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Buy laptop for new staff'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approval type</FormLabel>
                    <SelectDropdown
                      items={typeOptions}
                      placeholder='Select approval type'
                      defaultValue={
                        field.value != null ? String(field.value) : undefined
                      }
                      onValueChange={(v) =>
                        field.onChange(v ? Number(v) : undefined)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='request_owner_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner (user id)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='request_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number.parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='reference'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference</FormLabel>
                    <FormControl>
                      <Input placeholder='PO-2026-001' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='reason'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Need laptop for new staff'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <Button
              type='submit'
              form='approval-request-form'
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline'
  let label = status

  if (normalized === 'pending') {
    variant = 'secondary'
    label = 'Pending'
  } else if (normalized === 'approved') {
    variant = 'default'
    label = 'Approved'
  } else if (normalized === 'rejected') {
    variant = 'destructive'
    label = 'Rejected'
  } else if (normalized === 'cancelled') {
    variant = 'outline'
    label = 'Cancelled'
  }

  return <Badge variant={variant}>{label}</Badge>
}

