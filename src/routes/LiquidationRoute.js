const express = require("express");
const router = express.Router();
const appointmentController = require("../app/controllers/AppointmentController");
const liquidationController = require("../app/controllers/LiquidationController");
const auth = require("../app/middleware/auth");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./src/public/img/product/");
  },
  filename: function (request, file, callback) {
    callback(
      null,
      "" + uuidv4() + file.originalname.split(file.originalname.length - 1)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// router.post('/request', auth, appointmentController.requestOne);
// router.delete('/:id', auth, appointmentController.deleteOne);
// router.patch('/:id', auth, appointmentController.acceptOne);

router.get("/all", auth, liquidationController.requestAll);
router.get("/allById", auth, liquidationController.requestAllById);
router.post(
  "/post",
  auth,
  upload.array("imageProduct", 5),
  liquidationController.postProduct
);
router.delete("/:id", auth, liquidationController.deleteProduct);
router.put(
  "/:id",
  auth,
  upload.array("imageProduct", 5),
  liquidationController.putProduct
);

router.get("/:id", auth, liquidationController.requestOne);
// router.put("/:id", auth, liquidationController.putProduct);

module.exports = router;
