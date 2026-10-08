function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext
}) {
  return (
    <div className="pagination">

      <button
        type="button"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <span className="pagination-page">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

    </div>
  );
}

export default Pagination;