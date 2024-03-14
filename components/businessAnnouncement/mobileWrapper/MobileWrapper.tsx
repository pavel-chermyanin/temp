import { Tab, Tabs } from "react-bootstrap"
import { useSelector } from "react-redux"
import { selectTypeCard } from "@/store/bridgeAnnouncement/bridgeAnnouncementSlice"
import { SortForm } from "../sortForm/SortForm"
import { AnnouncementList } from "../announcementList/AnnouncementList"
import { TypeCardBusiness, selectTypeCardBusiness } from "@/store/businessAnnouncement/businessAnnouncementSlice"
import { AnnouncementResponseList } from "../announcementResponseList/AnnouncementResponseList"
import { AnnouncementResponseRejectedList } from "../announcementResponseRejectedList/AnnouncementResponseRejectedList"
import styles from './mobileWrapper.module.scss'


 const MobileWrapper = () => {
    const typeCard = useSelector(selectTypeCard)
    const typeCardBusiness: TypeCardBusiness = useSelector(selectTypeCardBusiness)
    return (
        <Tabs
            defaultActiveKey="profile"
            id="justify-tab-example"
            className={`mb-3 ${styles.tabs}`}
            justify
        >
            <Tab eventKey="home" title="Фильтры">
                <SortForm mobileForm={'mobileForm'}/>
            </Tab>
            <Tab eventKey="profile" title="Объявления">
                {typeCardBusiness === 'topic' && (
                    <AnnouncementList />
                )}
                {typeCardBusiness === 'response' && (
                    <AnnouncementResponseList />
                )}
                {typeCardBusiness === 'rejected' && (
                    <AnnouncementResponseRejectedList />
                )}
            </Tab>
        </Tabs>
    )
}
export default MobileWrapper


