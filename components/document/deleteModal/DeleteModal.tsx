import { Button, Modal } from "react-bootstrap"
import styles from './deleteModal.module.scss'
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentFolder, selectSelectedFiles, selectSelectedTableItems } from "@/store/document/documentSelectors"
import { AppDispatch } from "@/store"
import { deleteDocumentWithThunk } from "@/fsd/features/global/documents/deleteDocumentById"
import { deleteItemFromCurrentLevel, setFiles, setTableItems } from "@/store/document/documentSlice"
import { DocumentEnum } from "@/fsd/app/types/Document"
import { Image } from "@/types/common"
import { patchDocumentByIdWithThunk } from "@/fsd/features/global/documents/patchDocumentById"

type DeleteModalProps = {
    show: boolean
    onHide: () => void
}

export const DeleteModal = ({ show, onHide }: DeleteModalProps) => {
    const selectedItems = useSelector(selectSelectedTableItems)
    const selectedFiles = useSelector(selectSelectedFiles)
    const currentFolder = useSelector(selectCurrentFolder)
    const dispatch = useDispatch<AppDispatch>();

    const onDelete = () => {
        selectedItems.forEach(item => {
            dispatch(deleteDocumentWithThunk({ id: item }))
            dispatch(deleteItemFromCurrentLevel(item))
            dispatch(setTableItems(item))
        })

        if (!currentFolder) return

        const currentFiles = currentFolder?.[DocumentEnum.Files] as Image[]
        const notSelectedFiles =
            currentFiles.filter(file => selectedFiles.every(selectFileId => selectFileId !== file.id))

        if (notSelectedFiles) {

            const { children, parent, ...rest } = currentFolder
            rest[DocumentEnum.Files] = [...(notSelectedFiles as Image[]).map(img => img.id)]

            dispatch(patchDocumentByIdWithThunk(rest)).then(() => {
                selectedFiles.forEach(selectFile => {
                    dispatch(setFiles(selectFile))
                })
            })

        }
        onHide()



    }
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className={styles.header}>
                <Modal.Title>Вы уверены что хотите удалить выбранное?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* {uploaderRender(setFiles, files, false)} */}
            </Modal.Body>
            <Modal.Footer className={styles.footer}>
                <Button variant="secondary" onClick={onHide}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={onDelete}>
                    Удалить
                </Button>
            </Modal.Footer>
        </Modal>
    )
}