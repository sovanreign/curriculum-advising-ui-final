import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../../components/ui/Navbar";
import { Sidebar } from "../../components/ui/Sidebar";
import { PORT } from "../../utils/constants";

export function MySubjects() {
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  const fetchStudentData = async () => {
    try {
      const studentId = localStorage.getItem("id"); // Retrieve student ID from localStorage
      const response = await axios.get(`${PORT}/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setStudentData(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!studentData) {
    return <div>Error: Unable to fetch student data</div>;
  }

  return (
    <div>
      <Sidebar />
      <div className="ml-60 bg-base-200">
        <Navbar />
        <div className="p-8">
          <h1 className="font-bold text-xl mb-8">My Subjects</h1>
          <div className="card bg-white shadow-xl p-8">
            <div>
              <h2 className="font-bold text-lg mb-4">
                {studentData.firstName} {studentData.lastName} -{" "}
                {studentData.studentId}
              </h2>
              <p className="mb-2">
                <strong>Program:</strong> {studentData.program.name}
              </p>
              <p className="mb-8">
                <strong>Year Level:</strong> {studentData.yearLevel}
              </p>
            </div>

            {/* Subjects Table */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Description</th>
                    <th>Units</th>
                    <th>Semester</th>
                    <th>Year</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.studentCourse
                    .filter(
                      (course) => course.course.year === studentData.yearLevel
                    ) // Filter courses based on year level
                    .map((course) => (
                      <tr key={course.id}>
                        <td>{course.course.subject}</td>
                        <td>{course.course.description}</td>
                        <td>{course.course.units}</td>
                        <td>{course.course.sem}</td>
                        <td>{course.course.year}</td>
                        <td>
                          {course.remark === "HOLD" ? "_" : course.remark}
                        </td>{" "}
                        {/* Handle "HOLD" remark */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end">
              <button
                className="btn btn-outline"
                onClick={() => navigate(`/academic-advising/${studentData.id}`)} // Redirect to the Academic Advising Form page
              >
                View AcadForm
              </button>
              <button className="btn btn-ghost ml-4">Close</button>
              <button className="btn btn-outline ml-4">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
