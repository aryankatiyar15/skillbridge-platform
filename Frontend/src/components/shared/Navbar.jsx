import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        
        {/* Brand */}
        <Link to="/">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Skill<span className="text-[#F97316]">Bridge</span>
          </h1>
        </Link>

        {/* Nav Links */}
        <ul className="hidden md:flex font-medium items-center gap-8 text-gray-700">
          {user && user.role === 'recruiter' ? (
            <>
              <li><Link to="/admin/companies" className="hover:text-[#F97316]">Companies</Link></li>
              <li><Link to="/admin/jobs" className="hover:text-[#F97316]">Jobs</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/" className="hover:text-[#F97316]">Home</Link></li>
              <li><Link to="/jobs" className="hover:text-[#F97316]">Jobs</Link></li>
              <li><Link to="/browse" className="hover:text-[#F97316]">Browse</Link></li>
            </>
          )}
        </ul>

        {/* Auth / Avatar */}
        {!user ? (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" className="rounded-full px-5 border border-gray-300 text-gray-700 hover:border-[#F97316] hover:text-[#F97316]">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="rounded-full px-5 bg-[#F97316] hover:bg-[#EA580C] text-white">
                Signup
              </Button>
            </Link>
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className="cursor-pointer ring-2 ring-[#F97316] hover:ring-[#EA580C] transition">
                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900">{user?.fullname}</h4>
                  <p className="text-sm text-gray-500">{user?.profile?.bio}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {user?.role === 'student' && (
                  <Button asChild variant="ghost" className="w-full justify-start text-gray-700 hover:text-[#F97316]">
                    <Link to="/profile"><User2 className="mr-2 h-4 w-4" /> View Profile</Link>
                  </Button>
                )}

                <Button onClick={logoutHandler} variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}

export default Navbar
