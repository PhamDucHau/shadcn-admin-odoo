import { type ColumnDef } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { DataTableColumnHeader } from '@/components/data-table'
import type { Employee } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const employeesColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-16'>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <Link
        to='/employees/$employeeId'
        params={{ employeeId: String(row.original.id) }}
        className='font-medium text-primary hover:underline'
      >
        {row.getValue('name')}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'work_email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='max-w-48 truncate'>
        {row.getValue('work_email') ?? '—'}
      </div>
    ),
  },
  {
    accessorKey: 'work_phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => (
      <div>{row.getValue('work_phone') ?? '—'}</div>
    ),
  },
  {
    accessorKey: 'department_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Department' />
    ),
    cell: ({ row }) => {
      const dept = row.getValue('department_id') as
        | [number, string]
        | number
        | null
        | undefined
      if (dept == null) return <div>—</div>
      const name = Array.isArray(dept) ? dept[1] : String(dept)
      const id = Array.isArray(dept) ? dept[0] : dept
      return (
        <Link
          to='/departments/$departmentId'
          params={{ departmentId: String(id) }}
          className='text-primary hover:underline'
        >
          {name}
        </Link>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
