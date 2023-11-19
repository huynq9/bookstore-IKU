import React from "react";
import CarouselC from "../../components/client/Carousel";
import ProductCard from "../../components/client/ProductCard";
import AuthorCard from "../../components/client/AuthorCard";
import CategoryCard from "../../components/client/CategoryCard";
import BlogCard from "../../components/client/BlogCard";

const Home = () => {
  console.log(document.cookie);
  return (
    <div>
      <section>
        <CarouselC />
      </section>
      <section className="container mx-auto">
        <h3>Features Book</h3>
        <div className="flex flex-wrap">
          <ProductCard product={1} />
          <ProductCard product={1} />
          <ProductCard product={1} />
          <ProductCard product={1} />
          <ProductCard product={1} />
          <ProductCard product={1} />
          <ProductCard product={1} />
          <ProductCard product={1} />
        </div>
      </section>
      <section className="container mx-auto">
        <h2>Author</h2>
        <div className="flex flex-wrap">
          <AuthorCard />
          <AuthorCard />
          <AuthorCard />
        </div>
      </section>
      <section className="container mx-auto">
        <h2>Category</h2>
        <div className="flex flex-wrap justify-between">
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
        </div>
      </section>
      <section className="container mx-auto">
        <h3>Sale Book</h3>
        <div className="flex flex-wrap">
          <ProductCard product={1} />
          <ProductCard product={1} />
          <ProductCard product={1} />
          <ProductCard product={1} />
        </div>
      </section>
      <section className="container mx-auto">
        <h3>Blogs Book</h3>
        <div className="flex flex-wrap justify-between">
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
        </div>
      </section>
    </div>
  );
};

export default Home;
