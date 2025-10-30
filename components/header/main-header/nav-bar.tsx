"use client"

import * as React from "react"
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"
import { useMediaQuery } from 'react-responsive'

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavBar() {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    return (
        <NavigationMenu viewport={isMobile}>
            <NavigationMenuList className="flex-wrap">
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="uppercase font-semibold bg-transparent text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent">Pages</NavigationMenuTrigger>
                    <NavigationMenuContent className="rounded-xs">
                        <ul className="grid gap-2 md:w-[400px] lg:w-[300px]">
                            <ListItem href="/" title="ABOUT US">
                            </ListItem>
                            <ListItem href="/" title="OUR HISTORY">
                            </ListItem>
                            <ListItem href="/" title="FAQ">
                            </ListItem>
                            <ListItem href="/" title="SHOP">
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="uppercase font-semibold bg-transparent text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent">
                        Services
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="rounded-xs">
                        <ul className="grid gap-2 md:w-[400px] lg:w-[300px]">
                            <ListItem href="/" title="ABOUT US">
                            </ListItem>
                            <ListItem href="/" title="OUR HISTORY">
                            </ListItem>
                            <ListItem href="/" title="FAQ">
                            </ListItem>
                            <ListItem href="/" title="SHOP">
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="uppercase font-semibold bg-transparent text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent">
                        Gallery
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="rounded-xs">
                        <ul className="grid gap-2 md:w-[400px] lg:w-[300px]">
                            <ListItem href="/" title="ABOUT US">
                            </ListItem>
                            <ListItem href="/" title="OUR HISTORY">
                            </ListItem>
                            <ListItem href="/" title="FAQ">
                            </ListItem>
                            <ListItem href="/" title="SHOP">
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="uppercase font-semibold bg-transparent text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent">
                        BLOG
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="rounded-xs">
                        <ul className="grid gap-2 md:w-[400px] lg:w-[300px]">
                            <ListItem href="/" title="ABOUT US">
                            </ListItem>
                            <ListItem href="/" title="OUR HISTORY">
                            </ListItem>
                            <ListItem href="/" title="FAQ">
                            </ListItem>
                            <ListItem href="/" title="SHOP">
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem className="hidden md:block">
                    <NavigationMenuTrigger hasIcon={false} className="uppercase bg-transparent font-semibold text-sm hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:bg-transparent">
                        Contact us
                    </NavigationMenuTrigger>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}


function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild className="group/item block">
                <Link
                    href={href}
                    className="pl-8 py-5 transition-all duration-300"
                >
                    <div className="text-black text-md leading-none font-semibold transition-all duration-400 group-hover/item:pl-2 group-hover/item:text-primary">
                        {title}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-md leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}

