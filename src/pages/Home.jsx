import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="home-hero">

        <div className="home-hero-content">

          <span className="home-badge">
            WELCOME TO MYSTORE
          </span>

          <h1>
            Everything You Need,
            <span> All in One Place.</span>
          </h1>

          <p>
            Discover quality products, great prices,
            and a seamless shopping experience.
          </p>

          <div className="home-hero-buttons">

            <Link
              to="/products"
              className="home-shop-button"
            >
              Shop Now
            </Link>

            <Link
              to="/products"
              className="home-explore-button"
            >
              Explore Products
            </Link>

          </div>

        </div>


        {/* Decorative shopping visual */}

        <div className="home-hero-visual">

          <div className="hero-circle"></div>

          <div className="hero-shopping-card">

            <div className="hero-card-icon">
              🛍️
            </div>

            <h3>
              Smart Shopping
            </h3>

            <p>
              Find what you love.
            </p>

          </div>

        </div>

      </section>



      {/* =====================================================
          SHOPPING SECTION
      ====================================================== */}

      <section className="home-shopping">

        <div className="home-section-heading">

          <span>
            SHOP WITH CONFIDENCE
          </span>

          <h2>
            Your Favorite Products,
            <br />
            Just a Click Away
          </h2>

          <p>
            Browse our collection and discover
            products made for your everyday needs.
          </p>

          <Link
            to="/products"
            className="home-browse-button"
          >
            Browse Products →
          </Link>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="home-features">

        <div className="home-feature">

          <div className="feature-icon">
            🚚
          </div>

          <div>
            <h3>Fast Delivery</h3>

            <p>
              Get your orders delivered quickly.
            </p>
          </div>

        </div>


        <div className="home-feature">

          <div className="feature-icon">
            🔒
          </div>

          <div>
            <h3>Secure Shopping</h3>

            <p>
              Your information stays protected.
            </p>
          </div>

        </div>


        <div className="home-feature">

          <div className="feature-icon">
            💳
          </div>

          <div>
            <h3>Easy Payments</h3>

            <p>
              Simple and convenient checkout.
            </p>
          </div>

        </div>


        <div className="home-feature">

          <div className="feature-icon">
            ⭐
          </div>

          <div>
            <h3>Quality Products</h3>

            <p>
              Shop products you'll love.
            </p>
          </div>

        </div>

      </section>


      

    </div>
  );
}

export default Home;