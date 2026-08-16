const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// Get All Notifications
// ==========================

router.get("/", authMiddleware, async (req, res) => {

  try {

   const notifications = await Notification.find({

  worker: req.user.userId,

})

.sort({ createdAt: -1 })

.limit(10);

    res.json(notifications);

  } catch (error) {

    res.status(500).json({

      message: "Server Error",

      error: error.message,

    });

  }

});

// ==========================
// Unread Count
// ==========================

router.get("/count", authMiddleware, async (req, res) => {

  try {

 const count = await Notification.countDocuments({

  worker: req.user.userId,

  isRead:false,

});

    res.json({

      count,

    });

  } catch (error) {

    res.status(500).json({

      message: "Server Error",

      error: error.message,

    });

  }

});

// ==========================
// Mark All Read
// ==========================

router.put("/read", authMiddleware, async (req, res) => {

  try {

await Notification.updateMany(

{

worker:req.user.userId,

isRead:false,

},

{

isRead:true,

}

);

    res.json({

      message: "Notifications Updated",

    });

  } catch (error) {

    res.status(500).json({

      message: "Server Error",

      error: error.message,

    });

  }

});
// ==========================
// Delete Notification
// ==========================

router.delete("/:id", authMiddleware, async (req, res) => {

  try {

    await Notification.findOneAndDelete({

      _id: req.params.id,

      worker: req.user.userId,

    });

    res.json({

      message: "Notification Deleted Successfully",

    });

  }

  catch(error){

    res.status(500).json({

      message:"Server Error",

      error:error.message,

    });

  }

});

module.exports = router;