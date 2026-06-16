import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EmployeesListView } from "@/components/app/EmployeesListView";
import { relId } from "@/lib/app/helpers";
import { buildLocationListWhere } from "@/lib/app/location-filters";
import { findById } from "@/lib/app/queries";
import type { Location } from "@/payload-types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    limit?: string;
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function LocationEmployeesPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const location = await findById<Location>("locations", id);

  if (!location) {
    notFound();
  }

  const companyId = relId(location.company);
  if (!companyId) {
    notFound();
  }

  const listParams = await searchParams;
  const where = buildLocationListWhere(
    "employees",
    location.id,
    companyId,
    listParams.q?.trim() ?? ""
  );

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
