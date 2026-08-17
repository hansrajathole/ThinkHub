import userModel from "../models/user.model.js";

// GET /api/admin/reports — list all users with basic info for admin review
export const getReports = async (req, res) => {
    try {
        const users = await userModel.find().select("username email isVerified role reputation createdAt").sort({ createdAt: -1 });
        return res.status(200).json({ message: "All users fetched", users });
    } catch (error) {
        console.error("Error in getReports:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// PUT /api/admin/users/:id/block — toggle a user's role between "user" and "admin" (block = set to "banned" conceptually)
export const blockUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent an admin from blocking themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot block yourself" });
        }

        // Toggle isVerified as a soft block mechanism (set to false = blocked)
        user.isVerified = !user.isVerified;
        await user.save();

        return res.status(200).json({
            message: `User ${user.isVerified ? "unblocked" : "blocked"} successfully`,
            user,
        });
    } catch (error) {
        console.error("Error in blockUser:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
