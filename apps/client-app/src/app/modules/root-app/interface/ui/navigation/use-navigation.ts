import { useMutation, useQuery } from "@tanstack/react-query";
import { accountInfoQueryOption } from "@/app/modules/account/infra/query-options/account-info.query-option";
import { logoutMutationOption } from "@/app/modules/auth/infra/mutation-options/logout.mutation-option";
import { updateAccountMutationOption } from "@/app/modules/account/infra/mutation-options/update-account.mutation-option";
import type { CurrencyEnum } from "@/app/modules/transactions/domain/enums/currency.enum";

export function useNavigation() {
  const { data: account, isLoading } = useQuery(accountInfoQueryOption());
  const { mutateAsync: logoutMutate } = useMutation(logoutMutationOption());
  const { mutateAsync: updateAccount } = useMutation(
    updateAccountMutationOption()
  );

  const fullName = [account?.firstName, account?.lastName]
    .filter(Boolean)
    .join(" ");

  const handleLogout = async () => {
    await logoutMutate();
  };

  const handleChangeCurrency = async (currency: CurrencyEnum) => {
    await updateAccount({ currency });
  };

  return {
    account,
    isLoading,
    fullName,
    handleLogout,
    handleChangeCurrency,
  };
}
