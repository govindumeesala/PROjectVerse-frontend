import { useState, useEffect } from "react";
import { SignupForm } from "@/forms/SignupForm";
import { LoginForm } from "@/forms/LoginForm";
import { CompleteGoogleSignup } from "@/forms/CompleteGoogleSignup";
import GoogleLoginButton from "@/components/signup/GoogleLoginButton";
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

  // Feature carousel state with better animation
  const features = [
    { text: "Shareable project pages", icon: "📄" },
    { text: "In-app collaborations", icon: "👥" },
    { text: "Smart filters & search", icon: "🔍" },
    { text: "Real-time analytics", icon: "📊" },
  ];
  const [featureIndex, setFeatureIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    const currentFeature = features[featureIndex];
    let charIndex = 0;
    setIsTyping(true);
    setDisplayText("");
    
    const typeInterval = setInterval(() => {
      if (charIndex < currentFeature.text.length) {
        setDisplayText(currentFeature.text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 80); // Typing speed
    
    return () => clearInterval(typeInterval);
  }, [featureIndex]);
  
  useEffect(() => {
    const t = setInterval(() => {
      setFeatureIndex((i) => (i + 1) % features.length);
    }, 4000); // Change feature every 4 seconds
    return () => clearInterval(t);
  }, [features.length]);

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
          <CompleteGoogleSignup
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* left: hero area - completely redesigned */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 px-4">
            {/* Logo and tagline */}
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                PROjectVerse
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed max-w-md">
                Build, share and collaborate — all in one place. Transform your project management experience.
              </p>
            </div>

            {/* Animated feature display with typewriter effect */}
            <div className="space-y-6 py-6">
              <div className="flex items-center gap-4 min-h-[60px]">
                <div className="text-4xl animate-bounce">
                  {features[featureIndex].icon}
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-800 min-h-[32px]">
                    {displayText}
                    {isTyping && <span className="animate-pulse">|</span>}
                  </div>
                  <div className="mt-2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-0 animate-[grow_3s_ease-in-out_forwards]" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
              
              {/* Feature indicators */}
              <div className="flex gap-3 mt-6">
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFeatureIndex(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === featureIndex
                        ? "bg-blue-600 w-8"
                        : "bg-gray-300 w-2 hover:bg-gray-400"
                    }`}
                    aria-label={`Feature ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Feature list */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    idx === featureIndex
                      ? "bg-white/60 backdrop-blur-sm shadow-lg scale-105"
                      : "bg-white/30 backdrop-blur-sm"
                  }`}
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <div className="text-sm font-medium text-gray-700">{feature.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right: form area - integrated with background */}
          <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {renderTitle()}
                </h2>
                <p className="text-sm text-gray-600">
                  {pageState === "login" 
                    ? "Welcome back! Please sign in to continue."
                    : pageState === "signup"
                    ? "Create your account to get started."
                    : "Just one more step to complete your profile."
                  }
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50">
                {renderForm()}

                {pageState !== "complete-signup" && (
                  <>
                    <div className="mt-6 flex items-center justify-center gap-4">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="text-sm text-gray-500 font-medium">or</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <GoogleLoginButton 
                        setPageState={setPageState}
                        setTempUserData={setTempUserData}
                        pageState={pageState}
                      />
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-600">
                      {pageState === "login" ? (
                        <>
                          New to PROjectVerse?{" "}
                          <button
                            type="button"
                            onClick={() => setPageState("signup")}
                            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline focus:outline-none focus:underline transition-colors cursor-pointer"
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
                            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline focus:outline-none focus:underline transition-colors cursor-pointer"
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
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes grow {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginSignupPage;
