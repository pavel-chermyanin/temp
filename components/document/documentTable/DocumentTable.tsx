import { Col, Row } from "react-bootstrap";
import { DocumentCard } from "./DocumentCard";
import { GuestOffcanvasOptions } from "@/components/lk/lk.constant";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTeammate } from "@/store/team/teamSlice";
import styles from './documentTable.module.scss'
import { selectCurrentFolder, selectDocumentLayout, selectRoot } from "@/store/document/documentSelectors";
import { useEffect } from "react";
import { fetchDocumentByIdWithThunk } from "@/fsd/features/global/documents/fetchDocumentById";
import { Document, DocumentEnum } from "@/fsd/app/types/Document";
import { pushNavStack } from "@/store/document/documentSlice";
import { AppDispatch } from "@/store";

type DocumentTableProps = {

};


export default function DocumentTable({ }: DocumentTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  const layout = useSelector(selectDocumentLayout)
  const rootItems = useSelector(selectRoot)
  // const layout = useSelector(selectRoot)


  const onRootClick = (item: Document) => {
    dispatch(fetchDocumentByIdWithThunk({ id: item[DocumentEnum.Id] !}))
    dispatch(pushNavStack(item))
  }


  function renderDocumentCard(array: any[]) {
    return rootItems.map((item, i) => {
        return (
          <DocumentCard key={i} folder={item} onRootClick={() => onRootClick(item)} />
        )
      })
  }

  return (
    <div className={styles.grid}>
      {renderDocumentCard([1, 2, 3])}
    </div>
  )
}