import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        
        {/* Copyright */}
        <p className="text-sm">&copy; {new Date().getFullYear()} PROjectVerse. All rights reserved.</p>

        {/* Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
        <Link to="/privacy" className="hover:text-cyan-400 transition">
            Terms & conditions
          </Link>
          <Link to="/privacy" className="hover:text-cyan-400 transition">
            Privacy Policy
          </Link>
          <Link to="/contact" className="hover:text-cyan-400 transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
