import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Navbar } from "../../components/ui/Navbar";
import { Sidebar } from "../../components/ui/Sidebar";
import { PORT } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

export function AcademicAdvisingForm() {
  const { id } = useParams(); // Get student ID from URL
  const [student, setStudent] = useState(null);
  const [coachRemarks, setCoachRemarks] = useState("");
  const [planOfAction, setPlanOfAction] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const navigate = useNavigate();

  const handleOpenPlanModal = () => {
    setIsPlanModalOpen(true);
    fetchAvailableSubjects();
  };

  // Fetch available subjects
  const fetchAvailableSubjects = async () => {
    try {
      const response = await axios.get(`${PORT}/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setAvailableSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleSubmitForm = async () => {
    try {
      const payload = {
        recommendation: coachRemarks,
        studentId: parseInt(id, 10), // Parse student ID from URL params
      };

      await axios.post(`${PORT}/acadforms`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      alert("Advising form submitted successfully!");
      navigate("/dashboard"); // Navigate to the dashboard
    } catch (error) {
      console.error("Error submitting advising form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${PORT}/students/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Sidebar />
      <div className="ml-60 bg-base-200">
        <Navbar />
        <div className="p-8">
          <h1 className="font-bold text-xl mb-8">Academic Advising Form</h1>
          <div className="card bg-white shadow-xl p-8">
            <div>
              <h2 className="font-bold text-lg mb-4">
                {student.firstName} {student.lastName} - {student.studentId}
              </h2>
              <p className="mb-2">
                <strong>Program:</strong> {student.program.name}
              </p>
              <p className="mb-8">
                <strong>Year Level:</strong> {student.yearLevel}
              </p>
            </div>

            {/* Current Subjects Table */}
            <h3 className="font-bold text-md mb-4">
              Currently Enrolled Subjects
            </h3>
            <table className="table w-full mb-6">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Units</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {student.studentCourse.map((course) => (
                  <tr key={course.id}>
                    <td>{course.course.subject}</td>
                    <td>{course.course.description}</td>
                    <td>{course.course.units}</td>
                    <td>{course.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Plan of Action */}
            <h3 className="font-bold text-md mb-4">Plan of Actions</h3>
            <table className="table w-full mb-6">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Units</th>
                  <th>Semester</th>
                  <th>Year</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {planOfAction.map((action, index) => (
                  <tr key={index}>
                    <td>{action.subject}</td>
                    <td>{action.units}</td>
                    <td>{action.semester}</td>
                    <td>{action.year}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() =>
                          setPlanOfAction(
                            planOfAction.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="btn btn-sm btn-outline"
              onClick={handleOpenPlanModal}
            >
              Add Plan
            </button>

            {/* Remarks Section */}
            <div className="mt-6">
              <label className="block mb-2 font-bold">Coach's Remarks</label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={coachRemarks}
                onChange={(e) => setCoachRemarks(e.target.value)}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button className="btn btn-success" onClick={handleSubmitForm}>
                Submit Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {isPlanModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg">Add Subject to Plan</h3>

            {/* List of Available Subjects */}
            <div className="overflow-x-auto my-4">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Description</th>
                    <th>Units</th>
                    <th>Sem</th>
                    <th>Year</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableSubjects.map((subject) => (
                    <tr key={subject.id}>
                      <td>{subject.subject}</td>
                      <td>{subject.description}</td>
                      <td>{subject.units}</td>
                      <td>{subject.sem}</td>
                      <td>{subject.year}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => setSelectedSubject(subject)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <button
                className="btn btn-success"
                onClick={() => {
                  if (selectedSubject) {
                    setPlanOfAction([...planOfAction, selectedSubject]);
                    setIsPlanModalOpen(false);
                  } else {
                    alert("Please select a subject.");
                  }
                }}
              >
                Add to Plan
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setIsPlanModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
