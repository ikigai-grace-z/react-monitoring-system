import { useLocation } from '@tanstack/react-router'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/features/ui/breadcrumb'
import { Separator } from '@/features/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/features/ui/sidebar'

import LayoutSidebar from './layout-sidebar'

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/live-stream': 'Live Stream',
  '/time-shifting': 'Time Shifting',
  '/vod': 'Video on Demand',
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const currentPath = location.pathname
  const pageTitle = routeLabels[currentPath] || 'Monitoring System'

  return (
    <SidebarProvider className="overflow h-150 w-auto">
      <LayoutSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Monitoring System</BreadcrumbLink>
              </BreadcrumbItem>
              {currentPath !== '/' && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="scrollbar-hide flex-1 overflow-auto p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
