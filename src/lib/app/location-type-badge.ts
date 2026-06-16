import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiBuilding2Line,
  RiFolderLine,
  RiLayoutGridLine,
  RiMapPinLine,
  RiStackLine,
} from "@remixicon/react";
import type { LocationKind } from "@/lib/constants/locationKinds";
import type { Location } from "@/payload-types";

export type LocationBadgeColor =
  | "gray"
  | "blue"
  | "orange"
  | "red"
  | "green"
  | "yellow"
  | "purple"
  | "sky"
  | "pink"
  | "teal";

export interface LocationTypeMeta {
  color: LocationBadgeColor;
  icon: RemixiconComponentType;
  label: string;
}

const GROUP_TYPE: LocationTypeMeta = {
  label: "Group",
  color: "purple",
  icon: RiFolderLine,
};

const SITE_TYPE: LocationTypeMeta = {
  label: "Location Leaf",
  color: "blue",
  icon: RiMapPinLine,
};

export const LOCATION_KIND_META: Record<LocationKind, LocationTypeMeta> = {
  region: { label: "Region", color: "sky", icon: RiStackLine },
  building: { label: "Building", color: "blue", icon: RiBuilding2Line },
  floor: { label: "Floor", color: "purple", icon: RiLayoutGridLine },
  zone: { label: "Zone", color: "orange", icon: RiLayoutGridLine },
};

export function getLocationStructureType(
  location: Pick<Location, "isGroup">
): LocationTypeMeta {
  return location.isGroup ? GROUP_TYPE : SITE_TYPE;
}

export function getLocationKindType(
  kind: Location["kind"]
): LocationTypeMeta | null {
  if (!kind) {
    return null;
  }
  return LOCATION_KIND_META[kind];
}
