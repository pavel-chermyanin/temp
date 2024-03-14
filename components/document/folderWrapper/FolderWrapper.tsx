import { FolderBreadCrumbs } from '../folderBreadCrumbs/FolderBreadCrumbs'
import { FolderHeader } from '../folderHeader/FolderHeader'
import { FolderTable } from '../folderTable/FolderTable'
import styles from './folderWrapper.module.scss'

export const FolderWrapper = () => {
    return (
        <div className={styles.folder_wrapper}>
            <FolderHeader/>
            <FolderBreadCrumbs/>
            <FolderTable/>
        </div>
    )
}