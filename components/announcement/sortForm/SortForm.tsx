import { Button, Form, Modal } from "react-bootstrap"
import style from './style.module.scss'
import { ChangeEvent, useEffect, useState } from "react";
import { patchAnnouncementByIdWithThunk, selectSelectedCategory, selectTypeCard } from "@/store/bridgeAnnouncement/bridgeAnnouncementSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { AnnouncementPatchRequest, AnnouncementResult } from "@/types/announcement";
import { EventTypeField } from "@/types/event";
import { BusCategoryField } from "@/types/business";
import { Image as TypeImage } from '@/types/common'
import { fetchAnnouncementResponsesWithThunk } from "@/store/businessAnnouncement/businessAnnouncementSlice";

const sortList = [
    { title: 'по новизне', query: '-creation_datetime' },
    { title: 'по стоимости', query: '-cost' },
    { title: 'по рейтингу', query: '-creation_datetime' },
]

enum SortOption {
    NOVELTY = 'по новизне',
    COST = 'по стоимости',
    RANTING = 'по рейтингу',
}

type Sort = {
    [key in keyof typeof SortOption]: string;
};

const sort: Sort = {
    NOVELTY: SortOption.NOVELTY,
    COST: SortOption.COST,
    RANTING: SortOption.RANTING,
};

export const SortForm = () => {
    const typeCard = useSelector(selectTypeCard)
    const selectedCategory: AnnouncementResult | null = useSelector(selectSelectedCategory)
    const dispatch = useDispatch<AppDispatch>()
    const [isChecked, setIsChecked] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const [selectedSort, setSelectedSort] = useState<string>(sortList[0].query);

    const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedSort(e.target.value);
        // Вызовите ваш запрос или диспетчеризацию события здесь,
        // передавая новое значение в fetchAnnouncementResponsesWithThunk.
        dispatch(fetchAnnouncementResponsesWithThunk({ order: e.target.value }));
    };
    const handleSwitchChange = () => {
        if (isChecked) {
            setShowConfirmationModal(true);
        } else {
            setIsChecked(!isChecked);
            if (selectedCategory) {
                // isChecked поменяется уже после выполенения функции
                // поэтому заранее инвертирую
                const announcementRequest: AnnouncementPatchRequest = {
                    ...selectedCategory,
                    files: selectedCategory.files && Array.isArray(selectedCategory) ? selectedCategory.map(img => img.id) : [],
                    status: !isChecked ? "OPEN" : "CLOSED",
                    provider_category: selectedCategory.provider_category[BusCategoryField.Id],
                    event_type: selectedCategory.event_type[EventTypeField.Id],

                }
                dispatch(patchAnnouncementByIdWithThunk(announcementRequest))
            }
        }


    };

    const isImage = (obj: any): obj is TypeImage => {
        return typeof obj === 'object' && 'file' in obj;
    };

    const handleConfirmation = () => {
        setIsChecked(false);
        setShowConfirmationModal(false);
        if (selectedCategory) {
            // isChecked поменяется уже после выполенения функции
            // поэтому заранее инвертирую
            const announcementRequest: AnnouncementPatchRequest = {
                ...selectedCategory,
                status: !isChecked ? "OPEN" : "CLOSED",
                provider_category: selectedCategory.provider_category[BusCategoryField.Id],
                event_type: selectedCategory.event_type[EventTypeField.Id],
                files: selectedCategory.files.filter(isImage).map(file => file.id)!,

            }
            dispatch(patchAnnouncementByIdWithThunk(announcementRequest))
        }
    };

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
    };

    useEffect(() => {
        if (selectedCategory) {
            if (selectedCategory.status === 'OPEN') {
                setIsChecked(true)
            } else {
                setIsChecked(false)
            }
        }

    }, [selectedCategory])

    return (
        <Form className={style.sortForm}>
            <Form.Check
                className={style.sortForm_toggle}
                type="switch"
                id="custom-switch"
                label="Получать отклики"
                checked={isChecked}
                onChange={handleSwitchChange}
            />
            {typeCard === 'answer' &&
                <Form.Select
                    onChange={handleSelect}
                    value={selectedSort}
                    aria-label="Default select example">
                    <option>Выберите сортировку</option>
                    {sortList.map(({ title, query }) => (
                        <option key={title} value={query}>{title}</option>
                    ))}
                </Form.Select>
            }
            <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы уверены, что хотите скрыть объявление?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirmationModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleConfirmation}>
                        Подтвердить
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>
    )
}