import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
};

export default function Pagination({ page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {page > 1 ? (
        <Link
          href={`/admin/connections?page=${page - 1}`}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Previous
        </Link>
      ) : (
        <span className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg">
          Previous
        </span>
      )}
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={`/admin/connections?page=${page + 1}`}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Next
        </Link>
      ) : (
        <span className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg">
          Next
        </span>
      )}
    </div>
  );
}
