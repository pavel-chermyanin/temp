import { Accordion, Button, Dropdown, Form, Modal } from 'react-bootstrap'
import styles from './style.module.scss'
import { ViewCard } from './viewCard/ViewCard'
import { useDispatch, useSelector } from 'react-redux'
import { selectEventTypes } from '@/store/event/eventSlice'
import { EventType, EventTypeField } from '@/types/event'
import { ChangeEvent, useEffect, useState } from 'react'
import { CaledarInput } from './calendar/CaledarInput'
import { HTMLForms, HandleCalendar, HandleInput } from '@/components/lk/common/createEvent/CreateEventContainer'
import { AppDispatch } from '@/store'
import { fetchAnnouncementsWithThunk } from '@/store/bridgeAnnouncement/announcementActions'
// import { resetAnnouncements } from '@/store/bridgeAnnouncement/bridgeAnnouncementSlice'
import { selectProviderMe } from '@/store/user/userSlice'
import { Business, BusinessField } from '@/types/business'
import { resetAnnouncements } from '@/store/businessAnnouncement/businessAnnouncementSlice'
import { selectLoadingAnnouncements } from '@/store/bridgeAnnouncement/bridgeAnnouncementSlice'

export type BusinessAnnouncementForm = {
    city: string
    event_type: number[] | null
    event_date: string
    cost__gte: string
    cost__lte: string
}

type SortFormProps = {
    mobileForm?: string
}

export const SortForm = ({ mobileForm }: SortFormProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const eventTypes: EventType[] = useSelector(selectEventTypes)
    const provider:Business | null = useSelector(selectProviderMe)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    
    const [formData, setFormData] = useState<BusinessAnnouncementForm>({
        city: '',
        event_type: [],
        event_date: '',
        cost__gte: '',
        cost__lte: ''
    })

    console.log(formData)
    const categoryId = typeof provider?.[BusinessField.Category] === 'object'
        ? provider[BusinessField.Category]?.id
        : provider?.[BusinessField.Category];

        useEffect(() => {
            if (formData && categoryId) {
    
                // Очистим предыдущий таймаут, если он есть
                if (typingTimeout) {
                    clearTimeout(typingTimeout);
                }
    
                // Установим новый таймаут для задержки выполнения запроса
                const timeoutId = setTimeout(() => {
                    dispatch(resetAnnouncements());
                    const event_type = formData.event_type?.join();
                    dispatch(fetchAnnouncementsWithThunk({
                        ...formData,
                        event_type,
                        category: categoryId
                    }));
                }, 500); // 500 миллисекунд (половина секунды)
    
                setTypingTimeout(timeoutId);
            }
        }, [formData, categoryId, dispatch]);


    const handleInputChange: HandleInput = (e, radioValue) => {
        const { name, value, type } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' || type === 'radio' ? radioValue : value,
        }));

    };
    console.log(formData)

    const handleCalendarChange: HandleCalendar = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const onCheckboxChange = (num: number) => {
        if (formData.event_type && !formData.event_type.includes(num)) {
            setFormData((prevData) => ({
                ...prevData,
                event_type: Array.isArray(prevData.event_type) ? [...prevData.event_type, num] : [num]
            }));

        } else {
            setFormData((prevData) => ({
                ...prevData,
                event_type: prevData.event_type && prevData.event_type.filter(id => id !== num)
            }));
        }
    }

    const resetForm = () => {
        setFormData({
            city: '',
            event_type: [],
            event_date: '',
            cost__gte: '',
            cost__lte: ''
        })
    }



    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        resetForm()
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };



    return (
        <div className={`${styles.form_wrapper} ${mobileForm ? styles.mobileForm : ''}`}>
            <h3 className={styles.title}>Фильтры</h3>
            <ViewCard />

            <Form.Group controlId="city" className={styles.city_group}>
                <Form.Label>Город проведения</Form.Label>
                <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="Введите город"
                />
            </Form.Group>
            {/* id="dropdown-autoclose-true" */}
            <Dropdown autoClose="outside" className={styles.dropdown}>
                <Dropdown.Toggle>
                    Тип мероприятия
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {eventTypes.map(item => (
                        <Dropdown.Item key={item[EventTypeField.Id]}>
                            <Form.Group controlId="event" className={styles.event}>
                                <Form.Check
                                    name="typeEvent"
                                    checked={formData.event_type?.includes(item[EventTypeField.Id])}
                                    onChange={(e) => onCheckboxChange(item[EventTypeField.Id])}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <Form.Label>{item[EventTypeField.Title]}</Form.Label>
                            </Form.Group>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            <div className={styles.calendar_group}>
                <Form.Group controlId="event_date">
                    <Form.Label>
                        <h2 className="form-label">Дата мероприятия</h2>
                    </Form.Label>
                    <CaledarInput handleCalendarChange={handleCalendarChange} calendarValue={formData.event_date} />
                </Form.Group>
            </div>

            <div className={styles.price_group}>
                <label >Стоимость</label>
                <div className={styles.price_inputs}>
                    <Form.Group controlId="cost" className={styles.price}>
                        <Form.Control
                            type="number"
                            name="cost__gte"
                            value={formData.cost__gte}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="От 0"
                        />
                        <span className={styles.currency_symbol}>₽</span>
                    </Form.Group>
                    <Form.Group controlId="city" className={styles.price}>
                        <Form.Control
                            type="number"
                            name="cost__lte"
                            value={formData.cost__lte}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="До 0"
                        />
                        <span className={styles.currency_symbol}>₽</span>
                    </Form.Group>
                </div>
            </div>
            <Button
                variant="primary"
                onClick={handleDeleteClick}
            >
                Сбросить все
            </Button>

            <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Потвердите удаление</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы уверены, что хотите очистить форму?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleConfirmDelete}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

