import React from 'react'

const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className='flex h-full items-center justify-center bg-[#f7f7f4] px-4'>
            {children}
        </div>
    )
}

export default AuthLayout