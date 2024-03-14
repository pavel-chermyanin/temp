import { Button, Offcanvas } from "react-bootstrap"
import styles from './blogOffCanvas.module.scss'
import { useSelector } from "react-redux";
import { selectCategories } from "@/store/blog/blogSlice";
import { BusCategoryField } from "@/types/business";
import { Category, CategoryField } from "@/types/category";
import { useState } from "react";
import { BlogOffCanvasSecondLevel } from "./blogOffCanvasSecondLevel/BlogOffCanvasSecondLevel";

type BlogOffCanvasProps = {
    setShow: (show: boolean) => void;
    handleBurgerClick: (show: boolean) => void;
    show: boolean
}

export const BlogOffCanvas = ({ show, setShow, handleBurgerClick }: BlogOffCanvasProps) => {
    const blogCategories = useSelector(selectCategories);
    const [firstLevel, setFirstLevel] = useState<Category | null>(null)
    const [showSecondLevel, setShowSecondLevel] = useState(false)

    const handleClose = () => {
        setShow(false)
    };

    const onFirstLevelClick = (cat: Category) => {
        setFirstLevel(cat)
        setShowSecondLevel(true)
    }

    return (
        <Offcanvas show={show} onHide={handleClose} style={{ width: '100%', left: 0 }}>
            <Offcanvas.Header closeButton className={styles.header}>
                <Offcanvas.Title className={styles.title}>Идеи и советы</Offcanvas.Title>
            </Offcanvas.Header>

            {blogCategories.map(cat => {
                return (
                    <Button
                        key={cat[CategoryField.Id]}
                        variant="link"
                        className={styles.catalog_drop_btn}
                        onClick={() => onFirstLevelClick(cat)}
                    >
                        <div className={styles.catalog_drop_wrapper}>
                            <p
                                className={styles.catalog_drop_item}>{cat[CategoryField.Name]}</p>
                            <i className="fi-chevron-right"></i>

                        </div>
                    </Button>

                )
            })

            }
            <BlogOffCanvasSecondLevel
                firstLevel={firstLevel}
                show={showSecondLevel}
                setShow={setShowSecondLevel}
                handleBurgerClick={handleBurgerClick} />
        </Offcanvas>
    )
}