import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useContacts } from './contacts-provider'

export function ContactsPrimaryButtons() {
  const { setOpen } = useContacts()

  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Add Contact</span>
      <UserPlus size={18} />
    </Button>
  )
}
