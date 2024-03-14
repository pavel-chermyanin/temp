import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Paths } from "@/constant";
import { clearAuthData } from "@/services/auth.service";
import { AppDispatch } from "@/store";
import { setAuth } from "@/store/user/userSlice";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

interface ExitModalProps {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExitModal: React.FC<ExitModalProps> = ({ show, setShow }) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = () => {
        dispatch(setAuth(false));
        clearAuthData();
        router.push(Paths.Home);
        setShow(false)
    };

    const handleClose = () => setShow(false);

    return (
        <Modal show={show} onHide={handleClose} style={{zIndex:10000}} centered>
            <Modal.Header closeButton>
                <Modal.Title>Выйти из аккаунта</Modal.Title>
            </Modal.Header>
            <Modal.Body>Вы уверены что хотите выйти?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={handleLogout}>
                    Подтвердить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};