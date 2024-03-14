import { selectAvailableProviders, selectCountAvailableProviders, selectSelectedCategory } from '@/store/bridgeAnnouncement/bridgeAnnouncementSlice'
import { AvailableProviders } from '../../createEvent/availableProviders/AvailableProviders'
import { AnnouncementOfferCard } from '../announcementOfferCard/AnnouncementOfferCard'
import style from './style.module.scss'
import { useSelector } from 'react-redux'
import { AnnouncementResult } from '@/types/announcement'
import { BusCategoryField } from '@/types/business'


export const AnnouncementOfferList = () => {
    const selectedCategory: AnnouncementResult | null = useSelector(selectSelectedCategory)
    const availableProviders = useSelector(selectAvailableProviders)
    const count = useSelector(selectCountAvailableProviders)


    if (!selectedCategory) {
        return <p>Пока у вас нет объявления.</p>
    }

    return (
        <div className={style.wrapper}>

            <div className={style.list}>
                <AnnouncementOfferCard item={selectedCategory} />

                <AvailableProviders
                    pricePage="pricePage"
                    providers={availableProviders}
                    category={selectedCategory.provider_category[BusCategoryField.Title]}
                    count={count}
                />
            </div>

        </div>
    )
}