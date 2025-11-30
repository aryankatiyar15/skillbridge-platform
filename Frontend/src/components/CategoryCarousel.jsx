import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Code, Database, Palette, Laptop, Layers } from "lucide-react"; // icons

const categories = [
  { name: "Frontend Developer", icon: <Code className="h-6 w-6 text-orange-500" /> },
  { name: "Backend Developer", icon: <Database className="h-6 w-6 text-purple-500" /> },
  { name: "Data Science", icon: <Layers className="h-6 w-6 text-green-500" /> },
  { name: "Graphic Designer", icon: <Palette className="h-6 w-6 text-pink-500" /> },
  { name: "FullStack Developer", icon: <Laptop className="h-6 w-6 text-blue-500" /> },
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
   <div className="relative bg-gradient-to-r from-[#FFDEE9] via-[#B5FFFC] to-[#FFDEE9] py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-2">
          Explore by <span className="text-orange-500">Categories</span>
        </h2>
        {/* Subtitle */}
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Choose your career path and find jobs tailored to your skills and interests.
        </p>

        {/* Carousel */}
        <Carousel className="w-full">
          <CarouselContent>
            {categories.map((cat, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 flex justify-center"
              >
                <div
                  onClick={() => searchJobHandler(cat.name)}
                  className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 w-64 flex flex-col items-center text-center border hover:border-orange-400"
                >
                  <div className="mb-3 group-hover:scale-110 transition">
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-500">
                    {cat.name}
                  </h3>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default CategoryCarousel;
