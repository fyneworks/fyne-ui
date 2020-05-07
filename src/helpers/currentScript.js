// first try to pollyfill for IE11
import './currentScript-IE9-11';
// first try to pollyfill for IE8 or less
import './currentScript-IE6-10';

// https://stackoverflow.com/questions/403967/how-may-i-reference-the-script-tag-that-loaded-the-currently-executing-script
export const script = (function() {
    let cs = document.currentScript;
    if(!cs){
        // find by pollyfill or dom query
        cs = !cs && document._currentScript && document._currentScript();

        // don't do this, would break if these props change
        //cs = !cs && document.getElementById('fwxfrm-script');
        //cs = !cs && document.querySelector('script[data-name="fwxfrm"]');

    }
    if(!cs){
        // assume last script
        let scripts = document.getElementsByTagName("script");
        cs = scripts[scripts.length - 1];
    }
    const { baseURI, src } = cs;
    const cur_path = baseURI;
    const src_path = src && src.match(/^(https?\:\/\/[^\/]+\/)/gi)[0];
    console.log('current script:', {cs,baseURI,src,cur_path,src_path});
    return { src_path, cur_path, src, tag:cs };
})();