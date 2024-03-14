import { Button } from 'react-bootstrap'
import style from './style.module.scss'

export const BlockHelp = () => {
    const onHelp = () => {}
    return (
        <div className={style.blockHelp}>
            <p className={style.blockHelp_title}>Нужна помощь?</p>
            <Button
            variant="primary"
            className={style.button}
            onClick={onHelp}
          >
                Обратиться в поддержку
          </Button>
        
        </div>
    )
}