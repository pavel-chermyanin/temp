export type Step = {
    page: string;
    title: string;
}

export type StatePage = {
    provider: Step;
    event: Step;
    location: Step;
    guest: Step;
    price: Step
    wishes: Step
}

export const state: StatePage = {
    provider: {
        page: 'provider',
        title: 'Кого вы ищете?',
    },
    event: {
        page: 'event',
        title: 'Мероприятие',
    },
    location: {
        page: 'location',
        title: 'Место и время мероприятия',
    },
    guest: {
        page: 'guest',
        title: 'Дата и гости',
    },
    price: {
        page: 'price',
        title: 'Стоимость услуг',
    },
    wishes: {
        page: 'wishes',
        title: 'Пожелания к заказу',
    }
};