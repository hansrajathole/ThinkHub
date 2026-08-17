import userModel from "../models/user.model.js";


export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id; 
        const user = await userModel.findById(userId).populate("questions").populate({
            path: "answers", 
            populate: {
              path: "questionId",
              select: "title body tags", 
            },
          })
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


export const updateProfile = async (req, res) => {

    const userId = req.params.id;
    const  editedProfile  = req.body;
    try {
        
        if(!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if(!editedProfile) {
            return res.status(400).json({ message: "Edited profile data is required" });
        }

        const user = await userModel.findById(userId).populate("questions").populate({
            path: "answers", 
            populate: {
              path: "questionId",
              select: "title body tags", 
            },
          })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.username = editedProfile.username || user.username;
        user.about = editedProfile.about || user.about;
        user.location = editedProfile.location || user.location;
        user.title = editedProfile.title || user.title;
        user.skills = editedProfile.skills || user.skills;

        await user.save();
        
        return res.status(200).json({ message: "Profile updated successfully" , user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        
    }
    
}


export const getAllUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const users = await userModel.find({
            _id: { $ne: userId }
        }).sort({ reputation: -1 })
        


        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }


        users.sort((a, b) => b.reputation - a.reputation);
      
        
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const updateProfileImage = async (req, res) => {
    try {
        const userId = req.params.id;
        const file = req.file;
        
        console.log(file);


        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.avatar = file.thumbnailUrl // Assuming you have a field named 
        await user.save();

        return res.status(200).json({ message: "Profile image updated successfully", user });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getUsersByReputation = async (req, res) => {
    try {
        
        const users = await userModel.find().sort({ reputation: -1 }).limit(10);
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json({ message : "Users fetched successfully", users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

