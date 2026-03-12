import React, { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Laptop,
  Moon,
  Sun,
  UserPlus,
} from 'lucide-react'
import { fuzzySearch, createSearchableItems } from '@/lib/fuzzy-search'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { sidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from './ui/scroll-area'

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen, recentSearches, addToRecent } = useSearch()
  const [searchQuery, setSearchQuery] = useState('')

  const searchableItems = useMemo(
    () => createSearchableItems(sidebarData.navGroups),
    []
  )

  const filteredItems = useMemo(
    () => fuzzySearch(searchQuery, searchableItems),
    [searchQuery, searchableItems]
  )

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      setSearchQuery('')
      command()
    },
    [setOpen]
  )

  const handleSelect = (url: string | undefined, title: string) => {
    if (!url) return
    addToRecent(title)
    runCommand(() => navigate({ to: url as string }))
  }

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder='Type a command or search...'
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pe-1'>
          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <>
              <CommandGroup heading='Recent Searches'>
                {recentSearches.map((search, i) => (
                  <CommandItem
                    key={`recent-${i}`}
                    value={search}
                    onSelect={() => setSearchQuery(search)}
                  >
                    <Clock className='mr-2 h-4 w-4' />
                    {search}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Quick Actions */}
          {!searchQuery && (
            <>
              <CommandGroup heading='Quick Actions'>
                <CommandItem
                  onSelect={() => handleSelect('/users', 'Create New User')}
                >
                  <UserPlus className='mr-2 h-4 w-4' />
                  Create New User
                </CommandItem>
                <CommandItem
                  onSelect={() => handleSelect('/employees', 'Add Employee')}
                >
                  <UserPlus className='mr-2 h-4 w-4' />
                  Add Employee
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Search Results */}
          <CommandEmpty>No results found.</CommandEmpty>

          {searchQuery && filteredItems.length > 0 && (
            <CommandGroup heading='Navigation'>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.title} ${item.category}`}
                  onSelect={() => handleSelect(item.url!, item.title)}
                >
                  <div className='flex size-4 items-center justify-center'>
                    <ArrowRight className='size-2 text-muted-foreground/80' />
                  </div>
                  <div className='flex flex-col'>
                    <span>{item.title}</span>
                    <span className='text-xs text-muted-foreground'>
                      {item.category}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Original Navigation when no search */}
          {!searchQuery && (
            <>
              {sidebarData.navGroups.map((group) => (
                <CommandGroup key={group.title} heading={group.title}>
                  {group.items.map((navItem, i) => {
                    if (navItem.url)
                      return (
                        <CommandItem
                          key={`${navItem.url}-${i}`}
                          value={navItem.title}
                          onSelect={() =>
                            handleSelect(navItem.url, navItem.title)
                          }
                        >
                          <div className='flex size-4 items-center justify-center'>
                            <ArrowRight className='size-2 text-muted-foreground/80' />
                          </div>
                          {navItem.title}
                        </CommandItem>
                      )

                    return navItem.items?.map((subItem, i) => (
                      <CommandItem
                        key={`${navItem.title}-${subItem.url}-${i}`}
                        value={`${navItem.title}-${subItem.url}`}
                        onSelect={() =>
                          handleSelect(subItem.url, subItem.title)
                        }
                      >
                        <div className='flex size-4 items-center justify-center'>
                          <ArrowRight className='size-2 text-muted-foreground/80' />
                        </div>
                        {navItem.title} <ChevronRight /> {subItem.title}
                      </CommandItem>
                    ))
                  })}
                </CommandGroup>
              ))}
              <CommandSeparator />
            </>
          )}

          <CommandGroup heading='Theme'>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Sun /> <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <Moon className='scale-90' />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Laptop />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
