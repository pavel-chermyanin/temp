


import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import styles from './addRootFolderModal.module.scss'
import { postDocumentWithThunk } from '@/fsd/features/global/documents/postDocument';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { selectCurrentFolder, selectDocumentLayout, selectNavigationStack } from '@/store/document/documentSelectors';
import { Document, DocumentEnum } from '@/fsd/app/types/Document';
import { selectUser } from '@/store/user/userSlice';
import { UserField } from '@/types/user';
import { fetchDocumentByIdWithThunk } from '@/fsd/features/global/documents/fetchDocumentById';
import { DocumentRequest } from '@/fsd/features/global/documents/postDocument/types/DocumentRequest';
import FileUploader from '@/components/UI/fileUploader/FileUploader';
import { Image } from '@/types/common';
import { patchDocumentByIdWithThunk } from '@/fsd/features/global/documents/patchDocumentById';
import { fetchImagesIdByString } from '@/store/image/imageAPI';
import { Token } from '@/constant';
// import { FileUpload } from '@/fsd/shared/rhf-ui/FileUploader/FileUploader2';

type AddRootFolderModal = {
    show: boolean
    onHide: () => void
}

export const AddFilesModal = ({ show, onHide }: AddRootFolderModal) => {
    // const [folderName, setFolderName] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navItems = useSelector(selectNavigationStack)
    const currentFolder = useSelector(selectCurrentFolder)
    // const layout = useSelector(selectDocumentLayout)
    const [files, setFiles] = useState<Image[]>([])
    const token = localStorage.getItem(Token.Access);
    const [loading, setLoading] = useState(false)


    const user = useSelector(selectUser)


    const handleSave = async () => {
        const images: Image[] = [];
        setLoading(true)

        if (token) {
            const fetchedImages = await fetchImagesIdByString(files.map(el => el.file), token);
            if (Array.isArray(fetchedImages)) {
                images.push(...fetchedImages);
            }
        }
        if (currentFolder) {
            const { children, parent, ...rest } = currentFolder

            if (rest && rest?.[DocumentEnum.Files]) {
                const currentFiles = (rest?.[DocumentEnum.Files] as Image[])?.map((doc) => doc.id);
                rest[DocumentEnum.Files] = [...currentFiles, ...images.map(img => img.id)]
            } else {
                rest[DocumentEnum.Files] = [...images.map(img => img.id)]
            }

            dispatch(patchDocumentByIdWithThunk(rest)).then((res) => {
                setLoading(false)
                onHide()
            })
        }
    };

    const uploaderRender = (
        handleFileChange: (imgs: Image[]) => void,
        files: Image[] | undefined,
        required: boolean
    ) => {
        console.log('uploaderRender', files)
        return (
            <Form.Group className={styles.file_group}>
                {<FileUploader
                    setGallery={handleFileChange}
                    maxFiles={100}
                    gallery={files}
                    required={required}
                    placeholder='Загузите файлы'
                />}
            </Form.Group>
        );
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className={styles.header}>
                <Modal.Title>Добавьте файлы</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {uploaderRender(setFiles, files, false)}
            </Modal.Body>
            <Modal.Footer className={styles.footer}>
                <Button variant="secondary" onClick={onHide}>
                    Выйти
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={!files.length}>
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            &nbsp;Сохранение...
                        </>
                    ) : (
                        "Сохранить"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};