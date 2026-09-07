const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// Automatically hash password before saving to db
UserSchema.pre('save', async function() {
    if(!this.isModified('password')) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    } catch(error) {
        console.error('Error in saving user to db:', error);
    }
});

// Helper method to compare passwords during login
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);
