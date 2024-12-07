import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-gray-800 text-white py-4 fixed w-screen z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo / Title */}
        <div className="text-lg font-bold">MyApp</div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4">
          <Button variant="link" asChild>
            <a href="/">Home</a>
          </Button>
          <Button variant="link" asChild>
            <a href="/about">About</a>
          </Button>
          <Button variant="link" asChild>
            <a href="/contact">Contact</a>
          </Button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex space-x-2">
          <Button variant="outline">Sign In</Button>
          <Button variant="default">Sign Up</Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            Menu
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 text-white py-4">
          <nav className="flex flex-col space-y-2 px-4">
            <a href="/" className="block text-white">Home</a>
            <a href="/about" className="block text-white">About</a>
            <a href="/contact" className="block text-white">Contact</a>
            <div className="flex space-x-2 mt-2">
              <Button variant="outline" className="w-full">Sign In</Button>
              <Button variant="default" className="w-full">Sign Up</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
