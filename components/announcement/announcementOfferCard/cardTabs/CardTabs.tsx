import { Col, Nav, Row, Tab } from "react-bootstrap"
import styles from './style.module.scss'
import { useState } from "react";

export const CardTabs = () => {
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
                    <p className={styles.text}>Здесь текст, который пишет исполнитель при отклике.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure
                        dolor in reprehenderit in voluptate velit esse cillum
                        dolore eu fugiat nulla.
                    </p>
                    <p className={styles.cost}>Предложенная стоимость — 10 000 ₽</p>
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