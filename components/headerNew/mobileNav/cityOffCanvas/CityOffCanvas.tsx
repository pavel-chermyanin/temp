import { Offcanvas, Spinner } from 'react-bootstrap'
import styles from './cityOffCanvas.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { selectCity } from '@/store/user/userSlice';
import { Location } from '../../svgIcons/Location';
import { useEffect, useState } from 'react';
import { City, popularCities } from '../../cityDropDown/popularCities';
import { DaDataValue } from '@/types/dadata';
import { fetchAddressWithThunk } from '@/fsd/features/global/location/fetchAddress';
import { SearchInput } from '../../search/SearchInput';

type CityOffCanvasProps = {
    setShow: (show: boolean) => void;
    handleBurgerClick: (show: boolean) => void;
    show: boolean
    setLat: (num: number) => void
    setLng: (num: number) => void
}

export const CityOffCanvas = ({ show, setShow, handleBurgerClick, setLat, setLng }: CityOffCanvasProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const city = useSelector(selectCity)
    const [inputCity, setInputCity] = useState('')
    const [suggestedCities, setSuggestedCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);

    const onPopularCityClick = (city: City) => {
        if (city.lon && city.lat) {
            setLng(city.lon)
            setLat(city.lat)
        }
        handleBurgerClick(false)
    }

    function renderClues(suggestions: DaDataValue[]) {
        const citiesArray: City[] = suggestions.reduce((acc: City[], suggestion) => {
            if (suggestion.data.city) {
                const city: City = {
                    name: suggestion.data.city,
                    lat: suggestion.data.geo_lat !== null ? +suggestion.data.geo_lat : null,
                    lon: suggestion.data.geo_lon !== null ? +suggestion.data.geo_lon : null,
                };

                // Проверяем наличие города в аккумуляторе
                const isCityExist = acc.some((existingCity) => existingCity.name === city.name);

                // Если города нет в аккумуляторе, добавляем его
                if (!isCityExist) {
                    acc.push(city);
                }
            }

            return acc;
        }, []);

        return citiesArray;
    }

    const handleClose = () => {
        setShow(false)
    };

    useEffect(() => {
        if (inputCity) {
            setLoading(true);
            dispatch(fetchAddressWithThunk({ data: { query: inputCity } })).then(res => {
                const cities = renderClues(res.payload.suggestions)
                setSuggestedCities(cities);
                setLoading(false);

            })
        } else {
            setSuggestedCities([])
        }


    }, [inputCity])
    return (
        <Offcanvas show={show} onHide={handleClose} style={{ width: '100%', left: 0 }}>
            <Offcanvas.Header closeButton className={styles.header}>
                <Offcanvas.Title className={styles.title}>
                    <span><Location /></span>
                    <span> {city}</span>

                </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body className={styles.body}>

                <h3 className={styles.drop_title}>
                    Выберите свой город
                </h3>

                <div className={styles.search_wrapper}>
                    <SearchInput setInputCity={setInputCity} />
                    {loading && <Spinner animation="border" variant="primary" style={{ margin: 10 }} />}
                    {suggestedCities.length > 0 && !loading && (
                        <div className={styles.suggestedCities}>
                            {suggestedCities.map(city => (
                                <p key={city.name} onClick={() => onPopularCityClick(city)}>{city.name}</p>
                            ))}
                        </div>
                    )}

                </div>
                <p className={styles.popular_cities}>Популярные города:</p>
                <div className={styles.cities}>
                    {popularCities.map(city => {

                        return (
                            <p key={city.name} onClick={() => onPopularCityClick(city)}>{city.name}</p>
                        )
                    })}
                </div>
            </Offcanvas.Body>

        </Offcanvas>
    )
}