'use client'

import { useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Command, CommandItem, CommandList, CommandEmpty, CommandGroup } from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLocale, useTranslations } from 'next-intl'
import { useGetProductsSelect } from '@/features/product-group/hook'
import Image from 'next/image'
import { useRouter } from '@/src/i18n/navigation'

export default function SearchDropdown() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()

    const { data: products, isLoading, isError } = useGetProductsSelect()

    const filteredProducts = products?.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Search
                    className='text-primary size-7 cursor-pointer'
                    onClick={() => setOpen(true)}
                />
            </PopoverTrigger>

            <PopoverContent align='end' className='md:w-140 w-full p-2'>
                {/* Ô input */}
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className='mb-2 h-12 md:text-base'
                    autoFocus
                />

                {/* Dropdown kết quả */}
                <ScrollArea className='h-150 overflow-y-scroll'>
                    <Command>
                        <CommandList className='max-h-none'>
                            {isLoading || !filteredProducts && <Loader2 className='animate-spin' />}

                            {query.length > 0 && filteredProducts?.length === 0 && (
                                <CommandEmpty>{t('noResult')}</CommandEmpty>
                            )}

                            {filteredProducts && filteredProducts?.length > 0 && (
                                <CommandGroup className='h-full'>
                                    {filteredProducts?.map((product) => (
                                        <CommandItem
                                            key={product.id}
                                            onSelect={() => {
                                                setOpen(false)
                                                router.push(`/produkt/${product.url_key}`, { locale: locale })
                                            }}
                                            className='cursor-pointer'
                                        >
                                            <div className='flex gap-4 items-start py-2'>
                                                <Image
                                                    src={product.static_files.length > 0 ? product.static_files[0].url : '/placeholder.png'}
                                                    alt={product.name}
                                                    width={70}
                                                    height={70}
                                                    className='object-cover rounded-md'
                                                />
                                                <div className='space-y-1.5'>
                                                    <div className='text-[#0073aa] text-lg font-medium'>{product.name}</div>

                                                    <div className='flex items-center gap-2'>
                                                        <div className='text-gray-300 text-base line-through'>
                                                            {(product.price ?? product.final_price)?.toLocaleString('de-DE', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })} €
                                                        </div>

                                                        <div className='font-black text-black text-base'>
                                                            {product.final_price.toLocaleString('de-DE', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })}€
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="line-clamp-3 text-black text-base"
                                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                                    />
                                                </div>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
