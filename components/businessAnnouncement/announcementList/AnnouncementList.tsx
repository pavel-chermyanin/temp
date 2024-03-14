import { useDispatch, useSelector } from "react-redux"
import { AnnouncementCard } from "../announcementCard/AnnouncementCard"
import styles from './style.module.scss'
import { TypeLayout, selectBusinessAnnouncement, selectIsLoadingAnnouncement, selectNextAnnouncement, selectTypeCardBusiness, selectTypeLayout } from "@/store/businessAnnouncement/businessAnnouncementSlice"
import { AnnouncementResult } from "@/types/announcement"
import { Button, Spinner } from "react-bootstrap"
import { AppDispatch } from "@/store"
import { fetchAnnouncementsWithThunk } from "@/store/bridgeAnnouncement/announcementActions"
import { useEffect } from "react"
import { selectProviderMe } from "@/store/user/userSlice"
import { Business, BusinessField } from "@/types/business"
import { selectLoadingAnnouncements } from "@/store/bridgeAnnouncement/bridgeAnnouncementSlice"

export const AnnouncementList = () => {
    const dispatch = useDispatch<AppDispatch>()
    const next = useSelector(selectNextAnnouncement)
    const provider: Business | null = useSelector(selectProviderMe)
    const announcements: AnnouncementResult[] = useSelector(selectBusinessAnnouncement)
    const isLoadingAnnouncements = useSelector(selectLoadingAnnouncements)

    const isLoading: boolean = useSelector(selectIsLoadingAnnouncement)
    const typeLayout: TypeLayout = useSelector(selectTypeLayout)

    const getNextAnnouncement = () => {
        if (next) {
            dispatch(fetchAnnouncementsWithThunk({ next }))
        }
    }

    if(isLoadingAnnouncements) {
        return <Spinner/>
    }

    if(!announcements.length) {
        return <p>Пока нет объявлений</p>
    }

    return (
        <div className={`
        ${styles.list}
        ${typeLayout === 'grid' ? styles.asGrid : ''}`}>
            {announcements.map(announ => (
                <AnnouncementCard announ={announ} key={announ.id}/>

            ))}
            {next && <Button
                variant="primary"
                onClick={getNextAnnouncement}
            >
                Показать еще
            </Button>}

        </div>
    )
}