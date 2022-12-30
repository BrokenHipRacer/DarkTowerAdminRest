const express = require("express")
const multer = require("multer")
const path = require("path")

const api = require("./api.js")

const authAdminUser = require("../../middlewares/index.js").authAdminUser

const app = express.Router()

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "..", "..", "assets"),
  filename(req, file, cb) {
    cb(null, file.originalname)
  }
})

app.get("/images/get-all-images", authAdminUser, (req, res) => {
  if (!res.locals.authSuccess) {
    res.json({authSuccess: false})
  } else {
    api.getAllImages(function(response) {
      response.authSuccess = true
      res.json(response)
    })
  }
})

app.post("/images/upload", authAdminUser, (req, res) => {
  if (!res.locals.authSuccess) {
    res.json({authSuccess: false})
  } else {
    let upload = multer({storage: storage}).single("selectedFile")

    upload(req, res, function(error) {
      if (!req.file) {
        res.json({authSuccess: true, noFileError: true})
      } else if (error) {
        res.json({authSuccess: true, submitError: true})
      } else {
        res.json({
          authSuccess: true,
          success: true
        })
      }
    })
  }
})

app.get("/images/check-if-filename-exists", (req, res) => {
  api.checkIfImageFilenameExists(req.query.filename, function(response) {
    res.json(response)
  })
})

app.get("/images/get-image-by-filename", authAdminUser, (req, res) => {
  if (!res.locals.authSuccess) {
    res.json({authSuccess: false})
  } else {
    api.getImageByFilename(req.query.filename, function(response) {
      response.authSuccess = true
      res.json(response)
    })
  }
})

app.put("/images/update-image-filename", authAdminUser, (req, res) => {
  if (!res.locals.authSuccess) {
    res.json({authSuccess: false})
  } else {
    api.updateImageFilename(req.body.originalFilename, req.body.newFilename, function(response) {
      response.authSuccess = true
      res.json(response)
    })
  }
})

app.put("/images/delete-image", authAdminUser, (req, res) => {
  if (!res.locals.authSuccess) {
    res.json({authSuccess: false})
  } else {
    api.deleteImageByFilename(req.body.filename, function(response) {
      response.authSuccess = true
      res.json(response)
    })
  }
})

module.exports = app
