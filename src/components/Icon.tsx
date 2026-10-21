import type { SVGProps } from "react";
import { ArrowRight, Box, Flag, Grid2X2, List, Pencil, Plus, Search } from "lucide-react";

type IconName = "search" | "arrow" | "plus" | "grid" | "list" | "flag" | "box" | "edit";
const icons = { search: Search, arrow: ArrowRight, plus: Plus, grid: Grid2X2, list: List, flag: Flag, box: Box, edit: Pencil };

export default function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  const Component = icons[name];
  return <Component width="20" height="20" strokeWidth={1.7} aria-hidden="true" {...props} />;
}
