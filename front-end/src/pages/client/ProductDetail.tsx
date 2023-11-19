import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { IBook } from "../../interfaces/book";
import { loadBooks } from "../../store/book/productSlice";
import { useGetProductByIdQuery, useGetProductsQuery } from "../../api/product";
import Slider, { CustomArrowProps } from "react-slick";
import { Button, Image, InputNumber, Rate, message } from "antd";
import { Link, useParams } from "react-router-dom";
import { Form } from "antd";
import { useAddToCartMutation, useGetCartQuery } from "../../api/cart";
import { addToCartLocal } from "../../store/cart/cartSlice";

const ProductDetail = () => {
  const user = useSelector((state: RootState) => state.user);
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
  const books = useSelector((state: RootState) => state.products.books);
  const { refetch: refetchCart } = useGetCartQuery();
  const { id } = useParams();
  const { data: book } = useGetProductByIdQuery(id!);
  const [addToCart] = useAddToCartMutation();
  const handleDiscount = (item: IBook) => {
    const result = ((item.price - item.discount) / item.price).toFixed();
    return result;
  };
  const onFinish = async (values: { quantity: number }) => {
    if (user.isLoggedIn && id) {
      await addToCart({
        bookId: id,
        quantity: values.quantity,
        price: book?.discount,
      });
      refetchCart();
      message.success("addToCart Success");
    } else if (book) {
      dispatch(
        addToCartLocal({
          book: book,
          quantity: values.quantity,
        })
      );
      message.success("addToCartLocal Success");
    }
  };
  const cate = book?.categoryId;
  console.log("cate", cate);

  // Assuming 'cate' is an array of category objects
  const cateBooksId = cate?.map((item) => item._id);
  console.log("cateBooksId", cateBooksId);

  const bookData = books.filter((item) =>
    item.categoryId.some((id) => cateBooksId?.includes(id._id))
  );
  console.log("bookData", bookData);

  return (
    <main className="w-4/5 mx-auto">
      {/* component */}
      <section className="text-gray-700 body-font overflow-hidden bg-white">
        <div className="container px-5 pt-16  mx-auto">
          <div className="lg:w-4/5 mx-auto flex ">
            <Image
              alt="ecommerce"
              className="lg:w-1/2 w-full object-cover  object-center rounded border border-gray-200"
              src={book?.images[0].url}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {book?.title}
                <h2 className="text-xs title-font text-gray-500 tracking-widest">
                  {book?.categoryId.map((item) => (
                    <Link key={item._id} to={`/products/category/${item._id}`}>
                      {item.name}{" "}
                    </Link>
                  ))}{" "}
                </h2>
              </h1>
              <div className="flex mb-4">
                <span className="flex items-center">
                  <span className="mt-2">Tác giả: </span>
                  {book?.authorId.map((author) => (
                    <a key={author._id + book._id} href="#">
                      {author.name}
                    </a>
                  ))}
                </span>
                <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">
                  {book?.averageRating != null ? (
                    <>
                      <Rate
                        className="text-sm"
                        disabled
                        defaultValue={Number(book?.averageRating)}
                      />
                      <span className="text-gray-600 ml-3 text-sm">
                        4 Reviews
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-600 ml-3 text-sm">
                      Chưa có đánh giá
                    </span>
                  )}
                </span>
              </div>
              <p className="leading-relaxed text-xs lg:text-sm h-20 overflow-hidden">
                {book?.description}
              </p>
              <div className="flex items-center jus">
                <div className="flex  py-4">
                  <span className="text-1xl font-bold text-red-500">
                    {book?.discount.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-sm text-slate-900 line-through">
                    {book?.sale > 0
                      ? book?.price.toLocaleString("vi-VN") + "đ"
                      : ""}
                  </span>
                </div>
                {/* <div className='text-sm text-gray-500 ml-6'>Số lượng {book?.stock}</div> */}
                <div className="text-sm text-gray-500 ml-10 flex">
                  <img
                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/d9e992985b18d96aab90969636ebfd0e.png"
                    alt=""
                    width={"32px"}
                  />{" "}
                  Miễn phí vận chuyển
                </div>
              </div>

              <div className="flex mt-5">
                <Form
                  initialValues={{ quantity: 1 }}
                  name=""
                  onFinish={onFinish}
                  layout="inline"
                >
                  <Form.Item label="Số lượng" name="quantity">
                    <InputNumber
                      max={book?.stock}
                      controls={true}
                      style={{ maxWidth: "80%" }}
                    />
                  </Form.Item>
                  <Button type="dashed" htmlType="submit">
                    Thêm vào giỏ hàng
                  </Button>
                  <div></div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t mt-28">
        <h3 className=" text-4xl p-4">Cùng thể loại</h3>
        <div className="image-slider flex">
          {bookData?.map((item: IBook) => {
            return (
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
                  {/* <a
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
                  </a> */}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
