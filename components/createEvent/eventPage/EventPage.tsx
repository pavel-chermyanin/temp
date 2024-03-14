import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { catalog } from '../catalog';
import styles from './style.module.scss';
import { events } from '../events';
import { HandleInput } from '../CreateEventContainer';
import { EventType } from '@/types/event';

interface EventPageProps {
    handleInputChange: HandleInput;
    selectedEvent: number | null;
    eventTypes: EventType[]
}

export const EventPage = ({ handleInputChange, selectedEvent, eventTypes }: EventPageProps) => {
    return (
        <div className={`${styles.grid}`}>
            {eventTypes.map(({ id, name }) => (
                <Form.Check
                    className={styles.item_wrapper}
                    key={`${name}-id`}
                    type="radio"
                    label={name}
                    name="event"
                    id={`event-${name}`}
                    checked={selectedEvent === id}
                    onChange={(e) => handleInputChange(e, id)} />
            ))}
        </div>
    );
};