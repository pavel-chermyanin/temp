
import { useDispatch, useSelector } from "react-redux"
import { AnnouncementCard } from "../announcementCard/AnnouncementCard"
import styles from './style.module.scss'
import { TypeLayout, fetchAnnouncementResponsesWithThunk, selectBusinessAnnouncement, selectBusinessAnnouncementResponse, selectIsLoadingAnnouncement, selectNextAnnounResponse, selectNextAnnouncement, selectTypeLayout } from "@/store/businessAnnouncement/businessAnnouncementSlice"
import { AnnouncementResult } from "@/types/announcement"
import { Button } from "react-bootstrap"
import { AppDispatch } from "@/store"
import { AnnouncementResponseResult } from "@/types/businessAnnouncement"
import { fetchAnnouncementsWithThunk } from "@/store/bridgeAnnouncement/announcementActions"
import { useEffect, useState } from "react"

export const AnnouncementResponseList = () => {
    const dispatch = useDispatch<AppDispatch>()
    const next = useSelector(selectNextAnnounResponse)
    const announcementResponses: AnnouncementResponseResult[] = useSelector(selectBusinessAnnouncementResponse)
    // const isLoading: boolean = useSelector(selectIsLoadingAnnouncement)
    const typeLayout: TypeLayout = useSelector(selectTypeLayout)
    const [filteredAnnoun, setFilteredAnnoun] = useState<AnnouncementResponseResult[]>([])

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

    useEffect(() => {
        const filteredAnnnouncements = announcementResponses.filter(announ => {
            return announ.status !== 'DECLINED'
        })
        setFilteredAnnoun(filteredAnnnouncements)
    }, [announcementResponses])


    return (
        <div className={`
        ${styles.list}
        ${typeLayout === 'grid' ? styles.asGrid : ''}`}>
            {filteredAnnoun.length ? filteredAnnoun?.map(({ announcement, status,id }) => {
                return <AnnouncementCard announId={id} announ={announcement} key={announcement.id} statusApproved={status} />
            }) : <p>Пока у вас нет откликов</p>}

            {next && <Button
                variant="primary"
                // className={`${style.button}`}
                onClick={getNextAnnouncement}
            >
                Показать еще
            </Button>}

        </div>
    )
}