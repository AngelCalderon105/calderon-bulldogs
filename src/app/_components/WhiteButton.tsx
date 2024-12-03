import React from 'react'

interface PropInterface {
text: string;
}

 
export default function WhiteButton({text}: PropInterface) {
  return (


    <span className='bg-white rounded-2xl px-2 py-2 md:px-6 md:py-2 mr-1 text-xs text-blue-dark shadow-md'>

        {text}
        </span>
  )
}
