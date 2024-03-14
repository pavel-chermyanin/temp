import { useSelector } from 'react-redux'
import { SortWrapper } from '../sortWrapper/SortWrapper'
import style from './style.module.scss'
import { selectTypeCard } from '@/store/bridgeAnnouncement/bridgeAnnouncementSlice'
import { AnnouncementAnswerList } from '../announcementAnswerList/AnnouncementAnswerList'
import { AnnouncementOfferList } from '../announcementOfferList/AnnouncementOfferList'

 const AnnouncementWrapper = () => {
    const typeCard = useSelector(selectTypeCard)
    return (
        <div className={style.contractorWrapper}>
            <SortWrapper />
            {
                typeCard === 'offer' && (
                    <AnnouncementOfferList />
                )
            }
            {
                typeCard === 'answer' && (
                    <AnnouncementAnswerList/>
                )
            }
        </div>
    )
}

export default AnnouncementWrapper