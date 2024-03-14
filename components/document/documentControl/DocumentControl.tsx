import { useState } from 'react';
import { Button, Dropdown, ProgressBar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectBusinessEvents } from '@/store/event/eventSlice';
import { width } from '@/components/lk/lk.constant';
import { selectCurrentEventGuest } from '@/store/guest/guestSlice';
import styles from './documentControl.module.scss'
import { AddRootFolderModal } from '../addRootFolderModal/AddRootFolderModal';
import { AddFilesModal } from '../addFilesModal/AddFilesModal';
import { DeleteRootModal } from '../deleteRootModal/DeleteRootModal';

type DocumentControlProps = {};

export default function DocumentControl({}: DocumentControlProps) {

  const [showModal , setShowModal] = useState<boolean>(false);
  const [showFileModal , setShowFileModal] = useState<boolean>(false);
  const [showDeleteModal , setShowDeleteModal] = useState<boolean>(false);

  const onAddFolder = () => {
    setShowModal(true)
  }


  return (
    <>
      <div className="mb-4 d-flex justify-content-lg-end align-items-center">
        <Button
          variant="secondary"
          size="sm"
          className="fs-xs me-3 px-3 fw-semibold text-dark opacity-70"
          style={{ paddingBlock: '12px' }}
          onClick={() => setShowDeleteModal(true)}
        >
          Удалить...
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className={`fs-xs me-3 px-3 fw-semibold text-dark ${styles.add_btn}`}
          style={{ paddingBlock: '12px' }}
          onClick={onAddFolder}
        >
          Добавить папку
        </Button>
      </div>
      {showModal && (
        <AddRootFolderModal onHide={() => setShowModal(false)} show={showModal}/>
      )}
      {showFileModal && (
        <AddFilesModal onHide={() => setShowFileModal(false)} show={showFileModal}/>
      )}
      {showDeleteModal && (
        <DeleteRootModal onHide={() => setShowDeleteModal(false)} show={showDeleteModal}/>
      )}
    </>
  );
}
