function createContainer(name) {
    const container = document.getElementById('system-info');
    container.style.padding = '0.4em';

    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.innerHTML = name;

    const childElement = document.createElement('div');
    childElement.id = name;
    childElement.style.margin = '0 0.4em';
    childElement.style.fontSize = '1.1em';
    childElement.style.width = '90%';
    childElement.style.overflowY = 'scroll';

    container.appendChild(fieldset);
    fieldset.appendChild(legend);
    fieldset.appendChild(childElement);
}

function iterateOverObject(obj, formatter) {

    let result = '';

    const keys = Object.keys(obj);
    for (let i = 0, end = keys.length; i < end; i++) {
        const keyName = keys[i];
        let value = obj[keyName];
        if (!Array.isArray(value) && isFinite(value)) {
            value = formatNum(value);
        }
        let idStr = '';
        if (formatter) {
            idStr = formatter(keyName, value);
        } else if (keyName === 'processors' ) {
            idStr = ' id="' + keyName + '"';
        } else if ( keyName === 'temperatures' ) {
            idStr = ' id="' + keyName + '"';
            for ( let j = 0, jend = value.length; j<jend; j++ ) { 
                value[j] = Math.floor( ( value[j] * 1.8 ) + 32 );
            }
        }
        const displayName = (NAME_LIST[keyName] ? NAME_LIST[keyName] : keyName);
        result += `<div${idStr}>${displayName}: ${JSON.stringify(value)}</div>`;
    }
    return result;
}

function formatNum(n, nSize) {
    let nn = n,
        ns = nSize;
    if (`${nn}`.length > 3) {
        nn = parseInt(nn / 1000);
        if (typeof ns === 'undefined') {
            ns = -1;
        }
        ns++;
        return formatNum(nn, ns);
    }
    return `${nn}${(ns ? sizeNames[ns] : '')}`;
}

function calculatePercent(x, total) {
    let result = x;
    if (total !== 0) {
        result = Math.ceil((x / total) * 100);
    }
    return result;
}
