"use client";

import {
  RiArrowRightSLine,
  RiExpandUpDownLine,
  RiMenuLine,
  RiSearchLine,
  RiSettingsLine,
} from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Avatar from "@/components/ui/avatar";
import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import * as Dropdown from "@/components/ui/dropdown";
import { isMrNavActive, MR_NAV } from "@/lib/mockups/mr/navigation";
import { cn } from "@/utils/cn";

export default function MrLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <aside className="fixed top-0 left-0 z-40 hidden h-full w-[272px] overflow-hidden border-stroke-soft-200 border-r bg-bg-white-0 transition-all-default duration-300 lg:block">
        <div className="flex h-full w-[272px] min-w-[272px] flex-col overflow-auto">
          <div className="w-full lg:p-3">
            <Dropdown.Root>
              <Dropdown.Trigger className="flex w-full items-center gap-3 whitespace-nowrap p-3 text-left outline-none transition-all-default focus:outline-none">
                <Avatar.Root placeholderType="company" size="48" />
                <div className="flex w-[172px] shrink-0 items-center gap-3 transition duration-300">
                  <div className="flex-1 space-y-1">
                    <div className="text-label-sm text-text-strong-950">
                      Catalyst
                    </div>
                    <div className="text-paragraph-xs text-text-sub-600">
                      Marketing &amp; Sales
                    </div>
                  </div>
                  <div className="flex size-6 items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
                    <RiExpandUpDownLine className="size-4 text-text-sub-600" />
                  </div>
                </div>
              </Dropdown.Trigger>
            </Dropdown.Root>
          </div>
          <div className="px-5">
            <Divider.Root />
          </div>
          <div className="flex flex-1 flex-col gap-5 px-5 pt-5 pb-4">
            {MR_NAV.map((group) => (
              <div className="space-y-2" key={group.label}>
                <p className="p-1 text-subheading-xs text-text-soft-400 uppercase">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = isMrNavActive(pathname, item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        className={cn(
                          "group/tab-item relative flex w-full justify-between rounded-lg p-2 text-left text-label-sm text-text-sub-600 outline-none transition duration-200 ease-out hover:bg-bg-weak-50 focus:outline-none",
                          isActive && "bg-bg-weak-50 text-text-strong-950"
                        )}
                        href={item.href}
                        key={item.href}
                      >
                        <div
                          className={cn(
                            "absolute top-1/2 -left-5 h-5 w-1 origin-left -translate-y-1/2 rounded-r-full bg-primary-base transition duration-200 ease-out",
                            isActive ? "scale-100" : "scale-0"
                          )}
                        />
                        <div className="flex flex-1 items-center gap-1.5">
                          <Icon
                            className={cn(
                              "size-5 text-text-sub-600 transition duration-200 ease-out",
                              isActive && "text-primary-base"
                            )}
                          />
                          {item.label}
                        </div>
                        <RiArrowRightSLine
                          className={cn(
                            "size-5 scale-75 rounded-full bg-bg-white-0 p-px text-text-sub-600 opacity-0 shadow-regular-xs transition ease-out",
                            isActive && "scale-100 opacity-100"
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="space-y-2" />
          </div>
        </div>
      </aside>
      <div className="hidden w-[272px] shrink-0 lg:block" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[60px] w-full items-center justify-between border-stroke-soft-200 border-b px-4 lg:hidden">
          <Link href="/mockups/mr">
            <Avatar.Root placeholderType="company" size="40" />
          </Link>
          <div className="flex gap-3">
            <Button.Root mode="ghost" variant="neutral">
              <Button.Icon as={RiSearchLine} />
            </Button.Root>
            <Button.Root mode="ghost" variant="neutral">
              <Button.Icon as={RiSettingsLine} />
            </Button.Root>
            <div className="flex w-1 shrink-0 items-center before:h-full before:w-px before:bg-stroke-soft-200" />
            <Button.Root mode="ghost" variant="neutral">
              <Button.Icon as={RiMenuLine} />
            </Button.Root>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
