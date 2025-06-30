import Link from 'next/link';

export default function ContactPage() {
  return (

    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-white to-white p-8">
      <div className="absolute top-8 left-8">
        <Link href="/"> 
          <button className="flex items-center rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-gray-800 shadow-md transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </Link>
      </div>

  
      <div className="flex w-full max-w-2xl flex-col items-center rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">Contact Us</h1>

        <p className="mb-8 text-center text-lg text-gray-700"> 
          We'd love to hear from you!
        </p>

        <div className="w-full text-center">
   
          <ul className="mt-2 list-none text-gray-700">
            <li>Email: <a href="202201302@iacademy.edu.ph" className="text-yellow-600 hover:underline">202201302@iacademy.edu.ph</a></li>
   
            <li>Address: iACADEMY Nexus Campus, 7434 Yakal</li>
          </ul>
        
        </div>
      </div>
    </div>
  );
}