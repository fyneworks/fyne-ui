// run some code when document is ready
//
// see this for coverage info
// https://plainjs.com/javascript/events/running-code-when-the-document-is-ready-15/
//
// see this for comprehensive write-up 
// https://javascript.info/onload-ondomcontentloaded
// 
// see also
// https://caniuse.com/#search=readyState
// https://caniuse.com/#search=addEventListener
// 

// see also  
//import 'requestidlecallback-polyfill';

export const ready = run =>{
    
    // in case the document is already rendered
    //if (document.readyState!='loading')
    //if (document.readyState && /loaded|complete/.test(document.readyState))
    //if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive"))
    if (document.readyState && /loaded|complete|interactive/.test(document.readyState))
        run();
        
    // modern browsers
    else if (document.addEventListener) 
        document.addEventListener('DOMContentLoaded', run);
    
    // IE <= 8
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') run();
    });

};