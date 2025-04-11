import { useGoogleLogin } from "../api/authApi"; // Adjust the path if necessary
import { signInWithGoogle } from "../config/firebaseConfig"; // Firebase Google sign-in function
import { toast } from "sonner";

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
      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
