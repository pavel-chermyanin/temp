import { Form } from "react-bootstrap";
import { HandleInput } from "../CreateEventContainer";
import styles from './style.module.scss'
import { AvailableProviders } from "../availableProviders/AvailableProviders";
import { ExactPrice } from "../exactPrice/ExactPrice";
import { useSelector } from "react-redux";
import { selectAvailableProviders, selectCategory, selectCountAvailableProviders } from "@/store/createAnnouncement/createAnnouncementSlice";
import { BusCategoryField } from "@/types/business";

interface PricePageProps {
    handleInputChange: HandleInput;
    selectedPrice: string;
}

type itemPrice = {
    title: string
    price: string
    text: string
}

const statePrice: itemPrice[] = [
    {
        title: 'Базовый',
        price: '1000',
        text: `Чаще всего это студенты старших курсов профильных вузов.
               Отсутствие опыта может компенсироваться глубокими знаниями.`
    },
    {
        title: 'Оптимальный',
        price: '1500',
        text: `Чаще всего это студенты старших курсов профильных вузов.
               Отсутствие опыта может компенсироваться глубокими знаниями.`
    },
    {
        title: 'Премиум',
        price: '3000',
        text: `Чаще всего это студенты старших курсов профильных вузов.
               Отсутствие опыта может компенсироваться глубокими знаниями.`
    },
]

export const PricePage = ({ handleInputChange, selectedPrice, }: PricePageProps) => {
    const providers = useSelector(selectAvailableProviders);
    const count = useSelector(selectCountAvailableProviders);
    const selectedCategory = useSelector(selectCategory)
    return (
        <div className={`${styles.grid}`}>
            <div className={styles.form}>
                {statePrice.map((item, id) => (
                    <Form.Group
                        controlId="guests"
                        key={`${item.title}-id`}
                        className={`${styles.item_group}`}
                    >
                        <Form.Check
                            className={`${styles.item_wrapper}`}
                            key={item.title}
                            type="radio"
                            name="price"
                            id={`price-${item.title}`}
                            checked={selectedPrice === item.price}
                            onChange={(e) => handleInputChange(e, item.price)} />
                        <Form.Label>
                            <span className={styles.span_title}>{item.title}</span>
                            <span className={styles.span_price}>{item.price}₽ в час</span>
                            <span className={styles.span_text}>{item.text}</span>
                        </Form.Label>
                    </Form.Group>
                ))}

            </div>
            <div className={styles.exact_price}>
            <AvailableProviders
                providers={providers}
                category={selectedCategory?.[BusCategoryField.Title]}
                count={count} />
                <ExactPrice handleInputChange={handleInputChange}/>
            </div>
        </div>
    );
};