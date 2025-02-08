import {IconPlus} from '@tabler/icons-react'
import {Button} from '@admin/components/ui/button'
import {useTasks} from '../context/tasks-context'

export function SessionReplayPrimaryButtons() {
  const {setOpen} = useTasks()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' size={'sm'} onClick={() => setOpen('create')}>
        <span>Add</span> <IconPlus size={18}/>
      </Button>
    </div>
  )
}
