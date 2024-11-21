import React from 'react'

interface PropInterface {
text: string;
}

 
export default function BlueButton({text}: PropInterface) {
  return (
    <span className='bg-designblue rounded-2xl px-6 py-2   text-white'>
        {text}
        </span>
  )
}
