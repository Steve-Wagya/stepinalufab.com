document.addEventListener('DOMContentLoaded', () => {
    const addJobBtn = document.getElementById('addJobBtn');
    const jobsList = document.getElementById('jobsList');
    const calcAllBtn = document.getElementById('calcAllBtn');
    const perJobResults = document.getElementById('perJobResults');
    const stockResults = document.getElementById('stockResults');
    const inputHint = document.getElementById('inputHint');

    let jobCounter = 0;

    const FORMULAS = {
        outerFrame: {
            topBottomTrack: (width) => width,
            sideJambs: (height) => height,
        },
        slidingPanel: {
            verticalStiles: (height) => height - 45,

            horizontalRails: (width) => (width / 2) + 20,
        },
        glass: {
            glassHeight: (stileHeight) => stileHeight - 80,

            glassWidth: (railWidth) => railWidth - 85,
        }
    };
    addJobBtn.addEventListener('click', () => {
        jobCounter++;
        inputHint.classList.add('hidden');

        const jobHtml = `
            <div class="job" id="job-${jobCounter}">
                <div><strong>Window ${jobCounter}</strong></div>
                <div class="row">
                    <label for="width-${jobCounter}" class="small">Width (mm)</label>
                    <input type="number" id="width-${jobCounter}" placeholder="e.g., 1200">
                </div>
                <div class="row">
                    <label for="height-${jobCounter}" class="small">Height (mm)</label>
                    <input type="number" id="height-${jobCounter}" placeholder="e.g., 1000">
                </div>
                <button class="btn-ghost" onclick="document.getElementById('job-${jobCounter}').remove()">X</button>
            </div>
        `;
        jobsList.insertAdjacentHTML('beforeend', jobHtml);
    });

    calcAllBtn.addEventListener('click', () => {
        perJobResults.innerHTML = '';

        const jobs = jobsList.querySelectorAll('.job');
        if (jobs.length === 0) {
            perJobResults.innerHTML = '<div class="small muted">Please add a window first.</div>';
            return;
        }

        jobs.forEach((job, index) => {
            const jobId = job.id;
            const jobNum = index + 1;
            const width = parseFloat(document.getElementById(`width-${jobNum}`).value);
            const height = parseFloat(document.getElementById(`height-${jobNum}`).value);

            if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
                perJobResults.innerHTML += <div class="small muted"><strong>Window ${jobNum}:</strong> Invalid dimensions.</div>;
                return;
            }

            const stileHeight = FORMULAS.slidingPanel.verticalStiles(height);
            const railWidth = FORMULAS.slidingPanel.horizontalRails(width);
            const gHeight = FORMULAS.glass.glassHeight(stileHeight);
            const gWidth = FORMULAS.glass.glassWidth(railWidth);

            const resultHtml = `
                <div class="result-card" style="margin-bottom: 8px;">
                    <div class="panel-title">Results for Window ${jobNum} (W:${width} x H:${height})</div>
                    <hr style="border-color: rgba(255,255,255,0.05);">
                    <strong>Outer Frame:</strong>
                    <div>Top/Bottom Track: ${FORMULAS.outerFrame.topBottomTrack(width).toFixed(2)} mm (x2)</div>
                    <div>Side Jambs: ${FORMULAS.outerFrame.sideJambs(height).toFixed(2)} mm (x2)</div>
                    <br>
                    <strong>Sliding Panels:</strong>
                    <div>Vertical Stiles: ${stileHeight.toFixed(2)} mm (x4)</div>
                    <div>Horizontal Rails: ${railWidth.toFixed(2)} mm (x4)</div>
                    <br>
                    <strong>Glass Cut Size:</strong>
                    <div>${gWidth.toFixed(2)} mm (Width) x ${gHeight.toFixed(2)} mm (Height) (x2 pieces)</div>
                </div>
            `;
            perJobResults.innerHTML += resultHtml;
        });

        stockResults.innerHTML = '<div class="small muted">Total stock calculations will be developed next.</div>';
    });
});