import React, { useState, ChangeEvent, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from './style.module.scss';
import { CategoryPage } from './categoryPage/CategoryPage';
import { FooterNav } from './footerNav/FooterNav';
import { EventPage } from './eventPage/EventPage';
import { LocationPage } from './locationPage/LocationPage';
import { GuestDatePage } from './guestDatePage/GuestDatePage';
import { PricePage } from './pricePage/PricePage';
import { StatePage, Step, state } from './pages';
import { WishesPage } from './wishesPage/WishesPage';
import { CalendarDatesType } from '@/components/UI/calendar/Calendar';
import { Image } from '@/types/common';
import { createAnnouncementWithThunk, selectAnnouncemntsOwn, selectCategory, selectExactPrice, setSelectedCategory } from '@/store/createAnnouncement/createAnnouncementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { selectUser } from '@/store/user/userSlice';
import { AnnouncementCreateFormData, AnnouncementRequest, AnnouncementResult } from '@/types/announcement';
import { UserField } from '@/types/user';
import { Paths, Token } from '@/constant';
import { fetchEventTypesWithThunk, selectEventTypes } from '@/store/event/eventSlice';
import {
    fetchAllCategoriesWithThunk,
    // fetchAnnouncementsWithThunk,
    selectAnnouncements, selectCategories,
    selectCountAnnouncements,
    selectNextCategory,
} from '@/store/bridgeAnnouncement/bridgeAnnouncementSlice';
import { fetchImagesIdByImageType, fetchImagesIdByString, getPatchImagesIds } from '@/store/image/imageAPI';
import { fetchAnnouncementsWithThunk } from '@/store/bridgeAnnouncement/announcementActions';



export type HTMLForms = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type HandleInput = (e: ChangeEvent<HTMLForms>, radioValue?: string | number | boolean) => void;
export type HandleCalendar = (name: string, value: CalendarDatesType) => void;
export type handleFile = (files: Image[]) => void;

export const CreateEventContainer: React.FC = () => {

    const router = useRouter();
    const [formData, setFormData] = useState<AnnouncementCreateFormData>({
        category: null,
        event: null,
        city: '',
        shootingTime: '',
        eventDate: '',
        guests: 0,
        onlyNewlyweds: false,
        price: '',
        exactPrice: '',
        wishes: '',
        files: []

    });
    const [currentStep, setCurrentStep] = useState<Step>(state.provider);
    const eventTypes = useSelector(selectEventTypes);
    const categories = useSelector(selectCategories)
    const selectedCategory = useSelector(selectCategory)
    const announcementsOwn: AnnouncementResult[] = useSelector(selectAnnouncemntsOwn)
    const next = useSelector(selectNextCategory)
    const announcements: AnnouncementResult[] = useSelector(selectAnnouncements)
    const countAnnouncements: number = useSelector(selectCountAnnouncements)
    const user = useSelector(selectUser);
    const [valid, setValid] = useState<boolean>(true)
    const exactPrice = useSelector(selectExactPrice)

    console.log('formData', formData)
    const dispatch = useDispatch<AppDispatch>();

    const {
        id,
        first_name,
        last_name,
        email,
    } = user;

    const handleInputChange: HandleInput = (e, radioValue) => {
        const { name, value, type } = e.target;
        console.log('name, value, type', name, value, type, radioValue)


        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' || type === 'radio' ? radioValue : value,
        }));

        if (name === 'onlyNewlyweds' && radioValue) {
            setFormData(prev => ({ ...prev, guests: 0 }))
        }

    };

    const handleCityChange = (city: string) => {
        setFormData((prevData) => ({
            ...prevData,
            city
        }));
    }

    const handleCalendarChange: HandleCalendar = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleFileChange = async (files: Image[]) => {
        setFormData((prevData) => ({
            ...prevData,
            files: files
        }));

    }


    const handleStep = (page: keyof StatePage) => {
        setCurrentStep(state[page]);
    };

    const isImage = (obj: any): obj is Image => {
        return typeof obj === 'object' && 'file' in obj;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let token = localStorage.getItem(Token.Access);

        let images;
        const req: Image[] = []
        if (token) {
            const convert = formData.files.filter(file => isImage(file) && !file.file.startsWith('http'))
            const filter = formData.files.filter(file => isImage(file) && file.file.startsWith('http')) as Image[]
            if (convert.length) {
                images = await fetchImagesIdByString(convert.filter(isImage).map(file => file.file!), token);
            }
            req.push(...filter)
            if (Array.isArray(images) && images.length) {
                req.push(...images)
            }
        }

        const { photo } = user;
        const userPhoto: string = typeof photo === 'string' ? photo : 'default.jpg';

        const announcement: AnnouncementRequest = {
            owner: { id, photo: userPhoto, first_name, last_name, email, provider_types: [] },
            status: "OPEN",
            title: 'Title',
            cost: formData.price,
            exact_cost: formData.exactPrice || '0',
            description: formData.wishes,
            provider_category: formData.category!,
            event_type: formData.event!,
            view_count: 0,
            city: formData.city,
            duration: formData.shootingTime,
            event_date: formData.eventDate,
            files: req && Array.isArray(req) ? req.map(img => img.id) : [],
            is_only_newlyweds: formData.onlyNewlyweds,
            number_of_guests: formData.guests
        }
        dispatch(createAnnouncementWithThunk(announcement)).then(() => {
            router.push(`/${Paths.Common}${Paths.Announcement}`)
        })
    };

    useEffect(() => {
        if (!eventTypes.length) {
            dispatch(fetchEventTypesWithThunk());
        }
    }, [eventTypes]);

    useEffect(() => {
        if (user) {
            dispatch(fetchAnnouncementsWithThunk({ owner: user[UserField.Id] }));

        }
    }, [user]);



    useEffect(() => {
        const fetchData = async () => {
            if (next !== null) {
                await dispatch(fetchAllCategoriesWithThunk());
            }
        };
        fetchData();

        // return () => {
        //     dispatch(setSelectedCategory(null))
        // };
    }, [dispatch, next, valid]);


    const isValidExactPrice = exactPrice
        ? !isNaN(Number(exactPrice)) && parseInt(exactPrice, 10) >= 0
        : true


    return (
        <div>
            <div className={styles.wrapper}>
                <h2 className={styles.title}>{currentStep.title}</h2>
                <Form onSubmit={handleSubmit}>
                    {currentStep.page === 'provider' && (
                        <>
                            <CategoryPage
                                category={formData.category}
                                categories={categories}
                                handleInputChange={handleInputChange}

                            />
                            <FooterNav
                                isValid={!!formData.category}
                                firstPage
                                handlePrevStep={() => handleStep('provider')}
                                handleNextStep={() => handleStep('event')}
                            />
                        </>
                    )}

                    {currentStep.page === 'event' && (
                        <>
                            <EventPage
                                eventTypes={eventTypes}
                                handleInputChange={handleInputChange}
                                selectedEvent={formData.event} />
                            <FooterNav
                                isValid={!!formData.event}
                                handlePrevStep={() => handleStep('provider')}
                                handleNextStep={() => handleStep('location')}
                            />
                        </>
                    )}
                    {currentStep.page === 'location' && (
                        <>
                            <LocationPage
                                handleCityChange={handleCityChange}
                                handleInputChange={handleInputChange}
                                city={formData.city}
                                shootingTime={formData.shootingTime}
                            />
                            <FooterNav
                                isValid={!!formData.city && !!formData.shootingTime}
                                handlePrevStep={() => handleStep('event')}
                                handleNextStep={() => handleStep('guest')}
                            />
                        </>
                    )}
                    {currentStep.page === 'guest' && (
                        <>
                            <GuestDatePage
                                handleInputChange={handleInputChange}
                                handleCalendarChange={handleCalendarChange}
                                eventDate={formData.eventDate}
                                guests={formData.guests}
                                onlyNewlyweds={formData.onlyNewlyweds}
                            />
                            <FooterNav
                                isValid={!!formData.eventDate}
                                handlePrevStep={() => handleStep('location')}
                                handleNextStep={() => handleStep('price')}
                            />
                        </>
                    )}
                    {currentStep.page === 'price' && (
                        <>
                            {console.log('price', !!formData.price && isValidExactPrice)}
                            <PricePage
                                handleInputChange={handleInputChange}
                                selectedPrice={formData.price}
                            />
                            <FooterNav
                                isValid={!!formData.price && isValidExactPrice}
                                handlePrevStep={() => handleStep('guest')}
                                handleNextStep={() => handleStep('wishes')}
                            />
                        </>
                    )}
                    {currentStep.page === 'wishes' && (
                        <>
                            <WishesPage
                                handleFileChange={handleFileChange}
                                handleInputChange={handleInputChange}
                                selectedText={formData.wishes}
                                files={formData.files}
                            />
                            <FooterNav
                                lastPage
                                handlePrevStep={() => handleStep('price')}
                                handleNextStep={() => handleStep('wishes')}
                            />
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
};