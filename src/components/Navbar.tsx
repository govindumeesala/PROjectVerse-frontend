import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import { AiOutlinePlus } from "react-icons/ai"; // Plus Icon
import { AiOutlineMenu } from "react-icons/ai"; // menu icon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "./ui/separator";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Change this based on auth state

  return (
    <nav className="bg-blue-900 text-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 fixed w-full shadow-lg z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-semibold tracking-wide"
        >
          PROjectVerse
        </Link>

        {/* mobile navbar */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="text-white text-2xl">
              <AiOutlineMenu />
            </SheetTrigger>
            <SheetContent side="left" className="bg-white shadow-lg p-3 w-[300px]">
              <SheetHeader className="py-2">
                {isLoggedIn ? (
                  <div>
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-lg font-semibold">
                      John Doe
                    </SheetTitle>
                    <FaUserCircle size={25} className="text-blue-800" />
                  </div>
                  <Separator className="mt-4 px-2"></Separator>
                  </div>
                ) : (
                  <>
                    <SheetTitle className="text-lg font-semibold">
                      Welcome to PROjectVerse
                    </SheetTitle>
                    <Separator className="px-2"></Separator>
                    <SheetDescription className="text-gray-600">
                      Login to explore and manage projects.
                    </SheetDescription>
                    <Button className="w-full mt-4 bg-blue-800 hover:bg-blue-900 text-white">
                      Log In
                    </Button>
                  </>
                )}
              </SheetHeader>

              {isLoggedIn && (
                <div className="mt-0 px-4">
                  <Link
                    to='/profile'
                    className="w-full text-left text-gray-800"
                  >
                    Profile
                  </Link>
                  <Button className="w-full mt-2 bg-blue-600 hover:bg-red-700 text-white">
                    Log Out
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* main nav bar for screens from tablets */}
        <div className="hidden md:block">
          {/* Navigation Links */}
          <div className="flex space-x-6 text-lg">
            {/* Create Project Button */}
            {isLoggedIn && (
              <Link
                to="/create-project"
                className="hidden sm:flex items-center space-x-2 hover:text-cyan-400"
              >
                <AiOutlinePlus size={24} />
                <span className="hidden md:inline">Create Project</span>
              </Link>
            )}

            {/* Profile/Login Section */}
            {isLoggedIn ? (
              // Only show profile icon if logged in
              // <Link to="/profile" className="hover:text-yellow-400">
              //   <FaUserCircle size={26} />
              // </Link>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <FaUserCircle
                    size={26}
                    className="cursor-pointer hover:text-gray-300 transition"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg rounded-lg p-2 w-30">
                  <DropdownMenuLabel className="font-semibold text-gray-700">
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="border-t border-gray-300 mx-2 my-1 mb-2" />
                  <div className="flex justify-center">
                    <Button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md w-full">
                      Log out
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Show "Login" text if not logged in
              <Link to="/login" className="hover:text-yellow-400">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
