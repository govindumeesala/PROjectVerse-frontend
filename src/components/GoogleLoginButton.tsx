import { useGoogleLogin } from "../api/authApi"; // Adjust the path if necessary
import { signInWithGoogle } from "../config/firebaseConfig"; // Firebase Google sign-in function
import { FcGoogle } from "react-icons/fc"; // Google icon

const GoogleLoginButton = () => {
  const { googleLogin } = useGoogleLogin();

  const handleGoogleLogin = async () => {
    try {
      const { token } = await signInWithGoogle();
      await googleLogin({ idToken: token });
    } catch (error) {
      console.error("Error during Google login:", error);
      // toast.error("Error during Google login");
    }
  };

  return (
  <button
    onClick={handleGoogleLogin}
    className="flex items-center rounded overflow-hidden shadow-md cursor-pointer"
  >
    <div className="bg-white p-2 flex items-center justify-center">
      <FcGoogle size={24} />
    </div>
    <div className="bg-red-600 text-white px-4 py-2 font-medium hover:bg-red-700 transition-colors">
      Continue with Google
    </div>
  </button>
  );
};

export default GoogleLoginButton;
