import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import './Careers.css';

export default function Careers() {
  const positions = [
    { id: 1, title: "Senior Full Stack Engineer", department: "Engineering", location: "San Francisco, CA", type: "Full-time" },
    { id: 2, title: "Backend Developer (Node.js)", department: "Engineering", location: "Remote", type: "Full-time" },
    { id: 3, title: "Product Designer", department: "Design", location: "New York, NY", type: "Full-time" },
    { id: 4, title: "Marketing Manager", department: "Marketing", location: "London, UK", type: "Full-time" },
    { id: 5, title: "Customer Success Specialist", department: "Support", location: "Remote", type: "Part-time" },
    { id: 6, title: "Data Scientist", department: "Data", location: "San Francisco, CA", type: "Full-time" },
  ];

  return (
    <div className="careers-container animate-fade-in">
      <div className="careers-header animate-slide-up">
        <h1>Careers at WE_SELL</h1>
        <p>Join us in shaping the future of global commerce.</p>
      </div>

      <div className="positions-list animate-slide-up">
        {positions.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-info">
              <h3>{job.title}</h3>
              <div className="job-meta">
                <span className="job-dept">{job.department}</span>
                <span className="separator">•</span>
                <span className="job-loc">{job.location}</span>
                <span className="separator">•</span>
                <span className="job-type">{job.type}</span>
              </div>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>
        ))}
      </div>
      
      <div className="careers-footer">
        <p>Don't see a perfect fit? <Link to="/contact">Contact us</Link> or check back later.</p>
      </div>
    </div>
  );
}