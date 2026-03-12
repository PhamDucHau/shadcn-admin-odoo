import {
  FileX,
  Inbox,
  SearchX,
  UserPlus,
  Users,
  Building2,
  Phone,
  ListTodo,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'

type EmptyStateProps = {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    variant?:
      | 'default'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link'
      | 'destructive'
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        'flex flex-col items-center justify-center py-12',
        className
      )}
    >
      <CardContent className='flex flex-col items-center justify-center text-center'>
        {icon && (
          <div className='mb-4 flex size-16 items-center justify-center rounded-full bg-muted'>
            {icon}
          </div>
        )}
        <CardTitle className='mb-2 text-xl'>{title}</CardTitle>
        <CardDescription className='mb-6 max-w-sm'>
          {description}
        </CardDescription>
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Specific empty states for different entities

export function UsersEmptyState({ onAddUser }: { onAddUser: () => void }) {
  return (
    <EmptyState
      title='No users found'
      description='Get started by creating your first user account.'
      icon={<Users className='size-8' />}
      action={{
        label: 'Add User',
        onClick: onAddUser,
      }}
    />
  )
}

export function EmployeesEmptyState({
  onAddEmployee,
}: {
  onAddEmployee: () => void
}) {
  return (
    <EmptyState
      title='No employees found'
      description='Add your first employee to start managing your team.'
      icon={<UserPlus className='size-8' />}
      action={{
        label: 'Add Employee',
        onClick: onAddEmployee,
      }}
    />
  )
}

export function DepartmentsEmptyState({
  onAddDepartment,
}: {
  onAddDepartment: () => void
}) {
  return (
    <EmptyState
      title='No departments found'
      description='Create departments to organize your company structure.'
      icon={<Building2 className='size-8' />}
      action={{
        label: 'Add Department',
        onClick: onAddDepartment,
      }}
    />
  )
}

export function ContactsEmptyState({
  onAddContact,
}: {
  onAddContact: () => void
}) {
  return (
    <EmptyState
      title='No contacts found'
      description='Start building your network by adding your first contact.'
      icon={<Phone className='size-8' />}
      action={{
        label: 'Add Contact',
        onClick: onAddContact,
      }}
    />
  )
}

export function TasksEmptyState({ onAddTask }: { onAddTask: () => void }) {
  return (
    <EmptyState
      title='No tasks found'
      description='Create your first task to start tracking your work.'
      icon={<ListTodo className='size-8' />}
      action={{
        label: 'Add Task',
        onClick: onAddTask,
      }}
    />
  )
}

export function SearchEmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <EmptyState
      title='No results found'
      description={`We couldn't find anything matching "${searchQuery}". Try checking your spelling or using different keywords.`}
      icon={<SearchX className='size-8' />}
    />
  )
}

export function FilteredEmptyState({
  onClearFilters,
}: {
  onClearFilters: () => void
}) {
  return (
    <EmptyState
      title='No results found'
      description='There are no items that match your current filters.'
      icon={<FileX className='size-8' />}
      action={{
        label: 'Clear Filters',
        onClick: onClearFilters,
        variant: 'outline',
      }}
    />
  )
}

export function GenericEmptyState({
  message = 'No data available',
  action,
}: {
  message?: string
  action?: EmptyStateProps['action']
}) {
  return (
    <EmptyState
      title='No data'
      description={message}
      icon={<Inbox className='size-8' />}
      action={action}
    />
  )
}

// Inline empty states for smaller spaces
export function InlineEmpty({
  message,
  icon = <FileX className='size-4' />,
}: {
  message: string
  icon?: React.ReactNode
}) {
  return (
    <div className='flex flex-col items-center justify-center py-8 text-center text-muted-foreground'>
      {icon}
      <p className='mt-2 text-sm'>{message}</p>
    </div>
  )
}
