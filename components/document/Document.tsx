import { mockNavigation } from "@/pages/lk/common/business-pro";
import TitleLayout from "../layouts/TitleLayout";
import DocumentControl from "./documentControl/DocumentControl";
import DocumentTable from "./documentTable/DocumentTable";
import { LKProfSectionsTitles } from "../../lk.constant";
import { FolderWrapper } from "./folderWrapper/FolderWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDocumentLayout, selectNextCount, selectRoot } from "@/store/document/documentSelectors";
import { AppDispatch } from "@/store";
import { fetchDocumentsWithThunk } from "@/fsd/features/global/documents/fetchDocuments";

function DocumentContainer() {
  const dispatch = useDispatch<AppDispatch>()
  const count = useSelector(selectNextCount)
  const root = useSelector(selectRoot)
  const layout = useSelector(selectDocumentLayout)

  // useEffect(() => {
  //   dispatch(fetchDocumentsWithThunk())
  // }, [])

  useEffect(() => {
    if (count > root.length) {
      dispatch(fetchDocumentsWithThunk({pageSize: count}))
    }

    if (!root.length) {
      dispatch(fetchDocumentsWithThunk({}))
    }
  }, [count])

  return (<>
    {layout === 'root' && (
      <>
        <TitleLayout
          title={LKProfSectionsTitles.Document}
          // navItems={mockNavigation}
          rightChildren={<DocumentControl />}
          // activeNavlink="docs"
          path={''}
          download={''}
          id={0}
          isShowPrintLinks={false}
        />
        <DocumentTable />
      </>

    )}
    {layout === 'table' && (
      <FolderWrapper />
    )}

  </>)
}

export default DocumentContainer;