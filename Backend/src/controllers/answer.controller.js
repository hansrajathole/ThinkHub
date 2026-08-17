import answerModel from "../models/answers.model.js";
import questionModel from "../models/quetions.model.js";
import userModel from "../models/user.model.js";

export const postAnswer = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const userId = req.user._id;
    const { content } = req.body;

    if (!questionId) {
      throw new Error("Question id is required");
    }
    if (!content) {
      throw new Error("Answer content is required");
    }

    let user = await userModel.findById(userId);
    user.reputation += 10;
    await user.save();

    if (user.reputation >= 100 && !user.badges.includes("Bronze")) {
      user.badges.push("Bronze");
    }
    if (user.reputation >= 500 && !user.badges.includes("Silver Badge")) {
      user.badges.push("Silver Badge");
    }
    if (user.reputation >= 1000 && !user.badges.includes("Gold Badge")) {
      user.badges.push("Gold Badge");
    }

    await user.save();

    const answer = await answerModel.create({
      content,
      authorId: userId,
      questionId,
    });

    await userModel.findByIdAndUpdate(userId, {
      $push: { answers: answer._id },
    });

    const question = await questionModel.findByIdAndUpdate(questionId, {
      $push: { answers: answer._id },
    });

    res.status(200).json({ message: "Answer posted successfully", answer });
  } catch (error) {
    console.log("Error in postAnswer controller : ", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const userId = req.user._id;

    const { content } = req.body;

    if (!answerId) {
      throw new Error("Answer id is required");
    }
    if (!content) {
      throw new Error("Answer content is required");
    }

    let answer = await answerModel.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    if (answer.authorId.toString() !== userId.toString()) {
      throw new Error("you are not authorized for updated Answer");
    }

    answer = await answerModel.findByIdAndUpdate(
      answerId,
      {
        content,
      },
      { new: true }
    );

    res.status(200).json({ message: "Answer updated successfully", answer });
  } catch (error) {
    console.log("Error in updateAnswer controller : ", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const userId = req.user._id;
    if (!answerId) {
      throw new Error("Answer id is required");
    }

    const answer = await answerModel.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    if (answer.authorId.toString() !== userId.toString()) {
      throw new Error("you are not authorized for delete Answer");
    }

    await answerModel.findByIdAndDelete(answerId);
    await userModel.findByIdAndUpdate(answer.authorId, {
      $pull: { answers: answer._id },
    });

    await questionModel.findByIdAndUpdate(answer.questionId, {
      $pull: { answers: answer._id },
    });

    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAnswer controller : ", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const voteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;
    const userId = req.user._id;
    if (!userId) {
      console.log(userId);
      throw new Error("userId is not found");
    }
    const answer = await answerModel.findById(id);
    if (!answer) return res.status(404).json({ msg: "Answer not found" });
    const author = await userModel.findById(answer.authorId);

    if (voteType !== "up" && voteType !== "down") {
      return res.status(400).json({ msg: "Invalid vote type" });
    }

    const hasUpVoted = answer.upVotes.includes(userId);
    const hasDownVoted = answer.downVotes.includes(userId);

    if (voteType === "up") {
      if (hasUpVoted) {
        throw new Error("you are already voted for this question");
      } else {
        answer.downVotes.pull(userId);
        answer.upVotes.push(userId);
        author.reputation += 5;
      }
    }
    if (voteType === "down") {
      if (hasDownVoted) {
        throw new Error("you are already downVote for this question");
      } else {
        answer.downVotes.push(userId);
        answer.upVotes.pull(userId);
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

    await answer.save();
    await author.save();

    res.status(200).json({
      msg: `Successfully ${voteType === "up" ? "upvoted" : "downvoted"}`,
      upVotes: answer.upVotes.length,
      downVotes: answer.downVotes.length,
    });
  } catch (error) {
    console.error("Vote error:", error.message);
    res.status(400).json({ msg: "Server error", error: error.message });
  }
};

export const addCommentToAnswer = async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const { content } = req.body;

    if (!content) {
      throw new Error("text is required");
    }
    const answer = await answerModel.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const newComment = {
      content: content,
      userId: req.user._id,
      username: req.user.username,
    };

    answer.comments.push(newComment);
    await answer.save();

    res.status(200).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
