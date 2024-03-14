import { selectSelectedResponses } from "@/store/bridgeAnnouncement/bridgeAnnouncementSlice"
import { AnnouncementAnswerCard } from "../announcementAnswerCard/AnnouncementAnswerCard"
import styles from './style.module.scss'
import { AnnouncementResponseResult } from "@/types/businessAnnouncement"
import { useSelector } from "react-redux"

export const AnnouncementAnswerList = () => {
    const selectedResponses: AnnouncementResponseResult[] = useSelector(selectSelectedResponses)

    return (
        <div className={styles.list}>
            {selectedResponses.length
                ? selectedResponses.map(response => (
                    <AnnouncementAnswerCard response={response} key={response.id}/>
                ))
                : <p>Пока нет откликов</p>
            }

        </div>
    )
}