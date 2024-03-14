import { useDispatch, useSelector } from 'react-redux'
import styles from './folderBreadCrumbs.module.scss'
import { selectDocumentLayout, selectNavigationStack } from '@/store/document/documentSelectors'
import { Document, DocumentEnum } from '@/fsd/app/types/Document'
import { AppDispatch } from '@/store'
import { resetNavigationStack, setLayoutDocument, setNavStack } from '@/store/document/documentSlice'
import { fetchDocumentByIdWithThunk } from '@/fsd/features/global/documents/fetchDocumentById'


// pushNavStack,
// setNavStack
// selectNavigationStack
export const FolderBreadCrumbs = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigationStack = useSelector(selectNavigationStack)
    const onHome = () => {
        dispatch(setLayoutDocument('root'))
        dispatch(resetNavigationStack())
    }

    const onClickNavigation = async (folder: Document) => {
        await dispatch(fetchDocumentByIdWithThunk({ id: folder[DocumentEnum.Id]! }))
        dispatch(setNavStack(folder))
    }
    return (
        <div className={styles.breadCrumbs}>
            <span onClick={onHome}>Документы</span>
            {navigationStack.map((item, i) => {
                return <div className={styles.navItem} key={i}>
                    {<i className='fi-chevron-right'></i>}
                    <span className={
                        i === navigationStack.length - 1 ? styles.current : ''
                    } onClick={() => onClickNavigation(item)}>{item[DocumentEnum.Title]}</span>
                </div>
            })}
        </div>
    )
}