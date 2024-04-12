"use client";

import bg from '../../public/bg.jpeg'
import Image from 'next/image';
import ThreadCard from '../components/ThreadCard';
import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import { useSearchParams } from 'next/navigation';
import { FaSearch } from "react-icons/fa";

interface jsonData{
  // username: string;
  // date_time: string;
  // time: string;
  // body: string,
  // score: number;
  // comments: {
  //   username: string;
  //   date_time: string;
  //   time: string;
  //   body: string;
  //   score: string;
  //   sentiment: string;
  // }
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


const itemsPerPage = 6;

const Page: React.FC = () => {

  const searchParams = useSearchParams();
  const searchValue = searchParams.get("query") || '';
  const[inputSearch, setInputSearch] = useState<string>();

  const[currentPage, setCurrentPage] = useState(1);
  const [jsonData, setJsonData] = useState<jsonData[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8080/search/${searchValue}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then((jsonData) => {
      setJsonData(jsonData.docs);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
    console.log(jsonData);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jsonData.slice(indexOfFirstItem, indexOfLastItem);
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value);
}


  return (
    <main>
     <div className="flex relative flex-col justify-center items-center px-16 py-12 text-3xl font-bold text-white h-screen max-md:px-5">
      <Image
        className="object-cover absolute inset-0 size-full opacity-70"
        src={bg}
        alt='bg'
      />
      <div className="absolute inset-0 bg-black opacity-85"></div>
      <div className="flex relative flex-col items-center justify-center max-w-full h-full max-md:mt-10" data-aos="fade-up" data-aos-duration="1000">
        <div className="text-4xl max-md:max-w-full max-md:text-3xl">
          <span className="text-[#6d856d]font-mono">PickYour</span>
          <span className="text-[#6d856d] font-mono">Phone</span>
        </div>
        <div className='relative'>
          <input
            type="text"
            id="textInput"
            defaultValue= {searchValue}
            value={inputSearch}
            name="textInput"
            placeholder="Enter text..."
            onChange={handleInputChange}
            className="mt-5 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500 text-[15px] text-black font-sans w-full md:w-[40rem] "
            
          />
          <FaSearch size={30} color='#6d856d' className='absolute top-1/2 right-3 transform -translate-y-1'/>
        </div>
        <div className='overflow-auto'>
        <div className='text-base font-normal mt-5'>Fetched {jsonData.length} results</div>

  <div className="flex flex-wrap">
    {currentItems.map((item, index) => (
      <div key={index} className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-2 mb-4">
        <ThreadCard data={item}/>
      </div>
    ))}
  </div>

  <div>
    <Pagination totalItems={jsonData.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>
  </div>
        </div>
      </div>
    </div>
    </main>
  );
}

export default Page;