const mongoose = require("mongoose");

const notesModel = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "A note must have a title."],
      unique: true,
      // minLength: [5, "A note should have at least 5 characters in title."],
      // maxLength: [30, "A note should have at most 30 characters in title."],
      // enum: {
      //   values: ['abcd', 'efgh'],
      //   message: "Title can only take abcd or efgh"
      // }
    },

    description: {
      type: String,
    },

    created_at: {
      type: Date,
      default: Date.now(),
    },
    updated_at: {
      type: Date,
      default: Date.now(),
    },
    important: {
      type: Boolean,
      require: true,
    },
    priority: {
      type: Number,
      validate: {
        validator: function(val) {
          return val >=1 && val<=10
        },
        message: "Priority value can only be between 1 to 10"
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      require: true
    }
  }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }  
  }
);


notesModel.virtual('descriptionLength').get(function() {
  return this.description.length;
})

notesModel.pre('save', function(next) {
  console.log('Saving...');
  this.start = Date.now();
  next();
});

notesModel.post('save', function(doc, next) {
  const queryTime = Date.now() - this.start;
  console.log(queryTime);
  next();
})

const NoteModel = mongoose.model("notes", notesModel);

module.exports = NoteModel;