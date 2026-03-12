import { useEffect, useState } from 'react'
import { Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCommonShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ShortcutItem {
  keys: string[]
  description: string
  category: string
}

export function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false)
  useCommonShortcuts()

  useEffect(() => {
    const handleShowShortcuts = () => setOpen(true)
    document.addEventListener('show-shortcuts', handleShowShortcuts)
    return () =>
      document.removeEventListener('show-shortcuts', handleShowShortcuts)
  }, [])

  const shortcutsList: ShortcutItem[] = [
    {
      keys: ['⌘', 'K'],
      description: 'Open command palette',
      category: 'Navigation',
    },
    {
      keys: ['⌘', '/'],
      description: 'Show keyboard shortcuts',
      category: 'Navigation',
    },
    {
      keys: ['⌘', 'T'],
      description: 'Toggle theme',
      category: 'Appearance',
    },
    {
      keys: ['↑', '↓'],
      description: 'Navigate in tables and lists',
      category: 'Navigation',
    },
    {
      keys: ['→', '←'],
      description: 'Navigate between columns',
      category: 'Navigation',
    },
    {
      keys: ['Enter'],
      description: 'Select item or open link',
      category: 'Navigation',
    },
    {
      keys: ['Escape'],
      description: 'Close modal or cancel action',
      category: 'General',
    },
    {
      keys: ['Tab'],
      description: 'Move to next focusable element',
      category: 'Navigation',
    },
    {
      keys: ['Shift', 'Tab'],
      description: 'Move to previous focusable element',
      category: 'Navigation',
    },
    {
      keys: ['Space'],
      description: 'Toggle checkbox or select row',
      category: 'General',
    },
    {
      keys: ['⌘', 'A'],
      description: 'Select all items',
      category: 'Selection',
    },
  ]

  const groupedShortcuts = shortcutsList.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = []
      }
      acc[shortcut.category].push(shortcut)
      return acc
    },
    {} as Record<string, ShortcutItem[]>
  )

  const formatKey = (key: string) => {
    const keyMap: Record<string, string> = {
      '⌘': '⌘',
      Ctrl: 'Ctrl',
      Alt: 'Alt',
      Shift: 'Shift',
      '↑': '↑',
      '↓': '↓',
      '→': '→',
      '←': '←',
      Enter: 'Enter',
      Escape: 'Esc',
      Tab: 'Tab',
      Space: 'Space',
      A: 'A',
      K: 'K',
      T: 'T',
      '/': '/',
    }
    return keyMap[key] || key
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Keyboard className='h-5 w-5' />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Quickly navigate and perform actions using keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
            <div key={category}>
              <h3 className='mb-3 text-sm font-semibold text-muted-foreground'>
                {category}
              </h3>
              <div className='space-y-2'>
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-muted/50'
                  >
                    <span className='text-sm'>{shortcut.description}</span>
                    <div className='flex items-center gap-1'>
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className='flex items-center gap-1'>
                          <kbd className='rounded-md border bg-muted px-2 py-1 font-mono text-xs'>
                            {formatKey(key)}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className='mx-1 text-xs text-muted-foreground'>
                              +
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-end pt-4'>
          <Button onClick={() => setOpen(false)}>Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper component to add keyboard shortcut info to other components
export function KeyboardShortcut({
  keys,
  className,
}: {
  keys: string[]
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {keys.map((key, index) => (
        <div key={index} className='flex items-center gap-1'>
          <kbd className='rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]'>
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className='mx-0.5 text-[10px] text-muted-foreground'>+</span>
          )}
        </div>
      ))}
    </div>
  )
}
