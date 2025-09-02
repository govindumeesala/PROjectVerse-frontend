import { signInWithGoogle } from "@/config/firebaseConfig";
import { useGoogleLogin } from "@/api/authApi";
import { FcGoogle } from "react-icons/fc";
import { PageState } from "@/pages/LoginSignupPage";
import { toast } from "sonner";

type GoogleLoginButtonProps = {
  setPageState: (state: PageState) => void;
  setTempUserData: (data: { name: string; email: string; idToken: string } | null) => void;
  pageState: PageState;
};

const GoogleLoginButton = ({ setPageState, setTempUserData }: GoogleLoginButtonProps) => {
  const { googleLogin } = useGoogleLogin();

  const handleGoogleLogin = async () => {
    try {
      const { token, user } = await signInWithGoogle();

      try {
        // Always try to login first, regardless of pageState
        await googleLogin({ idToken: token });
        // If successful, user will be redirected by useGoogleLogin hook
      } catch (error: any) {
        // If user doesn't exist (404) or needs username (400), show complete signup form
        if (error?.response?.status === 404 || error?.response?.status === 400) {
          setTempUserData({
            name: user.displayName || "",
            email: user.email || "",
            idToken: token
          });
          setPageState("complete-signup");
        } else {
          // Handle other errors (like email already registered with password)
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Error during Google login:", error);
      toast.error("Google login failed", {
        description: error?.message || "Please try again"
      });
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
