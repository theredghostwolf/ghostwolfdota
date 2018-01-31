var mongoose = require("mongoose")

var buildSchema = new mongoose.Schema ( {
  notes: {type: String, default: ""},
  title: {type: String, default: ""},
  build: {type: [Number], default: []},
  desc: {type: String, default: ""}
})

module.exports = mongoose.model("guide", {
  intro: {type: String, default: ""},
  skills: {type: String, default: ""},
  playstyle: {type: String, default: ""},
  itemization: {type: String, default: ""},
  drafting: {type: String, default: ""},
  heroID: {type: Number, default: 0},
  skillbuild: {type: [buildSchema], default: ""}
})
