import { Bag } from "../svgIcons/Bag"
import { Bell } from "../svgIcons/Bell"
import { Heart } from "../svgIcons/Heart"
import { Telegram } from "../svgIcons/Telegram"
import MessageIcon from '../../header/chat/MessageIcon'
import styles from './userControls.module.scss'
import { useSelector } from "react-redux"
import { selectIsAuth, selectRole } from "@/store/user/userSlice"
import Link from "next/link"
import { Paths, Role } from "@/constant"

export const UserControls = () => {
    const isAuth = useSelector(selectIsAuth);
    const role = useSelector(selectRole);

    
    return (
        <ul
            itemProp="about"
            itemScope
            itemType="http://schema.org/ItemList"
            className={styles.control_list}
        >
            {isAuth && role === Role.Bride && <li
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ItemList"
                className={styles.control_list_item}
            >
                <Link
                    href={`${Paths.AccBride}${Paths.AccWishlist}`}>
                    <Heart />
                </Link>
            </li>}
            {isAuth && <li
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ItemList"
                className={styles.control_list_item}

            >
                <MessageIcon />
            </li>}
            <li
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ItemList"
                className={styles.control_list_item}

            >
                <Bag />
            </li>
            <li
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ItemList"
                className={styles.control_list_item}

            >
                <Telegram />
            </li>
        </ul>
    )
}