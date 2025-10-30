import { Search, ShoppingCart } from 'lucide-react'
import React from 'react'

const ListIcons = () => {
    return (
        <div className="flex items-center gap-4 px-4 py-2 text-primary">
            {/* Search Icon */}
            <button className="p-2 hover:scale-110 transition-transform duration-200">
                <Search className="w-6 h-6 text-white cursor-pointer" strokeWidth={2} />
            </button>

            {/* Divider line */}
            <div className="h-6 w-[1px] bg-gray-400" />

            {/* Cart Icon with badge */}
            <button className="relative p-2 hover:scale-110 transition-transform duration-200">
                <ShoppingCart className="w-6 h-6 text-white cursor-pointer" strokeWidth={2} />
                <span className="
          absolute -top-1 -right-1
          flex items-center justify-center
          w-5 h-5 text-xs font-semibold
          bg-black text-white rounded-full cursor-pointer
        ">
                    0
                </span>
            </button>
        </div>
    )
}

export default ListIcons