import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4">
      <Image src="/images/logo.png" alt="logo" width={50} height={50} />

      <nav className="flex space-x-8">
        <Link
          href="/"
          className="text-white hover:font-black text-sm transition-colors"
        >
          SEARCH
        </Link>
        <Link
          href="/"
          className="text-white hover:font-black text-sm transition-colors"
        >
          PERMITS
        </Link>
        <Link
          href="/"
          className="text-white hover:font-black text-sm transition-colors"
        >
          BOOKING INQUIRY
        </Link>
        <Link
          href="/"
          className="text-white hover:font-black text-sm transition-colors"
        >
          LIST MY PROPERTY
        </Link>
        <Link
          href="/"
          className="text-white hover:font-black text-sm transition-colors"
        >
          PROJECTS
        </Link>
        <Link
          href="/"
          className="text-white hover:font-black text-sm transition-colors"
        >
          LOGIN
        </Link>
      </nav>
    </div>
  );
}
