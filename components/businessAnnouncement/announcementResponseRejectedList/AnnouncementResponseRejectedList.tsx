
import { useDispatch, useSelector } from "react-redux"
import { AnnouncementCard } from "../announcementCard/AnnouncementCard"
import styles from './style.module.scss'
import { TypeLayout, fetchAnnouncementResponsesWithThunk, selectBusinessAnnouncement, selectBusinessAnnouncementResponse, selectIsLoadingAnnouncement, selectNextAnnounResponse, selectNextAnnouncement, selectTypeLayout } from "@/store/businessAnnouncement/businessAnnouncementSlice"
import { AnnouncementResult } from "@/types/announcement"
import { Button } from "react-bootstrap"
import { AppDispatch } from "@/store"
import { AnnouncementResponseResult } from "@/types/businessAnnouncement"
import { fetchAnnouncementsWithThunk } from "@/store/bridgeAnnouncement/announcementActions"
import { useEffect } from "react"

export const AnnouncementResponseRejectedList = () => {
    const dispatch = useDispatch<AppDispatch>()
    const next = useSelector(selectNextAnnounResponse)
    const announcementResponses: AnnouncementResponseResult[] = useSelector(selectBusinessAnnouncementResponse)
    // const isLoading: boolean = useSelector(selectIsLoadingAnnouncement)
    const typeLayout: TypeLayout = useSelector(selectTypeLayout)

    const getNextAnnouncement = () => {
        if (next) {
            dispatch(fetchAnnouncementResponsesWithThunk({ next }))
        }
    }
    useEffect(() => {
        if (!announcementResponses?.length) {
            dispatch(fetchAnnouncementResponsesWithThunk({}))
        }
    }, [])

    const filteredAnnnouncements = announcementResponses.filter(announ => {
        return announ.status === 'DECLINED'
    })


    return (
        <div className={`
        ${styles.list}
        ${typeLayout === 'grid' ? styles.asGrid : ''}`}>
            {filteredAnnnouncements.length ? filteredAnnnouncements?.map(({ announcement, status }) => {
                return <AnnouncementCard announ={announcement} key={announcement.id} statusApproved={status} />
            }) : <p>Пока у вас нет откликов</p>}

            {/* {announcementResponses.length ? announcementResponses?.map(({ announcement, status }) => (
                <AnnouncementCard announ={announcement} key={announcement.id} statusApproved={status} />

            )) : (
                <p>У вас нет окликов</p>
            )}
            {next && <Button
                variant="primary"
                // className={`${style.button}`}
                onClick={getNextAnnouncement}
            >
                Показать еще
            </Button>} */}

        </div>
    )
}