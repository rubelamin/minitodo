//app\dashboard\user\page.tsx
"use client";
import { useSession, signOut } from "next-auth/react";
import UserHome from "./_components/UserHome";

function UserDashboardPage() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col p-12 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
        {/* Mobile: column, Tablet/Desktop: row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* User Info - Mobile: stack, Tablet: row */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4">
            {/* Avatar */}
            <div className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <span className="text-lg sm:text-xl font-bold">
                {session?.user?.name?.charAt(0) || "U"}
              </span>
            </div>

            {/* Name and Badges */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                Welcome back, {session?.user?.name}
              </h2>

              {/* Badges - Responsive grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap gap-2 mt-2">
                {/* Email - Hidden on smallest screens, visible on xs up */}
                <span className="hidden xs:inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 truncate">
                  <svg
                    className="w-3 h-3 mr-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  </svg>
                  <span className="truncate max-w-[100px] xs:max-w-[150px] sm:max-w-[200px]">
                    {session?.user?.email}
                  </span>
                </span>

                {/* Email for very small screens */}
                <span className="xs:hidden flex items-center text-xs text-gray-600">
                  <svg
                    className="w-3 h-3 mr-1 flex-shrink-0 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  </svg>
                  <span className="truncate max-w-[120px]">
                    {session?.user?.email}
                  </span>
                </span>

                {/* Role */}
                <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                  <svg
                    className="w-3 h-3 mr-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6z"
                    />
                  </svg>
                  <span className="capitalize">{session?.user?.role}</span>
                </span>

                {/* Status */}
                <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Sign Out Button - Full width on mobile, auto on tablet/desktop */}
          <button
            onClick={() => signOut()}
            className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="h-[40px]"></div>

      <UserHome />
    </div>
  );
}

export default UserDashboardPage;
