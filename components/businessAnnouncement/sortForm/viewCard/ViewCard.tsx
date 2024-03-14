import { ChangeEvent, useState } from "react";
import { ButtonGroup, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import styles from './style.module.scss'
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { TypeLayout, toggleTypeLayout } from "@/store/businessAnnouncement/businessAnnouncementSlice";


export const ViewCard = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('list');
    const radios = [
        { name: 'list', value: 'list' },
        { name: 'grid', value: 'grid' },
    ];

    const HandleChange = (val: TypeLayout) => {
        // const val = e.currentTarget.value
        setRadioValue(val)
        dispatch(toggleTypeLayout(val))
    }

    return (
        <div className={styles.container}>
            <ButtonGroup>
                {radios.map((radio, idx) => (
                    <ToggleButton
                        className={`${styles.toggleButton} ${radioValue === radio.value ? styles.active : ''}`}
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        name="radio"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={() => HandleChange(radio.value as TypeLayout)}
                    >
                        <i className={radio.name === 'list' ? 'fi-list' : 'fi-grid'}></i>
                    </ToggleButton>
                ))}
            </ButtonGroup>
        </div>
    );
}