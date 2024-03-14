import CustomSearch from '@/components/UI/search/Search';
import styles from './folderHeader.module.scss';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { selectCurrentCountElements, selectCurrentFolder, selectSelectedFiles, selectSelectedTableItems } from '@/store/document/documentSelectors';
import { DocumentEnum } from '@/fsd/app/types/Document';
import { getElementString } from '@/fsd/shared/lib/format/nounFormatter';
import { AddRootFolderModal } from '../addRootFolderModal/AddRootFolderModal';
import { useEffect, useState } from 'react';
import { AddFilesModal } from '../addFilesModal/AddFilesModal';
import { DeleteModal } from '../deleteModal/DeleteModal';
import { SearchInput } from '@/components/headerNew/search/SearchInput';
import { searchElements } from '@/store/document/documentSlice';

export const FolderHeader = () => {
    const dispatch = useDispatch<AppDispatch>()
    const selectFolder = useSelector(selectCurrentFolder)
    const selectCount = useSelector(selectCurrentCountElements)
    const selectedItems = useSelector(selectSelectedTableItems)
    const selectedFiles = useSelector(selectSelectedFiles)
    const [showModal, setShowModal] = useState(false)
    const [showFileModal, setShowFileModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [searchInput, setSearchInput] = useState('')


    const onAddFolder = () => {
        setShowModal(true)
    }
    const onAddFile = () => {
        setShowFileModal(true)
    }
    const onDelete = () => {
        setShowDeleteModal(true)
    }

    useEffect(() => {
        dispatch(searchElements(searchInput))
    }, [searchInput])

    return (
        <>
            <div className={styles.header_wrapper}>
                <div className={styles.title_wrapper}>
                    <div className={styles.title}>{selectFolder?.[DocumentEnum.Title]}</div>
                    {selectFolder && selectFolder[DocumentEnum.Children] && (
                        <div className={styles.count}>
                            Всего: {getElementString(selectCount)}
                        </div>

                    )}
                </div>
                <div className={styles.controls}>
                    {selectedItems.length > 0 || selectedFiles.length > 0
                        ? (
                            <Button
                                variant="danger"
                                size="sm"
                                className="fs-xs px-3 fw-semibold"
                                style={{ paddingBlock: '12px' }}
                                onClick={onDelete}
                            >
                                Удалить выбранное
                            </Button>
                        )
                        : (
                            <>
                                <SearchInput setInputCity={setSearchInput} />
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className={`fs-xs px-3 fw-semibold text-dark ${styles.add_btn}`}
                                    style={{ paddingBlock: '12px' }}
                                    onClick={onAddFolder}
                                >
                                    Добавить вложенную папку
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="fs-xs px-3 fw-semibold"
                                    style={{ paddingBlock: '12px' }}
                                    onClick={onAddFile}
                                >
                                    Добавить файл
                                </Button>
                            </>

                        )
                    }
                </div>
            </div >

            {
                showModal && (
                    <AddRootFolderModal onHide={() => setShowModal(false)} show={showModal} />
                )
            }
            {
                showFileModal && (
                    <AddFilesModal onHide={() => setShowFileModal(false)} show={showFileModal} />
                )
            }

            <DeleteModal onHide={() => setShowDeleteModal(false)} show={showDeleteModal} />

        </>
    )
}