import Issue from '../models/Issue';
import { uploadToCloudStorage } from '../../utils/cloudStorage';

export const createIssue = async (issueData, files) => {
  try {
    const evidenceUrls = await Promise.all(
      files.map(file => uploadToCloudStorage(file, 'evidence'))
    );

    const issue = new Issue({
      ...issueData,
      evidenceFiles: evidenceUrls
    });

    return await issue.save();
  } catch (error) {
    console.error('Error creating issue', error);
    throw error;
  }
};

export const updateIssueStatus = async (issueId, status) => {
  return await Issue.findByIdAndUpdate(
    issueId, 
    { status, updatedAt: new Date() }, 
    { new: true }
  );
};

export const getUserIssues = async (userId) => {
  return await Issue.find({ user: userId }).sort({ createdAt: -1 });
};