"use client"
import { useState } from 'react'
import {Menu, X, Wallet} from 'lucide-react'

export default function Header(){
    const [isOpen, setIsOpen] = useState(false) 
    const handleClick = () =>setIsOpen(prev=>!prev)
    
    return(
        <header>
            <nav className="fixed top-0 left-0 w-full z-50 px-6 pt-3">
                <div className='
                mx-auto max-w-7xl
                flex items-center justify-between gap-6
                rounded-xl
                bg-white/10 backdrop-blur-lg backdrop-saturate-150
                border border-white/20
                shadow-[0_12px_100px_rgba(0,0,0,0.25)]
                px-6 py-0.5
                text-black
                '
                >
                    
                    {/* logo and name */}
                    
                    <div className='flex items-center justify-between md:w-auto w-full'>
                        <a href="#" className='flex items-center py-5 px-2 flex-1'>
                            <Wallet color="#000000"/>
                        </a>
                        
                    </div>

                    {/* nav links */}
                    <div id='navigation-menu' className='hidden md:flex md:flex-row flex-col items-center justify-center md:space-x-8 font-semibold' >
                        <a href="#">Features</a>
                        <a href="#">Demo</a>
                        <a href="#">About</a>
                        <a href="#">Contact</a>
                    </div>

                    {/* CTA */}
                    <div className='w-1/3 flex justify-end gap-6 px-4 ' >
                        <button className='bg-black rounded-lg font-bold px-10 py-2 bg-green-700 text-white'>
                            Get Started
                        </button>
                        <button className='bg-white rounded-lg font-bold px-10 py-2 text-gray-500'>
                            Sign in
                            </button>

                    </div>
                    

                    {/* Hamburguer Menu icon */}
                    <button className='md:hidden flex items-center' onClick={handleClick}>
                        {isOpen? <X />:<Menu />}
                    </button>

            


                </div>
                
                 
                

            </nav>
        </header>
    )
}