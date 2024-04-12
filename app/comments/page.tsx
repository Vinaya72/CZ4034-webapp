"use client";

import bg from '../../public/bg.jpeg'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import { useSearchParams } from 'next/navigation';
import {SortOption } from '../types/Types';
import FilterMenu from '../components/FilterMenu';
import CommentsCard from '../components/CommentsCard';
import PieChart from '../components/PieChart';
import WordCloudComponent from '../components/WordCloud';
import { FaSearch } from "react-icons/fa";
import Link from 'next/link';



interface commentsData{
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

interface FilterObject{
  sentiment: (string|number)[],
  sort: SortOption
  dateRange: number | null
}

const itemsPerPage = 5;

const Page: React.FC = () => {

  // const searchParams = useSearchParams();
  // const commentsString = searchParams.get("query") || '';

  // const listAsArray: commentsData[] = commentsString ? JSON.parse(decodeURIComponent(commentsString)): [];

  const counts: Record<string, number> = {
    positive: 0,
    negative: 0,
    neutral: 0
  };

  const searchParams = useSearchParams();
  const searchValue = searchParams.get("query1") || '';
  const suggestedValue = searchParams.get("query2") || '';
  const[inputSearch, setInputSearch] = useState<string>(searchValue);
  const[finalInputSearch, setFinalInputSearch] = useState<string>(searchValue);
  const[currentPage, setCurrentPage] = useState(1);
  const[suggested, setSuggested] = useState<string>('');
  // const [jsonData, setJsonData] = useState<commentsData[]>([]);
  const[filteredData, setFilteredData] = useState<commentsData[]>([]);
  const [jsonData, setJsonData] = useState<commentsData[]>([]);
  const [data, setData] = useState<number[]>([0, 0, 0]); // Initialize data state
  const[filters, setFilters] = useState<FilterObject>({
    sentiment: [],
    sort: "Most Likes",
    dateRange: null
})


  const sortAndFilterData = (filterObj: FilterObject) => {
  const currentDate = new Date().getTime(); // Current timestamp in milliseconds
  const millisecondsInDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
   return jsonData.filter(item=> {
    return(filterObj.sentiment.length > 0 ? filterObj.sentiment.includes(item.label) : true )
   })
   .filter(item => {
    // Convert item.date_time to timestamp
    const itemTimestamp = new Date(item.Comment_Datetime).getTime();
    // Check if the difference between currentDate and itemTimestamp falls within the specified timeline
    if (filterObj.dateRange) {
      const timelineDays = filterObj.dateRange === 7 ? 7 :
                           filterObj.dateRange === 30 ? 30 :
                           filterObj.dateRange=== 365 ? 365 : 0;
      return currentDate - itemTimestamp <= timelineDays * millisecondsInDay;
    }
    // If no timeline filter is applied, return true
    return true;
   })
   .sort((a: any,b: any) => {
      const aLikes = a.Score;
      const bLikes = b.Score;
      if(filterObj.sort === "Most Likes"){
           return bLikes - aLikes;
      }
      else if(filterObj. sort === "Least Likes"){
        return aLikes - bLikes;
      }

      return 0;
   })

  }

  const labels = ['Positive', 'Negative', 'Neutral']


useEffect(() => {
    fetch(`http://localhost:8080/search/${inputSearch}`)
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
  }, [finalInputSearch]);


  useEffect(() => {
    fetch(`http://localhost:8080/suggested/${inputSearch}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then((jsonData) => {
      if(jsonData.suggestions.length >= 1){
        setSuggested(jsonData.suggestions[1].suggestion[0].word);
      }
      else{
        setSuggested('');
      }
      
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [finalInputSearch])
  

  useEffect(() => {
    const filterData = sortAndFilterData(filters);
    setFilteredData(filterData);
    // filteredData.forEach(comment =>{
    //   counts[comment.label]++;
    // });
    // setData([counts['positive'], counts['negative'], counts['neutral']])
  }, [filters,jsonData])

  useEffect(() => {
    const updatedCounts: Record<string, number> = {
        positive: 0,
        negative: 0,
        neutral: 0
    };
    filteredData.forEach(comment => {
        updatedCounts[comment.label]++;
    });
    setData([updatedCounts['positive'], updatedCounts['negative'], updatedCounts['neutral']]);
}, [filteredData]);

  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the inputSearch state only if Enter key is pressed
      setInputSearch(e.target.value);
  }

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    setFinalInputSearch(inputSearch);
   }
}

const handleSuggestedClick = () => {
  setInputSearch(suggested);
  setFinalInputSearch(suggested);
};

  return (
     <div className="flex relative justify-center items-center  px-16 py-12 text-3xl font-bold text-white h-screen">
      <Image
        className="object-cover absolute inset-0 size-full opacity-70"
        src={bg}
        alt='bg'
      />
      <div className="absolute inset-0 bg-black opacity-85"></div>
      <div className="flex relative flex-col items-center justify-center max-w-full max-md:mt-10 max-h-full">
      <div className="text-4xl max-md:max-w-full max-md:text-3xl">
          <span className="text-[#6d856d]font-mono">Phone</span>
          <span className="text-[#6d856d] font-mono">Reviews</span>
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
            onKeyDown={handleKeyDown}
            className="mt-5 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500 text-[15px] text-black font-sans w-full md:w-[40rem] "
            
          />
          <FaSearch size={30} color='#6d856d' className='absolute top-1/2 right-3 transform -translate-y-1'/>
        </div>
        {suggested && (
              <div className='text-base font-normal mt-5'>
                Did you mean{' '}
                <a onClick={handleSuggestedClick} className="cursor-pointer text-blue-500 underline">
                  {suggested}
                </a>
                ?
              </div>
        )}
      <div className='text-base font-normal mt-5'>Fetched {filteredData.length} results</div>
      {
         (filteredData.length > 0 || jsonData.length > 0) && (
          <FilterMenu filters={filters} setFilters={setFilters}/>
         )
      }
      {
        (filteredData.length > 0 || jsonData.length > 0) && (
          <div className='grid grid-cols-1 min-[800px]:grid-cols-2 gap-4 max-h-full overflow-y-auto relative'>
          <div>
              <div className='min-[800px]:h-1/2 my-3'>
                <PieChart data = {data} labels = {labels}/>
              </div>
              <div className='min-[800px]:h-1/2 my-3'>
                <WordCloudComponent commentsData={filteredData}/>
              </div>
          </div>
          <div>
          {currentItems.map((item, index) => (
               <CommentsCard data = {item}/>
         ))}
          <div className='md-5'>
            <Pagination totalItems={filteredData.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>
          </div>
          </div>
      </div>

        )
      }
    </div>
    </div>
  );
}

export default Page;