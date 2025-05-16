import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import type { NavItem } from "@/types"
import { Link } from "@inertiajs/react"
import { usePage } from "@inertiajs/react"
import { useSidebar } from "@/components/ui/sidebar"

interface NavMainProps {
  items: (NavItem & { disabled?: boolean; onClick?: () => void; isActive?: boolean })[]
  onNavigate?: () => void
}

export function NavMain({ items, onNavigate }: NavMainProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  
  return (
    <SidebarMenu>
      {items.map((item, index) => (
        <SidebarMenuItem key={item.title + index} disabled={item.disabled}>
          <SidebarMenuButton
            asChild={!item.onClick}
            onClick={item.onClick}
            className={`relative ${item.isActive ? 'menu-item-active' : ''}`}
          >
            {!item.onClick ? (
              <Link
                href={item.href}
                className={`flex items-center w-full ${isCollapsed ? 'justify-center' : ''}`}
                onClick={() => onNavigate?.()}
              >
                <item.icon className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff]" />
                {!isCollapsed && (
                  <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300">
                    {item.title}
                  </span>
                )}
              </Link>
            ) : (
              <button className={`flex items-center w-full ${isCollapsed ? 'justify-center' : ''}`}>
                <item.icon className="h-4 w-4 text-[#9645f4] dark:text-[#c79dff]" />
                {!isCollapsed && (
                  <span className="sidebar-menu-button-text text-gray-700 dark:text-gray-300">
                    {item.title}
                  </span>
                )}
              </button>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
