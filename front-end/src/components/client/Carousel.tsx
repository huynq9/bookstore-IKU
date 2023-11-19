import React from "react";
import { Carousel } from "antd";
const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "700px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const CarouselC = () => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };
  return (
    <>
      <Carousel afterChange={onChange} autoplay={true}>
        <div>
          <h3 style={contentStyle}>
            <img
              className="img-fluid"
              src="https://thietkehosonangluc.edu.vn/uploads/images/thiet-ke-do-hoa-khac/banner-sach/1.png"
              alt=""
            />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <img
              src="https://url.sachtot.vn/res/Avatar/201511180948500003210_doc_sach_online_banner.jpg"
              alt=""
            />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
        <div>
          <h3 style={contentStyle}>4</h3>
        </div>
      </Carousel>
    </>
  );
};

export default CarouselC;
