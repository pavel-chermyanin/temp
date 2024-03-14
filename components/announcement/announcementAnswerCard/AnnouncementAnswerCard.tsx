import { Button, Nav } from 'react-bootstrap'
import style from './style.module.scss'
import Image from 'next/image'
import { CardTabs } from './cardTabs/CardTabs'
import { AnnouncementResponseResult } from '@/types/businessAnnouncement'
import { BusinessField } from '@/types/business'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store'
import { createAnnouncementsRespApprove } from '@/store/bridgeAnnouncement/announcementActions'
import { setAnnounRespApproved } from '@/store/bridgeAnnouncement/bridgeAnnouncementSlice'
import { selectIsAuth, selectUser } from '@/store/user/userSlice'
import { fetchAllChatsWithThunk, selectChats, selectSocket } from '@/store/chat/chatSlice'
import { UserField } from '@/types/user'
import { toast } from 'react-toastify'
import { ChatField } from '@/types/chat'
import { createChat } from '@/store/chat/chatAPI'
import { EventTypeField } from '@/types/event'

export const AnnouncementAnswerCard = ({ response }: { response: AnnouncementResponseResult }) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectUser);
    const isAuth = useSelector(selectIsAuth);
    const userChats = useSelector(selectChats);
    const socket = useSelector(selectSocket);

    const onResponse = async () => {
        const res = await dispatch(createAnnouncementsRespApprove({ is_approved: true, id: response.id }))
        createContact() 
        if (res.payload) {
            dispatch(setAnnounRespApproved(res.payload))
        }
    }
    const onReject = async () => {
        const res = await dispatch(createAnnouncementsRespApprove({ is_approved: false, id: response.id }))
        if (res.payload) {
            dispatch(setAnnounRespApproved(res.payload))
        }
    }
    const imageSrc = false
    const renderAva = () => {
        if (imageSrc) {
            return <Image
                className={style.avatar}
                src={''}
                width={64}
                height={64}
                alt="avatar"
                loading="lazy"
            />
        } else {

            return <div className={style.ava_default}>
                <i className={`fi-user`}></i>

            </div>
        }
    }


    async function createContact() {
        const id = response.owner.id
        if (user[UserField.Id] === id) {
            toast.warning('Нельзя создать чат с самим собой');
            return;
        }
        const doesChatAlreadyExist = userChats.find(
            (chat) => chat[ChatField.Counterpart][UserField.Id] === id
        );
        let chatId: number | undefined = undefined;
        if (!doesChatAlreadyExist) {
            const response = await createChat([id]);
            if (response) chatId = response[ChatField.Id];
            dispatch(fetchAllChatsWithThunk());
        } else {
            chatId = doesChatAlreadyExist[ChatField.Id];
        }

        if (socket && chatId) {
            console.log('socket')
            socket.send(
                JSON.stringify({
                    type: 'WRITE_MESSAGE',
                    data: {
                        chat: chatId,
                        text: `Сообщение от ${user[UserField.FirstName]} ${user[UserField.LastName]}: Пожалуйста, свяжитесь со мной.
                        Я планирую мероприятие ${response.announcement.event_type[EventTypeField.Title]} на ${response.announcement.event_date}`,
                        image: null,
                        images: [],
                    },
                })
            );
            toast.success(
                `Поставщику ${response.owner.first_name} ${response.owner.last_name} отправлено сообщение. Загляните в чат :)`
            );
        }
    }
    return (
        <div className={style.contractorCard}>
            <div className={style.tabsBlock}>
                <header className={style.header}>
                    {renderAva()}
                    <div className={style.info}>
                        <p className={style.name}>{response.owner.first_name}</p>
                        <p className={style.status}>{response.owner.online_status ? "в сети" : "не в сети"}</p>
                    </div>
                </header>
                <CardTabs response={response} />
            </div>
            <div className={style.buttons}>
                {response.status === 'APPROVED'
                    ? (
                        <Button
                            disabled={true}
                            variant="light"
                            className={style.button}
                        // onClick={onResponse}
                        >
                            Вы откликнулись
                        </Button>
                    )
                    : (
                        <Button
                            variant="primary"
                            className={style.button}
                            onClick={onResponse}
                        >
                            Ответить на предложение
                        </Button>

                    )
                }
                {response.status === 'DECLINED'
                    ? (
                        <Button
                            disabled={true}
                            variant="secondary"
                            className={style.button}
                            onClick={onReject}
                        >
                            Предложение отклонено
                        </Button>
                    )
                    : (

                        <Button
                            variant="secondary"
                            className={style.button}
                            onClick={onReject}
                        >
                            Отклонить предложение
                        </Button>
                    )}
            </div>
        </div >
    )
}