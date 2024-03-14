import styles from './header.module.scss'
import Logo from './logo/Logo'
import { CityDropDown } from './cityDropDown/CityDropDown'
import { DesctopNav } from './desctopNav/DesctopNav'
import { SearchInput } from './search/SearchInput'
import { UserControls } from './userControls/UserControls'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store'
import { useEffect, useRef, useState } from 'react'
import { Paths, Role, Token } from '@/constant'
import { fetchUserDataWithThunk, selectGeolocation, selectIsAuth, selectRole, selectUser, setGeolocation, setUserCity } from '@/store/user/userSlice'
import { fetchCategoriesWithThunk } from '@/store/blog/blogSlice'
import { AuthControls } from './authControls/AuthControls'
import { fetchCityWithThunk } from '@/fsd/features/global/location/fetchCity'
import { Button, Container, Offcanvas } from 'react-bootstrap'
import { Search } from './svgIcons/Search'
import { Burger } from './svgIcons/Burger'
import Image from 'next/image'
import { UserField } from '@/types/user'
import Link from 'next/link'
import { MobileNav } from './mobileNav/MobileNav'
import { useRouter } from 'next/router'

const Header = () => {
    const [lat, setLat] = useState<number>(0);
    const [lng, setLng] = useState<number>(0);
    const [isSearchInputVisible, setSearchInputVisible] = useState<boolean>(false);
    const geolocation = useSelector(selectGeolocation)
    const dispatch = useDispatch<AppDispatch>();
    const [showMenu, setShowMenu] = useState(false);
    const user = useSelector(selectUser);
    const isAuth = useSelector(selectIsAuth);
    const role = useSelector(selectRole);
    const router = useRouter();




    const handleLoginClick = () => {
        handleClose();
        router.push(Paths.SignIn);
    };

    const handleBurgerClick = () => {
        setShowMenu(!showMenu);
    };

    const handleClose = () => {
        setShowMenu(false);
    };

    const handleSearchClick = () => {
        setSearchInputVisible(true);
    };

    const handleSearchInputBlur = () => {
        setSearchInputVisible(false);
    };
    useEffect(() => {
        if (localStorage.getItem(Token.Access)) {
            dispatch(fetchUserDataWithThunk());
        }
    }, []);

    useEffect(() => {
        dispatch(fetchCategoriesWithThunk());
    }, []);

    useEffect(() => {
        // if(geolocation.length) return
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
                if (res.payload && res.payload.suggestions[0]) {
                    let fetchedCity = res.payload?.suggestions[0]?.data?.city;
                    dispatch(setUserCity(fetchedCity));
                }
            })
        }
    }, [lat, lng]);


    const isLkPage = router.pathname.includes('lk')
        && !router.pathname.includes('lk/business')
        && !router.pathname.includes('lk/bride')

    const lkStyleHeader = isLkPage
        ? {
            maxWidth: 1920,
        }
        : {};

    const isWeddingSites = router.pathname.includes('lk/common/site')
    if(isWeddingSites) {
        lkStyleHeader.maxWidth = 1500
    }
    return (
        <header
            id="header"
            itemScope
            itemType="http://schema.org/WPHeader"
            itemID="/#header"
            className={styles.header}>
            <Container style={lkStyleHeader}>
                <div className={styles.header_inner}>

                    <div className={styles.burger_wrapper} onClick={handleBurgerClick}>
                        <Burger />
                    </div>
                    <div className={styles.logo_wrapper}>
                        <Logo />
                    </div>
                    <CityDropDown setLat={setLat} setLng={setLng} />
                    {!isSearchInputVisible && <DesctopNav />}
                    <div className={styles.desctop_search}>
                        <SearchInput setInputCity={() => { }} />
                    </div>
                    <div className={`${styles.searchContainer} ${isSearchInputVisible ? styles.widthFull : ''}`} onBlur={handleSearchInputBlur}>
                        {/* Показывать SearchInput только если isSearchInputVisible true */}
                        {isSearchInputVisible && (
                            <SearchInput setInputCity={() => { }} />
                        )}
                        {/* Кнопка поиска, при клике на которую появляется SearchInput */}
                        {!isSearchInputVisible && (
                            <button onClick={handleSearchClick} className={styles.search_btn}>
                                <Search />
                            </button>
                        )}
                    </div>
                    <UserControls />
                    <AuthControls />
                </div>

                {/* Offcanvas для бургер-меню */}
                <Offcanvas className={styles.off_canvas} show={showMenu} onHide={handleClose} placement="start">
                    <Offcanvas.Header className={styles.header}>
                        {isAuth && (
                            <div className={styles.header_auth}>

                                <div className={styles.auth_controls}>

                                    <Button
                                        // @ts-ignore: bootstrap bag*
                                        as={Link}
                                        variant='link'
                                        href={role === Role.Bride ? Paths.AccBride : Paths.AccBusiness}
                                        className={styles.ava_btn}
                                        itemProp="url"
                                    >
                                        {typeof user[UserField.Photo] !== 'number' &&
                                            user[UserField.Photo]?.file
                                            ?
                                            <Image
                                                className={styles.avatar__image}
                                                src={user[UserField.Photo].file}
                                                width={30}
                                                height={30}
                                                alt="avatar"
                                                loading="lazy"
                                            />
                                            :
                                            <Image
                                                className={styles.avatar__image}
                                                src={'/img/image.png'}
                                                width={30}
                                                height={30}
                                                alt="avatar"
                                                loading="lazy"
                                            />
                                        }
                                    </Button>
                                </div>
                                <Offcanvas.Title className={styles.name}>{user[UserField.FirstName]}</Offcanvas.Title>
                            </div>
                        )}
                        {!isAuth && (
                            <Offcanvas.Title className={styles.login_btn}>
                                <Button variant='link' onClick={handleLoginClick}>Вход / Регистрация</Button>
                            </Offcanvas.Title>
                        )}
                    </Offcanvas.Header>
                    <Offcanvas.Body style={{ padding: 0 }}>
                        <div className={styles.body}>
                            <MobileNav handleBurgerClick={handleBurgerClick} />
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </Container >
        </header>
    )
}

export default Header