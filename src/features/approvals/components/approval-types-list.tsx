import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { TableSkeleton } from '@/components/ui/skeleton-enhanced'
import { SelectDropdown } from '@/components/select-dropdown'
import { usersApi } from '@/features/users/api/users'
import { approvalTypesApi } from '../api/approval-types'
import {
  createApprovalTypeInputSchema,
  type ApprovalType,
  type CreateApprovalTypeInput,
} from '../data/schema'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type ApprovalTypesListProps = {
  onSelectTypeForRequest?: (type: ApprovalType) => void
}

type FieldOption = 'required' | 'optional' | 'none'

type ApproverFormLine = {
  title: string
  user_id: number | undefined
  approval_type: 'required' | 'optional'
}

export function ApprovalTypesList({
  onSelectTypeForRequest,
}: ApprovalTypesListProps) {
  const [page, setPage] = useState(0)
  const [limit] = useState(12)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingType, setEditingType] = useState<ApprovalType | null>(null)
  const [itemOpt, setItemOpt] = useState<FieldOption>('none')
  const [amountOpt, setAmountOpt] = useState<FieldOption>('none')
  const [quantityOpt, setQuantityOpt] = useState<FieldOption>('none')
  const [referenceOpt, setReferenceOpt] = useState<FieldOption>('none')

  const queryClient = useQueryClient()

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['approval-types', page, limit],
    queryFn: async () => {
      const res = await approvalTypesApi.getAll({
        limit,
        offset: page * limit,
      })
      return res.data
    },
  })

  const { data: usersData } = useQuery({
    queryKey: ['users', 'all-for-approvals'],
    queryFn: async () => {
      const res = await usersApi.getAll({
        limit: 1000,
        offset: 0,
      })
      return res.data
    },
    enabled: openDialog,
  })

  const userOptions =
    usersData?.data.map((user) => ({
      label: user.name,
      value: String(user.id),
    })) ?? []

  const form = useForm<CreateApprovalTypeInput>({
    resolver: zodResolver(createApprovalTypeInputSchema),
    defaultValues: {
      name: '',
      approval_minimum: 1,
      has_item: false,
      has_amount: false,
      has_quantity: false,
      has_reference: false,
    },
  })

  const {
    fields: approverFields,
    append: appendApprover,
    remove: removeApprover,
  } = useFieldArray({
    control: form.control,
    name: 'approvers' as never,
  })

  const resetForm = () => {
    if (editingType) {
      form.reset({
        name: editingType.name,
        approval_minimum: editingType.approval_minimum,
        has_item: editingType.has_item ?? false,
        has_amount: editingType.has_amount ?? false,
        has_quantity: editingType.has_quantity ?? false,
        has_reference: editingType.has_reference ?? false,
      })
      setItemOpt(editingType.has_item ? 'optional' : 'none')
      setAmountOpt(editingType.has_amount ? 'optional' : 'none')
      setQuantityOpt(editingType.has_quantity ? 'optional' : 'none')
      setReferenceOpt(editingType.has_reference ? 'optional' : 'none')
      // reset approvers UI list
      if (Array.isArray((editingType as unknown as { approvers?: ApproverFormLine[] }).approvers)) {
        const approvers = (editingType as unknown as { approvers?: ApproverFormLine[] })
          .approvers ?? []
        form.setValue('approvers' as never, approvers as never)
      } else {
        form.setValue('approvers' as never, [] as never)
      }
    } else {
      form.reset({
        name: '',
        approval_minimum: 1,
        has_item: false,
        has_amount: false,
        has_quantity: false,
        has_reference: false,
      })
      setItemOpt('none')
      setAmountOpt('none')
      setQuantityOpt('none')
      setReferenceOpt('none')
      form.setValue('approvers' as never, [] as never)
    }
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateApprovalTypeInput) =>
      approvalTypesApi.create(payload),
    onSuccess: () => {
      toast.success('Approval type created')
      queryClient.invalidateQueries({ queryKey: ['approval-types'] })
      setOpenDialog(false)
      setEditingType(null)
    },
    onError: (e: { response?: { data?: { detail?: string } } }) => {
      toast.error(e.response?.data?.detail ?? 'Failed to create approval type')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: CreateApprovalTypeInput
    }) => approvalTypesApi.update(id, payload),
    onSuccess: () => {
      toast.success('Approval type updated')
      queryClient.invalidateQueries({ queryKey: ['approval-types'] })
      setOpenDialog(false)
      setEditingType(null)
    },
    onError: (e: { response?: { data?: { detail?: string } } }) => {
      toast.error(e.response?.data?.detail ?? 'Failed to update approval type')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => approvalTypesApi.delete(id),
    onSuccess: () => {
      toast.success('Approval type deleted')
      queryClient.invalidateQueries({ queryKey: ['approval-types'] })
    },
    onError: (e: { response?: { data?: { detail?: string } } }) => {
      toast.error(e.response?.data?.detail ?? 'Failed to delete approval type')
    },
  })

  const onSubmit = (values: CreateApprovalTypeInput & { approvers?: ApproverFormLine[] }) => {
    const payload: CreateApprovalTypeInput = {
      ...values,
      has_item: itemOpt !== 'none',
      has_amount: amountOpt !== 'none',
      has_quantity: quantityOpt !== 'none',
      has_reference: referenceOpt !== 'none',
    }

    if (editingType) {
      updateMutation.mutate({
        id: editingType.id,
        payload,
      })
    } else {
      createMutation.mutate(payload)
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  if (isLoading) {
    return <TableSkeleton rows={3} columns={3} />
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 py-8'>
        <div className='text-sm text-destructive'>
          Failed to load approval types.
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ['approval-types'] })
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
      <div className='mb-4 flex items-center justify-between gap-2'>
        <div>
          <h2 className='text-xl font-semibold'>Approval Types</h2>
          <p className='text-sm text-muted-foreground'>
            Configure approval categories similar to Odoo.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingType(null)
            resetForm()
            setOpenDialog(true)
          }}
        >
          New Approval Type
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {data?.data.map((type) => (
          <Card
            key={type.id}
            className='flex flex-col justify-between border-dashed transition hover:border-primary hover:shadow-sm'
          >
            <CardHeader className='flex flex-row items-start justify-between space-y-0 gap-2'>
              <div>
                <CardTitle className='line-clamp-2 text-base'>
                  {type.name}
                </CardTitle>
                <CardDescription className='mt-1 text-xs'>
                  Minimum approvers:{' '}
                  <span className='font-medium'>
                    {type.approval_minimum ?? 0}
                  </span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className='flex flex-1 flex-col justify-between gap-4'>
              <div className='grid grid-cols-2 gap-2 text-xs'>
                <FeaturePill label='Items' active={!!type.has_item} />
                <FeaturePill label='Amount' active={!!type.has_amount} />
                <FeaturePill label='Quantity' active={!!type.has_quantity} />
                <FeaturePill label='Reference' active={!!type.has_reference} />
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                {onSelectTypeForRequest && (
                  <Button
                    size='sm'
                    className='flex-1'
                    onClick={() => onSelectTypeForRequest(type)}
                  >
                    New Request
                  </Button>
                )}
                <Button
                  size='sm'
                  variant='outline'
                  className='flex-1'
                  onClick={() => {
                    setEditingType(type)
                    resetForm()
                    setOpenDialog(true)
                  }}
                >
                  Edit
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  className='ms-auto text-destructive hover:text-destructive'
                  onClick={() => {
                    deleteMutation.mutate(type.id)
                  }}
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
          if (!open) {
            setEditingType(null)
          }
          setOpenDialog(open)
        }}
      >
        <DialogContent className='sm:max-w-3xl'>
          <DialogHeader className='text-start'>
            <DialogTitle>
              {editingType ? 'Edit Approval Type' : 'New Approval Type'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id='approval-type-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Purchase approval' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <section className='space-y-3'>
                <h4 className='text-sm font-semibold'>Fields</h4>
                <div className='grid gap-4 md:grid-cols-2'>
                  <FieldOptionsRow
                    label='Item Opt'
                    value={itemOpt}
                    onChange={setItemOpt}
                  />
                  <FieldOptionsRow
                    label='Amount Opt'
                    value={amountOpt}
                    onChange={setAmountOpt}
                  />
                  <FieldOptionsRow
                    label='Quantity Opt'
                    value={quantityOpt}
                    onChange={setQuantityOpt}
                  />
                  <FieldOptionsRow
                    label='Reference Opt'
                    value={referenceOpt}
                    onChange={setReferenceOpt}
                  />
                </div>
              </section>

              <section className='space-y-3'>
                <div className='flex flex-wrap items-end justify-between gap-3'>
                  <FormField
                    control={form.control}
                    name='approval_minimum'
                    render={({ field }) => (
                      <FormItem className='w-full max-w-xs'>
                        <FormLabel>Minimum Approvers</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            min={0}
                            value={field.value ?? 0}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='space-y-2'>
                  <h4 className='text-sm font-semibold'>Approvers</h4>
                  <div className='overflow-hidden rounded-md border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='w-[40%]'>Title</TableHead>
                          <TableHead className='w-[30%]'>User</TableHead>
                          <TableHead className='w-[20%]'>
                            Type of Approval
                          </TableHead>
                          <TableHead className='w-[10%]' />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approverFields.length ? (
                          approverFields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell>
                                <Input
                                  placeholder='Approval 1'
                                  {...form.register(
                                    `approvers.${index}.title` as const
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <SelectDropdown
                                  placeholder='Select user'
                                  items={userOptions}
                                  defaultValue={
                                    form.watch(
                                      `approvers.${index}.user_id` as const
                                    ) != null
                                      ? String(
                                          form.watch(
                                            `approvers.${index}.user_id` as const
                                          ),
                                        )
                                      : undefined
                                  }
                                  onValueChange={(v) =>
                                    form.setValue(
                                      `approvers.${index}.user_id` as const,
                                      v ? Number(v) : undefined
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <RadioGroup
                                  className='flex gap-3'
                                  value={
                                    (form.watch(
                                      `approvers.${index}.approval_type` as const
                                    ) as ApproverFormLine['approval_type']) ??
                                    'required'
                                  }
                                  onValueChange={(val) =>
                                    form.setValue(
                                      `approvers.${index}.approval_type` as const,
                                      val as ApproverFormLine['approval_type']
                                    )
                                  }
                                >
                                  <div className='flex items-center gap-1.5'>
                                    <RadioGroupItem
                                      value='required'
                                      id={`approver-${index}-required`}
                                    />
                                    <FormLabel
                                      htmlFor={`approver-${index}-required`}
                                      className='text-xs font-normal'
                                    >
                                      Required
                                    </FormLabel>
                                  </div>
                                  <div className='flex items-center gap-1.5'>
                                    <RadioGroupItem
                                      value='optional'
                                      id={`approver-${index}-optional`}
                                    />
                                    <FormLabel
                                      htmlFor={`approver-${index}-optional`}
                                      className='text-xs font-normal'
                                    >
                                      Optional
                                    </FormLabel>
                                  </div>
                                </RadioGroup>
                              </TableCell>
                              <TableCell className='text-end'>
                                <Button
                                  type='button'
                                  size='icon'
                                  variant='ghost'
                                  className='text-destructive hover:text-destructive'
                                  onClick={() => removeApprover(index)}
                                >
                                  ×
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className='h-10 text-center text-xs text-muted-foreground'
                            >
                              Add approver lines like in Odoo.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <Button
                    type='button'
                    variant='link'
                    size='sm'
                    className='px-0 text-xs'
                    onClick={() =>
                      appendApprover({
                        title: '',
                        user_id: undefined,
                        approval_type: 'required',
                      })
                    }
                  >
                    Add a line
                  </Button>
                </div>
              </section>
            </form>
          </Form>

          <DialogFooter>
            <Button
              type='submit'
              form='approval-type-form'
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

function FeaturePill({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`flex items-center justify-between rounded-full border px-2 py-1 text-[11px] ${
        active
          ? 'border-emerald-500/60 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
          : 'border-border text-muted-foreground'
      }`}
    >
      <span>{label}</span>
      <span
        className={`ms-1 h-1.5 w-1.5 rounded-full ${
          active ? 'bg-emerald-500' : 'bg-muted-foreground/50'
        }`}
      />
    </div>
  )
}

type FieldOptionsRowProps = {
  label: string
  value: FieldOption
  onChange: (value: FieldOption) => void
}

function FieldOptionsRow({ label, value, onChange }: FieldOptionsRowProps) {
  return (
    <div className='space-y-1 rounded-md border px-3 py-2'>
      <div className='text-xs font-medium'>{label}</div>
      <RadioGroup
        className='mt-1 flex flex-wrap gap-3 text-xs'
        value={value}
        onValueChange={(val) => onChange(val as FieldOption)}
      >
        <div className='flex items-center gap-1.5'>
          <RadioGroupItem value='required' id={`${label}-required`} />
          <FormLabel
            htmlFor={`${label}-required`}
            className='cursor-pointer text-xs font-normal'
          >
            Required
          </FormLabel>
        </div>
        <div className='flex items-center gap-1.5'>
          <RadioGroupItem value='optional' id={`${label}-optional`} />
          <FormLabel
            htmlFor={`${label}-optional`}
            className='cursor-pointer text-xs font-normal'
          >
            Optional
          </FormLabel>
        </div>
        <div className='flex items-center gap-1.5'>
          <RadioGroupItem value='none' id={`${label}-none`} />
          <FormLabel
            htmlFor={`${label}-none`}
            className='cursor-pointer text-xs font-normal'
          >
            None
          </FormLabel>
        </div>
      </RadioGroup>
    </div>
  )
}

