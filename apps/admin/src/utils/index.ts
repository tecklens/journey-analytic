import {compact} from "lodash";

export const getUserName = (firstName: string | undefined, lastName: string | undefined) => {
  return compact([firstName, lastName]).join(' ')
}