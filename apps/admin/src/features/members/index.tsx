import {Header} from '@admin/components/layout/header'
import {Main} from '@admin/components/layout/main'
import {ProfileDropdown} from '@admin/components/profile-dropdown'
import {Search} from '@admin/components/search'
import {ThemeSwitch} from '@admin/components/theme-switch'
import {columns} from './components/columns'
import {DataTable} from './components/data-table'
import {TasksDialogs} from './components/tasks-dialogs'
import {SessionReplayPrimaryButtons} from './components/session-replay-primary-buttons.tsx'
import TasksProvider from './context/tasks-context'
import {useMembersProjectQuery} from "@admin/api/project/members-project.query.ts";
import {useState} from "react";
import {debounce} from "lodash";
import {PaginationState} from "@tanstack/react-table";

export default function Members() {
  const [page, setPage] = useState({
    page: 0,
    limit: 10
  })
  const member = useMembersProjectQuery({
    ...page,
    email: ''
  })

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
            <h2 className='text-2xl font-bold tracking-tight'>Members</h2>
            <p className='text-muted-foreground'>
              List of members belonging to your project.
            </p>
          </div>
          <SessionReplayPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable
            data={member.data?.data ?? []}
            columns={columns}
            totalCount={member.data?.total ?? 0}
            page={{
              pageIndex: page.page,
              pageSize: page.limit,
            }}
            onPageChange={debounce((p: PaginationState) => {
              setPage({
                page: p.pageSize,
                limit: p.pageIndex,
              })
            }, 100)}
          />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
