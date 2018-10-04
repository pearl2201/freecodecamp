let mongoose = require('mongoose');

class Database {
  constructor() {
    this._connect()
  }
_connect() {
     mongoose.connect(`mongodb://tieulee2205:anhngoc1@A@ds213183.mlab.com:13183/freecodecamp`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}
module.exports = new Database()