import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["postulado", "en revisión", "aceptado", "rechazado"],
      default: "postulado",
    },
    message: {
      type: String,
      maxlength: [500, "El mensaje no puede superar los 500 caracteres"],
      trim: true,
    },
  },
  { timestamps: true }
);
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;