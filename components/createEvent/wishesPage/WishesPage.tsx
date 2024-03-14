

import { Form, Spinner } from "react-bootstrap";
import { HandleInput, handleFile } from "../CreateEventContainer";
import styles from './style.module.scss'
import { AvailableProviders } from "../availableProviders/AvailableProviders";
import FileUploader from "@/components/UI/fileUploader/FileUploader";
import { Image } from "@/types/common";
import { useEffect, useRef, useState } from "react";
import { fetchImagesIdByString, getPatchImagesIds } from "@/store/image/imageAPI";
import { Token } from "@/constant";
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { useSelector } from "react-redux";
import { selectAvailableProviders, selectCategory, selectCountAvailableProviders } from "@/store/createAnnouncement/createAnnouncementSlice";
import { BusCategoryField } from "@/types/business";
import { ExactPrice } from "../exactPrice/ExactPrice";

// Регистрируем плагин
registerPlugin(FilePondPluginFileValidateType);

interface WishesPageProps {
    handleInputChange: HandleInput;
    handleFileChange: handleFile;
    selectedText: string;
    files: (number | Image)[]
}


export const WishesPage = ({ handleInputChange, handleFileChange, selectedText, files }: WishesPageProps) => {
    const providers = useSelector(selectAvailableProviders);
    const count = useSelector(selectCountAvailableProviders);
    const selectedCategory = useSelector(selectCategory)

    const [img, setImg] = useState<(number | Image)[]>([])
    const firstRender = useRef(true)

    const isImage = (obj: any): obj is Image => {
        return typeof obj === 'object' && 'file' in obj;
    };
    const fetchImg = async () => {
        let token = localStorage.getItem(Token.Access);

        if (token) {
            const convert = files.filter(file => isImage(file) && !file.file.startsWith('http'))
            const filter = files.filter(file => isImage(file) && file.file.startsWith('http'))
            if (convert.length) {
                const images = await fetchImagesIdByString(convert.filter(isImage).map(file => file.file), token) as Image[];
                if (images.length) {
                    setImg(prev => [...prev, ...images])
                }
            }
            if (filter.length) {
                setImg(prev => [...prev, ...filter])
            }

        }
    }

    useEffect(() => {
        fetchImg()
        firstRender.current = false

        return () => {
            firstRender.current = true
        }
    }, [])



    const uploaderRender = (
        handleFileChange: (imgs: Image[]) => void,
        files: Image[] | undefined,
        required: boolean
    ) => {
        console.log('uploaderRender', files)
        return (
            <Form.Group className={styles.file_group}>
                <Form.Label className="d-block mb-2 mt-2 pb-1">
                    Загрузите фото
                </Form.Label>

                {<FileUploader

                    setGallery={handleFileChange}
                    maxFiles={10}
                    warning="Максимальный размер фото – 10 МБ. Форматы: jpg, png, webp. Вы можете загрузить до 10 фото."
                    gallery={files}
                    required={required}
                />}
            </Form.Group>
        );
    };
    return (
        <div className={`${styles.grid}`}>
            <div className={styles.form}>
                <Form.Group
                    controlId="wishes"
                    key={`wishes-id`}
                    className={`${styles.item_group}`}

                >
                    <Form.Label>
                        <span className={styles.span_title}>Что еще стоит учесть?</span>

                    </Form.Label>
                    <Form.Control
                        className={styles.span_textarea} as="textarea"
                        aria-label="With textarea"
                        name="wishes"
                        onChange={handleInputChange}
                        value={selectedText}
                    />

                </Form.Group>
                {firstRender.current && files.length && !img.length ? <Spinner /> : uploaderRender(
                    handleFileChange,
                    img as Image[],
                    false
                )}

            </div>
            <AvailableProviders
                providers={providers}
                category={selectedCategory?.[BusCategoryField.Title]}
                count={count} />
        </div>
    );
};