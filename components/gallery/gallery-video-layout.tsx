"use client";

import GalleryVideoItem from "@/components/gallery/gallery-video-item";

const VideoGallery = () => {
  const videos = [
    { file: "video1.mp4", col: 2, row: 2 },
    { file: "video2.mp4", col: 1, row: 1 },
    { file: "video3.mp4", col: 1, row: 2 },
    { file: "video4.mp4", col: 1, row: 1 },
    { file: "video5.mp4", col: 1, row: 1 },
    { file: "video6.mp4", col: 2, row: 1 },
    { file: "video7.mp4", col: 1, row: 1 },
  ];

  return (
    <section className="">
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-2 
          auto-rows-[200px] 
          md:auto-rows-[250px] 
          lg:auto-rows-[280px]
        "
      >
        {videos.map((item, index) => (
          <div
            key={index}
            className={`overflow-hidden col-span-${item.col} row-span-${item.row}`}
          >
            <GalleryVideoItem file={item.file} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoGallery;
