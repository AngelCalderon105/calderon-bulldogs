import React from 'react'

interface PropInterface {
text: string;
}

 
export default function WhiteButton({text}: PropInterface) {
  return (


    <span className='bg-white rounded-2xl px-6 py-2 mr-2 text-sm text-blue-dark shadow-md'>

        {text}
        </span>
  )
}
