import Image from "next/image";
import styles from "@/styles/document/Document.module.scss";
import { Document, DocumentEnum } from "@/fsd/app/types/Document";
import { formattedRelativeTime } from "@/fsd/shared/lib/format/formatStringDate";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { setLayoutDocument } from "@/store/document/documentSlice";
import { fetchDocumentByIdWithThunk } from "@/fsd/features/global/documents/fetchDocumentById";

type DocumentCardProps = {
    folder: Document
    onRootClick: () => void
}


export const  DocumentCard = ({ folder,onRootClick }: DocumentCardProps) =>{
    const dispatch = useDispatch<AppDispatch>()

    const onClickFolderRoot = () => {
        dispatch(setLayoutDocument('table'))
        onRootClick()
    }

    const onCurrentFolder = () => {

    }
    return (
        <div className={styles.document__card} onClick={onClickFolderRoot}>
            {/* <Image
                src={"/img/lk/folder.png"}
                width={168}
                height={168}
                alt="папка"
            /> */}
            <div className="pb-1" >
                <svg width="140" height="112" viewBox="0 0 140 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.998 112C10.148 112 6.85338 110.631 4.11405 107.891C1.37471 105.152 0.00271354 101.855 -0.00195312 98.0005V14.0005C-0.00195312 10.1505 1.37005 6.85582 4.11405 4.11649C6.85805 1.37715 10.1527 0.00515495 13.998 0.000488281H55.998L69.998 14.0005H125.998C129.848 14.0005 133.145 15.3725 135.889 18.1165C138.633 20.8605 140.003 24.1552 139.998 28.0005V98.0005C139.998 101.85 138.628 105.147 135.889 107.891C133.15 110.635 129.853 112.005 125.998 112H13.998Z" fill="#D5D2DC" />
                </svg>
            </div>
            <p className={styles.document__title}>{folder[DocumentEnum.Title]}</p>
            <p className={styles.document__time}>
                {formattedRelativeTime(folder[DocumentEnum.CreationDatetime]!)}
            </p>
        </div>
    )
}