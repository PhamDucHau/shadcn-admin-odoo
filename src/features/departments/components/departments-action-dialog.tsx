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
import { departmentsApi } from '../api/departments'
import { employeesApi } from '@/features/employees/api/employees'
import type { Department } from '../data/schema'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  manager_id: z.undefined().or(z.number()),
})

type DepartmentForm = z.infer<typeof formSchema>

type DepartmentsActionDialogProps = {
  currentRow?: Department
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepartmentsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: DepartmentsActionDialogProps) {
  const isEdit = !!currentRow
  const queryClient = useQueryClient()

  const form = useForm<DepartmentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      manager_id: undefined,
    },
  })

  const { data: employeesData } = useQuery({
    queryKey: ['employees', 'all'],
    queryFn: async () => {
      const res = await employeesApi.getAll({
        limit: 1000,
        offset: 0,
      })
      return res.data
    },
    enabled: open,
  })

  const managerOptions =
    employeesData?.data?.map((emp) => ({
      label: emp.name,
      value: String(emp.id),
    })) ?? []

  useEffect(() => {
    if (currentRow) {
      const detail = currentRow as { manager_id?: [number, string] | number }
      const managerId =
        typeof detail.manager_id === 'number'
          ? detail.manager_id
          : Array.isArray(detail.manager_id)
            ? detail.manager_id[0]
            : undefined
      form.reset({
        name: currentRow.name,
        manager_id: managerId,
      })
    } else {
      form.reset({
        name: '',
        manager_id: undefined,
      })
    }
  }, [currentRow, open, form])

  const createMutation = useMutation({
    mutationFn: (data: DepartmentForm) => departmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department created successfully')
      onOpenChange(false)
      form.reset()
    },
    onError: (error: { response?: { data?: { detail?: string } } }) => {
      toast.error(error.response?.data?.detail ?? 'Failed to create department')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepartmentForm }) =>
      departmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      toast.success('Department updated successfully')
      onOpenChange(false)
      form.reset()
    },
    onError: (error: { response?: { data?: { detail?: string } } }) => {
      toast.error(error.response?.data?.detail ?? 'Failed to update department')
    },
  })

  const onSubmit = (values: DepartmentForm) => {
    const payload = {
      ...values,
      manager_id: values.manager_id || undefined,
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
          <DialogTitle>
            {isEdit ? 'Edit Department' : 'Add Department'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the department information.'
              : 'Add a new department.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='department-form'
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
                    <Input placeholder='HR Department' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='manager_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager</FormLabel>
                  <SelectDropdown
                    defaultValue={
                      field.value != null ? String(field.value) : undefined
                    }
                    onValueChange={(v) =>
                      field.onChange(v ? Number(v) : undefined)
                    }
                    placeholder='Select manager (employee)'
                    items={managerOptions}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='department-form' disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
