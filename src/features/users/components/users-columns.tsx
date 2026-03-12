import { type ColumnDef } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { DataTableColumnHeader } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const usersColumns: ColumnDef<User>[] = [
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
        to='/users/$userId'
        params={{ userId: String(row.original.id) }}
        className='font-medium text-primary hover:underline'
      >
        {row.getValue('name')}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'login',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Login' />
    ),
    cell: ({ row }) => (
      <div className='max-w-36 truncate'>{row.getValue('login')}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='max-w-48 truncate'>{row.getValue('email') ?? '—'}</div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => <div>{row.getValue('phone') ?? '—'}</div>,
  },
  {
    accessorKey: 'active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const active = row.getValue('active')
      const isActive = active !== false && active !== null && active !== undefined
      return (
        <Badge
          variant='outline'
          className={cn(
            isActive
              ? 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'
              : 'bg-neutral-300/40 border-neutral-300'
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
