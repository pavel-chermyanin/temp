import { Button, Offcanvas } from "react-bootstrap"
import styles from './blogOffCanvasSecondLevel.module.scss'
import { Category, CategoryField } from "@/types/category";
import { useRouter } from "next/router";
import { Paths } from "@/constant";
import { useState } from "react";
import { BlogOffCanvasThirdLevel } from "../blogOffCanvasThirdLevel/BlogOffCanvasThirdLevel";

type BlogOffCanvasSecondLevelProps = {
    setShow: (show: boolean) => void;
    handleBurgerClick: (show: boolean) => void;
    show: boolean
    firstLevel: Category | null
}

export const BlogOffCanvasSecondLevel = ({ show, setShow, handleBurgerClick, firstLevel }: BlogOffCanvasSecondLevelProps) => {
    const router = useRouter()
    const [secondLevel, setSecondLevel] = useState<Category | null>(null)
    const [showThirdLevel, setShowThirdLevel] = useState(false)

    const handleClose = () => {
        setShow(false)
        setSecondLevel(null)
    };

    const onSecondLevelClick = (cat: Category) => {
        setSecondLevel(cat)
        if (!cat[CategoryField.Children].length) {
            const path = [firstLevel?.[CategoryField.Slug], cat?.[CategoryField.Slug]].filter(Boolean).join('/');
            router.push(`${Paths.Blog}/${path}`);
            handleBurgerClick(false)
        } else {
            setShowThirdLevel(true)
        }
    }

    return (
        <Offcanvas show={show} onHide={handleClose} style={{ width: '100%', left: 0 }}>
            <Offcanvas.Header closeButton className={styles.header}>
                <Offcanvas.Title className={styles.title}>{firstLevel?.[CategoryField.Name]}</Offcanvas.Title>
            </Offcanvas.Header>

            {firstLevel?.[CategoryField.Children].map(cat => {
                return (
                    <Button
                        key={cat[CategoryField.Id]}
                        variant="link"
                        className={styles.catalog_drop_btn}
                        onClick={() => onSecondLevelClick(cat)}
                    >
                        <div className={styles.catalog_drop_wrapper}>
                            <p
                                className={styles.catalog_drop_item}>{cat[CategoryField.Name]}</p>
                            {cat[CategoryField.Children].length > 0 && <i className="fi-chevron-right"></i>}
                        </div>
                    </Button>


                )
            })

            }
            <BlogOffCanvasThirdLevel
                secondLevel={secondLevel}
                firstLevel={firstLevel}
                show={showThirdLevel}
                setShow={setShowThirdLevel}
                handleBurgerClick={handleBurgerClick} />
        </Offcanvas>
    )
}