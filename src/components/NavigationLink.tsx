"use client";

import Link, { useLinkStatus } from "next/link";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";

function PendingIndicator() {
  const { pending } = useLinkStatus();
  return <span className="navigation-indicator" data-pending={pending}>
    <LoaderCircle size={16} aria-hidden="true" />
    {pending && <span role="status" className="sr-only">Loading page…</span>}
  </span>;
}

export default function NavigationLink({ children, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props}>{children}<PendingIndicator /></Link>;
}
