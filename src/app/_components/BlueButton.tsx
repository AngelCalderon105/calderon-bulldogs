import React from 'react'

interface PropInterface {
text: string;
}

 
export default function BlueButton({text}: PropInterface) {
  return (
    <span className='bg-blue_dark rounded-2xl px-4 py-2 whitespace-nowrap md:px-6 text-sm  text-white'>
        {text}
        </span>
  )
}
