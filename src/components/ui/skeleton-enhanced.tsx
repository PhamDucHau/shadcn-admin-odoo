import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Table skeleton
export function TableSkeleton({ rows = 10, columns = 5 }) {
  return (
    <div className='w-full'>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className='h-4 w-full' />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className='h-4 w-full' />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Card skeleton
export function CardSkeleton() {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <Skeleton className='h-5 w-2/3' />
        <Skeleton className='h-4 w-1/2' />
      </CardHeader>
      <CardContent>
        <Skeleton className='mb-4 h-8 w-1/4' />
        <Skeleton className='mb-2 h-4 w-full' />
        <Skeleton className='mb-2 h-4 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
      </CardContent>
    </Card>
  )
}

// Dashboard card skeleton
export function DashboardCardSkeleton() {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-8 w-8 rounded-lg' />
          <Skeleton className='h-4 w-20' />
        </div>
        <div className='mt-4'>
          <Skeleton className='mb-2 h-8 w-24' />
          <Skeleton className='h-4 w-32' />
        </div>
        <div className='mt-4'>
          <Skeleton className='h-2 w-full' />
        </div>
      </CardContent>
    </Card>
  )
}

// Form skeleton
export function FormSkeleton({ fields = 4 }) {
  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className='space-y-2'>
            <Skeleton className='h-4 w-1/4' />
            <Skeleton className='h-10 w-full' />
          </div>
        ))}
      </div>
      <div className='flex gap-4 pt-4'>
        <Skeleton className='h-10 w-24' />
        <Skeleton className='h-10 w-16' />
      </div>
    </div>
  )
}

// List skeleton
export function ListSkeleton({ items = 5 }) {
  return (
    <div className='space-y-4'>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className='flex items-center space-x-4'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-1/3' />
            <Skeleton className='h-3 w-1/2' />
          </div>
          <Skeleton className='h-8 w-20' />
        </div>
      ))}
    </div>
  )
}

// Chart skeleton
export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-1/3' />
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='flex items-center space-x-2'>
              <Skeleton className='h-4 w-16' />
              <div className='flex flex-1 items-center space-x-2'>
                <Skeleton
                  className='h-4 flex-1'
                  style={{ width: `${Math.random() * 60 + 20}%` }}
                />
                <Skeleton className='h-4 w-12' />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
