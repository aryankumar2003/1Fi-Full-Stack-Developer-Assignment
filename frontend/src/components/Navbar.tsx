import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                            <span className="text-white font-black text-sm">1F</span>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight gradient-text">1Fi</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-slate-400 hover:text-slate-100 text-sm font-medium transition-colors">
                            Products
                        </Link>
                        <span className="text-slate-400 hover:text-slate-100 text-sm font-medium transition-colors cursor-pointer">
                            How It Works
                        </span>
                        <button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-900/30">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
