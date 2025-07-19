const {Schema, model} = require("mongoose")

    const userSchema = new Schema({
        fullName: {type: String, required:true},
        email: {type:String, required:true},
        password:{type:String, required:true},
        profilePhoto:{type:String, default:"https://res.cloudinary.com/dbtjx031s/image/upload/v1752863254/portrait-femme-affaires_505024-2803_patjl9.avif"},
        bio: {type:String, default:"No bio yet"},
        // city:{type:String, required:true},
        // Profession:{type:String, required:true},
        // friends:[{type: Schema.Type.ObjectId, ref:"User"}],
        posts:[{type:Schema.Types.ObjectId, ref:"POST"}],
        
    },{timestamps:true})

    module.exports= model("User", userSchema)