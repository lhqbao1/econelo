import { ProductGroupDetailResponse } from '@/types/product-group'
import { ProductItem } from '@/types/products'
import React from 'react'
import ProductOverview from './product-overview'
import VariantPriceSection from './variant-products'

interface ProductDetailsProps {
    productDetailsData: ProductItem
    productId: string
    parentProductData: ProductGroupDetailResponse | null
}

const ProductDetails = ({ productDetailsData, productId, parentProductData }: ProductDetailsProps) => {
    return (
        <div>
            <ProductOverview
                parentProductData={parentProductData}
                productDetailsData={productDetailsData}
                productId={productId}
            />
            <VariantPriceSection />
        </div>
    )
}

export default ProductDetails