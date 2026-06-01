import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-center p-6">
      <div className="text-7xl animate-bounce">🙈</div>
      <h1 className="text-4xl font-bold mt-6 text-gray-800">Oops! Page not found.</h1>
      <p className="text-lg mt-2 text-gray-600">Looks like you’ve wandered off the path.</p>
      <Link
        href="/"
        className="mt-6 px-6 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition"
      >
        Take me back home
      </Link>
      <p className="mt-4 text-sm text-gray-500">
        Want to make your own cute 404 page? <Link href="/generate" className="underline">Try Oopsly!</Link>
      </p>
    </div>
  );
}
