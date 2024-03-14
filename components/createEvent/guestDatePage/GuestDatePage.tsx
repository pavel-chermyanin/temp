import { AvailableProviders } from "../availableProviders/AvailableProviders";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from './style.module.scss'
import { HandleCalendar, HandleInput } from "../CreateEventContainer";
import CalendarComponent, { CalendarDatesType } from "@/components/UI/calendar/Calendar";
import { InfoIcon } from "../infoIcon/InfoIcon";
import { minCalendarDateNow } from "@/constant";
import { useSelector } from "react-redux";
import { selectAvailableProviders, selectCategory, selectCountAvailableProviders } from "@/store/createAnnouncement/createAnnouncementSlice";
import { BusCategoryField } from "@/types/business";


interface GuestDateProps {
    handleInputChange: HandleInput;
    handleCalendarChange: HandleCalendar
    eventDate: string;
    guests: number;
    onlyNewlyweds: boolean
}




export const GuestDatePage = ({ handleInputChange, eventDate, guests, onlyNewlyweds, handleCalendarChange }: GuestDateProps) => {
    console.log(eventDate)
    const providers = useSelector(selectAvailableProviders);
    const count = useSelector(selectCountAvailableProviders);
    const selectedCategory = useSelector(selectCategory)

    // const [available, setAvailable] = useState('')

    // useEffect(() => {
    //     if (selectedCategory) {
    //         setAvailable(selectedCategory[BusCategoryField.Title])
    //     }
    // }, [selectedCategory])

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleInputChange(e)
    };

    const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleInputChange(e, e.target.checked)
    }

    function handleDateChange(dates: CalendarDatesType) {
        if (dates) {
            handleCalendarChange('eventDate', dates)
        }
    }

    return (
        <div className={`${styles.location_wrapper}`}>
            <div className={styles.form}>
                <Form.Group controlId="eventDate">
                    <Form.Label>
                        <h2 className="form-label fw-bold">Дата мероприятия</h2>
                    </Form.Label>
                    <CalendarComponent
                        name="eventDate"
                        value={eventDate ? new Date(eventDate) : ''}
                        type="inputIcon"
                        inputClass="w-100 mb-3"
                        onCustomChange={handleDateChange}
                        placeholder="Дата мероприятия"
                        minDate={minCalendarDateNow}
                        multiple={false}
                    />
                </Form.Group>
                <Form.Group controlId="guests" >
                    <Form.Label className={styles.guest_title}>
                        <span>Сколько гостей придет?</span>
                        <InfoIcon />
                    </Form.Label>
                    <Form.Control
                        disabled={onlyNewlyweds}
                        type="number"
                        name="guests"
                        value={guests}
                        onChange={onInputChange}
                        placeholder="0 человек"
                    />

                </Form.Group>
                <Form.Group controlId="onlyNewlyweds" className={styles.checkbox}>
                    <Form.Check
                        name="onlyNewlyweds"
                        checked={onlyNewlyweds}
                        onChange={(e) => onCheckboxChange(e)}
                    />
                    <Form.Label>Без гостей, только жених и невеста</Form.Label>
                </Form.Group>

            </div>
            {/* providers={providers} category={available} count={count} */}
            <AvailableProviders
                providers={providers}
                category={selectedCategory?.[BusCategoryField.Title]}
                count={count} />

        </div>
    );
}