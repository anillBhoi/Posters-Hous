import Link from "next/link";
import { forwardRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  children?: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, href, children, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
      <Link href={href} {...props}>
        <a ref={ref} className={cn(className, isActive && activeClassName)}>
          {children}
        </a>
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
