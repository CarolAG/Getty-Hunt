// var sequelize = require ('sequelize');
//
// //Models are defined with - sequelize.define('name', {attributes}, {options})
// var paintingInfo = sequelize.define('paintingInfo',{
// link: { type: Sequelize.string},
//   title: { type: Sequelize.string},
//   maker: { type: Sequelize.string},
//   medium: { type: Sequelize.string},
//   place: { type: Sequelize.string},
//   date: { type: Sequelize.string}
// },
//   {
//     freezeTableName: true // Model tableName will be the same as the model name
//   });
//
//
// //module.exports =
// //exporting the function to the scraper
// module.exports = function(info,next) {
// console.log('info', info);
//   //place code here
//   next();
// }
// paintingInfo.sync({force: true}).then(function () {
//   // Table created
//   console.log('entries made?')
// });
