import { Customer } from '@prisma/client'
import React from 'react'

interface Props{
  rowData:Customer
}

const CellActions:React.FC<Props> = ({rowData}) => {
  return (
    <div>
      
    </div>
  )
}

export default CellActions
