import { Form, Tab, Tabs } from "react-bootstrap"
import { BlockSort } from "../blockSort/BlockSort"
import { useSelector } from "react-redux"
import { selectSelectedCategory, selectTypeCard } from "@/store/bridgeAnnouncement/bridgeAnnouncementSlice"
import { AnnouncementAnswerList } from "../announcementAnswerList/AnnouncementAnswerList"
import { AnnouncementOfferList } from "../announcementOfferList/AnnouncementOfferList"
import { AnnouncementResult } from "@/types/announcement"
import { BusCategoryField } from "@/types/business"
import styles from './style.module.scss'


 const MobileWrapper = () => {
    const typeCard = useSelector(selectTypeCard)
    const selectedCategory: AnnouncementResult | null = useSelector(selectSelectedCategory)
    return (
        <div className={styles.switch_wrapper}>
            <div className={styles.tabs_wrapper}>
                <p>{selectedCategory?.provider_category[BusCategoryField.Title]}</p>
                <Form.Check
                    // className={style.sortForm_toggle}
                    type="switch"
                    id="custom-switch"
                    label="Получать отклики"
                />

            </div>
            <Tabs
                defaultActiveKey="profile"
                id="justify-tab-example"
                className="mb-3"
                justify
            >
                <Tab eventKey="profile" title="Объявление">
                   
                    <AnnouncementOfferList />
                </Tab>
                <Tab eventKey="home" title="Отклики">
                    <AnnouncementAnswerList />
                </Tab>
            </Tabs>
        </div>

    )
}

export default MobileWrapper


