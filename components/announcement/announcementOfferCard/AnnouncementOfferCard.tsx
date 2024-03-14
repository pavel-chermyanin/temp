import { Form, CloseButton, Modal, Button } from 'react-bootstrap'
import style from './style.module.scss'
import Image from 'next/image'
import CalendarComponent, { CalendarDatesType } from '@/components/UI/calendar/Calendar'
import { HandleCalendar, HandleInput } from '../../createEvent/CreateEventContainer'
import { ChangeEvent, useEffect, useState } from 'react'
import { AnnouncementPatchRequest, AnnouncementRequest, AnnouncementResult } from '@/types/announcement'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventTypesWithThunk, selectEventTypes } from '@/store/event/eventSlice'
import { AppDispatch } from '@/store'
import { EventType, EventTypeField } from '@/types/event'
import { BusCategoryField } from '@/types/business'
import { deleteAnnouncementByIdWithThunk, patchAnnouncementByIdWithThunk, selectSelectedCategory } from '@/store/bridgeAnnouncement/bridgeAnnouncementSlice'
import { selectUser } from '@/store/user/userSlice'
import { Image as TypeImage } from '@/types/common'


const options = [
    { value: '43200', label: '12 часов' },
    { value: '36000', label: '10 часов' },
    { value: '18000', label: '5 часов' },
];

type AnnouncementOfferCardProps = {
    item: AnnouncementResult
}

export type cardFormState = {
    typeEvent: number | null
    location: string
    shootingTime: string
    eventDate: string
}


export const AnnouncementOfferCard = ({ item: announcement }: AnnouncementOfferCardProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const eventTypes: EventType[] = useSelector(selectEventTypes);
    const user = useSelector(selectUser);



    // const category: AnnouncementResult | null = useSelector(selectSelectedCategory);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cardFormState, setCardFormState] = useState({
        typeEvent: eventTypes.length > 0 ? eventTypes[0][EventTypeField.Id] : null,
        location: '',
        shootingTime: '',
        eventDate: '',
    });

    const timeStringToSeconds = (timeString: string): string => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return String(hours * 3600);
    };

    useEffect(() => {
        if (announcement) {
            setCardFormState({
                typeEvent: announcement.event_type?.[EventTypeField.Id],
                location: announcement.city || '',
                shootingTime: timeStringToSeconds(announcement.duration) || '',
                eventDate: announcement.event_date || '',
            });
        }
    }, [announcement, eventTypes]);

    const imageSrc = false
    const renderAva = () => {
        if (imageSrc) {
            return <Image
                className={style.avatar}
                src={''}
                width={64}
                height={64}
                alt="avatar"
                loading="lazy"
            />
        } else {

            return <div className={style.ava_default}>
                <i className={`fi-user`}></i>

            </div>
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
    }

    const handleInputChange: HandleInput = (e, radioValue) => {
        const { name, value, type } = e.target;

        setCardFormState((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' || type === 'radio' ? radioValue : value,
        }));
    };

    const handleCalendarChange: HandleCalendar = (name, value) => {
        setCardFormState((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    function handleDateChange(dates: CalendarDatesType) {
        if (dates) {
            handleCalendarChange('eventDate', dates)
        }
    }

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteAnnouncementByIdWithThunk(announcement.id));
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const isImage = (obj: any): obj is TypeImage => {
        return typeof obj === 'object' && 'file' in obj;
    };
    const onUpdateCard = () => {
        const {
            id,
            first_name,
            last_name,
            email,
        } = user;

        const { photo } = user;
        const userPhoto: string = typeof photo === 'string' ? photo : 'default.jpg';

        const announcementRequest: AnnouncementPatchRequest = {
            id: announcement.id,
            owner: { id, photo: userPhoto, first_name, last_name, email, provider_types: [] },
            status: "OPEN",
            title: 'Title',
            cost: announcement.cost || '',
            exact_cost: announcement.exact_cost || '0',
            description: announcement.description || '',
            provider_category: announcement?.provider_category[BusCategoryField.Id]!,
            event_type: cardFormState.typeEvent!,
            view_count: announcement.view_count!,
            city: cardFormState.location,
            duration: cardFormState.shootingTime,
            event_date: cardFormState.eventDate,
            files: announcement.files.filter(isImage).map(file => file.id)!,
            is_only_newlyweds: announcement.is_only_newlyweds!,
            number_of_guests: announcement.number_of_guests!
        }
        dispatch(patchAnnouncementByIdWithThunk(announcementRequest))
    };


    useEffect(() => {
        if (!eventTypes.length) {
            dispatch(fetchEventTypesWithThunk());
        }
    }, [eventTypes]);



    return (
        <div className={style.announcement_card}>
            <Form className={style.announcement_form} onSubmit={handleSubmit}>
                <h3 className={style.announOffer_title}>
                    <span>{announcement.provider_category[BusCategoryField.Title]}</span>
                    <CloseButton onClick={handleDeleteClick} />
                </h3>
                <Form.Group controlId={'timeVideo'} className={style.select_group}>
                    <Form.Label>Мероприятие</Form.Label>
                    <Form.Select
                        className={style.select}
                        name="typeEvent"
                        value={cardFormState.typeEvent?.toString() || ''}
                        onChange={(e) => handleInputChange(e)}
                    >
                        {eventTypes.map(({ id, name }) => {
                            return (
                                <option key={`${name}-${id}`} value={id}>
                                    {name}
                                </option>
                            );
                        })}
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="cityInput" className={style.city_group}>
                    <Form.Label>Адрес</Form.Label>
                    <Form.Control
                        type="text"
                        name="location"
                        value={cardFormState.location}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Город, улица и дом"
                    />
                </Form.Group>
                <div className={style.date}>
                    <Form.Group
                        controlId={'timeVideo'}
                    // className={style.select_group}
                    >
                        <Form.Label>Продолжительность</Form.Label>
                        <Form.Select
                            name="shootingTime"
                            value={options.find(option => option.value === cardFormState.shootingTime)?.value || ''}
                            onChange={handleInputChange}
                        >
                            {options.map((option, id) => (
                                <option key={`${option.value}-id`} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="eventDate" className={style.date_group}>
                        <Form.Label>
                            <h2 className="form-label fw-bold">Дата мероприятия</h2>
                        </Form.Label>
                        <CalendarComponent
                            name="eventDate"
                            value={cardFormState.eventDate ? new Date(cardFormState.eventDate) : ''}
                            type="inputIcon"
                            inputClass="w-100 mb-3"
                            onCustomChange={handleDateChange}
                            placeholder="Дата мероприятия"
                            minDate={''}
                            multiple={false}
                        />
                    </Form.Group>
                </div>
                <Button
                    type='submit'
                    variant="primary"
                    // className={`${style.button} px-3 fw-semibold`}
                    onClick={onUpdateCard}
                >
                    Сохранить
                </Button>
            </Form>
            <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Потвердите удаление</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы уверены, что хотите удалить объявление?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleConfirmDelete}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}