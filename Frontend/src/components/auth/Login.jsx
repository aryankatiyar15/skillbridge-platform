import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const changeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);

        // Redirect based on role
        if (res.data.user.role === "student") {
          navigate("/profile");
        } else {
          navigate("/admin/jobs");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#fff0e5] via-[#f7f7ff] to-[#e6f7ff]">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Welcome Back to <span className="text-[#F97316]">SkillBridge</span>
        </h1>

        <form onSubmit={loginHandler} className="space-y-5">
          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={changeHandler}
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={changeHandler}
              required
            />
          </div>

          {/* Role */}
          <div>
            <Label>Role</Label>
            <select
              name="role"
              value={formData.role}
              onChange={changeHandler}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Footer Links */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-[#F97316] font-medium hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
