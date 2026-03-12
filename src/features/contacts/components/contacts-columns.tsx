import { type ColumnDef } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { DataTableColumnHeader } from '@/components/data-table'
import type { Contact } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const contactsColumns: ColumnDef<Contact>[] = [
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
        to='/contacts/$contactId'
        params={{ contactId: String(row.original.id) }}
        className='font-medium text-primary hover:underline'
      >
        {row.getValue('name')}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='max-w-48 truncate'>
        {row.getValue('email') ?? '—'}
      </div>
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
    accessorKey: 'city',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='City' />
    ),
    cell: ({ row }) => (
      <div>{row.getValue('city') ?? '—'}</div>
    ),
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
