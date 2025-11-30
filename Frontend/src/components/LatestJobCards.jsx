import React from 'react';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-6 rounded-xl shadow-md bg-white border border-gray-100 cursor-pointer 
                 hover:shadow-xl hover:border-gray-200 transition duration-300 ease-in-out"
    >
      {/* Company Info */}
      <div>
        <h1 className="font-semibold text-xl text-gray-900">{job?.company?.name}</h1>
        <p className="text-sm text-gray-500">India</p>
      </div>

      {/* Job Title & Description */}
      <div>
        <h1 className="font-bold text-lg my-3 text-gray-800">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mt-5">
        <Badge className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full shadow-sm">
          {job?.position} Positions
        </Badge>
        <Badge className="bg-orange-100 text-orange-600 font-medium px-3 py-1 rounded-full shadow-sm">
          {job?.jobType}
        </Badge>
        <Badge className="bg-purple-100 text-purple-700 font-medium px-3 py-1 rounded-full shadow-sm">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
