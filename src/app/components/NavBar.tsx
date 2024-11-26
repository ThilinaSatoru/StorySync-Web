import React from 'react';
import Link from "next/link";
import { Bell, ChevronDown, LayoutDashboard, LineChart, Settings, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from '@/components/theme-toggle';

const analyticsItems = [
    {
        title: "Dashboard",
        href: "/pages/admin",
        description: "Comprehensive overview of your business metrics and KPIs.",
    },
    {
        title: "Videos",
        href: "/pages/tube",
        description: "Detailed analysis of your system's performance and usage statistics.",
    },
    {
        title: "Stories",
        href: "/pages/pdf",
        description: "In-depth insights about user behavior and engagement patterns.",
    },
];

const productsItems = [
    {
        title: "Product Catalog",
        href: "/products/catalog",
        description: "Browse and manage your complete product inventory.",
    },
    {
        title: "Inventory Management",
        href: "/products/inventory",
        description: "Track stock levels, orders, and supply chain metrics.",
    },
    {
        title: "Product Analytics",
        href: "/products/analytics",
        description: "Detailed insights about product performance and sales.",
    },
];

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

const Navbar = () => {
    return (
        <div className="w-full bg-background">
            <div className="h-14 px-4 flex items-center justify-between max-w-screen-2xl mx-auto border-b">
                {/* Left section - Logo and main nav */}
                <div className="flex items-center space-x-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-auto rounded-lg flex items-center justify-center">
                            <span className="font-semibold">
                                <img src="/file.png" alt="Logo" className="w-auto h-8" />
                            </span>
                        </div>
                    </Link>

                    {/* Main Navigation */}
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList className="space-x-2">
                            <NavigationMenuItem>
                                <Link href="/pages/admin" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        Dashboard
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    <LineChart className="h-4 w-4 mr-2" />
                                    Analytics
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-[#EA7689] bg-opacity-70">
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                        {analyticsItems.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href={item.href}
                                            >
                                                {item.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    <Package className="h-4 w-4 mr-2" />
                                    Products
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                        {productsItems.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href={item.href}
                                            >
                                                {item.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/settings" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right section - Theme toggle and profile */}
                <div className="flex items-center space-x-2">
                    <ModeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 px-2">
                                <img
                                    src="/avatars/shadcn.jpg"
                                    alt="Profile"
                                    className="w-6 h-6 rounded-full mr-2"
                                />
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default Navbar;