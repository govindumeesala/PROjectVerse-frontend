import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlinePlus, AiOutlineMenu } from "react-icons/ai"; 
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
import { useLogoutUser } from "@/api/authApi";
import { useUserStore } from "@/store/useUserStore";

// Avatar component
const Avatar: React.FC<{
  name?: string | null;
  username?: string;
  profilePhoto?: string | null;
  size?: number;
}> = ({ name, username, profilePhoto, size = 32 }) => {
  const initial = (name || username || "").charAt(0).toUpperCase() || "U";
  if (profilePhoto) {
    return (
      <img
        src={profilePhoto}
        alt={username || name || "avatar"}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full bg-blue-800 text-white font-semibold"
      style={{ width: size, height: size }}
    >
      {initial}
    </div>
  );
};

const Navbar: React.FC = () => {
  const user = useUserStore((state) => state.user);
  console.log("Navbar user:", user);
  const isLoggedIn = user !== null;
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
                {isLoggedIn && user ? (
                  <div>
                    <div className="flex items-center gap-3">
                      <Avatar
                        profilePhoto={user.profilePhoto}
                        name={user.name}
                        username={user.username}
                        size={42}
                      />
                      <div>
                        <SheetTitle className="text-lg font-bold text-gray-900">
                          {user.username}
                        </SheetTitle>
                        {user.name && (
                          <SheetDescription className="text-gray-600">
                            {user.name}
                          </SheetDescription>
                        )}
                      </div>
                    </div>
                    <Separator className="mt-4 px-2" />
                  </div>
                ) : (
                  <>
                    <SheetTitle className="text-lg font-semibold">
                      Welcome to PROjectVerse
                    </SheetTitle>
                    <Separator className="px-2" />
                    <SheetDescription className="text-gray-600">
                      Login to explore and manage projects.
                    </SheetDescription>
                  </>
                )}
              </SheetHeader>

              {isLoggedIn && (
                <div className="mt-4 px-4 space-y-3">
                  <Link to={`/${user?.username}`} className="block text-gray-800 font-medium">
                    Profile
                  </Link>
                  <Button
                    onClick={() => logout()}
                    className="w-full bg-blue-600 hover:bg-red-700 text-white"
                    disabled={isPending}
                  >
                    {isPending ? "Logging out..." : "Log Out"}
                  </Button>
                </div>
              )}

              {!isLoggedIn && (
                <div className="mt-4 px-4">
                  <Button
                    onClick={() => navigate("/auth/login")}
                    className="w-full mt-4 bg-blue-800 hover:bg-blue-900 text-white"
                  >
                    Log In
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <div className="flex space-x-6 text-lg items-center">
            {/* Create Project Button */}
            {isLoggedIn && (
              <Link
                to="/create-project"
                className="hidden sm:flex items-center space-x-2 hover:text-cyan-400"
              >
                <AiOutlinePlus size={22} />
                <span className="hidden md:inline">Create Project</span>
              </Link>
            )}

            {/* Profile / Login Section */}
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-90">
                    <span className="text-white">{user.username}</span>
                    <Avatar
                      profilePhoto={user.profilePhoto}
                      name={user.name}
                      username={user.username}
                      size={30}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg rounded-lg p-3 w-45">
                  {/* Header inside dropdown */}
                  <div className="flex items-center gap-3 px-2">
                    <Avatar
                      profilePhoto={user.profilePhoto}
                      name={user.name}
                      username={user.username}
                      size={30}
                    />
                    <div>
                      <div className="font-bold text-gray-900">{user.username}</div>
                      {user.name && (
                        <div className="text-sm text-gray-600">{user.name}</div>
                      )}
                    </div>
                  </div>

                  <DropdownMenuSeparator className="border-t border-gray-300 my-3" />

                  <DropdownMenuLabel className="font-medium text-gray-700 cursor-pointer hover:text-blue-800">
                    <Link to={`/${user.username}`}>Profile</Link>
                  </DropdownMenuLabel>

                  <div className="mt-3">
                    <Button
                      onClick={() => logout()}
                      disabled={isPending}
                      className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md w-full"
                    >
                      {isPending ? "Logging out..." : "Log Out"}
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
