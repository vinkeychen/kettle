/**

Copyright (c) 2009 Thomas Robinson <tlrobinson.net>

Permission is hereby granted, free of charge, to any person obtaining a copy of 
* this software and associated documentation files (the “Software”), to deal in 
* the Software without restriction, including without limitation the rights to 
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
* of the Software, and to permit persons to whom the Software is furnished to 
* do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
* AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
* ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* 
*/
var fluid_1_2 = fluid_1_2 || {};
var fluid = fluid || fluid_1_2;


// Adapted from JackJS' servlet.js "handler" - original comment:

// Similar in structure to Rack's Mongrel handler.
// All generic Java servlet code should go in here.
// Specific server code should go in separate handlers (i.e. jetty.js, etc)

// original licence: MIT - at http://jackjs.org/ 


(function ($, fluid) {
    fluid.kettle = fluid.kettle || {
    	servlet: {}};

    fluid.kettle.servlet.process = function(app, request, response) {
		    var env = {};
		    
		    // copy HTTP headers over, converting where appropriate
		    for (var e = request.getHeaderNames(); e.hasMoreElements();)
		    {
		        var name = String(e.nextElement()),
		            value = String(request.getHeader(name)), // FIXME: only gets the first of multiple
		            key = name.replace("-", "_").toUpperCase();
		        
		        if (key != "CONTENT_LENGTH" && key != "CONTENT_TYPE")
		            key = "HTTP_" + key;
		        
		        env[key] = value;
		    }
		    
		    env["SCRIPT_NAME"]          = String(request.getServletPath() || "");
		    env["PATH_INFO"]            = String(request.getPathInfo() || "");
		    
		    env["REQUEST_METHOD"]       = String(request.getMethod() || "");
		    env["SERVER_NAME"]          = String(request.getServerName() || "");
		    env["SERVER_PORT"]          = String(request.getServerPort() || "");
		    env["QUERY_STRING"]         = String(request.getQueryString() || "");
		    env["HTTP_VERSION"]         = String(request.getProtocol() || "");
		    
		    env["REMOTE_HOST"]          = String(request.getRemoteHost() || "");
		        
		    // call the app
		    var result = app(env),
		        status = result[0], headers = result[1], body = result[2];
		    
		    // set the status
		    response.setStatus(status);
		    
		    // set the headers
		    for (var key in headers) {
		        fluid.transform(headers[key].split("\n"))(function(value) {
		            response.addHeader(key, value);
		        });
		    }
		
		    // determine if the response should be chunked (FIXME: need a better way?)
		    //var chunked = HashP.includes(headers, "Transfer-Encoding") && HashP.get(headers, "Transfer-Encoding") !== 'identity';
		    
		    var os = response.getOutputStream(),
		        output = new IO(null, os);
		   
		    // output the body, flushing after each write if it's chunked
		    body.forEach(function(chunk) {
		        if (!sendfilePath) {
		            //output.write(new java.lang.String(chunk).getBytes("US-ASCII"));
		            //output.write(chunk, "US-ASCII");
		            output.write(chunk);
		
		            if (chunked)
		                response.flushBuffer(); //output.flush();
		        }
		    });
		
		    output.close();
		}

})(jQuery, fluid_1_2);
    
