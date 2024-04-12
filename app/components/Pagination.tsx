interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (newPage: number) => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    return (
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="border border-gray-500 px-2 py-1 rounded-md mr-2 text-sm font-normal"
        >
          Previous
        </button>
  
        <span className="mr-2 text-base font-normal">{`Page ${currentPage} of ${totalPages}`}</span>
  
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="border border-gray-500 px-2 py-1 rounded-md mr-2 text-sm font-normal"
        >
          Next
        </button>
      </div>
    );
  };
  
  export default Pagination;