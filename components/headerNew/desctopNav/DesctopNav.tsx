import Link from "next/link";
import { Button, Container, Dropdown } from "react-bootstrap";
import styles from './desctopNav.module.scss';
import { DropdownBlog } from "../dropdownBlog/DropdownBlog";
import { useSelector } from "react-redux";
import { selectCategories } from "@/store/blog/blogSlice";
import { useEffect, useRef, useState } from "react";
import { CatalogDropDown } from "../catalogDropDown/CatalogDropDown";
import { Paths } from "@/constant";

export const DesctopNav = () => {
    const [showBlogDrop, setShowBlogDrop] = useState(false);
    const [showCatalogDrop, setShowCatalogDrop] = useState(false);

    const blogMenuRef = useRef<HTMLDivElement>(null);
    const catalogMenuRef = useRef<HTMLDivElement>(null);
    const catalogBtnRef = useRef<HTMLButtonElement>(null);
    const blogBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                !blogBtnRef.current?.contains(e.target as Node) &&
                !catalogBtnRef.current?.contains(e.target as Node) &&
                !blogMenuRef.current?.contains(e.target as Node) &&
                !catalogMenuRef.current?.contains(e.target as Node)
            ) {
                setShowBlogDrop(false);
                setShowCatalogDrop(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <nav
            id="headerNavAuth"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
            itemID="/#headerNavAuth"
            className={styles.nav}
        >
            <ul
                itemProp="about"
                itemScope
                itemType="http://schema.org/ItemList"
                className={styles.nav_list}
            >
                <li
                    itemProp="itemListElement"
                    itemScope
                    itemType="http://schema.org/ItemList"
                >
                    <Button
                        variant="link"
                        onClick={() => {
                            setShowCatalogDrop(prev => !prev);
                            setShowBlogDrop(false);
                        }}
                        className={styles.drop_btn}
                        ref={catalogBtnRef}
                    >
                        <span className={`${styles.drop_item} ${showCatalogDrop ? styles.select : ''}`} >Каталог</span>
                    </Button>
                </li>
                <li
                    itemProp="itemListElement"
                    itemScope
                    itemType="http://schema.org/ItemList"
                >
                    <Button
                        // @ts-ignore: bootstrap bag*
                        as={Link}
                        variant="link"
                        className={styles.drop_btn}
                        href={`/lk/common/site`}
                        itemProp="url"
                    >
                        <span className={styles.drop_item} itemProp="name">Сайты</span>
                    </Button>

                </li>
                <li
                    itemProp="itemListElement"
                    itemScope
                    itemType="http://schema.org/ItemList"
                >
                    <Button
                    // @ts-ignore: bootstrap bag*
                        as={Link}
                        variant="link"
                        className={styles.drop_btn}
                        href={`/lk/common/invitation `}
                        itemProp="url"
                    >
                        <span className={styles.drop_item} itemProp="name">Приглашения</span>
                    </Button>

                </li>
                <li
                    itemProp="itemListElement"
                    itemScope
                    itemType="http://schema.org/ItemList"
                >
                    <Button
                        variant="link"
                        onClick={() => {
                            setShowBlogDrop(prev => !prev);
                            setShowCatalogDrop(false);
                        }}
                        className={styles.drop_btn}
                        ref={blogBtnRef}
                    >
                        <span className={`${styles.drop_item} ${showBlogDrop ? styles.select : ''}`} >Идеи и советы</span>
                    </Button>
                </li>
            </ul>
            {showBlogDrop && (
                <div tabIndex={0} ref={blogMenuRef} className={styles.drop_item__providers}>
                    <Container>
                        <h3 className={styles.drop_title}>
                            <span>Идеи и советы</span>
                            <i className="fi-arrow-right"></i>
                        </h3>
                        <DropdownBlog setShowBlogDrop={setShowBlogDrop} />

                    </Container>
                </div>
            )}
            {showCatalogDrop && (
                <div tabIndex={1} ref={catalogMenuRef} className={styles.drop_item__providers}>
                    <Container>
                        <h3 className={styles.drop_title}>
                            <span>Каталог</span>
                            <i className="fi-arrow-right"></i>
                        </h3>
                        <CatalogDropDown setShowCatalogDrop={setShowCatalogDrop} />
                    </Container>
                </div>
            )}
        </nav>
    );
}
