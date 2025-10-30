import Image from 'next/image'
import React from 'react'

const Mission = () => {
    return (
        <section className='w-3/4 bg-red-100 h-[1000px]'>
            <div className='grid grid-cols-2 gap-8 h-[1000px]'>
                <div className='relative'>
                    asd
                    {/* <Image
                        src={'/mission-image-1.jpg'}
                        alt='Mission Image'
                        width={600}
                        height={400}
                        className='object-contain absolute top-0 left-0'
                    /> */}
                    <Image
                        src={'/mission-image-2.jpg'}
                        alt='Mission Image'
                        width={600}
                        height={400}
                        className='object-contain absolute bottom-0 right-0'
                    />
                </div>
                <div></div>
            </div>
        </section>
    )
}

export default Mission