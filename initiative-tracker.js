document.addEventListener('DOMContentLoaded', () => {
    const basePath = "ActiveCitizenInitiatives/";

    // Helper to parse key=value lines
    function parseKeyValue(txt) {
        const lines = txt.split('\n');
        const obj = {};
        lines.forEach(line => {
            const [key, ...rest] = line.split('=');
            if (key && rest.length) {
                const cleanKey = key.replace(/\r/g, '').trim();
                obj[cleanKey] = rest.join('=').replace(/\r/g, '').trim();
            }
        });
        return obj;
    }

    Promise.all([
        fetch(basePath + "names.txt").then(r => r.text()),
        fetch(basePath + "numbers.txt").then(r => r.text()),
        fetch(basePath + "links.txt").then(r => r.text())
    ]).then(([namesTxt, numbersTxt, linksTxt]) => {
        const names = parseKeyValue(namesTxt);
        const numbers = parseKeyValue(numbersTxt);
        const links = parseKeyValue(linksTxt);

        const brickList = document.createElement("div");
        brickList.className = "brick-list";

        const keys = Object.keys(names)
            .map(k => k.trim())
            .sort((a, b) => Number(a) - Number(b));

        // Helper returns a Promise for the image path
        function findImage(key) {
            const imgExtensions = ["jpg", "png", "jpeg"];
            let idx = 0;
            return new Promise(resolve => {
                function tryNext() {
                    if (idx >= imgExtensions.length) {
                        resolve("placeholder.png");
                        return;
                    }
                    const testPath = `${basePath}${key}.${imgExtensions[idx]}`;
                    fetch(testPath, {method: "HEAD"}).then(r => {
                        if (r.ok) resolve(testPath);
                        else { idx++; tryNext(); }
                    }).catch(() => { idx++; tryNext(); });
                }
                tryNext();
            });
        }

        // Build all bricks in order, then append
        Promise.all(keys.map(key => 
            findImage(key).then(imgPath => {
                const name = names[key];
                const number = numbers[key] || "";
                const link = links[key] || "#";
                return `
                    <div class="initiative-brick">
                        <div class="initiative-img-border">
                            <img src="${imgPath}" alt="${name}">
                        </div>
                        <div class="initiative-info">
                            <a href="${link}" target="_blank">${name}</a>
                            <span style="margin-left:16px;color:#666;font-size:0.95em;">${number}</span>
                        </div>
                    </div>
                `;
            })
        )).then(bricks => {
            brickList.innerHTML = bricks.join('\n');
            document.body.insertBefore(brickList, document.getElementById('swipe-overlay'));
        });
    });
});