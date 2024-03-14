import { useSelector } from 'react-redux';
import styles from './authControls.module.scss'
import { selectIsAuth, selectRole, selectUser } from '@/store/user/userSlice';
import { Button } from 'react-bootstrap';
import { Paths, Role } from '@/constant';
import Image from 'next/image';
import { UserField } from '@/types/user';
import Link from 'next/link';

export const AuthControls = () => {
    const user = useSelector(selectUser);
    const role = useSelector(selectRole);
    const isAuth = useSelector(selectIsAuth);
    return (
        <div className={styles.auth_controls}>
            {isAuth && (
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
                            width={40}
                            height={40}
                            alt="avatar"
                            loading="lazy"
                        />
                        :
                        <Image
                            className={styles.avatar__image}
                            src={'/img/image.png'}
                            width={40}
                            height={40}
                            alt="avatar"
                            loading="lazy"
                        />
                    }
                </Button>
            )}
            {!isAuth && (
                <>
                    <Link
                        href={Paths.SignIn}
                    >Регистрация
                    </Link>
                </>
            )}
        </div>
    )
}