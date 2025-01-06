import { Sidebar } from "../../components/ui/Sidebar";
import { Navbar } from "../../components/ui/Navbar";
import ProgramCard from "../../components/programs/ProgramCard";
import { PORT } from "../../utils/constants";
import { useState, useEffect } from "react";
import axios from "axios";

const Program = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${PORT}/programs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div>
      <Sidebar />

      {/* main content */}
      <div className="ml-60 bg-base-200">
        <Navbar />
        <div className="p-8">
          <h1 className="font-bold text-xl mb-8 pl-4">Programs</h1>
          <div className="card bg-white w-full shadow-xl pb-10">
            <div className="card-body text-center">
              <h1 className="font-bold text-xl text-red-500">
                SCHOOL OF COMPUTER IN INFORMATION SCIENCES
              </h1>
              <section className="flex justify-center items-center flex-wrap gap-x-10 gap-y-5 mt-3">
                {programs.map((data) => {
                  return (
                    <ProgramCard
                      key={data.id}
                      name={data.name}
                      code={data.code}
                    />
                  );
                })}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Program;
