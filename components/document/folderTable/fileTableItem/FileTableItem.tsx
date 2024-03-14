import { Document, DocumentEnum } from "@/fsd/app/types/Document"
// import { Image, ImageEnum } from "@/fsd/app/types/Image"
import { fetchDocumentByIdWithThunk } from "@/fsd/features/global/documents/fetchDocumentById"
import { extractFileNameFromUrl } from "@/fsd/shared/lib/files/extractFileNameFromUrl"
import { formatDateTime, formatDateTimeMax } from "@/fsd/shared/lib/format/formatStringDate"
import { AppDispatch } from "@/store"
import { selectSelectedFiles } from "@/store/document/documentSelectors"
import { pushNavStack, setFiles } from "@/store/document/documentSlice"
import { Image } from "@/types/common"
import { FormCheck } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
// import styles from './tableItem.module.scss'

type FolderTableItemProps = {
  file: Image
}
export const FileTableItem = ({ file }: FolderTableItemProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedFiles = useSelector(selectSelectedFiles)

  const onTableItemClick = () => {
    // dispatch(fetchDocumentByIdWithThunk({ id: tableChild[DocumentEnum.Id]! }))
    // dispatch(pushNavStack(tableChild))
  }


  return (
    <tr>
      <td>
        <FormCheck.Input
          checked={selectedFiles.includes(file.id)}
          onChange={() => dispatch(setFiles(file.id))} />
      </td>
      <td className={''} onClick={onTableItemClick}>{extractFileNameFromUrl(file.file)}</td>
      <td>489 КБ</td>
      <td>
        {/* {formatDateTimeMax(tableChild[DocumentEnum.CreationDatetime]!)} */}
      </td>
      <td>18.01.2024, 21:20</td>
    </tr>
  )


}