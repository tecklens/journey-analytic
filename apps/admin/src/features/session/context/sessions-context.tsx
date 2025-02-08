import React, {useState} from 'react'
import useDialogState from '@admin/hooks/use-dialog-state'
import {Task} from '../data/schema'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

interface TasksContextType {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>
}

const SessionsContext = React.createContext<TasksContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function SessionsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  return (
    <SessionsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SessionsContext.Provider>
  )
}

export const useSessions = () => {
  const sessionsContext = React.useContext(SessionsContext)

  if (!sessionsContext) {
    throw new Error('useTasks has to be used within <SessionsContext>')
  }

  return sessionsContext
}
