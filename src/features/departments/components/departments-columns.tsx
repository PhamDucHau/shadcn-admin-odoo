import { type ColumnDef } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { DataTableColumnHeader } from '@/components/data-table'
import type { Department } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const departmentsColumns: ColumnDef<Department>[] = [
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
        to='/departments/$departmentId'
        params={{ departmentId: String(row.original.id) }}
        className='font-medium text-primary hover:underline'
      >
        {row.getValue('name')}
      </Link>
    ),
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
