import { Button } from 'react-bootstrap'
import styles from './style.module.scss'
import Link from 'next/link'
import { MouseEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Paths } from '@/constant';
import { useSelector } from 'react-redux';
import { AnnouncementResult } from '@/types/announcement';
import { selectAnnouncemntsOwn, selectCategory, selectExistsAnnouncement, setExistsAnnouncement } from '@/store/createAnnouncement/createAnnouncementSlice';
import { selectAnnouncements } from '@/store/bridgeAnnouncement/bridgeAnnouncementSlice';
import { BusCategoryField } from '@/types/business';




interface FooterNavProps {
    handlePrevStep?: MouseEventHandler<HTMLButtonElement>;
    handleNextStep?: MouseEventHandler<HTMLButtonElement>;
    firstPage?: boolean;
    lastPage?: boolean;
    isValid?: boolean;
    // getExistsAnnouncement?: () => AnnouncementResult | undefined
}

export const FooterNav = ({
    handlePrevStep,
    handleNextStep,
    firstPage = false,
    lastPage = false,
    isValid = true,
    // getExistsAnnouncement = undefined
}: FooterNavProps) => {
    

    const announcements: AnnouncementResult[] = useSelector(selectAnnouncements)

    const isExists = useSelector(selectExistsAnnouncement)
    // const announcements: AnnouncementResult[] = useSelector(selectAnnouncements)
    // const [disabledNext, setDisabledNext] = useState<boolean>(false);

    // useEffect(() => {

    //     if(selectedCategory) {
    //         announcements.forEach((announ) => {
    //             if(announ.provider_category[BusCategoryField.Id] === selectedCategory){
    //                 setDisabledNext(true)
    //             } else {
    //                 setDisabledNext(false)
    //             }
    //         })
    //     }
    // },[selectedCategory])

    return (

        <div className={styles.footer_nav}>
            {firstPage ? (
                <Link href={`/${Paths.Common}${Paths.Announcement}`}>Вернуться в каталог</Link>
            ) : (
                <Button
                    className={styles.btn_back}
                    variant="secondary"
                    onClick={handlePrevStep}
                >
                    Вернуться к прошлому шагу
                </Button>

            )}
            {
                !lastPage ? (
                    <Button
                        disabled={!isValid || announcements.length > 0}
                        variant="primary"
                        className={styles.btn_next}
                        onClick={handleNextStep}
                    >
                        <span>
                            {`Перейти к следующему шагу `}
                        </span>
                        <span className={styles.chevron}>
                            <i className="fi-chevron-right"></i>
                        </span>
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        type='submit'
                    >
                        {'Опубликовать заказ'}
                    </Button>

                )
            }
        </div>
    )
}