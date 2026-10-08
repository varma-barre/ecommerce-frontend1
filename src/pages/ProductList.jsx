import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config/api";

function ProductList() {
  // =========================================================
  // PRODUCTS
  // =========================================================

  const [products, setProducts] = useState([]);

  // =========================================================
  // SEARCH
  // =========================================================

  const [search, setSearch] = useState("");

  // =========================================================
  // CATEGORY
  // =========================================================

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  // =========================================================
  // PRICE FILTER
  // =========================================================

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // =========================================================
  // SORTING
  // =========================================================

  const [sortBy, setSortBy] = useState("");

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 10;

  // =========================================================
  // LOADING & ERROR
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // CART
  // =========================================================

  const { addToCart } = useCart();

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data.products || []);
      } catch (err) {
        setError(
          err.message || "Unable to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/categories`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        setCategories(data.categories || []);
      } catch (err) {
        console.error(
          "Failed to fetch categories:",
          err
        );

        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // =========================================================
  // PRICE VALUES
  // =========================================================

  const minPriceNumber =
    minPrice === "" ? null : Number(minPrice);

  const maxPriceNumber =
    maxPrice === "" ? null : Number(maxPrice);

  // =========================================================
  // PRICE VALIDATION
  // =========================================================

  const invalidPriceRange =
    minPriceNumber !== null &&
    maxPriceNumber !== null &&
    minPriceNumber > maxPriceNumber;

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts = products.filter((product) => {
    // -------------------------
    // SEARCH
    // -------------------------

    const productName = (
      product.name || ""
    ).toLowerCase();

    const searchText = search
      .trim()
      .toLowerCase();

    const matchesSearch =
      productName.includes(searchText);

    // -------------------------
    // CATEGORY
    // -------------------------

    const matchesCategory =
      category === "" ||
      product.category === category;

    // -------------------------
    // MIN PRICE
    // -------------------------

    const matchesMinPrice =
      minPriceNumber === null ||
      Number(product.price) >= minPriceNumber;

    // -------------------------
    // MAX PRICE
    // -------------------------

    const matchesMaxPrice =
      maxPriceNumber === null ||
      Number(product.price) <= maxPriceNumber;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  // =========================================================
  // SORT PRODUCTS
  // =========================================================

  const sortedProducts = [...filteredProducts].sort(
    (a, b) => {
      switch (sortBy) {
        // -------------------------
        // PRICE: LOW TO HIGH
        // -------------------------

        case "price-low-high":
          return (
            Number(a.price) - Number(b.price)
          );

        // -------------------------
        // PRICE: HIGH TO LOW
        // -------------------------

        case "price-high-low":
          return (
            Number(b.price) - Number(a.price)
          );

        // -------------------------
        // NAME: A TO Z
        // -------------------------

        case "name-a-z":
          return (a.name || "").localeCompare(
            b.name || "",
            undefined,
            {
              sensitivity: "base"
            }
          );

        // -------------------------
        // NAME: Z TO A
        // -------------------------

        case "name-z-a":
          return (b.name || "").localeCompare(
            a.name || "",
            undefined,
            {
              sensitivity: "base"
            }
          );

        // -------------------------
        // DEFAULT
        // -------------------------

        default:
          return 0;
      }
    }
  );

  // =========================================================
  // PAGINATION CALCULATIONS
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedProducts.length / productsPerPage
    )
  );

  // =========================================================
  // RESET PAGE IF CURRENT PAGE IS TOO HIGH
  // =========================================================

  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(page, totalPages)
    );
  }, [totalPages]);

  // =========================================================
  // CURRENT PAGE PRODUCTS
  // =========================================================

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const endIndex =
    startIndex + productsPerPage;

  const currentProducts =
    sortedProducts.slice(
      startIndex,
      endIndex
    );

  // =========================================================
  // PAGE CHANGE HANDLERS
  // =========================================================

  const handlePrevious = () => {
    setCurrentPage((page) =>
      Math.max(page - 1, 1)
    );
  };

  const handleNext = () => {
    setCurrentPage((page) =>
      Math.min(page + 1, totalPages)
    );
  };

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // =========================================================
  // CLEAR ALL FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");

    // Return to first page
    setCurrentPage(1);
  };

  // =========================================================
  // RESET PAGE WHEN SEARCH CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    category,
    minPrice,
    maxPrice,
    sortBy
  ]);

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="loading-message">
        Loading products...
      </div>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="products-page">

      <h1>Our Products</h1>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="product-search">

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search products..."
          aria-label="Search products by name"
        />

        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="clear-search-button"
          >
            Clear
          </button>
        )}

      </div>

      {/* =====================================================
          FILTERS + SORTING
      ===================================================== */}

      <div className="product-filters">

        {/* CATEGORY */}

        <div className="filter-group">

          <label htmlFor="category">
            Category
          </label>

          <select
            id="category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            <option value="">
              All Categories
            </option>

            {categories.map((cat) => (
              <option
                key={cat._id}
                value={cat.name}
              >
                {cat.name}
              </option>
            ))}

          </select>

        </div>

        {/* MIN PRICE */}

        <div className="filter-group">

          <label htmlFor="minPrice">
            Min Price
          </label>

          <input
            id="minPrice"
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value)
            }
            placeholder="₹0"
          />

        </div>

        {/* MAX PRICE */}

        <div className="filter-group">

          <label htmlFor="maxPrice">
            Max Price
          </label>

          <input
            id="maxPrice"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
            placeholder="₹100000"
          />

        </div>

        {/* SORT */}

        <div className="filter-group">

          <label htmlFor="sortBy">
            Sort By
          </label>

          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >

            <option value="">
              Default
            </option>

            <option value="price-low-high">
              Price: Low to High
            </option>

            <option value="price-high-low">
              Price: High to Low
            </option>

            <option value="name-a-z">
              Name: A–Z
            </option>

            <option value="name-z-a">
              Name: Z–A
            </option>

          </select>

        </div>

        {/* CLEAR ALL */}

        {(search ||
          category ||
          minPrice ||
          maxPrice ||
          sortBy) && (

          <button
            type="button"
            onClick={clearFilters}
            className="clear-filters-button"
          >
            Clear Filters
          </button>

        )}

      </div>

      {/* =====================================================
          INVALID PRICE RANGE
      ===================================================== */}

      {invalidPriceRange && (
        <p className="filter-error">
          Minimum price cannot be greater than
          maximum price.
        </p>
      )}

      {/* =====================================================
          RESULT COUNT
      ===================================================== */}

      <p className="product-count">

        {sortedProducts.length > 0
          ? `Showing ${startIndex + 1}-${Math.min(
              endIndex,
              sortedProducts.length
            )} of ${sortedProducts.length} filtered products`
          : "Showing 0 products"}

        {" "}(
        {products.length} total)

      </p>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      {!invalidPriceRange &&
      currentProducts.length > 0 ? (

        <div className="products-container">

          {currentProducts.map((product) => (

            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
            />

          ))}

        </div>

      ) : (

        <p className="no-products">

          {invalidPriceRange
            ? "Please correct the price range."
            : "No products found. Try changing your search or filters."}

        </p>

      )}

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {!invalidPriceRange &&
      sortedProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}

    </div>
  );
}

export default ProductList;