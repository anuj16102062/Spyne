const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    try {
        console.log('-------7')
        const { name, mobileNo, email, password } = req.body;
        console.log(name, mobileNo, email, password,'-------8')
        const user = new User({ name, mobileNo, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user,'-------------22')
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { _id, name, ...otherData } = user;    
        const data = {
            status:true,
            userId: _id.valueOf(),
            name:name,
            token:token
        }
        res.status(200).json({data });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
