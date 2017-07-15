/**
 *
 * @author Philip Ford
 */
'use strict';

const util = require("object-util");
const extend = util.extend;

// If you're really serious about isFunction,
// see https://stackoverflow.com/a/7356528/122955
function isFunction(value){
    return typeof value === 'function';
}

if (!isFunction(Array.from)){
    Array.from = function($arguments, transformer){
        let $_ = Array.prototype.slice.call($arguments);
        if (!isFunction(transformer)){
            return $_.map(transformer);
        }
        return $_;
    };
}


//================================================================ Private

function Specification(spec) {
    this.spec = spec;
}
extend(Specification.prototype, {
    like: function (that) {
        let spec = this.spec;
        for (let i in spec) {
            if (spec.hasOwnProperty(i) && spec[i] !== null) {
                if (that[i] !== null && (typeof spec[i] !== typeof that[i])) {
                    return false;
                }
            }
        }
        return true;
    }
});


//============================================================================ Public
let Decorator = function (that) {
    this.component = that;
};


Object.defineProperties(Decorator.prototype, {
    component: {
        enumerable: false,
        configurable: false,
        writable: true         // Writable defaults to false in Firefox, preventing me from writing to it later.
    }
});


extend(Decorator.prototype, {

    /**
     * Mixes the properties of the arguments into the component.
     *
     * @param varargs
     * @return {*}
     */
    extend: function (varargs) {
        function _extend(a, b) {
            for (let i in b) {
                if (b.hasOwnProperty(i)) {
                    a[i] = b[i];
                }
            }
            return a;
        }

        let args = Array.from(arguments);
        for (let i = 0, len = args.length; i < len; i++) {
            _extend(this.component, args[i]);
        }
        return this;   // For chaining
    },

    /**
     * Mixes the properties of the specified object into the component, but only properties that do not already
     * exist in the component.  In other words, existing properties are not overridden in the component.
     *
     * @param that
     * @return {*}
     */
    augment: function (that) {
        let cmp = this.component;
        util.augment(cmp, that);
        return this;   // For chaining
    },


    /**
     * Adds the properties of the specified object to the component if and only if the component already
     * has properties of the same name.
     *
     * @param that
     * @return {*}
     */
    override: function (that) {
        let cmp = this.component;
        util.override(cmp, that);
        return this;  // For chaining
    },


    /**
     * Checks whether all of the arguments are properties of the component.
     */
    has: function (...varargs) {
        let cmp = this.component,
            args = [...varargs];
        for (let i = 1, len = args.length; i < len; ++i) {
            if (!cmp[args[i]]) return false;
        }
        return true;
    },


    /**
     * Performs an operation for each item in the component.
     * Why not just use Object.values().forEach(), you ask?  It is not performing quite like I want.
     *
     * @param callback
     */
    forEach: function (callback) {
        let cmp = this.component;
        for (let i in cmp) {
            if (cmp.hasOwnProperty(i)) {
                callback(cmp[i], i, cmp);
            }
        }
        return this;
    },


    /**
     * Creates a new object by performing a transformation on each value in the specified object.
     * Why not just use Object.values().map(), you ask?  It is not performing quite like I want.
     *
     * @param callback
     */
    map: function (callback) {
        let result = {};
        this.forEach(function (item, i, cmp) {
            result[i] = callback(item, i, cmp);
        });
        return result;
    },


    /**
     * Returns an object of component key/value pairs that passed the filter.  The filter requires a callback
     * function that takes the following parameters:
     * (1) the value of the current property,
     * (2) the name of the current property,
     * (3) and the component.
     *
     * That function must return true/false.
     *
     * Why not just use Object.values().filter(),  you ask?  It is not performing quite like I want.
     *
     * @param {Function} callback
     */
    filter: function (callback) {
        let result = {};
        this.forEach(function (item, i, cmp) {
            if (callback(item, i, cmp) === true) {
                result[i] = item;
            }
        });
        return result;
    },


    /**
     * Returns the number of key/value pairs in the object.
     *
     * @return {Number}
     */
    size: function () {
        return Object.keys(this.component).length;
    },


    /**
     * Returns an object containing the differences between the component and the specified object--differences
     * being different properties, or properties with the same name but different values.
     *
     * @param that
     * @return {Object}
     */
    difference: function (that) {
        let i, result = {};
        extend(result, this.component);
        for (i in that) {
            if (that.hasOwnProperty(i)) {
                if (result[i] && result[i] === that[i]) delete result[i];
                else result[i] = that[i];
            }
        }
        return result;
    },


    /**
     * Returns an object containing the properties that match (same name and value) between the component and
     * the specified object.
     *
     * @param that
     * @return {*}
     */
    intersection: function (that) {
        return this.filter(function (item, i, o) {
            return that[i] === o[i];
        });
    },


    /**
     * Returns an array of the values in the component.  Why not just use Object.values(),
     * you ask?  It is not performing quite like I want.
     *
     * @return {Array}
     */
    values: function () {
        if (this.component === null || this.component === undefined) return null;
        let result = [];
        this.forEach(function (item) {
            result.push(item);
        });
        return result;
    },



    /**
     * Returns true/false for whether the specified object has all of the properties in the component.
     * and whether the types of the corresponding properties match.
     *
     * @param that
     * @return {Boolean}
     */
    like: function (that) {
        let spec = this.component;
        return new Specification(spec).like(that);
    },


    /**
     * Returns true/false for whether the specified value is contained in the object.
     * Here is a case where you really can just use ES5 methods:
     *
     * <code>Object.values(myGreatObject).includes(value);</code>
     *
     * @param value {Object}  The value to search for
     * @return {Boolean}
     */
    contains: function (value) {
        // This seems like a more necessary function a few years ago...trust me.
        // Now it's a one-liner.
        return Object.values(this.component).includes(value);
    },


    add: function (key, value) {
        this.component[key] = value;
        return this;
    },

    remove: function (key) {
        let result = this.component[key];
        delete this.component[key];
        return result;
    },

    copy: function(){
        return this.extend({}, this.component);
    }

});


module.exports = {
    decorate: function(that) {
        return new Decorator(that);
    },
};