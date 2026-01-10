import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String, 
    enum: ['NUEVO', 'EN_PROCESO', 'REQUIERE_ATENCION', 'RESUELTO'], 
    default: 'NUEVO'
  },
  priority: {
    type: String,
    enum: ['BAJO', 'MEDIO', 'ALTO', 'EMERGENCIA'],
    default: 'BAJO'
  },
  category: {
    type: String,
    enum: [
      'VIOLENCIA_DOMESTICA', 
      'ACOSO', 
      'ABUSO_SEXUAL', 
      'DISCRIMINACION', 
      'OTRO'
    ]
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  evidenceFiles: [{ type: String }],
  location: {
    latitude: Number,
    longitude: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Issue', IssueSchema);