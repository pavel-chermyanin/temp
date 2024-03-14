import { useMediaQuery } from 'react-responsive';
import styles from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { TypeLayout, deleteFromAnnouncementResponses, removeAnnouncementById, selectTypeCardBusiness, selectTypeLayout } from '@/store/businessAnnouncement/businessAnnouncementSlice';
import dynamic from 'next/dynamic';
import { AnnouncementResult } from '@/types/announcement';
import { BusCategoryField } from '@/types/business';
import DynamicPriceParagraph from './dynamicPriceParagraph/DynamicPriceParagraph'
import Link from 'next/link';
import { Paths } from '@/constant';
import { formattedDate, formattedRelativeTime } from '@/fsd/shared/lib/format/formatStringDate';
import { formatDuration, } from '@/fsd/shared/lib/format/formatStringTime';
import { EventTypeField } from '@/types/event';
import { getGuestsString } from '@/fsd/shared/lib/format/nounFormatter';
import { AppDispatch } from '@/store';
import { hideAnnouncementWithThunk } from '@/fsd/features/global/announcements/hideAnnouncement';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { fetchAnnouncementsWithThunk } from '@/store/bridgeAnnouncement/announcementActions';
import { Button, Modal } from 'react-bootstrap';
import { deleteAnnouncementResponseById } from '@/store/businessAnnouncement/businessAnnouncementApi';
// import { deleteAnnouncementResponseById } from '@/store/businessAnnouncement/businessAnnouncementApi';
// import { fetchAnnouncementsWithThunk } from '@/fsd/features/global/announcements/fetchAnnouncements';
// import { selectTypeCardBusiness } from '@/fsd/pages/business/announcements';

interface DynamicDeleteButtonProps {
    insideCard?: string;
    onClickDelete?: () => void

}


type AnnouncementCardProps = {
    announ: AnnouncementResult
    statusApproved?: string
    announId?: number
}

const DynamicDeleteButton = dynamic<DynamicDeleteButtonProps>(
    () => import('./dynamicDeleteButton/DynamicDeleteButton'), { ssr: false });

const DynamicPriceParagraphComponent = dynamic(
    () => import('./dynamicPriceParagraph/DynamicPriceParagraph'), { ssr: false }) as React.ComponentType;

export const AnnouncementCard = ({ announ, statusApproved, announId }: AnnouncementCardProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const typeCardBusiness = useSelector(selectTypeCardBusiness)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const {
        id,
        provider_category,
        cost,
        duration,
        number_of_guests,
        city,
        event_date,
        creation_datetime,
        owner,
        event_type
    } = announ;
    const cardName = event_type[EventTypeField.Title]
    const ownerName = owner?.first_name


    const typeLayout: TypeLayout = useSelector(selectTypeLayout);

    const isTablet = useMediaQuery({ maxWidth: 1024 });

    let cancelFlag = false;

    const onButtonDeleteClick = () => {
        if (typeCardBusiness === 'topic') {
            toast.info(
                <div>
                    Скрыть объявление?
                    <button onClick={handleCancelDelete}>Отмена</button>
                </div>,
                {
                    autoClose: 5000, // время в миллисекундах
                    position: "bottom-center",
                    closeButton: false, // Отключаем крестик закрытия
                    onClose: () => {
                        if (!cancelFlag) {
                            dispatch(hideAnnouncementWithThunk({ id })).then(() => {
                                dispatch(removeAnnouncementById(id))
                            })
                        }
                        // Обнуляем флаг после закрытия тоста
                        cancelFlag = false;
                    },
                }
            );
        }
        if (typeCardBusiness === 'response') {
            setShowDeleteModal(true)
        }
    }

    const onDelete = () => {
        if (announId) {
            dispatch(deleteAnnouncementResponseById(announId)).then(() => {
                dispatch(deleteFromAnnouncementResponses(announId))
            })
        }
        setShowDeleteModal(false)
    }


    const handleCancelDelete = () => {
        cancelFlag = true;
        toast.dismiss(); // Закрываем тост при отмене
    }

    return (
        <div className={`${styles.card_wrapper}`}>
            <Link
                href={`/${Paths.Common}${Paths.BusPro}${Paths.Announcement}/${id}`}
                className={styles.card}>
                <div className={styles.info}>
                    <div className={styles.title_group}>
                        <div className={styles.title}>{cardName}</div>
                        {isTablet && <DynamicDeleteButton insideCard={'insideCard'} onClickDelete={onButtonDeleteClick} />}
                        {!isTablet && typeLayout === 'grid' && <DynamicDeleteButton insideCard={'insideCard'} onClickDelete={onButtonDeleteClick} />}
                        {!isTablet && typeLayout !== 'grid' && <DynamicPriceParagraph cost={cost} />}
                    </div>


                    <ul className={styles.info_list}>
                        {isTablet && <DynamicPriceParagraph cost={cost} />}
                        {!isTablet && typeLayout === 'grid' && <DynamicPriceParagraph cost={cost} />}
                        <li className={styles.info_item}>
                            <span className={styles.name}>Продолжительность:</span>
                            <span className={styles.value}>{formatDuration(duration)}</span>
                        </li>
                        {number_of_guests > 0
                            ? (
                                <li className={styles.info_item}>
                                    <span className={styles.name}>Количество гостей:</span>
                                    <span className={styles.value}>{getGuestsString(number_of_guests)}</span>
                                </li>

                            ) : null}
                        <li className={`${styles.info_item} ${styles.address}`}>
                            <span className={styles.name}>Адрес:</span>
                            <span className={styles.value}>{city}</span>
                        </li>
                        <li className={`
                        ${styles.info_item}
                        ${styles.date_group}
                         `}>
                            <div className={styles.date_line}>
                                <span className={styles.name}>Дата:</span>
                                <span className={styles.value}>{formattedDate(event_date)}</span>
                            </div>
                            <p className={styles.creation_date}>
                                <span className={styles.time}>{formattedRelativeTime(creation_datetime)} назад</span>
                                <span className={styles.author}>{ownerName}</span>
                            </p>
                        </li>
                    </ul>
                </div>
                {statusApproved === 'APPROVED' && (
                    <div className={styles.statusApproved}>Вы получили отклик</div>
                )}
                {statusApproved === 'DECLINED' && (
                    <div className={styles.statusReject}>Вы получили отказ</div>
                )}
            </Link>
            {!isTablet && typeLayout !== 'grid' && <DynamicDeleteButton onClickDelete={onButtonDeleteClick} />}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Потвердите удаление</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы уверены, что хотите удалить свой отклик?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={onDelete}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

