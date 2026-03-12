import { useEffect, useCallback } from 'react'

type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  description: string
  action: () => void
}

type KeyboardShortcuts = {
  [id: string]: KeyboardShortcut
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in input fields
      const activeElement = document.activeElement
      const isInputElement =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        (activeElement as HTMLElement)?.contentEditable === 'true'

      if (isInputElement) return

      for (const shortcut of Object.values(shortcuts)) {
        const keyMatches =
          event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatches = shortcut.ctrlKey ? event.ctrlKey : true
        const metaMatches = shortcut.metaKey ? event.metaKey : true
        const shiftMatches = shortcut.shiftKey ? event.shiftKey : true
        const altMatches = shortcut.altKey ? event.altKey : true

        if (
          keyMatches &&
          ctrlMatches &&
          metaMatches &&
          shiftMatches &&
          altMatches
        ) {
          event.preventDefault()
          event.stopPropagation()
          shortcut.action()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export function useCommonShortcuts() {
  const shortcuts = {
    // Global shortcuts
    commandPalette: {
      key: 'k',
      ctrlKey: true,
      metaKey: true,
      description: 'Open command palette',
      action: useCallback(() => {
        // This will be handled by the search provider
        const event = new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
          metaKey: true,
        })
        document.dispatchEvent(event)
      }, []),
    },
    shortcutsHelp: {
      key: '/',
      ctrlKey: true,
      metaKey: true,
      description: 'Show keyboard shortcuts',
      action: useCallback(() => {
        // This will be handled by the shortcuts modal
        const event = new CustomEvent('show-shortcuts')
        document.dispatchEvent(event)
      }, []),
    },
    themeToggle: {
      key: 't',
      ctrlKey: true,
      metaKey: true,
      description: 'Toggle theme',
      action: useCallback(() => {
        // Toggle between light/dark theme
        const currentTheme = document.documentElement.classList.contains('dark')
          ? 'dark'
          : 'light'
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
        document.documentElement.classList.toggle('dark')
        localStorage.setItem('theme', newTheme)
      }, []),
    },
  } satisfies KeyboardShortcuts

  useKeyboardShortcuts(shortcuts)
  return shortcuts
}
