'use client'

import * as React from 'react'
import Image from 'next/image'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import LightRays from '@/components/LightRays'
import type { CarouselApi } from '@/components/ui/carousel' // kiểu type có sẵn trong shadcn

const variants = [
    { name: 'Forest Green', price: 3999, image: '/category-section-image-1.png', color: 'text-green-400' },
    { name: 'Yellow Sun', price: 4299, image: '/category-section-image-2.png', color: 'text-yellow-400' },
    { name: 'Blue Sky', price: 4599, image: '/category-section-image-3.png', color: 'text-blue-400' },
    { name: 'Forest Green', price: 3999, image: '/category-section-image-1.png', color: 'text-green-400' },
    { name: 'Yellow Sun', price: 4299, image: '/category-section-image-2.png', color: 'text-yellow-400' },
    { name: 'Blue Sky', price: 4599, image: '/category-section-image-3.png', color: 'text-blue-400' },
]

export default function VariantPriceSection() {
    const [carouselApi, setCarouselApi] = React.useState<CarouselApi>()
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    // Theo dõi khi chuyển slide
    React.useEffect(() => {
        if (!carouselApi) return

        const onSelect = () => {
            setSelectedIndex(carouselApi.selectedScrollSnap())
        }

        carouselApi.on('select', onSelect)
        onSelect()

        return () => {
            carouselApi.off('select', onSelect)
        }
    }, [carouselApi])

    return (
        <section className="w-full bg-[#171717] text-white flex flex-col items-center justify-start py-24 overflow-hidden min-h-[calc(100vh-100px)] relative">
            {/* Background LightRays */}
            <div className="w-full min-h-[calc(100vh-100px)] absolute top-0 left-0 pointer-events-none overflow-hidden z-10">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#d3e6ba"
                    raysSpeed={1.5}
                    lightSpread={0.8}
                    rayLength={1.2}
                    followMouse
                    mouseInfluence={0.1}
                    noiseAmount={0.1}
                    distortion={0.05}
                    className="custom-rays"
                />
            </div>

            {/* Header */}
            <div className="text-center mb-16 space-y-2 relative z-20">
                <span className="text-sm text-gray-400 tracking-wide uppercase">Choose</span>
                <h2 className="text-3xl md:text-4xl font-bold">Variant & Price</h2>
            </div>

            {/* Carousel */}
            <Carousel
                opts={{
                    align: 'center',
                    loop: true,
                }}
                setApi={setCarouselApi} // 👈 Lấy instance của Embla API ở đây
                className="w-full relative"
            >
                <CarouselContent className="-ml-96">
                    {variants.map((variant, index) => (
                        <CarouselItem
                            key={index}
                            className="basis-full md:basis-1/2 lg:basis-1/3 pl-96 transition-transform duration-500"
                        >
                            <div
                                className={cn(
                                    'flex flex-col items-center justify-center transition-all duration-700 p-6 rounded-3xl cursor-pointer',
                                    index === selectedIndex
                                        ? 'scale-120 opacity-100 z-30'
                                        : 'scale-90 opacity-60 z-0'
                                )}
                            >
                                <div className="relative w-[900px] h-[500px] mb-6">
                                    <Image src={variant.image} alt={variant.name} fill className="object-contain" />
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="text-base font-semibold">{variant.name}</h3>
                                    <p className={cn('text-sm font-medium', variant.color)}>
                                        ${variant.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Arrows */}
                <CarouselPrevious className="absolute left-2 md:left-1/3 top-1/2 -translate-y-1/2 bg-primary hover:bg-white/20 backdrop-blur-sm text-white rounded-full w-10 h-10 border-none z-50" />
                <CarouselNext className="absolute right-2 md:right-1/3 top-1/2 -translate-y-1/2 bg-primary hover:bg-white/20 backdrop-blur-sm text-white rounded-full w-10 h-10 border-none z-50" />
            </Carousel>
        </section>
    )
}
