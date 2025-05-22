import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import type { NavItem } from "@/types"
import { Link } from "@inertiajs/react"
import { useSidebar } from "@/components/ui/sidebar"

interface NavMainProps {
  items: (NavItem & { disabled?: boolean; onClick?: () => void; isActive?: boolean })[]
  onNavigate?: () => void
  isMobile?: boolean // Added isMobile prop
}

export function NavMain({ items, onNavigate, isMobile = false }: NavMainProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  
  return (
    <SidebarMenu>
      {items.map((item, index) => (
        <SidebarMenuItem key={item.title + index} disabled={item.disabled}>
          {!item.onClick ? (
            <SidebarMenuButton
              asChild
              className={`relative ${item.isActive ? 'menu-item-active' : ''} ${item.disabled ? 'disabled' : ''}`}
            >
              <Link
                href={item.href}
                className={`flex items-center w-full ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                onClick={() => onNavigate?.()}
              >
                <item.icon className={`h-4 w-4 ${item.disabled ? 'lock-icon-disabled' : 'text-[#9645f4] dark:text-[#c79dff]'}`} />
                {(!isCollapsed || isMobile) && (
                  <span className={`sidebar-menu-button-text ${item.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {item.title}
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          ) : (
            // Para elementos con onClick, no usar asChild y pasar directamente el onClick
            <SidebarMenuButton
              onClick={item.onClick}
              className={`relative ${item.isActive ? 'menu-item-active' : ''} ${item.disabled ? 'disabled' : ''}`}
            >
              <div className={`flex items-center w-full ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
                <item.icon className={`h-4 w-4 ${item.disabled ? 'lock-icon-disabled' : 'text-[#9645f4] dark:text-[#c79dff]'}`} />
                {(!isCollapsed || isMobile) && (
                  <span className={`sidebar-menu-button-text ${item.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {item.title}
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
