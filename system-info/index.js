const containers = ['cpu', 'memory', 'storage', 'display', 'network'],
    containerInfoMethod = ['getInfo', 'getInfo', 'getInfo', 'getInfo', 'getNetworkInterfaces'],
    sizeNames = ['K', 'M', 'G', 'T'];

const NAME_LIST = {
    'name': 'Name',
    'availableCapacity': 'Free',
    'capacity': 'Total',
    'archName': 'Architecture Name',
    'modelName': 'Model',
    'numOfProcessors': 'Processor Count',
    'type': 'Type'
};

const workerPath = chrome.runtime.getURL('timer.js');
//console.log(workerPath);
const workerThread = new Worker(workerPath);

let lastProcessorData;

function manageWorker() {
    workerThread.postMessage({
        'callMeBack': 1000
    });
}

workerThread.onmessage = (e) => {
    chrome.system.cpu.getInfo(data => {
        const processors = document.getElementById('processors'),
            temperatures = document.getElementById('temperatures');
        
        const originalData = JSON.stringify([].concat(data.processors));

        let i = 0;
        let results = lastProcessorData.map( lastUsage => {
            const idle = (data.processors[i].usage.idle - lastUsage.usage.idle),
                total = (data.processors[i].usage.total - lastUsage.usage.total),
                user = (data.processors[i].usage.user - lastUsage.usage.user),
                kernel = (data.processors[i].usage.kernel - lastUsage.usage.kernel);
            const usage = getUsage(user, kernel, total).usage;
            i++;
            return usage; 
        });
        
        processors.innerHTML = 'processors: ' + JSON.stringify(results);
        lastProcessorData = JSON.parse(originalData);

        results = [];
        for (let j = 0, jend = data.temperatures.length; j < jend; j++) {
            results.push(Math.floor((data.temperatures[j] * 1.8) + 32));
        }
        temperatures.innerHTML = 'temperatures: ' + JSON.stringify(results);
        manageWorker();
    });
}


function getStats() {
    containers.forEach((component, index) => {

        methodCall = containerInfoMethod[index];
        chrome.system[component][methodCall](data => {
            const originalData = JSON.stringify([].concat(data.processors));
            updateDisplay(component, data);
            if (component === 'cpu') {
                lastProcessorData = JSON.parse(originalData);
                manageWorker();
            }
        });
    });
}

window.onresize = function() {
    const mainComponent = document.getElementById('system-info');
    mainComponent.style.height = window.innerHeight - 50 + 'px';
};

window.onload = function() {
    const mainComponent = document.getElementById('system-info');
    mainComponent.style.height = window.innerHeight - 50 + 'px';

    containers.forEach(name => {
        createContainer(name)
    });
    getStats();
};
