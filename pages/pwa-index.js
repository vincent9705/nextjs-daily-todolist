import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const PwaIndex = () => {
    const router = useRouter()

    useEffect(() => {
        router.push('/')
    }, [])

    return (<>
        <div className="flex justify-center items-center h-screen">
            <div className="relative">
                <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gray-900"></div>
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gray-900 z-10">Loading...</p>
            </div>
        </div>
    </>)
}

export default PwaIndex