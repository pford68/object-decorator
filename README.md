These are methods that would be nice to have in Object.prototype.  Since they can't be added safely, I created a Decorator for Object.

```javascript

var decorate = require("../../index").decorate;
...
var obj = {id: 3};
var obj2 = {author: "Philip Ford"};
decorate(obj).extend(obj2);
        
```

## API Documentation
### extend(that, varargs)
Mixes the properties of the arguments into the component.

### augment(that, props)
Mixes the properties of the specified object into the component, but only properties that do not already
exist in the component.  In other words, existing properties are not overridden in the component.  This is the 
method I find most useful.

### override(that, props)
Adds the properties of the specified object to the component if and only if the component already
has properties of the same name.

### has(varargs)
Checks whether all of the arguments are properties of the component.

### size()
Returns the number of key/value pairs in the object.

### forEach(function)
Performs an operation for each item in the specified object.

### map(function)
Creates a new object by performing a transformation on each value in the specified object.

### filter(function)
Returns an object of component key/value pairs that passed the filter.  The filter requires a callback
function that takes the following parameters:  (1) the value of the current property, the name of the
current property, and the component.  That function must return true/false.

### difference(that)
Returns an object containing the differences between the component and the specified object--differences
being different properties, or properties with the same name but different values.

### intersection(that)
Returns an object containing the properties that match (same name and value) between the component and
the specified object.

### values()
Returns an array of the values in the component.

### getSpec()
Returns a "Specification" object that can be used to compare the spec for the component to
the spec for another object.  Used for duck-typing.

#### Methods of Specification
##### like(that)
Returns true/false for whether the specified object has all of the properties in the component.
and whether the types of the corresponding properties match.
     
##### equals(that) 
Returns true/false for whether the specs of the component and the specified object match exactly,
sharing all of the same properties, and whether the types of the corresponding properties match.

### contains(value)
Returns true/false for whether the specified value is contained in the object.

### add(k, v)

### remove(k)

### constant(k, v)
Creates a constant in the component's scope.  If the key is not uppercase, it will be converted.

### getPrototypeOf()
Cross-browser function for returning an object's prototype.
