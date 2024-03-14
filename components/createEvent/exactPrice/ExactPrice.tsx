import { Button, Form } from "react-bootstrap";
import { HandleInput } from "../CreateEventContainer";
import styles from './style.module.scss'
import { selectExactPrice, selectIsExactPrice, setExactPrice, toggleExactPrice } from "@/store/createAnnouncement/createAnnouncementSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { useState } from "react";

type ExactPriceProps = {
    handleInputChange: HandleInput
}
export const ExactPrice = ({ handleInputChange }: ExactPriceProps) => {
    const isSelect = useSelector(selectIsExactPrice)
    const exactPrice = useSelector(selectExactPrice)
    const dispatch = useDispatch<AppDispatch>()

    const [error, setError] = useState('');

    console.log(error)
    const validateAndSetPrice = (value: string) => {
        // Проверка, является ли введенное значение числом
        const isNumber = !isNaN(Number(value));
    
        if (isNumber && parseInt(value, 10) >= 0) {
            setError('');
        } else {
            setError("Введите положительное число");
        }
    };

    const handleClick = () => {
        dispatch(toggleExactPrice())
        if (isSelect) {
            dispatch(setExactPrice(''))
        }
    }

    return (
        <div className={styles.price_wrapper}>
            {isSelect && (
                <Form.Group controlId="cityInput" className={styles.form_group}>
                    <Form.Label>Точная стоимость</Form.Label>
                    <Form.Control

                        type="number"
                        name="exactPrice"
                        value={exactPrice}
                        onChange={(e) => {
                            handleInputChange(e)
                            dispatch(setExactPrice(e.target.value))
                            validateAndSetPrice(e.target.value)
                        }}
                        placeholder="0 рублей"

                    />
                    <Form.Control.Feedback style={{ display: 'block' }} type="invalid">{error}</Form.Control.Feedback>
                </Form.Group>
            )}

            <Button
                className={styles.btn_toggle}
                variant="light"
                onClick={handleClick}
            >
                <span className={styles.circle}>

                    <span className={`${styles.icon} ${isSelect ? styles.selected : ''}`}>
                        {isSelect ? '-' : '+'}
                    </span>
                </span>
                <span>
                    Указать точную стоимость

                </span>
            </Button>
        </div>
    )
}