"use client";

import { RiSearchLine } from "@remixicon/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import * as Input from "@/components/ui/input";
import * as Select from "@/components/ui/select";

const LIMIT_OPTIONS = [
  { value: "10", label: "10 per page" },
  { value: "20", label: "20 per page" },
  { value: "50", label: "50 per page" },
] as const;

interface SortOption {
  label: string;
  value: string;
}

interface CollectionToolbarProps {
  defaultLimit: number;
  defaultQuery: string;
  defaultSort: string;
  placeholder: string;
  sortOptions: readonly SortOption[];
}

function setParam(
  params: URLSearchParams,
  key: string,
  value: string | null,
  resetPage = true
) {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  if (resetPage) {
    params.delete("page");
  }
}

export function CollectionToolbar({
  defaultQuery,
  defaultSort,
  defaultLimit,
  placeholder,
  sortOptions,
}: CollectionToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed === defaultQuery) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      setParam(params, "q", trimmed || null);
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query, defaultQuery, pathname, router, searchParams]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    setParam(params, key, value);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3 py-6 md:flex-row">
      <Input.Root className="flex-1 shrink">
        <Input.Wrapper>
          <Input.Icon as={RiSearchLine} />
          <Input.Input
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            value={query}
          />
        </Input.Wrapper>
      </Input.Root>
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <Select.Root
          onValueChange={(value) => updateParam("sort", value)}
          value={defaultSort}
        >
          <Select.Trigger className="w-fit">
            <Select.Value placeholder="Sort by" />
          </Select.Trigger>
          <Select.Content>
            {sortOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Select.Root
          onValueChange={(value) => updateParam("limit", value)}
          value={String(defaultLimit)}
        >
          <Select.Trigger className="w-fit">
            <Select.Value placeholder="Page size" />
          </Select.Trigger>
          <Select.Content>
            {LIMIT_OPTIONS.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  );
}
