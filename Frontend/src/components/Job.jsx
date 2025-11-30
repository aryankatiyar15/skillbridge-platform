import React, { useState } from 'react';
import { Button } from './ui/button';
import { Bookmark, Check } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6 rounded-xl shadow-md bg-white border border-gray-100 hover:shadow-xl transition duration-300 ease-in-out">
      {/* Job Posted Time + Save */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Posted Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button
          variant="outline"
          className="rounded-full hover:bg-orange-50 hover:text-orange-500"
          size="icon"
        >
          <Bookmark />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 my-4">
        <Avatar className="w-12 h-12 border border-gray-200 shadow-sm">
          <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
        </Avatar>
        <div>
          <h1 className="font-semibold text-lg text-gray-900">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div>
        <h1 className="font-bold text-xl text-gray-800">{job?.title}</h1>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job?.description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
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

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mt-6">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="hover:border-orange-500 hover:text-orange-500 transition"
        >
          View Details
        </Button>

        {/* Save For Later Toggle */}
        {saved ? (
          <Button
            className="bg-green-500 text-white shadow-md flex items-center gap-2"
            disabled
          >
            <Check size={16} /> Saved
          </Button>
        ) : (
          <Button
            onClick={() => setSaved(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-md"
          >
            Save For Later
          </Button>
        )}
      </div>
    </div>
  );
};

export default Job;
