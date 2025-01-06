import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Navbar } from "../../components/ui/Navbar";
import { Sidebar } from "../../components/ui/Sidebar";
import { PORT } from "../../utils/constants";

export function Curriculum() {
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [programs, setPrograms] = useState([]);

  const [courses, setCourses] = useState([]);
  const [curriculumFilter, setCurriculumFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [semFilter, setSemFilter] = useState("All");

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${PORT}/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const [activeTab, setActiveTab] = useState("List of Curriculum");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesCurriculum =
      curriculumFilter === "All" ||
      course.curriculumId.toString() === curriculumFilter;
    const matchesYear = yearFilter === "All" || course.year === yearFilter;
    const matchesSem =
      semFilter === "All" || course.sem.toString() === semFilter;

    return matchesCurriculum && matchesYear && matchesSem;
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchCurriculums();
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${PORT}/programs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const fetchCurriculums = async () => {
    try {
      const response = await axios.get(`${PORT}/curriculums`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setCurriculums(response.data);
    } catch (error) {
      console.error("Error fetching curriculums:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitAddCourse = async (data) => {
    try {
      await axios.post(`${PORT}/courses`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setIsAddCourseModalOpen(false);
      fetchCourses(); // Refresh courses list
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const handleUploadCourses = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      await axios.post(`${PORT}/courses/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsUploadFileModalOpen(false);
      fetchCourses(); // Refresh courses list
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        rev: parseInt(data.rev, 10), // Parse rev into an integer
      };

      await axios.post(`${PORT}/curriculums`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setIsModalOpen(false);
      reset();
      fetchCurriculums(); // Refresh the curriculum list
    } catch (error) {
      console.error("Error adding curriculum:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <Sidebar />

      <div className="ml-60 bg-base-200">
        <Navbar />

        <div className="p-8">
          <h1 className="font-bold text-xl mb-8 pl-4">Curriculum</h1>

          <div className="card bg-white w-full shadow-xl">
            <div className="card-body">
              <div className="tabs mb-4">
                <a
                  className={`tab tab-bordered ${
                    activeTab === "List of Curriculum" ? "tab-active" : ""
                  }`}
                  onClick={() => handleTabChange("List of Curriculum")}
                >
                  List of Curriculum
                </a>
                <a
                  className={`tab tab-bordered ${
                    activeTab === "Courses" ? "tab-active" : ""
                  }`}
                  onClick={() => handleTabChange("Courses")}
                >
                  Courses
                </a>
                <a
                  className={`tab tab-bordered ${
                    activeTab === "Prescribe Subjects" ? "tab-active" : ""
                  }`}
                  onClick={() => handleTabChange("Prescribe Subjects")}
                >
                  Prescribe Subjects
                </a>
              </div>

              {activeTab === "List of Curriculum" && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>CURR ID#</th>
                          <th>REV#</th>
                          <th>EFFECTIVITY</th>
                          <th>CMO NAME</th>
                        </tr>
                      </thead>
                      <tbody>
                        {curriculums.map((curriculum) => (
                          <tr key={curriculum.id}>
                            <td>{curriculum.code}</td>
                            <td>{curriculum.rev}</td>
                            <td>{curriculum.effectivity}</td>
                            <td>{curriculum.cmoName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4">
                    <button
                      className="btn btn-outline"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Add Curriculum
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "Courses" && (
                <div>
                  <div className="flex gap-4 mb-4">
                    <select
                      className="select select-bordered"
                      value={curriculumFilter}
                      onChange={(e) => setCurriculumFilter(e.target.value)}
                    >
                      <option value="All">All Curriculums</option>
                      <option value="1">BS Information Technology</option>
                      <option value="2">BS Computer Science</option>
                      {/* Add more options dynamically */}
                    </select>
                    <select
                      className="select select-bordered"
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                    >
                      <option value="All">All Years</option>
                      <option value="FIRST">First Year</option>
                      <option value="SECOND">Second Year</option>
                      <option value="THIRD">Third Year</option>
                      <option value="FOURTH">Fourth Year</option>
                    </select>
                    <select
                      className="select select-bordered"
                      value={semFilter}
                      onChange={(e) => setSemFilter(e.target.value)}
                    >
                      <option value="All">All Semesters</option>
                      <option value="1">1st Semester</option>
                      <option value="2">2nd Semester</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4">
                      <button
                        className="btn btn-outline"
                        onClick={() => setIsAddCourseModalOpen(true)}
                      >
                        Add Course
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => setIsUploadFileModalOpen(true)}
                      >
                        Upload Courses
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Description</th>
                          <th>Units</th>
                          <th>Sem</th>
                          <th>Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.map((course) => (
                          <tr key={course.id}>
                            <td>{course.subject}</td>
                            <td>{course.description}</td>
                            <td>{course.units}</td>
                            <td>{course.sem}</td>
                            <td>{course.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button className="btn btn-ghost">Close</button>
                    <button className="btn btn-outline">Edit Subject</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isAddCourseModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add Course</h3>
            <form
              onSubmit={handleSubmit(onSubmitAddCourse)}
              className="mt-4 grid gap-4"
            >
              <div className="form-control">
                <label className="label">Subject</label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register("subject", { required: "Subject is required" })}
                />
                {errors.subject && (
                  <span className="text-red-500 text-sm">
                    {errors.subject.message}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">Description</label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">Units</label>
                <input
                  type="number"
                  className="input input-bordered"
                  {...register("units", {
                    required: "Units are required",
                    valueAsNumber: true,
                  })}
                />
                {errors.units && (
                  <span className="text-red-500 text-sm">
                    {errors.units.message}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">Semester</label>
                <input
                  type="number"
                  className="input input-bordered"
                  {...register("sem", {
                    required: "Semester is required",
                    valueAsNumber: true,
                  })}
                />
                {errors.sem && (
                  <span className="text-red-500 text-sm">
                    {errors.sem.message}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">Year</label>
                <select
                  className="select select-bordered"
                  {...register("year", { required: "Year is required" })}
                >
                  <option value="FIRST">First Year</option>
                  <option value="SECOND">Second Year</option>
                  <option value="THIRD">Third Year</option>
                  <option value="FOURTH">Fourth Year</option>
                </select>
                {errors.year && (
                  <span className="text-red-500 text-sm">
                    {errors.year.message}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">Curriculum</label>
                <select
                  className="select select-bordered"
                  {...register("curriculumId", {
                    required: "Curriculum is required",
                    valueAsNumber: true,
                  })}
                >
                  <option value="">Select Curriculum</option>
                  {curriculums.map((curriculum) => (
                    <option key={curriculum.id} value={curriculum.id}>
                      {curriculum.code}
                    </option>
                  ))}
                </select>
                {errors.curriculumId && (
                  <span className="text-red-500 text-sm">
                    {errors.curriculumId.message}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">Program</label>
                <select
                  className="select select-bordered"
                  {...register("programId", {
                    required: "Program is required",
                    valueAsNumber: true,
                  })}
                >
                  <option value="">Select Program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.code}
                    </option>
                  ))}
                </select>
                {errors.programId && (
                  <span className="text-red-500 text-sm">
                    {errors.programId.message}
                  </span>
                )}
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-success">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsAddCourseModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUploadFileModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Upload Courses</h3>
            <form onSubmit={handleUploadCourses} className="mt-4">
              <div className="form-control">
                <label className="label">Upload File</label>
                <input
                  type="file"
                  accept=".csv"
                  className="file-input file-input-bordered"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-success">
                  Upload
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsUploadFileModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add Curriculum</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4">
              <div className="form-control">
                <label className="label">CURR ID#</label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register("code", { required: "CURR ID# is required" })}
                />
                {errors.code && (
                  <span className="text-red-500 text-sm">
                    {errors.code.message}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">REV#</label>
                <input
                  type="number"
                  className="input input-bordered"
                  {...register("rev", {
                    required: "REV# is required",
                    validate: (value) =>
                      !isNaN(value) || "REV# must be a number",
                  })}
                />
                {errors.rev && (
                  <span className="text-red-500 text-sm">
                    {errors.rev.message}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">EFFECTIVITY</label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register("effectivity", {
                    required: "Effectivity is required",
                  })}
                />
                {errors.effectivity && (
                  <span className="text-red-500 text-sm">
                    {errors.effectivity.message}
                  </span>
                )}
              </div>
              <div className="form-control">
                <label className="label">CMO NAME</label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register("cmoName", { required: "CMO Name is required" })}
                />
                {errors.cmoName && (
                  <span className="text-red-500 text-sm">
                    {errors.cmoName.message}
                  </span>
                )}
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-success">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
