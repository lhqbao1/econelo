import Image from "next/image";
import React from "react";

const VideoSection = () => {
  return (
    <section className="w-full lg:py-12 md:py-8 py-6 bg-white flex flex-col justify-center items-center md:gap-32 gap-24">
      <div className="w-11/12 lg:w-9/12">
        <Image
          src={"/video-section-banner.jpg"}
          width={1200}
          height={600}
          alt=""
          className="w-full h-auto rounded-tl-[80px] rounded-br-[80px] object-cover"
        />
      </div>
    </section>
  );
};

export default VideoSection;
