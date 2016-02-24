var expect = require('chai').expect;;

var chai = require('chai');
var spies = require('chai-spies');
var models = require('../models');
var Page = models.Page;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
chai.use(spies);

describe('Testing suite capabilities', function () {
    it('confirms basic arithmetic', function () {
        expect(2+2).to.equal(4);
    });

	it('confirms setTimeout\'s timer accuracy', function (done) {
	    var start = new Date();
	    setTimeout(function () {
	        var duration = new Date() - start;
	        expect(duration).to.be.closeTo(1000, 50);
	        done();
	    }, 1000);
	});

	it('confirms forEach invoked once for each element', function() {
		var arr = ['a', 'b', 'c'];
		function testArrFunc (element) {
			console.log(element);
		}
		//var testSpy = chai.spy.on(arr, 'testArrFunc');
		var testSpy = chai.spy (testArrFunc);
		arr.forEach(testSpy);
		expect(testSpy).to.have.been.called.exactly(arr.length);
	})


describe('Page model', function() {

	var page;
	beforeEach(function() {
	    page = new Page()
	})

    describe('Validations', function() {
        it('errors without title', function(done) {
        	try {
        		page.validate();
        	} catch (err) {
        		expect(err).to.have.property('title');
        	}
        	done();
        });
        it('errors without content', function(done) {
        	try {
        		page.validate();
        	} catch (err) {
        		expect(err).to.have.property('content');
        	}
        	done();
        });
    });

    describe('Statics', function() {

        	var page1;
        	beforeEach(function(done) {
	    		Page.create({
	      		  title: 'foo',
	       		  content: 'bar',
	        	  tags: ['foo', 'bar']
	    		})
	    		.then(function(result){
	    			//console.log(result);
	    			page1 = result;
	    		}).then(function(){
	    			done();
	    		});
			})

        	afterEach(function(done) {
        		Page.remove({}, function(err) {
        		}).then(function() {
        			done();
        		});
        	})

        describe('findByTag', function() {
        	
            it('gets pages with the search tag', function(done) {
            	Page.findByTag('foo')
            	.then(function(result) {
            		expect(result).to.have.lengthOf(1);
            		done();
            	}).then(null, done);
            });
            it('does not get pages without the search tag', function(done) {
            	Page.findByTag('tag3')
            	.then(function(result) {
            		expect(result).to.have.lengthOf(0);
            		done();
            	}).then(null, done);
            });
        });
    });

    describe('Methods', function() {

    		var similarPromise;

        	beforeEach(function(done) {
	    		Page.create({
	      		  title: 'foo',
	       		  content: 'bar',
	        	  tags: ['foo', 'bar']
	    		}).then(function() {
		    		Page.create({
		      		  title: 'foo2',
		       		  content: 'bar2',
		        	  tags: ['foo']	    			
		    		});
		    	})
	    		.then(function() {
					Page.create({
		      		  title: 'foo3',
		       		  content: 'bar3'    			
		    		});
	    		})
	    		.then(function(){
	    			return Page.findOne({title: 'foo'});
	    		})
            	.then(function(page1) {
            		similarPromise = page1.findSimilar();
            	})
	    		.then(function(){
	    			done();
	    		});
			})

        	afterEach(function(done) {
        		Page.remove({}, function(err) {
        		}).then(function() {
        			done();
        		});
        	})


        describe('findSimilar', function() {
            it('never gets itself', function(done) {
            	similarPromise.then(function(result) {
            		//expect(result).to.have.lengthOf(1);
            		expect(result.every(function(page) {
            			return page.title !== 'foo';
            		}))
            	}).then(function() {
            		done();
            	}).then(null, done);
            });
            it('gets other pages with any common tags', function(done) {
             	similarPromise.then(function(result) {
            		expect(result.every(function(page) {
            			return page.title === 'foo2';
            		}))
            	}).then(function() {
            		done();
            	}).then(null, done);           	
            });
            it('does not get other pages without any common tags', function(done) {
             	similarPromise.then(function(result) {
            		//expect(result).to.have.lengthOf(1);
            		expect(result.every(function(page) {
            			return page.title !== 'foo3';
            		}))
            	}).then(function() {
            		done();
            	}).then(null, done);   
            });
        });
    });

    describe('Virtuals', function() {
        	var page1;
        	beforeEach(function(done) {
	    		Page.create({
	      		  title: 'foo',
	      		  urlTitle: 'foo',
	       		  content: 'bar',
	        	  tags: ['foo', 'bar']
	    		})
	    		.then(function(result){
	    			//console.log(result);
	    			page1 = result;
	    		}).then(function(){
	    			done();
	    		});
			})

        	afterEach(function(done) {
        		Page.remove({}, function(err) {
        		}).then(function() {
        			done();
        		});
        	})
        describe('route', function() {
            it('returns the url_name prepended by "/wiki/"', function() {
            	expect(page1.route).to.equal('/wiki/foo');
            });
        });
    });

    describe('Hooks', function() {
        	var page1;
        	beforeEach(function(done) {
	    		Page.create({
	      		  title: 'foo',
	       		  content: 'bar',
	        	  tags: ['foo', 'bar']
	    		})
	    		.then(function(result){
	    			//console.log(result);
	    			page1 = result;
	    		}).then(function(){
	    			done();
	    		});
			})

        	afterEach(function(done) {
        		Page.remove({}, function(err) {
        		}).then(function() {
        			done();
        		});
        	})

        it('it sets urlTitle based on title before validating', function() {
        	expect(page1.urlTitle).to.equal('foo');
        });
    });

});

});


