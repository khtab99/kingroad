import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group relative inline-block text-center">
      {/* Logo Text */}
      <div
        className="inline-flex items-center gap-1 text-4xl font-extrabold tracking-tight text-red-700 group-hover:scale-105 transition-transform duration-300"
        dir="ltr"
      >
        <span className="bg-red-700 text-white px-1 rounded-md leading-none shadow-sm">
          KING
        </span>
        <span className="text-gray-900">ROAD</span>
      </div>

      {/* Mirror Reflection */}
      <div className="-mt-2 overflow-hidden h-4" dir="ltr">
        <div className="inline-flex items-center gap-1 text-4xl font-extrabold tracking-tight text-red-700 opacity-30 transform scale-y-[-1]">
          <span className="bg-red-700 text-white px-1 rounded-md leading-none shadow-sm">
            KING
          </span>
          <span className="text-gray-900">ROAD</span>
        </div>
      </div>
    </Link>
  );
}
