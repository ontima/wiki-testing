var expect = require('chai').expect;;

var chai = require('chai');
var spies = require('chai-spies');
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


});



// var obj = {
//     foobar: function () {
//         console.log('foo');
//         return 'bar';
//     }
// }
// chai.spy.on(obj, 'foobar');