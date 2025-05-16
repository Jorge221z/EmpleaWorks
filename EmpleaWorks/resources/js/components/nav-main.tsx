import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import type { NavItem } from "@/types"
import { Link } from "@inertiajs/react"

interface NavMainProps {
  items: (NavItem & { disabled?: boolean; onClick?: () => void; isActive?: boolean })[]
  onNavigate?: () => void
}

export function NavMain({ items, onNavigate }: NavMainProps) {
  return (
    <SidebarMenu>
      {items.map((item, index) => (
        <SidebarMenuItem key={item.title + index} disabled={item.disabled}>
          <SidebarMenuButton
            asChild={!item.onClick}
            onClick={item.onClick}
            className={`relative group ${item.isActive ? 'menu-item-active' : ''}`}
          >
            {!item.onClick ? (
              <Link
                href={item.href}
                className="flex items-center w-full"
                onClick={() => onNavigate?.()}
              >
                <item.icon className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff]" />
                <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300">
                  {item.title}
                </span>
              </Link>
            ) : (
              <button className="flex items-center w-full">
                <item.icon className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff]" />
                <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300">
                  {item.title}
                </span>
              </button>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
