import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import styles from './style.module.scss'
import { Map, Placemark } from "@pbe/react-yandex-maps";
import { useDispatch, useSelector } from "react-redux";
import { selectGeolocation } from "@/store/user/userSlice";
import { DaDataValue } from "@/types/dadata";
import { HandleInput } from "../CreateEventContainer";
import { AvailableProviders } from "../availableProviders/AvailableProviders";
import { selectAvailableProviders, selectCategory, selectCountAvailableProviders } from "@/store/createAnnouncement/createAnnouncementSlice";
import { BusCategoryField } from "@/types/business";
import { AppDispatch, RootState } from "@/store";
import { fetchVenuesWithThunk } from "@/fsd/features/global/providers/fetchVenues";
import { fetchAddressWithThunk } from "@/fsd/features/global/location/fetchAddress";
import { fetchCityWithThunk } from "@/fsd/features/global/location/fetchCity";
import { fetchProvidersWithThunk } from "@/fsd/features/global/providers/fetchProviders";

const options = [
    { value: '12', label: '12 часов' },
    { value: '10', label: '10 часов' },
    { value: '5', label: '5 часов' },
];

interface CategoryPageProps {
    handleInputChange: HandleInput;
    city: string;
    shootingTime: string;
    handleCityChange: (str: string) => void
}

export const LocationPage = ({ handleInputChange, city, shootingTime, handleCityChange }: CategoryPageProps) => {
    const geolocation = useSelector(selectGeolocation);
    const providers = useSelector(selectAvailableProviders);
    const count = useSelector(selectCountAvailableProviders);
    const [cityState, setCity] = useState(city);
    const [position, setPosition] = useState({ lat: 55.7558, lng: 37.6176 }); // Moscow coordinates
    const [suggestions, setSuggestions] = useState<DaDataValue[] | undefined>();
    const [selectedOption, setSelectedOption] = useState(shootingTime);
    const selectedCategory = useSelector(selectCategory)
    const dispatch = useDispatch<AppDispatch>()
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [placemarkGeometry, setPlacemarkGeometry] = useState<[number, number]>([geolocation[0], geolocation[1]]);

    const [mapState, setMapState] = useState({
        center: geolocation,
        zoom: 9,
        controls: [],
    });


    useEffect(() => {
        setPosition({ lat: geolocation[0], lng: geolocation[1] });
    }, [])


    const handleMapClick = (e: any) => {
        // при клике внутри карты получаем широту и долготу
        const coords = e.get('coords') as [number, number];

        if (coords) {
            // обновляем стейт карты
            setMapState({
                ...mapState,
                center: [coords[0], coords[1]],
            })

            // делаем запрос на получение адреса по ширине и долготе
            dispatch(fetchCityWithThunk({ data: { lat: coords[0], lon: coords[1] } })).then(res => {
                const currentResult = res.payload.suggestions[0]
                // записываем в инпут
                setCity(currentResult.value)

                // меняем положение маркера
                setPlacemarkGeometry([currentResult.data.geo_lat, currentResult.data.geo_lon])
            })
        }
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
        handleInputChange(e);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const id = setTimeout(() => {
            if (selectedCategory && selectedCategory[BusCategoryField.Id] === 1) {
                dispatch(fetchVenuesWithThunk({ city: e.target.value.split(' ')[0] }));
            } else {
                // dispatch(fetchProvidersWithThunk({ city: e.target.value.split(' ')[0] }));
            }
            dispatch(fetchAddressWithThunk({ data: { query: e.target.value } })).then(res => {

                setSuggestions(res.payload.suggestions)
            })
        }, 500);

        setTimeoutId(id);
    };

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value);
        handleInputChange(e)
    };

    const onSugItemClick = (sug: any) => {
        // Обновляем широту и долготу в стейте карты
        setMapState({
            ...mapState,
            center: [sug.data.geo_lat, sug.data.geo_lon],
            zoom: 11
        })
        // делаем запрос на доступные площадки
        if (selectedCategory && selectedCategory[BusCategoryField.Id] === 1) {
            dispatch(fetchVenuesWithThunk({ city: sug.data.city }));
        }
        // чистим результаты
        setSuggestions([])
        // записываем значение в инпут
        setCity(sug.value)
        // записываем форму
        handleCityChange(sug.value)
        // меняем положение маркера
        setPlacemarkGeometry([sug.data.geo_lat, sug.data.geo_lon])

    }

    return (
        <div className={`${styles.location_wrapper}`}>
            <div className={styles.form}>
                <Form.Group controlId="cityInput">
                    <Form.Label>Адрес</Form.Label>
                    <Form.Control
                        type="text"
                        name="city"
                        value={cityState}
                        onChange={onInputChange}
                        placeholder="Город, улица и дом"
                    />
                </Form.Group>
                {suggestions && suggestions.length > 0 &&
                    (
                        <div className={styles.search_results}>
                            {suggestions.map((sug, i) => {
                                return (
                                    <p onClick={() => onSugItemClick(sug)} key={i}>{sug.value}</p>
                                )
                            })}
                        </div>
                    )}
                <Map
                    state={mapState}
                    onClick={handleMapClick}
                    width="100%"
                    height="254px"
                    defaultState={{ center: [position.lat, position.lng], zoom: 9 }}
                >

                    <Placemark geometry={placemarkGeometry} options={
                        {
                            preset: 'islands#dotIcon',
                            iconColor: '#fe7566',
                        }} />
                </Map>

                <Form.Group controlId={'timeVideo'} className={styles.select_group}>
                    <Form.Label>Продолжительность</Form.Label>
                    <Form.Select name="shootingTime" value={selectedOption} onChange={handleChange}>
                        <option value="">Выберите продолжительность</option>
                        {options.map((option, id) => (
                            <option key={`${option.value}-id`} value={(Number(option.value) * 3600)}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </div>
            <AvailableProviders
                providers={providers}
                category={selectedCategory?.[BusCategoryField.Title]}
                count={count} />

        </div>
    );
};
