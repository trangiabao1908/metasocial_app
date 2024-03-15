// import multer from "multer";
// const storage = multer.diskStorage({
//   destination: function (_req, _file, cb) {
//     cb(null, "src/public/assets");
//   },
//   filename: function (req, file, cb) {
//     const userId = req.user?.userId;
//     let exploded_name = file.originalname.split(".");
//     let ext = exploded_name[exploded_name.length - 1];
//     console.log(file.originalname);
//     userId
//       ? cb(
//           null,
//           file.fieldname +
//             "_" +
//             req.user.userId +
//             "_" +
//             exploded_name[0] +
//             "_post" +
//             "." +
//             ext
//         )
//       : cb(
//           null,
//           file.fieldname + "_" + exploded_name[0] + "_avatar" + "." + ext
//         );
//   },
// });

// export const upload = multer({ storage });
