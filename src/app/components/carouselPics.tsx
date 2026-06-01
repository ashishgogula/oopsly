"use client";

import { Carousel } from "./ui/carousel";

export function CarouselDemo() {
  const slideData = [
    {
      title: "Mystic Mountains",
      button: "Explore Component",
      // ✨ FIX: Changed file extensions from .jpg to .png to match your files
      src: "/1.png",
    },
    {
      title: "Urban Dreams",
      button: "Explore Component",
      src: "/2.png",
    },
    {
      title: "Neon Nights",
      button: "Explore Component",
      src: "/3.png",
    },
    {
      title: "Desert Whispers",
      button: "Explore Component",
      src: "/4.png",
    },
  ];
  return (
    <div className="relative overflow-hidden w-full h-full">
      <Carousel slides={slideData} />
    </div>
  );
}
