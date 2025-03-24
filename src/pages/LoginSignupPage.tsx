import { useState } from "react";
import { SignupForm } from "../forms/SignupForm";
import { LoginForm } from "../forms/LoginForm";

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        {isLogin ? (
          <>
            <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
              Log In to PROjectVerse
            </h2>
            <LoginForm />
            <p className="mt-4 text-center text-gray-600">
              New to PROjectVerse?{" "}
              <span
                className="text-blue-900 font-semibold cursor-pointer hover:underline"
                onClick={() => setIsLogin(false)}
              >
                Register
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
              Sign Up for PROjectVerse
            </h2>
            <SignupForm />
            <p className="mt-4 text-center text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-900 font-semibold cursor-pointer hover:underline"
                onClick={() => setIsLogin(true)}
              >
                Log In
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginSignupPage;
