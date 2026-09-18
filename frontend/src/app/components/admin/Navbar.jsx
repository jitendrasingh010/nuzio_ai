"use client"
import Link from  "next/link"

const Navbar = () => {
  return (
    <nav >
      <Link href="/auth/signup" >
        Signup
      </Link>
    </nav>
  );
};

export default Navbar;

