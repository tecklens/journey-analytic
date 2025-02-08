import {IconDownload, IconSettings} from '@tabler/icons-react'
import {Button} from '@admin/components/ui/button'
import {useSessions} from '../context/sessions-context.tsx'
import {Link} from "@tanstack/react-router";

export function SessionReplayPrimaryButtons() {
  const {setOpen} = useSessions()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
        size={'sm'}
      >
        <span>Import</span> <IconDownload size={18}/>
      </Button>
      <Link to={'/settings/replay'}>
        <Button className='space-x-1' size={'sm'}>
          <span>Setting</span> <IconSettings size={18}/>
        </Button>
      </Link>
    </div>
  )
}
