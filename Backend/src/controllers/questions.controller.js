import answerModel from "../models/answers.model.js"
import questionModel from "../models/quetions.model.js"
import userModel from "../models/user.model.js"

export const postQuestion = async (req,res)=>{    
    
    const {title , body , tags} = req.body
    const userId = req.user._id
    console.log(title , body ,tags);
    
    try {
        if(!title){
            throw new Error("Title is required")
        }
        if(!body){
            throw new Error("question is required")
        }
    
        const question = await questionModel.create({
            authorId : userId,
            title,
            body,
            tags
        })

        await userModel.findByIdAndUpdate(userId , {
            $push: { questions: question._id }
        })

        res.status(201).json({ message : "created successfully", question})
        
    }
    catch (error) {
        console.log("Error in questionPost controller : ", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });  
    }
    
    
}

export const getAllQuestions = async (req,res)=>{
    try {
        
        const questions = await questionModel.find()
        .populate({
            path: "authorId",
            select: "username avatar questions",
            populate: {
              path: "questions",
              select: "title createdAt",
            }
          })
          .sort({ createdAt: -1 });
        console.log(" fetching data ",questions);
        
        res.status(200).json({message : "All questions", questions})

    } catch (error) {
        console.log("Error in getAllQuestions controller : ", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });
        
    }
}

export const getAllUserQuestions = async (req,res)=>{
    try {
        const userId = req.params.id
        if(!userId){
            throw new Error("User id is required")
        }
        const questions = await questionModel.find({authorId : userId}).populate("authorId",)
        console.log(questions);
        
        res.status(200).json({message : "All questions", questions})
    } catch (error) {
        console.log("Error in getAllUserQuestions controller : ", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });
        
    }
}

export const getQuestionById = async (req, res) => {
    try {
        const questionId = req.params.id;
        if (!questionId) {
            throw new Error("Question id is required");
        }

        const question = await questionModel.findById(questionId)
            .populate({
                path: "authorId",
                select: "username avatar"
            })
            .populate({
                path: "answers",
                populate: {
                    path: "authorId",
                    select: "username avatar"
                }
            });

        console.log(question);

        res.status(200).json({ message: "Question details", question });
    } catch (error) {
        console.log("Error in getQuestionById controller: ", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};
export const updateQuestion = async (req,res)=>{
    try {
        const questionId = req.params.id
        const userId = req.user._id
        if(!questionId){
            throw new Error("Question id is required")
        }
        const {title , body , tags} = req.body
        let question = await questionModel.findById(questionId)

        if(question.authorId.toString() !== userId.toString()){
            throw new Error("you are not authorized to upadate this question")
        }

        question = await questionModel.findByIdAndUpdate(questionId, {
            title,
            body,
            tags
        }, {new : true})

        res.status(200).json({message : "Updated successfully", question})
    } catch (error) {
        console.log("Error in getAllUserQuestions controller : ", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });
        
    }
}
export const deleteQuestion = async (req,res)=>{
    try {
        const questionId = req.params.id
        const userId = req.user._id

        if(!questionId){
            throw new Error("Question id is required")
        }

        const question = await questionModel.findById(questionId)

        if(question.authorId.toString() !== userId.toString()){
            throw new Error("you are not authorized to delete this question")
        }

        await questionModel.findByIdAndDelete(questionId)
        await answerModel.deleteMany({
            questionId : questionId
        })
        res.status(200).json({message : "Deleted successfully"})
    } catch (error) {
        console.log("Error in getAllUserQuestions controller : ", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });
        
    }
}


export const voteQuestion = async (req, res) => {
    try {
      const { id } = req.params; 
      const { voteType } = req.body;
      const userId = req.user._id; 
      if(!userId){
        console.log(userId);
        throw new Error("userId is not found")
      }
      const question = await questionModel.findById(id);
      if (!question) return res.status(404).json({ msg: "Question not found" });
      const author = await userModel.findById(question.authorId);
  
      
      if (voteType !== "up" && voteType !== "down") {
        return res.status(400).json({ msg: "Invalid vote type" });
      }

        const hasUpVoted = question.upVotes.includes(userId);
        const hasDownVoted = question.downVote.includes(userId);

        if(voteType === "up") {
            if(hasUpVoted){
                throw new Error("you are already voted for this question")
            }else{
                question.downVote.pull(userId)
                question.upVotes.push(userId);
                author.reputation += 5;
            }
          }
        if(voteType === "down") {
            if(hasDownVoted){
                throw new Error("you are already downVote for this question")
            }else{
                question.downVote.push(userId);
                question.upVotes.pull(userId)
                author.reputation -= 2;
            }
        }

     

    if (author.reputation >= 100 && !author.badges.includes("Bronze")) {
        author.badges.push("Bronze");
      }
      if (author.reputation >= 500 && !author.badges.includes("Silver Badge")) {
        author.badges.push("Silver Badge");
      }
      if (author.reputation >= 1000 && !author.badges.includes("Gold Badge")) {
        author.badges.push("Gold Badge");
      }
     
      await author.save()
      await question.save();
  
      res.status(200).json({
        msg: `Successfully ${voteType === "up" ? "upvoted" : "downvoted"}`,
        upVotes: question.upVotes.length,
        downVotes: question.downVote.length,
      });
  
    } catch (error) {
      console.error("Vote error:", error);
      res.status(500).json({ msg: "Server error" });
    }
  };
