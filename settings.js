module.exports = {
	host: 'localhost',
	port: 27017,
	db: 'blog',
	getUrl: function() {
		return 'mongodb://' + this.host + ':' + this.port + '/' + this.db;
	}
}