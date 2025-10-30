'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ChevronDown, PhoneCall } from 'lucide-react'
import { NavBar } from './main-header/nav-bar'
import ListIcons from './main-header/list-icons'
import HoverButton from '../shared/hover-button'
import { usePathname } from '@/src/i18n/navigation'
import { cn } from '@/lib/utils'

const MainHeader = () => {
    const [isSticky, setIsSticky] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/" || pathname.match(/^\/[a-z]{2}$/); // hỗ trợ /de, /en...

    useEffect(() => {
        if (!isHome) return; // chỉ chạy khi ở trang chủ

        const handleScroll = () => {
            const bannerHeight = window.innerHeight * 0.5; // 1/2 banner
            setIsSticky(window.scrollY > bannerHeight);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome]);

    return (
        <header
            className={cn(
                "transition-all duration-500 w-full z-50",
                isHome
                    ? isSticky
                        ? // Khi sticky: fixed + hiện ra
                        "fixed top-0 left-0 bg-white text-black shadow-md opacity-100 translate-y-0 z-50"
                        : // Khi chưa sticky: ẩn + không fixed
                        "absolute top-10 bg-transparent text-white opacity-1000 -translate-y-10 z-50"
                    : "fixed top-0 left-0 bg-white text-black shadow-md"
            )}
        >
            <div className='flex gap-32 md:px-20 px-4 min-h-[100px] items-center'>
                <Image
                    src={'/econelo-logo.png'}
                    alt='Econelo Logo'
                    width={200}
                    height={70}
                    className='object-contain'
                />
                <div className='flex flex-1 justify-between gap-4 items-center'>
                    <div className='flex items-center gap-8'>
                        <NavBar />
                        <ListIcons />
                    </div>
                    <div className='flex items-center gap-8'>
                        <div className='flex items-center gap-2'>
                            <PhoneCall className='text-black' />
                            <div className='font-semibold text-xl text-black'>+49 1520 6576540</div>
                        </div>
                        <HoverButton text='Get a quote' redirect_url='' />
                    </div>
                </div>
            </div>
        </header>

    )
}

export default MainHeader