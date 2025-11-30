import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Briefcase, MapPin, FileText, Clock, Users, CalendarDays, CheckCircle2 } from 'lucide-react';

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isInitiallyApplied =
    singleJob?.applications?.some((application) => application.applicant === user?._id) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some((application) => application.applicant === user?._id)
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-5xl mx-auto my-12 bg-gradient-to-r from-[#fff0e5] via-[#f7f7ff] to-[#e6f7ff] shadow-lg rounded-xl p-8 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-extrabold text-3xl text-gray-900">
            {singleJob?.title?.split(' ')[0]}{' '}
            <span className="text-orange-500">
              {singleJob?.title?.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full shadow-sm">
              {singleJob?.position} Positions
            </Badge>
            <Badge className="bg-orange-100 text-orange-600 font-semibold px-3 py-1 rounded-full shadow-sm">
              {singleJob?.jobType}
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full shadow-sm">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>
        {isApplied ? (
          <Button
            disabled
            className="rounded-lg px-6 py-2 font-semibold shadow-md bg-green-100 text-green-700 flex items-center gap-2"
          >
            <CheckCircle2 size={18} /> Applied
          </Button>
        ) : (
          <Button
            onClick={applyJobHandler}
            className="rounded-lg px-6 py-2 font-semibold shadow-md bg-orange-500 hover:bg-orange-600 text-white"
          >
            Apply Now
          </Button>
        )}
      </div>

      {/* Job Details */}
      <h2 className="text-xl font-semibold border-b border-gray-200 pb-3 mb-6 text-gray-800">
        Job Details
      </h2>
      <div className="space-y-4 text-gray-700">
        <p className="flex items-center gap-2">
          <Briefcase size={18} className="text-orange-500" />
          <span className="font-bold">Role:</span>
          <span className="pl-2 text-gray-800">{singleJob?.title}</span>
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={18} className="text-purple-500" />
          <span className="font-bold">Location:</span>
          <span className="pl-2 text-gray-800">{singleJob?.location}</span>
        </p>
        <p className="flex items-center gap-2">
          <FileText size={18} className="text-blue-500" />
          <span className="font-bold">Description:</span>
          <span className="pl-2 text-gray-800">{singleJob?.description}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock size={18} className="text-orange-400" />
          <span className="font-bold">Experience:</span>
         <span className="pl-2 text-gray-800">{singleJob?.experienceLevel} yrs</span>

        </p>
        <p className="flex items-center gap-2">
          <Briefcase size={18} className="text-purple-500" />
          <span className="font-bold">Salary:</span>
          <span className="pl-2 text-gray-800">{singleJob?.salary} LPA</span>
        </p>
        <p className="flex items-center gap-2">
          <Users size={18} className="text-blue-500" />
          <span className="font-bold">Total Applicants:</span>
          <span className="pl-2 text-gray-800">{singleJob?.applications?.length}</span>
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays size={18} className="text-gray-500" />
          <span className="font-bold">Posted Date:</span>
          <span className="pl-2 text-gray-800">
            {singleJob?.createdAt ? singleJob?.createdAt.split('T')[0] : 'N/A'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default JobDescription;
