import { Button, Form, Modal } from "react-bootstrap"
import styles from './deleteModal.module.scss'
import { selectRoot } from "@/store/document/documentSelectors"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { DocumentEnum } from "@/fsd/app/types/Document"
import { AppDispatch } from "@/store"
import { deleteDocumentWithThunk } from "@/fsd/features/global/documents/deleteDocumentById"
import { deleteItemFromCurrentLevel, deleteRootItems } from "@/store/document/documentSlice"


type DeleteRootModalProps = {
    show: boolean
    onHide: () => void
}

export const DeleteRootModal = ({ show, onHide }: DeleteRootModalProps) => {
    const rootItems = useSelector(selectRoot)
    const dispatch = useDispatch<AppDispatch>();
    const [selectedOption, setOption] = useState('')

    const onDelete = () => {
        dispatch(deleteDocumentWithThunk({ id: Number(selectedOption) }))
        dispatch(deleteRootItems(Number(selectedOption)))
        onHide()
     }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className={styles.header}>
                <Modal.Title className={styles.title}>Удаление</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId={'deleteFolder'} >
                    <Form.Label>Что нужно удалить?</Form.Label>
                    <Form.Select name="deleteFolder" value={selectedOption} onChange={(e) => setOption(e.target.value)}>
                        <option value="">Выберите папку</option>
                        {rootItems.map((option, id) => (
                            <option key={`${option[DocumentEnum.Id]}`} value={option[DocumentEnum.Id]}>
                                {option[DocumentEnum.Title]}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
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