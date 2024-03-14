import { Button, Offcanvas } from "react-bootstrap"
import styles from './blogOffCanvasThirdLevel.module.scss'
import { Category, CategoryField } from "@/types/category";
import { useRouter } from "next/router";
import { Paths } from "@/constant";
import { useState } from "react";

type BlogOffCanvasThirdLevelProps = {
    setShow: (show: boolean) => void;
    handleBurgerClick: (show: boolean) => void;
    show: boolean
    firstLevel: Category | null
    secondLevel: Category | null
}

export const BlogOffCanvasThirdLevel = ({ show, setShow, handleBurgerClick, firstLevel, secondLevel }: BlogOffCanvasThirdLevelProps) => {
    const router = useRouter()
    const [thirdLevel, setThirdLevel] = useState<Category | null>(null)

    const handleClose = () => {
        setShow(false)
        setThirdLevel(null)
    };

    const onThirdLevelClick = (cat: Category) => {
        setThirdLevel(cat)
        if (!cat[CategoryField.Children].length) {
            const path = [firstLevel?.[CategoryField.Slug], secondLevel?.[CategoryField.Slug], cat?.[CategoryField.Slug]].filter(Boolean).join('/');
            router.push(`${Paths.Blog}/${path}`);
            handleBurgerClick(false)
        }
    }

    return (
        <Offcanvas show={show} onHide={handleClose} style={{ width: '100%', left: 0 }}>
            <Offcanvas.Header closeButton className={styles.header}>
                <Offcanvas.Title className={styles.title}>{secondLevel?.[CategoryField.Name]}</Offcanvas.Title>
            </Offcanvas.Header>

            {secondLevel?.[CategoryField.Children].map(cat => {
                return (
                    <Button
                        key={cat[CategoryField.Id]}
                        variant="link"
                        className={styles.catalog_drop_btn}
                        onClick={() => onThirdLevelClick(cat)}
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

        </Offcanvas>
    )
}