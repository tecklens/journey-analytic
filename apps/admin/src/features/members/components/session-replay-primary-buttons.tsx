import {IconDownload, IconPlus} from '@tabler/icons-react'
import {Button} from '@admin/components/ui/button'
import {useTasks} from '../context/tasks-context'

export function SessionReplayPrimaryButtons() {
  const {setOpen} = useTasks()
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
      <Button className='space-x-1' size={'sm'} onClick={() => setOpen('create')}>
        <span>Add</span> <IconPlus size={18}/>
      </Button>
    </div>
  )
}
