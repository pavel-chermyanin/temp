import { Offcanvas } from "react-bootstrap"
import styles from './placesOffCanvas.module.scss'
import Link from "next/link";
import { Paths, QueryParam, TYPE_AREA } from "@/constant";

type PlacesOffCanvasProps = {
    setShow: (show: boolean) => void;
    handleBurgerClick: (show: boolean) => void;
    show: boolean
}

export const PlacesOffCanvas = ({ show, setShow, handleBurgerClick }: PlacesOffCanvasProps) => {
    const handleClose = () => {
        setShow(false)
    };
    return (
        <Offcanvas show={show} onHide={handleClose} style={{ width: '100%', left: 0 }}>
            <Offcanvas.Header closeButton className={styles.header}>
                <Offcanvas.Title className={styles.title}>Площадки</Offcanvas.Title>
            </Offcanvas.Header>
            <Link className={styles.link_all} href={`${Paths.Places}`}>
                <span onClick={() => handleBurgerClick(false)}>
                    Посмотреть все виды площадок
                </span>
            </Link>
            {TYPE_AREA.map(areaType => {

                return (
                    <Link key={areaType[0]} className={styles.link} href={`${Paths.Places}?${QueryParam.AreaType}=${areaType[0]}`}>
                        <span onClick={() => handleBurgerClick(false)}>
                            {areaType[1]}
                        </span>
                    </Link>
                )
            })}
        </Offcanvas>
    )
}