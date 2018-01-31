var mongoose = require("mongoose")

module.exports = mongoose.model("ability", {
  data: {type: [String], default: []},
  name: {type: String, default: ''},
  cooldown: {type: String, default: ''},
  mana: {type: String, default: ''},
  description: {type: String, default: ''},
  icon: {type: String, default: ''},
  liveIcon: {type: String, default: ''},
  lore: {type: String, default: ''},
  heroID: {type: Number, default: 0},
  id: {type: Number, default: 0}
})
