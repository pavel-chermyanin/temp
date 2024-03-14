import Link from 'next/link'
import styles from './mobile.module.scss'
import { Bag } from '../svgIcons/Bag'
import { Sites } from '../svgIcons/Sites'
import { Invitation } from '../svgIcons/Invitation'
import { Book } from '../svgIcons/Book'
import { useDispatch, useSelector } from 'react-redux'
import { selectCity, selectGeolocation, selectIsAuth, selectUser, setGeolocation, setUserCity } from '@/store/user/userSlice'
import { Exit } from '../svgIcons/Exit'
import { UserField } from '@/types/user'
import Logo from '../logo/Logo'
import { useEffect, useState } from 'react'
import { ExitModal } from './exitModal/ExitModal'
import { Button } from 'react-bootstrap'
import { Location } from '../svgIcons/Location'
import { fetchCityWithThunk } from '@/fsd/features/global/location/fetchCity'
import { AppDispatch } from '@/store'
import { CatalogOffCanvas } from './catalogOffCanvas/CatalogOffCanvas'
import { BlogOffCanvas } from './blogOffCanvas/BlogOffCanvas'
import { CityOffCanvas } from './cityOffCanvas/CityOffCanvas'
import { Home } from '../svgIcons/Home'

type MobileNavProps = {
    handleBurgerClick: (bool: boolean) => void
}

export const MobileNav = ({ handleBurgerClick }: MobileNavProps) => {
    const [lat, setLat] = useState<number>(0);
    const [lng, setLng] = useState<number>(0);
    const dispatch = useDispatch<AppDispatch>();
    const geolocation = useSelector(selectGeolocation)
    const city = useSelector(selectCity)
    const user = useSelector(selectUser);
    const isAuth = useSelector(selectIsAuth);
    const [showExitModal, setShowExitModal] = useState(false);
    const [showCatalogOffcanvas, setShowCatalogOffcanvas] = useState(false);
    const [showBlogOffcanvas, setShowBlogOffcanvas] = useState(false);
    const [showCityOffcanvas, setShowCityOffcanvas] = useState(false);

    const handleExitClick = () => {
        setShowExitModal(true);
    };

    const handleCloseExitModal = () => {
        setShowExitModal(false);
    };

    useEffect(() => {
        if(geolocation.length) return
        const geo = navigator.geolocation;
        geo.getCurrentPosition((position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
        });
    }, []);

    useEffect(() => {
        // апдейт координат в сторе
        if (lat && lng) {
            dispatch(setGeolocation([lat, lng]));
        }

        if (lat && lng) {
            dispatch(fetchCityWithThunk({ data: { lat, lon: lng } })).then(res => {
                let fetchedCity = res.payload?.suggestions[0]?.data?.city;
                dispatch(setUserCity(fetchedCity));
            })
        }
    }, [lat, lng]);

    return (
        <>
            <nav
                id="headerNavAuth"
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
                itemID="/#headerNavAuth"
                className={styles.mobile_nav}
            >
                <ul
                    itemProp="about"
                    itemScope
                    itemType="http://schema.org/ItemList"
                    className={styles.mobile_list}
                >
                    <li
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ItemList"
                    >
                        <Link
                            className={`${styles.drop_item}`}
                            href={`/`}
                            itemProp="url"
                        >
                            <Home />
                            <span itemProp="name">Главная</span>
                        </Link>
                    </li>
                    <li
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ItemList"
                    >
                        <Button
                            variant='link'
                            className={`${styles.drop_item}`}
                            onClick={() => setShowCatalogOffcanvas(true)}
                            itemProp="url"
                        >
                            <Bag />
                            <span itemProp="name">Каталог</span>
                        </Button>
                    </li>
                    <li
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ItemList"
                    >
                        <Link
                            className={`${styles.drop_item}`}
                            href={`/lk/common/site `}
                            itemProp="url"
                        >
                            <Sites />
                            <span itemProp="name">Сайты</span>
                        </Link>
                    </li>
                    <li
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ItemList"
                    >
                        <Link
                            className={`${styles.drop_item}`}
                            href={`/lk/common/invitation `}
                            itemProp="url"
                        >
                            <Invitation />
                            <span itemProp="name">Приглашения</span>
                        </Link>
                    </li>
                    <li
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ItemList"
                    >
                        <Button
                            variant='link'
                            className={`${styles.drop_item}`}
                            onClick={() => setShowBlogOffcanvas(true)}
                            itemProp="url"
                        >
                            <Book />
                            <span itemProp="name">Идеи и советы</span>
                        </Button>
                    </li>
                </ul>


            </nav>

            <div className={styles.footer}>
                {isAuth && (
                    <div className={styles.exit_wrapper} onClick={handleExitClick}>
                        <Exit />
                        <span>Выйти</span>
                    </div>
                )}

                <ExitModal show={showExitModal} setShow={handleCloseExitModal} />

                <div className={styles.footer_bottom}>
                    {isAuth && (
                        <div className={styles.footer_bottom_userdata}>
                            {user[UserField.Phone] && <span className={styles.phone}>{user[UserField.Phone]}</span>}
                            <span className={styles.email}>{user[UserField.Email]}</span>
                        </div>
                    )}

                    <div className={styles.logo_wrapper}>
                        <div className={styles.logo}>
                            <Logo />

                        </div>
                        <Button variant="link" onClick={() => {

                        }} className={styles.drop_btn}>
                            <div className={styles.city_wrapper}
                                onClick={() => setShowCityOffcanvas(true)}>
                                <Location />
                                <span className={''} >{city}</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            <CatalogOffCanvas
                show={showCatalogOffcanvas}
                setShow={setShowCatalogOffcanvas}
                handleBurgerClick={handleBurgerClick} />

            <BlogOffCanvas
                show={showBlogOffcanvas}
                setShow={setShowBlogOffcanvas}
                handleBurgerClick={handleBurgerClick} />

            <CityOffCanvas
                setLat={setLat}
                setLng={setLng}
                show={showCityOffcanvas}
                setShow={setShowCityOffcanvas}
                handleBurgerClick={handleBurgerClick} />
        </>

    )
}