"use client";

import React from "react";
import Image from "next/image";

const Gallery = () => {
  return (
    <section className="md:pt-[120px] bg-white lg:px-64 px-4 py-10">
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
        {/* ITEM 1 */}
        <div className="col-span-2 row-span-2 overflow-hidden">
          <GalleryItem src="https://youtu.be/bVeZanOBfIs" />
        </div>

        {/* ITEM 2 */}
        <div className="col-span-1 row-span-1 overflow-hidden">
          <GalleryItem src="https://youtu.be/Uh6kwuZKdrg" />
        </div>

        {/* ITEM 3 */}
        <div className="col-span-1 row-span-2 overflow-hidden">
          <GalleryItem src="https://youtu.be/dxvXf9r5d6Y" />
        </div>

        {/* ITEM 4 */}
        <div className="col-span-1 overflow-hidden">
          <GalleryItem src="https://youtu.be/Ir_F2DzSg5U" />
        </div>

        {/* ITEM 5 */}
        <div className="col-span-1 overflow-hidden">
          <GalleryItem src="https://youtu.be/sppR8XPGgHo" />
        </div>

        {/* ITEM 6 */}
        <div className="col-span-2 row-span-1 overflow-hidden">
          <GalleryItem src="https://youtu.be/SESppSkKIBE" />
        </div>

        {/* ITEM 7 */}
        <div className="col-span-1 row-span-2 overflow-hidden">
          <GalleryItem src="https://youtu.be/1yoMVx3B7yY" />
        </div>

        {/* ITEM 8 */}
        <div className="col-span-1 overflow-hidden">
          <GalleryItem src="https://youtu.be/xzDlHhTIobY" />
        </div>

        {/* ITEM 9 */}
        <div className="col-span-2 overflow-hidden">
          <GalleryItem src="https://www.youtube.com/watch?v=Ir_F2DzSg5U" />
        </div>
      </div>
    </section>
  );
};

export default Gallery;

const GalleryItem = ({ src }: { src: string }) => {
  // Convert YouTube link → Embed link
  const embedUrl = convertYoutubeToEmbed(src);

  return (
    <div className="w-full h-full relative group overflow-hidden">
      <iframe
        src={embedUrl}
        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

function convertYoutubeToEmbed(url: string) {
  return url
    .replace("watch?v=", "embed/")
    .replace("youtu.be/", "youtube.com/embed/");
}
