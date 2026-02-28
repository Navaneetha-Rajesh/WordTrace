import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import y1Hatch from "../assets/y1-hatch.png";
import bHatch from "../assets/b-hatch.png";
import gHatch from "../assets/g-hatch.png";
import detailsImg from "../assets/details.png";

export default function ProfessorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("submissions")) || [];
    setSubmissions(stored);
  }, []);

  const getHatchImage = (score) => {
    if (score === 100) return gHatch;
    if (score === 0) return y1Hatch;
    return bHatch;
  };

  return (
    <div className="min-h-screen bg-[#FFFEF4] font-['Schoolbell'] text-[#1a1a1a] p-12">
      
      {/* HEADER SECTION */}
      <div className="relative mb-20 flex flex-col items-center">
        <button onClick={() => navigate("/")} className="text-4xl absolute left-0 top-0">←</button>
        
        {/* Smaller Course Name Background */}
        <div 
          className="px-8 py-1 text-4xl lowercase mb-2 flex items-center justify-center"
          style={{ 
            backgroundImage: `url(${y1Hatch})`, 
            backgroundSize: '80% 90%', // Made smaller to fit text tightly
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          course name:
        </div>
        <p className="text-2xl lowercase">class:</p>

        {/* Legend/Details Image on Right */}
        <div className="absolute right-0 top-0 w-32">
          <img src={detailsImg} alt="Legend Details" className="w-full h-auto" />
        </div>
      </div>

      {/* STUDENT SUBMISSIONS LIST */}
      <div className="max-w-6xl mx-auto space-y-6">
        {submissions.map((sub, index) => {
          const scoreValue = typeof sub.score === "object" ? sub.score.score : sub.score;
          const currentHatch = getHatchImage(scoreValue);
          
          return (
            <div key={sub.id} className="flex gap-4 items-stretch h-20">
              
              {/* Columns now use Website BG color (#FFFEF4) */}
              <div className="flex-[2] border-2 border-black flex items-center justify-center bg-[#FFFEF4]">
                <span className="text-3xl lowercase">student - {index + 1}</span>
              </div>

              {/* Confidence Meter Column */}
              <div className="flex-[3] border-2 border-black flex items-center px-10 bg-[#FFFEF4] gap-4">
                <div className="flex-1 h-[2px] bg-black relative">
                  <div 
                    className="absolute w-5 h-5 bg-[#FFF176] border-2 border-black rounded-full -top-[9px]"
                    style={{ left: `${scoreValue}%`, transform: 'translateX(-50%)' }}
                  ></div>
                </div>
                <span className="text-2xl w-16">{scoreValue}%</span>
              </div>

              {/* View Button: No border/BG, only Hatch Image */}
              <button
                onClick={() => navigate(`/professor/doc/${sub.id}`)}
                className="flex-1 text-3xl lowercase flex items-center justify-center transition-transform active:scale-95"
                style={{ 
                  backgroundImage: `url(${currentHatch})`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: 'transparent', // Removed background color
                  border: 'none' // Removed border
                }}
              >
                view
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}