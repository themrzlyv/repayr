import { Controller, useFormContext, FieldValues, Path } from "react-hook-form";
import { ReactElement } from "react";

type RHFAdapterProps<T extends FieldValues> = {
  name: Path<T>;
  render: (props: {
    value: any;
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    errorMessage?: string;
    isInvalid: boolean;
    isClearable?: boolean;
    setValue: (val: any) => void;
    onClear?: () => void;
  }) => ReactElement;
};

export function Field<T extends FieldValues>({
  name,
  render,
}: RHFAdapterProps<T>) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) =>
        render({
          ...field,
          errorMessage: error?.message as string,
          isInvalid: !!error,
          isClearable: true,
          setValue: (val: any) => setValue(name, val),
          onClear: () => setValue(name, "" as any),
        })
      }
    />
  );
}
