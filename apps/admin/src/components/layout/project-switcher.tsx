import {ChevronsUpDown, Plus} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@admin/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@admin/components/ui/sidebar'
import {useProjectQuery} from "@admin/api/project/project-query.ts";
import CreateProject from "@admin/components/layout/create-project.tsx";
import {useState} from "react";
import {useSwitchProjectMutation} from "@admin/api/project/switch-project.mutation.ts";

export function ProjectSwitcher() {
  const {isMobile} = useSidebar()
  const [creating, setCreating] = useState(false)
  const projects = useProjectQuery();
  const switchProject = useSwitchProjectMutation();

  const active = projects.data?.active

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={projects.isPending}>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              {/*<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>*/}
              {/*  <activeTeam.logo className='size-4' />*/}
              {/*</div>*/}
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {active?.name}
                </span>
                <span className='truncate text-xs'>{active?.website}</span>
              </div>
              <ChevronsUpDown className='ml-auto'/>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Projects
            </DropdownMenuLabel>
            {projects.data?.projects?.map((proj, index) => (
              <DropdownMenuItem
                key={proj.name}
                onClick={() => switchProject.mutateAsync({projectId: proj.id})}
                className='gap-2 p-2'
              >
                {/*<div className='flex size-6 items-center justify-center rounded-sm border'>*/}
                {/*  <team.logo className='size-4 shrink-0' />*/}
                {/*</div>*/}
                {proj.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator/>
            <DropdownMenuItem className='gap-2 p-2' onClick={() => setCreating(true)}>
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>Add project</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CreateProject open={creating} setOpen={setCreating} />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
