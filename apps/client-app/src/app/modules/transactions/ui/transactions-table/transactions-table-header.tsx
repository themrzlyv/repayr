import { FilterIcon } from "@/app/assets/icons";
import { Button, ButtonGroup, Input } from "@heroui/react";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
};

export function TransactionsTableHeader({ searchQuery, setSearchQuery }: Props) {
  return (
    <div className="w-full flex justify-between">
      <div>
        <ButtonGroup variant="bordered" size="sm">
          <Button>All</Button>
          <Button>Month</Button>
          <Button>Today</Button>
        </ButtonGroup>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="Search"
          onChange={e => setSearchQuery(e.target.value)}
          value={searchQuery}
          size="sm"
        />
        <div>
          <Button
            variant="bordered"
            color="primary"
            size="sm"
            startContent={<FilterIcon width={20} height={20} />}
          >
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
