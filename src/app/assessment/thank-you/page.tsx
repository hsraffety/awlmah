import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center py-8">
      <div className="w-full max-w-3xl">
        <div className="p-8 bg-white rounded shadow">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-[#e0e7f7] rounded flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Thank You</h1>
            <p className="text-gray-600">
              Your information was submitted to our team of immigration
              attorneys. Expect an email from hello@tryalma.ai.
            </p>
          </div>

          <Link
            href="/"
            className="block w-full bg-black text-white text-center py-3 rounded font-medium"
          >
            Go Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
