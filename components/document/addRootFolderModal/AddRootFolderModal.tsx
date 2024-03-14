
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from './addRootFolderModal.module.scss'
import { postDocumentWithThunk } from '@/fsd/features/global/documents/postDocument';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { selectCurrentFolder, selectDocumentLayout, selectNavigationStack } from '@/store/document/documentSelectors';
import { DocumentEnum } from '@/fsd/app/types/Document';
import { selectUser } from '@/store/user/userSlice';
import { UserField } from '@/types/user';
import { fetchDocumentByIdWithThunk } from '@/fsd/features/global/documents/fetchDocumentById';
import { DocumentRequest } from '@/fsd/features/global/documents/postDocument/types/DocumentRequest';

type AddRootFolderModal = {
    show: boolean
    onHide: () => void
}

export const AddRootFolderModal = ({ show, onHide }: AddRootFolderModal) => {
    const [folderName, setFolderName] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navItems = useSelector(selectNavigationStack)
    const currentFolder = useSelector(selectCurrentFolder)
    const layout = useSelector(selectDocumentLayout)
   
    const user = useSelector(selectUser)

    const handleSave = () => {
            const folder: DocumentRequest = {
                owner: user[UserField.Id],
                title: folderName,
            }
            if(layout === 'table') {
                folder.parent = navItems[navItems.length - 1][DocumentEnum.Id]!
      
            }
            dispatch(postDocumentWithThunk(folder))
            onHide()
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className={styles.header}>
                <Modal.Title>Создание папки</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formFolderName">
                    <Form.Control
                        type="text"
                        placeholder="Введите название"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className={styles.footer}>
                <Button variant="secondary" onClick={onHide}>
                    Выйти
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={!folderName}>
                    Создать папку
                </Button>
            </Modal.Footer>
        </Modal>
    );
};