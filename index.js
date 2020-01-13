u('#msgsReceived').text( uibuilder.get('msgsReceived') )
    u('#msgsControl').text( uibuilder.get('msgsCtrl') )
    u('#msgsSent').text( uibuilder.get('msgsSent') )
    u('#feVersion').text( uibuilder.get('version') )

    u('button').on('click', function(e) { // send every button event on the page
        uibuilder.send( { 'topic':e.target.id, 'payload':e.target.outerText } )
    });

    u('select').on('change keyup', function(e) { // send every select event on the page
        uibuilder.send( { 'topic':e.target.id, 'payload':this.value } )
    });

    u('#toggle1').on('click', function(e) { // send toggle
        uibuilder.send( { 'topic':e.target.id, 'payload':!e.srcElement.checked } )
    });

    // Turn on debugging (default is off)
    //uibuilder.debug(true)

    // If msg changes - msg is updated when a standard msg is received from Node-RED over Socket.IO
    // Note that you can also listen for 'msgsReceived' as they are updated at the same time
    // but newVal relates to the attribute being listened to.
    uibuilder.onChange('msg', function(newVal){
        console.info('property msg changed!')
        console.dir(newVal)
        var foo = "";
        Object.keys(newVal).forEach(function (key) {
            foo += "<b>"+key+"</b> : "+JSON.stringify(newVal[key])+"<br/>";
        });
        u('#showMsg').html(foo)
    })

    // You can get attributes manually. Non-existent attributes return 'undefined'
    //console.dir(uibuilder.get('msg'))

    // You can also set things manually. See the list of attributes top of page.
    // You can add arbitrary attributes to the object, you cannot overwrite internal attributes

    // Try setting a restricted, internal attribute - see the warning in the browser console
    uibuilder.set('msg', 'You tried but failed!')

    // Remember that onChange functions don't trigger if you haven't set them
    // up BEFORE an attribute change.
    // uibuilder.onChange('msgCopy', function(newVal){
    //     console.info('msgCopy changed. New value: ', newVal)
    // })

    // Now try setting a new attribute - this will be an empty object because
    // msg won't yet have been received
    //uibuilder.set('msgCopy', uibuilder.msg)
    // Hint: Try putting this set into the onChange for 'msg'

    // As noted, we could get the msg here too
    uibuilder.onChange('msgsReceived', function(newVal){
        console.info('New msg sent to us from Node-RED over Socket.IO. Total Count: ', newVal)
        u('#msgsReceived').text(newVal)
        // uibuilder.msg is a shortcut for uibuilder.get('msg')
        //$('#showMsg').text(JSON.stringify(uibuilder.msg))
    })

    // If Socket.IO connects/disconnects
    uibuilder.onChange('ioConnected', function(newVal){
        console.info('Socket.IO Connection Status Changed: ', newVal)
        u('#socketConnectedState').text(newVal?"Connected":"Not Connected").toggleClass("success",newVal)
    })

    // If a message is sent back to Node-RED
    uibuilder.onChange('msgsSent', function(newVal){
        console.info('New msg sent to Node-RED over Socket.IO. Total Count: ', newVal)
        u('#msgsSent').text(newVal)
        u('#showMsgSent').text(JSON.stringify(uibuilder.get('sentMsg')))
    })

    // If we receive a control message from Node-RED
    uibuilder.onChange('msgsCtrl', function(newVal){
        console.info('New control msg sent to us from Node-RED over Socket.IO. Total Count: ', newVal)
        u('#msgsControl').text(newVal)
        u('#showCtrlMsg').text(JSON.stringify(uibuilder.get('ctrlMsg')))
    })

    // Automatically send a message back to Node-RED after 2 seconds
    window.setTimeout(function(){
        console.info('Sending a message back to Node-RED - after 1s delay')
        uibuilder.send( { 'topic':'uibuilderfe', 'payload':'I am a message sent from the uibuilder front end' } )
    }, 1000)