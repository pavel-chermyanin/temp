
import { Button } from "react-bootstrap";
import TitleLayout, { navItem } from "../../common/layouts/TitleLayout";
import { useMediaQuery } from 'react-responsive';
import style from './style.module.scss'
import { FC, useEffect } from "react"
// import MobileWrapper from "./mobileWrapper/MobileWrapper";
// import AnnouncementWrapper from "./announcementWrapper/AnnouncementWrapper";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  fetchAllCategoriesWithThunk,
  // fetchAnnouncementsWithThunk,
  selectAnnouncements, selectAvailableProviders, selectCategories, selectCountAnnouncements,
  selectNextCategory, selectSelectedCategory, setSelectCategory, toggleTypeCard
} from "@/store/bridgeAnnouncement/bridgeAnnouncementSlice";
import { selectUser } from "@/store/user/userSlice";
import { UserField } from "@/types/user";
import { AnnouncementResult } from "@/types/announcement";
import { BusCategoryField } from "@/types/business";
import dynamic from "next/dynamic";
import { fetchAnnouncementsWithThunk } from "@/store/bridgeAnnouncement/announcementActions";
// import { fetchAnnouncementResponsesWithThunk } from "@/store/businessAnnouncement/businessAnnouncementSlice";
import { fetchProvidersWithThunk } from "@/fsd/features/global/providers/fetchProviders";
import { fetchAnnouncementResponsesWithThunk } from "@/fsd/features/global/announcements/fetchAnnouncementResponses";


const MobileWrapper  = dynamic(
  () => import("./mobileWrapper/MobileWrapper"), { ssr: false }) as React.ComponentType;

const AnnouncementWrapper  = dynamic(
  () => import("./announcementWrapper/AnnouncementWrapper"), { ssr: false }) as React.ComponentType;

export type NavConstractorSelect = {
  title: string
  value: string
}



const AnnouncementContainer = ({ }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()
  const isMobile = useMediaQuery({ maxWidth: 850 });
  const next = useSelector(selectNextCategory)
  const user = useSelector(selectUser)
  const categories = useSelector(selectCategories)
  const announcements: AnnouncementResult[] = useSelector(selectAnnouncements)
  const countAnnouncements: number = useSelector(selectCountAnnouncements)
  const category: AnnouncementResult | null = useSelector(selectSelectedCategory);
  const {query} = useRouter()

 
  const renderItems: navItem[] = announcements.map(announNav => ({
    title: announNav.provider_category?.[BusCategoryField.Title],
    value: announNav.provider_category?.id.toString()
  }))

  const onAddTable = () => {
    router.push('create-announcement')
  }


  const HandleNavItem = ({ key }: { key: number }) => {
    const selectItem = announcements.find(announ => {
      return announ.provider_category.id === key
    })
    if (selectItem) {
      dispatch(setSelectCategory(selectItem))
      dispatch(fetchProvidersWithThunk({category: selectItem.provider_category[BusCategoryField.Id]}))
    }
  }

  useEffect(() => {
    if (user.id) {
      console.log('user', user)
      dispatch(fetchAnnouncementsWithThunk({ owner: user[UserField.Id] }));

    }
  }, [user]);

  useEffect(() => {
    if (countAnnouncements <= announcements.length) {
      dispatch(setSelectCategory(announcements[0]))
    }
  }, [announcements.length]);

  useEffect(() => {
    if (category) {
      dispatch(fetchAnnouncementResponsesWithThunk({announ: category.id}))
    }
  }, [category]);


  useEffect(() => {
    // первая thunk нужна была чтобы получить page_size
    if (countAnnouncements && countAnnouncements > announcements.length) {
      dispatch(fetchAnnouncementsWithThunk({ pageSize: countAnnouncements, owner: user[UserField.Id] }))
    }
  }, [countAnnouncements]);

  useEffect(() => {

    if (categories.length > 25) return

    const fetchData = async () => {
      if (next !== null) {
        await dispatch(fetchAllCategoriesWithThunk());
      }
    };

    fetchData();
  }, [dispatch, next]);

  useEffect(() => {
    console.log(query)
    dispatch(toggleTypeCard('answer'))
    if (category) {
      dispatch(fetchAnnouncementResponsesWithThunk({announ: category.id, search: query.search as string}))
    }

  },[query])



  return (
    <>
      <TitleLayout
        title="Подбор исполнителя"
        rightChildren={
          <Button
            variant="primary"
            className={`${style.button} px-3 fw-semibold`}
            onClick={onAddTable}
          >
            Создать новую заявку
          </Button>
        }
        isShowPrintLinks={false}
        path={''}
        download={''}
        id={0}
        navItems={renderItems}
        setActiveNavlink={(key) => HandleNavItem({ key: Number(key) })}
        activeNavlink={category?.provider_category[BusCategoryField.Id].toString()}
      />
      {isMobile ? (
        <MobileWrapper />
      ) : (
        <AnnouncementWrapper />
      )}
    </>
  )
}

export default AnnouncementContainer;



