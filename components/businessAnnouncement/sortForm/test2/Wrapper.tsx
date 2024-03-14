import { Checkbox } from "@/fsd/shared/rhf-ui/Checkbox/Checkbox"
import { FileUpload } from "@/fsd/shared/rhf-ui/FileUploader/FileUploader2"
import { Input } from "@/fsd/shared/rhf-ui/Input/Input"
import { InputCalendar } from "@/fsd/shared/rhf-ui/InputCalendar/InputCalendar"
import { RadioGroup } from "@/fsd/shared/rhf-ui/RadioGroup"


export const Wrapper = () => {    
    const list = ['44','55']
    return (
        <>
            <Input label="Name" name="name" placeholder="Имя" type="text" />
            <InputCalendar label="Date" name="date" />
            <Checkbox label="Ты уверен мужик?" name="sure"  />
            <RadioGroup label="Т5555" name="radio"  options={list}/>
            <FileUpload name="filepond"/>
        </>
    )
}