import { BlockHelp } from '../blockHelp/BlockHelp'
import { BlockSort } from '../blockSort/BlockSort'
import style from './style.module.scss'

export const SortWrapper = () => {
    return (
        <div className={style.sortWrapper}>
            <BlockSort />
            <BlockHelp />
        </div>
    )
}