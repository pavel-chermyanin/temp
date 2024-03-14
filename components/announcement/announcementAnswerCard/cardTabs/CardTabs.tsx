import { Col, Nav, Row, Tab } from "react-bootstrap"
import styles from './style.module.scss'
import { useState } from "react";
import { AnnouncementResponseResult } from "@/types/businessAnnouncement";
import { BusinessField } from "@/types/business";
import { getMoneyString } from "@/fsd/shared/lib/format/nounFormatter";
// import { getMoneyString } from "@/fsd/shared/lib/format/formatStringDate";

export const CardTabs = ({ response }: { response: AnnouncementResponseResult }) => {
    const [activeKey, setActiveKey] = useState<string>("first"); // Provide a default value

    const handleSelect = (key: string | null) => {
        if (key) {
            setActiveKey(key);
        }
    };
    return (
        <Tab.Container activeKey={activeKey} onSelect={handleSelect}>
            <Nav variant="pills" className={styles.tabs}>
                <Nav.Item>
                    <Nav.Link
                        eventKey="first"
                        className={`
                            ${styles.customTab}
                            ${activeKey === "first" ? styles.customActiveTab : ''}
                        `}>
                        О себе
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        eventKey="second"
                        className={`
                            ${styles.customTab}
                             ${activeKey === "second" ? styles.customActiveTab : ''}
                        `}>
                        Портфолио
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        eventKey="third"
                        className={`
                            ${styles.customTab}
                            ${activeKey === "third" ? styles.customActiveTab : ''}
                         `}>
                        Отзывы 21
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="first">
                    <p className={styles.text}>{response.provider[BusinessField.Description]}</p>
                    <p className={styles.cost}>
                        Предложенная стоимость —
                        {` ${getMoneyString(+response.message)} ${response.payment_type === 'PER_HOUR' ? 'в час' : 'за всю услугу'}`}
                    </p>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                    <p>Фотографии</p>
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                    <p>Список отзывов</p>
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    )
}