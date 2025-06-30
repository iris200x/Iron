
import Link from 'next/link'; 

export default function DashboardHomePage() {

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  const userName = "Iris";
  const userId = "@01234567"; 

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex w-full items-center justify-between">
        <h1 className="text-5xl font-bold text-gray-800">Home</h1>
        <Link href="/profile">
          <button className="flex items-center space-x-4 rounded-full p-2 transition-colors hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75">
            <div className="text-right">
              <p className="text-xl font-semibold text-gray-800">{userName}</p>
              <p className="text-sm text-yellow-600">{userId}</p>
            </div>

            <div className="h-16 w-16 rounded-full bg-gray-300 ring-2 ring-yellow-500 flex items-center justify-center text-gray-600 font-bold text-xl">
              {userName.charAt(0).toUpperCase()}
            </div>
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

        <div className="col-span-1 flex h-32 items-center justify-center rounded-lg bg-yellow-500 p-4 text-center shadow-lg">
          <p className="text-xl font-bold text-gray-800">{formattedDate}</p>
        </div>

        <div className="col-span-1 rounded-lg bg-white p-4 shadow-lg md:col-span-2">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">Welcome!</h2>
          <p className="text-gray-600">This is your personalized dashboard. You can add widgets or important information here.</p>
        </div>

 
        <div className="col-span-1 rounded-lg bg-white p-4 shadow-lg md:col-span-3">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">Quick Actions</h2>
          <p className="text-gray-600">You can add quick links or buttons to frequently used features here.</p>
        </div>
      </div>
    </div>
  );
}
