// Access the iframe document and get references
var ManageModelsIframe = window.frames[0].document;
var siteorigin = window.location.origin;

// Select the data table and validate its presence
var dataTable = ManageModelsIframe.querySelector('[data-test-id=manage-models-modal-data-table]');
if (!dataTable || !dataTable.firstElementChild) throw new Error("Data table not found or malformed");

var tablerows = dataTable.firstElementChild.querySelectorAll(':scope > tr');
var customerID;
var workspaces;
var models = [];
var pages = [];
var jsonpoints = [];

// Display a loading overlay with spinner
var loadingElement = document.createElement("div");
loadingElement.innerHTML = `
  <div style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; background: rgba(255,255,255,0.8); position: absolute; top: 0; left: 0; z-index: 9999;">
    <div style="border: 6px solid #f3f3f3; border-top: 6px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-right: 12px;"></div>
    <p style="font-size: 18px; color: #333;">Loading, please wait...</p>
  </div>
  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>`;
loadingElement.style.position = "absolute";
loadingElement.style.top = 0;
loadingElement.style.left = 0;
loadingElement.style.zIndex = 9999;
loadingElement.style.display = "flex";
loadingElement.style.height = "100%";
loadingElement.style.width = "100%";
dataTable.style.display = "none";
dataTable.parentNode.prepend(loadingElement);

// Group rows by unique second column value
for (let i = 0; i < tablerows.length; i++) {
    let founditem = false;
    for (let n = 0; n < pages.length; n++) {
        if (pages[n][0] === tablerows[i].children[1].innerText) {
            pages[n][2] += "|_|" + tablerows[i].getAttribute('data-test-id');
            pages[n][3] += "|_|" + tablerows[i].children[0].innerText;
            founditem = true;
        }
    }
    if (!founditem) {
        pages.push([
            tablerows[i].children[1].innerText,
            i,
            tablerows[i].getAttribute('data-test-id'),
            tablerows[i].children[0].innerText
        ]);
    }
}

// Fetch customer and workspace data
var temp = await fetch(siteorigin + "/a/springboard-platform-gateway-service/token/validate").then(res => res.json());
customerID = temp['userInfo']['customerGuid'];
workspaces = await fetch(siteorigin + "/a/springboard-platform-gateway-service/customers/" + customerID + "/workspaces").then(res => res.json());

// Fetch models for each workspace
await Promise.all(workspaces.map(async (workspace, index) => {
    models[index] = await fetch(`${siteorigin}/a/springboard-platform-gateway-service/customers/${customerID}/workspaces/${workspace['WorkspaceGuid']}/models`).then(res => res.json());
}));

// Update UI and set attributes for rows to be kept
for (let i = 0; i < pages.length; i++) {
    tablerows[pages[i][1]].setAttribute('Keep-Element', 'true');
    const cell = tablerows[pages[i][1]].firstElementChild;
    if (cell.firstElementChild) cell.firstElementChild.remove();
    for (const n of pages[i][3].split("|_|") ) {
        cell.innerHTML += `<p>${n}</p>`;
    }
    pages[i][1] = i;
}

// Remove all rows not marked to keep
for (let i = 0; i < tablerows.length; i++) {
    if (!tablerows[i].hasAttribute('Keep-Element')) {
        tablerows[i].remove();
    }
}

if (!dataTable.firstElementChild) throw new Error("Data table content missing after cleanup");
tablerows = dataTable.firstElementChild.querySelectorAll(':scope > tr');

// Add Change All button
ManageModelsIframe.querySelector('[data-test-id=manage-models-modal-change-action]').parentNode.innerHTML = '<button data-test-id=change-all>Change All</button>';
var newchangebutton = ManageModelsIframe.querySelector('[data-test-id=change-all]');

// Change All logic
newchangebutton.onclick = async function() {
    dataTable.style.display = "none";
    dataTable.parentNode.prepend(loadingElement);

    for (let i = 0; i < pages.length; i++) {
        let repointworkspace = tablerows[i].querySelector('[data-test-id=single-workspace-cell] input').value;
        let repointmodel = tablerows[i].querySelector('[data-test-id=single-model-cell] input').value;

        for (let n = 0; n < workspaces.length; n++) {
            if (repointworkspace === workspaces[n]['Name']) {
                repointworkspace = workspaces[n]['WorkspaceGuid'];
                for (let x = 0; x < models[n].length; x++) {
                    if (repointmodel === models[n][x]['Name']) {
                        repointmodel = models[n][x]['ModelGuid'];
                        break;
                    }
                }
                break;
            }
        }

        for (const n of pages[i][2].split("|_|") ) {
            jsonpoints.push({
                pageGuid: n,
                modelId: repointmodel,
                workspaceId: repointworkspace
            });
        }
    }

    await fetch(`${siteorigin}/a/springboard-definition-service/repoint-pages`, {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({ repointPageDtos: jsonpoints })
    });

    ManageModelsIframe.querySelector('[data-test-id=manage-models-modal-close-button]').click();

    const waitForElement = (selector) => {
        return new Promise((resolve) => {
            const checkExist = setInterval(() => {
                const el = ManageModelsIframe.querySelector(selector);
                if (el) {
                    clearInterval(checkExist);
                    resolve(el);
                }
            }, 50);
        });
    };

    const dropdownTrigger = await waitForElement('[data-test-id=app-properties-dropdown-menu-trigger]');
    dropdownTrigger.click();

    const manageModelsOption = await waitForElement('[data-test-id=dropdown-menu-option-manage-models]');
    manageModelsOption.click();
};

// Final UI display update
dataTable.style.display = "flex";
loadingElement.remove();
