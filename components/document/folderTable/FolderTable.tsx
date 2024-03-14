import { FormCheck, Spinner, Table } from "react-bootstrap"
import { FolderTableItem } from "./folderTableItem/FolderTableItem"
import styles from './folderTable.module.scss'
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/store"
import { selectCurrentFiles, selectCurrentFolder, selectCurrentLevel, selectLoadingNextFolder } from "@/store/document/documentSelectors"
import { ChangeEvent, useEffect, useState } from "react"
import { Document, DocumentEnum } from "@/fsd/app/types/Document";
import { FileTableItem } from "./fileTableItem/FileTableItem"
import { Image } from "@/types/common"
import { resetAllItems, setAllItems } from "@/store/document/documentSlice"


export const FolderTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const currentFolder = useSelector(selectCurrentFolder)
  const currentLevel = useSelector(selectCurrentLevel)
  const currentFilesStore = useSelector(selectCurrentFiles)
  const isLoading = useSelector(selectLoadingNextFolder)
  const [currentTableCell, setCurrentTableCell] = useState<null | Document[]>(null)
  const [allItems, setCurrentAllItems] = useState(false)
  const [currentFiles, setCurrentFiles] = useState<number[] | Image[] | undefined>([])

  useEffect(() => {
    if (currentLevel) {
      setCurrentTableCell(currentLevel)
    }

    return () => {
      setCurrentTableCell(null)
    }
  }, [currentLevel])

  useEffect(() => {
    if (currentFilesStore) {
    }
    setCurrentFiles(currentFilesStore)

  }, [currentFilesStore.length])

  const handleAllItems = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentAllItems(e.target.checked)

    if (e.target.checked) {
      dispatch(setAllItems())
    } else {
      dispatch(resetAllItems())
    }
  }

  if (isLoading) {
    return <Spinner style={{ margin: 50, marginTop: 20 }} />
  }


  return (
    <>
      {
        <Table hover className={`${styles.table}`}>
          {currentTableCell && currentTableCell.length > 0 || currentFiles && currentFiles.length > 0
            ? (
              <thead>
                <tr>
                  <th className="col"><FormCheck.Input checked={allItems} onChange={handleAllItems} /></th>
                  <th className="col-4 text-nowrap">Имя</th>
                  <th className="col-2 text-nowrap">Размер</th>
                  <th className="col-3 text-nowrap">Создано</th>
                  <th className="col-3 text-nowrap">ОТРЕДАКТИРОВАНО</th>
                </tr>
              </thead>

            )
            : (
              <p>Папка пуста</p>
            )}
          <tbody>
            <>
              {currentTableCell && currentTableCell.map(item => {
                return (
                  <FolderTableItem
                    tableChild={item}
                    key={item[DocumentEnum.Id]}
                  />
                )
              })}

              {currentFiles && currentFiles.map(file => {
                if (typeof file === 'number') {
                  // Handle the case where it's a number (assuming it's an ID or similar)
                  return null; // or some other handling for numbers
                } else {
                  // Assuming file is of type Image
                  return (
                    <FileTableItem
                      file={file}
                      key={file.id}
                    />
                  );
                }
              })}
            </>
          </tbody>
        </Table>

      }
    </>
  )
}