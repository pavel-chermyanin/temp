import CalendarComponent, { CalendarDatesType } from "@/components/UI/calendar/Calendar"
import { useEffect, useState } from "react";
import styles from './style.module.scss'
import { HandleCalendar } from "@/components/lk/common/createEvent/CreateEventContainer";

type CaledarInputProps = {
    handleCalendarChange: HandleCalendar
    calendarValue: string
}

export const CaledarInput = ({ handleCalendarChange, calendarValue }: CaledarInputProps) => {
    const [selectedDates, setSelectedDates] = useState<string[]>([]);

    const handleDateChange = (dates: CalendarDatesType) => {
        setSelectedDates(dates ? (Array.isArray(dates) ? dates : [dates]) : []);

    };

    const handleRemoveDate = (index: number) => {
        const updatedDates = [...selectedDates];
        updatedDates.splice(index, 1);
        setSelectedDates(updatedDates);
    };
    const handleRemoveAll = () => {
        setSelectedDates([]);
    };

    useEffect(() => {
        handleCalendarChange('event_date', selectedDates.join(','))
    }, [selectedDates.length])

    useEffect(() => {
        if (!calendarValue) {
            setSelectedDates([])
        }
    }, [calendarValue])
    return (
        <div>
            <CalendarComponent
                className={styles.calendar}
                name="event_date"
                type="inputIcon"
                inputClass="w-100 mb-3"
                placeholder="Дата мероприятия"
                minDate={Date.now()}
                multiple={true}
                value={selectedDates.length ? selectedDates.map(item => new Date(item)) : ''}
                onCustomChange={handleDateChange}
            />

            {selectedDates.length > 0 && (
                <div>
                    <ul className={styles.list}>
                        {selectedDates.map((date, index) => (
                            <li key={index} className={styles.dateItem}>
                                {new Date(date).toLocaleDateString()}
                                <button onClick={() => handleRemoveDate(index)}>✖</button>
                            </li>
                        ))}
                        <li className={`${styles.dateItem} ${styles.clear}`}>
                            Очистить все
                            <button onClick={() => handleRemoveAll()}>✖</button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}