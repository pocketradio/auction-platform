import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Gavel, CircleDollarSign, Settings, LayoutDashboard, User2, ChevronUp } from "lucide-react"

const items = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard
    },

    {
        title: 'Auctions',
        url: '/auctions',
        icon: Gavel,
    },
    {
        title: 'Your bids',
        url: '/bids',
        icon: CircleDollarSign,
    },
    {
        title: 'Create Auction',
        url: '/create',
        icon: Settings
    }
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarGroupLabel> Auction Service </SidebarGroupLabel>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton suppressHydrationWarning={true}>
                                    <User2 /> Username
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">

                                <DropdownMenuItem>
                                    <span>Account Details</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <span>Sign out</span>
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}