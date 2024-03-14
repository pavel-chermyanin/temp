import Image from 'next/image'
import styles from './style.module.scss'
import { Business, BusinessEnum } from '@/fsd/app/types/Business'
import { ProvidersPropsEnum } from '@/fsd/features/global/providers/fetchProviders/types/ProvidersProps'
import { BusinessField } from '@/types/business'
import { BusinessCategory, BusinessCategoryEnum } from '@/fsd/app/types/BusinessCategory'
import { UserEnum } from '@/fsd/app/types/User'
import { ImageEnum } from '@/fsd/app/types/Image'
import { Place, PlaceField } from '@/types/place'

type AvailableProvidersProps = {
    pricePage?: string
    providers?: Business[] | Place[]
    category?: string
    count?: number
}

export const AvailableProviders = ({ pricePage, providers, category, count }: AvailableProvidersProps) => {


    return (
        <div className={`${styles.available_wrapper} ${pricePage ? styles.pricePage : ''}`}>
            <div className={styles.title}>Доступные {category}</div>
            <div className={styles.avatars}>
                {providers?.slice(0, 5).map((prov, id) => {
                    let avaSrc
                    if (category === 'Площадки') {
                        const mainPhoto = (prov as Place)[PlaceField.MainPhoto];
                        if (mainPhoto && typeof mainPhoto === 'object') {
                            avaSrc = mainPhoto.file;
                        }
                    } else {
                        avaSrc = typeof prov[BusinessEnum.Owner] === 'object'
                            && typeof prov[BusinessEnum.Owner][UserEnum.Photo] === 'object'
                            && prov[BusinessEnum.Owner][UserEnum.Photo]?.[ImageEnum.File]
                    }


                    if (!avaSrc) {
                        return (
                            <div className={styles.ava_wrapper} key={id}>
                                <p key={id} className="default-ava">
                                    <i className='fi-user'></i>
                                </p>
                            </div>

                        )

                    }

                    return (
                        <div className={styles.ava_wrapper} key={id}>
                            < Image
                                key={prov[BusinessEnum.Id]}
                                width={40}
                                height={40}
                                alt='avatar'
                                src={avaSrc} />
                        </div>
                    )
                })}
            </div>
            <div className={styles.num}>
                {count && count > 0 ? count : 'Доступных поставщиков не нашлось'}
            </div>
        </div>
    )
}