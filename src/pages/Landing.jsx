import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import hatchBg from "../assets/y-hatch.png";

export default function Landing() {
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const buttonStyle = {
    borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
    backgroundImage: `url(${hatchBg})`,
    backgroundSize: '150%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="min-h-screen bg-[#FFFEF4] flex flex-col font-['Schoolbell'] text-[#1a1a1a]">
      
      {/* CONSTANT NAVBAR - Updated to be clear */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-6 bg-transparent">
        <div className="w-16 h-16 rounded-full  overflow-hidden flex items-center justify-center ">
          <img 
            src={logo} 
            alt="WordTrace Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex gap-6">
          {[ 
            { name: "home", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
            { name: "about", action: () => scrollToSection("about") },
            { name: "contact", action: () => scrollToSection("footer") }
          ].map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className="px-6 py-1 border-2 border-black"
              style={buttonStyle}
            >
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative min-h-[70vh] pt-32 mt-24">
        <div className="mb-8 relative">
            <span className="text-5xl absolute -left-16 top-1/2 -translate-y-1/2">🐝</span>
            <h2 className="text-4xl lowercase">hello mate!</h2>
            <h1 className="text-7xl font-bold mt-4">welcome to WordTrace</h1>
        </div>

        <Link
          to="/login"
          className="mt-24 px-10 py-2 border-2 border-black text-2xl"
          style={buttonStyle}
        >
          login
        </Link>
      </main>

      <section id="about" className="py-24 flex flex-col items-center justify-center scroll-mt-20 mt-20">
        <h2 className="text-5xl mb-12">about</h2>
        <div 
          className="max-w-3xl p-16 border-[6px] border-[#FFF176] relative bg-transparent"
          style={{ 
            borderRadius: "40% 60% 70% 30% / 40% 40% 60% 50%",
          }}
        >
          <div className="text-3xl text-center leading-relaxed space-y-2">
            <p>the ultimate proof that you did the work..</p>
            <p>from first keystroke to final submit,</p>
            <p>WordTrace tracks the hustle behind your words.</p>
            <p className="py-2">we judge the journey —</p>
            <p>so your effort gets the credit it deserves.</p>
          </div>
        </div>
      </section>

      {/* FOOTER - Updated with Slanted Dotted Line */}
      <footer id="footer" className="bg-[#FFF9C4] border-t-4 border-dashed border-black p-10 mt-20 scroll-mt-10">
        {/* Slanted Dotted Line Container */}
        <div className="absolute top-0 left-0 w-full overflow-hidden h-12 -translate-y-6">
             <div className="w-[110%] border-t-4 border-dashed border-black -rotate-1 origin-center ml-[-5%]"></div>
        </div>

        <div className="bg-[#FFF9C4] px-12 py-12 pt-16">
          <div className="max-w-6xl mx-auto flex flex-col items-end gap-2">
            <div className="flex gap-4 text-2xl">
                <span>navaneetha rajesh</span>
                <span>–</span>
                <span>nitharajesh06@gmail.com</span>
            </div>
            <div className="flex gap-4 text-2xl">
                <span>eza mariyam robin</span>
                <span>–</span>
                <span>ezamariyam1610@gmail.com</span>
            </div>
          </div>
        </div>
        
        <div className="bg-black text-white py-4 text-center text-lg w-screen relative left-1/2 right-1/2 -ml-[50vw] mb-0">
          all rights reserved to Dumb and Dumber – 2026
        </div>
      </footer>
    </div>
  );
}