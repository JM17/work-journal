import type { FormProps, FormSchema } from "remix-forms";
import { createForm } from "remix-forms";
import {
  Form as RemixForm,
  useActionData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import SubmitButton from "~/components/buttons/submit-button";
import Input from "~/components/form/input";
import Radio from "./inputs/radio";
import TextArea from "./inputs/text-area";
import RadioGroup from "~/components/form/inputs/radio-group";
import InputWrapper from "~/components/form/input-wrapper";
import Error from "~/components/form/error";
import Errors from "~/components/form/errors";
import Field from "~/components/form/field";
import Label from "./label";
import Select from "./inputs/select";
import Checkbox from "~/components/form/inputs/checkbox";

const BaseForm = createForm({
  component: RemixForm,
  useNavigation,
  useSubmit,
  useActionData,
});

export default function Form<Schema extends FormSchema>(
  props: FormProps<Schema>
) {
  return (
    <BaseForm
      className="flex flex-col space-y-4 disabled:opacity-80"
      fieldComponent={Field}
      labelComponent={Label}
      inputComponent={Input}
      multilineComponent={TextArea}
      selectComponent={Select}
      radioComponent={Radio}
      radioGroupComponent={RadioGroup}
      radioWrapperComponent={InputWrapper}
      checkboxWrapperComponent={InputWrapper}
      checkboxComponent={Checkbox}
      buttonComponent={SubmitButton}
      globalErrorsComponent={Errors}
      errorComponent={Error}
      {...props}
    />
  );
}
