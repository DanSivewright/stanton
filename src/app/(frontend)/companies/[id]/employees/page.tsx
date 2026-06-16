import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EmployeesListView } from "@/components/app/EmployeesListView";
import { buildCompanyListWhere } from "@/lib/app/company-filters";
import { findById } from "@/lib/app/queries";
import type { Company } from "@/payload-types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    limit?: string;
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function CompanyEmployeesPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const company = await findById<Company>("companies", id);

  if (!company) {
    notFound();
  }

  const listParams = await searchParams;
  const where = buildCompanyListWhere("employees", company.id, listParams.q?.trim() ?? "");

  return (
    <Suspense
      fallback={
        <div className="h-48 animate-pulse rounded-xl bg-bg-weak-50" />
      }
    >
      <EmployeesListView
        placeholder="Search employees..."
        searchParams={listParams}
        where={where}
      />
    </Suspense>
  );
}
