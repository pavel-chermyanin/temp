import { AppDispatch } from "@/store";
import { selectCategories } from "@/store/blog/blogSlice";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Category, CategoryField } from "@/types/category";
import styles from './blog.module.scss';
import { useRouter } from 'next/router';
import { Paths } from "@/constant";
import Image from "next/image";

type DropdownBlogProps = {
    setShowBlogDrop: Dispatch<SetStateAction<boolean>>
}

export const DropdownBlog = ({ setShowBlogDrop }: DropdownBlogProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const blogCategories = useSelector(selectCategories);
    const [firstLevel, setFirstLevel] = useState<Category | null>(null);
    const [secondLevel, setSecondLevel] = useState<Category | null>(null);
    const [thirdLevel, setThirdLevel] = useState<Category | null>(null);
    const router = useRouter();
    const firstRender = useRef(true)

    useEffect(() => {
        // Считываем значения из URL
        const { query } = router;
        const { category, subcategory, subsubcategory } = query;

        // Ищем соответствующие категории
        const firstLevelCat = blogCategories.find(cat => cat[CategoryField.Slug] === category);
        const secondLevelCat = firstLevelCat?.children.find(item => item[CategoryField.Slug] === subcategory);
        const thirdLevelCat = secondLevelCat?.children.find(item => item[CategoryField.Slug] === subsubcategory);

        // Устанавливаем значения в состояние
        setFirstLevel(firstLevelCat || blogCategories[1]);
        setSecondLevel(secondLevelCat || blogCategories[1][CategoryField.Children][0]);
        setThirdLevel(thirdLevelCat || null);


    }, [router.query]); // Зависимость от изменений в router.query

    useEffect(() => {
        if (secondLevel && !secondLevel.children.length) {
            updateUrl();
        }
    }, [secondLevel]);

    useEffect(() => {
        if (thirdLevel) {
            updateUrl();
        }

       
    }, [thirdLevel]);



    const updateUrl = () => {
        const path = [firstLevel?.[CategoryField.Slug], secondLevel?.[CategoryField.Slug], thirdLevel?.[CategoryField.Slug]].filter(Boolean).join('/');
        if(router.asPath !== `${Paths.Blog}/${path}`) {
            router.push(`${Paths.Blog}/${path}`);
            setShowBlogDrop(false)
        }

    };

    const handleFirstLevelClick = (cat: Category) => {
        setFirstLevel(cat);
        setSecondLevel(null)
        setThirdLevel(null);
    };

    const handleSecondLevelClick = (item: Category) => {
        setSecondLevel(item);
        if (item.children.length === 0) {
            setThirdLevel(null);
        }
    };

    const handleThirdLevelClick = (item: Category) => {
        setThirdLevel(item);
    }

    return (
        <div className={styles.drop_wrapper}>
            <div className={styles.first_level}>
                {blogCategories.map(cat => (
                    <div
                        key={cat[CategoryField.Id]}
                        onClick={() => handleFirstLevelClick(cat)}
                        onMouseEnter={() => handleFirstLevelClick(cat)}
                        className={`${styles.first_level_wrapper} ${cat[CategoryField.Id] === firstLevel?.id ? styles.select : ''}`}
                    >
                        <span className={styles.first_level_item}>
                            {cat[CategoryField.Name]}
                        </span>
                        <i className="fi-chevron-right"></i>
                    </div>
                ))}
            </div>
            {firstLevel?.[CategoryField.Children] && <div className={`${styles.second_level} ${firstLevel ? styles.fade : ''}`}>
                {firstLevel.children.map(item => (
                    <p
                        key={item[CategoryField.Id]}
                        className={`${styles.first_level_wrapper} ${item[CategoryField.Id] === secondLevel?.[CategoryField.Id] ? styles.select : ''}`}
                        onClick={() => handleSecondLevelClick(item)}
                        onMouseEnter={() => {
                            if (item[CategoryField.Children].length > 0) {
                                handleSecondLevelClick(item)
                            }
                        }}
                    >
                        <span>{item.name}</span>
                        {item?.children?.length > 0 && <i className="fi-chevron-right"></i>}
                    </p>
                ))}
            </div>}
            {secondLevel?.[CategoryField.Children] && <div className={`${styles.third_level} ${secondLevel ? styles.fade : ''}`}>
                {secondLevel?.children.map(item => (
                    <p
                        key={item[CategoryField.Id]}
                        onClick={() => handleThirdLevelClick(item)}
                        className={`${styles.first_level_wrapper} ${item[CategoryField.Id] === thirdLevel?.[CategoryField.Id] ? styles.select : ''}`}
                    >
                        {item.name}
                    </p>
                ))}
            </div>}
            <div className={styles.popularArticle}>
                <div className={styles.title}>Популярное</div>
                <Image width={333} height={356} src='/img/header/popular_article.png' alt='popular_article' />
                <div className={styles.author}>Подпись</div>
                <div className={styles.nameArtcile}>Название статьи из пяти слов</div>
            </div>
        </div>
    );
};