import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ApprovalTypesList } from './components/approval-types-list'
import { ApprovalRequestsList } from './components/approval-requests-list'

export function Approvals() {
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Approvals</h2>
            <p className='text-muted-foreground'>
              Manage approval types and requests with an Odoo-inspired flow.
            </p>
          </div>
        </div>

        <Tabs defaultValue='types' className='space-y-4'>
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='types'>Approval Types</TabsTrigger>
              <TabsTrigger value='requests'>Approval Requests</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='types' className='space-y-4'>
            <ApprovalTypesList
              onSelectTypeForRequest={(type) => setSelectedTypeId(type.id)}
            />
          </TabsContent>

          <TabsContent value='requests' className='space-y-4'>
            <ApprovalRequestsList preselectedTypeId={selectedTypeId} />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

