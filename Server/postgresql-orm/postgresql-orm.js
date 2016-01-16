var Sequelize = require ('sequelize');

var sequelize = new Sequelize('paintings', 'willsentance','', {
  host: 'localhost',
  dialect: 'postgres',
//pool: a cache of database connections maintained so that the connections can be reused when future requests to the database are required.Connection pools are used to enhance the performance of executing commands on a database.
  pool: {
    max: 2,
    min: 0,
    idle: 10000
  },
//idle: The maximum time, in milliseconds, that a connection can be idle before being released
});
//Or you can simply use a connection uri - var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');


//Test the connection by trying to authenticate Aliases: validate
sequelize.authenticate().then(function(err, data) {
  console.log('Connected with PostgreSQL ORM - test');
}).catch(function(err) {
  console.log(err);
})

var defineCreate = {};
defineCreate.paintingInfo = paintingInfo;
defineCreate.creating = creating;

//Models are defined with - sequelize.define('name', {attributes}, {options})
function paintingInfo(){
    return sequelize.define('paintingInfo', {
    number: { type: Sequelize.STRING, unique:true},
    image: { type: Sequelize.STRING},
    link: { type: Sequelize.STRING, unique:true},
    title: { type: Sequelize.STRING, unique:true},
    maker: { type: Sequelize.STRING},
    medium: { type: Sequelize.STRING},
    place: { type: Sequelize.STRING},
    date: { type: Sequelize.STRING}
  })
}


//exporting the function to the scraper
function creating (info) {
  //console.log('paintingInfo defined?',defineCreate.paintingInfo);
  var result = defineCreate.paintingInfo();
  //console.log('result?', result);
result.sync().then(function () {
    for (var i = 0; i< info.length; i++){
    result.create ({
       number: i,
       image: info[i].image,
       link: info[i].link,
       title: info[i].title,
       maker: info[i].maker,
       medium: info[i].medium,
       place: info[i].place,
       date: info[i].date
     })
   }
 })
.then(function(painting){
//console.log('able to retrieve',painting.get('link'));
//console.log('paintingggg', painting)
 })
}

module.exports = defineCreate;
