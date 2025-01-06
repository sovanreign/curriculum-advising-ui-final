import { Sidebar } from "../../components/ui/Sidebar";
import { Navbar } from "../../components/ui/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { PORT } from "../../utils/constants";

const CurriculumCoachesList = () => {
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
          <h1 className="font-bold text-xl mb-8 pl-4">
            List of Curriculum Coaches
          </h1>
          <div className="card bg-white w-full shadow-xl">
            <div className="card-body text-center">
              <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Search coaches here..."
                    className="input input-bordered w-72"
                    // value={searchQuery}
                    // onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex space-x-4">
                  <select
                    className="select select-bordered"
                    // value={yearLevel}
                    // onChange={(e) => setYearLevel(e.target.value)}
                  >
                    <option value="ALL">All Years</option>
                    <option value="FIRST">1st Year</option>
                    <option value="SECOND">2nd Year</option>
                    <option value="THIRD">3rd Year</option>
                    <option value="FOURTH">4th Year</option>
                  </select>
                  <select
                    className="select select-bordered"
                    // value={program}
                    // onChange={(e) => setProgram(e.target.value)}
                  >
                    <option value="ALL">All Programs</option>
                    {programs.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Coach Name</th>
                    <th>Coach No.</th>
                    <th>Email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* {students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        {student.firstName} {student.lastName}
                      </td>
                      <td>{student.studentId}</td>
                      <td>{student.email}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleViewDetails(student)}
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumCoachesList;
