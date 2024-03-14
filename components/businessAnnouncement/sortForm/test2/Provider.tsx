import { FormProvider, useForm } from "react-hook-form"
import { Wrapper } from "./Wrapper"
import { Form } from "react-bootstrap"
import { formatSubmitDate } from "@/fsd/shared/lib/format/formatInputCalendarSubmit"


export const MyForm = () => {

    const methods = useForm()
    // const {} = useFormState()

    const handleSubmit = (e:any) => {
        console.log(e)
        console.log(formatSubmitDate(e.date))
    }

    return (
        <FormProvider {...methods}>
            <Form onSubmit={methods.handleSubmit(handleSubmit)}>
                <Wrapper />
                {/* <Wrapper />
                <Wrapper />
                <Wrapper />
                <Wrapper /> */}
                <button type="submit">Submit</button>
            </Form>
        </FormProvider>
    )
}