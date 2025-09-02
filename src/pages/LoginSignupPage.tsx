import { useState } from "react";
import { SignupForm } from "@/forms/SignupForm";
import { LoginForm } from "@/forms/LoginForm";
import { CompleteSignupForm } from "@/forms/CompleteSignupForm";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { useGoogleLogin } from "@/api/authApi";
import { z } from "zod";
import { toast } from "sonner";

export type PageState = "login" | "signup" | "complete-signup";

const completeSignupSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

const LoginSignupPage = () => {
  const [pageState, setPageState] = useState<PageState>("login");
  const [tempUserData, setTempUserData] = useState<{
    name: string;
    email: string;
    idToken: string;
  } | null>(null);
  const { googleLogin } = useGoogleLogin();

  const handleGoogleSignupComplete = async (data: z.infer<typeof completeSignupSchema>) => {
    if (!tempUserData?.idToken) return;

    try {
      await googleLogin({ 
        idToken: tempUserData.idToken,
        username: data.username 
      });
      // useGoogleLogin hook will handle the redirect on success
    } catch (error: any) {
      console.error("Error completing signup:", error);
      toast.error("Signup failed", {
        description: error?.response?.data?.message || "Please try again"
      });
    }
  };

  const renderForm = () => {
    switch (pageState) {
      case "complete-signup":
        if (!tempUserData) return null;
        return (
          <CompleteSignupForm
            initialData={tempUserData}
            onSubmit={handleGoogleSignupComplete}
          />
        );
      case "signup":
        return <SignupForm />;
      default:
        return <LoginForm />;
    }
  };

  const renderTitle = () => {
    switch (pageState) {
      case "complete-signup":
        return "Complete Your Profile";
      case "signup":
        return "Sign Up for PROjectVerse";
      default:
        return "Log In to PROjectVerse";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
          {renderTitle()}
        </h2>

        {renderForm()}

        {pageState !== "complete-signup" && (
          <>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLoginButton 
                setPageState={setPageState}
                setTempUserData={setTempUserData}
                pageState={pageState}
              />
            </div>

            <p className="mt-6 text-center text-gray-600">
              {pageState === "login" ? (
                <>
                  New to PROjectVerse?{" "}
                  <button
                    type="button"
                    onClick={() => setPageState("signup")}
                    className="text-blue-900 font-semibold hover:underline focus:outline-none"
                  >
                    Sign up now
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setPageState("login")}
                    className="text-blue-900 font-semibold hover:underline focus:outline-none"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginSignupPage;
