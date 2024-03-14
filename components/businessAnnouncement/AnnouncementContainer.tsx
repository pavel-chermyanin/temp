
import { Button, ProgressBar } from "react-bootstrap";
import TitleLayout from "../../common/layouts/TitleLayout";
import style from './style.module.scss'
import { SetStateAction, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchEventTypesWithThunk } from "@/store/event/eventSlice";
import { useMediaQuery } from "react-responsive";
import { TypeCardBusiness, resetAnnouncements, selectCountAnnouncementResponses, selectTypeCardBusiness, toggleTypeCard } from "@/store/businessAnnouncement/businessAnnouncementSlice";
import dynamic from "next/dynamic";
import { fetchAnnouncementsWithThunk, fetchTotalCountAnnouncements } from "@/store/bridgeAnnouncement/announcementActions";
import { selectTotalCountAnnouncements } from "@/store/bridgeAnnouncement/bridgeAnnouncementSlice";
import { selectProviderMe } from "@/store/user/userSlice";
import { Business, BusinessField } from "@/types/business";
import { fetchTotalCountAnnouncementResponses } from "@/store/businessAnnouncement/businessAnnounResponseActions";
import { getCountAnnouncementsString } from "@/fsd/shared/lib/format/nounFormatter";
import { useRouter } from "next/router";

const MobileWrapper = dynamic(
  () => import('./mobileWrapper/MobileWrapper'), { ssr: false });
const AnnouncementWrapper = dynamic(
  () => import('./announcementWrapper/AnnouncementWrapper'), { ssr: false });


const navItems = [
  {
    title: 'Актуальные заявки',
    value: 'topic',
    // count: uncompleted.length
  },
  {
    title: 'Отклики',
    value: 'response',
    // count: completed.length,
  },
  {
    title: 'Отклонено',
    value: 'rejected',
    // count: expiredTasks.length,
  },

];
function AnnouncementContainer() {
  const totalCount = useSelector(selectTotalCountAnnouncements)
  const countResponses = useSelector(selectCountAnnouncementResponses)
  const provider: Business | null = useSelector(selectProviderMe)
  const typeCardBusiness = useSelector(selectTypeCardBusiness)
  const { query } = useRouter()

  const dispatch = useDispatch<AppDispatch>()
  const isTablet = useMediaQuery({ maxWidth: 850 });
  const [isShowFormTable, setIsShowFormTable] = useState(false)
  const [searchInput, setSearchInput] = useState<string | null>(null)

  const categoryId = typeof provider?.[BusinessField.Category] === 'object'
    ? provider[BusinessField.Category]?.id
    : provider?.[BusinessField.Category];

  const onAddTable = () => {
    setIsShowFormTable(true)
  }

  const HandleNavItem = ({ key }: { key: SetStateAction<string> }) => {
    dispatch(toggleTypeCard(key as TypeCardBusiness))
  }

  useEffect(() => {
    dispatch(fetchEventTypesWithThunk())
  }, [])

  useEffect(() => {
    if (categoryId && !totalCount) {
      dispatch(fetchTotalCountAnnouncements({ category: categoryId }))
    }
  }, [categoryId, totalCount])

  useEffect(() => {
    if (totalCount && categoryId) {
      dispatch(fetchTotalCountAnnouncementResponses({ category: categoryId }))
    }
  }, [totalCount, categoryId])

  useEffect(() => {
    if(searchInput && !query.search) {
      setSearchInput('')
    } else {
      setSearchInput(query.search as string || null)
    }
  }, [query.search])
 

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      const searchAnnoun = async () => {
        dispatch(resetAnnouncements());
      };

      console.log(query,searchInput)
      if (searchInput !== null ) {
        searchAnnoun().then(() => {
          dispatch(fetchAnnouncementsWithThunk({ category: categoryId, search: query.search as string }));
        });
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchInput]);





  return (
    <>
      <TitleLayout
        title="Актуальные заявки"
        rightChildren={
          <>
            <Button
              variant="primary"
              className={`${style.button}`}
              onClick={onAddTable}
            >
              ???
            </Button>

            <div className={style.progress_group}>
              <div className="d-flex justify-content-between mb-2 fs-sm fw-semibold text-dark">
                <p className="mb-0 opacity-60">Отправлен отклик: {countResponses}</p>
                <p className="mb-0 opacity-80">Всего: {getCountAnnouncementsString(totalCount)}</p>
              </div>
              <ProgressBar className={style.progress}
                variant="primary"
                min={0}
                now={countResponses}
                max={totalCount}
              />
            </div>
          </>
        }
        isShowPrintLinks={false}
        path={''}
        download={''}
        id={0}
        navItems={navItems}
        setActiveNavlink={(key) => HandleNavItem({ key })}
        activeNavlink={typeCardBusiness}
      />
      <div className={`${style.announcement_wrapper}`}>
        {isTablet ? <MobileWrapper /> : <AnnouncementWrapper />}
      </div>
    </>
  )
}

export default AnnouncementContainer;
