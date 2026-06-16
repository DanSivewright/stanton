"use client";

import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as Pagination from "@/components/ui/pagination";

function buildPageNumbers(current: number, total: number): number[] {
  if (total <= 1) {
    return [1];
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);

  return [...pages]
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= total)
    .sort((a, b) => a - b);
}

interface DataTablePaginationProps {
  page: number;
  pageCount: number;
}

export function DataTablePagination({
  page,
  pageCount,
}: DataTablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pageCount <= 1) {
    return null;
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  const pageNumbers = buildPageNumbers(page, pageCount);

  return (
    <div className="mt-6 flex justify-center">
      <Pagination.Root>
        <Pagination.NavButton
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
        >
          <Pagination.NavIcon as={RiArrowLeftSLine} />
        </Pagination.NavButton>

        {pageNumbers.map((pageNumber, index) => {
          const previous = pageNumbers[index - 1];
          const showEllipsis = previous != null && pageNumber - previous > 1;

          return (
            <span className="contents" key={pageNumber}>
              {showEllipsis ? (
                <Pagination.Item aria-hidden disabled>
                  …
                </Pagination.Item>
              ) : null}
              <Pagination.Item
                aria-label={`Page ${pageNumber}`}
                current={pageNumber === page}
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            </span>
          );
        })}

        <Pagination.NavButton
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => goToPage(page + 1)}
        >
          <Pagination.NavIcon as={RiArrowRightSLine} />
        </Pagination.NavButton>
      </Pagination.Root>
    </div>
  );
}
