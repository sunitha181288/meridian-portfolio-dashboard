'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <p className="text-red-400 text-sm">
        Something went wrong: {error.message}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
