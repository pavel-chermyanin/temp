import { useState } from "react";
import { Form } from "react-bootstrap"
import { Search } from "../svgIcons/Search";
import styles from './search.module.scss';

type SearchInputProps = {
    setInputCity: (str: string) => void
    placeholder?: string
}

export const SearchInput = ({ setInputCity, placeholder = 'поиск' }: SearchInputProps) => {
    const [value, setValue] = useState('');

    const handleChange = (e: any) => {
        setValue(e.target.value);
        setInputCity(e.target.value)
    };
    return (
        <Form.Group className={styles.search_group}>
            {value === '' && (
                <Search />
            )}
            <Form.Control
                autoFocus
                className={styles.search_input}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
        </Form.Group>
    )
}