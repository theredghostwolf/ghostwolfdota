// app/models/nerd.js
// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Hero', {
    name : {type : String, default: ''},
    heroID: {type: Number, default: 0},
    localized_name: {type: String, default: ''},
    primary_attr: {type: String, default: ''},
    attack_type: {type: String, default: ''},
    roles: {type: [String], default: []},
    legs: {type: Number, default: 2},
    has_guide: {type: Boolean, default: false},
    id: {type: Number, default: 0},
    stats: {
      agiBase: {type: Number, default: 0},
      agiGain: {type: Number, default: 0},
      strBase: {type: Number, default: 0},
      strGain: {type: Number, default: 0},
      intBase: {type: Number, default: 0},
      intGain: {type: Number, default: 0},
      armorBase: {type: Number, default: 0},
      speedBase: {type: Number, default: 0},
      damageBase: {type: String, default: ''}
    }
});
