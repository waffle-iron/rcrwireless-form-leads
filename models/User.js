const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const version = require('mongoose-version');
const mongooseDelete = require('mongoose-delete');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: String,
  resetPassword: String,
  admin: {
    type: Boolean,
    default: false
  },
  forms: Array
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.password;
    delete ret.__v;
    delete ret.resetPassword;
    return ret;
  }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseDelete, {
  deletedAt : true,
  deletedBy : true,
  overrideMethods: true
});
userSchema.plugin(version, { collection: 'users__versions' });

module.exports = mongoose.model('user', userSchema);
