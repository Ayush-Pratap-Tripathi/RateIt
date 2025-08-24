import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UpdatePasswordForm from "./UpdatePasswordForm";
import settingsIcon from "../assets/settings.png";

const Header = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="w-full bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-blue-600">RateIt</h1>

      {user && (
        <div className="flex-1 text-center">
          <span className="text-gray-700 text-lg font-medium">
            Welcome, {user.name}
          </span>
        </div>
      )}

      <div className="relative">
        <img
          src={settingsIcon}
          alt="Settings"
          className="w-7 h-7 cursor-pointer hover:opacity-80 transition"
          onClick={toggleDropdown}
        />

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border z-20">
            <ul className="py-1 text-sm">
              <li>
                <button
                  onClick={() => {
                    setIsPasswordFormOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-t-xl hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  Update Password
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-b-xl hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {isPasswordFormOpen && (
        <UpdatePasswordForm onClose={() => setIsPasswordFormOpen(false)} />
      )}
    </header>
  );
};

export default Header;
