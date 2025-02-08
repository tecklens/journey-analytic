import {IconMenu} from '@tabler/icons-react'
import {cn} from '@admin/lib/utils'
import {Button} from '@admin/components/ui/button'
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,} from '@admin/components/ui/dropdown-menu'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@admin/components/ui/select.tsx";
import {useAuth} from "@admin/hooks/use-auth.ts";
import {useWebsiteQuery} from "@admin/api/project/website-query.ts";

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
}

export function TopNav({className, ...props}: TopNavProps) {
  const auth = useAuth()
  const website = useWebsiteQuery({projectId: auth.user?.currentProjectId});
  return (
    <>
      <div className='md:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='outline'>
              <IconMenu/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start'>
            {website.data?.websites?.map(w => (
                <SelectItem key={w.id} value={w.id}>{w.domain}</SelectItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          'hidden items-center space-x-4 md:flex',
          className
        )}
        {...props}
      >
        <Select>
          <SelectTrigger className='w-64 w-full'>
            <SelectValue placeholder='Select website'/>
          </SelectTrigger>
          <SelectContent>
            {website.data?.websites?.map(w => (
                <SelectItem key={w.id} value={w.id}>
                  <div>
                    <div>{w.title}</div>
                    <div>{w.domain}</div>
                  </div>
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </nav>
    </>
  )
}
