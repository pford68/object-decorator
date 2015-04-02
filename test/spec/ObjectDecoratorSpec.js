var decorate = require("../../index").decorate;
var _ = require("underscore");

// Common data
// Note:  when I tried to initialize this in beforeEach() below, cdata was undefined in some tests.
var cdata = {
    id: 'jsmith',
    number: '34079',
    age: 32,
    startDate: new Date().getTime(),
    endDate: null,
    active: true,
    ssn: '444-00-2222',
    title: 'Software Developer'
};

function testIterators(item, key, scope) {
    switch (key) {
        case 'id':
            expect(item).toEqual("jsmith");
            expect(scope[key]).toEqual("jsmith");
            break;
        case 'age':
            expect(item).toEqual(32);
            expect(scope[key]).toEqual(32);
            break;
        case 'active':
            expect(item).toBeTruthy();
            expect(scope[key]).toBeTruthy();
            break;
        case 'title':
            expect(item).toEqual("Software Developer");
            expect(scope[key]).toEqual("Software Developer");
            break;
    }
}



describe("extend()", function () {

    it("should mix the second argument into the first argument", function () {
        var obj = {id: 3};
        var obj2 = {author: "Philip Ford"};
        decorate(obj).extend(obj2);
        expect(obj.author).toBe("Philip Ford");
        expect(obj2.id).toBeUndefined();
    });

    it("should mix all arguments, after the first argument, into the first argument", function () {
        var obj = {id: 3};
        var obj2 = {author: "Philip Ford"};
        var obj3 = {copyright: "July 2012"};
        decorate(obj).extend(obj2, obj3);
        expect(obj.author).toBe("Philip Ford");
        expect(obj.copyright).toBe("July 2012");
        expect(obj2.copyright).toBeUndefined();
    });

});


describe("augment()", function () {
    var theObject,
        mixin = {
            id: 'mixin',
            bgColor: 'red',
            rank: '99%',
            active: true,
            getAge: function () {
                return 23;
            },
            execute: function () {
                return "Hello!";
            },
            getBgColor: function () {
                return this.bgColor;
            }
        };

    beforeEach(function () {
        theObject = {
            id: 'test',
            active: false,
            bgColor: null,
            getAge: function () {
                return 21;
            }
        };
    });

    it("should add new properties to an object", function () {
        decorate(theObject).augment(mixin);
        expect(theObject.bgColor).not.toBeNull();
        expect(theObject.bgColor).toEqual('red');
        expect(theObject.rank).toEqual('99%');
        expect(theObject.getBgColor()).toEqual('red');
        expect(theObject.execute()).toEqual('Hello!');
    });

    it("should not override existing properties, even if they are null or false", function () {
        decorate(theObject).augment(mixin);
        expect(theObject.id).toEqual('test');
        expect(theObject.getAge()).toEqual(21);
        expect(theObject.active).toBeFalsy();
    });

    it("should not remove any existing properties", function () {
        decorate(theObject).augment(mixin);
        expect(theObject.id).not.toBeNull();
        expect(theObject.getAge).not.toBeNull();
        expect(theObject.bgColor).not.toBeNull();
        expect(theObject.active).not.toBeNull();

        expect(theObject.id).toBeDefined();
        expect(theObject.getAge).toBeDefined();
        expect(theObject.bgColor).toBeDefined();
        expect(theObject.active).toBeDefined();
    });
});


describe("override()", function () {
    var theObject,
        mixin = {
            id: 'mixin',
            bgColor: 'red',
            rank: '99%',
            active: true,
            getAge: function () {
                return 23;
            },
            execute: function () {
                return "Hello!";
            },
            getBgColor: function () {
                return this.bgColor;
            }
        };

    beforeEach(function () {
        theObject = {
            id: 'test',
            active: false,
            bgColor: null,
            getAge: function () {
                return 21;
            }
        };
    });

    it("should not add new properties an object", function () {
        decorate(theObject).override(mixin);
        expect(theObject.rank).not.toBeDefined();
        expect(theObject.getBgColor).not.toBeDefined();
        expect(theObject.execute).not.toBeDefined();
    });

    it("should override any corresponding existing properties, even if they are null or false", function () {
        decorate(theObject).override(mixin);
        expect(theObject.bgColor).toEqual('red');
        expect(theObject.id).toEqual('mixin');
        expect(theObject.getAge()).toEqual(23);
        expect(theObject.active).toBeTruthy();
    });

    it("should not remove any existing properties", function () {
        decorate(theObject).override(mixin);
        expect(theObject.id).not.toBeNull();
        expect(theObject.getAge).not.toBeNull();
        expect(theObject.bgColor).not.toBeNull();
        expect(theObject.active).not.toBeNull();

        expect(theObject.id).toBeDefined();
        expect(theObject.getAge).toBeDefined();
        expect(theObject.bgColor).toBeDefined();
        expect(theObject.active).toBeDefined();
    });
});


describe("difference()", function () {
    it("should return an object containing the differences (different key or different key/value pair)" +
    " b/w the component and the specified object", function () {
        var obj1 = {id: 3, name: "John"};
        var obj2 = {id: 4, value: 45, name: "John"};
        var diff = decorate(obj1).difference(obj2);
        expect(diff.id).toEqual(4);
        expect(diff.name).toBeUndefined();
        expect(diff.value).toBe(45);
    })
});


describe("size()", function () {
    it("should return the number of properties in the specified object", function () {
        var obj = {id: "45hgfd", name: "John", age: 26};
        expect(decorate(obj).size()).toBe(3);
        expect(decorate({}).size()).toBe(0);
    });
});

describe("has()", function () {
    var that;

    beforeEach(function () {
        that = {id: "45hgfd", name: "John", age: 26};
    });

    it("should return true if all of the arguments are keys in the component", function () {
        expect(decorate(that).has("id", "name", "age")).toBeTruthy();
    });

    it("should return false if any of the arguments is not a key in the component", function () {
        expect(decorate({}).has("id", "name", "age")).toBeFalsy();
        expect(decorate({id: 'jsmith'}).has("id", "name", "age")).toBeFalsy();
        expect(decorate({id: 'pjones', age: 44}).has("id", "name", "age")).toBeFalsy();
        expect(decorate({id: 'pjones', name: 'Pete Jones'}).has("id", "name", "age")).toBeFalsy();
    });
});


describe("forEach()", function () {
    it("should perform the specified action for each item in the component", function () {
        var items = [], nulls = [];
        decorate(cdata).forEach(function (item, key, scope) {
            items.push(item);
            if (item === null) {
                nulls.push(key);
            }
        });
        expect(items.length).toEqual(8);
        expect(nulls.length).toEqual(1);
        expect(nulls[0]).toEqual("endDate");
    });

    it("should make the each item, key, and the component available to the callback, in that order", function () {
        decorate(cdata).forEach(function (item, key, scope) {
            testIterators(item, key, scope);
        });
    });
});


describe("map()", function () {
    var a = decorate(cdata).map(function (item) {
        return false;
    });
    var b = decorate(cdata).map(function (item) {
        return true;
    });
    var c = decorate(cdata).map(function (item, key) {
        if (key === "ssn") return "XXX-XX-XXXX";
        else if (key === "active") return false;
        else return item += "!";
    });


    it("should return an Object", function () {
        expect(a.constructor).toBe(Object);
        expect(b.constructor).toBe(Object);
    });

    it("should transform the component values, using the callback, and return the transformed values in a new object", function () {
        expect(c.age).toEqual("32!");
        expect(c.active).toBeFalsy();
        expect(c.id).toEqual('jsmith!');
        expect(c.title).toEqual('Software Developer!');
        expect(c.number).toEqual("34079!");
        expect(c.ssn).toEqual("XXX-XX-XXXX");
    });

    it("should make the each item, key, and the component available to the callback, in that order", function () {
        decorate(cdata).map(function (item, key, scope) {
            testIterators(item, key, scope);
        });
    });
});


describe("filter()", function () {
    var a = decorate(cdata).filter(function (item) {
        return false;
    });
    var b = decorate(cdata).filter(function (item) {
        return true;
    });
    var c = decorate(cdata).filter(function (item, key) {
        return ( typeof item === 'string');
    });

    it("should return an Object", function () {
        expect(a.constructor).toBe(Object);
        expect(b.constructor).toBe(Object);
    });

    it("should return a new object containing only the component properties that pass the filter", function () {
        expect(c.age).toBeUndefined();
        expect(c.active).toBeUndefined();
        expect(c.id).toEqual('jsmith');
        expect(c.title).toEqual('Software Developer');
        expect(c.number).toEqual("34079");
        expect(c.ssn).toEqual("444-00-2222");
    });

    it("should make the each item, key, and the component available to the callback, in that order", function () {
        decorate(cdata).forEach(function (item, key, scope) {
            testIterators(item, key, scope);
        });
    });
});


describe("intersection()", function () {
    it("should return a new object containing only the similarities (same property name and value) between the component and specified object", function () {
        var obj1 = {id: 3, name: "John"};
        var obj2 = {id: 4, value: 45, name: "John"};
        var is = decorate(obj1).intersection(obj2);
        expect(is.id).toBeUndefined();
        expect(is.name).toBe("John");
        expect(is.value).toBeUndefined();
    })
});


describe("values()", function () {
    var values = decorate(cdata).values();
    it("should return an array of the values of the component's properties", function () {
        expect(values.length).toEqual(8);
        expect(values[0]).toEqual("jsmith");
        expect(values[7]).toEqual("Software Developer");
    });

    it("should return [] for null, undefined, and {}", function () {
        try {
            expect(decorate({}).values().length).toEqual(0);
            expect(decorate(null).values().length).toEqual(0);
            expect(decorate(undefined).values().length).toEqual(0);
        } catch (e) {
            this.fail("We should not reach this point.");
        }
    });
});


describe("getSpec()", function () {

    var that = {
        id: "pjones",
        age: 45,
        number: '44566',
        title: "Software Developer",
        active: true,
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
        ssn: "444-11-5555"
    };


    describe("like()", function () {
        it("should return true if the specified object has all of the same properties, with the same data type, as the component", function () {
            expect(decorate(cdata).getSpec().like(that)).toBeTruthy();
        });

        it("should be irrelevant that the component does not have all of the properties present in the specified object", function () {
            var obj = {};
            _.extend(obj, that);
            obj.favorites = ['skiiing'];
            expect(decorate(cdata).getSpec().like(obj)).toBeTruthy();
        });

        it("should be still return true if one of the corresponding properties is null", function () {
            var obj = {};
            _.extend(obj, that);
            obj.id = null;
            expect(decorate(cdata).getSpec().like(obj)).toBeTruthy();
        });

        it("should return false if the specified object does not have one or more properties present in the component", function () {
            var obj = {};
            _.extend(obj, that);
            delete obj.ssn;
            expect(decorate(cdata).getSpec().like(obj)).toBeFalsy();
        });
    });

    describe("equals()", function () {
        it("should return true if the specified object and the component have exactly the same property names, with the same data types", function () {
            var obj = {};
            _.extend(obj, that);
            delete obj.ssn;
            expect(decorate(cdata).getSpec().equals(that)).toBeTruthy();
            expect(decorate(cdata).getSpec().equals(obj)).toBeFalsy();
        });

        it("should return false if the specified object does not have one or more properties present in the component", function () {
            var obj = {};
            _.extend(obj, that);
            delete obj.ssn;
            expect(decorate(cdata).getSpec().equals(obj)).toBeFalsy();
        });

        it("should return false if the component does not have all of the properties present in the specified object", function () {
            var obj = {};
            _.extend(obj, that);
            obj.favorites = ['skiiing'];
            expect(decorate(cdata).getSpec().equals(obj)).toBeFalsy();
        });

        it("should be still return true if one of the corresponding properties is null", function () {
            var obj = {};
            _.extend(obj, that);
            obj.id = null;
            expect(decorate(cdata).getSpec().equals(obj)).toBeTruthy();
        });
    });



    describe("constant()", function(){
        it("should create an immutable key/value pair", function(){
            var my = {};
            decorate(my).constant("__CLASSNAME__", "MyGreatClass");
            my.__CLASSNAME__ = "OK";
            expect("MyGreatClass").toEqual(my.__CLASSNAME__);
        });

        it("should create an key/value pair that can't be deleted from its object scope", function(){
            var my = {};
            decorate(my).constant("__CLASSNAME__", "MyGreatClass");

            delete my.__CLASSNAME__;
            expect("MyGreatClass").toEqual(my.__CLASSNAME__);
        });

        it("should convert the key to upper case if it is not already upper case", function(){
            var my = {};
            decorate(my).constant("some_Name", "Roger");
            expect(my.SOME_NAME).toBeDefined();
            expect(my.some_Name).toBeUndefined();
        });
    });
});
