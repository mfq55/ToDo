var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var Bcrypt = require('bcryptjs');






var  UserSchema = new Schema({
    firstName : {type : String, required : true},
    lastName: {type : String, required : true},
    email: {type : String, required : true, unique: true },
    password: {type : String },
    dateRegistered: {type : Date, default : Date.now},
    status : {type : Boolean, default : true}

});

UserSchema.virtual('fullName')
.get(function () {

    return this.firstName + '  ' + this.lastName;

});



UserSchema.pre('save', function (next) {
    var person = this;
    if (this.isModified('password') || this.isNew) { 
       Bcrypt.genSalt(10, function (err, salt) {
            if (err) { 
               return next(err); 
           }
            Bcrypt.hash(person.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                person.password = hash;
                next();
            });
        });
    } else { 
       return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    Bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = Mongoose.model('User', UserSchema);