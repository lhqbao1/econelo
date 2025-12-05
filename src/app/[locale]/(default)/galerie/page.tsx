"use client";

import ImageGallery from "@/components/gallery/gallery-image-layout";
import GalleryVideoItem from "@/components/gallery/gallery-video-item";
import VideoGallery from "@/components/gallery/gallery-video-layout";
import React from "react";

const Gallery = () => {
  return (
    <section className="md:pt-[120px] bg-white lg:px-64 px-4 py-10">
      <VideoGallery />
      <ImageGallery />
    </section>
  );
};

export default Gallery;
