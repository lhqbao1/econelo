import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface HoverButtonProps {
    text: string
    redirect_url: string
    is_primary?: boolean
}

const HoverButton = ({ text, redirect_url, is_primary = false }: HoverButtonProps) => {
    return (
        <Link href={redirect_url} passHref>
            <div
                className={cn('flex gap-2 w-fit items-center text-center bg-black px-16 group py-4 rounded-tl-3xl rounded-br-3xl cursor-pointer hover:rounded-tl-none hover:rounded-br-none hover:rounded-tr-3xl hover:bg-white transition-all duration-500',
                    is_primary ? 'hover:bg-primary' : ''
                )}>
                <span className="text-white text-sm uppercase font-semibold group-hover:text-black transition-all duration-500">
                    {text}
                </span>
                <ArrowRight className="text-white group-hover:text-black transition-all duration-500" />
            </div>
        </Link>
    )
}

export default HoverButton
