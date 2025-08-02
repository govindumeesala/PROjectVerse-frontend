import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import { AiOutlinePlus, AiOutlineMenu } from "react-icons/ai"; // Plus & Menu Icons
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { useAuthStore } from "@/store/useAuthStore";
import { useLogoutUser } from "@/api/authApi";

const Navbar = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  console.log("Access Token:", accessToken);
  const isLoggedIn = !!accessToken;
  const { logout, isPending } = useLogoutUser();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-900 text-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 fixed w-full shadow-lg z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-semibold tracking-wide">
          PROjectVerse
        </Link>

        {/* Mobile Navbar */}
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
                      <SheetTitle className="text-lg font-semibold">John Doe</SheetTitle>
                      <FaUserCircle size={25} className="text-blue-800" />
                    </div>
                    <Separator className="mt-4 px-2" />
                  </div>
                ) : (
                  <>
                    <SheetTitle className="text-lg font-semibold">Welcome to PROjectVerse</SheetTitle>
                    <Separator className="px-2" />
                    <SheetDescription className="text-gray-600">
                      Login to explore and manage projects.
                    </SheetDescription>
                    <Button onClick={() => navigate("/auth/login")} className="w-full mt-4 bg-blue-800 hover:bg-blue-900 text-white">
                      Log In
                    </Button>
                  </> 
                )}
              </SheetHeader>
              {isLoggedIn && (
                <div className="mt-0 px-4">
                  <Link to="/profile" className="w-full text-left text-gray-800">
                    Profile
                  </Link>
                  <Button
                    onClick={() => logout()}
                    className="w-full mt-2 bg-blue-600 hover:bg-red-700 text-white"
                    disabled={isPending}
                  >
                    {isPending ? "Logging out..." : "Log Out"}
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Navbar for Tablets and Larger Screens */}
        <div className="hidden md:block">
          <div className="flex space-x-6 text-lg">
            {/* Create Project Button (only visible when logged in) */}
            {isLoggedIn && (
              <Link
                to="/create-project"
                className="hidden sm:flex items-center space-x-2 hover:text-cyan-400"
              >
                <AiOutlinePlus size={24} />
                <span className="hidden md:inline">Create Project</span>
              </Link>
            )}

            {/* Profile / Login Section */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <FaUserCircle size={26} className="cursor-pointer hover:text-gray-300 transition" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg rounded-lg p-2 w-30">
                  <DropdownMenuLabel className="font-semibold text-gray-700">
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="border-t border-gray-300 mx-2 my-1 mb-2" />
                  <div className="flex justify-center">
                    <Button
                      onClick={() => logout()}
                      disabled={isPending}
                      className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md w-full"
                    >
                      {isPending ? "Logging out..." : "Log Out" }
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth/login" className="hover:text-yellow-400">
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
