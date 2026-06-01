/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react'

const page = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-white" >
            <div className="text-7xl ">😿</div>
            <h1 className="text-3xl font-bold mt-4">Oops! Page Not Found</h1>
            <p className="text-lg text-gray-600 mt-2">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>

            <a href="/" className="mt-6 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-md">
                Back to Home
            </a>
        </div>
    )
}

export default page