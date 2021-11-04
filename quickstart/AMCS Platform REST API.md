## AMCS Platform REST API

### Quick start

#### Overview

In this quick start walkthrough we're going to cover the basics in terms of authentication, retrieving a resource, and making a update to one of its properties.

#### Walkthrough

For this example we're going to implement this from the browser using jQuery. Lets go set up some boiler plate.

```html
//index.html
<html>
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
<script>
    
</script>
</body>
</html> 
```

We're going to use the REST API sandbox with the latest release of Platform installed. For accessing the REST API this gives us a base URI of:

https://rstapi-sbx-svc-core.amcsplatform.com/erp/api/integrator/erp

We'll put that in a variable for convenience.

```html
//index.html
<script>
    var baseUri = "https://rstapi-sbx-svc-core.amcsplatform.com/erp/api/integrator/erp";
</script>
```

Lets go ahead and attempt to retrieve a page of customers.

```javascript
console.log( "cookies:" + document.cookie );
$.get( baseUri + "directory/customers", function(data,status)
{
    console.log(status);
});
```

Sure enough, with out a session cookie we get a 401.

![image-20211104152021152](C:\Users\richard.morris\AppData\Roaming\Typora\typora-user-images\image-20211104152021152.png)

