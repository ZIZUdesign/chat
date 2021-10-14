



//we are doing two basio things here. 
//first, when our soon-to-be-created /sse route sends new messages, we add them to 
//to the div element on the page with the id= "messages".
//second, we listen for when the user enters a messages into the text box. 
//we do this, by adding an event listener function to our form element. within this
//listener function we take the vale of the input box window.input.value and send
// a request to our server with the message. we do this by sending a GET request 
// to the /chat path with the message enconding in the query parameters.
//after we send the message, we clear the text box so the user can enter a new message. 


// create /chat endpoint that we will be taking data( a message ) from the url's
//query parameters. on this endpoint, we will be looking at ?message= 
//NB:  we will need to take the message data and put it somewhere our other 
//route will be able to access it. To do this, we are going to instantiate an object
//outside of our route fucntions's scope so that when we create another route 
// function, it will be able to access this "shard" 
//This shared object will be an instance of EventEmitter that we will call chatEmitter. 
// the EventEmitter class is available through the core events module, and 
// EventEmitter objects have an emit(eventName[,...args]) method that is usefull for 
//broadcasting data. when a message comes in, we will use chatEmitter.emit() to broadcast
//the message. we can listen for these broadcast on the /sse route 