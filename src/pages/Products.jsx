import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../config/api";

function Products({ onAddToCart }) {

    /* =====================================================
       PRODUCT DATA
    ===================================================== */

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =====================================================
       SEARCH
    ===================================================== */

    const [searchTerm, setSearchTerm] = useState("");


    /* =====================================================
       FILTERS
    ===================================================== */

    const [category, setCategory] = useState("all");

    const [minPrice, setMinPrice] = useState("");

    const [maxPrice, setMaxPrice] = useState("");


    /* =====================================================
       SORTING
    ===================================================== */

    const [sortBy, setSortBy] = useState("default");


    /* =====================================================
       PAGINATION
    ===================================================== */

    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 8;


    /* =====================================================
       FETCH PRODUCTS
    ===================================================== */

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await fetch(
                    `${API_URL}/api/products`
                );


                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch products"
                    );
                }


                const data = await response.json();


                console.log(
                    "Products API response:",
                    data
                );


                const productList =
                    Array.isArray(data)
                        ? data
                        : Array.isArray(data.products)
                            ? data.products
                            : Array.isArray(data.Products)
                                ? data.Products
                                : Array.isArray(data.data)
                                    ? data.data
                                    : [];


                setProducts(productList);


            } catch (error) {

                console.error(
                    "Products fetch error:",
                    error
                );


                setError(
                    "Unable to load products. Please try again."
                );


                setProducts([]);


            } finally {

                setLoading(false);

            }

        };


        fetchProducts();

    }, []);


    /* =====================================================
       CATEGORIES
    ===================================================== */

    const categories = useMemo(() => {

        const uniqueCategories = products
            .map((product) => product.category)
            .filter(Boolean);

        return [
            ...new Set(uniqueCategories)
        ];

    }, [products]);


    /* =====================================================
       FILTER + SEARCH + SORT
    ===================================================== */

    const filteredProducts = useMemo(() => {

        let result = [...products];


        /* -----------------------------
           SEARCH
        ----------------------------- */

        if (searchTerm.trim()) {

            const search = searchTerm
                .toLowerCase()
                .trim();


            result = result.filter((product) => {

                const name =
                    String(product.name || "")
                        .toLowerCase();

                const description =
                    String(product.description || "")
                        .toLowerCase();

                const productCategory =
                    String(product.category || "")
                        .toLowerCase();


                return (
                    name.includes(search) ||
                    description.includes(search) ||
                    productCategory.includes(search)
                );

            });

        }


        /* -----------------------------
           CATEGORY
        ----------------------------- */

        if (category !== "all") {

            result = result.filter(
                (product) =>
                    String(product.category || "")
                        .toLowerCase() ===
                    category.toLowerCase()
            );

        }


        /* -----------------------------
           MIN PRICE
        ----------------------------- */

        if (minPrice !== "") {

            const minimum =
                Number(minPrice);


            if (!Number.isNaN(minimum)) {

                result = result.filter(
                    (product) =>
                        Number(product.price || 0) >=
                        minimum
                );

            }

        }


        /* -----------------------------
           MAX PRICE
        ----------------------------- */

        if (maxPrice !== "") {

            const maximum =
                Number(maxPrice);


            if (!Number.isNaN(maximum)) {

                result = result.filter(
                    (product) =>
                        Number(product.price || 0) <=
                        maximum
                );

            }

        }


        /* -----------------------------
           SORTING
        ----------------------------- */

        switch (sortBy) {

            case "price-low":
                result.sort(
                    (a, b) =>
                        Number(a.price || 0) -
                        Number(b.price || 0)
                );
                break;


            case "price-high":
                result.sort(
                    (a, b) =>
                        Number(b.price || 0) -
                        Number(a.price || 0)
                );
                break;


            case "name-az":
                result.sort(
                    (a, b) =>
                        String(a.name || "")
                            .localeCompare(
                                String(b.name || "")
                            )
                );
                break;


            case "name-za":
                result.sort(
                    (a, b) =>
                        String(b.name || "")
                            .localeCompare(
                                String(a.name || "")
                            )
                );
                break;


            default:
                break;

        }


        return result;

    }, [
        products,
        searchTerm,
        category,
        minPrice,
        maxPrice,
        sortBy
    ]);


    /* =====================================================
       RESET PAGE WHEN FILTERS CHANGE
    ===================================================== */

    useEffect(() => {

        setCurrentPage(1);

    }, [
        searchTerm,
        category,
        minPrice,
        maxPrice,
        sortBy
    ]);


    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalPages =
        Math.ceil(
            filteredProducts.length /
            productsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        productsPerPage;


    const endIndex =
        startIndex +
        productsPerPage;


    const currentProducts =
        filteredProducts.slice(
            startIndex,
            endIndex
        );


    /* =====================================================
       CLEAR SEARCH
    ===================================================== */

    const clearSearch = () => {

        setSearchTerm("");

    };


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const clearFilters = () => {

        setCategory("all");

        setMinPrice("");

        setMaxPrice("");

        setSortBy("default");

        setSearchTerm("");

        setCurrentPage(1);

    };


    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {

        return (
            <div className="products-state">

                <div className="loading-spinner"></div>

                <h2>
                    Loading products...
                </h2>

                <p>
                    Please wait while we load the products.
                </p>

            </div>
        );

    }


    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error) {

        return (
            <div className="products-state error-state">

                <div className="state-icon">
                    !
                </div>

                <h2>
                    Unable to load products
                </h2>

                <p>
                    {error}
                </p>

            </div>
        );

    }


    /* =====================================================
       PRODUCTS PAGE
    ===================================================== */

    return (

        <div className="products-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="products-hero">

                <span className="products-eyebrow">
                    EXPLORE OUR COLLECTION
                </span>

                <h1>
                    Find Something
                    
                    You'll Love.
                </h1>

                <p>
                    Discover quality products for
                    your everyday needs.
                </p>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <div className="product-search">

                    <div className="search-icon">
                        🔍
                    </div>


                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />


                    {searchTerm && (
                        <button
                            type="button"
                            className="search-clear"
                            onClick={clearSearch}
                        >
                            ×
                        </button>
                    )}

                </div>

            </section>


            {/* =================================================
                FILTER PANEL
            ================================================= */}

            <section className="product-filters">


                {/* CATEGORY */}

                <div className="filter-group">

                    <label>
                        Category
                    </label>

                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(
                                event.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Categories
                        </option>


                        {categories.map(
                            (item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            )
                        )}

                    </select>

                </div>


                {/* MIN PRICE */}

                <div className="filter-group">

                    <label>
                        Min Price
                    </label>

                    <input
                        type="number"
                        min="0"
                        placeholder="Min price"
                        value={minPrice}
                        onChange={(event) =>
                            setMinPrice(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* MAX PRICE */}

                <div className="filter-group">

                    <label>
                        Max Price
                    </label>

                    <input
                        type="number"
                        min="0"
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={(event) =>
                            setMaxPrice(
                                event.target.value
                            )
                        }
                    />

                </div>


                {/* SORT */}

                <div className="filter-group">

                    <label>
                        Sort By
                    </label>

                    <select
                        value={sortBy}
                        onChange={(event) =>
                            setSortBy(
                                event.target.value
                            )
                        }
                    >

                        <option value="default">
                            Default
                        </option>

                        <option value="price-low">
                            Price: Low to High
                        </option>

                        <option value="price-high">
                            Price: High to Low
                        </option>

                        <option value="name-az">
                            Name: A to Z
                        </option>

                        <option value="name-za">
                            Name: Z to A
                        </option>

                    </select>

                </div>


                {/* CLEAR FILTERS */}

                <button
                    type="button"
                    className="clear-filters-button"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>

            </section>


            {/* =================================================
                PRODUCT TOOLBAR
            ================================================= */}

            <div className="products-toolbar">

                <p className="product-count">

                    Showing{" "}

                    <strong>
                        {filteredProducts.length}
                    </strong>

                    {" "}of{" "}

                    <strong>
                        {products.length}
                    </strong>

                    {" "}products

                </p>

            </div>


            {/* =================================================
                PRODUCT GRID
            ================================================= */}

            {currentProducts.length > 0 ? (

                <div className="products-container">

                    {currentProducts.map(
                        (product) => (

                            <ProductCard
                                key={product._id}
                                product={product}
                                onAddToCart={onAddToCart}
                            />

                        )
                    )}

                </div>

            ) : (

                <div className="no-products">

                    <div className="no-products-icon">
                        🔍
                    </div>

                    <h2>
                        No Products Found
                    </h2>

                    <p>
                        Try changing your search
                        or filters.
                    </p>

                    <button
                        type="button"
                        className="no-products-button"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                </div>

            )}


            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (

                <div className="pagination">


                    {/* PREVIOUS */}

                    <button
                        type="button"
                        onClick={() =>
                            setCurrentPage(
                                (page) =>
                                    page - 1
                            )
                        }
                        disabled={
                            currentPage === 1
                        }
                    >
                        ← Previous
                    </button>


                    {/* PAGE NUMBERS */}

                    <div className="pagination-pages">

                        {Array.from(
                            {
                                length: totalPages
                            },
                            (_, index) => {

                                const page =
                                    index + 1;

                                return (

                                    <button
                                        type="button"
                                        key={page}
                                        className={
                                            currentPage === page
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                page
                                            )
                                        }
                                    >
                                        {page}
                                    </button>

                                );

                            }
                        )}

                    </div>


                    {/* NEXT */}

                    <button
                        type="button"
                        onClick={() =>
                            setCurrentPage(
                                (page) =>
                                    page + 1
                            )
                        }
                        disabled={
                            currentPage === totalPages
                        }
                    >
                        Next →
                    </button>

                </div>

            )}

        </div>
    );
}

export default Products;