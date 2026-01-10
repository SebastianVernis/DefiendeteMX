'use client';

import { useState, useEffect } from 'react';
import { getUserIssues } from '../services/issueService';

export default function IssueList({ userId }) {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const userIssues = await getUserIssues(userId);
      setIssues(userIssues);
    };

    fetchIssues();
  }, [userId]);

  return (
    <div className="issue-list">
      {issues.map(issue => (
        <div key={issue._id} className={`issue-card priority-${issue.priority.toLowerCase()}`}>
          <h3>{issue.title}</h3>
          <p>{issue.description}</p>
          <span className="issue-status">{issue.status}</span>
        </div>
      ))}
    </div>
  );
}