import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <section className="py-20 bg-gradient-to-r from-[#fff0e5] via-[#f7f7ff] to-[#e6f7ff]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-14">
          <span className="text-orange-500">Latest</span> &{" "}
          <span className="text-orange-500">Top</span>{" "}
          <span className="text-gray-900">Job Openings</span>
        </h2>

        {/* Job Cards Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {allJobs?.length > 0 ? (
            allJobs.slice(0, 6).map((job) => (
              <div
                key={job._id}
                className="transform transition duration-300 hover:scale-105"
              >
                <LatestJobCards job={job} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
               No job postings available right now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
