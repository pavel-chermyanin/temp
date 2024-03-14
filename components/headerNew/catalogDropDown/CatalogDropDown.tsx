import { selectBusinessCategories } from '@/store/business/businessSlice';
import { BusCategoryField, BusinessField } from '@/types/business';
import { useSelector } from 'react-redux';
import styles from './catalogDrop.module.scss';
import Link from 'next/link';
import { Paths } from '@/constant';
import { Dispatch, SetStateAction } from 'react';

type CatalogDropDownProps = {
  setShowCatalogDrop: Dispatch<SetStateAction<boolean>>
}

export const CatalogDropDown = ({ setShowCatalogDrop }: CatalogDropDownProps) => {
  const categories = useSelector(selectBusinessCategories);

  return (
    <div className={styles.catalog_drop_wrapper}>

      {categories && categories.length && categories.map(cat => {

        return (

          <>
            {cat[BusCategoryField.Id] === 1
              ? (
                <Link
                  key={cat[BusCategoryField.Id]}
                  href={`${Paths.Places}`}
                  itemProp="url"
                >
                  <p
                    onClick={() => setShowCatalogDrop(false)}
                    className={styles.catalog_drop_item}>{cat[BusCategoryField.Title]}</p>
                </Link>

              )
              : (
                <Link
                  key={cat[BusCategoryField.Id]}
                  href={`${Paths.Catalog}/${cat[BusinessField.Slug]}`}
                  itemProp="url"
                >
                  <p
                    onClick={() => setShowCatalogDrop(false)}
                    className={styles.catalog_drop_item}>{cat[BusCategoryField.Title]}</p>
                </Link>
              )
            }
            {/* // <p className={styles.catalog_drop_item} */}
          </>

        );
      })}
    </div>
  );
};
