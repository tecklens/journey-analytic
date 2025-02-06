import { Header } from '@admin/components/layout/header'
import { Main } from '@admin/components/layout/main'
import { ProfileDropdown } from '@admin/components/profile-dropdown'
import { Search } from '@admin/components/search'
import { ThemeSwitch } from '@admin/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'
import { SessionReplayPrimaryButtons } from './components/session-replay-primary-buttons.tsx'
import TasksProvider from './context/tasks-context'
import { tasks } from './data/tasks'

export default function Tasks() {
  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Sessions Replay</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <SessionReplayPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={tasks} columns={columns} />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
