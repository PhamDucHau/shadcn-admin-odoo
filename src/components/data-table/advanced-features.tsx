import { useState, useCallback } from 'react'
import { format } from 'date-fns'
import { Filter, X, Pin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterOption {
  value: string
  label: string
}

interface ColumnFilter {
  id: string
  title: string
  type: 'text' | 'select' | 'date' | 'number'
  value?: any
  options?: FilterOption[]
}

interface AdvancedFiltersProps {
  filters: ColumnFilter[]
  onFiltersChange: (filters: ColumnFilter[]) => void
  onClear: () => void
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClear,
}: AdvancedFiltersProps) {
  const activeFilters = filters.filter(
    (filter) => filter.value !== undefined && filter.value !== ''
  )

  const handleRemoveFilter = useCallback(
    (columnId: string) => {
      onFiltersChange(filters.filter((filter) => filter.id !== columnId))
    },
    [filters, onFiltersChange]
  )

  const formatFilterValue = (value: any, type: string): string => {
    if (value === undefined || value === '') return ''

    switch (type) {
      case 'date':
        return format(new Date(value), 'PPP')
      case 'number':
        if (value.min && value.max) {
          return `${value.min} - ${value.max}`
        }
        return value.toString()
      case 'select':
        return value
      default:
        return value.toString()
    }
  }

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className='flex items-center gap-2 border-b p-2'>
      <div className='flex flex-1 items-center gap-2'>
        <Filter className='h-4 w-4 text-muted-foreground' />
        <span className='text-sm text-muted-foreground'>Filters:</span>
        <div className='flex items-center gap-1'>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant='secondary'
              className='flex items-center gap-1 pr-1'
            >
              {filter.title}: {formatFilterValue(filter.value, filter.type)}
              <Button
                variant='ghost'
                size='sm'
                className='hover:text-destructive-foreground h-4 w-4 p-0 hover:bg-destructive'
                onClick={() => handleRemoveFilter(filter.id)}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
      <Button variant='ghost' size='sm' onClick={onClear}>
        Clear All
      </Button>
    </div>
  )
}

interface ColumnPinProps {
  columns: Array<{
    id: string
    header: string
    isPinned?: boolean
  }>
  onPinChange: (columnId: string, isPinned: boolean) => void
}

export function ColumnPinning({ columns, onPinChange }: ColumnPinProps) {
  const [pinnedColumns, setPinnedColumns] = useState<string[]>(() =>
    columns.filter((col) => col.isPinned).map((col) => col.id)
  )

  const handlePinChange = useCallback(
    (columnId: string, isPinned: boolean) => {
      setPinnedColumns((prev) => {
        if (isPinned) {
          return [...prev, columnId]
        } else {
          return prev.filter((id) => id !== columnId)
        }
      })
      onPinChange(columnId, isPinned)
    },
    [onPinChange]
  )

  const unpinnedColumns = columns.filter(
    (col) => !pinnedColumns.includes(col.id)
  )
  const currentlyPinned = columns.filter((col) =>
    pinnedColumns.includes(col.id)
  )

  return (
    <div className='flex items-center gap-2 border-b p-2'>
      <span className='text-sm text-muted-foreground'>Pinned Columns:</span>
      <div className='flex items-center gap-1'>
        {currentlyPinned.map((column) => (
          <Badge key={column.id} variant='secondary' className='pr-1'>
            {column.header}
            <Button
              variant='ghost'
              size='sm'
              className='hover:text-destructive-foreground ml-1 h-4 w-4 p-0 hover:bg-destructive'
              onClick={() => handlePinChange(column.id, false)}
            >
              <X className='h-3 w-3' />
            </Button>
          </Badge>
        ))}
      </div>
      {unpinnedColumns.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' size='sm'>
              Pin Column
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-48 p-2'>
            <div className='space-y-1'>
              {unpinnedColumns.map((column) => (
                <Button
                  key={column.id}
                  variant='ghost'
                  size='sm'
                  className='w-full justify-start'
                  onClick={() => handlePinChange(column.id, true)}
                >
                  <Pin className='mr-2 h-3 w-3' />
                  {column.header}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

interface InlineEditProps {
  value: any
  onSave: (value: any) => void
  onCancel: () => void
  type?: 'text' | 'number' | 'select'
  options?: Array<{ value: string; label: string }>
}

export function InlineEdit({
  value,
  onSave,
  onCancel,
  type = 'text',
  options,
}: InlineEditProps) {
  const [editValue, setEditValue] = useState(value)
  const [isEditing, setIsEditing] = useState(true)

  const handleSave = useCallback(() => {
    onSave(editValue)
    setIsEditing(false)
  }, [editValue, onSave])

  const handleCancel = useCallback(() => {
    setEditValue(value)
    setIsEditing(false)
    onCancel()
  }, [value, onCancel])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
    },
    [handleSave, handleCancel]
  )

  if (!isEditing) {
    return (
      <div
        className='cursor-pointer rounded p-1 hover:bg-muted/50'
        onClick={() => setIsEditing(true)}
      >
        {type === 'select' && options
          ? options.find((opt) => opt.value === value)?.label || value
          : value}
      </div>
    )
  }

  if (type === 'select' && options) {
    return (
      <Select value={editValue} onValueChange={setEditValue}>
        <SelectTrigger className='w-32'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Input
      type={type === 'number' ? 'number' : 'text'}
      value={editValue}
      onChange={(e) =>
        setEditValue(
          type === 'number' ? e.target.valueAsNumber : e.target.value
        )
      }
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className='w-32'
      autoFocus
    />
  )
}

// Export these types for other components
export type { ColumnFilter, FilterOption }
