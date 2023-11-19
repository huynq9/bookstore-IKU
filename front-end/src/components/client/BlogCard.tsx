import React from "react";

interface Props {}

const BlogCard = (props: Props) => {
  return (
    <div>
      <div className="w-full">
        <div />
        <div
          key="{content}"
          className="group relative rounded-lg overflow-hidden bg-white  hover:shadow-2xl "
        >
          <div className="h-40">
            <img
              src="https://lp-cms-production.imgix.net/2019-06/554369495_full.jpg"
              alt="City"
              className="h-40 w-full object-cover object-center "
            />
          </div>
          <div className="h-1/2 p-4 ">
            <h3 className="mb-2 text-base font-semibold text-blue-800">
              <a href="" className="hover:underline">
                Sed ut perspiciatis unde omnis iste
              </a>
            </h3>
            <p className="text-sm font-bold text-orange-500">perspiciatis</p>
            <div className="flex flex-row justify-between text-xs mt-2">
              <p>perspiciatis</p>
              <p>Sed ut perspiciatis unde omnis iste</p>
            </div>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
};

export default BlogCard;
