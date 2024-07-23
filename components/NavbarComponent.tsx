import Link from "next/link";

export default function NavbarComponent() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                CRM
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex items-center sm:space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Inicio
              </Link>

            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}