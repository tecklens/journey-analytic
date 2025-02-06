import React, { useState } from 'react'
import useDialogState from '@admin/hooks/use-dialog-state'
import {IMember} from "@journey-analytic/shared";

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

interface TasksContextType {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: IMember | null
  setCurrentRow: React.Dispatch<React.SetStateAction<IMember | null>>
}

const TasksContext = React.createContext<TasksContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function TasksProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<IMember | null>(null)
  return (
    <TasksContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TasksContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
