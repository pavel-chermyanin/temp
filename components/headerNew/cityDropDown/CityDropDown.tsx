import { Button, CloseButton, Container, Dropdown, Spinner } from "react-bootstrap";
import { Location } from "../svgIcons/Location";
import styles from './city.module.scss'
import { SearchInput } from "../search/SearchInput";
import { City, popularCities } from "./popularCities";
import { useDispatch, useSelector } from "react-redux";
import { selectCity } from "@/store/user/userSlice";
import { useEffect, useRef, useState } from "react";
import { AppDispatch } from "@/store";
import { fetchAddressWithThunk } from "@/fsd/features/global/location/fetchAddress";
import { DaDataValue } from "@/types/dadata";

type CityDropDownProps = {
    setLat: (num: number) => void
    setLng: (num: number) => void
}

export const CityDropDown = ({ setLng, setLat }: CityDropDownProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const city = useSelector(selectCity)
    const [inputCity, setInputCity] = useState('')
    const [suggestedCities, setSuggestedCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCityDrop, setShowCityDrop] = useState(false)
    const cityMenuRef = useRef<HTMLDivElement>(null);


    const onPopularCityClick = (city: City) => {
        if (city.lon && city.lat) {
            setLng(city.lon)
            setLat(city.lat)
        }
        setInputCity('')
        setShowCityDrop(false)
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




    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cityMenuRef.current && !cityMenuRef.current.contains(event.target as Node)) {
                setShowCityDrop(false);
                setInputCity('')
            }

        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [cityMenuRef]);
    return (
        <div className={styles.city_wrapper}>

            <Button variant="link" onClick={(e) => {
                e.stopPropagation()
                setShowCityDrop(prev => !prev)
            }} className={`${styles.drop_btn} ${showCityDrop ? styles.selectBtn : ''}`}>
                <Location />
                <span className={`${styles.drop_item} ${showCityDrop ? styles.select : ''}`} >{city}</span>
            </Button>
            {showCityDrop && (
                <div ref={cityMenuRef} className={styles.drop_item__providers}>
                    <Container>
                        <h3 className={styles.drop_title}>
                            <span>Выберите свой город</span>
                            <CloseButton onClick={() => setShowCityDrop(false)}/>
                        </h3>
                        <div className={styles.search_wrapper}>
                            <SearchInput setInputCity={setInputCity} placeholder='Поиск по городам'/>
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

                    </Container>
                </div>
            )}
        </div>
    );
}