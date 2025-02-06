import {ColumnDef} from '@tanstack/react-table'
import {DataTableColumnHeader} from './data-table-column-header'
import {IMember, IUser} from '@journey-analytic/shared'
import {getUserName} from "@admin/utils";

export const columns: ColumnDef<IMember & {user: IUser}>[] = [
  {
    accessorKey: 'user.firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const user: any = row.original.user
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {getUserName(user?.firstName, user?.lastName)}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'user.email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => {
      const user: any = row.original.user
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {user?.email}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'roles',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Roles' />
    ),
    cell: ({row}) => <div className='w-[80px]'>
        <span>{row.getValue('roles')}</span>
    </div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center'>
          <span>{row.getValue('status')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]
