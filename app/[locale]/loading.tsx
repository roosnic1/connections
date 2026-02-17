export default function Loading() {
  return (
    <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <div className="min-w-full sm:min-w-[630px]">
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded my-4 ml-4" />
        <div className="h-5 w-64 bg-gray-200 animate-pulse rounded mb-4" />
        <hr className="mb-4 md:mb-4 w-full" />
        <div className="grid grid-cols-4 gap-2 w-full">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[5/3] bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
        <div className="h-5 w-48 bg-gray-200 animate-pulse rounded my-4 md:my-8 mx-8" />
        <div className="flex gap-2 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 bg-gray-200 animate-pulse rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
