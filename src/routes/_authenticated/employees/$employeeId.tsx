import { createFileRoute } from '@tanstack/react-router'
import { EmployeeDetail } from '@/features/employees/employee-detail'

export const Route = createFileRoute('/_authenticated/employees/$employeeId')({
  component: EmployeeDetail,
})
