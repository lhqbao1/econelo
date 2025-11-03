import { Controller, useFormContext } from "react-hook-form";
import { NumberInput, NumberInputProps } from "./number-input";

interface FormNumberInputProps extends NumberInputProps {
  name: string;
}

export const FormNumberInput = ({ name, ...props }: FormNumberInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <NumberInput
          {...props}
          value={field.value}
          onValueChange={(val) => field.onChange(val)}
        />
      )}
    />
  );
};
