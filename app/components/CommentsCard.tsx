import React from 'react'
import { FaReddit } from "react-icons/fa";
import { BiSolidUpvote } from "react-icons/bi";


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

const CommentsCard : React.FC<Childprops> = ({data}) => {
  return (
    <div className="bg-black text-white flex flex-col p-6 rounded-md my-3">
   
        <div className='flex flex-row justify-between'>
            <div className='flex flex-row'>
                <FaReddit size={20} color='#FF4500'/>
                <h2 className="text-xs font-bold mb-4 ml-2">{data.Comment_Author}</h2>
            </div>
            <div className='border border-green-500  text-white text-sm font-medium py-2 px-2 rounded-md'>
                {data.label}
            </div>
        </div>
        <p className='text-xs my-3 text-slate-500'>{data.Comment_Datetime}</p>
        <p className="text-base text-slate-200 font-medium">{data.Comment}</p>
        <div className='flex flex-row justify-between'>
            <div className='flex flex-row'>
                <div className='flex flex-row mt-3'>
                   <BiSolidUpvote />
                    <p className='text-xs mt-2'>{data.Score}</p>
                </div>   
            </div>
             <a href={data.Post_URL} target="_blank" rel="noopener noreferrer" className='text-sm mt-2 font-light underline'>View Post</a> 
        </div>
    </div>
  
  )
}

export default CommentsCard
