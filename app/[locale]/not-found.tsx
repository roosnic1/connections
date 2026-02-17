import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-2xl font-semibold text-black">
        No game found for today
      </h2>
      <p className="text-gray-500">Check back later for a new puzzle.</p>
    </div>
  );
}
