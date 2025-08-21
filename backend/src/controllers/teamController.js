import Team from "../models/team.js";
import fs from "fs";

// Add a new team member
export const addTeamMember = async (req, res) => {
  try {
    const {
      name,
      position,
      description,
      email,
      facebook,
      instagram,
      linkedin,
    } = req.body;

    const newTeamMember = new Team({
      name,
      position,
      description,
      email,
      photo: req.file.path,
      facebook,
      instagram,
      linkedin,
    });

    await newTeamMember.save();
    res.status(201).json({
      message: "Team member added successfully.",
      data: newTeamMember,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add team member.", error: error.message });
  }
};

// Update team member
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      position,
      description,
      facebook,
      email,
      instagram,
      linkedin,
    } = req.body;
    const file = req.file;

    const existingTeam = await Team.findById(id);
    if (!existingTeam) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Delete old photo if a new one is uploaded
    if (file) {
      if (fs.existsSync(existingTeam.photo)) {
        fs.unlinkSync(existingTeam.photo);
      }
      existingTeam.photo = file.path;
    }

    existingTeam.name = name;
    existingTeam.position = position;
    existingTeam.description = description;
    existingTeam.facebook = facebook;
    existingTeam.email = email;
    existingTeam.instagram = instagram;
    existingTeam.linkedin = linkedin;

    await existingTeam.save();

    res.status(200).json({
      message: "Team member updated successfully",
      data: existingTeam,
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({
      message: "Failed to update team member",
      error: error.message,
    });
  }
};

// Delete team member
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await Team.findById(id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Delete photo file
    if (fs.existsSync(teamMember.photo)) {
      fs.unlinkSync(teamMember.photo);
    }

    await Team.findByIdAndDelete(id);

    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({
      message: "Failed to delete team member",
      error: error.message,
    });
  }
};

// Get all team members
export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.find().sort({ createdAt: -1 });
    res.status(200).json(teamMembers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch team members.", error: error.message });
  }
};

// Get a single team member by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await Team.findById(id);

    if (!teamMember)
      return res.status(404).json({ message: "Team member not found." });

    res.status(200).json(teamMember);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch team member.", error: error.message });
  }
};
