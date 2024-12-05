// Anaplan Apps - Bulk Model Manager
// Conveniently and efficiently remap all app pages amongst your desired workspaces and models when using the Manage Models screen of your app.


(() => {
    // Prompt user to select Type 1 or Type 2 replacements. They are marked Dev to Test and Test to Prod, but could be whatever use you'd like. In the defined values below, the example is an app using two workspace/model sources.
    const replacementType = prompt("Enter replacement type: 'Dev to Test' or 'Test to Prod'", "Dev to Test");

    if (!replacementType || (replacementType !== 'Dev to Test' && replacementType !== 'Test to Prod')) {
        console.log("Please enter a valid replacement type: 'Dev to Test' or 'Test to Prod'.");
        return;
    }

    // Pre-defined value pairs for replacements. Replace 
    const type1Replacements = [
        { oldValue: "WorkspaceA1", newValue: "WorkspaceB1" },
        { oldValue: "ModelA1", newValue: "ModelB1" },
        { oldValue: "WorkspaceA2", newValue: "WorkspaceB2" },
        { oldValue: "ModelA2", newValue: "ModelB2" }
    ];

    const type2Replacements = [
        { oldValue: "WorkspaceC1", newValue: "WorkspaceCD" },
        { oldValue: "ModelC1", newValue: "ModelD1" },
        { oldValue: "WorkspaceC1", newValue: "WorkspaceD1" },
        { oldValue: "ModelC2", newValue: "ModelD2" }
    ];

    // Select appropriate replacements based on the user's choice
    const replacements = replacementType === 'Dev to Test' ? type1Replacements : type2Replacements;

    // Attempt to locate the iframe first
    const iframe = document.querySelector('iframe');

    if (!iframe) {
        console.log("No iframe found on the page.");
        return;
    }

    // Make sure iframe content is accessible
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    if (!iframeDocument) {
        console.log("Unable to access iframe document.");
        return;
    }

    // Find all input elements within the iframe
    const inputElements = iframeDocument.querySelectorAll("input, [role='combobox'], .dropdown, .custom-select");

    if (inputElements.length === 0) {
        console.log("No input or dropdown elements found inside the iframe.");
        return;
    }

    inputElements.forEach((input) => {
        // Ensure we're dealing with a proper input element
        if (input.tagName === 'INPUT' || input.getAttribute('role') === 'combobox' || input.classList.contains('dropdown') || input.classList.contains('custom-select')) {
            // Iterate through the replacements to find matches based on the chosen replacements.
            let valueChanged = false;
            replacements.forEach(({ oldValue, newValue }) => {
                if (input.value === oldValue) {
                    input.value = newValue;
                    valueChanged = true;
                }
            });
            if (valueChanged) {
                console.log(`Input updated: ${input.name || input.id || 'unnamed input element'}`);
            }
        }
    });

    console.log(`All inputs within the iframe have been updated according to '${replacementType}' mapping.`);
})();
