import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  List,
  Rate,
  Select,
  Space,
} from "antd";
import React, { useEffect } from "react";
import { useGetProductsQuery } from "../../api/product";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { loadBooks } from "../../store/book/productSlice";
import { IBook } from "../../interfaces/book";
import { Link, useSearchParams } from "react-router-dom";
import { useGetCategoriesQuery } from "../../api/category";
import {
  loadCategories,
  selectCategory,
} from "../../store/category/categorySlice";
import numeral from "numeral";
import { useGetAuthorsQuery } from "../../api/author";
const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { data: bookData } = useGetProductsQuery();
  const { data: categoryData } = useGetCategoriesQuery();
  const { data: authors } = useGetAuthorsQuery();

  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const searchType = useSelector((state: RootState) => state.search.searchType);
  const books = useSelector((state: RootState) => state.products.books);
  const favoriteCategories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const selectedCategory = useSelector(
    (state: RootState) => state.categories.selectedCategory
  );

  useEffect(() => {
    if (bookData && bookData.length > 0) {
      dispatch(loadBooks(bookData));
    }
    if (categoryData && categoryData.length > 0) {
      dispatch(loadCategories(categoryData));
    }
  }, [bookData, categoryData]);
  const handleDiscount = (item: IBook) => {
    const result = (
      ((item.price - item.discount) / item.price) *
      100
    ).toFixed();
    return result;
  };
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };
  const filteredBooks = books.filter((book) => {
    const titleMatches = book.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const authorMatches =
      book.authorId.some((author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      book.authorId
        .map((author) => author.name.toLowerCase())
        .join(" ")
        .includes(searchTerm.toLowerCase());

    const categoryFilterMatches = selectedCategory
      ? book.categoryId.some(
          (categoryId) => categoryId._id === selectedCategory._id
        )
      : true;
    const categoryMatches = book.categoryId.some((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (searchType === "bookTitle") {
      return titleMatches && categoryFilterMatches;
    } else if (searchType === "authorName") {
      return authorMatches && categoryFilterMatches;
    } else if (searchType === "categoryName") {
      return categoryFilterMatches && categoryMatches;
    } else {
      // Nếu searchType không được chỉ định hoặc không hợp lệ, xem xét cả tiêu đề, tác giả và danh mục
      return (titleMatches || authorMatches) && categoryFilterMatches;
    }
  });
  const handleCategoryClick = (category) => {
    const newSelectedCategory = category._id ? category : null;
    dispatch(selectCategory(newSelectedCategory));
  };
  console.log(filteredBooks);

  return (
    <main className="w-4/5 mx-auto">
      {/* component */}
      <section className="bg-white dark:bg-gray-900">
        <div className="container  py-10 mx-auto">
          <div className="relative block text-right">
            <div
              className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex={-1}
            >
              <div className="py-1" role="none">
                <a
                  href="#"
                  className="font-medium text-gray-900 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-0"
                >
                  Most Popular
                </a>
                <a
                  href="#"
                  className="text-gray-500 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-1"
                >
                  Best Rating
                </a>
                <a
                  href="#"
                  className="text-gray-500 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-2"
                >
                  Newest
                </a>
                <a
                  href="#"
                  className="text-gray-500 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-3"
                >
                  Price: Low to High
                </a>
                <a
                  href="#"
                  className="text-gray-500 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-4"
                >
                  Price: High to Low
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap  ">
            {filteredBooks?.map((item) => (
              <Link
                to={`/products/${item._id}`}
                key={item._id}
                className="relative  mx-2 my-2 w-[280px] flex max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
              >
                <a
                  className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
                  href="#"
                >
                  <img
                    className="object-cover mx-auto"
                    src={item.images[0].url}
                  />
                  {item.sale > 0 ? (
                    <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
                      {item.sale}% OFF
                    </span>
                  ) : (
                    ""
                  )}
                </a>
                <div className="mt-4 px-5 pb-5">
                  <a href="#">
                    <h5 className="text-xl tracking-tight text-slate-900">
                      {item.title}
                    </h5>
                  </a>
                  <p className="text-sm text-stone-400 ">
                    {item.authorId.map((author) => (
                      <a key={author._id + item._id} href="#">
                        {author.name}
                      </a>
                    ))}
                  </p>
                  <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                      <span className="text-1xl font-bold text-red-500">
                        {item.discount.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="text-sm text-slate-900 line-through">
                        {item.sale > 0
                          ? item.price.toLocaleString("vi-VN") + "đ"
                          : ""}
                      </span>
                    </p>
                    <div className="flex items-center">
                      {/* <svg
                        aria-hidden="true"
                        className="h-5 w-5 text-yellow-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5 text-yellow-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5 text-yellow-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5 text-yellow-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5 text-yellow-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg> */}
                      <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
                        Lượt xem: {item.views}
                      </span>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to cart
                  </a>
                </div>
              </Link>
            ))}

            {/* <Card
                    key={item._id}
                    className="flex flex-col text-center border shadow-lg  w-[400px]"
                  >
                    <div className=" inline-block overflow-hidden wrap-book-addcart ">
                      <Link
                        to={`/products/${item._id}`}
                        className="block book-img mw-100"
                      >
                        <img
                          className="mx-auto mt-4 text-center book-img"
                          src={item.images[0].url}
                          alt="San pham"
                        />
                      </Link>
                    </div>
                    <Link to={`/products/${item._id}`}>
                      <h2 className="truncate px-8 text-sm font-medium overflow-hidden">
                        {item.title}
                      </h2>
                    </Link>
                    <a href="#">
                      <p className="text-sm text-stone-400 ">
                        {item.authorId.map((author) => (
                          <a key={author._id + item._id} href="#">
                            {author.name}
                          </a>
                        ))}
                      </p>
                    </a>
                    {item?.averageRating != null ? (
                      <div className="flex w-full my-2 rev-sold justify-evenly">
                        <Rate
                          className="text-sm"
                          disabled
                          defaultValue={Number(item?.averageRating)}
                        />
                        <p className="text-xs">Đã Bán {item.soldCount}</p>
                      </div>
                    ) : (
                      <div className="flex w-full my-2 rev-sold justify-center">
                        <span className="text-gray-600 ml-3 text-sm hidden"></span>
                        <p className="text-xs">Đã Bán {item.soldCount}</p>
                      </div>
                    )}
                    <div className="flex justify-center pb-4">
                      <p className="text-sm font-bold text-red-500 ">
                        {item.discount.toLocaleString("vi-VN")}₫
                      </p>
                      <p className="text-xs">- {handleDiscount(item)} %</p>
                    </div>
                  </Card> */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductList;
