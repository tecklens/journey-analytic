import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Button } from '@admin/components/ui/button'
import { useSessions } from '../context/sessions-context.tsx'

export function TasksPrimaryButtons() {
  const { setOpen } = useSessions()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <IconDownload size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
