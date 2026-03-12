import { createFileRoute } from '@tanstack/react-router'
import { DepartmentDetail } from '@/features/departments/department-detail'

export const Route = createFileRoute(
  '/_authenticated/departments/$departmentId'
)({
  component: DepartmentDetail,
})
