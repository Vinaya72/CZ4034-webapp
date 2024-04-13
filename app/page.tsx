"use client";

import bg from '../public/bg.jpeg'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Pagination from './components/Pagination';
import { useSearchParams } from 'next/navigation';
import {SortOption } from './types/Types';
import FilterMenu from './components/FilterMenu';
import CommentsCard from './components/CommentsCard';
import PieChart from './components/PieChart';
import WordCloudComponent from './components/WordCloud';
import { FaSearch } from "react-icons/fa";



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
  sentiment: (string|number)|null,
  sort: SortOption 
  dateRange: number | null
}

const itemsPerPage = 15;

const Page: React.FC = () => {

  const counts: Record<string, number> = {
    positive: 0,
    negative: 0,
    neutral: 0
  };

  const[inputSearch, setInputSearch] = useState<string>('');
  const[finalInputSearch, setFinalInputSearch] = useState<string>('');
  const[currentPage, setCurrentPage] = useState(1);
  const[suggested, setSuggested] = useState<string>('');
  const[filteredData, setFilteredData] = useState<commentsData[]>([]);
  const [jsonData, setJsonData] = useState<commentsData[]>([]);
  const [data, setData] = useState<number[]>([0, 0, 0]); // Initialize data state
  const[filters, setFilters] = useState<FilterObject>({
    sentiment: null,
    sort: 'Default',
    dateRange: null
})
  const[queryTime, setQueryTime] = useState(0);
  const[filterString, setFilterString] = useState('');
  const[pageString, setPageString] = useState('');
  const[totalDataLengh, setTotalDataLength] = useState(0);

  const handlePageString = (pageNumber: number) => {
    const pageString = "&start="+pageNumber;
    return pageString;

  }

  const handleFilterString = (filterObject: FilterObject) => {
    let filterString = '';
    if(filterObject.sentiment){
      if(filterObject.sentiment !== 'all'){
        filterString = filterString+"&fq=label:"+filterObject.sentiment         
      }     
    }
    if(filterObject.sort){
      if(filterObject.sort === "Most Likes"){
        filterString = filterString+"&sort=Score+"+"desc"
      }
      if(filterObject.sort === "Least Likes"){
        filterString = filterString+"&sort=Score+"+"asc"
      }
    }

    return filterString;

  }


  const sortAndFilterData = (filterObj: FilterObject) => {
  const currentDate = new Date().getTime(); // Current timestamp in milliseconds
  const millisecondsInDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
   return jsonData.filter(item => {
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
  //  .sort((a: any,b: any) => {
  //     const aLikes = a.Score;
  //     const bLikes = b.Score;
  //     if(filterObj.sort === "Most Likes"){
  //          return bLikes - aLikes;
  //     }
  //     else if(filterObj. sort === "Least Likes"){
  //       return aLikes - bLikes;
  //     } else if (filterObj.sort === "Old Comments") {
  //       const dateA = new Date(a.Comment_Datetime.replace(/-/g, '/')).getTime(); // Replace '-' with '/' for Safari compatibility
  //       const dateB = new Date(b.Comment_Datetime.replace(/-/g, '/')).getTime(); // Replace '-' with '/' for Safari compatibility
  //       return dateA - dateB;
  //     } else if (filterObj.sort === "New Comments") {
  //       const dateA = new Date(a.Comment_Datetime.replace(/-/g, '/')).getTime(); // Replace '-' with '/' for Safari compatibility
  //       const dateB = new Date(b.Comment_Datetime.replace(/-/g, '/')).getTime(); // Replace '-' with '/' for Safari compatibility
  //       return dateB - dateA;
  //     }

  //     return 0;
  //  })

  }

  const labels = ['Positive', 'Negative', 'Neutral']

  function customEncodeURIComponent(inputString: string, spaceReplacement: string) {
    return encodeURIComponent(inputString).replace(/%20/g, spaceReplacement);
  }

// useEffect(() => {
//   if(finalInputSearch){
//     const encodedSearchValue = customEncodeURIComponent(finalInputSearch,'+')
//     fetch(`http://localhost:8080/search/${encodedSearchValue}`)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }
//       return response.json();
//     })
//     .then((jsonData) => {
//       setJsonData(jsonData.docs);
//     })
//     .catch(error => {
//       console.error('Error fetching data:', error);
//     });

//   }
//   }, [finalInputSearch]);


//   useEffect(() => {
//     if(finalInputSearch){
//       const encodedSearchValue = customEncodeURIComponent(finalInputSearch,'+')
//       fetch(`http://localhost:8080/suggested/${encodedSearchValue}`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }
//         return response.json();
//       })
//       .then((jsonData) => {
//         if(jsonData.suggestions.length >= 1){
//           setSuggested(jsonData.suggestions[1].suggestion[0].word);
//         }
//         else{
//           setSuggested('');
//         }
        
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });

//     }
//   }, [finalInputSearch])

useEffect(() => {
  if (finalInputSearch) {
    const finalQueryString = finalInputSearch+filterString+pageString;
    
    Promise.all([
      fetch(`http://localhost:8080/search/${finalQueryString}`),
      fetch(`http://localhost:8080/suggested/${finalInputSearch}`)
    ])
      .then(([searchResponse, suggestedResponse]) => {
        if (!searchResponse.ok || !suggestedResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        return Promise.all([searchResponse.json(), suggestedResponse.json()]);
      })
      .then(([searchJsonData, suggestedJsonData]) => {
        console.log(suggestedJsonData);
        setJsonData(searchJsonData.response.docs);
        setFilteredData(searchJsonData.response.docs);
        setQueryTime(searchJsonData.responseHeader.QTime);
        setTotalDataLength(searchJsonData.response.numFound);
        if (suggestedJsonData.suggestions.length >= 1) {
          setSuggested(suggestedJsonData.suggestions[1].suggestion[0].word);
        } else {
          setSuggested('');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
}, [finalInputSearch, filterString, pageString]);

  

  useEffect(() => {
    const filterData = sortAndFilterData(filters);
    const filterString = handleFilterString(filters);
    setFilterString(filterString);
    setFilteredData(filterData);
  }, [filters])

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
    const index = (newPage-1)*itemsPerPage;
    const pageString = handlePageString(index);
    setPageString(pageString);
    setCurrentPage(newPage);
  }

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the inputSearch state only if Enter key is pressed
      setInputSearch(e.target.value);
  }

// const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//   if (e.key === 'Enter') {
//     const inpuSearchValue = "*"+inputSearch+"*";
//     setFinalInputSearch(inpuSearchValue);
//    }
// }

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    let finalInputSearchValue = '';
    const inputSearchWords = inputSearch.trim().split(/\s+/);

    if (inputSearchWords.length === 1) {
      // If it's a single word
      finalInputSearchValue = `(${inputSearchWords[0]})`;
    } else {
      // If it's a sentence
      finalInputSearchValue = inputSearchWords.join('+AND+');
      finalInputSearchValue = `(${finalInputSearchValue})`
    }

    setFinalInputSearch(finalInputSearchValue);
  }
};


const handleSuggestedClick = () => {
  const inputSearchValue = "*"+suggested+"*";
  if(inputSearchValue.charAt(0) === '*'){
    setInputSearch(inputSearchValue.substring(1, inputSearchValue.length - 1));
  }
  setFinalInputSearch(inputSearchValue);
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
            value={inputSearch}
            name="textInput"
            placeholder="Enter text..."
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="mt-5 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500 text-[15px] text-black font-sans w-full md:w-[40rem] "
            
          />
          <FaSearch size={30} color='#6d856d' className='absolute top-1/2 right-3 transform -translate-y-1'/>
        </div>
        {suggested && (suggested !== inputSearch) && (
              <div className='text-base font-normal mt-5'>
                Did you mean{' '}
                <a onClick={handleSuggestedClick} className="cursor-pointer text-blue-500 underline">
                  {suggested}
                </a>
                
                ?
              </div>
        )}
        {
           finalInputSearch && (
            <div className='text-base font-normal mt-5'>showing {filteredData.length} results of {totalDataLengh}
            { filteredData.length > 0 &&
                 (<span>, fetched in {queryTime} ms </span>)
            }
            </div>
           )
        }
      {
         (filteredData.length > 0 || jsonData.length > 0) && (
          <FilterMenu filters={filters} setFilters={setFilters}/>
         )
      }
      {
        (filteredData.length > 0 && jsonData.length > 0) && (
          <div className='grid grid-cols-1 min-h-[calc(100vh - 100px)] md:grid-cols-2 gap-4 max-h-full overflow-hidden relative'>
          <div className='overflow-y-auto'>
            <div className='h-full my-3'>
              <PieChart data={data} labels={labels}/>
            </div>
            <div className='h-full my-3'>
              <WordCloudComponent commentsData={filteredData}/>
            </div>
          </div>
          <div className='overflow-y-auto'>
            {filteredData.map((item, index) => (
              <CommentsCard key={item.ID} data={item}/>
            ))}
          </div>
        </div>
        
        
        )
      }{ (filteredData.length > 0 && jsonData.length > 0) &&
        <div className='md-5'>
              <Pagination totalItems={totalDataLengh} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange}/>
            </div>

      }
    </div>
    </div>
  );
}

export default Page;