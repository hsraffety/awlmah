import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-3xl w-full mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to almă</h1>
        <p className="text-xl mb-8">
          We help talented individuals navigate the complex immigration process
          with personalized guidance from experienced attorneys.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/assessment"
            className="btn btn-primary px-8 py-3 text-lg"
          >
            Get Your Immigration Assessment
          </Link>

          <Link href="/admin" className="btn btn-secondary px-8 py-3 text-lg">
            Admin Login
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e7f0ca] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Submit Your Information
              </h3>
              <p className="text-gray-600">
                Fill out our simple form with your background and immigration
                goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#e0e7f7] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Get Expert Analysis
              </h3>
              <p className="text-gray-600">
                Our experienced immigration attorneys will review your case
                details.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#f5e0f7] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Receive Your Assessment
              </h3>
              <p className="text-gray-600">
                Get personalized recommendations and a clear path forward for
                your case.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
