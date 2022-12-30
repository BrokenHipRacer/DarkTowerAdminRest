const path = require("path")
const fs = require("fs")
const moment = require("moment")

const utils = require("../../utils")

const assetsDirPath = path.join(__dirname, "..", "..", "..", "..", "assets")

module.exports = {
  getAllImages: function(callback) {
    fs.readdir(assetsDirPath, function(error, files) {
      if (error) {
        callback({getDataError: true})
      } else {
        callback({success: true, files: files})
      }
    })
  },
  checkIfImageFilenameExists: function(filename, callback) {
    fs.stat(`${assetsDirPath}/${filename}`, function(error) {
      if (error) {
        callback({success: true})
      } else {
        callback({success: false})
      }
    })
  },
  getImageByFilename: function(filename, callback) {
    fs.stat(`${assetsDirPath}/${filename}`, function(error, stats) {
      if (error) {
        callback({notFoundError: true})
      } else {
        callback({
          success: true,
          fileSize: utils.convertBytesToHumanFormat(stats.size),
          fileCreated: moment.unix(stats.birthtimeMs / 1000).format("M/D/YYYY"),
          filename: filename
        })
      }
    })
  },
  updateImageFilename: function(originalFilename, newFilename, callback) {
    fs.rename(`${assetsDirPath}/${originalFilename}`, `${assetsDirPath}/${newFilename}`, function(error) {
      if (error) {
        callback({submitError: true})
      } else {
        callback({
          success: true,
          newFilename: newFilename
        })
      }
    })
  },
  deleteImageByFilename: function(filename, callback) {
    fs.unlink(`${assetsDirPath}/${filename}`, function(error) {
      if (error) {
        callback({submitError: true})
      } else {
        callback({success: true})
      }
    })
  }
}
