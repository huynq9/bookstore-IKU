import { Rate } from "antd";
import React, { useEffect } from "react";
import Slider, { CustomArrowProps } from "react-slick";
import { useGetProductsQuery } from "../../api/product";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { loadBooks } from "../../store/book/productSlice";
import { IBook } from "../../interfaces/book";
import { Link } from "react-router-dom";

const HomePage = () => {
  const SlickArrowLeft = ({
    currentSlide,
    slideCount,
    ...props
  }: CustomArrowProps) => (
    <button
      {...props}
      className={
        "slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
      <i className="fa fa-angle-left" aria-hidden="true"></i>
    </button>
  );
  const SlickArrowRight = ({
    currentSlide,
    slideCount,
    ...props
  }: CustomArrowProps) => (
    <button
      {...props}
      className={
        "slick-next slick-arrow" +
        (currentSlide === slideCount - 1 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      <i className="fa fa-angle-right" aria-hidden="true"></i>
    </button>
  );
  const settings = {
    // autoplay: true,
    initialSlide: 2,
    dots: false,
    infinite: true,
    speed: 500,
    adaptiveHeight: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1200, // Khi màn hình có chiều rộng dưới 1200px
        settings: {
          slidesToShow: 3, // Hiển thị 3 slide
        },
      },
      {
        breakpoint: 992, // Khi màn hình có chiều rộng dưới 992px
        settings: {
          slidesToShow: 2, // Hiển thị 2 slide
        },
      },
      {
        breakpoint: 640, // Khi màn hình có chiều rộng dưới 768px
        settings: {
          slidesToShow: 1, // Hiển thị 1 slide
        },
      },
    ],
  };
  const dispatch = useDispatch();
  const { data: bookData } = useGetProductsQuery();
  // console.log(bookData)

  const books = useSelector((state: RootState) => state.products.books);
  useEffect(() => {
    if (bookData && bookData.length > 0) {
      dispatch(loadBooks(bookData));
    }
  }, [bookData]);

  const discountedBooks = books.filter(
    (item) => item.discount - item.price < 0
  );
  const highlyRatedBooks = books.filter(
    (item) => Number(item.averageRating) > 4
  );
  const topSellingBooks = books.filter((item) => Number(item.soldCount) > 100);

  const handleDiscount = (item: IBook) => {
    const result = (
      ((item.price - item.discount) / item.price) *
      100
    ).toFixed();
    console.log(result);
    return result;
  };
  const featureBooks = bookData?.filter((item) => item.views >= 5);
  console.log(featureBooks);

  return (
    <main className="w-4/5 mx-auto">
      <div className="items-center slider-and-banner lg:mx-auto ">
        <div className="slider">
          <div
            id="indicators-carousel"
            className="relative w-full "
            data-carousel="static"
          >
            {/* Carousel wrapper */}
            <div className="relative overflow-hidden rounded-lg h-[600px] ">
              {/* Item 1 */}
              <div
                className=" duration-700 ease-in-out fit-slider-img"
                data-carousel-item="active"
              >
                <Link to={"#"}>
                  <img
                    loading="lazy"
                    src="https://thietkehosonangluc.edu.vn/uploads/images/thiet-ke-do-hoa-khac/banner-sach/1.png"
                    alt="..."
                    className="object-cover"
                  />
                </Link>
              </div>
              {/* Item 2 */}
              <div
                className=" duration-700 ease-in-out fit-slider-img"
                data-carousel-item
              >
                <Link to={"#"}>
                  <img
                    loading="lazy"
                    src="https://thietkehosonangluc.edu.vn/uploads/images/thiet-ke-do-hoa-khac/banner-sach/1.png"
                    className="absolute block w-full h-full max-w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    alt="..."
                  />
                </Link>
              </div>
              {/* Item 3 */}
              <div
                className=" duration-700 ease-in-out fit-slider-img"
                data-carousel-item
              >
                <Link to={"#"}>
                  <img
                    loading="lazy"
                    src="https://thietkehosonangluc.edu.vn/uploads/images/thiet-ke-do-hoa-khac/banner-sach/1.png"
                    className="absolute block w-full  h-full max-w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    alt="..."
                  />
                </Link>
              </div>
            </div>
            {/* Slider indicators */}
            <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-9 left-1/2">
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="true"
                aria-label="Slide 1"
                data-carousel-slide-to={0}
              />
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 2"
                data-carousel-slide-to={1}
              />
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 3"
                data-carousel-slide-to={2}
              />
            </div>
            {/* Slider controls */}
            <button
              className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-prev
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 1 1 5l4 4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-next
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
        </div>
        <div className="mt-10">
          <h1 className="text-4xl">Sản phẩm nổi bật</h1>
          <div className="flex flex-wrap">
            {featureBooks?.map((item: IBook) => (
              <Link
                to={`/products/${item._id}`}
                key={item._id}
                className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
              >
                <a
                  className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
                  href="#"
                >
                  <img
                    className="object-cover mx-auto"
                    src={item.images[0].url}
                  />
                  {/* <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
                    39% OFF
                  </span> */}
                </a>
                <div className="mt-4 px-5 pb-5">
                  <a href="#">
                    <h5 className="text-xl tracking-tight text-slate-900">
                      {item.title}
                    </h5>
                    <p className="text-sm text-stone-400 ">
                      {item.authorId.map((author) => (
                        <a key={author._id + item._id} href="#">
                          {author.name}
                        </a>
                      ))}
                    </p>
                  </a>
                  <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                      <span className="text-2xl font-bold text-red-500">
                        {item.discount.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="text-sm text-slate-900 line-through">
                        {item.discount === 0
                          ? item.discount.toLocaleString("vi-VN") + "đ"
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
          </div>
        </div>
        <div className="mt-10">
          <h1 className="text-4xl">Sản phẩm đang khuyến mại</h1>
          <div className="flex flex-wrap">
            {bookData?.map(
              (item: IBook) =>
                item.sale > 0 && (
                  <Link
                    to={`/products/${item._id}`}
                    key={item._id}
                    className="relative m-7 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
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
                        <p className="text-sm text-stone-400 ">
                          {item.authorId.map((author) => (
                            <a key={author._id + item._id} href="#">
                              {author.name}
                            </a>
                          ))}
                        </p>
                      </a>
                      <div className="mt-2 mb-5 flex items-center justify-between">
                        <p>
                          <span className="text-2xl font-bold text-red-500">
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
                )
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
