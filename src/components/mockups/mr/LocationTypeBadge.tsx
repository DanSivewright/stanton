import * as Badge from "@/components/ui/badge";
import type { LocationTypeMeta } from "@/lib/mockups/mr/location-type-badge";

interface LocationTypeBadgeProps {
  meta: LocationTypeMeta;
  size?: "small" | "medium";
}

export function LocationTypeBadge({
  meta,
  size = "small",
}: LocationTypeBadgeProps) {
  const Icon = meta.icon;

  return (
    <Badge.Root color={meta.color} size={size} variant="lighter">
      <Badge.Icon as={Icon} />
      {meta.label}
    </Badge.Root>
  );
}
