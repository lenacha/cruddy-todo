const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {

    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        console.log('Fail to create file');
      } else {
        callback(null, { id, text });
      }
    })
  });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    var data = [];
    if (err) {
      console.log('NO!')
    } else if (files.length === 0) {
      callback(null, data);
    } else {
      files.forEach(file => {
        fs.readFile(`${exports.dataDir}/${file}`, "utf8", (err, text) => {
          var id = file.replace('.txt', '');
          if (err) {
            console.log('No again');
            callback(err);
          } else {
            data.push({ id, text })
            if (files.length === data.length) {
              callback(null, data);
            }
          }
        })
      })
    }
  })
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, "utf8", (err, text) => {
    if (err) {
      console.log('No files!');
      callback(err);
    } else {
      callback(null, { id, text });
    }
  })
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err) => {
    if (err) {
      console.log("Error to update!");
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, callback);
    }
  })
};

exports.delete = (id, callback) => {
  exports.readOne(id, (err) => {
    if (err) {
      console.log("Error to delete!");
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(`${exports.dataDir}/${id}.txt`, callback);
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
