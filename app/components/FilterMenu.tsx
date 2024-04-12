import { SortOption} from "../types/Types";
import Select, { MultiValue } from 'react-select';
import { useState } from "react";

interface FilterObject{
    sentiment: (string|number)[],
    sort: SortOption
    dateRange: number | null
  }
  
interface FilterMenuProps{
    filters: FilterObject,
    setFilters: React.Dispatch<React.SetStateAction<FilterObject>>;
}

interface SentimentOption {
    value: string | number;
    label: string;
  }

interface DateRangeOption {
    value: number;
    label: string
}

const FilterMenu: React.FC<FilterMenuProps> = ({filters, setFilters}) => {

  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(),
    endDate: new Date()
  });

    const sentimentOptions: SentimentOption[] = [
        { value: 'positive', label: 'Positive' },
        { value: 'negative', label: 'Negative' },
        { value: 'neutral', label: 'Neutral' },
      ];


    const dateRangeOptions: DateRangeOption[] = [
      { value: 7, label: 'within a week' },
      { value: 30, label: 'within a month' },
      { value: 365, label: 'within a year' },
      { value: 0, label: 'All'}
    ];
    
      const handleSentimentChange = (selectedOptions: MultiValue<SentimentOption>| null) => {
        const updatedFilters = {
          ...filters,
          sentiment: selectedOptions ? (selectedOptions as SentimentOption[]).map((option) => option.value) : [],
        };
        setFilters(updatedFilters);
      };
    
      const handleDateRangeChange = (dateRangeOption: DateRangeOption | null) => {
        const updatedFilters = { ...filters, dateRange: dateRangeOption ? dateRangeOption.value : null};
        setFilters(updatedFilters);
      };

      const handleSortChange = (sortOption: string) => {
        const updatedFilters = { ...filters, sort: sortOption as any }; // Assuming SortOption is a string
        setFilters(updatedFilters);
      };
    

    return(
        <div className="flex mt-5 rounded shadow-md">
        <h2 className="text-sm font-semibold mb-2 mt-3">Sentiment</h2>
        <div className="mr-5 ml-5 mt-1">
          <Select
            isMulti
            options={sentimentOptions}
            value={sentimentOptions.filter((option) => filters.sentiment.includes(option.value))}
            onChange={(selectedOptions) => handleSentimentChange(selectedOptions)}
            className="text-sm"
            styles={{
                control: provided => ({
                  ...provided,
                  background: 'transparent', 
                  borderColor: 'transparent', 
                }),
                option: (provided, state) => ({
                    ...provided,
                    fontSize: 'small', 
                    background: state.isSelected ? 'rgba(0, 128, 0, 0.3)' : 'transparent', 
                    color: state.isSelected ? 'white' : 'black', 
                  }),
              }}
            
          />
        </div>
        <h2 className="text-sm font-semibold mb-2 mt-3">Date Range</h2>
        <div className="mr-5 ml-5 mt-1">
        <Select
            isMulti ={false}
            options={dateRangeOptions}
            value={dateRangeOptions.filter((option) => filters.dateRange === option.value)}
            onChange={(selectedOption) => handleDateRangeChange(selectedOption)}
            className="text-sm"
            styles={{
                control: provided => ({
                  ...provided,
                  background: 'transparent', 
                  borderColor: 'transparent', 
                }),
                option: (provided, state) => ({
                    ...provided,
                    fontSize: 'small', 
                    background: state.isSelected ? 'rgba(0, 128, 0, 0.3)' : 'transparent', 
                    color: state.isSelected ? 'white' : 'black', 
                  }),
              }}
            
          />
        </div>
        <h2 className="text-sm font-semibold mt-3">Sort</h2>
        <div className="mb-4">
          <select
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full bg-transparent p-2 rounded text-xs"
          >
            <option value="Default">Default</option>
            <option value="Most Likes">Most Likes</option>
            <option value="Least Likes">Least Likes</option>
            <option value="New Comments">New Comments</option>
            <option value="Old Comments">Old Comments</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </div>
    )
    
}

export default FilterMenu;