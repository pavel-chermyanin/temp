import styles from './style.module.scss'

export type DynamicPriceParagraphProps = {
    cost: string
}

const DynamicPriceParagraph = ({ cost }: DynamicPriceParagraphProps) => (
    <p className={styles.price}>{`от ${cost} ₽ в час`}</p>
);
export default DynamicPriceParagraph