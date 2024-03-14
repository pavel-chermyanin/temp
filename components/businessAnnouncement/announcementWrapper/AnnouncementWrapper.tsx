import { AnnouncementList } from "../announcementList/AnnouncementList"
import { SortForm } from "../sortForm/SortForm"
import styles from './style.module.scss'
import { TypeCardBusiness, selectTypeCardBusiness } from "@/store/businessAnnouncement/businessAnnouncementSlice";
import { useSelector } from "react-redux";
import { AnnouncementResponseList } from "../announcementResponseList/AnnouncementResponseList";
import { AnnouncementResponseRejectedList } from "../announcementResponseRejectedList/AnnouncementResponseRejectedList";
import { MyForm } from "../sortForm/test2/Provider";

const AnnouncementWrapper = () => {
    const typeCardBusiness: TypeCardBusiness = useSelector(selectTypeCardBusiness)

    return (
        <>
            <div className={styles.announcement_wrapper}>
                <SortForm />
                {/* <MyForm/> */}

                {typeCardBusiness === 'topic' && (
                    <AnnouncementList />
                )}
                {typeCardBusiness === 'response' && (
                    <AnnouncementResponseList />
                )}
                {typeCardBusiness === 'rejected' && (
                    <AnnouncementResponseRejectedList />
                )}
            </div>
        </>
    )
}

export default AnnouncementWrapper