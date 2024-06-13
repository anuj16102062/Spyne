const Discussion = require('../models/Discussion');
const multer = require('multer');
const Comment = require('../models/Comment');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const upload = multer({ storage: storage });
exports.getDiscussion = [
  async (req, res) => {
        try {
            const discussions = await Discussion.find();
        const discussionsWithCounts = await Promise.all(discussions.map(async (discussion) => {
            const comments = await Comment.find({ discussion: discussion._id }).populate('user', 'name');

            return {
                _id: discussion._id,
                user: discussion.user,
                text: discussion.text,
                image: discussion.image,
                hashtags: discussion.hashtags,
                comments: comments.map(comment => ({
                    _id: comment._id,
                    text: comment.text,
                    user: comment.user.name,
                    createdOn: comment.createdOn
                })),
                likes: discussion.likes.length,
                views: discussion.views,
                createdOn: discussion.createdOn,
                commentCount: comments.length
            };
        }));

        res.status(200).json(discussionsWithCounts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
]
exports.createDiscussion = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { text, hashtags } = req.body;
            console.log( text, hashtags)
            let hashtagsArray;
            if (typeof hashtags === 'string') {
                hashtagsArray = hashtags.split(',').map(tag => tag.trim());
            } else if (Array.isArray(hashtags)) {
                hashtagsArray = hashtags;
            } else {
                return res.status(400).json({ message: 'Invalid hashtags format' });
            }
            console.log( text, hashtags)
            const discussion = new Discussion({
                user: req.user.id,
                text,
                hashtags: hashtagsArray,
                image: req.file.path
            });
            await discussion.save();
            res.status(201).json(discussion);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Server error' });
        }
    }
];

exports.updateDiscussion = [
    upload.single('image'),
    async (req, res) => {
        try {
            let updatedData = { ...req.body };
            if (req.file) {
                updatedData.image = req.file.path;
            }
            if (typeof req.body.hashtags === 'string') {
                updatedData.hashtags = req.body.hashtags.split(',').map(tag => tag.trim());
            }
            const discussion = await Discussion.findByIdAndUpdate(req.params.id, updatedData, { new: true });
            res.status(200).json(discussion);
        } catch (error) {
            console.error(error, '----------57');
            res.status(500).json({ message: 'Server error' });
        }
    }
];



exports.deleteDiscussion = async (req, res) => {
    try {
        await Discussion.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Discussion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDiscussionsByTag = async (req, res) => {
    try {
        console.log( req.params.tag ,'-----54')
        const discussions = await Discussion.find({ hashtags: { "$in" : [req.params.tag]}})
        console.log(discussions,'00')
        res.status(200).json(discussions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDiscussionsByText = async (req, res) => {
    try {
        const discussions = await Discussion.find({ text: { $regex: req.params.text, $options: 'i' } });
        res.status(200).json(discussions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
