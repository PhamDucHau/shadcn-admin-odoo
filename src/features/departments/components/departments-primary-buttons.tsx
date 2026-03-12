import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDepartments } from './departments-provider'

export function DepartmentsPrimaryButtons() {
  const { setOpen } = useDepartments()

  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add Department</span>
      <Building2 size={18} />
    </Button>
  )
}
