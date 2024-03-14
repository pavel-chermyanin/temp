import { Document, DocumentEnum } from "@/fsd/app/types/Document"
import { fetchDocumentByIdWithThunk } from "@/fsd/features/global/documents/fetchDocumentById"
import { formatDateTime, formatDateTimeMax } from "@/fsd/shared/lib/format/formatStringDate"
import { AppDispatch } from "@/store"
import { pushNavStack, setTableItems } from "@/store/document/documentSlice"
import { FormCheck } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import styles from './tableItem.module.scss'
import { selectSelectedTableItems } from "@/store/document/documentSelectors"
import { FolderIcon } from "./FolderIcon"

type FolderTableItemProps = {
  tableChild: Document
}
export const FolderTableItem = ({ tableChild }: FolderTableItemProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedItems = useSelector(selectSelectedTableItems)


  const onTableItemClick = () => {
    dispatch(fetchDocumentByIdWithThunk({ id: tableChild[DocumentEnum.Id]! }))
    dispatch(pushNavStack(tableChild))
  }
  return (
    <tr>
      <td>
        <FormCheck.Input
          checked={selectedItems.includes(tableChild[DocumentEnum.Id]!)}
          onChange={() => dispatch(setTableItems(tableChild[DocumentEnum.Id]!))} />
      </td>
      <td className={styles.title} onClick={onTableItemClick}>
        <FolderIcon />
        <span className={styles.text} >
          {tableChild[DocumentEnum.Title]}
        </span>
      </td>
      <td>489 КБ</td>
      <td>{formatDateTimeMax(tableChild[DocumentEnum.CreationDatetime]!)}</td>
      <td>18.01.2024, 21:20</td>
    </tr>
  )
}