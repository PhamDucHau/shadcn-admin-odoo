'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { SelectDropdown } from '@/components/select-dropdown'
import { employeesApi } from '../api/employees'
import { departmentsApi } from '@/features/departments/api/departments'
import type { Employee } from '../data/schema'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  work_email: z.string().optional(),
  work_phone: z.string().optional(),
  department_id: z.undefined().or(z.number()),
  job_id: z.undefined().or(z.number()),
})

type EmployeeForm = z.infer<typeof formSchema>

type EmployeesActionDialogProps = {
  currentRow?: Employee
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: EmployeesActionDialogProps) {
  const isEdit = !!currentRow
  const queryClient = useQueryClient()

  const { data: departmentsData } = useQuery({
    queryKey: ['departments', 'all'],
    queryFn: async () => {
      const res = await departmentsApi.getAll({ limit: 1000, offset: 0 })
      return res.data
    },
    enabled: open,
  })

  const departmentOptions =
    departmentsData?.data?.map((dept) => ({
      label: dept.name,
      value: String(dept.id),
    })) ?? []

  const form = useForm<EmployeeForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      work_email: '',
      work_phone: '',
      department_id: undefined,
      job_id: undefined,
    },
  })

  useEffect(() => {
    if (currentRow) {
      const deptId =
        typeof currentRow.department_id === 'number'
          ? currentRow.department_id
          : Array.isArray(currentRow.department_id)
            ? currentRow.department_id[0]
            : undefined
      form.reset({
        name: currentRow.name,
        work_email: currentRow.work_email ?? '',
        work_phone: currentRow.work_phone ?? '',
        department_id: deptId,
      })
    } else {
      form.reset({
        name: '',
        work_email: '',
        work_phone: '',
        department_id: undefined,
        job_id: undefined,
      })
    }
  }, [currentRow, open, form])

  const createMutation = useMutation({
    mutationFn: (data: EmployeeForm) => employeesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Employee created successfully')
      onOpenChange(false)
      form.reset()
    },
    onError: (error: { response?: { data?: { detail?: string } } }) => {
      toast.error(error.response?.data?.detail ?? 'Failed to create employee')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeForm }) =>
      employeesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Employee updated successfully')
      onOpenChange(false)
      form.reset()
    },
    onError: (error: { response?: { data?: { detail?: string } } }) => {
      toast.error(error.response?.data?.detail ?? 'Failed to update employee')
    },
  })

  const onSubmit = (values: EmployeeForm) => {
    const payload = {
      ...values,
      work_email: values.work_email || undefined,
      work_phone: values.work_phone || undefined,
    }
    if (isEdit && currentRow) {
      updateMutation.mutate({ id: currentRow.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the employee information.'
              : 'Add a new employee to the system.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='employee-form'
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
                    <Input placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='work_email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='john@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='work_phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder='0123456789' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='department_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <SelectDropdown
                    defaultValue={
                      field.value != null ? String(field.value) : undefined
                    }
                    onValueChange={(v) =>
                      field.onChange(v ? Number(v) : undefined)
                    }
                    placeholder='Select department (Odoo many2one)'
                    items={departmentOptions}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='job_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job ID (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='1'
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
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='employee-form'
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
