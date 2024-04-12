import React from 'react'
import { FaReddit } from "react-icons/fa";
import { BiSolidUpvote } from "react-icons/bi";
import Link from 'next/link';

interface Childprops {
   data: SampleData
}

interface SampleData{
    ID: string,
    Title: string
    Post_Datetime: string,
    Comment: string,
    label: string,
    Post_URL: string,
    Score: number,
    Post_Author: string,
    Comment_Datetime: string,
    Comment_Author: string
}

const ThreadCard : React.FC<Childprops> = ({data}) => {
   

//   const listAsString = JSON.stringify(data.comments);
   
  return (
    <div className="bg-black text-white flex flex-col p-6 rounded-md my-3">
   
        <div className='flex flex-row justify-between'>
            <div className='flex flex-row'>
                <FaReddit size={20} color='#FF4500'/>
                <h2 className="text-xs font-bold mb-4 ml-2">{data.Post_Author}</h2>
            </div>
        </div>
        <p className='text-xs my-3 text-slate-500'>{data.Post_Datetime}</p>
        <p className="text-base text-slate-200 font-medium">{data.Title}</p>
        <div className='flex flex-row justify-between'>
            <div className='flex flex-row'>
                <div className='flex flex-row mt-3'>
                    <BiSolidUpvote />
                    <p className='text-xs mt-2 ml-2'>{data.Score}</p>
                </div>   
            </div>
            {/* <div className='text-sm mt-2 font-light underline'><Link href={`/comments?query=${listAsString}`}>View Comments</Link></div> */}
            <div className='text-sm mt-2 font-light underline'>View Comments</div>
        </div>
    </div>
  
  )
}

export default ThreadCard
