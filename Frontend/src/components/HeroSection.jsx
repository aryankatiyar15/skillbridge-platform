import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import JobHuntSVG from "@/assets/job-hunt-animate.svg";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { JOB_API_END_POINT } from "@/utils/constant"; 

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // dynamic search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== "") {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 400); 
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchSuggestions = async (searchTerm) => {
    try {
      console.log("Calling API:", `${JOB_API_END_POINT}/search?q=${searchTerm}`);
      const res = await axios.get(`${JOB_API_END_POINT}/search?q=${searchTerm}`);
      console.log("Response:", res.data);
      setSuggestions(res.data.jobs || []);
    } catch (error) {
      console.error("Error fetching job suggestions:", error);
    }
  };

  const handleSelect = (jobTitle) => {
    setQuery(jobTitle);
    setSuggestions([]);
    dispatch(setSearchedQuery(jobTitle));
    navigate("/browse");
  };

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="relative bg-gradient-to-r from-[#fdf2f8] via-[#f0f9ff] to-[#fdf2f8] py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 px-6">
        
        {/* Left Side */}
        <div className="text-center md:text-left flex flex-col gap-6">
          <span className="w-fit mx-auto md:mx-0 px-5 py-2 rounded-full bg-[#FF8C42] text-black font-semibold text-sm shadow-md">
            Unlock Your Career Potential
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Here, <span className="text-[#FF5722]">Skills</span> meet{" "}
            <span className="text-[#FF8C42]">Opportunity</span>
          </h1>

          <p className="text-[#333333] text-lg max-w-lg mx-auto md:mx-0 font-medium">
            Turn your skills into careers. Connect with companies looking for
            talent like yours.
          </p>

          {/* Search bar with live suggestions */}
          <div className="relative flex flex-col items-start w-full md:w-[80%]">
            <div className="flex shadow-md border border-gray-200 pl-4 rounded-full items-center gap-3 w-full bg-white">
              <input
                type="text"
                placeholder="Find your dream job..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="outline-none border-none w-full py-3 text-gray-700 placeholder:text-gray-500"
              />
              <Button
                onClick={searchJobHandler}
                className="rounded-r-full bg-[#FF8C42] hover:bg-[#e67628] px-6 py-3 text-white"
              >
                <Search className="h-5 w-5 text-white" />
              </Button>
            </div>

            {/* Animated suggestions dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-14 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                >
                  {suggestions.map((job) => (
                    <li
                      key={job._id}
                      onClick={() => handleSelect(job.title)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                    >
                      {job.title}{" "}
                      <span className="text-sm text-gray-500">
                        • {job.company?.name || job.location}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side Illustration */}
        <div className="flex justify-center md:justify-end">
          <img
            src={JobHuntSVG}
            alt="Job Hunt Illustration"
            className="w-[320px] md:w-[500px] lg:w-[600px] h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
