import React, { useState } from "react";
import toast from "react-hot-toast";
import "./Careers.css";

const MOCK_JOBS = [
  { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "Remote", type: "Full-time" },
  { id: 2, title: "Product Designer", department: "Design", location: "New York, NY", type: "Full-time" },
  { id: 3, title: "Customer Success Manager", department: "Support", location: "London, UK", type: "Full-time" },
  { id: 4, title: "Backend Engineer (Node.js)", department: "Engineering", location: "Remote", type: "Contract" },
  { id: 5, title: "Marketing Specialist", department: "Marketing", location: "San Francisco, CA", type: "Part-time" },
  { id: 6, title: "DevOps Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
];

export default function Careers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({ name: "", email: "", resume: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = ["All", ...new Set(MOCK_JOBS.map(job => job.department))];

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === "All" || job.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleApplyClick = (job) => {
    setSelectedJob(job);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(`Application sent for ${selectedJob.title}!`);
      setIsSubmitting(false);
      setSelectedJob(null);
      setApplicationData({ name: "", email: "", resume: null });
    }, 1500);
  };

  return (
    <div className="careers-container">
      <div className="careers-hero animate-slide-up">
        <h1>Join Our Team</h1>
        <p>We're on a mission to revolutionize e-commerce. Build the future with us.</p>
      </div>

      <div className="careers-search-bar animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <input 
          type="text" 
          placeholder="Search for roles..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="filter-select"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="jobs-grid animate-slide-up" style={{ animationDelay: "0.2s" }}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <div>
                <div className="job-dept">{job.department}</div>
                <h3 className="job-role">{job.title}</h3>
                <div className="job-details">
                  <span className="job-detail-item">📍 {job.location}</span>
                  <span className="job-detail-item">🕒 {job.type}</span>
                </div>
              </div>
              <button className="apply-btn" onClick={() => handleApplyClick(job)}>
                Apply Now
              </button>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <h3>No positions found matching your criteria.</h3>
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 style={{ marginBottom: "0.5rem" }}>Apply for {selectedJob.title}</h2>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>{selectedJob.location} • {selectedJob.type}</p>
            
            <form onSubmit={handleFormSubmit} className="application-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="checkout-input" 
                  required 
                  value={applicationData.name}
                  onChange={(e) => setApplicationData({...applicationData, name: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="checkout-input" 
                  required 
                  value={applicationData.email}
                  onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Resume / CV</label>
                <div className="file-upload">
                  <input type="file" id="resume" style={{ display: "none" }} onChange={(e) => setApplicationData({...applicationData, resume: e.target.files[0]})} />
                  <label htmlFor="resume" style={{ cursor: "pointer", marginBottom: 0 }}>
                    {applicationData.resume ? applicationData.resume.name : "Click to upload PDF or DOCX"}
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setSelectedJob(null)} className="modal-btn btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="modal-btn btn-primary">
                  {isSubmitting ? "Sending..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}