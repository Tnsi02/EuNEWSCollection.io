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
        fetch(basePath + "links.txt").then(r => r.text()),
        fetch(basePath + "summarisation.txt").then(r => r.text()).catch(() => "")
    ]).then(([namesTxt, numbersTxt, linksTxt, summariesTxt]) => {
        const names = parseKeyValue(namesTxt);
        const numbers = parseKeyValue(numbersTxt);
        const links = parseKeyValue(linksTxt);
        const summaries = parseKeyValue(summariesTxt);

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
                const summary = summaries[key] || ""; // Get summary
                return `
                    <div class="initiative-brick" data-key="${key}">
                        <div class="initiative-img-border">
                            <img src="${imgPath}" alt="${name}">
                        </div>
                        <div class="initiative-info">
                            <a href="${link}" target="_blank">${name}</a>
                            <span class="initiative-supporters" style="color:#666;font-size:0.95em;">${number}</span>
                            <label class="voted-checkbox-label">
                                <input type="checkbox" class="voted-checkbox" data-key="${key}">
                                <span class="custom-checkbox"></span>
                                <span style="margin-left:6px;font-size:0.95em;">Voted for it</span>
                            </label>
                            <button class="summary-toggle" data-key="${key}">Quick Summary ▼</button>
                            <div class="initiative-summary" id="summary-${key}" style="display:none; grid-column: 1 / -1;">
                                ${summaries[key] ? summaries[key] : "<em>No summary available.</em>"}
                            </div>
                        </div>
                    </div>
                `;
            })
        )).then(bricks => {
            brickList.innerHTML = bricks.join('\n');
            document.body.insertBefore(brickList, document.getElementById('swipe-overlay'));

            // Persist and restore checkbox state
            document.querySelectorAll('.voted-checkbox').forEach(cb => {
                const key = cb.getAttribute('data-key');
                // Restore state
                cb.checked = localStorage.getItem('initiative-voted-' + key) === 'true';
                // Save state on change
                cb.addEventListener('change', () => {
                    localStorage.setItem('initiative-voted-' + key, cb.checked);
                });
            });

            // Toggle summary visibility
            document.querySelectorAll('.summary-toggle').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.getAttribute('data-key');
                    const summaryDiv = document.getElementById('summary-' + key);
                    if (summaryDiv.style.display === 'none') {
                        summaryDiv.style.display = 'block';
                        btn.textContent = 'Quick Summary ▲';
                    } else {
                        summaryDiv.style.display = 'none';
                        btn.textContent = 'Quick Summary ▼';
                    }
                });
            });
        });
    });
});