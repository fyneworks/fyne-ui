import { dialog, inline } from './hub';

export const show = ({...props}) => { 
    const { data } = props;
    console.log('fyne show', {data,props});
    dialog.render(props);
    // render lazy method
    // or open iframe?
}
export const hide = (...args) => { 
    console.log('fyne hide', args)
}


// reusable start procedure
export const start = ({action, custom_data = {}, ...props})=>{

    // tracking
    window.dataLayer && window.dataLayer.push({'event': 'booking', eventCategory:'start', eventAction:'started'});
    window.ga && window.ga('send', 'event', 'booking', 'start', 'started');//, [eventLabel], [eventValue], [fieldsObject]);
    
    // auto fill with data provided
    const data = custom_data || ('localStorage' in window) && localStorage.getItem('fynedata');
    if(Object.keys(data).length>0){

        // tracking
        window.dataLayer && window.dataLayer.push({'event': 'booking', eventCategory:'start', eventAction:'straight-to-form'});
        window.ga && window.ga('send', 'event', 'booking', 'start', 'straight-to-form');//, [eventLabel], [eventValue], [fieldsObject]);

        // SHOW BOOKING FOR WITH INITIAL DATA
        console.log('Fyne hub show WITH INITIAL DATA', {data,custom_data});
        show({data});
    }
    else{

        // tracking
        window.dataLayer && window.dataLayer.push({'event': 'booking', eventCategory:'start', eventAction:'show-prompt'});
        window.ga && window.ga('send', 'event', 'booking', 'start', 'show-prompt');//, [eventLabel], [eventValue], [fieldsObject]);

        // SHOW BOOKING FORM BLANK
        console.log('Fyne hub show BLANK', {data,custom_data});
        show();

    }

};

export const renderInto = (ele) => {
	console.log('render into',{ele});
	render({ele});
}

export const render = ({ele,data,...props}) => {
	console.log('render inline',{ele,data,props});
	inline.render({...props,ele,data});//ReactDOM.render(<App url={ele.dataset.pdf} />, ele);
}

let clickedatall = false;
let initialised = false;
let clicked = false;
export const listen = () => {

    // bind event handlers
    if(!!initialised){
        console.log('already initialised, do not bind event handler again');
    }
    else{
        
        initialised = true;
        console.log('initializing, bind event handler for the first time');
        document.addEventListener("click", function(e) {
            
            // reset click once trap
            clicked = false;
            
            // loop through parents to document root, look for .book
            for (var target=e.target; target && target!==this; target=target.parentNode) {
                // loop parent nodes from the target to the delegation node
                
                if (target.matches('[rel="fyne-form"]') || target.matches('.fyne-form')) {
                    
                    // don't follow the link
                    e.preventDefault();
                        
                    if(!!clicked){
                        console.log('already clicked');
                    }
                    else{
                        clickedatall = true;
                        clicked = true;

                        //console.log('show();');
                        show();
    
                    }
                    // stop for-looping
                    break;
                }
            }
        }, false);
    }

    // listen for ALT+B key combo
    document.addEventListener("keyup", function(event) {
        var e = event || window.event; // for IE to cover IEs window event-object
        if(e && e.altKey && e.which === 66) { // ALT+B
            
                    //console.log('show();');
                    show();
    
            return false;
        }
    }, false);// keyup

};


// on mutation
export const watch = ()=> {
	const observer = new MutationObserver( mutations => {
        //console.log('mutations',{mutations});
        const cls = window.FYNE_INLINE_CLASS || inline.className;
		const found = [];
		for (const { addedNodes } of mutations) {
			for (const node of addedNodes) {
				if (!node.tagName) continue; // not an element
				if (node.classList.contains(cls)) {
					found.push(node);
				} 
				else if (node.firstElementChild) {
					found.push(...node.getElementsByClassName(cls));
				}
			}
        }
		found.forEach(renderInto);
	});
	observer.observe(document, { childList: true, subtree: true });
};

// bind directly to elements found by class
export const bind = ()=> {
    const cls = window.FYNE_INLINE_CLASS || inline.className;
    const ele = document.getElementsByClassName(inline.className);
    console.log('bind', {cls,ele});
    // bind all matching elements by class
    [].forEach.call(ele, renderInto);
};

// on boot
export const init = ()=> {

    // bind all matching elements
    bind();
    
    // watch for mutations
    watch();
    
    // listen for clicks
    listen();

};
