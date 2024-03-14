import React from 'react';
import { Alert, Form } from 'react-bootstrap';
import styles from './style.module.scss';
import { HandleInput } from '../CreateEventContainer';
import { BusCategory } from '@/types/business';
import { setSelectedCategory } from '@/store/createAnnouncement/createAnnouncementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { AnnouncementResult } from '@/types/announcement';
import { fetchProvidersWithThunk } from '@/fsd/features/global/providers/fetchProviders';
import { selectAnnouncements } from '@/store/bridgeAnnouncement/bridgeAnnouncementSlice';
import { fetchAnnouncementsWithThunk } from '@/fsd/features/global/announcements/fetchAnnouncements';
import { selectUser } from '@/store/user/userSlice';
import { fetchVenuesWithThunk } from '@/fsd/features/global/providers/fetchVenues';


interface CategoryPageProps {
    handleInputChange: HandleInput;
    categories: BusCategory[]
    category: number | null
}
export const CategoryPage = ({ handleInputChange, categories, category }: CategoryPageProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const announcements: AnnouncementResult[] = useSelector(selectAnnouncements)


    const user = useSelector(selectUser)


    function handleRadioChange(e: React.ChangeEvent<HTMLInputElement>, id: number) {
        handleInputChange(e, id);
        if (id === 1) {
            dispatch(fetchVenuesWithThunk({}))
        } else {
            dispatch(fetchProvidersWithThunk({ category: id }))
        }
        dispatch(fetchAnnouncementsWithThunk({ owner: user.id, category: id }))
    }


    function renderItems() {
        return categories.map((cat) => (
            <li
                key={cat.id}
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ItemList"
            >
                <Form.Check
                    className={`${styles.item_wrapper}`}
                    key={cat.id}
                    type="radio"
                    label={cat.title}
                    name="category"
                    id={`categoryRadio-${cat.title}`}
                    checked={category === cat.id}
                    onChange={(e) => {
                        dispatch(setSelectedCategory(cat))
                        handleRadioChange(e, cat.id)
                    }
                    }
                />
            </li>
        ))
    }

    return (
        <>
            <div className={`${styles.grid}`}>
                {renderItems()}
            </div>
            {category && announcements?.length > 0 && (
                <Alert variant="danger" className="mt-2">
                    У вас уже есть объявление с такой категорией!
                </Alert>
            )}
        </>
    );
};



