import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#fff0e5] via-[#f7f7ff] to-[#e6f7ff] border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        
        {/* Brand Section */}
        <h2 className="text-2xl font-extrabold text-gray-900">
          Skill<span className="text-orange-500">Bridge</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          © 2025 SkillBridge. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
