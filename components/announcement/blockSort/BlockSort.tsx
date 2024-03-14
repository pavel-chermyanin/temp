import { useDispatch, useSelector } from 'react-redux'
import { SortForm } from '../sortForm/SortForm'
import style from './style.module.scss'
import { AppDispatch } from '@/store'
import { TypeCard, selectSelectedCategory, selectTypeCard, toggleTypeCard } from '@/store/bridgeAnnouncement/bridgeAnnouncementSlice'
import { Button } from 'react-bootstrap'
import { AnnouncementResult } from '@/types/announcement'

export const BlockSort = () => {
    const dispatch = useDispatch<AppDispatch>()
    const typeCard = useSelector(selectTypeCard)
    const category: AnnouncementResult | null = useSelector(selectSelectedCategory)

    const handleToggleTypeCard = (type: TypeCard) => {
        dispatch(toggleTypeCard(type))
    }

    if (!category) {
        return null
    }

    return (
        <div className={style.blockSort}>
            <h3 className={style.title}>{category.provider_category.title}</h3>
            <div className={style.info}>
                <Button
                    onClick={() => handleToggleTypeCard('offer')}
                    variant="light"
                    className={`
                    ${style.info_item}
                    ${typeCard === 'offer' ? style.selected : ''}
                    `}
                >
                    <span className={style.info_itemTitle}>Заказ</span>
                    <span className={style.info_itemValue}>{category.view_count} просмотров</span>
                </Button>
                <Button
                    onClick={() => handleToggleTypeCard('answer')}
                    variant="light"
                    className={`
                    ${style.info_item}
                    ${typeCard === 'answer' ? style.selected : ''}
                    `}
                >
                    <span className={style.info_itemTitle} >Отклики</span>
                    <span className={style.info_itemValue}>{category.response_count}</span>
                </Button>
            </div>
            <SortForm />
        </div>
    )
}