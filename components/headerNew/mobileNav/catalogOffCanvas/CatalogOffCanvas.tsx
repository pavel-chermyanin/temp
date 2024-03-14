import { Button, Offcanvas } from "react-bootstrap"
import styles from './catalogOffCanvas.module.scss'
import Link from "next/link";
import { BusCategoryField, BusinessField } from "@/types/business";
import { Paths } from "@/constant";
import { useSelector } from "react-redux";
import { selectBusinessCategories } from "@/store/business/businessSlice";
import { PlacesOffCanvas } from "../placesOffCanvas/PlacesOffCanvas";
import React, { useState } from "react";

type CatalogOffCanvasProps = {
    setShow: (show: boolean) => void;
    handleBurgerClick: (show: boolean) => void;
    show: boolean
}

export const CatalogOffCanvas = ({ show, setShow, handleBurgerClick }: CatalogOffCanvasProps) => {
    const handleClose = () => {
        setShow(false)
    };
    const categories = useSelector(selectBusinessCategories)
    const [showPlacesOffCanvas, setShowPlacesOffCanvas] = useState(false)
    return (
        <Offcanvas style={{ width: '100%', left: 0 }} show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton className={styles.header}>
                <Offcanvas.Title className={styles.title}>Каталог</Offcanvas.Title>
            </Offcanvas.Header>
            <div className={styles.catalog_list}>

                {categories && categories.length && categories.map(cat => {
                    // const categorySlug = typeof cat[BusinessField.Slug] === 'object'
                    // && cat[BusinessEnum.Category] !== null
                    // && cat[BusinessEnum.Category][BusinessCategoryEnum.Slug]
                    return (

                        <React.Fragment key={cat[BusCategoryField.Id]}>
                            {cat[BusCategoryField.Id] === 1
                                ? (
                                    <Button

                                        variant="link"
                                        className={styles.catalog_drop_btn}
                                        onClick={() => setShowPlacesOffCanvas(true)}

                                    >
                                        <p
                                            className={styles.catalog_drop_item}>{cat[BusCategoryField.Title]}</p>
                                        <i className="fi-chevron-right"></i>
                                    </Button>

                                )
                                : (
                                    <Link
                                        className={styles.catalog_link}
                                        href={`${Paths.Catalog}/${cat[BusinessField.Slug]}/`}
                                        itemProp="url"
                                    >
                                        <p
                                            onClick={() => {
                                                handleClose()
                                                handleBurgerClick(false)
                                            }}
                                            className={styles.catalog_drop_item}>{cat[BusCategoryField.Title]}</p>
                                    </Link>
                                )
                            }
                        </React.Fragment>

                    )
                })}
            </div>

            <PlacesOffCanvas
                setShow={setShowPlacesOffCanvas}
                show={showPlacesOffCanvas}
                handleBurgerClick={handleBurgerClick} />
        </Offcanvas>
    )
}