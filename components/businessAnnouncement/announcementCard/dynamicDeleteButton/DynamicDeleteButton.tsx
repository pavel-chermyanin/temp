import styles from './style.module.scss'

type DynamicDeleteButton = {
    insideCard?: string
    onClickDelete?: () => void
}

const DynamicDeleteButton = ({ insideCard = '', onClickDelete }: DynamicDeleteButton) => (
    <button
        onClick={(e) => {
            e.preventDefault()
            onClickDelete && onClickDelete()
        }}
        className={`${styles.delete} ${insideCard ? styles.insideCard : ''}`}>✖</button>
);

export default DynamicDeleteButton