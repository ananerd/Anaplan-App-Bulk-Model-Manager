# Anaplan Apps - Bulk Model Manager

## 🚀 Overview
The Bulk Model Manager is a utility designed to simplify and expedite the process of remapping app pages across different workspaces and models in Anaplan apps. Whether you're moving from Development to Test, Test to Production, or any other custom scenario, this script makes the task seamless and efficient.

---

## 🧰 Features
- **Dynamic Mapping:** Select from predefined remapping scenarios like Dev to Test or Test to Prod, or customize the mappings to suit your needs.
- **Automated Input Update:** Efficiently locates and updates input fields, dropdowns, and comboboxes within an iframe.
- **Customizable:** Modify workspace and model mappings directly in the script to align with your app's setup.
- **Developer Tool-Friendly:** Runs in the browser's Developer Tools console for quick execution.

---

## 📝 How It Works

### 1. Setup Replacement Types:
The script uses two predefined mappings (`type1Replacements` and `type2Replacements`) as examples. Customize these mappings to reflect your workspace and model relationships:

```javascript
const type1Replacements = [
    { oldValue: "WorkspaceA1", newValue: "WorkspaceB1" },
    { oldValue: "ModelA1", newValue: "ModelB1" },
];
const type2Replacements = [
    { oldValue: "WorkspaceC1", newValue: "WorkspaceCD" },
    { oldValue: "ModelC1", newValue: "ModelD1" },
];
```

### 2. Run the Script:

1. Open the browser's Developer Tools (`F12` or `right-click > Inspect > Console`).
2. Paste and execute the script in the section of Developer Tools appropriate for your browser ('snippets' for Chrome).
3. When prompted, choose the replacement type (e.g., Dev to Test or Test to Prod).

---

### 3. Script Execution:

- The script identifies relevant input fields within the iframe of the app's **Manage Models** screen.
- It applies the defined mappings, updating workspace and model names as needed.

---

### 4. Result:

- The remapped configurations are immediately applied, saving time and ensuring consistency across app pages.

---

## ⚙️ Script Details

### Input Selection

The script identifies and processes:
- Standard `<input>` fields
- Elements with `role="combobox"`
- Custom dropdowns and selectors (e.g., `.dropdown`, `.custom-select`)

---

## 🌟 Why Use This?

### Efficiency
Manually remapping dozens or hundreds of app pages can be tedious and error-prone. This script automates the process, reducing effort and potential mistakes.

### Flexibility
Customizable mappings make this utility adaptable for various remapping scenarios, ensuring it fits seamlessly into your workflow.

### Convenience
No need to install additional tools—just copy, paste, and execute directly in your browser.

---

## 📌 Requirements

- **Browser:** Modern browser with Developer Tools (e.g., Chrome, Edge, Firefox).
- **Access:** Ensure you have appropriate roles and permissions to remap the app using your intended models.
- **Preparation:** Update the predefined mapping values (`oldValue`, `newValue`) in the script to align with your specific use case.

---

## 🎉 Get Started

1. Copy the script.
2. Open your Anaplan app's **Manage Models** screen.
3. Open the browser's Developer Tools console.
4. Paste the script where appropriate for your browser and run the script from your browser.
5. Follow the on-screen prompt to select your mapping type.

---

Happy Anaplan-ing! 🎉
