'use client'

import Image from "next/image"
import { Gauge, Zap, Route } from "lucide-react"
import { ProductItem } from "@/types/products"
import { ProductGroupDetailResponse } from "@/types/product-group"

interface ProductOverviewProps {
    productDetailsData: ProductItem
    productId: string
    parentProductData: ProductGroupDetailResponse | null
}

export default function ProductOverview({ productDetailsData, productId, parentProductData }: ProductOverviewProps) {
    return (
        <section className="w-full flex justify-center py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="w-11/12 lg:w-9/12 grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* === LEFT MAIN IMAGE (2 rows high) === */}
                <div className="lg:col-span-2 bg-black/90 rounded-3xl overflow-hidden relative flex flex-col justify-end">
                    <div className="absolute inset-0">
                        <Image
                            src={productDetailsData.static_files[0].url || '/placeholder-image.png'}
                            alt="E-scooter"
                            fill
                            className="object-cover opacity-90"
                        />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                    <div className="relative z-10 p-8">
                        <h1 className="text-xl md:text-4xl font-bold text-white leading-tight max-w-xl">
                            {parentProductData ? parentProductData.name : productDetailsData.name}
                        </h1>
                    </div>
                </div>

                {/* === RIGHT GREEN CARD === */}
                <div className="bg-primary text-white rounded-3xl flex flex-col justify-center items-start p-10">
                    <h3 className="text-base font-semibold mb-2">Autoev R200</h3>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Redefining <br /> Motorcycle <br /> Performance
                    </h2>
                </div>

                {/* === BOTTOM STATS GRID === */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Range */}
                    <div className="bg-black text-white rounded-3xl p-8 flex flex-col items-center justify-center">
                        <Route className="w-8 h-8 text-primary mb-3" />
                        <div className="text-2xl font-semibold">130 KM</div>
                        <div className="text-gray-400 text-sm mt-1">Range</div>
                    </div>

                    {/* Speed */}
                    <div className="bg-black text-white rounded-3xl p-8 flex flex-col items-center justify-center">
                        <Gauge className="w-8 h-8 text-primary mb-3" />
                        <div className="text-2xl font-semibold">70 Km/h</div>
                        <div className="text-gray-400 text-sm mt-1">Top Speed</div>
                    </div>

                    {/* Power */}
                    <div className="bg-black text-white rounded-3xl p-8 flex flex-col items-center justify-center">
                        <Zap className="w-8 h-8 text-primary mb-3" />
                        <div className="text-2xl font-semibold">3500 Watt</div>
                        <div className="text-gray-400 text-sm mt-1">Motor Power</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
