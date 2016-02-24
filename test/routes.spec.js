var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var models = require('../models');
var Page = models.Page;
var expect = require('chai').expect;;

describe('http requests', function() {

	beforeEach(function(done) {
		Page.remove({})
		.then(function(){
			done();
		});
	})

	describe('GET /', function() {
	    it('gets 200 on index', function(done) {
	        agent
	          .get('/')
	          .expect(200, done)
	    })
	});

    describe('GET /add', function () {
        it('gets 200', function (done) {
        	agent
	          .get('/wiki/add')
	          .expect(200, done)
        });
    });

    describe('GET /wiki/:urlTitle', function() {
        it('gets 404 on page that doesnt exist', function(done) {
        	agent
	          .get('/wiki/dfsdkfjsdlj')
	          .expect(404, done)
        });
        it('gets 200 on page that does exist', function(done) {
    		Page.create({
      		  title: 'foo',
       		  content: 'bar',
        	  tags: ['foo', 'bar']
    		})
    		.then(function() {
	         	agent
		          .get('/wiki/foo')
		          .expect(200, done)   			
    		})
        });
    });

    describe('GET /wiki/search', function(done) {
        it('gets 200', function() {
         	agent
	          .get('/wiki/search')
	          .expect(200, done)    	
        });
    });

    describe('GET /wiki/:urlTitle/similar', function() {
        it('gets 404 for page that doesn\'t exist', function(done) {
        	agent
	          .get('/wiki/dfsdkfjsdlj/similar')
	          .expect(404, done)
        });
        it('gets 200 for similar page', function(done) {
    		Page.create({
      		  title: 'foo',
       		  content: 'bar buzz',
        	  tags: ['foo', 'bar']
    		})
    		.then(function() {
	         	agent
		          .get('/wiki/foo/similar')
		          .expect(200)
		          .end(function(err, resp){
		          	if(err)
		          		return done(err);
		          	//expect(resp.text).to.contain('bar buzz');
		          	done();
		          });  			
    		})
        });
    });


    describe('POST /wiki/add', function() {
        it('creates a page in db', function(done) {
         	agent
	          .post('/wiki')
	          .send({
	          	title: 'foo bar',
	          	 content: 'bar',
	          	 status: 'open',
	          	 tags: 'aaa',
	          	 name: 'ontima',
	          	 email: 'sadfd' 
	          	})
	          .expect('Location', '/wiki/foo_bar')
	          .expect(302, done)			
        });
    });

});