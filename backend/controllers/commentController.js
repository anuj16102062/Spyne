const Discussion = require('../models/Discussion');
const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
    try {
        const { text } = req.body;
        const comment = new Comment({
            user: req.user.id,
            discussion: req.params.id,
            text
        });
        await comment.save();
        const discussion = await Discussion.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } }, { new: true });
        res.status(201).json(discussion);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, { new: true });
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        const discussion = await Discussion.findByIdAndUpdate(req.params.id, { $pull: { comments: req.params.commentId } }, { new: true });
        res.status(200).json(discussion);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.likes.includes(req.user.id)) {
            return res.status(400).json({ message: 'Comment already liked' });
        }
        comment.likes.push(req.user.id);
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.replyComment = async (req, res) => {
    try {
        const { text } = req.body;
        const reply = new Comment({
            user: req.user.id,
            discussion: req.params.id,
            text
        });
        await reply.save();
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, { $push: { replies: reply._id } }, { new: true });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
