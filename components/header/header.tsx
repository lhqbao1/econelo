'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { PhoneCall } from 'lucide-react'
import { NavBar } from './main-header/nav-bar'
import ListIcons from './main-header/list-icons'
import HoverButton from '../shared/hover-button'
import { usePathname } from '@/src/i18n/navigation'
import { cn } from '@/lib/utils'

const MainHeader = () => {
    const [isSticky, setIsSticky] = useState(false)
    const pathname = usePathname()
    const isHome = pathname === '/' || pathname.match(/^\/[a-z]{2}$/)

    useEffect(() => {
        const handleScroll = () => {
            const threshold = isHome ? window.innerHeight * 0.5 : 100
            setIsSticky(window.scrollY > threshold)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isHome])

    return (
        <header
            className={cn(
                'transition-all duration-500 w-full z-50 transform',
                isHome
                    ? isSticky
                        ? // 🟢 Home sticky
                        'fixed top-0 left-0 bg-white text-black shadow-md opacity-100 translate-y-0'
                        : // ⚪ Home default
                        'absolute top-10 bg-transparent text-white opacity-100 -translate-y-10'
                    : isSticky
                        ? // 🟢 Non-home sticky
                        'fixed top-0 left-0 bg-white text-black shadow-md translate-y-0'
                        : // ⚪ Non-home default (relative + slide lên nhẹ)
                        'block top-0 left-0 bg-white text-black shadow-md -translate-y-0'
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
                            <div className='font-semibold text-xl text-black'>
                                +49 1520 6576540
                            </div>
                        </div>
                        <HoverButton text='Get a quote' redirect_url='' />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default MainHeader
