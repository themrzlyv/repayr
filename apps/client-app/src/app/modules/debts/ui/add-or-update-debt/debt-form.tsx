import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  type DateValue,
  type SharedSelection,
} from "@heroui/react";
import * as Icons from "react-icons/ai";
import {
  createDebtFormSchema,
  type CreateDebtFormSchemaType,
} from "../../interface/schema/create-debt-form.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useMemo } from "react";
import { convertToCalendarDate } from "@/app/lib/format-date";
import { useQuery } from "@tanstack/react-query";
import { categoriesQueryOption } from "@/app/modules/category/infra/query-options/categories.query-option";
import { Currency } from "../../domain/enums/currency.enum";
import { searchAccountQueryOption } from "@/app/modules/account/infra/query-options/search-account.query-option";
import { useDebounce } from "@/app/shared/hooks/use-debounce";

type Props = {
  onSubmit: (values: CreateDebtFormSchemaType) => void;
  onRemove?: () => void;
  submitLoading: boolean;
  removeLoading: boolean;
  formValues: CreateDebtFormSchemaType | null;
};

export function DebtForm({
  onSubmit,
  onRemove,
  formValues,
  submitLoading,
  removeLoading,
}: Props) {
  const { data, isLoading: categoriesLoading } = useQuery(
    categoriesQueryOption({ filter: "ALL" })
  );

  const categories = data?.categories ?? [];

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map(cat => [cat.id, cat])),
    [categories]
  );

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<CreateDebtFormSchemaType>({
    resolver: zodResolver(createDebtFormSchema),
    defaultValues: formValues ?? undefined,
  });

  const tagName = useDebounce(watch("name"), 500);

  const { data: accountList, isFetching } = useQuery(
    searchAccountQueryOption(tagName)
  );

  const selectedCategoryId = watch("category")?.id;
  const selectedPayDate = watch("payDate");

  const handleCategoryChange = (keys: SharedSelection) => {
    const selected = Array.from(keys)[0];
    const category = categoryMap[selected as string];
    if (category) setValue("category", category);
  };

  return (
    <form
      id="debt-form"
      onSubmit={handleSubmit(onSubmit, err => console.log(err, "errrr"))}
      className="flex flex-col h-full justify-between"
    >
      <div className="flex flex-col gap-4">
        <Autocomplete
          allowsCustomValue
          inputValue={watch("name")}
          isLoading={isFetching}
          onInputChange={value => setValue("name", value)}
          onSelectionChange={key => {
            console.log(key, "keyoooo");
            setValue("lenderId", key as string);
          }}
          items={accountList || []}
          label="Search an account"
        >
          {item => (
            <AutocompleteItem key={item.id}>{item.tagName}</AutocompleteItem>
          )}
        </Autocomplete>

        <Input
          {...register("description")}
          label="Description"
          type="text"
          errorMessage={errors?.description?.message}
        />
        <Input
          {...register("amount.value")}
          value={getValues("amount.value") ?? ""}
          onChange={e => {
            const raw = e.target.value;

            const validCharacters = /^(\d+)?(\.\d{0,2})?$/;

            if (raw === "" || validCharacters.test(raw)) {
              setValue("amount.value", raw, { shouldValidate: true });
            }
          }}
          label="Amount"
          errorMessage={errors.amount?.message}
          endContent={
            <div className="flex items-center">
              <label className="sr-only" htmlFor="amount.currency">
                Currency
              </label>
              <select
                {...register("amount.currency")}
                className="outline-none border-0 bg-transparent text-default-400 text-small"
                id="amount.currency"
              >
                {Object.keys(Currency).map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          }
        />
        <Select
          label="Category"
          selectionMode="single"
          selectedKeys={selectedCategoryId ? [selectedCategoryId] : []}
          onSelectionChange={handleCategoryChange}
          errorMessage={errors?.category?.message}
          isInvalid={!!errors?.category}
          isLoading={categoriesLoading}
          disabled={categoriesLoading}
        >
          {categories.map(item => {
            const Icon = Icons[item.icon as keyof typeof Icons];
            return (
              <SelectItem
                key={item.id}
                startContent={<Icon className="w-4 h-4" />}
              >
                {item.title}
              </SelectItem>
            );
          })}
        </Select>
        <DatePicker
          label="Pay date"
          errorMessage={errors?.payDate?.message}
          isInvalid={!!errors?.payDate}
          minValue={today(getLocalTimeZone()) as unknown as DateValue}
          onChange={val => {
            if (val) {
              setValue("payDate", val.toDate(getLocalTimeZone()));
            }
          }}
          value={
            selectedPayDate
              ? convertToCalendarDate(watch("payDate"))
              : undefined
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          disabled={submitLoading}
          isLoading={submitLoading}
          fullWidth
        >
          {onRemove ? "Update Debt" : "Add Debt"}
        </Button>
        {onRemove && (
          <Button
            type="button"
            variant="bordered"
            color="danger"
            onClick={onRemove}
            disabled={removeLoading}
            isLoading={removeLoading}
            fullWidth
          >
            Remove Debt
          </Button>
        )}
      </div>
    </form>
  );
}
