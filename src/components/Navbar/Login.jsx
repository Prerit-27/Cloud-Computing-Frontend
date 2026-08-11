import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Menu, X } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // TODO: Replace with your real authentication
    console.log("Login:", { email, password });

    // Example:
    // localStorage.setItem("isLoggedIn", "true");
    // navigate("/");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex">

      {/* =====================================================
          LEFT SIDE - GYM PROMOTION
      ====================================================== */}
      <div className="hidden lg:flex w-[62%] min-h-screen relative overflow-hidden">

        {/* Background glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#7CFF5B]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-[#7CFF5B]/10 rounded-full blur-[120px]" />

        <div className="relative z-10 w-full p-10 flex flex-col">

          <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7CFF5B] to-[#5BE7FF] flex items-center justify-center shadow-lg shadow-[#7CFF5B]/20 transition-transform duration-300 group-hover:scale-105">
                <Dumbbell className="w-5 h-5 text-[#070707]" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Fit<span className="text-[#7CFF5B]">Pulse</span>
              </span>
            </Link>


          {/* Main content */}
          <div className="flex-1 flex items-center">

            <div className="w-full">

              {/* Image collage */}
              <div className="relative h-[480px] max-w-[720px] mx-auto">

                {/* Main image */}
                <div className="absolute left-[25%] top-[5%] w-[330px] h-[420px] rounded-[28px] overflow-hidden rotate-2 shadow-2xl border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1a"
                    alt="Gym workout"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Workout badge */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-sm text-white/60">
                      TODAY'S WORKOUT
                    </p>

                    <p className="text-2xl font-bold">
                      Push Day
                    </p>
                  </div>
                </div>


                {/* Small image - top left */}
                <div className="absolute left-[5%] top-[20%] w-[190px] h-[190px] rounded-[24px] overflow-hidden -rotate-6 border border-white/10 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
                    alt="Gym"
                    className="w-full h-full object-cover"
                  />
                </div>


                {/* Small image - bottom right */}
                <div className="absolute right-[5%] bottom-[5%] w-[210px] h-[180px] rounded-[24px] overflow-hidden rotate-3 border border-white/10 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61"
                    alt="Workout"
                    className="w-full h-full object-cover"
                  />
                </div>


                {/* Progress card */}
                <div className="absolute left-[10%] bottom-[0%] w-[230px] bg-[#151515] border border-white/10 rounded-2xl p-4 shadow-2xl">

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white/50">
                      Weekly progress
                    </span>

                    <span className="text-[#7CFF5B] text-sm font-semibold">
                      +18%
                    </span>
                  </div>

                  <div className="flex items-end gap-2 h-16">
                    <div className="w-5 h-[35%] bg-white/20 rounded-t-md" />
                    <div className="w-5 h-[50%] bg-white/20 rounded-t-md" />
                    <div className="w-5 h-[42%] bg-white/20 rounded-t-md" />
                    <div className="w-5 h-[70%] bg-[#7CFF5B]/60 rounded-t-md" />
                    <div className="w-5 h-[85%] bg-[#7CFF5B] rounded-t-md" />
                    <div className="w-5 h-[65%] bg-[#7CFF5B]/70 rounded-t-md" />
                  </div>
                </div>


                {/* Calories badge */}
                <div className="absolute right-[12%] top-[12%] bg-white text-black rounded-2xl px-4 py-3 shadow-xl">

                  <div className="text-xs text-black/50">
                    Calories
                  </div>

                  <div className="text-xl font-bold">
                    648 kcal
                  </div>

                </div>

              </div>


              {/* Headline */}
              <div className="mt-4 max-w-[620px]">

                <h1 className="text-5xl xl:text-6xl font-bold leading-[0.95] tracking-tight">
                  Train harder.
                  <br />

                  <span className="text-[#7CFF5B]">
                    Get stronger.
                  </span>
                </h1>

                <p className="mt-6 text-lg text-white/50 max-w-md">
                  Track your workouts, monitor your progress,
                  and build the strongest version of yourself.
                </p>

              </div>

            </div>
          </div>

        </div>
      </div>


      {/* =====================================================
          RIGHT SIDE - LOGIN
      ====================================================== */}
      <div className="w-full lg:w-[38%] min-h-screen bg-[#0D0D0D] lg:border-l border-white/10 flex items-center justify-center">

        <div className="w-full max-w-[440px] px-8 py-12">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-16">

            <div className="w-10 h-10 rounded-xl bg-[#7CFF5B] flex items-center justify-center">
              <span className="text-[#070707] font-black">
                G
              </span>
            </div>

            <span className="font-bold">
              GYM<span className="text-[#7CFF5B]">AI</span>
            </span>

          </div>


          {/* Header */}
          <div className="mb-8">

            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back
            </h2>

            <p className="mt-2 text-white/40">
              Log in to continue your fitness journey.
            </p>

          </div>


          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="
                  w-full
                  h-14
                  px-4
                  rounded-xl
                  bg-[#151515]
                  border border-white/10
                  text-white
                  placeholder:text-white/25
                  outline-none
                  transition
                  focus:border-[#7CFF5B]
                  focus:ring-1
                  focus:ring-[#7CFF5B]
                "
              />
            </div>


            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">

                <label className="text-sm text-white/60">
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm text-[#7CFF5B] hover:underline"
                >
                  Forgot password?
                </button>

              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="
                  w-full
                  h-14
                  px-4
                  rounded-xl
                  bg-[#151515]
                  border border-white/10
                  text-white
                  placeholder:text-white/25
                  outline-none
                  transition
                  focus:border-[#7CFF5B]
                  focus:ring-1
                  focus:ring-[#7CFF5B]
                "
              />
            </div>


            {/* Login button */}
            <button
              type="submit"
              className="
                w-full
                h-14
                mt-3
                rounded-xl
                bg-[#7CFF5B]
                text-[#070707]
                font-bold
                transition-all
                duration-300
                hover:bg-[#91ff75]
                hover:scale-[1.01]
                active:scale-[0.99]
              "
            >
              Log in
            </button>

          </form>


          {/* Divider */}
          <div className="flex items-center gap-4 my-7">

            <div className="h-px flex-1 bg-white/10" />

            <span className="text-sm text-white/30">
              OR
            </span>

            <div className="h-px flex-1 bg-white/10" />

          </div>


          {/* Google login */}
          <button
            type="button"
            className="
              w-full
              h-14
              rounded-xl
              border border-white/10
              bg-white/[0.03]
              hover:bg-white/[0.06]
              transition
              flex
              items-center
              justify-center
              gap-3
              font-medium
            "
          >
            <span className="text-lg">G</span>
            Continue with Google
          </button>


          {/* Signup */}
          <p className="text-center text-sm text-white/40 mt-8">

            Don't have an account?

            <Link
              to="/signup"
              className="ml-1 text-[#7CFF5B] font-medium hover:underline"
            >
              Create account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}