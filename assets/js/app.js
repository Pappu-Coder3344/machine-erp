document.addEventListener("DOMContentLoaded", function () {
  const storageKey = "lmlCurrentUser";
  const machineCodeStorageKey = "lmlMachineCodeRegistry";
  const machineCodeNumberLength = 4;
  const data = window.LMLData || null;
  const helpers = data ? data.helpers : null;
  const layout = window.LMLLayout || null;
  const prototypeActions = window.LMLPrototypeActions || null;
  const decoratePrototypeActions = prototypeActions && typeof prototypeActions.decorateActionElements === "function"
    ? prototypeActions.decorateActionElements
    : function () {};
  const body = document.body;
  const isLoginPage = body.classList.contains("login-page");
  const currentFileName = layout ? layout.getCurrentFileName() : "dashboard.html";
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const loginForm = document.getElementById("loginForm");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const loginAlert = document.getElementById("loginAlert");
  const userIdInput = document.getElementById("userId");
  const userRoleSelect = document.getElementById("userRole");
  const demoRoleButtons = document.querySelectorAll(".demo-role-btn");
  const currentDateLabel = document.getElementById("currentDateLabel");
  const machineForm = document.getElementById("machineForm");
  const complaintDateInput = document.getElementById("complaintDate");
  const complaintTimeInput = document.getElementById("complaintTime");
  const machineCodeInput = document.getElementById("machineCode");
  const generateMachineCodeButton = document.getElementById("generateMachineCode");
  const machineCodeAlert = document.getElementById("machineCodeAlert");
  const machineRecordBadge = document.getElementById("machineRecordBadge");
  const machineTypeInput = document.getElementById("machineType");
  const ownershipTypeSelect = document.getElementById("ownershipType");
  const raisedByInput = document.getElementById("raisedBy");
  const raisedRoleSelect = document.getElementById("raisedRole");
  const raisedRoleValueInput = document.getElementById("raisedRoleValue");
  const problemTypeSelect = document.getElementById("problemType");
  const problemDetailsInput = document.getElementById("problemDetails");
  const factoryUnitSelect = document.getElementById("factoryUnit");
  const shiftSelect = document.getElementById("shift");

  const demoUserNames = (data && data.users ? data.users : []).reduce(function (accumulator, user) {
    accumulator[user.id] = user.name;
    return accumulator;
  }, {
    "admin.lml": "Mahmud Hasan",
    "mhead01": "Jahidul Islam",
    "sup.line03": "Rahima Begum",
    "tech.rana": "Sohel Rana",
    "prod.user01": "Salma Akter",
    "store.user": "Nasima Akter"
  });

  const problemDetailsMap = {
    "Thread cutter not working": "Operator reported that thread cutter is not cutting properly. Machine is still running but output is slowing down and thread trimming is not consistent.",
    "Needle break repeat issue": "Needle is breaking repeatedly during operation. Operator stopped work and needs urgent checking of needle setting and thread path.",
    "Looper issue, thread break": "Thread is breaking frequently and looper movement appears abnormal. Production on this machine is interrupted.",
    "Needle bar setting problem": "Needle bar setting appears incorrect and stitch quality is not acceptable. Technician checking and trial run required.",
    "Fabric feeding uneven": "Fabric is not feeding evenly and seam quality is affected. Operator cannot continue standard production speed.",
    "Motor noise and overheating": "Motor is producing abnormal sound and overheating after short use. Machine should be checked before next operation cycle.",
    "Button hole alignment issue": "Button hole alignment is off position and garment quality is affected. Machine setting needs immediate checking.",
    "Cutter knife damage": "Knife edge appears damaged and cutting performance is not proper. Spare parts review may be required."
  };

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (character) {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return map[character] || character;
    });
  }

  function formatDisplayName(userId) {
    return userId
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
      })
      .trim();
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function normalizeMachineCode(value) {
    return (value || "")
      .trim()
      .toUpperCase();
  }

  function getMachineCodePattern(prefix) {
    return new RegExp("^" + prefix + "-\\d{" + machineCodeNumberLength + "}$");
  }

  function isValidMachineCodeFormat(machineCode, prefix) {
    return getMachineCodePattern(prefix).test(normalizeMachineCode(machineCode));
  }

  function loadMachineCodeRegistry() {
    try {
      const storedValue = localStorage.getItem(machineCodeStorageKey);
      const parsedValue = storedValue ? JSON.parse(storedValue) : [];
      return Array.isArray(parsedValue) ? parsedValue : [];
    } catch (error) {
      return [];
    }
  }

  function getDefaultMachineCodes() {
    if (!data) {
      return [];
    }

    return data.machines.map(function (machine) {
      return machine.id;
    });
  }

  function getAllMachineCodes() {
    const mergedCodes = getDefaultMachineCodes().concat(loadMachineCodeRegistry());
    return Array.from(new Set(
      mergedCodes
        .map(normalizeMachineCode)
        .filter(Boolean)
    ));
  }

  function saveMachineCodeRegistry(machineCode) {
    const normalizedCode = normalizeMachineCode(machineCode);
    if (!normalizedCode) {
      return;
    }

    const isValidOwnCode = isValidMachineCodeFormat(normalizedCode, "MC");
    const isValidRentCode = isValidMachineCodeFormat(normalizedCode, "RM");
    if (!isValidOwnCode && !isValidRentCode) {
      return;
    }

    const storedCodes = loadMachineCodeRegistry()
      .map(normalizeMachineCode)
      .filter(Boolean);

    if (!storedCodes.includes(normalizedCode)) {
      storedCodes.push(normalizedCode);
      localStorage.setItem(machineCodeStorageKey, JSON.stringify(storedCodes));
    }
  }

  function getCurrentMachineCode() {
    if (!machineForm) {
      return "";
    }

    return normalizeMachineCode(machineForm.getAttribute("data-current-machine-code"));
  }

  function getMachineFormMode() {
    if (!machineForm) {
      return "";
    }

    return machineForm.getAttribute("data-machine-form-mode") || "";
  }

  function getExpectedMachinePrefix() {
    return ownershipTypeSelect && ownershipTypeSelect.value === "Rent" ? "RM" : "MC";
  }

  function setMachineCodeMessage(message, state) {
    if (!machineCodeAlert) {
      return;
    }

    machineCodeAlert.className = "form-text";

    if (!message) {
      machineCodeAlert.textContent = "";
      machineCodeAlert.classList.add("d-none");
      return;
    }

    machineCodeAlert.textContent = message;
    machineCodeAlert.classList.remove("d-none");

    if (state === "error") {
      machineCodeAlert.classList.add("text-danger");
    } else if (state === "success") {
      machineCodeAlert.classList.add("text-success");
    } else if (state === "info") {
      machineCodeAlert.classList.add("text-primary");
    }
  }

  function updateMachineRecordBadge() {
    if (!machineRecordBadge || !machineCodeInput) {
      return;
    }

    const machineCode = normalizeMachineCode(machineCodeInput.value) || "NEW";
    machineRecordBadge.textContent = "Record ID: " + machineCode;
  }

  function isDuplicateMachineCode(machineCode) {
    const normalizedCode = normalizeMachineCode(machineCode);
    const currentMachineCode = getCurrentMachineCode();

    return getAllMachineCodes().some(function (existingCode) {
      return existingCode === normalizedCode && existingCode !== currentMachineCode;
    });
  }

  function getNextMachineCode(prefix) {
    const codePattern = new RegExp("^" + prefix + "-(\\d{" + machineCodeNumberLength + "})$");
    let highestNumber = prefix === "RM" ? 2000 : 1000;

    getAllMachineCodes().forEach(function (machineCode) {
      const matches = machineCode.match(codePattern);
      if (matches) {
        highestNumber = Math.max(highestNumber, Number(matches[1]));
      }
    });

    return prefix + "-" + String(highestNumber + 1).padStart(4, "0");
  }

  function generateMachineCode(showSuccessMessage) {
    if (!machineCodeInput) {
      return;
    }

    const generatedCode = getNextMachineCode(getExpectedMachinePrefix());
    machineCodeInput.value = generatedCode;
    validateMachineCode(showSuccessMessage);
  }

  function validateMachineCode(showSuccessMessage) {
    if (!machineForm || !machineCodeInput) {
      return true;
    }

    const machineCode = normalizeMachineCode(machineCodeInput.value);
    const expectedPrefix = getExpectedMachinePrefix();

    machineCodeInput.value = machineCode;
    updateMachineRecordBadge();

    if (!machineCode) {
      machineCodeInput.setCustomValidity("Machine code is required.");
      setMachineCodeMessage("Click Generate Unique Code to create a machine code.", "error");
      return false;
    }

    if (!isValidMachineCodeFormat(machineCode, expectedPrefix)) {
      machineCodeInput.setCustomValidity("Machine code prefix mismatch.");
      setMachineCodeMessage(
        expectedPrefix === "MC"
          ? "Own machines must use the format MC-1001 with exactly 4 digits."
          : "Rent machines must use the format RM-2001 with exactly 4 digits.",
        "error"
      );
      return false;
    }

    if (isDuplicateMachineCode(machineCode)) {
      machineCodeInput.setCustomValidity("Machine code already exists.");
      setMachineCodeMessage("This machine code already exists. Please enter a different code.", "error");
      return false;
    }

    machineCodeInput.setCustomValidity("");
    setMachineCodeMessage("", "");
    return true;
  }

  function saveCurrentUser() {
    if (!userIdInput || !userRoleSelect) {
      return;
    }

    const userId = userIdInput.value.trim();
    const role = userRoleSelect.value;
    const displayName = demoUserNames[userId] || formatDisplayName(userId || "Production User");
    const userProfile = {
      userId: userId,
      role: role,
      displayName: displayName,
      unit: factoryUnitSelect ? factoryUnitSelect.value : "",
      shift: shiftSelect ? shiftSelect.value : ""
    };

    localStorage.setItem(storageKey, JSON.stringify(userProfile));
  }

  function loadCurrentUser() {
    try {
      const storedValue = localStorage.getItem(storageKey);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      return null;
    }
  }

  function getUserByRole(role) {
    if (!data || !data.users) {
      return null;
    }

    return data.users.find(function (user) {
      return user.role === role;
    }) || null;
  }

  function getDefaultCurrentUser() {
    const pageRoleDefaults = data && data.pageRoleDefaults ? data.pageRoleDefaults : {};
    const defaultRole = pageRoleDefaults[currentFileName] || "Maintenance Head";
    const defaultUser = getUserByRole(defaultRole) || getUserByRole("Maintenance Head") || getUserByRole("Admin");

    if (!defaultUser) {
      return {
        userId: "demo.user",
        role: defaultRole,
        displayName: defaultRole,
        approvalLevel: "Prototype"
      };
    }

    return {
      userId: defaultUser.id,
      role: defaultUser.role,
      displayName: defaultUser.name,
      approvalLevel: defaultUser.approvalLevel || "Prototype"
    };
  }

  function getEffectiveCurrentUser() {
    const storedUser = loadCurrentUser();
    if (storedUser && storedUser.role) {
      return storedUser;
    }

    return getDefaultCurrentUser();
  }

  function getCurrentRoleProfile() {
    if (!data || !data.roleProfiles) {
      return null;
    }

    const currentUser = getEffectiveCurrentUser();
    return data.roleProfiles[currentUser.role] || null;
  }

  function getWorkflowBlueprint(moduleName) {
    if (!data || !data.workflowBlueprints) {
      return null;
    }

    return data.workflowBlueprints[moduleName] || null;
  }

  function getApprovalItems(referenceId, moduleName) {
    if (!data || !data.approvalQueue) {
      return [];
    }

    return data.approvalQueue.filter(function (item) {
      const isReferenceMatch = referenceId ? item.referenceId === referenceId : true;
      const isModuleMatch = moduleName ? item.module === moduleName : true;
      return isReferenceMatch && isModuleMatch;
    });
  }

  function setCurrentDateTime() {
    const now = new Date();

    if (complaintDateInput && !complaintDateInput.value) {
      complaintDateInput.value = now.toISOString().split("T")[0];
    }

    if (complaintTimeInput && !complaintTimeInput.value) {
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      complaintTimeInput.value = hours + ":" + minutes;
    }
  }

  function syncMachineType() {
    if (!machineCodeInput || !machineTypeInput || !data) {
      return;
    }

    const selectedMachine = helpers.getMachine(normalizeMachineCode(machineCodeInput.value));
    if (selectedMachine) {
      machineTypeInput.value = selectedMachine.type;
    }
  }

  function syncProblemDetails() {
    if (!problemTypeSelect || !problemDetailsInput) {
      return;
    }

    const selectedProblem = problemTypeSelect.value;
    if (selectedProblem && problemDetailsMap[selectedProblem]) {
      problemDetailsInput.value = problemDetailsMap[selectedProblem];
    }
  }

  function fillComplaintUserInfo() {
    const currentUser = getEffectiveCurrentUser();
    const fallbackUser = {
      displayName: currentUser.displayName || "Sabina Yasmin",
      role: currentUser.role || "Production User"
    };

    if (raisedByInput) {
      raisedByInput.value = currentUser.displayName || fallbackUser.displayName;
    }

    if (raisedRoleSelect) {
      raisedRoleSelect.value = currentUser.role || fallbackUser.role;
    }

    if (raisedRoleValueInput) {
      raisedRoleValueInput.value = currentUser.role || fallbackUser.role;
    }
  }

  function closeSidebar() {
    if (layout && typeof layout.closeSidebar === "function") {
      layout.closeSidebar();
      return;
    }

    body.classList.remove("sidebar-open");

    if (document.getElementById("sidebar")) {
      document.getElementById("sidebar").classList.remove("is-open");
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.classList.remove("is-visible");
    }

    if (sidebarToggle) {
      sidebarToggle.setAttribute("aria-expanded", "false");
    }
  }

  function populateDataList(datalistId, options) {
    const datalist = document.getElementById(datalistId);
    if (!datalist) {
      return;
    }

    datalist.innerHTML = options.join("");
  }

  function populateSelect(selectId, optionItems, preserveFirstLabel) {
    const select = document.getElementById(selectId);
    if (!select) {
      return;
    }

    const previousValue = select.value;
    const firstOption = select.options.length > 0 ? select.options[0] : null;
    const firstLabel = preserveFirstLabel || (firstOption ? firstOption.textContent : "");
    const markup = ['<option selected>' + escapeHtml(firstLabel) + "</option>"].concat(optionItems).join("");
    select.innerHTML = markup;

    if (previousValue && Array.from(select.options).some(function (option) { return option.value === previousValue || option.textContent === previousValue; })) {
      select.value = previousValue;
    }
  }

  function populateSharedLookups() {
    if (!data) {
      return;
    }

    const machineOptions = data.machines.map(function (machine) {
      return '<option value="' + escapeHtml(machine.id) + '" data-machine-type="' + escapeHtml(machine.type) + '"></option>';
    });
    const machineTypeOptions = Array.from(new Set(data.machines.map(function (machine) {
      return machine.type;
    }))).map(function (type) {
      return '<option value="' + escapeHtml(type) + '"></option>';
    });

    populateDataList("machineCodeOptions", machineOptions);
    populateDataList("allocationMachineOptions", machineOptions);
    populateDataList("requestMachineOptions", machineOptions);
    populateDataList("machineTypeOptions", machineTypeOptions);

    populateSelect("rentVendor", data.vendors.map(function (vendor) {
      return '<option>' + escapeHtml(vendor.name) + "</option>";
    }), "All Vendors");

    populateSelect("agreementVendor", data.vendors.map(function (vendor) {
      return '<option>' + escapeHtml(vendor.name) + "</option>";
    }), "All Vendors");

    populateSelect("rentAgreement", data.agreements.map(function (agreement) {
      return '<option>' + escapeHtml(agreement.id) + "</option>";
    }), "All Agreements");

    populateSelect("pmLocation", data.lines.map(function (line) {
      return '<option>' + escapeHtml(line.line) + "</option>";
    }), "All Locations");

    populateSelect("ticketFloor", data.lines.map(function (line) {
      return '<option>' + escapeHtml(line.line) + "</option>";
    }), "All Locations");

    populateSelect("rentLocation", data.lines.map(function (line) {
      return '<option>' + escapeHtml(line.line) + "</option>";
    }), "All Locations");

    populateSelect("ticketTechnician", data.users.filter(function (user) {
      return user.role === "Technician";
    }).map(function (user) {
      return '<option>' + escapeHtml(user.name) + "</option>";
    }), "All Technicians");

    [
      { id: "flowVendor", label: "All Vendors" },
      { id: "requestVendor", label: "Select Vendor" },
      { id: "relatedVendor", label: "Not Applicable" },
      { id: "rentReportVendor", label: "All Vendors" }
    ].forEach(function (config) {
      populateSelect(config.id, data.vendors.map(function (vendor) {
        return '<option>' + escapeHtml(vendor.name) + "</option>";
      }), config.label);
    });

    [
      { id: "flowAgreement", label: "All Agreements" },
      { id: "requestAgreement", label: "Select Agreement" }
    ].forEach(function (config) {
      populateSelect(config.id, data.agreements.map(function (agreement) {
        return '<option>' + escapeHtml(agreement.id) + "</option>";
      }), config.label);
    });

    [
      { id: "assignedTechnician", label: "Select technician" },
      { id: "updateTechnician", label: "Select technician" },
      { id: "taskTechnician", label: "All Technicians" }
    ].forEach(function (config) {
      populateSelect(config.id, data.users.filter(function (user) {
        return user.role === "Technician";
      }).map(function (user) {
        return '<option>' + escapeHtml(user.name) + "</option>";
      }), config.label);
    });

    [
      { id: "taskArea", label: "All Locations" },
      { id: "rentReportArea", label: "All Locations" }
    ].forEach(function (config) {
      populateSelect(config.id, data.lines.map(function (line) {
        return '<option>' + escapeHtml(line.line) + "</option>";
      }), config.label);
    });
  }

  function setupMachineForm() {
    if (!machineForm || !machineCodeInput || !ownershipTypeSelect) {
      return;
    }

    machineCodeInput.readOnly = true;
    updateMachineRecordBadge();
    setMachineCodeMessage("", "");

    if (getMachineFormMode() === "registration") {
      generateMachineCode(false);

      ownershipTypeSelect.addEventListener("change", function () {
        generateMachineCode(false);
      });
    } else {
      validateMachineCode(false);
    }

    if (generateMachineCodeButton) {
      generateMachineCodeButton.addEventListener("click", function () {
        generateMachineCode(true);
      });
    }

    machineForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validateMachineCode(true)) {
        machineCodeInput.reportValidity();
        return;
      }

      const savedMachineCode = normalizeMachineCode(machineCodeInput.value);
      saveMachineCodeRegistry(savedMachineCode);
      machineForm.setAttribute("data-current-machine-code", savedMachineCode);
      updateMachineRecordBadge();

      if (prototypeActions) {
        prototypeActions.showToast("Machine record saved with centralized mock data rules.", "success");
      }
    });
  }

  function findCardByTitle(title) {
    const cards = document.querySelectorAll(".erp-card");
    return Array.from(cards).find(function (card) {
      const titleElement = card.querySelector(".section-title");
      return titleElement && titleElement.textContent.trim() === title;
    }) || null;
  }

  function updateCardSectionText(cardTitle, text) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const textElement = card.querySelector(".section-text");
    if (textElement) {
      textElement.textContent = text;
    }
  }

  function updateCardSectionTitle(cardTitle, text) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const titleElement = card.querySelector(".section-title");
    if (titleElement) {
      titleElement.textContent = text;
    }
  }

  function updateHeaderActions(labels) {
    const headerActions = document.querySelector(".header-actions");
    if (!headerActions || !labels || !labels.length) {
      return;
    }

    const actionButtons = Array.from(headerActions.children).filter(function (element) {
      return element.matches(".btn, a.btn");
    });
    labels.forEach(function (label, index) {
      if (actionButtons[index] && label) {
        actionButtons[index].dataset.prototypeLabel = label;
        actionButtons[index].removeAttribute("data-action");
        actionButtons[index].textContent = label;
      }
    });

    decoratePrototypeActions(headerActions);
  }

  function getRoleUiPolicy(roleName) {
    if (!data || !data.roleUiPolicies) {
      return null;
    }

    return data.roleUiPolicies[roleName] || null;
  }

  function getCurrentRoleUiPolicy() {
    const currentUser = getEffectiveCurrentUser();
    return currentUser && currentUser.role ? getRoleUiPolicy(currentUser.role) : null;
  }

  function isManagementAnalyticsRole(roleName) {
    return ["Production GM", "Operation GM", "IE Manager"].indexOf(roleName) > -1;
  }

  function removeElement(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  function getRoleRedirectPage(fileName) {
    const policy = getCurrentRoleUiPolicy();
    if (!policy || !policy.redirectPages) {
      return "";
    }

    return policy.redirectPages[fileName] || "";
  }

  function redirectRestrictedRolePage() {
    const policy = getCurrentRoleUiPolicy();
    if (!policy) {
      return false;
    }

    const redirectTarget = getRoleRedirectPage(currentFileName);
    if (!redirectTarget || redirectTarget === currentFileName) {
      return false;
    }

    window.location.href = redirectTarget;
    return true;
  }

  function applySafeNavigation(element, href) {
    if (!element || !href) {
      return;
    }

    if (element.tagName === "A") {
      element.setAttribute("href", href);
      return;
    }

    element.onclick = function (event) {
      event.preventDefault();
      window.location.href = href;
    };
  }

  function applyHeaderActionOverride() {
    const policy = getCurrentRoleUiPolicy();
    const headerActions = document.querySelector(".header-actions");
    if (!policy || !policy.headerActions || !headerActions) {
      return;
    }

    const overrideConfig = policy.headerActions[currentFileName];
    if (!overrideConfig || !overrideConfig.length) {
      return;
    }

    const actionButtons = Array.from(headerActions.children).filter(function (element) {
      return element.matches(".btn, a.btn");
    });

    actionButtons.forEach(function (button, index) {
      const config = overrideConfig[index];
      if (!config) {
        removeElement(button);
        return;
      }

      button.dataset.prototypeLabel = config.label;
      button.removeAttribute("data-action");
      button.textContent = config.label;

      if (button.tagName === "A" && !config.href) {
        button.removeAttribute("href");
      }

      if (config.href) {
        applySafeNavigation(button, config.href);
      }
    });

    decoratePrototypeActions(headerActions);
  }

  function setFormReadOnly(formId) {
    const form = document.getElementById(formId);
    if (!form) {
      return;
    }

    form.querySelectorAll("input, select, textarea, button").forEach(function (field) {
      if (field.tagName === "BUTTON") {
        if (field.type === "submit") {
          removeElement(field);
        } else {
          field.disabled = true;
        }
        return;
      }

      if (field.tagName === "SELECT" || field.type === "checkbox" || field.type === "radio") {
        field.disabled = true;
        return;
      }

      field.readOnly = true;
    });
  }

  function isRestrictedReadOnlyAction(element) {
    const policy = getCurrentRoleUiPolicy();
    if (!element || !policy) {
      return false;
    }

    const label = (element.textContent || "").trim().toLowerCase();
    const href = (element.getAttribute("href") || "").toLowerCase();
    const disallowedTextTokens = policy.restrictedActionTextTokens || [];
    const disallowedHrefTokens = policy.restrictedActionHrefTokens || [];

    return disallowedTextTokens.some(function (token) {
      return label.indexOf(token) > -1;
    }) || disallowedHrefTokens.some(function (token) {
      return href.indexOf(token) > -1;
    });
  }

  function applyReadOnlyRoleUiRestrictions() {
    const policy = getCurrentRoleUiPolicy();
    if (!policy) {
      return;
    }

    applyHeaderActionOverride();

    const restrictedSelectors = [
      ".header-actions .btn",
      ".header-actions a.btn",
      ".main-content .table-actions .btn",
      ".main-content .table-actions a",
      ".main-content .section-tools .btn",
      ".main-content .d-grid .btn"
    ].concat(policy.extraRestrictedSelectors || []);

    Array.from(new Set(restrictedSelectors)).forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        if (isRestrictedReadOnlyAction(element)) {
          removeElement(element);
        }
      });
    });

    document.querySelectorAll(".table-actions").forEach(function (wrap) {
      if (wrap.children.length === 0) {
        wrap.innerHTML = '<span class="cell-muted">View only</span>';
      }
    });

    (policy.readOnlyForms || []).forEach(function (formId) {
      setFormReadOnly(formId);
    });

    if (policy.readOnlyNoticePages && policy.readOnlyNoticePages[currentFileName]) {
      updateTopAlertMessage(policy.readOnlyNoticePages[currentFileName], "info");
    }

    if (layout && typeof layout.refreshAdaptiveLayout === "function") {
      layout.refreshAdaptiveLayout();
    }
  }

  function disableFields(fieldIds, disabledState) {
    fieldIds.forEach(function (fieldId) {
      const field = document.getElementById(fieldId);
      if (field) {
        field.disabled = disabledState;
      }
    });
  }

  function markFormReadOnly(fieldIds) {
    fieldIds.forEach(function (fieldId) {
      const field = document.getElementById(fieldId);
      if (!field) {
        return;
      }

      if (field.tagName === "SELECT") {
        field.disabled = true;
      } else {
        field.readOnly = true;
      }
    });
  }

  function updateTopAlertMessage(text, variant) {
    const alertElement = document.querySelector(".main-content .alert");
    const alertStrip = document.querySelector(".main-content .alert-strip");

    if (alertElement) {
      alertElement.className = "alert alert-" + (variant || "info") + " mb-0";
      alertElement.textContent = text;
    }

    if (alertStrip) {
      alertStrip.textContent = text;
    }
  }

  function updateWorkflowFormBadge(cardTitle, label, badgeClass) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const badge = card.querySelector(".section-header .badge");
    if (badge) {
      badge.className = "badge text-bg-" + (badgeClass || "primary");
      badge.textContent = label;
    }
  }

  function renderWorkflowStages(cardTitle, workflowKey, activeStageKey) {
    const workflow = getWorkflowBlueprint(workflowKey);
    if (!workflow) {
      return;
    }

    const activeIndex = workflow.stages.findIndex(function (stage) {
      return stage.key === activeStageKey;
    });

    renderSimpleStack(cardTitle, workflow.stages.map(function (stage, index) {
      const badgeClass = index < activeIndex ? "success" : index === activeIndex ? "primary" : "secondary";
      const value = index < activeIndex ? "Done" : index === activeIndex ? "Current" : "Next";
      return {
        label: stage.label,
        note: stage.owner + " -> " + stage.nextOwner + " | " + stage.note,
        value: value,
        badgeClass: badgeClass
      };
    }));
  }

  function renderSummaryCards(cardData) {
    const summaryCards = document.querySelectorAll(".summary-card");
    cardData.forEach(function (card, index) {
      if (!summaryCards[index]) {
        return;
      }

      summaryCards[index].innerHTML = [
        '<span class="summary-label">' + escapeHtml(card.label) + "</span>",
        '<h3 class="summary-value' + (card.valueClass ? " " + card.valueClass : "") + '">' + escapeHtml(card.value) + "</h3>",
        '<p class="summary-note mb-0">' + escapeHtml(card.note) + "</p>"
      ].join("");
    });
  }

  function renderMiniStatList(cardTitle, items) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const container = card.querySelector(".mini-stat-list");
    if (!container) {
      return;
    }

    container.innerHTML = items.map(function (item) {
      if (item.note) {
        return [
          '<div class="mini-stat-item">',
          "<div>",
          "<strong>" + escapeHtml(item.label) + "</strong>",
          '<div class="cell-muted">' + escapeHtml(item.note) + "</div>",
          "</div>",
          '<span class="badge text-bg-' + escapeHtml(item.badgeClass || "secondary") + '">' + escapeHtml(item.value) + "</span>",
          "</div>"
        ].join("");
      }

      return [
        '<div class="mini-stat-item">',
        "<span>" + escapeHtml(item.label) + "</span>",
        "<strong>" + escapeHtml(item.value) + "</strong>",
        "</div>"
      ].join("");
    }).join("");
  }

  function renderGridStatItems(cardTitle, items) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const row = card.querySelector(".row");
    if (!row) {
      return;
    }

    row.innerHTML = items.map(function (item) {
      return [
        '<div class="col-md-6">',
        '<div class="mini-stat-item">',
        "<div>",
        "<strong>" + escapeHtml(item.label) + "</strong>",
        '<div class="cell-muted">' + escapeHtml(item.note) + "</div>",
        "</div>",
        '<span class="badge text-bg-' + escapeHtml(item.badgeClass || "secondary") + '">' + escapeHtml(item.value) + "</span>",
        "</div>",
        "</div>"
      ].join("");
    }).join("");
  }

  function renderStatusLines(cardTitle, items) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const linesContainer = card.querySelectorAll(".status-line");
    if (!linesContainer.length) {
      return;
    }

    const markup = items.map(function (item) {
      return [
        '<div class="status-line">',
        "<div>",
        "<strong>" + escapeHtml(item.label) + "</strong>",
        '<div class="cell-muted">' + escapeHtml(item.note) + "</div>",
        "</div>",
        '<span class="badge text-bg-' + escapeHtml(item.badgeClass || "secondary") + '">' + escapeHtml(item.value) + "</span>",
        "</div>"
      ].join("");
    }).join("");

    const firstLine = linesContainer[0];
    firstLine.insertAdjacentHTML("beforebegin", markup);
    linesContainer.forEach(function (line) {
      line.remove();
    });
  }

  function renderActivityList(cardTitle, items) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const activityList = card.querySelector(".activity-list");
    if (!activityList) {
      return;
    }

    activityList.innerHTML = items.map(function (item) {
      return [
        '<div class="activity-item">',
        '<div class="activity-dot bg-' + escapeHtml(item.color || "primary") + '"></div>',
        "<div>",
        "<strong>" + escapeHtml(item.title) + "</strong>",
        '<p class="mb-0">' + escapeHtml(item.note) + "</p>",
        "</div>",
        '<span class="activity-time">' + escapeHtml(item.time) + "</span>",
        "</div>"
      ].join("");
    }).join("");
  }

  function renderTable(cardTitle, rowMarkup) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const tbody = card.querySelector("tbody");
    if (!tbody) {
      return;
    }

    tbody.innerHTML = rowMarkup;
  }

  function updateCompactNote(cardTitle, text) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const note = card.querySelector(".compact-note");
    if (note) {
      note.textContent = text;
    }
  }

  function updateSectionBadge(cardTitle, label, badgeClass) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const badge = card.querySelector(".section-header .badge");
    if (badge) {
      badge.className = "badge text-bg-" + (badgeClass || "secondary");
      badge.textContent = label || "";
    }
  }

  function updateAlertStrip(cardTitle, text) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const alertStrip = card.querySelector(".alert-strip");
    if (alertStrip) {
      alertStrip.textContent = text;
    }
  }

  function updateStandaloneAlertStrip(text, variant) {
    const alertStrip = document.querySelector(".main-content .content-section .alert-strip");
    if (!alertStrip) {
      return;
    }

    alertStrip.className = "alert-strip alert-strip-" + (variant || "warning");
    alertStrip.textContent = text;
  }

  function renderTimelineList(cardTitle, items) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const timeline = card.querySelector(".timeline-list");
    if (!timeline) {
      return;
    }

    timeline.innerHTML = items.map(function (item) {
      return [
        '<div class="timeline-item">',
        "<strong>" + escapeHtml(item.title) + "</strong>",
        '<p class="mb-0">' + escapeHtml(item.note) + "</p>",
        "</div>"
      ].join("");
    }).join("");
  }

  function getTicket(ticketId) {
    if (!data) {
      return null;
    }

    return data.tickets.find(function (ticket) {
      return ticket.id === ticketId;
    }) || null;
  }

  function getPmPlan(planId) {
    if (!data) {
      return null;
    }

    return data.pmPlans.find(function (plan) {
      return plan.id === planId;
    }) || null;
  }

  function getAgreementMachines(agreementId) {
    if (!data) {
      return [];
    }

    return data.machines.filter(function (machine) {
      return machine.agreementId === agreementId;
    });
  }

  function getVendorMachines(vendorId) {
    if (!data) {
      return [];
    }

    return data.machines.filter(function (machine) {
      return machine.vendorId === vendorId;
    });
  }

  function formatShortDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short"
    });
  }

  function setInputValue(inputId, value) {
    const input = document.getElementById(inputId);
    if (input) {
      input.value = value || "";
    }
  }

  function setElementText(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = value || "";
    }
  }

  function setFilterMeta(primary, secondary) {
    const meta = document.querySelector(".filter-meta");
    if (!meta) {
      return;
    }

    const primaryElement = meta.children[0];
    const secondaryElement = meta.children[1];

    if (primaryElement && primary) {
      primaryElement.innerHTML = primary;
    }

    if (secondaryElement && secondary) {
      secondaryElement.textContent = secondary;
    }
  }

  function renderSimpleStack(cardTitle, items) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const stack = card.querySelector(".d-grid");
    if (!stack) {
      return;
    }

    stack.innerHTML = items.map(function (item) {
      return [
        '<div class="mini-stat-item">',
        "<div>",
        "<strong>" + escapeHtml(item.label) + "</strong>",
        '<div class="cell-muted">' + escapeHtml(item.note) + "</div>",
        "</div>",
        '<span class="badge text-bg-' + escapeHtml(item.badgeClass || "secondary") + '">' + escapeHtml(item.value) + "</span>",
        "</div>"
      ].join("");
    }).join("");
  }

  function renderListGroup(cardTitle, items) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const list = card.querySelector(".list-group");
    if (!list) {
      return;
    }

    list.innerHTML = items.map(function (item) {
      return [
        '<a href="' + escapeHtml(item.href || "#") + '" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">',
        escapeHtml(item.label),
        '<span class="badge text-bg-light">' + escapeHtml(item.value) + "</span>",
        "</a>"
      ].join("");
    }).join("");
  }

  function renderTimeline(cardTitle, items) {
    const card = findCardByTitle(cardTitle);
    if (!card) {
      return;
    }

    const timeline = card.querySelector(".rent-machine-timeline");
    if (!timeline) {
      return;
    }

    timeline.innerHTML = items.map(function (item) {
      return [
        '<div class="rent-machine-timeline-item">',
        '<span class="rent-machine-timeline-dot bg-' + escapeHtml(item.color || "primary") + '"></span>',
        "<div>",
        "<strong>" + escapeHtml(item.label) + "</strong>",
        '<div class="cell-muted">' + escapeHtml(item.note) + "</div>",
        "</div>",
        "</div>"
      ].join("");
    }).join("");
  }

  function renderDashboardPage() {
    if (!data || currentFileName !== "dashboard.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const maintenanceMetrics = data.managementMetrics ? data.managementMetrics.maintenance : {};
    const productionMetrics = data.managementMetrics ? data.managementMetrics.production : {};
    const openTickets = helpers.getOpenTickets().slice().sort(function (left, right) {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return (priorityOrder[right.priority] || 0) - (priorityOrder[left.priority] || 0);
    }).slice(0, 4);
    const pmFocus = data.pmPlans.filter(function (plan) {
      return plan.status === "Due" || plan.status === "Overdue" || plan.status === "Planned";
    }).slice(0, 4);
    const rentRisks = helpers.getRentRiskMachines().slice(0, 3);
    const lowStockParts = helpers.getLowStockParts().slice(0, 4);
    const technicianLoad = helpers.getTechnicianLoad();
    const isManagementGmRole = isManagementAnalyticsRole(currentUser.role);

    updateHeaderActions([
      isManagementGmRole ? "Export GM Control Pack" : "Export Control Review",
      "Raise Breakdown Ticket"
    ]);
    setFilterMeta(
      'Control Date: <strong>' + escapeHtml(formatDate(new Date())) + "</strong>",
      "MTTR " + maintenanceMetrics.mttrHours + " Hrs | Output Loss Risk " + productionMetrics.outputLossRiskHours + " Hrs | PM Pressure " + maintenanceMetrics.pmPressureItems + " items"
    );

    renderSummaryCards([
      {
        label: "Machine Availability",
        value: data.metrics.dashboard.machineAvailability + "%",
        valueClass: "text-success",
        note: data.scope.totalMachines + " control-scope machines with " + data.scope.rentMachines + " rent-machine dependencies"
      },
      {
        label: "MTTR",
        value: maintenanceMetrics.mttrHours + " Hrs",
        valueClass: "text-danger",
        note: "Repeat issue interval is now around " + maintenanceMetrics.repeatIssueIntervalDays + " days on watch machines"
      },
      {
        label: "PM Pressure",
        value: String(maintenanceMetrics.pmPressureItems),
        valueClass: "text-warning",
        note: maintenanceMetrics.overduePm + " overdue and " + maintenanceMetrics.deferApprovals + " defer approvals still need management sign-off"
      },
      {
        label: "Output Loss Risk",
        value: productionMetrics.outputLossRiskHours + " Hrs",
        valueClass: "text-primary",
        note: productionMetrics.impactedLines + " lines are exposed; highest risk remains " + productionMetrics.highestRiskLine
      }
    ]);

    updateCardSectionText("Priority Action Board", "Live escalation queue for management review with repeat issue, PM exception, vendor SLA, and spare-linked line risk in one board.");
    updateSectionBadge("Priority Action Board", maintenanceMetrics.criticalEscalations + " GM Actions", "danger");

    const priorityList = document.querySelector(".priority-list");
    if (priorityList) {
      priorityList.innerHTML = [
        {
          className: "priority-item priority-item-danger",
          title: "MC-1014 repeat breakdown is holding Line 03 output",
          note: "Root cause closure and operator-confidence restart are still pending. Backup overlock support should be confirmed before shift handover.",
          href: "breakdown-list.html",
          label: "Open Breakdown"
        },
        {
          className: "priority-item priority-item-warning",
          title: "RM-2008 needs vendor SLA decision and standby planning",
          note: "Prime Machine Service is still pending confirmation under AGR-2026-004 while Line 03 keeps rent-machine dependency high.",
          href: "return-replace.html",
          label: "Review Flow"
        },
        {
          className: "priority-item priority-item-primary",
          title: "RM-2010 monthly PM overdue because belt stock is low",
          note: "PM defer approval, store action, and technician accountability should be reviewed together before monthly backlog grows again.",
          href: "pm-due.html",
          label: "View PM Due"
        },
        {
          className: "priority-item priority-item-warning",
          title: "3 spare-linked cases are stretching MTTR and production release",
          note: "Looper set and motor belt shortage now affect both breakdown closure and PM completion rhythm.",
          href: "spare-low-stock.html",
          label: "Low Stock Watch"
        }
      ].map(function (item) {
        return [
          '<div class="' + item.className + '">',
          "<div>",
          '<div class="priority-title">' + escapeHtml(item.title) + "</div>",
          '<div class="priority-text">' + escapeHtml(item.note) + "</div>",
          "</div>",
          '<a href="' + item.href + '" class="btn btn-sm btn-outline-secondary">' + escapeHtml(item.label) + "</a>",
          "</div>"
        ].join("");
      }).join("");
    }

    updateCardSectionText("Rent Machine Summary", "Vendor SLA, agreement exposure, backup arrangement, and return or replace readiness for current production dependency.");
    renderMiniStatList("Rent Machine Summary", [
      {
        label: "Vendor SLA Watch",
        note: "Prime Machine Service response remains the main risk under AGR-2026-004",
        value: String(maintenanceMetrics.vendorSlaWatch),
        badgeClass: "danger"
      },
      {
        label: "Return / Replace Review",
        note: "Approval and continuity planning are still open on key rent assets",
        value: String(data.metrics.rent.reviewPending),
        badgeClass: "warning"
      },
      {
        label: "Agreement Expiring Soon",
        note: "Renewal timing can directly affect standby and service continuity",
        value: String(data.metrics.rent.expiringSoon),
        badgeClass: "warning"
      },
      {
        label: "Backup Arrangement Pending",
        note: "Production needs alternate support on the highest-risk lines",
        value: String(productionMetrics.backupArrangementPending),
        badgeClass: "primary"
      }
    ]);

    renderStatusLines("Rent Machine Summary", rentRisks.map(function (machine) {
      const vendor = helpers.getMachineVendor(machine);
      const agreement = helpers.getMachineAgreement(machine);
      return {
        label: machine.id + " / " + (vendor ? vendor.name : "Vendor Pending"),
        note: machine.line + " | " + (agreement ? agreement.id : "Agreement pending") + " | " + (machine.returnReplaceStatus || machine.status),
        value: machine.status,
        badgeClass: helpers.statusBadgeClass(machine.status)
      };
    }));

    updateCompactNote("Rent Machine Summary", "Rent-machine review now keeps vendor SLA, agreement renewal, PM risk, and backup-arrangement pressure visible in one management block.");

    updateCardSectionText("Line-wise Machine Availability", "Control view of line availability with the areas most exposed to downtime, operator idle risk, and escalation load.");
    renderTable("Line-wise Machine Availability", data.lines.map(function (line) {
      return [
        "<tr>",
        '<td data-label="Line"><strong>' + escapeHtml(line.line) + '</strong><div class="cell-muted">' + escapeHtml(line.floor + " | Operators " + line.operatorCount) + "</div></td>",
        '<td data-label="Total">' + escapeHtml(line.totalMachines) + "</td>",
        '<td data-label="Active">' + escapeHtml(line.activeCount) + "</td>",
        '<td data-label="Idle">' + escapeHtml(line.idleCount) + "</td>",
        '<td data-label="Breakdown">' + escapeHtml(line.breakdownCount) + "</td>",
        '<td data-label="Under Maintenance">' + escapeHtml(line.maintenanceCount) + "</td>",
        "</tr>"
      ].join("");
    }).join(""));

    updateCardSectionText("Store and Spare Parts Alert", "Low stock parts already shape MTTR, PM defer decisions, and the speed of line release after repair.");
    updateAlertStrip("Store and Spare Parts Alert", "Critical looper and belt shortage now influence " + maintenanceMetrics.spareImpactCases + " active service or PM cases.");
    renderTable("Store and Spare Parts Alert", lowStockParts.map(function (part) {
      return [
        "<tr>",
        '<td data-label="Part Code"><strong>' + escapeHtml(part.code) + "</strong></td>",
        '<td data-label="Part Name"><strong>' + escapeHtml(part.name) + '</strong><div class="cell-muted">' + escapeHtml("Linked: " + part.linkedMachines.join(", ")) + "</div></td>",
        '<td data-label="Stock"><span class="badge text-bg-' + helpers.statusBadgeClass(part.status) + '">' + escapeHtml(part.stockQty + " pcs") + "</span></td>",
        '<td data-label="Reorder">' + escapeHtml(part.reorderLevel + " pcs") + "</td>",
        "</tr>"
      ].join("");
    }).join(""));

    updateCardSectionText("Breakdown Tickets", "Open tickets ranked for line impact, repeat issue, escalation pressure, and production acceptance exposure.");
    renderTable("Breakdown Tickets", openTickets.map(function (ticket) {
      const machine = helpers.getMachine(ticket.machineId);
      return [
        "<tr>",
        '<td data-label="Ticket No"><strong>' + escapeHtml(ticket.id) + '</strong><div class="cell-muted">' + escapeHtml(ticket.line + " | " + ticket.priority + " priority") + "</div></td>",
        '<td data-label="Machine"><strong>' + escapeHtml(ticket.machineId) + '</strong><div class="cell-muted">' + escapeHtml((machine ? machine.type : "Machine") + " | " + ticket.impact) + "</div></td>",
        '<td data-label="Assigned To"><strong>' + escapeHtml(ticket.technician || "Pending Assignment") + '</strong><div class="cell-muted">' + escapeHtml(ticket.acceptedByProduction ? "Production accepted" : "Acceptance pending") + "</div></td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(ticket.status) + '">' + escapeHtml(ticket.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    updateCardSectionText("PM Due and Overdue", "Plans under current pressure, especially where defer approval, spare dependency, or rent-machine vendor coordination affect completion.");
    renderTable("PM Due and Overdue", pmFocus.map(function (plan) {
      const machine = helpers.getMachine(plan.machineId);
      return [
        "<tr>",
        '<td data-label="Machine"><strong>' + escapeHtml(plan.machineId) + '</strong><div class="cell-muted">' + escapeHtml(machine ? machine.line : "Line pending") + "</div></td>",
        '<td data-label="Frequency">' + escapeHtml(plan.frequency) + "</td>",
        '<td data-label="Last Done"><strong>' + escapeHtml(formatDate(plan.lastPm)) + '</strong><div class="cell-muted">' + escapeHtml(plan.exceptionReason || "No exception") + "</div></td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(plan.status) + '">' + escapeHtml(plan.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    updateCardSectionText("Technician Workload", "Current technician capacity with breakdown vs PM split, so shift-level balancing can happen before bottlenecks grow.");
    renderMiniStatList("Technician Workload", technicianLoad.map(function (item) {
      const totalLoad = item.breakdown + item.pm;
      return {
        label: item.technician,
        note: item.breakdown + " breakdown and " + item.pm + " PM jobs in hand",
        value: totalLoad > 4 ? "Loaded" : "Ready",
        badgeClass: totalLoad > 4 ? "warning" : "success"
      };
    }));

    updateCardSectionText("Recent Activity", "Decision-oriented updates for GM review, not only raw module events.");
    renderActivityList("Recent Activity", [
      {
        color: "danger",
        title: "MC-1014 repeat breakdown now needs corrective-action signoff",
        note: "Line 03 risk remains open until root cause, PM recovery, and production restart confidence all close together.",
        time: "20 min ago"
      },
      {
        color: "warning",
        title: "RM-2008 still needs vendor response and standby logic",
        note: "Replacement readiness is now a production continuity issue, not only a maintenance follow-up.",
        time: "45 min ago"
      },
      {
        color: "primary",
        title: "RM-2010 PM defer remains linked with SP-BELT-01 shortage",
        note: "Store, technician, and maintenance approval all sit on the same control chain.",
        time: "1 hour ago"
      },
      {
        color: "success",
        title: productionMetrics.acceptancePending + " tickets still need production acceptance tracking",
        note: "Closeout rhythm is improving, but final release discipline should remain visible in management review.",
        time: "This shift"
      }
    ]);
  }

  function renderRentMachinesPage() {
    if (!data || currentFileName !== "rent-machines.html") {
      return;
    }

    const rentMachines = helpers.getRentMachines();

    renderSummaryCards([
      {
        label: "Total Rent Machines",
        value: String(data.scope.rentMachines),
        note: "Centralized count for all vendor-linked rent assets"
      },
      {
        label: "Currently Active",
        value: String(data.metrics.rent.active),
        valueClass: "text-success",
        note: "Running in production or ready under current agreements"
      },
      {
        label: "Return / Replace Pending",
        value: String(data.metrics.rent.reviewPending),
        valueClass: "text-warning",
        note: "Management and vendor follow-up still required"
      },
      {
        label: "Agreement Expiring Soon",
        value: String(data.metrics.rent.expiringSoon),
        valueClass: "text-danger",
        note: "Review before new receive or extension decision"
      }
    ]);

    renderTable("Rent Machine List", rentMachines.map(function (machine) {
      const vendor = helpers.getMachineVendor(machine);
      const agreement = helpers.getMachineAgreement(machine);
      return [
        "<tr>",
        '<td data-label="Rent Code"><strong>' + escapeHtml(machine.id) + '</strong><div class="cell-muted">Asset Tag: ' + escapeHtml(machine.assetTag || "-") + "</div></td>",
        '<td data-label="Machine Details"><strong>' + escapeHtml(machine.type) + '</strong><div class="cell-muted">' + escapeHtml(machine.brand + " " + machine.model) + "</div></td>",
        '<td data-label="Vendor / Agreement"><strong>' + escapeHtml(vendor ? vendor.name : "-") + '</strong><div class="cell-muted">' + escapeHtml(agreement ? agreement.id : "-") + "</div></td>",
        '<td data-label="Receive Date">' + escapeHtml(formatDate(machine.receiveDate)) + "</td>",
        '<td data-label="Current Allocation"><strong>' + escapeHtml(machine.line) + '</strong><div class="cell-muted">' + escapeHtml(machine.floor) + "</div></td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(machine.status) + '">' + escapeHtml(machine.status) + "</span></td>",
        '<td data-label="Return / Replace"><span class="badge text-bg-' + helpers.statusBadgeClass(machine.returnReplaceStatus === "No Request" ? "Idle" : machine.returnReplaceStatus) + '">' + escapeHtml(machine.returnReplaceStatus || "No Request") + "</span></td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="rent-machine-details.html" class="btn btn-sm btn-outline-primary">Details</a><a href="return-replace.html" class="btn btn-sm btn-outline-secondary">Flow</a></div></td>',
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Rent Control Notes", [
      { label: "Missing Agreement Link", value: "0" },
      { label: "Pending Vendor Pickup", value: "2" },
      { label: "Allocation Pending", value: "3" }
    ]);

    updateAlertStrip("Rent Control Notes", "AGR-2026-004 needs renewal review before any extra receive from Prime Machine Service.");
    updateCompactNote("Rent Control Notes", "Return or replace requests now stay tied to the same vendor, agreement, PM risk, and production impact references used across other modules.");
  }

  function renderVendorPage() {
    if (!data || currentFileName !== "vendors.html") {
      return;
    }

    renderSummaryCards([
      {
        label: "Total Vendors",
        value: String(data.scope.totalVendors),
        note: "Machine rent, service, and spare supply vendors"
      },
      {
        label: "Active Vendors",
        value: String(data.metrics.vendors.active),
        valueClass: "text-success",
        note: "Approved for current operational support"
      },
      {
        label: "Agreement Expiring Soon",
        value: String(data.metrics.vendors.expiringSoon),
        valueClass: "text-warning",
        note: "Need renewal review before risk grows"
      },
      {
        label: "Pending Approval",
        value: String(data.metrics.vendors.pendingApproval),
        valueClass: "text-danger",
        note: "Waiting management or admin confirmation"
      }
    ]);

    renderTable("Vendor List", data.vendors.map(function (vendor) {
      return [
        "<tr>",
        '<td data-label="Vendor Name"><strong>' + escapeHtml(vendor.name) + '</strong><div class="cell-muted">Vendor Code: ' + escapeHtml(vendor.id) + "</div></td>",
        '<td data-label="Type">' + escapeHtml(vendor.type) + "</td>",
        '<td data-label="Contact Person"><strong>' + escapeHtml(vendor.contactPerson) + '</strong><div class="cell-muted">' + escapeHtml(vendor.contactRole) + "</div></td>",
        '<td data-label="Phone / Email"><strong>' + escapeHtml(vendor.phone) + '</strong><div class="cell-muted">' + escapeHtml(vendor.email) + "</div></td>",
        '<td data-label="City">' + escapeHtml(vendor.city) + "</td>",
        '<td data-label="Agreement Status"><span class="badge text-bg-' + helpers.statusBadgeClass(vendor.agreementStatus) + '">' + escapeHtml(vendor.agreementStatus) + "</span></td>",
        '<td data-label="Machine Coverage">' + escapeHtml(vendor.machineCoverage ? vendor.machineCoverage + " Machines" : "Parts Supply") + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(vendor.status) + '">' + escapeHtml(vendor.status) + "</span></td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="vendor-details.html" class="btn btn-sm btn-outline-primary">Details</a><a href="agreements.html" class="btn btn-sm btn-outline-secondary">Agreements</a></div></td>',
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Vendor Control Notes", [
      { label: "Vendors Without Contact", value: "0" },
      { label: "Expiring Agreements", value: String(data.metrics.vendors.expiringSoon) },
      { label: "Pending Approval", value: String(data.metrics.vendors.pendingApproval) }
    ]);

    updateAlertStrip("Vendor Control Notes", "Prime Machine Service and Golden Parts Center need review because renewal and approval risks affect rent machine and spare support.");
  }

  function renderAgreementPage() {
    if (!data || currentFileName !== "agreements.html") {
      return;
    }

    renderSummaryCards([
      {
        label: "Total Agreements",
        value: String(data.scope.totalAgreements),
        note: "Rent machine, support, and parts-linked contracts"
      },
      {
        label: "Active Agreements",
        value: String(data.metrics.agreements.active),
        valueClass: "text-success",
        note: "Operationally usable in the current control period"
      },
      {
        label: "Expiring in 30 Days",
        value: String(data.metrics.agreements.expiringSoon),
        valueClass: "text-warning",
        note: "Renew before new receive or vendor escalation"
      },
      {
        label: "Expired / Draft",
        value: String(data.metrics.agreements.blocked),
        valueClass: "text-danger",
        note: "Blocked from new activity until approved"
      }
    ]);

    renderTable("Agreement List", data.agreements.map(function (agreement) {
      const vendor = helpers.getVendor(agreement.vendorId);
      return [
        "<tr>",
        '<td data-label="Agreement No"><strong>' + escapeHtml(agreement.id) + '</strong><div class="cell-muted">Ref: ' + escapeHtml(vendor ? vendor.name : "Agreement") + "</div></td>",
        '<td data-label="Vendor"><strong>' + escapeHtml(vendor ? vendor.name : "-") + '</strong><div class="cell-muted">' + escapeHtml(vendor ? vendor.city : "-") + "</div></td>",
        '<td data-label="Type">' + escapeHtml(agreement.type) + "</td>",
        '<td data-label="Start Date">' + escapeHtml(formatDate(agreement.startDate)) + "</td>",
        '<td data-label="End Date">' + escapeHtml(formatDate(agreement.endDate)) + "</td>",
        '<td data-label="Coverage">' + escapeHtml(agreement.coverage) + "</td>",
        '<td data-label="Monthly Cost">' + escapeHtml(helpers.formatCurrency(agreement.monthlyCost)) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(agreement.status) + '">' + escapeHtml(agreement.status) + "</span></td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="agreement-details.html" class="btn btn-sm btn-outline-primary">Details</a><a href="rent-machines.html" class="btn btn-sm btn-outline-secondary">Machines</a></div></td>',
        "</tr>"
      ].join("");
    }).join(""));
  }

  function renderBreakdownPage() {
    if (!data || currentFileName !== "breakdown-list.html") {
      return;
    }

    renderSummaryCards([
      {
        label: "Open Complaints",
        value: String(data.metrics.breakdown.open),
        valueClass: "text-danger",
        note: "Need assignment, escalation, or urgent maintenance action"
      },
      {
        label: "Assigned Today",
        value: String(data.metrics.breakdown.assigned),
        valueClass: "text-primary",
        note: "Supervisor already mapped technicians for active lines"
      },
      {
        label: "In Progress",
        value: String(data.metrics.breakdown.inProgress),
        valueClass: "text-warning",
        note: "Work note or production acceptance still pending"
      },
      {
        label: "Closed Today",
        value: String(data.metrics.breakdown.closedToday),
        valueClass: "text-success",
        note: "Closure includes production confirmation where required"
      }
    ]);

    renderTable("Breakdown Ticket Register", data.tickets.map(function (ticket) {
      const machine = helpers.getMachine(ticket.machineId);
      return [
        "<tr>",
        '<td data-label="Ticket No"><strong>' + escapeHtml(ticket.id) + '</strong><div class="cell-muted">Floor: ' + escapeHtml(ticket.floor) + "</div></td>",
        '<td data-label="Machine / Line"><strong>' + escapeHtml(ticket.machineId) + '</strong><div class="cell-muted">' + escapeHtml(ticket.line) + "</div></td>",
        '<td data-label="Complaint Details"><strong>' + escapeHtml(ticket.issue) + '</strong><div class="cell-muted">' + escapeHtml(ticket.impact + (machine && machine.repeatWatch ? " | Repeat watch" : "")) + "</div></td>",
        '<td data-label="Raised By"><strong>' + escapeHtml(ticket.raisedBy) + '</strong><div class="cell-muted">' + escapeHtml(ticket.raisedRole) + "</div></td>",
        '<td data-label="Assigned Technician">' + (ticket.technician ? "<strong>" + escapeHtml(ticket.technician) + '</strong><div class="cell-muted">' + escapeHtml(ticket.correctiveAction) + "</div>" : "Pending Assignment") + "</td>",
        '<td data-label="Priority"><span class="badge text-bg-' + helpers.priorityBadgeClass(ticket.priority) + '">' + escapeHtml(ticket.priority) + "</span></td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(ticket.status) + '">' + escapeHtml(ticket.status) + "</span></td>",
        '<td data-label="Raised Time">' + escapeHtml(formatDate(ticket.date)) + "</td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="ticket-details.html" class="btn btn-sm btn-outline-primary">Details</a><a href="' + (ticket.status === "Open" ? "ticket-assign.html" : "technician-tasks.html") + '" class="btn btn-sm btn-outline-secondary">' + (ticket.status === "Open" ? "Assign" : "Update") + "</a></div></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Workflow Notes", [
      { label: "Pending Assignment", value: "3" },
      { label: "Waiting Parts", value: "2" },
      { label: "Vendor Escalation", value: "1" }
    ]);
    updateAlertStrip("Workflow Notes", "MC-1014 and RM-2008 need immediate review because they directly affect line output, vendor response, and repeat issue control.");
  }

  function renderPmSchedulePage() {
    if (!data || currentFileName !== "pm-schedule.html") {
      return;
    }

    renderSummaryCards([
      {
        label: "Scheduled This Month",
        value: String(data.scope.totalPmPlansThisMonth),
        note: "Daily, weekly, and monthly PM plan records for Unit 02"
      },
      {
        label: "Due Today",
        value: String(data.metrics.pm.dueToday),
        valueClass: "text-warning",
        note: "Need technician follow-up before shift close"
      },
      {
        label: "Overdue",
        value: String(data.metrics.pm.overdue),
        valueClass: "text-danger",
        note: "Pending items are reducing PM discipline"
      },
      {
        label: "Completed This Month",
        value: String(data.metrics.pm.completed),
        valueClass: "text-success",
        note: "Current compliance sits at " + data.metrics.pm.compliance + "%"
      }
    ]);

    renderGridStatItems("PM Control Snapshot", [
      { label: "Morning Clearance", note: "7 daily PM items should close before lunch", value: "07", badgeClass: "primary" },
      { label: "Overdue Pressure", note: "6 pending items are dragging compliance down", value: "06", badgeClass: "danger" },
      { label: "Rent PM Risk", note: "2 agreement-linked machines need vendor-aware follow-up", value: "02", badgeClass: "dark" },
      { label: "Expected Closure", note: "14 items can still close in the current shift", value: "14", badgeClass: "success" }
    ]);

    updateCompactNote("PM Control Snapshot", "PM defer approval, spare shortage, and vendor-aware rent machine PM risks now stay visible together in the same board.");

    renderTable("PM Schedule Register", data.pmPlans.map(function (plan) {
      const machine = helpers.getMachine(plan.machineId);
      const agreement = machine ? helpers.getMachineAgreement(machine) : null;
      const dueNote = plan.status === "Overdue" ? plan.exceptionReason : (agreement ? "Agreement: " + agreement.id : "On schedule");
      return [
        "<tr>",
        '<td data-label="Plan No"><strong>' + escapeHtml(plan.id) + '</strong><div class="cell-muted">Checklist: ' + escapeHtml(machine ? machine.type : "Machine") + " PM</div></td>",
        '<td data-label="Machine / Location"><strong>' + escapeHtml(plan.machineId) + '</strong><div class="cell-muted">' + escapeHtml(machine ? machine.type + ", " + machine.line : "-") + "</div></td>",
        '<td data-label="Frequency"><span class="badge text-bg-' + (plan.frequency === "Daily" ? "primary" : plan.frequency === "Weekly" ? "info" : "dark") + '">' + escapeHtml(plan.frequency) + "</span></td>",
        '<td data-label="Last PM">' + escapeHtml(formatDate(plan.lastPm)) + "</td>",
        '<td data-label="Next Due"><strong>' + escapeHtml(formatDate(plan.nextDue)) + '</strong><div class="cell-muted">' + escapeHtml(dueNote) + "</div></td>",
        '<td data-label="Assigned Technician"><strong>' + escapeHtml(plan.technician) + '</strong><div class="cell-muted">' + escapeHtml(plan.vendorAware ? "Vendor-aware follow-up" : "Internal PM ownership") + "</div></td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(plan.status) + '">' + escapeHtml(plan.status) + "</span></td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="pm-checklist.html" class="btn btn-sm btn-outline-primary">Checklist</a><a href="technician-tasks.html" class="btn btn-sm btn-outline-secondary">Task</a></div></td>',
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Overdue Watch List", helpers.getOverduePmPlans().map(function (plan) {
      return {
        label: plan.machineId,
        note: plan.exceptionReason || "Overdue PM needs exception review",
        value: "Watch",
        badgeClass: "danger"
      };
    }));

    renderStatusLines("Frequency Compliance", [
      { label: "Daily PM", note: "28 completed out of 34 planned", value: "82%", badgeClass: "success" },
      { label: "Weekly PM", note: "9 completed out of 18 planned", value: "50%", badgeClass: "warning" },
      { label: "Monthly PM", note: "3 completed out of 12 planned", value: "25%", badgeClass: "danger" }
    ]);

    renderMiniStatList("Technician Planning Board", helpers.getTechnicianLoad().map(function (item) {
      return {
        label: item.technician,
        note: item.pm + " PM jobs, " + item.breakdown + " breakdown responsibilities",
        value: item.pm + item.breakdown > 5 ? "Busy" : "Balanced",
        badgeClass: item.pm + item.breakdown > 5 ? "warning" : "primary"
      };
    }));
  }

  function renderReportsPage() {
    if (!data || currentFileName !== "reports.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const overviewMetrics = data.reportMetrics ? data.reportMetrics.overview : {};
    const overviewView = data.reportViews ? data.reportViews.overview : null;
    const breakdownView = data.reportViews ? data.reportViews.breakdown : null;
    const rentView = data.reportViews ? data.reportViews.rent : null;
    const isManagementGmRole = isManagementAnalyticsRole(currentUser.role);
    const isIeExecutiveRole = currentUser.role === "IE Executive";
    const reportPerspectiveLabel = isManagementGmRole || currentUser.role === "IE Manager" || isIeExecutiveRole
      ? currentUser.role
      : "Management";

    updateHeaderActions([
      isManagementGmRole ? "Export GM Review Pack" : "Export Operational Review",
      "Download Control Excel"
    ]);
    setFilterMeta(
      'Report Date: <strong>' + escapeHtml(formatDate(new Date())) + "</strong>",
      "MTTR " + overviewMetrics.mttrHours + " Hrs | Downtime " + overviewMetrics.downtimeHours + " Hrs | Vendor Risk " + overviewMetrics.vendorRiskCases + " | PM Pressure " + overviewMetrics.pmPressureItems
    );

    renderSummaryCards([
      {
        label: "Machine Availability",
        value: overviewMetrics.machineAvailability + "%",
        valueClass: "text-success",
        note: data.scope.totalMachines + " machine records with " + overviewMetrics.lineImpactLines + " lines needing closer management watch"
      },
      {
        label: "MTTR",
        value: overviewMetrics.mttrHours + " Hrs",
        valueClass: "text-danger",
        note: "Maintenance recovery speed now reflects downtime, spare support, and vendor dependency together"
      },
      {
        label: "PM Pressure",
        value: String(overviewMetrics.pmPressureItems),
        valueClass: "text-warning",
        note: data.metrics.pm.overdue + " overdue items and monthly PM backlog remain the biggest control gap"
      },
      {
        label: "Output Loss Risk",
        value: overviewMetrics.outputLossRiskHours + " Hrs",
        valueClass: "text-primary",
        note: reportPerspectiveLabel + " view across " + overviewMetrics.lineImpactLines + " impacted lines with rent and spare dependency visible"
      }
    ]);

    updateCardSectionText("Report Snapshot", isIeExecutiveRole ? "Read-only analytical review layer for IE visibility covering recovery speed, PM pressure, vendor risk, and output loss exposure." : "Professional operational review layer for management covering recovery speed, PM pressure, vendor risk, and output loss exposure.");
    renderTable("Report Snapshot", (overviewView ? overviewView.snapshot : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Area"><strong>' + escapeHtml(item.area) + '</strong><div class="cell-muted">' + escapeHtml(item.note) + "</div></td>",
        '<td data-label="Current Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        '<td data-label="Key Figure"><strong>' + escapeHtml(item.figure) + '</strong><div class="cell-muted">' + escapeHtml(item.note) + "</div></td>",
        '<td data-label="Risk / Gap">' + escapeHtml(item.gap) + "</td>",
        '<td data-label="Next Action"><a href="' + item.action + '" class="btn btn-sm btn-outline-primary">' + escapeHtml(item.actionLabel) + "</a></td>",
        "</tr>"
      ].join("");
    }).join(""));
    updateCompactNote("Report Snapshot", isIeExecutiveRole ? "This page now works as an IE analytical review sheet that connects downtime, PM pressure, and line-level production exposure without adding workflow controls." : "This page now works as a GM review sheet that connects maintenance control with line-level production exposure without leaving the current reporting area.");

    updateCardSectionText("Management Highlights", isIeExecutiveRole ? "IE Executive view: watch line efficiency trend, downtime concentration, PM pressure, and line impact first." : currentUser.role === "IE Manager" ? "IE Manager view: watch line efficiency trend, downtime concentration, and line impact first." : currentUser.role === "Operation GM" ? "Operation GM view: watch machine availability, downtime impact, rent dependency, and output-loss concentration first." : currentUser.role === "Production GM" ? "Production GM view: watch line impact, backup arrangement, and output-loss concentration first." : "Maintenance GM view: watch MTTR, PM exception, vendor SLA, and repeat breakdown closure first.");
    updateSectionBadge("Management Highlights", isIeExecutiveRole ? "IE Focus" : "GM Focus", isIeExecutiveRole ? "primary" : "danger");
    renderActivityList("Management Highlights", overviewView ? overviewView.highlights : []);

    updateCardSectionText("Export Options", isIeExecutiveRole ? "View-only analytical shortcuts for dashboard, downtime, PM, and breakdown review." : "Reusable control packs for management, maintenance exception review, and production-impact discussion.");
    renderMiniStatList("Export Options", isIeExecutiveRole ? [
      { label: "Dashboard Review", note: "Open the dashboard in read-only analytical mode.", value: "View", badgeClass: "primary" },
      { label: "Breakdown Analysis", note: "Review complaint trend and line impact without workflow actions.", value: "View", badgeClass: "warning" },
      { label: "PM Summary", note: "Check due, overdue, and compliance concentration by line.", value: "View", badgeClass: "info" },
      { label: "Downtime Focus", note: "Review downtime concentration and efficiency impact.", value: "View", badgeClass: "dark" }
    ] : overviewView ? overviewView.exportOptions : []);
    if (isIeExecutiveRole) {
      updateCardSectionTitle("Export Options", "Review Options");
    }

    updateCardSectionText("Top Breakdown Machines", "Repeat issue watch ranked for downtime, output-loss exposure, and closure discipline.");
    renderTable("Top Breakdown Machines", (breakdownView ? breakdownView.repeatMachines : []).map(function (machine) {
      const machineRecord = helpers.getMachine(machine.machineId);
      const complaintCount = machine.count || (helpers.getMachineTickets(machine.machineId).length + " cases");
      return [
        "<tr>",
        '<td data-label="Machine Code"><strong>' + escapeHtml(machine.machineId) + '</strong><div class="cell-muted">' + escapeHtml(machine.note) + "</div></td>",
        '<td data-label="Machine Type">' + escapeHtml(machineRecord ? machineRecord.type : machine.ownership) + "</td>",
        '<td data-label="Line">' + escapeHtml(machineRecord ? machineRecord.line : machine.note) + "</td>",
        '<td data-label="Complaint Count">' + escapeHtml(complaintCount) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(machine.status) + '">' + escapeHtml(machine.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    updateCardSectionText("Vendor and Agreement Performance", "Vendor response and agreement exposure summarized with live rent-machine dependency in the same table.");
    renderTable("Vendor and Agreement Performance", (rentView ? rentView.vendorPerformance : []).map(function (row, index) {
        const linkedAgreement = index === 0 ? "AGR-2026-004" : index === 1 ? "AGR-2026-001" : "AGR-2026-006";
        return [
          "<tr>",
          '<td data-label="Vendor"><strong>' + escapeHtml(row.vendor) + "</strong></td>",
          '<td data-label="Agreement No">' + escapeHtml(linkedAgreement) + "</td>",
          '<td data-label="Active Machines">' + escapeHtml(row.activeUse) + "</td>",
          '<td data-label="Open Issues">' + escapeHtml(row.watch) + "</td>",
          '<td data-label="Response"><span class="badge text-bg-' + helpers.statusBadgeClass(row.status) + '">' + escapeHtml(row.status) + "</span></td>",
          "</tr>"
        ].join("");
      }).join(""));

    updateCardSectionText("PM Compliance by Frequency", "Frequency performance tied to management pressure rather than completion count only.");
    renderStatusLines("PM Compliance by Frequency", (data.reportViews && data.reportViews.pm ? data.reportViews.pm.frequencyPerformance : []).map(function (item) {
      return {
        label: item.frequency,
        note: item.completed + " completed from " + item.scheduled + " scheduled | Due / Overdue " + item.dueOverdue,
        value: item.compliance,
        badgeClass: helpers.statusBadgeClass(item.status)
      };
    }));

    updateCardSectionText("Low Stock Spare Parts Alert", "Shortage items now show direct impact on MTTR, PM defer, and line-level output continuity.");
    renderMiniStatList("Low Stock Spare Parts Alert", helpers.getLowStockParts().map(function (part) {
      const affectedPm = data.pmPlans.filter(function (plan) {
        return part.linkedMachines.indexOf(plan.machineId) > -1 && (plan.status === "Due" || plan.status === "Overdue" || plan.status === "Planned");
      }).length;
      return {
        label: part.name,
        note: "In stock: " + part.stockQty + " pcs | Linked with " + part.linkedMachines.join(", ") + " | Affects " + affectedPm + " PM or repair cases",
        value: part.status,
        badgeClass: helpers.statusBadgeClass(part.status)
      };
    }));
  }

  function renderMachineDetailsPage() {
    if (!data || currentFileName !== "machine-details.html") {
      return;
    }

    const machine = helpers.getMachine(data.pageContext.machineDetailsId);
    const ticket = getTicket("BD-2026-0121");
    const pmPlan = getPmPlan("PM-2026-042");
    const looperPart = data.spareParts.find(function (part) {
      return part.code === "SP-LOOPER-01";
    });
    const topCard = document.querySelector(".content-section .erp-card");

    if (!machine || !ticket || !pmPlan || !topCard) {
      return;
    }

    const badgeWrap = topCard.querySelector(".section-header .d-flex");
    if (badgeWrap) {
      badgeWrap.innerHTML = '<span class="badge text-bg-secondary">Own Machine</span><span class="badge text-bg-danger">Breakdown</span>';
    }

    const overviewText = topCard.querySelector(".section-text");
    if (overviewText) {
      overviewText.textContent = "This selected own machine now follows the same central machine, breakdown, PM, and spare dependency data used across the system.";
    }

    setInputValue("detailMachineCode", machine.id);
    setInputValue("detailMachineType", machine.type);
    setInputValue("detailBrandModel", machine.brand + " " + machine.model);
    setInputValue("detailStatus", machine.status);
    setFilterMeta(
      'Last Updated: <strong>' + escapeHtml(formatDate(ticket.date)) + "</strong>",
      "Linked ticket: " + ticket.id + " | Ownership: " + machine.ownership
    );

    renderSummaryCards([
      {
        label: "Current Allocation",
        value: machine.line,
        note: machine.floor + " under active production use"
      },
      {
        label: "Last PM",
        value: formatShortDate(pmPlan.lastPm),
        valueClass: "text-warning",
        note: pmPlan.id + " is currently " + pmPlan.status.toLowerCase()
      },
      {
        label: "Open Breakdown",
        value: "1",
        valueClass: "text-danger",
        note: ticket.id + " is waiting root cause and acceptance closeout"
      },
      {
        label: "Repeat Watch",
        value: machine.repeatWatch ? "Yes" : "No",
        valueClass: machine.repeatWatch ? "text-primary" : "text-success",
        note: machine.repeatWatch ? "Machine remains under repeat issue tracking" : "No repeat issue flag"
      }
    ]);

    renderGridStatItems("Machine Master Profile", [
      { label: "Ownership", note: "Own machine in central master", value: machine.ownership, badgeClass: "secondary" },
      { label: "Criticality", note: "Priority class for maintenance response", value: machine.criticality, badgeClass: "dark" },
      { label: "Serial Number", note: machine.serialNo, value: "Tracked", badgeClass: "secondary" },
      { label: "Current Condition", note: ticket.issue, value: "Repeat Watch", badgeClass: "warning" }
    ]);

    updateCompactNote("Machine Master Profile", "Own machine record now stays aligned with the same ticket, PM, and spare dependency records shown in machine list, dashboard, and report pages.");

    renderTable("Allocation and Agreement Linkage", [
      {
        item: "Ownership",
        details: machine.ownership + " machine with no vendor or agreement dependency",
        sub: "Central machine master record",
        status: "Active"
      },
      {
        item: "Current Allocation",
        details: machine.line + ", " + machine.floor,
        sub: "Assigned machine location",
        status: "Active"
      },
      {
        item: "Linked Agreement",
        details: "Not Applicable",
        sub: "Own machine record is not linked to rent contract",
        status: "Stable"
      },
      {
        item: "Spare Dependency",
        details: looperPart.name,
        sub: "Low stock watch affects repeat breakdown recovery",
        status: looperPart.status
      }
    ].map(function (item) {
      return [
        "<tr>",
        '<td data-label="Item"><strong>' + escapeHtml(item.item) + "</strong></td>",
        '<td data-label="Details"><strong>' + escapeHtml(item.details) + '</strong><div class="cell-muted">' + escapeHtml(item.sub) + "</div></td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("PM and Breakdown Register", [
      {
        ref: ticket.id,
        activity: ticket.issue,
        note: "Current active breakdown complaint",
        date: formatDate(ticket.date),
        assignee: ticket.technician || "Not Assigned",
        status: ticket.status
      },
      {
        ref: pmPlan.id,
        activity: pmPlan.frequency + " PM pending",
        note: pmPlan.exceptionReason,
        date: formatDate(pmPlan.nextDue),
        assignee: pmPlan.technician,
        status: pmPlan.status
      },
      {
        ref: "SP-LOOPER-01",
        activity: looperPart.name + " shortage watch",
        note: "Linked spare can affect MTTR and corrective follow-up",
        date: formatDate("2026-04-22"),
        assignee: "Store User",
        status: looperPart.status
      }
    ].map(function (item) {
      return [
        "<tr>",
        '<td data-label="Reference"><strong>' + escapeHtml(item.ref) + "</strong></td>",
        '<td data-label="Activity"><strong>' + escapeHtml(item.activity) + '</strong><div class="cell-muted">' + escapeHtml(item.note) + "</div></td>",
        '<td data-label="Date">' + escapeHtml(item.date) + "</td>",
        '<td data-label="Assigned To">' + escapeHtml(item.assignee) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Current Action Board", [
      {
        label: "Open Breakdown Ticket",
        note: ticket.id + " needs assignment closeout and production visibility.",
        value: "Urgent",
        badgeClass: "danger"
      },
      {
        label: "PM Overdue",
        note: pmPlan.id + " stayed open because breakdown recovery took priority.",
        value: "Due",
        badgeClass: "warning"
      },
      {
        label: "Spare Review",
        note: looperPart.name + " stock is below reorder level for repeat issue support.",
        value: "Store",
        badgeClass: "primary"
      }
    ]);

    renderActivityList("Recent Activity", data.histories.machineEvents
      .filter(function (entry) {
        return entry.machineId === machine.id;
      })
      .slice(0, 3)
      .map(function (entry) {
        return {
          color: entry.eventType === "Breakdown" ? "danger" : "warning",
          title: entry.eventType + " linked with " + entry.linkedRef,
          note: entry.details,
          time: formatShortDate(entry.date)
        };
      }));

    renderStatusLines("Spare Parts Use", [
      {
        label: looperPart.name,
        note: "Current low stock risk for " + machine.id,
        value: looperPart.status,
        badgeClass: helpers.statusBadgeClass(looperPart.status)
      },
      {
        label: "DBx1 Needle Pack",
        note: "Healthy stock supports quick trial run and routine replacement.",
        value: "Healthy",
        badgeClass: "success"
      },
      {
        label: "Root Cause Review",
        note: "Repeat issue classification should be closed with technician note.",
        value: "Open",
        badgeClass: "warning"
      }
    ]);
  }

  function renderRentMachineDetailsPage() {
    if (!data || currentFileName !== "rent-machine-details.html") {
      return;
    }

    const machine = helpers.getMachine(data.pageContext.rentMachineDetailsId);
    const vendor = helpers.getMachineVendor(machine.id);
    const agreement = helpers.getMachineAgreement(machine.id);
    const ticket = getTicket("BD-2026-0119");
    const pmPlan = getPmPlan("PM-2026-045");
    const request = data.histories.returnReplaceRequests[0];
    const looperPart = data.spareParts.find(function (part) {
      return part.code === "SP-LOOPER-01";
    });
    const topCard = document.querySelector(".content-section .erp-card");

    if (!machine || !vendor || !agreement || !ticket || !pmPlan || !request || !topCard) {
      return;
    }

    const badgeWrap = topCard.querySelector(".section-header .d-flex");
    if (badgeWrap) {
      badgeWrap.innerHTML = '<span class="badge text-bg-primary">Rent Machine</span><span class="badge text-bg-warning">Under Maintenance</span>';
    }

    const overviewText = topCard.querySelector(".section-text");
    if (overviewText) {
      overviewText.textContent = "This rent machine detail page now reads from the same central vendor, agreement, breakdown, PM, and return or replacement records used across the prototype.";
    }

    setInputValue("detailMachineCode", machine.id);
    setInputValue("detailMachineType", machine.type);
    setInputValue("detailBrandModel", machine.brand + " " + machine.model);
    setInputValue("detailStatus", machine.status);
    setFilterMeta(
      'Receive Date: <strong>' + escapeHtml(formatDate(machine.receiveDate)) + "</strong>",
      "Vendor: " + vendor.name + " | Agreement: " + agreement.id
    );

    renderSummaryCards([
      {
        label: "Current Allocation",
        value: machine.line,
        note: machine.floor + " under current production support"
      },
      {
        label: "Monthly Rent",
        value: String(machine.monthlyRent || 14500),
        valueClass: "text-primary",
        note: "BDT per machine under current vendor package"
      },
      {
        label: "Next PM",
        value: formatShortDate(pmPlan.nextDue),
        valueClass: "text-warning",
        note: pmPlan.status + " because corrective work is still open"
      },
      {
        label: "Return / Replace",
        value: machine.returnReplaceStatus,
        valueClass: "text-danger",
        note: request.id + " is the active management follow-up"
      }
    ]);

    renderGridStatItems("Rent Machine Profile", [
      { label: "Asset Tag", note: machine.assetTag + " tagged during receive", value: "Tracked", badgeClass: "dark" },
      { label: "Receive Condition", note: "Machine was received in usable condition and deployed after inspection.", value: "Good", badgeClass: "success" },
      { label: "Vendor Serial", note: machine.serialNo, value: "Serial", badgeClass: "secondary" },
      { label: "Service Priority", note: ticket.issue, value: "High", badgeClass: "warning" }
    ]);

    renderTable("Vendor, Agreement, and Allocation", [
      {
        item: "Vendor",
        details: vendor.name,
        sub: vendor.contactPerson + " | " + vendor.phone,
        status: vendor.status
      },
      {
        item: "Agreement",
        details: agreement.id,
        sub: agreement.coverage,
        status: agreement.status
      },
      {
        item: "Current Allocation",
        details: machine.line + ", " + machine.floor,
        sub: "Allocated under active production requirement",
        status: "Active"
      },
      {
        item: "Return / Replace Terms",
        details: machine.returnReplaceStatus,
        sub: request.remarks,
        status: "Decision Pending"
      }
    ].map(function (item) {
      return [
        "<tr>",
        '<td data-label="Item"><strong>' + escapeHtml(item.item) + "</strong></td>",
        '<td data-label="Details"><strong>' + escapeHtml(item.details) + '</strong><div class="cell-muted">' + escapeHtml(item.sub) + "</div></td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("PM, Breakdown, and Return History", [
      {
        ref: ticket.id,
        activity: ticket.issue,
        note: "Current active breakdown complaint affecting " + machine.line,
        date: formatDate(ticket.date),
        assignee: ticket.technician,
        status: ticket.status
      },
      {
        ref: pmPlan.id,
        activity: pmPlan.frequency + " PM defer",
        note: pmPlan.exceptionReason,
        date: formatDate(pmPlan.nextDue),
        assignee: pmPlan.technician,
        status: pmPlan.status
      },
      {
        ref: request.id,
        activity: request.requestType + " review opened",
        note: request.reason,
        date: formatDate(request.requestDate),
        assignee: request.requestedBy,
        status: request.flowStatus
      }
    ].map(function (item) {
      return [
        "<tr>",
        '<td data-label="Reference"><strong>' + escapeHtml(item.ref) + "</strong></td>",
        '<td data-label="Activity"><strong>' + escapeHtml(item.activity) + '</strong><div class="cell-muted">' + escapeHtml(item.note) + "</div></td>",
        '<td data-label="Date">' + escapeHtml(item.date) + "</td>",
        '<td data-label="Assigned To">' + escapeHtml(item.assignee) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Current Action Board", [
      {
        label: "Open Breakdown",
        note: ticket.id + " still needs production acceptance before closure.",
        value: "Urgent",
        badgeClass: "danger"
      },
      {
        label: "PM Defer",
        note: pmPlan.id + " cannot close until current corrective work is stable.",
        value: "Review",
        badgeClass: "warning"
      },
      {
        label: "Agreement Renewal Watch",
        note: agreement.id + " is nearing expiry while replacement review is open.",
        value: "Watch",
        badgeClass: "primary"
      }
    ]);

    renderActivityList("Recent Activity", data.histories.rentMachineHistory[machine.id].slice(0, 3).map(function (entry) {
      return {
        color: entry.eventType === "Breakdown" ? "danger" : entry.eventType === "Return / Replace" ? "primary" : "warning",
        title: entry.eventType + " linked with " + entry.linkedRef,
        note: entry.details,
        time: formatShortDate(entry.date)
      };
    }));

    renderStatusLines("Spare Parts and Cost Risk", [
      {
        label: looperPart.name,
        note: "Current low stock watch for " + machine.id + " corrective work.",
        value: looperPart.status,
        badgeClass: helpers.statusBadgeClass(looperPart.status)
      },
      {
        label: "Agreement Cost Exposure",
        note: "Replacement review can affect current contract commercial discussion.",
        value: agreement.status,
        badgeClass: helpers.statusBadgeClass(agreement.status)
      },
      {
        label: "Vendor Dependency",
        note: vendor.name + " remains the main service and replacement contact.",
        value: "Linked",
        badgeClass: "primary"
      }
    ]);
  }

  function renderVendorDetailsPage() {
    if (!data || currentFileName !== "vendor-details.html") {
      return;
    }

    const vendor = helpers.getVendor(data.pageContext.vendorDetailsId);
    const agreements = data.agreements.filter(function (agreement) {
      return agreement.vendorId === vendor.id;
    });
    const machines = getVendorMachines(vendor.id);

    if (!vendor) {
      return;
    }

    renderSummaryCards([
      {
        label: "Vendor Code",
        value: vendor.id,
        note: vendor.name + " master support profile"
      },
      {
        label: "Vendor Status",
        value: vendor.status,
        valueClass: "text-success",
        note: vendor.type + " in active business use"
      },
      {
        label: "Machine Coverage",
        value: String(vendor.machineCoverage),
        valueClass: "text-primary",
        note: machines.length + " visible sample records linked in this prototype"
      },
      {
        label: "Agreement Watch",
        value: vendor.agreementStatus,
        valueClass: "text-warning",
        note: "Renewal and PM escalation should follow this record"
      }
    ]);

    renderGridStatItems("Vendor Profile Overview", [
      { label: "Vendor Name", note: vendor.name, value: vendor.status, badgeClass: helpers.statusBadgeClass(vendor.status) },
      { label: "Business Type", note: vendor.type, value: "Support", badgeClass: "info" },
      { label: "City", note: vendor.city, value: "Local", badgeClass: "dark" },
      { label: "Response Time", note: vendor.responseHours + " hours expected support window", value: "SLA", badgeClass: "warning" }
    ]);

    renderTable("Contact and Address Details", [
      { field: "Contact Person", value: vendor.contactPerson },
      { field: "Designation", value: vendor.contactRole },
      { field: "Mobile Number", value: vendor.phone },
      { field: "Email", value: vendor.email },
      { field: "Office Phone", value: vendor.officePhone || "Not recorded" },
      { field: "Office Address", value: vendor.address || (vendor.city + ", Bangladesh") }
    ].map(function (item) {
      return '<tr><td data-label="Field"><strong>' + escapeHtml(item.field) + '</strong></td><td data-label="Value">' + escapeHtml(item.value) + "</td></tr>";
    }).join(""));

    renderTable("Agreement and Coverage Snapshot", agreements.map(function (agreement) {
      return [
        "<tr>",
        '<td data-label="Agreement No"><strong>' + escapeHtml(agreement.id) + "</strong></td>",
        '<td data-label="Coverage Type">' + escapeHtml(agreement.type) + "</td>",
        '<td data-label="Machine Coverage">' + escapeHtml(agreement.coverage) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(agreement.status) + '">' + escapeHtml(agreement.status) + "</span></td>",
        '<td data-label="End Date">' + escapeHtml(formatDate(agreement.endDate)) + "</td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Covered Machine Snapshot", machines.map(function (machine) {
      const relatedPm = helpers.getMachinePmPlans(machine.id)[0];
      return [
        "<tr>",
        '<td data-label="Machine Code"><strong>' + escapeHtml(machine.id) + "</strong></td>",
        '<td data-label="Machine Type">' + escapeHtml(machine.type) + "</td>",
        '<td data-label="Floor / Line">' + escapeHtml(machine.line + ", " + machine.floor) + "</td>",
        '<td data-label="Current Status"><span class="badge text-bg-' + helpers.statusBadgeClass(machine.status) + '">' + escapeHtml(machine.status) + "</span></td>",
        '<td data-label="PM / Support"><span class="badge text-bg-' + helpers.statusBadgeClass(relatedPm ? relatedPm.status : "Stable") + '">' + escapeHtml(relatedPm ? relatedPm.status : "Stable") + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Vendor Watch", [
      {
        label: "Agreement Renewal",
        note: "AGR-2026-004 should close before additional receive or replacement approval.",
        value: "Open",
        badgeClass: "warning"
      },
      {
        label: "PM Escalation",
        note: "RM-2008 and RM-2010 are already linked with PM and vendor-aware follow-up.",
        value: "Risk",
        badgeClass: "danger"
      },
      {
        label: "Response Readiness",
        note: "Primary contact remains active and reachable for same-day coordination.",
        value: "Ready",
        badgeClass: "success"
      }
    ]);

    renderStatusLines("Performance Snapshot", [
      {
        label: "Current Coverage",
        note: vendor.machineCoverage + " machines under vendor support scope",
        value: String(vendor.machineCoverage),
        badgeClass: "primary"
      },
      {
        label: "Complaint Response",
        note: vendor.responseHours + " hour expected turnaround in current support note",
        value: "Tracked",
        badgeClass: "success"
      },
      {
        label: "Renewal Risk",
        note: "Service continuity depends on timely agreement update.",
        value: vendor.agreementStatus,
        badgeClass: "warning"
      }
    ]);

    renderActivityList("Recent Vendor Updates", [
      {
        color: "warning",
        title: "Renewal watch opened for " + agreements[agreements.length - 1].id,
        note: "Current contract entered expiring-soon tracking for May review.",
        time: "22 Apr"
      },
      {
        color: "success",
        title: "Support contact verified",
        note: vendor.contactPerson + " and support mobile were rechecked by maintenance team.",
        time: "21 Apr"
      },
      {
        color: "danger",
        title: "PM escalation linked with vendor record",
        note: "Rent machine overdue PM now appears in vendor decision follow-up.",
        time: "18 Apr"
      }
    ]);
  }

  function renderAgreementDetailsPage() {
    if (!data || currentFileName !== "agreement-details.html") {
      return;
    }

    const agreement = data.agreements.find(function (item) {
      return item.id === data.pageContext.agreementDetailsId;
    });
    const vendor = helpers.getVendor(agreement.vendorId);
    const machines = getAgreementMachines(agreement.id);

    if (!agreement || !vendor) {
      return;
    }

    renderSummaryCards([
      {
        label: "Agreement No",
        value: agreement.id,
        note: vendor.name + " rent support agreement"
      },
      {
        label: "Current Status",
        value: agreement.status,
        valueClass: "text-warning",
        note: "Renewal decision should close before next receive or replacement approval"
      },
      {
        label: "Machine Coverage",
        value: agreement.coverage.replace(" Rent Machines", ""),
        valueClass: "text-primary",
        note: machines.length + " visible sample records currently linked in prototype"
      },
      {
        label: "Monthly Cost",
        value: "245K",
        valueClass: "text-success",
        note: helpers.formatCurrency(agreement.monthlyCost) + " approved commercial rate"
      }
    ]);

    renderGridStatItems("Agreement Overview", [
      { label: "Vendor", note: vendor.name + ", " + vendor.city, value: "Vendor", badgeClass: "primary" },
      { label: "Agreement Type", note: agreement.type, value: "Rent", badgeClass: "info" },
      { label: "Contract Period", note: formatDate(agreement.startDate) + " to " + formatDate(agreement.endDate), value: "104 Days", badgeClass: "dark" },
      { label: "Renewal Notice", note: "30-day pre-expiry review required for management decision.", value: "30 Days", badgeClass: "warning" }
    ]);

    renderTable("Coverage and Commercial Terms", [
      { field: "Coverage Type", value: agreement.type },
      { field: "Machine Coverage", value: agreement.coverage },
      { field: "Monthly Cost", value: helpers.formatCurrency(agreement.monthlyCost) },
      { field: "Payment Terms", value: "Monthly bill submission with approval clearance" },
      { field: "Return / Replacement", value: "Return and replacement support allowed during contract period" },
      { field: "Service Area", value: "Gazipur, Dhaka, Tongi" }
    ].map(function (item) {
      return '<tr><td data-label="Field"><strong>' + escapeHtml(item.field) + '</strong></td><td data-label="Value">' + escapeHtml(item.value) + "</td></tr>";
    }).join(""));

    renderTable("Covered Machine Snapshot", machines.map(function (machine) {
      const relatedPm = helpers.getMachinePmPlans(machine.id)[0];
      return [
        "<tr>",
        '<td data-label="Machine Code"><strong>' + escapeHtml(machine.id) + "</strong></td>",
        '<td data-label="Machine Type">' + escapeHtml(machine.type) + "</td>",
        '<td data-label="Floor / Line">' + escapeHtml(machine.line + ", " + machine.floor) + "</td>",
        '<td data-label="Current Status"><span class="badge text-bg-' + helpers.statusBadgeClass(machine.status) + '">' + escapeHtml(machine.status) + "</span></td>",
        '<td data-label="PM Status"><span class="badge text-bg-' + helpers.statusBadgeClass(relatedPm ? relatedPm.status : "Stable") + '">' + escapeHtml(relatedPm ? relatedPm.status : "Stable") + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Renewal Watch", [
      {
        label: "Renewal Decision",
        note: "Commercial and service continuity approval should close this week.",
        value: "Open",
        badgeClass: "warning"
      },
      {
        label: "Vendor Rate Review",
        note: "Monthly cost and response terms need reconfirmation before renewal.",
        value: "Review",
        badgeClass: "info"
      },
      {
        label: "Machine Continuity",
        note: "RM-2008 and RM-2010 should not lose support during active review.",
        value: "Risk",
        badgeClass: "danger"
      }
    ]);

    renderStatusLines("Support Contact", [
      { label: vendor.contactPerson, note: vendor.contactRole, value: "Main", badgeClass: "primary" },
      { label: "Mobile", note: vendor.phone, value: "Call", badgeClass: "success" },
      { label: "Email", note: vendor.email, value: "Mail", badgeClass: "info" },
      { label: "Typical Response", note: vendor.responseHours + " hour expected response", value: "SLA", badgeClass: "warning" }
    ]);

    renderActivityList("Agreement Timeline", [
      {
        color: "warning",
        title: agreement.id + " entered expiry warning watch",
        note: "30-day notice triggered for management review and vendor negotiation.",
        time: "22 Apr"
      },
      {
        color: "success",
        title: "Coverage review completed",
        note: "Linked machine list and PM risk were rechecked against current data.",
        time: "21 Apr"
      },
      {
        color: "danger",
        title: "PM escalation linked to agreement",
        note: "Vendor-aware PM delay on RM-2010 remains visible in agreement review.",
        time: "18 Apr"
      }
    ]);
  }

  function renderTicketDetailsPage() {
    if (!data || currentFileName !== "ticket-details.html") {
      return;
    }

    const ticket = getTicket(data.pageContext.ticketDetailsId);
    const machine = helpers.getMachine(ticket.machineId);
    const vendor = helpers.getMachineVendor(machine.id);
    const agreement = helpers.getMachineAgreement(machine.id);
    const updates = data.histories.ticketUpdates[ticket.id] || [];
    const looperPart = data.spareParts.find(function (part) {
      return part.linkedMachines.indexOf(machine.id) > -1;
    });
    const topCard = document.querySelector(".content-section .erp-card");

    if (!ticket || !machine || !agreement || !topCard) {
      return;
    }

    const badgeWrap = topCard.querySelector(".section-header .d-flex");
    if (badgeWrap) {
      badgeWrap.innerHTML = '<span class="badge text-bg-danger">High Priority</span><span class="badge text-bg-info">' + escapeHtml(ticket.status) + "</span>";
    }

    const overviewText = topCard.querySelector(".section-text");
    if (overviewText) {
      overviewText.textContent = "This ticket now follows the same centralized ticket, machine, vendor, agreement, and technician update chain used in breakdown, machine, and rent pages.";
    }

    setInputValue("detailTicketNo", ticket.id);
    setInputValue("detailMachineCode", machine.id);
    setInputValue("detailMachineType", machine.type);
    setInputValue("detailLocation", machine.floor + " / " + machine.line);
    setFilterMeta(
      'Raised: <strong>' + escapeHtml(formatDate(ticket.date)) + ", 10:10 AM</strong>",
      "Raised by " + ticket.raisedBy + " | Linked agreement: " + agreement.id
    );

    renderSummaryCards([
      {
        label: "Response Window",
        value: "22 Min",
        valueClass: "text-success",
        note: "Technician accepted within expected response time"
      },
      {
        label: "Downtime",
        value: ticket.downtimeHours.toFixed(1) + " Hrs",
        valueClass: "text-warning",
        note: ticket.impact
      },
      {
        label: "Technician Stage",
        value: ticket.status,
        valueClass: "text-primary",
        note: "Repair note and production acceptance are both required"
      },
      {
        label: "Spare Parts Impact",
        value: looperPart ? looperPart.status : "Check",
        valueClass: "text-danger",
        note: looperPart ? looperPart.name + " may be required if issue repeats" : "Support review required"
      }
    ]);

    renderGridStatItems("Complaint and Machine Context", [
      { label: "Problem Type", note: ticket.issue, value: ticket.priority, badgeClass: helpers.priorityBadgeClass(ticket.priority) },
      { label: "Ownership", note: "Rent machine under service agreement", value: machine.ownership, badgeClass: "primary" },
      { label: "Vendor", note: vendor ? vendor.name : "Not Applicable", value: vendor ? "Linked" : "Own", badgeClass: vendor ? "secondary" : "dark" },
      { label: "Production Impact", note: ticket.impact, value: "Operational Loss", badgeClass: "danger" }
    ]);

    updateCompactNote("Complaint and Machine Context", "Current complaint context now matches the same machine, agreement, and vendor linkage visible on rent machine details and history pages.");

    renderTable("Assignment and Workflow Control", [
      { item: "Raised By", details: ticket.raisedBy + ", " + ticket.raisedRole, status: "Captured" },
      { item: "Assigned Technician", details: ticket.technician + " accepted the job after line visit.", status: "Assigned" },
      { item: "Target Response", details: "Within 30 minutes from complaint raise time", status: "Met" },
      { item: "Escalation", details: ticket.escalation + " because vendor-ready review may still be needed", status: "Stand By" },
      { item: "Closure Owner", details: "Production confirmation by supervisor before close", status: "Pending" }
    ].map(function (item) {
      return [
        "<tr>",
        '<td data-label="Workflow Item"><strong>' + escapeHtml(item.item) + "</strong></td>",
        '<td data-label="Details">' + escapeHtml(item.details) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Technician Work Updates", updates.map(function (entry) {
      return [
        "<tr>",
        '<td data-label="Time">' + escapeHtml(entry.time) + "</td>",
        '<td data-label="Updated By">' + escapeHtml(entry.updatedBy) + "</td>",
        '<td data-label="Work Note">' + escapeHtml(entry.workNote) + "</td>",
        '<td data-label="Next Step">' + escapeHtml(entry.nextStep) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(entry.status) + '">' + escapeHtml(entry.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderGridStatItems("Spare Parts and Repair Decision", [
      { label: "Current Parts Decision", note: "No issue part has been consumed yet from store.", value: "Hold", badgeClass: "secondary" },
      { label: "Probable Requirement", note: looperPart ? looperPart.name + " may be required if vibration repeats." : "Observation only", value: "Conditional", badgeClass: "warning" },
      { label: "Store Coordination", note: looperPart ? "In stock: " + looperPart.stockQty + " pcs under low-stock watch." : "Store review pending", value: "Available", badgeClass: "success" },
      { label: "Vendor Support Need", note: "Escalate only if repeat issue appears in same monitored shift.", value: "Optional", badgeClass: "info" }
    ]);

    renderSimpleStack("Current Status Board", [
      { label: "Ticket Stage", note: "Assigned and under technician monitoring.", value: ticket.status, badgeClass: "info" },
      { label: "Production Confirmation", note: "Supervisor must confirm stable output before closure.", value: "Pending", badgeClass: "warning" },
      { label: "Closure Readiness", note: "Close only after monitored run is stable.", value: "Watch", badgeClass: "success" }
    ]);

    renderSimpleStack("Workflow Timeline", [
      { label: "Complaint Raised", note: formatDate(ticket.date) + " by " + ticket.raisedBy, value: "Done", badgeClass: "success" },
      { label: "Technician Assigned", note: ticket.technician + " accepted within target response.", value: "Done", badgeClass: "success" },
      { label: "Repair in Progress", note: "Current monitoring after looper timing reset.", value: "Running", badgeClass: "info" },
      { label: "Production Sign-Off", note: "Needed before close and history move.", value: "Next", badgeClass: "warning" }
    ]);

    renderListGroup("Related Links", [
      { href: "rent-machines.html", label: "Rent Machine Register", value: machine.id },
      { href: "agreements.html", label: "Agreement Register", value: agreement.id },
      { href: "pm-schedule.html", label: "PM Schedule Review", value: "Monthly" },
      { href: "reports.html", label: "Breakdown Reports", value: "Dashboard" }
    ]);
  }

  function renderTicketAssignPage() {
    if (!data || currentFileName !== "ticket-assign.html") {
      return;
    }

    const ticket = getTicket(data.pageContext.ticketAssignId);
    const machine = helpers.getMachine(ticket.machineId);
    const topCard = document.querySelector(".content-section .erp-card");

    if (!ticket || !machine || !topCard) {
      return;
    }

    const badges = topCard.querySelector(".section-header .d-flex");
    if (badges) {
      badges.innerHTML = '<span class="badge text-bg-danger">' + escapeHtml(ticket.status) + '</span><span class="badge text-bg-danger">' + escapeHtml(ticket.priority) + " Priority</span>";
    }

    setInputValue("assignTicketNo", ticket.id);
    setInputValue("assignMachineCode", machine.id);
    setInputValue("assignMachineType", machine.type);
    setInputValue("assignLocation", machine.floor + " / " + machine.line);
    setFilterMeta(
      'Raised: <strong>' + escapeHtml(formatDate(ticket.date)) + ", 09:10 AM</strong>",
      "Raised by " + ticket.raisedBy + " | Problem: " + ticket.issue
    );
    setInputValue("assignedTechnician", "Rafiqul Islam");
    setInputValue("assignedBy", "Rahima Begum");
    setInputValue("assignmentDate", ticket.date);
    setInputValue("assignmentTime", "09:18");
    setInputValue("relatedVendor", "Not Applicable");
    setInputValue("assignmentInstruction", "Please attend " + machine.line + " immediately. Check looper timing first and confirm if any spare support is needed.");
  }

  function renderTechnicianTaskUpdatePage() {
    if (!data || currentFileName !== "technician-task-update.html") {
      return;
    }

    const ticket = getTicket(data.pageContext.technicianUpdateReference);
    const machine = helpers.getMachine(ticket.machineId);
    const updates = data.histories.ticketUpdates[ticket.id] || [];

    if (!ticket || !machine) {
      return;
    }

    setInputValue("taskReference", ticket.id);
    setInputValue("taskMachineCode", machine.id);
    setInputValue("taskMachineType", machine.type);
    setInputValue("taskLocation", machine.floor + " / " + machine.line);
    setFilterMeta(
      'Assigned Technician: <strong>' + escapeHtml(ticket.technician) + "</strong>",
      "Raised by " + ticket.raisedBy + " | Priority: " + ticket.priority
    );
    setInputValue("updateDate", ticket.date);
    setInputValue("updateTechnician", ticket.technician);
    setInputValue("workDone", updates[1] ? updates[1].workNote : "Corrective update in progress.");
    setInputValue("currentObservation", updates[updates.length - 1] ? updates[updates.length - 1].nextStep : "Monitor current output.");

    renderSummaryCards([
      { label: "Current Stage", value: "Trial", valueClass: "text-info", note: "Machine is under monitored run after corrective action" },
      { label: "Response Time", value: "22 Min", valueClass: "text-success", note: "Accepted within expected ticket response window" },
      { label: "Support Need", value: "Watch", valueClass: "text-warning", note: "Spare or vendor decision depends on repeat behavior" },
      { label: "Next Decision", value: "Close / Escalate", valueClass: "text-primary", note: "Depends on supervisor production confirmation" }
    ]);

    renderTable("Recent Update History", updates.map(function (entry) {
      return [
        "<tr>",
        '<td data-label="Time">' + escapeHtml(entry.time) + "</td>",
        '<td data-label="Updated By">' + escapeHtml(entry.updatedBy) + "</td>",
        '<td data-label="Work Note">' + escapeHtml(entry.workNote) + "</td>",
        '<td data-label="Next Step">' + escapeHtml(entry.nextStep) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(entry.status) + '">' + escapeHtml(entry.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));
  }

  function renderTechnicianTasksPage() {
    if (!data || currentFileName !== "technician-tasks.html") {
      return;
    }

    const tasks = data.histories.technicianBoard;

    renderSummaryCards([
      { label: "Assigned Today", value: "12", valueClass: "text-primary", note: "Combined breakdown and PM responsibilities in current shift" },
      { label: "In Progress", value: String(tasks.filter(function (task) { return task.status === "In Progress"; }).length), valueClass: "text-warning", note: "Need latest note before shift handover" },
      { label: "Completed", value: "9", valueClass: "text-success", note: "Ready for closure, acceptance, or PM completion" },
      { label: "Need Spare / Support", value: "3", valueClass: "text-danger", note: "Waiting for store, vendor, or supervisor decision" }
    ]);

    renderTable("Technician Work Register", tasks.map(function (task) {
      const machine = helpers.getMachine(task.machineId);
      return [
        "<tr>",
        '<td data-label="Reference"><strong>' + escapeHtml(task.reference) + '</strong><div class="cell-muted">' + escapeHtml(task.type === "PM" ? "Scheduled plan" : "Raised from breakdown flow") + "</div></td>",
        '<td data-label="Type"><span class="badge text-bg-' + (task.type === "PM" ? "primary" : "danger") + '">' + escapeHtml(task.type) + "</span></td>",
        '<td data-label="Machine / Location"><strong>' + escapeHtml(machine.id) + '</strong><div class="cell-muted">' + escapeHtml(machine.type + ", " + machine.line) + "</div></td>",
        '<td data-label="Assigned Technician"><strong>' + escapeHtml(task.technician) + '</strong><div class="cell-muted">Central task board assignment</div></td>',
        '<td data-label="Current Work Note"><strong>' + escapeHtml(task.note) + "</strong></td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(task.status) + '">' + escapeHtml(task.status) + "</span></td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="' + task.actionHref + '" class="btn btn-sm btn-outline-primary">' + escapeHtml(task.actionLabel) + '</a><a href="' + task.secondaryHref + '" class="btn btn-sm btn-outline-secondary">' + escapeHtml(task.secondaryLabel) + "</a></div></td>",
        "</tr>"
      ].join("");
    }).join(""));

    setInputValue("updateReference", tasks[0].reference);
    renderSimpleStack("Technician Load Board", helpers.getTechnicianLoad().map(function (item) {
      return {
        label: item.technician,
        note: item.breakdown + " breakdown and " + item.pm + " PM responsibilities currently visible.",
        value: item.breakdown + item.pm > 3 ? "Busy" : "Balanced",
        badgeClass: item.breakdown + item.pm > 3 ? "warning" : "primary"
      };
    }));
  }

  function renderMachineHistoryPage() {
    if (!data || currentFileName !== "machine-history.html") {
      return;
    }

    const entries = data.histories.machineEvents;

    renderTable("Machine History Register", entries.map(function (entry) {
      const machine = helpers.getMachine(entry.machineId);
      return [
        "<tr>",
        '<td data-label="Date / Time"><strong>' + escapeHtml(formatDate(entry.date)) + '</strong><div class="cell-muted">' + escapeHtml(entry.time) + "</div></td>",
        '<td data-label="Machine"><strong>' + escapeHtml(machine.id) + '</strong><div class="cell-muted">' + escapeHtml(machine.type + ", " + machine.line) + "</div></td>",
        '<td data-label="Event Type"><span class="badge text-bg-' + (entry.eventType === "Breakdown" ? "danger" : entry.eventType === "PM Update" ? "primary" : "secondary") + '">' + escapeHtml(entry.eventType) + "</span></td>",
        '<td data-label="History Details"><strong>' + escapeHtml(entry.details) + "</strong></td>",
        '<td data-label="Linked Ref"><strong>' + escapeHtml(entry.linkedRef) + '</strong><div class="cell-muted">' + escapeHtml(entry.linkedRefType) + "</div></td>",
        '<td data-label="Updated By">' + escapeHtml(entry.updatedBy) + "</td>",
        '<td data-label="Status After Event"><span class="badge text-bg-' + helpers.statusBadgeClass(entry.statusAfterEvent) + '">' + escapeHtml(entry.statusAfterEvent) + "</span></td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="' + (machine.ownership === "Rent" ? "rent-machine-details.html" : "machine-details.html") + '" class="btn btn-sm btn-outline-primary">Details</a><a href="' + (entry.linkedRef.indexOf("BD-") === 0 ? "ticket-details.html" : "pm-schedule.html") + '" class="btn btn-sm btn-outline-secondary">Open</a></div></td>',
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Machine Event Review", helpers.getRepeatIssueMachines().map(function (machine) {
      return [
        "<tr>",
        '<td data-label="Machine"><strong>' + escapeHtml(machine.id) + '</strong><div class="cell-muted">' + escapeHtml(machine.type + ", " + machine.line) + "</div></td>",
        '<td data-label="Pattern">Repeat issue watch active in central machine registry.</td>',
        '<td data-label="Impact">' + escapeHtml(machine.line + " production depends on faster review and closure discipline.") + "</td>",
        '<td data-label="Suggested Follow-Up">Check root cause, PM discipline, and spare dependency together.</td>',
        '<td data-label="Status"><span class="badge text-bg-warning">Watch</span></td>',
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("History Snapshot", [
      { label: "Movement Entries", note: "Centralized machine history now reuses the same machine, ticket, and PM IDs.", value: "Synced", badgeClass: "primary" },
      { label: "Repeat Machines", note: helpers.getRepeatIssueMachines().map(function (machine) { return machine.id; }).join(", "), value: "3", badgeClass: "warning" },
      { label: "Rent-Linked Events", note: "RM-2008 and RM-2010 remain the main agreement-aware follow-up cases.", value: "2", badgeClass: "danger" }
    ]);

    renderActivityList("Recent History Notes", entries.slice(0, 3).map(function (entry) {
      return {
        color: entry.eventType === "Breakdown" ? "danger" : "primary",
        title: entry.machineId + " updated with " + entry.linkedRef,
        note: entry.details,
        time: formatShortDate(entry.date)
      };
    }));

    renderMiniStatList("History Watch", [
      { label: "MC-1014 repeat watch", note: "Breakdown and PM are both open in current history.", value: "Review", badgeClass: "warning" },
      { label: "RM-2008 replacement review", note: "Return / replace flow is already linked with breakdown and PM defer.", value: "Active", badgeClass: "danger" },
      { label: "RM-2010 PM delay", note: "Overdue PM still depends on spare and vendor-aware support.", value: "Pending", badgeClass: "primary" }
    ]);
  }

  function renderRentMachineHistoryPage() {
    if (!data || currentFileName !== "rent-machine-history.html") {
      return;
    }

    const machine = helpers.getMachine(data.pageContext.rentMachineDetailsId);
    const vendor = helpers.getMachineVendor(machine.id);
    const agreement = helpers.getMachineAgreement(machine.id);
    const ticket = getTicket("BD-2026-0119");
    const pmPlan = getPmPlan("PM-2026-045");
    const historyEntries = data.histories.rentMachineHistory[machine.id] || [];
    const allocations = data.histories.rentMachineAllocations[machine.id] || [];
    const request = data.histories.returnReplaceRequests.find(function (item) {
      return item.machineId === machine.id;
    });

    if (!machine || !vendor || !agreement || !ticket || !pmPlan) {
      return;
    }

    const summaryCards = document.querySelectorAll(".summary-card");
    if (summaryCards[0]) {
      summaryCards[0].innerHTML = '<span class="summary-label">Rent Machine Code</span><h3 class="summary-value text-primary">' + escapeHtml(machine.id) + '</h3><p class="summary-note mb-0">' + escapeHtml(machine.name) + '</p><div class="cell-muted mt-2">Brand / Model: ' + escapeHtml(machine.brand + " " + machine.model) + "</div>";
    }
    if (summaryCards[1]) {
      summaryCards[1].innerHTML = '<span class="summary-label">Vendor and Agreement</span><h3 class="summary-value">' + escapeHtml(vendor.name) + '</h3><p class="summary-note mb-0">' + escapeHtml(agreement.id) + '</p><div class="cell-muted mt-2">Monthly Rent: BDT ' + escapeHtml(machine.monthlyRent || 14500) + "</div>";
    }
    if (summaryCards[2]) {
      summaryCards[2].innerHTML = '<span class="summary-label">Rent Period</span><h3 class="summary-value text-warning">' + escapeHtml(formatDate(machine.receiveDate)) + '</h3><p class="summary-note mb-0">Receive Date</p><div class="cell-muted mt-2">End Date: ' + escapeHtml(formatDate(agreement.endDate)) + "</div>";
    }
    if (summaryCards[3]) {
      summaryCards[3].innerHTML = '<span class="summary-label">Current Location and Status</span><h3 class="summary-value">' + escapeHtml(machine.floor.replace("Sewing ", "")) + '</h3><p class="summary-note mb-0">' + escapeHtml(machine.line) + '</p><div class="mt-2"><span class="badge text-bg-' + helpers.statusBadgeClass(machine.status) + '">' + escapeHtml(machine.status) + "</span></div>";
    }

    const snapshotBadges = findCardByTitle("Rent Machine Summary Snapshot");
    if (snapshotBadges) {
      const badgeWrap = snapshotBadges.querySelector(".section-header .d-flex");
      if (badgeWrap) {
        badgeWrap.innerHTML = '<span class="badge text-bg-primary">Rent</span><span class="badge text-bg-warning">' + escapeHtml(machine.status) + "</span>";
      }

      const inputs = snapshotBadges.querySelectorAll("input.form-control");
      if (inputs[0]) {
        inputs[0].value = machine.serialNo;
      }
      if (inputs[1]) {
        inputs[1].value = machine.floor;
      }
      if (inputs[2]) {
        inputs[2].value = machine.line;
      }
      if (inputs[3]) {
        inputs[3].value = machine.status;
      }
    }

    renderGridStatItems("Machine Profile Card", [
      { label: "Machine Code", note: machine.id, value: machine.ownership, badgeClass: "primary" },
      { label: "Machine Type", note: machine.name, value: "Production", badgeClass: "secondary" },
      { label: "Brand", note: machine.brand, value: "Brand", badgeClass: "dark" },
      { label: "Model", note: machine.model, value: "Model", badgeClass: "info" },
      { label: "Serial No", note: machine.serialNo, value: "Tracked", badgeClass: "secondary" },
      { label: "Current Status", note: ticket ? ticket.issue : machine.status, value: machine.status, badgeClass: helpers.statusBadgeClass(machine.status) }
    ]);

    updateCompactNote("Machine Profile Card", "Remarks: RM-2008 remains under corrective review, so PM, vendor response, and replacement readiness all stay linked through the same central records.");

    renderTable("Allocation History", allocations.map(function (entry) {
      return [
        "<tr>",
        '<td data-label="Date">' + escapeHtml(formatDate(entry.date)) + "</td>",
        '<td data-label="Floor">' + escapeHtml(entry.floor) + "</td>",
        '<td data-label="Line">' + escapeHtml(entry.line) + "</td>",
        '<td data-label="Allocated By">' + escapeHtml(entry.allocatedBy) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(entry.status) + '">' + escapeHtml(entry.status) + "</span></td>",
        '<td data-label="Remarks">' + escapeHtml(entry.remarks) + "</td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Breakdown History", helpers.getMachineTickets(machine.id).map(function (ticketItem) {
      return [
        "<tr>",
        '<td data-label="Ticket No"><strong>' + escapeHtml(ticketItem.id) + "</strong></td>",
        '<td data-label="Date">' + escapeHtml(formatDate(ticketItem.date)) + "</td>",
        '<td data-label="Problem">' + escapeHtml(ticketItem.issue) + "</td>",
        '<td data-label="Priority"><span class="badge text-bg-' + helpers.priorityBadgeClass(ticketItem.priority) + '">' + escapeHtml(ticketItem.priority) + "</span></td>",
        '<td data-label="Technician">' + escapeHtml(ticketItem.technician || "Not Assigned") + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(ticketItem.status) + '">' + escapeHtml(ticketItem.status) + "</span></td>",
        '<td data-label="Downtime">' + escapeHtml(ticketItem.downtimeHours.toFixed(1) + " Hrs") + "</td>",
        '<td data-label="Action"><a href="ticket-details.html" class="btn btn-sm btn-outline-primary">Details</a></td>',
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Maintenance History", helpers.getMachinePmPlans(machine.id).map(function (plan) {
      return [
        "<tr>",
        '<td data-label="Date">' + escapeHtml(formatDate(plan.nextDue)) + "</td>",
        '<td data-label="Maintenance Type">' + escapeHtml(plan.frequency + " PM") + "</td>",
        '<td data-label="Description">' + escapeHtml(plan.exceptionReason || "Checklist review and service update recorded in central PM plan.") + "</td>",
        '<td data-label="Technician">' + escapeHtml(plan.technician) + "</td>",
        '<td data-label="Spare Used">' + escapeHtml(plan.vendorAware ? "Vendor-aware / low-stock watch" : "No") + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(plan.status) + '">' + escapeHtml(plan.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Vendor and Agreement Information", [
      { label: "Vendor Name", note: vendor.name, value: "Linked", badgeClass: "primary" },
      { label: "Contact Person", note: vendor.contactPerson, value: "Vendor", badgeClass: "secondary" },
      { label: "Phone", note: vendor.phone, value: "Active", badgeClass: "secondary" },
      { label: "Agreement Number", note: agreement.id, value: "Contract", badgeClass: "dark" },
      { label: "Agreement Start", note: formatDate(agreement.startDate), value: "Start", badgeClass: "info" },
      { label: "Agreement End", note: formatDate(agreement.endDate), value: "End", badgeClass: "warning" },
      { label: "Contract Status", note: agreement.status, value: agreement.status, badgeClass: helpers.statusBadgeClass(agreement.status) },
      { label: "Monthly Rent Amount", note: "BDT " + (machine.monthlyRent || 14500), value: "Monthly", badgeClass: "primary" }
    ]);

    renderTable("Return / Replace History", [
      "<tr>",
      '<td data-label="Returned"><span class="badge text-bg-secondary">No</span></td>',
      '<td data-label="Replaced"><span class="badge text-bg-warning">' + escapeHtml(machine.returnReplaceStatus === "Replacement Review" ? "Review" : "No") + "</span></td>",
      '<td data-label="Return Date">Not Applied</td>',
      '<td data-label="Replace Date">' + escapeHtml(formatDate(request.requestDate)) + "</td>",
      '<td data-label="Reason">' + escapeHtml(request.reason) + "</td>",
      '<td data-label="Remarks">' + escapeHtml(request.remarks) + "</td>",
      "</tr>"
    ].join(""));

    renderTimeline("Status Timeline", [
      { label: "Machine Received", note: formatDate(machine.receiveDate) + " | Rent machine received in usable condition", color: "primary" },
      { label: "Vendor Linked", note: formatDate(machine.receiveDate) + " | " + vendor.name + " assigned as support vendor", color: "info" },
      { label: "Agreement Linked", note: formatDate(machine.receiveDate) + " | " + agreement.id + " mapped to the machine", color: "dark" },
      { label: "Allocated to Line", note: formatDate(allocations[0].date) + " | Active allocation kept on " + allocations[0].line, color: "success" },
      { label: "Breakdown Reported", note: formatDate(historyEntries[0].date) + " | " + historyEntries[0].details, color: "danger" },
      { label: "Maintenance / PM Hold", note: formatDate(pmPlan.nextDue) + " | " + pmPlan.exceptionReason, color: "warning" },
      { label: "Return / Replace Review", note: formatDate(request.requestDate) + " | " + request.remarks, color: "secondary" }
    ]);
  }

  function renderPmDuePage() {
    if (!data || currentFileName !== "pm-due.html") {
      return;
    }

    const focusPlans = data.pmPlans.filter(function (plan) {
      return ["Due", "Overdue", "Planned"].indexOf(plan.status) > -1;
    });

    renderSummaryCards([
      { label: "Due Today", value: String(data.metrics.pm.dueToday), valueClass: "text-warning", note: "Need PM closure before current shift ends" },
      { label: "Overdue", value: String(data.metrics.pm.overdue), valueClass: "text-danger", note: "Pending from previous dates and lowering compliance" },
      { label: "Rent Machines at Risk", value: "2", valueClass: "text-primary", note: "RM-2008 and RM-2010 need vendor-aware PM follow-up" },
      { label: "Planned to Close Today", value: String(data.metrics.pm.completed - 26), valueClass: "text-success", note: "Expected closures from active technician queue" }
    ]);

    const alertStrip = document.querySelector(".alert-strip");
    if (alertStrip) {
      alertStrip.textContent = "RM-2008 and RM-2010 remain the main rent-machine PM pressure points. Spare shortage and corrective work are both affecting closure timing.";
    }

    renderTable("Due PM Register", focusPlans.map(function (plan) {
      const machine = helpers.getMachine(plan.machineId);
      const agreement = helpers.getMachineAgreement(plan.machineId);
      const delayLabel = plan.status === "Overdue" ? Math.max(1, Math.round((new Date("2026-04-23") - new Date(plan.nextDue)) / 86400000)) + " Days" : "Today";
      const delayNote = plan.exceptionReason || "Not started yet";
      return [
        "<tr>",
        '<td data-label="Plan No"><strong>' + escapeHtml(plan.id) + '</strong><div class="cell-muted">' + escapeHtml(plan.frequency + " PM") + "</div></td>",
        '<td data-label="Machine / Location"><strong>' + escapeHtml(machine.id) + '</strong><div class="cell-muted">' + escapeHtml(machine.type + ", " + machine.line) + "</div></td>",
        '<td data-label="Frequency"><span class="badge text-bg-' + (plan.frequency === "Monthly" ? "dark" : plan.frequency === "Weekly" ? "info" : "primary") + '">' + escapeHtml(plan.frequency) + "</span></td>",
        '<td data-label="Next Due"><strong>' + escapeHtml(formatDate(plan.nextDue)) + '</strong><div class="cell-muted">' + escapeHtml(agreement ? "Agreement " + agreement.id : "Own machine PM plan") + "</div></td>",
        '<td data-label="Delay"><strong>' + escapeHtml(delayLabel) + '</strong><div class="cell-muted">' + escapeHtml(delayNote) + "</div></td>",
        '<td data-label="Assigned Technician"><strong>' + escapeHtml(plan.technician) + '</strong><div class="cell-muted">' + escapeHtml(plan.vendorAware ? "Vendor-aware follow-up" : "Internal PM queue") + "</div></td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(plan.status) + '">' + escapeHtml(plan.status) + "</span></td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="' + (machine.ownership === "Rent" ? "rent-machine-details.html" : "machine-details.html") + '" class="btn btn-sm btn-outline-primary">Machine</a><a href="technician-tasks.html" class="btn btn-sm btn-outline-secondary">Follow Up</a></div></td>',
        "</tr>"
      ].join("");
    }).join(""));

    renderSimpleStack("Priority Follow-Up Board", [
      { label: "Critical Overdue", note: "PM-2026-043 on RM-2010 is blocked by motor belt shortage.", value: "Escalate", badgeClass: "danger" },
      { label: "Rent Machine PM", note: "PM-2026-045 on RM-2008 remains planned until corrective work is stable.", value: "Vendor Risk", badgeClass: "primary" },
      { label: "Breakdown Conflict", note: "MC-1014 and RM-2008 are consuming the same technician pool as due PM work.", value: "Balance", badgeClass: "warning" }
    ]);

    renderTable("Area-Wise Overdue", data.lines.map(function (line) {
      const linePlans = focusPlans.filter(function (plan) {
        const machine = helpers.getMachine(plan.machineId);
        return machine && machine.line === line.line;
      });
      const dueCount = linePlans.filter(function (plan) { return plan.status === "Due" || plan.status === "Planned"; }).length;
      const overdueCount = linePlans.filter(function (plan) { return plan.status === "Overdue"; }).length;
      const areaStatus = overdueCount > 0 ? "Urgent" : dueCount > 0 ? "Watch" : "Running";
      return [
        "<tr>",
        '<td data-label="Area"><strong>' + escapeHtml(line.line) + "</strong></td>",
        '<td data-label="Due">' + escapeHtml(dueCount) + "</td>",
        '<td data-label="Overdue">' + escapeHtml(overdueCount) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(areaStatus) + '">' + escapeHtml(areaStatus) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderActivityList("Today Closure Target", focusPlans.slice(0, 3).map(function (plan) {
      const machine = helpers.getMachine(plan.machineId);
      return {
        color: plan.status === "Overdue" ? "danger" : "primary",
        title: plan.id + " for " + machine.id,
        note: "Assigned to " + plan.technician + ". Next step: " + (plan.exceptionReason || "Close checklist and update due chain."),
        time: formatShortDate(plan.nextDue)
      };
    }));
  }

  function renderReturnReplacePage() {
    if (!data || currentFileName !== "return-replace.html") {
      return;
    }

    const requests = data.histories.returnReplaceRequests;
    const activeRequest = requests[0];
    const machine = helpers.getMachine(activeRequest.machineId);
    const vendor = helpers.getMachineVendor(machine.id);
    const agreement = helpers.getMachineAgreement(machine.id);

    setInputValue("requestDate", activeRequest.requestDate);
    setInputValue("requestType", activeRequest.requestType);
    setInputValue("requestMachineCode", machine.id);
    setInputValue("requestStatus", activeRequest.flowStatus);
    setInputValue("requestVendor", vendor.name);
    setInputValue("requestAgreement", agreement.id);
    setInputValue("currentAllocation", machine.line + ", " + machine.floor);
    setInputValue("requestRaisedBy", activeRequest.requestedBy);
    setInputValue("problemReference", activeRequest.issueReference);
    setInputValue("vendorReplyDate", activeRequest.vendorReplyDate);
    setInputValue("approvedBy", activeRequest.approvedBy);
    setInputValue("completionTarget", activeRequest.completionTarget);
    setInputValue("requestReason", activeRequest.reason);

    const requestCard = findCardByTitle("Request Entry Form");
    if (requestCard) {
      const badge = requestCard.querySelector(".section-header .badge");
      if (badge) {
        badge.textContent = "Request No: " + activeRequest.id;
      }
    }

    renderTable("Open Return and Replacement Requests", requests.filter(function (request) {
      return request.flowStatus !== "Completed";
    }).map(function (request) {
      const requestMachine = helpers.getMachine(request.machineId);
      const requestVendor = helpers.getMachineVendor(request.machineId);
      const requestAgreement = helpers.getMachineAgreement(request.machineId);
      return [
        "<tr>",
        '<td data-label="Request No"><strong>' + escapeHtml(request.id) + "</strong></td>",
        '<td data-label="Machine"><strong>' + escapeHtml(requestMachine.id) + '</strong><div class="cell-muted">' + escapeHtml(requestMachine.type + ", " + requestMachine.line) + "</div></td>",
        '<td data-label="Request Type">' + escapeHtml(request.requestType) + "</td>",
        '<td data-label="Vendor"><strong>' + escapeHtml(requestVendor.name) + '</strong><div class="cell-muted">' + escapeHtml(requestAgreement.id) + "</div></td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(request.flowStatus) + '">' + escapeHtml(request.flowStatus) + "</span></td>",
        '<td data-label="Target">' + escapeHtml(formatDate(request.completionTarget)) + "</td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Completed History", requests.filter(function (request) {
      return request.flowStatus === "Completed";
    }).map(function (request) {
      const requestMachine = helpers.getMachine(request.machineId);
      return [
        "<tr>",
        '<td data-label="Request No"><strong>' + escapeHtml(request.id) + "</strong></td>",
        '<td data-label="Machine"><strong>' + escapeHtml(requestMachine.id) + "</strong></td>",
        '<td data-label="Request Type">' + escapeHtml(request.requestType) + "</td>",
        '<td data-label="Completed On">' + escapeHtml(formatDate(request.completionTarget)) + "</td>",
        '<td data-label="Outcome"><span class="badge text-bg-success">Completed</span></td>',
        '<td data-label="Remarks">' + escapeHtml(request.remarks) + "</td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderActivityList("Recent Flow Updates", requests.slice(0, 3).map(function (request) {
      return {
        color: request.flowStatus === "Completed" ? "success" : "warning",
        title: request.machineId + " " + request.requestType.toLowerCase() + " request updated",
        note: request.remarks,
        time: formatShortDate(request.requestDate)
      };
    }));
  }

  function renderBreakdownHistoryPage() {
    if (!data || currentFileName !== "breakdown-history.html") {
      return;
    }

    renderTable("Breakdown History Register", data.histories.breakdownHistory.map(function (entry) {
      const machine = helpers.getMachine(entry.machineId);
      return [
        "<tr>",
        '<td data-label="Ticket No"><strong>' + escapeHtml(entry.ticketId) + '</strong><div class="cell-muted">' + escapeHtml(entry.finalStatus) + "</div></td>",
        '<td data-label="Machine / Location"><strong>' + escapeHtml(machine.id) + '</strong><div class="cell-muted">' + escapeHtml(machine.type + ", " + machine.line) + "</div></td>",
        '<td data-label="Issue Summary"><strong>' + escapeHtml(entry.issueSummary) + '</strong><div class="cell-muted">' + escapeHtml(entry.closureNote) + "</div></td>",
        '<td data-label="Technician"><strong>' + escapeHtml(entry.technician) + "</strong></td>",
        '<td data-label="Raised">' + escapeHtml(entry.raisedAt) + "</td>",
        '<td data-label="Closed">' + escapeHtml(entry.closedAt) + "</td>",
        '<td data-label="Closure Time">' + escapeHtml(entry.closureTime) + "</td>",
        '<td data-label="Final Status"><span class="badge text-bg-' + helpers.statusBadgeClass(entry.finalStatus) + '">' + escapeHtml(entry.finalStatus) + "</span></td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="ticket-details.html" class="btn btn-sm btn-outline-primary">Details</a><a href="' + (machine.ownership === "Rent" ? "rent-machine-details.html" : "machine-details.html") + '" class="btn btn-sm btn-outline-secondary">Machine</a></div></td>',
        "</tr>"
      ].join("");
    }).join(""));

    renderActivityList("Recent Closure Updates", data.histories.breakdownHistory.slice(0, 3).map(function (entry) {
      return {
        color: entry.finalStatus === "Closed" ? "success" : "warning",
        title: entry.ticketId + " moved to " + entry.finalStatus,
        note: entry.closureNote,
        time: entry.closedAt.split(",")[0]
      };
    }));
  }

  function renderBreakdownReportPage() {
    if (!data || currentFileName !== "report-breakdown.html") {
      return;
    }

    const metrics = data.reportMetrics ? data.reportMetrics.breakdown : {};
    const reportView = data.reportViews ? data.reportViews.breakdown : null;

    updateHeaderActions(["All Reports", "Export Breakdown GM Review"]);
    setFilterMeta(
      'Report Date: <strong>' + escapeHtml(formatDate(new Date())) + "</strong>",
      "MTTR " + metrics.averageDowntimeHours + " Hrs | Repeat Risk " + metrics.repeatIssueMachines + " machines | Root Cause Pending " + metrics.rootCausePending
    );
    renderSummaryCards([
      {
        label: "Reported Tickets",
        value: String(metrics.reportedTickets),
        valueClass: "text-danger",
        note: "Complaint volume reviewed across the selected monthly control period"
      },
      {
        label: "Closure Rate",
        value: metrics.closureRate + "%",
        valueClass: "text-success",
        note: "Closure now reflects stronger assignment and production-acceptance discipline"
      },
      {
        label: "MTTR",
        value: metrics.averageDowntimeHours + " Hrs",
        valueClass: "text-warning",
        note: "Recovery speed is still sensitive to repeat issue, vendor delay, and spare support"
      },
      {
        label: "Repeat Issue Watch",
        value: String(metrics.repeatIssueMachines),
        valueClass: "text-primary",
        note: metrics.lineImpactLines + " lines still carry the main breakdown pressure"
      }
    ]);

    updateStandaloneAlertStrip("Line 03, Line 07, and Line 05 are creating the heaviest production impact. Vendor delay and spare shortage now explain most extended closures.", "warning");
    updateCardSectionText("Breakdown Report Snapshot", "Operational breakdown review linking complaint volume, closure discipline, MTTR, root cause quality, and production acceptance exposure.");
    renderTable("Breakdown Report Snapshot", (reportView ? reportView.snapshot : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Report Area"><strong>' + escapeHtml(item.area) + "</strong></td>",
        '<td data-label="Current Figure"><strong>' + escapeHtml(item.figure) + "</strong></td>",
        '<td data-label="Observation">' + escapeHtml(item.observation) + "</td>",
        '<td data-label="Gap / Risk">' + escapeHtml(item.gap) + "</td>",
        '<td data-label="Suggested Action"><a href="' + escapeHtml(item.action) + '" class="btn btn-sm btn-outline-primary">' + escapeHtml(item.actionLabel) + "</a></td>",
        "</tr>"
      ].join("");
    }).join(""));
    updateCompactNote("Breakdown Report Snapshot", "This breakdown report now gives maintenance and operations management one view of volume, closure, line impact, and repeat-machine pressure.");

    renderTable("Line-Wise Breakdown Summary", (reportView ? reportView.lineWise : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Floor / Line"><strong>' + escapeHtml(item.line) + "</strong></td>",
        '<td data-label="Reported">' + escapeHtml(item.reported) + "</td>",
        '<td data-label="Closed">' + escapeHtml(item.closed) + "</td>",
        '<td data-label="Avg Downtime">' + escapeHtml(item.avgDowntime) + "</td>",
        '<td data-label="Top Machine Type">' + escapeHtml(item.machineType) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Top Repeat Breakdown Machines", (reportView ? reportView.repeatMachines : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Machine"><strong>' + escapeHtml(item.machineId) + '</strong><div class="cell-muted">' + escapeHtml(item.note) + "</div></td>",
        '<td data-label="Ownership"><span class="badge text-bg-' + (item.ownership === "Rent" ? "primary" : "dark") + '">' + escapeHtml(item.ownership) + "</span></td>",
        '<td data-label="Recent Breakdown Count">' + escapeHtml(item.count) + "</td>",
        '<td data-label="Main Issue">' + escapeHtml(item.issue) + "</td>",
        '<td data-label="Suggested Action">' + escapeHtml(item.action) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Root Cause Watch", reportView ? reportView.rootCauseWatch : []);
    renderMiniStatList("Technician Closure Board", reportView ? reportView.technicianClosure : []);
    renderTimelineList("Recent Report Notes", reportView ? reportView.notes : []);
    updateCardSectionText("Operational Notes", "Keep the report practical for maintenance control, production escalation discussion, and monthly management review.");
  }

  function renderPmReportPage() {
    if (!data || currentFileName !== "report-pm.html") {
      return;
    }

    const metrics = data.reportMetrics ? data.reportMetrics.pm : {};
    const reportView = data.reportViews ? data.reportViews.pm : null;

    updateHeaderActions(["All Reports", "Export PM Control Review"]);
    setFilterMeta(
      'Report Date: <strong>' + escapeHtml(formatDate(new Date())) + "</strong>",
      "Compliance " + metrics.compliance + "% | Due / Overdue " + metrics.dueAndOverdue + " | Rent PM Risk " + metrics.rentPmRisk
    );
    renderSummaryCards([
      {
        label: "Scheduled PM Plans",
        value: String(metrics.scheduledPlans),
        note: "Daily, weekly, and monthly PM workload in the selected review period"
      },
      {
        label: "PM Compliance",
        value: metrics.compliance + "%",
        valueClass: "text-success",
        note: "Completion quality is improving, but monthly PM is still the weakest cycle"
      },
      {
        label: "PM Pressure",
        value: String(metrics.dueAndOverdue),
        valueClass: "text-danger",
        note: data.metrics.pm.overdue + " overdue items and " + metrics.deferPending + " defer approvals need tighter follow-up"
      },
      {
        label: "Rent Machine PM Risk",
        value: String(metrics.rentPmRisk),
        valueClass: "text-warning",
        note: "Vendor-aware PM follow-up remains open on rent-machine control cases"
      }
    ]);

    updateStandaloneAlertStrip("Weekly and monthly PM pressure is highest on Line 03, Line 07, and Line 05. Rent-machine PM delay should be reviewed with vendor, spare, and technician planning together.", "warning");
    updateCardSectionText("PM Report Snapshot", "High-level PM review linking completion rhythm, due pressure, defer approvals, rent-machine risk, and breakdown-driven slippage.");
    renderTable("PM Report Snapshot", (reportView ? reportView.snapshot : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Report Area"><strong>' + escapeHtml(item.area) + "</strong></td>",
        '<td data-label="Current Figure"><strong>' + escapeHtml(item.figure) + "</strong></td>",
        '<td data-label="Observation">' + escapeHtml(item.observation) + "</td>",
        '<td data-label="Gap / Risk">' + escapeHtml(item.gap) + "</td>",
        '<td data-label="Suggested Action"><a href="' + escapeHtml(item.action) + '" class="btn btn-sm btn-outline-primary">' + escapeHtml(item.actionLabel) + "</a></td>",
        "</tr>"
      ].join("");
    }).join(""));
    updateCompactNote("PM Report Snapshot", "This PM report now supports Maintenance GM review by showing where compliance, technician capacity, and vendor-aware rent-machine planning are slipping together.");

    renderTable("Frequency-Wise PM Performance", (reportView ? reportView.frequencyPerformance : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Frequency"><strong>' + escapeHtml(item.frequency) + "</strong></td>",
        '<td data-label="Scheduled">' + escapeHtml(item.scheduled) + "</td>",
        '<td data-label="Completed">' + escapeHtml(item.completed) + "</td>",
        '<td data-label="Due / Overdue">' + escapeHtml(item.dueOverdue) + "</td>",
        '<td data-label="Compliance">' + escapeHtml(item.compliance) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Area-Wise PM Pressure", (reportView ? reportView.areaPressure : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Floor / Line"><strong>' + escapeHtml(item.line) + "</strong></td>",
        '<td data-label="Scheduled">' + escapeHtml(item.scheduled) + "</td>",
        '<td data-label="Completed">' + escapeHtml(item.completed) + "</td>",
        '<td data-label="Due / Overdue">' + escapeHtml(item.dueOverdue) + "</td>",
        '<td data-label="Main Machine Type">' + escapeHtml(item.machineType) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Technician PM Closure Board", reportView ? reportView.technicianClosure : []);
    renderMiniStatList("PM Risk Watch", reportView ? reportView.riskWatch : []);
    renderTimelineList("Recent Report Notes", reportView ? reportView.notes : []);
    updateCardSectionText("Operational Notes", "Keep PM reporting practical for maintenance control, exception approval review, and monthly management meeting use.");
  }

  function renderRentMachineReportPage() {
    if (!data || currentFileName !== "report-rent-machine.html") {
      return;
    }

    const metrics = data.reportMetrics ? data.reportMetrics.rent : {};
    const reportView = data.reportViews ? data.reportViews.rent : null;

    updateHeaderActions(["All Reports", "Export Rent Control Review"]);
    setFilterMeta(
      'Report Date: <strong>' + escapeHtml(formatDate(new Date())) + "</strong>",
      "Active " + metrics.activeMachines + " | Vendor SLA Watch " + metrics.vendorSlaRisk + " | Return / Replace " + metrics.returnReplaceWatch
    );
    renderSummaryCards([
      {
        label: "Total Rent Machines",
        value: String(metrics.totalMachines),
        note: "Machines under active vendor or agreement-supported control"
      },
      {
        label: "Currently Active",
        value: String(metrics.activeMachines),
        valueClass: "text-success",
        note: "Production dependence stays highest on rent-supported overlock and single-needle lines"
      },
      {
        label: "Return / Replace Watch",
        value: String(metrics.returnReplaceWatch),
        valueClass: "text-warning",
        note: metrics.backupPending + " cases still need backup or continuity planning"
      },
      {
        label: "Vendor SLA Risk",
        value: String(metrics.vendorSlaRisk),
        valueClass: "text-danger",
        note: metrics.agreementRisk + " agreements also need closer timing review"
      }
    ]);

    updateStandaloneAlertStrip("Rent machine pressure is highest on Line 03 and Line 05. Vendor response, agreement timing, and standby planning should now be reviewed together.", "warning");
    updateCardSectionText("Rent Machine Report Snapshot", "High-level comparison of active use, vendor dependency, agreement risk, and current return or replace exposure.");
    renderTable("Rent Machine Report Snapshot", (reportView ? reportView.snapshot : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Report Area"><strong>' + escapeHtml(item.area) + "</strong></td>",
        '<td data-label="Current Figure"><strong>' + escapeHtml(item.figure) + "</strong></td>",
        '<td data-label="Observation">' + escapeHtml(item.observation) + "</td>",
        '<td data-label="Gap / Risk">' + escapeHtml(item.gap) + "</td>",
        '<td data-label="Suggested Action"><a href="' + escapeHtml(item.action) + '" class="btn btn-sm btn-outline-primary">' + escapeHtml(item.actionLabel) + "</a></td>",
        "</tr>"
      ].join("");
    }).join(""));
    updateCompactNote("Rent Machine Report Snapshot", "This report now helps management understand where rent-machine dependency, vendor coordination, agreement exposure, and standby planning need the fastest action.");

    renderTable("Vendor-Wise Rent Machine Performance", (reportView ? reportView.vendorPerformance : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Vendor"><strong>' + escapeHtml(item.vendor) + "</strong></td>",
        '<td data-label="Machine Count">' + escapeHtml(item.machineCount) + "</td>",
        '<td data-label="Active Use">' + escapeHtml(item.activeUse) + "</td>",
        '<td data-label="Current Watch">' + escapeHtml(item.watch) + "</td>",
        '<td data-label="Avg Downtime">' + escapeHtml(item.avgDowntime) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Top Rent Machine Risk List", (reportView ? reportView.riskList : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Rent Machine"><strong>' + escapeHtml(item.machineId) + '</strong><div class="cell-muted">' + escapeHtml(item.note) + "</div></td>",
        '<td data-label="Vendor / Agreement"><strong>' + escapeHtml(item.vendor) + '</strong><div class="cell-muted">' + escapeHtml(item.agreement) + "</div></td>",
        '<td data-label="Main Risk">' + escapeHtml(item.risk) + "</td>",
        '<td data-label="Current Position">' + escapeHtml(item.position) + "</td>",
        '<td data-label="Suggested Action">' + escapeHtml(item.action) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Agreement Risk Watch", reportView ? reportView.agreementRisk : []);
    renderTimelineList("Recent Report Notes", reportView ? reportView.notes : []);
    updateCardSectionText("Operational Notes", "Keep the report practical for management review of vendor dependency, agreement continuity, and replacement readiness.");
  }

  function renderDowntimeReportPage() {
    if (!data || currentFileName !== "report-downtime.html") {
      return;
    }

    const metrics = data.reportMetrics ? data.reportMetrics.downtime : {};
    const reportView = data.reportViews ? data.reportViews.downtime : null;

    updateHeaderActions(["All Reports", "Export Downtime GM Review"]);
    setFilterMeta(
      'Report Date: <strong>' + escapeHtml(formatDate(new Date())) + "</strong>",
      "Downtime " + metrics.totalHours + " Hrs | MTTR " + metrics.averagePerTicket + " Hrs | Output Loss " + metrics.outputLossRiskHours + " Hrs"
    );
    renderSummaryCards([
      {
        label: "Total Downtime",
        value: metrics.totalHours + " Hrs",
        valueClass: "text-danger",
        note: "Combined interruption recorded across the selected management review period"
      },
      {
        label: "MTTR",
        value: metrics.averagePerTicket + " Hrs",
        valueClass: "text-warning",
        note: "Average recovery still stretches when repeat issue, vendor delay, or parts wait overlap"
      },
      {
        label: "Highest Loss Line",
        value: metrics.highestLossLine,
        valueClass: "text-primary",
        note: metrics.highestLossHours + " hrs downtime on the most exposed production line"
      },
      {
        label: "Repeat Downtime Machines",
        value: String(metrics.repeatMachines),
        note: "Repeated interruption now matters more than one-time failure for management action"
      }
    ]);

    updateStandaloneAlertStrip("Line 03, Line 07, and Line 05 contributed most of the downtime hours. RM-2008 and MC-1014 remain the biggest repeat interruption risks and should be reviewed with PM and spare support together.", "warning");
    updateCardSectionText("Downtime Report Snapshot", "High-level comparison of downtime volume, recovery speed, line exposure, and repeat machine pressure for management review.");
    renderTable("Downtime Report Snapshot", (reportView ? reportView.snapshot : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Report Area"><strong>' + escapeHtml(item.area) + "</strong></td>",
        '<td data-label="Current Figure"><strong>' + escapeHtml(item.figure) + "</strong></td>",
        '<td data-label="Observation">' + escapeHtml(item.observation) + "</td>",
        '<td data-label="Gap / Risk">' + escapeHtml(item.gap) + "</td>",
        '<td data-label="Suggested Action"><a href="' + escapeHtml(item.action) + '" class="btn btn-sm btn-outline-primary">' + escapeHtml(item.actionLabel) + "</a></td>",
        "</tr>"
      ].join("");
    }).join(""));
    updateCompactNote("Downtime Report Snapshot", "This report now shows operations management and maintenance leadership where productive hours are being lost and which dependency is making recovery slower.");

    renderTable("Line-Wise Downtime Summary", (reportView ? reportView.lineWise : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Floor / Line"><strong>' + escapeHtml(item.line) + "</strong></td>",
        '<td data-label="Total Tickets">' + escapeHtml(item.totalTickets) + "</td>",
        '<td data-label="Total Downtime">' + escapeHtml(item.totalDowntime) + "</td>",
        '<td data-label="Avg Per Ticket">' + escapeHtml(item.avgPerTicket) + "</td>",
        '<td data-label="Main Machine Type">' + escapeHtml(item.machineType) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Top Downtime Machines", (reportView ? reportView.topMachines : []).map(function (item) {
      return [
        "<tr>",
        '<td data-label="Machine"><strong>' + escapeHtml(item.machineId) + '</strong><div class="cell-muted">' + escapeHtml(item.note) + "</div></td>",
        '<td data-label="Ownership"><span class="badge text-bg-' + (item.ownership === "Rent" ? "primary" : "dark") + '">' + escapeHtml(item.ownership) + "</span></td>",
        '<td data-label="Total Downtime">' + escapeHtml(item.downtime) + "</td>",
        '<td data-label="Main Issue">' + escapeHtml(item.issue) + "</td>",
        '<td data-label="Suggested Action">' + escapeHtml(item.action) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(item.status) + '">' + escapeHtml(item.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderMiniStatList("Downtime Cause Watch", reportView ? reportView.causeWatch : []);
    renderMiniStatList("Recovery Performance Board", reportView ? reportView.recoveryBoard : []);
    renderTimelineList("Recent Report Notes", reportView ? reportView.notes : []);
    updateCardSectionText("Operational Notes", "Keep the report practical for production-impact review, maintenance escalation, and monthly management control meetings.");
  }

  function renderBreakdownFormPage() {
    if (!data || currentFileName !== "breakdown-form.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const workflow = getWorkflowBlueprint("breakdown");
    const suggestedTicket = getTicket("BD-2026-0121");
    const targetMachine = suggestedTicket ? helpers.getMachine(suggestedTicket.machineId) : helpers.getMachine("MC-1014");
    const machineVendor = targetMachine ? helpers.getMachineVendor(targetMachine) : null;

    updateTopAlertMessage(
      currentUser.role + " view: capture line impact, machine reference, and urgency clearly. Assignment and escalation should stay visible but controlled by the next owner.",
      currentUser.role === "Production User" ? "warning" : "info"
    );

    updateHeaderActions([
      currentUser.role === "Production User" ? "My Ticket List" : "Breakdown Queue",
      currentUser.role === "Supervisor" ? "Submit and Assign" : currentUser.role === "Technician" ? "Save Observation" : "Submit Complaint"
    ]);

    if (targetMachine) {
      setInputValue("machineCode", targetMachine.id);
      setInputValue("machineType", targetMachine.type);
      setInputValue("factoryFloor", targetMachine.floor);
      setInputValue("lineNo", targetMachine.line);
      setInputValue("problemType", suggestedTicket ? suggestedTicket.issue : "Looper issue, thread break");
      setInputValue("productionImpact", suggestedTicket && suggestedTicket.impact === "Line stoppage" ? "Machine Stopped" : "Line Efficiency Reduced");
      setInputValue("spareNeed", suggestedTicket && suggestedTicket.escalation === "Spare Pending" ? "Spare Parts Required" : "May Need Spare Parts");
      if (machineVendor) {
        setInputValue("relatedVendor", machineVendor.name);
      }
    }

    if (suggestedTicket) {
      setInputValue("priorityLevel", suggestedTicket.priority);
      setInputValue("problemDetails", suggestedTicket.correctiveAction + ". Root cause watch: " + suggestedTicket.rootCause + ".");
    }

    updateCardSectionText("Complaint Entry Form", currentUser.role + " focus: " + (getCurrentRoleProfile() ? getCurrentRoleProfile().emphasis : "Practical complaint entry"));
    updateCardSectionText("Assignment and Follow-Up", "Assignment should move from supervisor to technician, and repeat or critical cases should escalate without changing the complaint source record.");

    if (currentUser.role === "Supervisor" || currentUser.role === "Maintenance Head" || currentUser.role === "Admin") {
      disableFields(["assignedTechnician", "assignBy", "targetResponse", "relatedVendor"], false);
      setInputValue("assignBy", currentUser.displayName);
      setInputValue("ticketStatus", "Assigned");
    } else {
      disableFields(["assignedTechnician", "assignBy", "targetResponse", "relatedVendor"], true);
      setInputValue("ticketStatus", "Open");
      setInputValue("assignBy", "Supervisor review required");
    }

    if (workflow) {
      renderSimpleStack("Complaint Guide", workflow.approvals.map(function (item, index) {
        return {
          label: "Rule " + String(index + 1),
          note: item,
          value: index === 0 ? "Priority" : "Watch",
          badgeClass: index === 0 ? "danger" : "warning"
        };
      }));
      renderWorkflowStages("Workflow Reminder", "breakdown", currentUser.role === "Production User" ? "raise" : "assign");
    }
  }

  function renderTicketClosePage() {
    if (!data || currentFileName !== "ticket-close.html") {
      return;
    }

    const ticket = getTicket(data.pageContext.ticketCloseId);
    const machine = ticket ? helpers.getMachine(ticket.machineId) : null;
    const currentUser = getEffectiveCurrentUser();

    if (!ticket || !machine) {
      return;
    }

    setInputValue("closeTicketNo", ticket.id);
    setInputValue("closeMachineCode", machine.id);
    setInputValue("closeMachineType", machine.type);
    setInputValue("closeLocation", machine.floor + " / " + machine.line);
    setFilterMeta(
      'Completed: <strong>' + escapeHtml(formatDate(ticket.date)) + ", 01:27 PM</strong>",
      "Technician: " + ticket.technician + " | Raised by " + ticket.raisedBy
    );

    renderSummaryCards([
      { label: "Total Downtime", value: Math.round(ticket.downtimeHours * 60) + " Min", valueClass: "text-danger", note: ticket.impact },
      { label: "Repair Result", value: "Stable", valueClass: "text-success", note: ticket.correctiveAction },
      { label: "Production Feedback", value: ticket.acceptedByProduction ? "Accepted" : "Pending", valueClass: ticket.acceptedByProduction ? "text-primary" : "text-warning", note: ticket.acceptedByProduction ? "Supervisor confirmed stable output" : "Closure should wait for production confirmation" },
      { label: "Repeat Risk", value: machine.repeatWatch ? "Watch" : "Low", valueClass: machine.repeatWatch ? "text-warning" : "text-success", note: ticket.preventiveAction }
    ]);

    setInputValue("closeDate", ticket.date);
    setInputValue("closeStatus", ticket.status === "Completed" ? "Closed" : ticket.status);
    setInputValue("closeBy", currentUser.role === "Supervisor" ? currentUser.displayName : ticket.raisedBy);
    setInputValue("productionConfirmation", ticket.acceptedByProduction ? "Accepted by Supervisor" : "Pending");
    setInputValue("repairOutcome", ticket.status === "Completed" ? "Repair Completed" : "Needs Further Follow-Up");
    setInputValue("downtimeMinutes", Math.round(ticket.downtimeHours * 60));
    setInputValue("spareConsumption", ticket.escalation === "Spare Pending" ? "Major Part Replaced" : "Minor Spare Used");
    setInputValue("repairSummary", ticket.correctiveAction + ". Root cause: " + ticket.rootCause + ".");
    setInputValue("closureNote", ticket.preventiveAction + ". Escalation trail: " + ticket.escalation + ".");
    setInputValue("followUpAction", machine.repeatWatch ? "Supervisor Monitoring" : "Normal PM Review");
    setInputValue("reportImpact", machine.repeatWatch ? "Repeat Breakdown Case" : "Normal Breakdown Close");

    updateHeaderActions([
      currentUser.role === "Technician" ? "Back to Ticket" : "Ticket Details",
      currentUser.role === "Supervisor" ? "Confirm Closure" : currentUser.role === "Maintenance Head" ? "Review Closure" : "Close Ticket"
    ]);
    updateCardSectionText("Closure Form", currentUser.role + " focus: closure should happen only after production acceptance, repair summary, downtime, and follow-up category are clear.");
    renderWorkflowStages("Closure Checklist", "breakdown", ticket.acceptedByProduction ? "close" : "complete");

    if (currentUser.role !== "Supervisor" && currentUser.role !== "Maintenance Head" && currentUser.role !== "Admin") {
      disableFields(["closeStatus", "closeBy", "productionConfirmation", "repairOutcome", "downtimeMinutes", "spareConsumption", "repairSummary", "closureNote", "followUpAction", "reportImpact"], true);
    }
  }

  function renderPmChecklistPage() {
    if (!data || currentFileName !== "pm-checklist.html") {
      return;
    }

    const plan = getPmPlan(data.pageContext.pmChecklistId);
    const machine = plan ? helpers.getMachine(plan.machineId) : null;
    const linkedTicket = machine ? helpers.getMachineTickets(machine.id).find(function (ticket) { return ticket.status !== "Closed"; }) : null;
    const currentUser = getEffectiveCurrentUser();

    if (!plan || !machine) {
      return;
    }

    setInputValue("checklistPlanNo", plan.id);
    setInputValue("checklistMachineCode", machine.id);
    setInputValue("checklistMachineType", machine.type);
    setInputValue("checklistLocation", machine.floor + " / " + machine.line);
    setFilterMeta(
      'Current Due: <strong>' + escapeHtml(formatDate(plan.nextDue)) + "</strong>",
      "Technician: " + plan.technician + " | Exception: " + (plan.exceptionReason || "No exception")
    );
    setInputValue("checklistDate", plan.nextDue);
    setInputValue("checklistTechnician", currentUser.role === "Technician" ? currentUser.displayName : plan.technician);
    setInputValue("checklistStatus", plan.status === "Overdue" ? "In Progress" : plan.status);
    setInputValue("pmCondition", linkedTicket ? "Need Repair Follow-Up" : "Normal");
    setInputValue("spareNeed", plan.vendorAware ? "Need Spare Request" : "No Spare Used");
    setInputValue("nextDueDate", plan.frequency === "Weekly" ? "2026-04-30" : plan.nextDue);
    setInputValue("pmRemarks", plan.exceptionReason || "Checklist execution is in progress and all checkpoints must be closed before completion.");
    setInputValue("followUpNote", linkedTicket ? "Linked ticket " + linkedTicket.id + " should stay visible until PM close is fully approved." : "No extra repair follow-up required.");

    renderSummaryCards([
      { label: "Checklist Items", value: "6", valueClass: "text-primary", note: plan.frequency + " PM checkpoints for " + machine.type },
      { label: "Expected Duration", value: plan.frequency === "Weekly" ? "25 Min" : "18 Min", valueClass: "text-warning", note: "Planned PM window under active line release" },
      { label: "Machine Status", value: linkedTicket ? "At Risk" : "Available", valueClass: linkedTicket ? "text-danger" : "text-success", note: linkedTicket ? "Linked breakdown should stay in view during PM." : "Machine is released in safe maintenance window" },
      { label: "Next Due Target", value: plan.frequency === "Weekly" ? "30 Apr" : formatShortDate(plan.nextDue), valueClass: "text-dark", note: "Update after checklist confirmation" }
    ]);

    updateHeaderActions([
      currentUser.role === "Technician" ? "PM Board" : "PM Schedule",
      currentUser.role === "Technician" ? "Submit Checklist" : "Review Checklist"
    ]);
    updateCardSectionText("PM Checklist Form", currentUser.role + " focus: checklist should capture actual observation, spare need, and next due logic without skipping exception reason.");
    renderSimpleStack("Related Risks", [
      { label: "Exception Reason", note: plan.exceptionReason || "No exception reason recorded for this plan.", value: plan.status, badgeClass: helpers.statusBadgeClass(plan.status) },
      { label: "Linked Breakdown", note: linkedTicket ? linkedTicket.id + " remains open on the same machine." : "No open breakdown is linked right now.", value: linkedTicket ? linkedTicket.status : "Clear", badgeClass: linkedTicket ? helpers.statusBadgeClass(linkedTicket.status) : "success" },
      { label: "Approval Need", note: plan.vendorAware ? "Vendor-aware PM should be reviewed if parts or SLA delay remains." : "No extra approval needed if checklist closes normally.", value: plan.vendorAware ? "Review" : "Normal", badgeClass: plan.vendorAware ? "warning" : "primary" }
    ]);

    if (currentUser.role !== "Technician" && currentUser.role !== "Maintenance Head") {
      disableFields(["checklistDate", "checklistTime", "checklistTechnician", "checklistStatus", "pmCondition", "spareNeed", "endTime", "nextDueDate", "pmRemarks", "followUpNote"], true);
    }
  }

  function renderPmCompletePage() {
    if (!data || currentFileName !== "pm-complete.html") {
      return;
    }

    const plan = getPmPlan(data.pageContext.pmCompleteId);
    const machine = plan ? helpers.getMachine(plan.machineId) : null;
    const currentUser = getEffectiveCurrentUser();

    if (!plan || !machine) {
      return;
    }

    setInputValue("completePlanNo", plan.id);
    setInputValue("completeMachineCode", machine.id);
    setInputValue("completeMachineType", machine.type);
    setInputValue("completeLocation", machine.floor + " / " + machine.line);
    setFilterMeta(
      'Due Date: <strong>' + escapeHtml(formatDate(plan.nextDue)) + "</strong>",
      "Technician: " + plan.technician + " | PM window: General shift"
    );

    renderSummaryCards([
      { label: "Execution Time", value: plan.frequency === "Daily" ? "18 Min" : "28 Min", valueClass: "text-warning", note: "Completion timing based on " + plan.frequency.toLowerCase() + " PM work" },
      { label: "Machine Result", value: "Ready", valueClass: "text-success", note: "Machine can move back to line after PM close" },
      { label: "Spare Usage", value: plan.vendorAware ? "Check" : "None", valueClass: "text-primary", note: plan.vendorAware ? "Vendor-aware PM may still need spare confirmation." : "No spare issue required in this completion flow" },
      { label: "Next Due", value: plan.frequency === "Daily" ? "24 Apr" : formatShortDate(plan.nextDue), valueClass: "text-dark", note: "Next PM date should stay tied to frequency discipline" }
    ]);

    setInputValue("completeDate", "2026-04-23");
    setInputValue("completeTime", "09:33");
    setInputValue("completeTechnician", currentUser.role === "Technician" ? currentUser.displayName : plan.technician);
    setInputValue("completeStatus", "Completed");
    setInputValue("machineCondition", plan.exceptionReason ? "Normal with Observation" : "Normal");
    setInputValue("productionReady", plan.exceptionReason ? "Ready After Observation" : "Ready for Production");
    setInputValue("spareUse", plan.vendorAware ? "Store Issue Logged" : "No Spare Used");
    setInputValue("nextDueConfirm", plan.frequency === "Daily" ? "2026-04-24" : plan.nextDue);
    setInputValue("completionSummary", "PM plan " + plan.id + " executed against " + machine.id + ". Technician confirmed routine checks and closed the task with next due update.");
    setInputValue("observationNote", plan.exceptionReason || "No abnormal observation after PM completion.");
    setInputValue("approvedBy", currentUser.role === "Supervisor" ? currentUser.displayName : "Rahima Begum");
    setInputValue("reportCategory", plan.exceptionReason ? "PM with Observation" : "Normal PM Completion");

    updateHeaderActions([
      currentUser.role === "Technician" ? "Checklist Back" : "PM Checklist",
      currentUser.role === "Technician" ? "Complete PM" : currentUser.role === "Maintenance Head" ? "Review Completion" : "Confirm PM Complete"
    ]);
    updateCardSectionText("PM Completion Form", currentUser.role + " focus: close PM only after machine condition, next due date, and production release note are consistent.");
    renderTable("Execution Snapshot", [
      {
        item: "Completion Owner",
        details: (currentUser.role === "Technician" ? currentUser.displayName : plan.technician) + " is posting the final completion summary.",
        status: currentUser.role
      },
      {
        item: "Exception Trail",
        details: plan.exceptionReason || "No exception trail is open for this PM completion.",
        status: plan.exceptionReason ? "Review" : "Clear"
      },
      {
        item: "Approval Trail",
        details: "Supervisor release and maintenance review should remain visible in the record.",
        status: "Ready"
      }
    ].map(function (entry) {
      return [
        "<tr>",
        '<td data-label="Item"><strong>' + escapeHtml(entry.item) + "</strong></td>",
        '<td data-label="Details">' + escapeHtml(entry.details) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(entry.status) + '">' + escapeHtml(entry.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    if (currentUser.role !== "Technician" && currentUser.role !== "Supervisor" && currentUser.role !== "Maintenance Head") {
      disableFields(["completeDate", "completeTime", "completeTechnician", "completeStatus", "machineCondition", "productionReady", "spareUse", "nextDueConfirm", "completionSummary", "observationNote", "approvedBy", "reportCategory"], true);
    }
  }

  function renderSparePartsPage() {
    if (!data || currentFileName !== "spare-parts.html") {
      return;
    }

    const lowStockParts = helpers.getLowStockParts();
    const currentUser = getEffectiveCurrentUser();

    renderSummaryCards([
      { label: "Available Parts", value: String(data.spareParts.length - lowStockParts.length), valueClass: "text-success", note: "Healthy stock items ready for PM and corrective work" },
      { label: "Low Stock Alerts", value: String(lowStockParts.filter(function (part) { return part.status === "Low"; }).length), valueClass: "text-warning", note: "Need store follow-up before next PM and breakdown cycle" },
      { label: "Critical Items", value: String(lowStockParts.filter(function (part) { return part.status === "Critical"; }).length), valueClass: "text-danger", note: "Already affecting live maintenance decisions" },
      { label: "Issues Today", value: String(data.stockMovements.filter(function (movement) { return movement.movementType === "Issue" || movement.movementType === "Pending Issue"; }).length), valueClass: "text-primary", note: "Movements linked to ticket or PM references" }
    ]);

    updateTopAlertMessage(
      "Store workflow focus: low stock, ticket-linked issue, and PM dependency should stay in one review path. " + currentUser.role + " sees the actions most relevant to this queue.",
      currentUser.role === "Store User" ? "warning" : "info"
    );

    renderTable("Spare Parts Stock Register", data.spareParts.map(function (part) {
      const vendor = helpers.getVendor(part.vendorId);
      const linkedRisk = part.linkedMachines.slice(0, 2).join(", ");
      const rackName = part.code === "SP-LOOPER-01" ? "Rack B-02" : part.code === "SP-BELT-01" ? "Rack A-01" : part.code === "SP-SENSOR-01" ? "Rack C-03" : "Store Counter";
      return [
        "<tr>",
        '<td data-label="Part Code"><strong>' + escapeHtml(part.code) + '</strong><div class="cell-muted">Vendor: ' + escapeHtml(vendor ? vendor.name : "Not Linked") + "</div></td>",
        '<td data-label="Part Details"><strong>' + escapeHtml(part.name) + '</strong><div class="cell-muted">Linked machines: ' + escapeHtml(linkedRisk || "General use") + "</div></td>",
        '<td data-label="Machine Type">' + escapeHtml(part.machineType) + "</td>",
        '<td data-label="Balance"><strong>' + escapeHtml(part.stockQty + " pcs") + '</strong><div class="cell-muted">Minimum: ' + escapeHtml(part.reorderLevel + " pcs") + "</div></td>",
        '<td data-label="Rack">' + escapeHtml(rackName) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(part.status) + '">' + escapeHtml(part.status) + "</span></td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="' + (currentUser.role === "Store User" ? "stock-history.html" : "technician-tasks.html") + '" class="btn btn-sm btn-outline-primary">' + escapeHtml(currentUser.role === "Store User" ? "Post" : "Need") + '</a><a href="spare-low-stock.html" class="btn btn-sm btn-outline-secondary">' + escapeHtml(part.status === "Critical" ? "Escalate" : "Watch") + "</a></div></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Recent Issue Register", data.stockMovements.slice(0, 4).map(function (movement) {
      const part = data.spareParts.find(function (item) {
        return item.code === movement.partCode;
      });
      return [
        "<tr>",
        '<td data-label="Movement No"><strong>' + escapeHtml(movement.id) + '</strong><div class="cell-muted">' + escapeHtml(formatDate(movement.date)) + "</div></td>",
        '<td data-label="Part Details"><strong>' + escapeHtml(part ? part.name : movement.partCode) + '</strong><div class="cell-muted">' + escapeHtml(movement.partCode) + "</div></td>",
        '<td data-label="Movement"><span class="badge text-bg-' + helpers.statusBadgeClass(movement.status) + '">' + escapeHtml(movement.movementType) + "</span></td>",
        '<td data-label="Reference">' + escapeHtml(movement.reference) + "</td>",
        '<td data-label="Qty">' + escapeHtml(movement.quantity) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(movement.status) + '">' + escapeHtml(movement.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderSimpleStack("Low Stock Alert", lowStockParts.map(function (part) {
      return {
        label: part.name,
        note: "Balance " + part.stockQty + " pcs | linked with " + part.linkedMachines.join(", "),
        value: part.status,
        badgeClass: helpers.statusBadgeClass(part.status)
      };
    }));

    renderStatusLines("Machine Compatibility", data.spareParts.map(function (part) {
      return {
        label: part.machineType,
        note: part.linkedMachines.join(", "),
        value: part.status,
        badgeClass: helpers.statusBadgeClass(part.status)
      };
    }));

    renderActivityList("Purchase Follow-Up", data.approvalQueue.filter(function (approval) {
      return approval.module.indexOf("Stock") > -1;
    }).map(function (approval) {
      return {
        color: approval.status === "Pending" ? "warning" : "success",
        title: approval.referenceId + " approval watch",
        note: approval.note,
        time: approval.status
      };
    }));

    updateHeaderActions([
      currentUser.role === "Store User" ? "Export Store List" : "Export Stock List",
      currentUser.role === "Store User" ? "Add / Receive Part" : currentUser.role === "Technician" ? "Raise Spare Need" : "Open Spare Part"
    ]);
  }

  function renderSpareLowStockPage() {
    if (!data || currentFileName !== "spare-low-stock.html") {
      return;
    }

    const lowStockParts = helpers.getLowStockParts();
    const currentUser = getEffectiveCurrentUser();

    updateHeaderActions([
      currentUser.role === "Store User" ? "Back to Spare List" : "Spare Parts List",
      currentUser.role === "Store User" ? "Export Critical Alert" : "Export Low Stock"
    ]);

    renderSummaryCards([
      { label: "Critical Items", value: String(lowStockParts.filter(function (part) { return part.status === "Critical"; }).length), valueClass: "text-danger", note: "Below minimum and already affecting live maintenance work" },
      { label: "Low Stock Items", value: String(lowStockParts.length), valueClass: "text-warning", note: "Need reorder follow-up before demand grows further" },
      { label: "Open Reorder Follow-Up", value: String(data.approvalQueue.filter(function (approval) { return approval.module.indexOf("Stock") > -1 && approval.status === "Pending"; }).length), valueClass: "text-primary", note: "Waiting store confirmation or maintenance approval" },
      { label: "Machine Risk Items", value: String(lowStockParts.filter(function (part) { return part.linkedMachines.length > 0; }).length), note: "Low stock can delay PM and breakdown closeout" }
    ]);

    updateTopAlertMessage("Critical low stock should escalate with machine dependency, ticket or PM reference, and approval owner visible in the same view.", "danger");

    renderTable("Low Stock Register", lowStockParts.map(function (part) {
      const vendor = helpers.getVendor(part.vendorId);
      return [
        "<tr>",
        '<td data-label="Part Code"><strong>' + escapeHtml(part.code) + '</strong><div class="cell-muted">' + escapeHtml(part.machineType) + "</div></td>",
        '<td data-label="Part Details"><strong>' + escapeHtml(part.name) + '</strong><div class="cell-muted">Linked: ' + escapeHtml(part.linkedMachines.join(", ")) + "</div></td>",
        '<td data-label="Machine Type">' + escapeHtml(part.machineType) + "</td>",
        '<td data-label="Balance / Minimum"><strong>' + escapeHtml(part.stockQty + " pcs") + '</strong><div class="cell-muted">Minimum: ' + escapeHtml(part.reorderLevel + " pcs") + "</div></td>",
        '<td data-label="Supplier"><strong>' + escapeHtml(vendor ? vendor.name : "Not Linked") + '</strong><div class="cell-muted">Approval queue visible</div></td>',
        '<td data-label="Severity"><span class="badge text-bg-' + helpers.statusBadgeClass(part.status) + '">' + escapeHtml(part.status) + "</span></td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="stock-history.html" class="btn btn-sm btn-outline-primary">' + escapeHtml(currentUser.role === "Store User" ? "Post" : "Review") + '</a><a href="technician-tasks.html" class="btn btn-sm btn-outline-secondary">Impact</a></div></td>',
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Machine Impact and Reorder Review", lowStockParts.map(function (part) {
      const relatedTicket = data.tickets.find(function (ticket) {
        return part.linkedMachines.indexOf(ticket.machineId) > -1 && ticket.status !== "Closed";
      });
      const relatedPlan = data.pmPlans.find(function (plan) {
        return part.linkedMachines.indexOf(plan.machineId) > -1 && plan.status !== "Completed";
      });
      return [
        "<tr>",
        '<td data-label="Part"><strong>' + escapeHtml(part.name) + "</strong></td>",
        '<td data-label="Machine Impact">' + escapeHtml(part.linkedMachines.join(", ")) + "</td>",
        '<td data-label="Open Reference">' + escapeHtml(relatedTicket ? relatedTicket.id : relatedPlan ? relatedPlan.id : "No active reference") + "</td>",
        '<td data-label="Operational Risk">' + escapeHtml(relatedTicket ? relatedTicket.impact : relatedPlan ? relatedPlan.exceptionReason : "Stock should be reviewed before next issue.") + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(part.status) + '">' + escapeHtml(part.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderSimpleStack("Supplier Follow-Up Watch", data.approvalQueue.filter(function (approval) {
      return approval.module.indexOf("Stock") > -1;
    }).map(function (approval) {
      return {
        label: approval.referenceId,
        note: approval.note,
        value: approval.status,
        badgeClass: helpers.statusBadgeClass(approval.status)
      };
    }));

    renderActivityList("Recent Low Stock Updates", data.stockMovements.map(function (movement) {
      const part = data.spareParts.find(function (item) {
        return item.code === movement.partCode;
      });
      return {
        color: movement.status === "Pending" ? "warning" : movement.status === "Adjusted" ? "danger" : "primary",
        title: movement.id + " for " + (part ? part.name : movement.partCode),
        note: movement.note,
        time: formatShortDate(movement.date)
      };
    }).slice(0, 3));

    renderSimpleStack("Reorder Priority Board", lowStockParts.map(function (part) {
      return {
        label: part.code,
        note: "Reorder for " + part.name + " before next PM and breakdown cycle.",
        value: part.status === "Critical" ? "Urgent" : "Watch",
        badgeClass: part.status === "Critical" ? "danger" : "warning"
      };
    }));
  }

  function renderStockHistoryPage() {
    if (!data || currentFileName !== "stock-history.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const receiveCount = data.stockMovements.filter(function (movement) {
      return movement.movementType === "Receive";
    }).length;
    const issueCount = data.stockMovements.filter(function (movement) {
      return movement.movementType === "Issue" || movement.movementType === "Pending Issue";
    }).length;
    const pendingCount = data.stockMovements.filter(function (movement) {
      return movement.status === "Pending";
    }).length;
    const adjustedCount = data.stockMovements.filter(function (movement) {
      return movement.status === "Adjusted";
    }).length;

    renderSummaryCards([
      { label: "Receive Entries", value: String(receiveCount), valueClass: "text-success", note: "Store receive activity linked with supplier follow-up" },
      { label: "Issue Entries", value: String(issueCount), valueClass: "text-primary", note: "Parts issued against ticket and PM references" },
      { label: "Pending Entries", value: String(pendingCount), valueClass: "text-warning", note: "Need store posting or approval before movement is final" },
      { label: "Adjustments", value: String(adjustedCount), valueClass: "text-danger", note: "Audit changes should stay traceable with approver" }
    ]);

    renderTable("Stock Movement Register", data.stockMovements.map(function (movement) {
      const part = data.spareParts.find(function (item) {
        return item.code === movement.partCode;
      });
      return [
        "<tr>",
        '<td data-label="Movement No"><strong>' + escapeHtml(movement.id) + '</strong><div class="cell-muted">' + escapeHtml(formatDate(movement.date)) + "</div></td>",
        '<td data-label="Part Details"><strong>' + escapeHtml(part ? part.name : movement.partCode) + '</strong><div class="cell-muted">' + escapeHtml(movement.partCode) + " | Posted by " + escapeHtml(movement.postedBy) + "</div></td>",
        '<td data-label="Movement"><span class="badge text-bg-' + helpers.statusBadgeClass(movement.status) + '">' + escapeHtml(movement.movementType) + "</span></td>",
        '<td data-label="Reference">' + escapeHtml(movement.reference) + "</td>",
        '<td data-label="Qty">' + escapeHtml(movement.quantity) + "</td>",
        '<td data-label="Balance After">' + escapeHtml(movement.balanceAfter) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(movement.status) + '">' + escapeHtml(movement.status) + "</span></td>",
        '<td data-label="Action" class="text-end"><div class="table-actions"><a href="' + (movement.reference.indexOf("PM-") === 0 ? "pm-checklist.html" : movement.reference.indexOf("BD-") === 0 ? "ticket-details.html" : "spare-parts.html") + '" class="btn btn-sm btn-outline-primary">Open</a><a href="spare-low-stock.html" class="btn btn-sm btn-outline-secondary">Audit</a></div></td>',
        "</tr>"
      ].join("");
    }).join(""));

    renderTable("Recent Receive and Return", data.stockMovements.filter(function (movement) {
      return movement.movementType === "Receive" || movement.movementType === "Adjustment";
    }).map(function (movement) {
      const part = data.spareParts.find(function (item) {
        return item.code === movement.partCode;
      });
      return [
        "<tr>",
        '<td data-label="Movement"><strong>' + escapeHtml(movement.id) + "</strong></td>",
        '<td data-label="Part">' + escapeHtml(part ? part.name : movement.partCode) + "</td>",
        '<td data-label="Reference">' + escapeHtml(movement.reference) + "</td>",
        '<td data-label="Qty">' + escapeHtml(movement.quantity) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + helpers.statusBadgeClass(movement.status) + '">' + escapeHtml(movement.status) + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    renderSimpleStack("Audit Notes", data.approvalQueue.filter(function (approval) {
      return approval.module.indexOf("Stock") > -1;
    }).map(function (approval) {
      return {
        label: approval.id,
        note: approval.note,
        value: approval.status,
        badgeClass: helpers.statusBadgeClass(approval.status)
      };
    }));

    renderStatusLines("Movement Summary", [
      { label: "Posted by Store User", note: "Receive and issue postings remain tied to part code and reference ID.", value: String(receiveCount + issueCount), badgeClass: "primary" },
      { label: "Pending Approvals", note: "Low stock or blocked issue entries still need approver trail.", value: String(pendingCount), badgeClass: "warning" },
      { label: "Audit Adjustments", note: "Adjusted entries should remain visible for backend-ready stock history.", value: String(adjustedCount), badgeClass: "danger" }
    ]);

    updateHeaderActions([
      currentUser.role === "Store User" ? "Back to Spare Store" : "Spare Parts List",
      currentUser.role === "Store User" ? "Export Audit Trail" : "Export History"
    ]);
  }

  function applyBreakdownListRoleLogic() {
    if (!data || currentFileName !== "breakdown-list.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const openCount = data.tickets.filter(function (ticket) { return ticket.status === "Open"; }).length;
    const sparePendingCount = data.tickets.filter(function (ticket) { return ticket.escalation === "Spare Pending"; }).length;
    const vendorPendingCount = data.tickets.filter(function (ticket) { return ticket.escalation === "Vendor Pending"; }).length;
    const acceptancePendingCount = data.tickets.filter(function (ticket) { return ticket.status === "Completed" && !ticket.acceptedByProduction; }).length;

    updateHeaderActions([
      currentUser.role === "Production User" ? "My Complaints" : "Breakdown History",
      currentUser.role === "Supervisor" ? "Assign Queue" : currentUser.role === "Technician" ? "My Work Queue" : "Raise Complaint"
    ]);
    updateAlertStrip("Workflow Notes", currentUser.role + " focus: open tickets need assignment clarity, repeat issues need escalation, and completed work must wait for production acceptance.");
    renderMiniStatList("Workflow Notes", [
      { label: "Pending Assignment", note: "Open complaints waiting supervisor action", value: String(openCount), badgeClass: "warning" },
      { label: "Spare Pending", note: "Store support needed before repair or PM close", value: String(sparePendingCount), badgeClass: "danger" },
      { label: "Vendor Pending", note: "Vendor response still affects closure confidence", value: String(vendorPendingCount), badgeClass: "primary" },
      { label: "Acceptance Pending", note: "Production still needs to confirm completed work", value: String(acceptancePendingCount), badgeClass: "info" }
    ]);

    const registerCard = findCardByTitle("Breakdown Ticket Register");
    if (!registerCard) {
      return;
    }

    const rows = registerCard.querySelectorAll("tbody tr");
    rows.forEach(function (row, index) {
      const ticket = data.tickets[index];
      const actionWrap = row.querySelector(".table-actions");
      if (!ticket || !actionWrap) {
        return;
      }

      if (currentUser.role === "Production User") {
        actionWrap.innerHTML = '<a href="ticket-details.html" class="btn btn-sm btn-outline-primary">Track</a><a href="' + (ticket.machineId.indexOf("RM-") === 0 ? "rent-machine-details.html" : "machine-details.html") + '" class="btn btn-sm btn-outline-secondary">Machine</a>';
      } else if (currentUser.role === "Supervisor") {
        actionWrap.innerHTML = '<a href="ticket-details.html" class="btn btn-sm btn-outline-primary">Review</a><a href="' + (ticket.status === "Open" ? "ticket-assign.html" : "ticket-close.html") + '" class="btn btn-sm btn-outline-secondary">' + escapeHtml(ticket.status === "Open" ? "Assign" : "Close") + "</a>";
      } else if (currentUser.role === "Technician") {
        actionWrap.innerHTML = '<a href="ticket-details.html" class="btn btn-sm btn-outline-primary">Ticket</a><a href="technician-task-update.html" class="btn btn-sm btn-outline-secondary">Update</a>';
      } else {
        actionWrap.innerHTML = '<a href="ticket-details.html" class="btn btn-sm btn-outline-primary">Details</a><a href="ticket-assign.html" class="btn btn-sm btn-outline-secondary">' + escapeHtml(ticket.priority === "High" ? "Escalate" : "Review") + "</a>";
      }
    });
  }

  function applyTicketDetailsRoleLogic() {
    if (!data || currentFileName !== "ticket-details.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const ticket = getTicket(data.pageContext.ticketDetailsId);
    if (!ticket) {
      return;
    }

    updateHeaderActions([
      currentUser.role === "Production User" ? "Back to My Tickets" : "Ticket List",
      currentUser.role === "Technician" ? "Post Work Update" : currentUser.role === "Supervisor" ? "Review Closure" : "Update Work"
    ]);
    updateCardSectionText("Assignment and Workflow Control", currentUser.role + " focus: assignment SLA, escalation owner, and production acceptance should remain visible at ticket level.");
    renderSimpleStack("Current Status Board", [
      { label: "Root Cause", note: ticket.rootCause, value: "Captured", badgeClass: "secondary" },
      { label: "Corrective Action", note: ticket.correctiveAction, value: ticket.status, badgeClass: helpers.statusBadgeClass(ticket.status) },
      { label: "Preventive Action", note: ticket.preventiveAction, value: ticket.priority, badgeClass: helpers.priorityBadgeClass(ticket.priority) },
      { label: "Production Acceptance", note: ticket.acceptedByProduction ? "Line supervisor accepted the repair result." : "Closure must wait for production confirmation.", value: ticket.acceptedByProduction ? "Accepted" : "Pending", badgeClass: ticket.acceptedByProduction ? "success" : "warning" }
    ]);
    renderWorkflowStages("Workflow Timeline", "breakdown", ticket.status === "Open" ? "raise" : ticket.status === "Assigned" ? "assign" : ticket.status === "In Progress" ? "execute" : ticket.status === "Completed" ? "complete" : "close");
  }

  function applyTicketAssignRoleLogic() {
    if (!data || currentFileName !== "ticket-assign.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const technicians = helpers.getUsersByRole("Technician");
    const workflow = getWorkflowBlueprint("breakdown");

    updateHeaderActions([
      currentUser.role === "Supervisor" ? "Ticket Details" : "Assignment Review",
      currentUser.role === "Supervisor" ? "Confirm Assignment" : "Review Assignment"
    ]);
    updateCardSectionText("Assignment Form", currentUser.role + " focus: assign the correct technician, keep response target realistic, and document escalation path before work starts.");
    setInputValue("assignedBy", currentUser.displayName);

    if (currentUser.role !== "Supervisor" && currentUser.role !== "Maintenance Head" && currentUser.role !== "Admin") {
      disableFields(["assignedTechnician", "assignedBy", "assignmentDate", "assignmentTime", "responseTarget", "expectedStatus", "supportLevel", "relatedVendor", "assignmentInstruction", "followUpOwner", "closureExpectation", "delayEscalation", "repeatIssueAction"], true);
      updateWorkflowFormBadge("Assignment Form", "Review Only", "secondary");
    } else {
      updateWorkflowFormBadge("Assignment Form", "Supervisor Control", "primary");
    }

    renderTable("Technician Availability", technicians.map(function (user) {
      const loadItem = helpers.getTechnicianLoad().find(function (entry) {
        return entry.technician === user.name;
      }) || { breakdown: 0, pm: 0 };
      const totalLoad = loadItem.breakdown + loadItem.pm;
      return [
        "<tr>",
        '<td data-label="Technician"><strong>' + escapeHtml(user.name) + "</strong></td>",
        '<td data-label="Skill">' + escapeHtml(user.department + " support") + "</td>",
        '<td data-label="Open Jobs">' + escapeHtml(totalLoad) + "</td>",
        '<td data-label="Status"><span class="badge text-bg-' + (totalLoad > 2 ? "warning" : "success") + '">' + escapeHtml(totalLoad > 2 ? "Busy" : "Ready") + "</span></td>",
        "</tr>"
      ].join("");
    }).join(""));

    if (workflow) {
      renderWorkflowStages("Assignment Checklist", "breakdown", "assign");
    }
  }

  function applyTechnicianTaskUpdateRoleLogic() {
    if (!data || currentFileName !== "technician-task-update.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const ticket = getTicket(data.pageContext.technicianUpdateReference);
    const latestApproval = getApprovalItems(ticket.id)[0];

    updateHeaderActions([
      currentUser.role === "Technician" ? "Back to Task Board" : "Task Board",
      currentUser.role === "Technician" ? "Post Technician Update" : "Review Task Update"
    ]);

    if (currentUser.role === "Technician") {
      setInputValue("updateTechnician", currentUser.displayName);
    } else {
      disableFields(["updateDate", "updateTime", "updateTechnician", "updateStatus", "supportNeed", "nextAction", "workDone", "currentObservation", "productionImpact", "handoverNeed", "handoverNote"], true);
    }

    updateCardSectionText("Detailed Update Form", currentUser.role + " focus: execution note must show work done, current observation, support need, and handover risk clearly.");
    renderSimpleStack("Update Checklist", [
      { label: "Corrective Note", note: "Describe the actual maintenance action taken on the machine.", value: "Required", badgeClass: "primary" },
      { label: "Support Need", note: latestApproval ? latestApproval.note : "Mention spare, vendor, or supervisor support if needed.", value: latestApproval ? latestApproval.status : "Open", badgeClass: latestApproval ? helpers.statusBadgeClass(latestApproval.status) : "warning" },
      { label: "Handover Discipline", note: "Explain what next shift should watch if the work is not fully closed.", value: "Mandatory", badgeClass: "warning" }
    ]);
  }

  function applyTechnicianTasksRoleLogic() {
    if (!data || currentFileName !== "technician-tasks.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const tasks = data.histories.technicianBoard;

    updateHeaderActions([
      currentUser.role === "Technician" ? "Breakdown Board" : "Work Queue",
      currentUser.role === "Technician" ? "Post New Update" : currentUser.role === "Supervisor" ? "Review Work Update" : "New Update"
    ]);
    updateTopAlertMessage(currentUser.role + " focus: breakdown and PM tasks should stay split, while spare-needed, vendor-needed, and shift handover risks stay visible in the same board.", "warning");
    renderActivityList("Shift Priorities", tasks.map(function (task) {
      return {
        color: task.status === "Overdue" ? "danger" : task.status === "In Progress" ? "warning" : "primary",
        title: task.reference + " / " + task.machineId,
        note: task.note + " | Support: " + (task.supportNeed || "None"),
        time: task.status
      };
    }).slice(0, 4));

    const registerCard = findCardByTitle("Technician Work Register");
    if (!registerCard) {
      return;
    }

    const rows = registerCard.querySelectorAll("tbody tr");
    rows.forEach(function (row, index) {
      const task = tasks[index];
      const actionWrap = row.querySelector(".table-actions");
      if (!task || !actionWrap) {
        return;
      }

      if (currentUser.role === "Technician") {
        actionWrap.innerHTML = '<a href="' + task.actionHref + '" class="btn btn-sm btn-outline-primary">' + escapeHtml(task.actionLabel) + '</a><a href="' + task.secondaryHref + '" class="btn btn-sm btn-outline-secondary">Update</a>';
      } else if (currentUser.role === "Supervisor") {
        actionWrap.innerHTML = '<a href="' + task.actionHref + '" class="btn btn-sm btn-outline-primary">Review</a><a href="ticket-details.html" class="btn btn-sm btn-outline-secondary">Acceptance</a>';
      } else {
        actionWrap.innerHTML = '<a href="' + task.actionHref + '" class="btn btn-sm btn-outline-primary">Details</a><a href="' + task.secondaryHref + '" class="btn btn-sm btn-outline-secondary">Follow Up</a>';
      }
    });
  }

  function applyPmScheduleRoleLogic() {
    if (!data || currentFileName !== "pm-schedule.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const workflow = getWorkflowBlueprint("pm");

    updateHeaderActions([
      currentUser.role === "Maintenance Head" ? "View Due Exceptions" : "View Due Items",
      currentUser.role === "Maintenance Head" ? "Review PM Plan" : currentUser.role === "Technician" ? "My PM Queue" : "Create PM Plan"
    ]);
    updateCompactNote("PM Control Snapshot", currentUser.role + " focus: PM defer approval, spare shortage, and vendor-aware rent machine PM risk should stay visible in one control board.");

    if (workflow) {
      updateCardSectionText("PM Workflow Notes", currentUser.role + " review: keep approval points practical and visible.");
      updateCompactNote("PM Workflow Notes", workflow.approvals.join(" | "));
    }

    const scheduleCard = findCardByTitle("PM Schedule Register");
    if (!scheduleCard) {
      return;
    }

    const rows = scheduleCard.querySelectorAll("tbody tr");
    rows.forEach(function (row, index) {
      const plan = data.pmPlans[index];
      const actionWrap = row.querySelector(".table-actions");
      if (!plan || !actionWrap) {
        return;
      }

      if (currentUser.role === "Technician") {
        actionWrap.innerHTML = '<a href="pm-checklist.html" class="btn btn-sm btn-outline-primary">Checklist</a><a href="technician-task-update.html" class="btn btn-sm btn-outline-secondary">Update</a>';
      } else if (currentUser.role === "Maintenance Head") {
        actionWrap.innerHTML = '<a href="pm-due.html" class="btn btn-sm btn-outline-primary">Exception</a><a href="' + (plan.vendorAware ? "return-replace.html" : "machine-details.html") + '" class="btn btn-sm btn-outline-secondary">' + escapeHtml(plan.vendorAware ? "Risk" : "Machine") + "</a>";
      } else {
        actionWrap.innerHTML = '<a href="pm-checklist.html" class="btn btn-sm btn-outline-primary">Checklist</a><a href="technician-tasks.html" class="btn btn-sm btn-outline-secondary">Follow Up</a>';
      }
    });
  }

  function applyPmDueRoleLogic() {
    if (!data || currentFileName !== "pm-due.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const approvals = data.approvalQueue.filter(function (approval) {
      return approval.module === "PM Defer Approval";
    });

    updateHeaderActions([
      currentUser.role === "Maintenance Head" ? "Back to PM Board" : "PM Schedule",
      currentUser.role === "Maintenance Head" ? "Approve Exceptions" : currentUser.role === "Technician" ? "My PM Tasks" : "Technician Follow-Up"
    ]);
    updateTopAlertMessage(currentUser.role + " focus: overdue PM should show delay reason, closure owner, and exception approval together.", "warning");
    renderSimpleStack("Priority Follow-Up Board", [
      { label: "Critical Overdue", note: "PM-2026-043 remains blocked by spare shortage and vendor-aware follow-up.", value: "Escalate", badgeClass: "danger" },
      { label: "Defer Approval", note: approvals[0] ? approvals[0].note : "No PM defer approval is open.", value: approvals[0] ? approvals[0].status : "Clear", badgeClass: approvals[0] ? helpers.statusBadgeClass(approvals[0].status) : "success" },
      { label: "Production Release", note: "Supervisor should confirm release for machines returning from PM with observation.", value: "Watch", badgeClass: "warning" }
    ]);

    const focusPlans = data.pmPlans.filter(function (plan) {
      return ["Due", "Overdue", "Planned"].indexOf(plan.status) > -1;
    });
    const dueCard = findCardByTitle("Due PM Register");
    if (!dueCard) {
      return;
    }

    const rows = dueCard.querySelectorAll("tbody tr");
    rows.forEach(function (row, index) {
      const plan = focusPlans[index];
      const actionWrap = row.querySelector(".table-actions");
      if (!plan || !actionWrap) {
        return;
      }

      if (currentUser.role === "Technician") {
        actionWrap.innerHTML = '<a href="pm-checklist.html" class="btn btn-sm btn-outline-primary">Checklist</a><a href="technician-task-update.html" class="btn btn-sm btn-outline-secondary">Update</a>';
      } else if (currentUser.role === "Maintenance Head") {
        actionWrap.innerHTML = '<a href="' + (plan.vendorAware ? "return-replace.html" : "machine-details.html") + '" class="btn btn-sm btn-outline-primary">' + escapeHtml(plan.vendorAware ? "Risk" : "Machine") + '</a><a href="pm-complete.html" class="btn btn-sm btn-outline-secondary">' + escapeHtml(plan.status === "Overdue" ? "Approve" : "Close") + "</a>";
      } else {
        actionWrap.innerHTML = '<a href="' + (helpers.getMachine(plan.machineId).ownership === "Rent" ? "rent-machine-details.html" : "machine-details.html") + '" class="btn btn-sm btn-outline-primary">Machine</a><a href="technician-tasks.html" class="btn btn-sm btn-outline-secondary">Follow Up</a>';
      }
    });
  }

  function applyReturnReplaceRoleLogic() {
    if (!data || currentFileName !== "return-replace.html") {
      return;
    }

    const currentUser = getEffectiveCurrentUser();
    const workflow = getWorkflowBlueprint("returnReplace");
    const activeRequest = data.histories.returnReplaceRequests[0];
    const activeApproval = getApprovalItems(activeRequest.id)[0];

    updateHeaderActions([
      currentUser.role === "Maintenance Head" ? "Export Approval Queue" : "Export Flow List",
      currentUser.role === "Maintenance Head" ? "Save and Route Approval" : currentUser.role === "Supervisor" ? "Save Recommendation" : "Save Request"
    ]);
    updateCardSectionText("Request Entry Form", currentUser.role + " focus: request should keep vendor, agreement, production impact, approval owner, and backup arrangement together.");

    if (activeApproval) {
      setInputValue("approvedBy", currentUser.role === "Maintenance Head" || currentUser.role === "Admin" ? currentUser.displayName : activeApproval.approver);
    }

    if (currentUser.role !== "Maintenance Head" && currentUser.role !== "Admin") {
      disableFields(["requestStatus", "requestVendor", "requestAgreement", "vendorReplyDate", "approvedBy", "completionTarget"], true);
    }

    if (workflow) {
      updateCardSectionText("Flow Rules", currentUser.role + " review: return and replacement flow must keep approval and vendor response visible.");
      updateCompactNote("Flow Rules", workflow.approvals.join(" | "));
    }

    renderActivityList("Recent Flow Updates", data.histories.returnReplaceRequests.slice(0, 3).map(function (request) {
      return {
        color: request.flowStatus === "Completed" ? "success" : request.flowStatus === "Vendor Review" ? "warning" : "primary",
        title: request.id + " / " + request.requestType,
        note: request.approvalStage + ". " + request.alternateSupport,
        time: formatShortDate(request.requestDate)
      };
    }));
  }

  const pageRenderers = {
    "dashboard.html": renderDashboardPage,
    "rent-machines.html": renderRentMachinesPage,
    "vendors.html": renderVendorPage,
    "agreements.html": renderAgreementPage,
    "breakdown-list.html": renderBreakdownPage,
    "pm-schedule.html": renderPmSchedulePage,
    "reports.html": renderReportsPage,
    "report-breakdown.html": renderBreakdownReportPage,
    "report-pm.html": renderPmReportPage,
    "report-downtime.html": renderDowntimeReportPage,
    "report-rent-machine.html": renderRentMachineReportPage,
    "machine-details.html": renderMachineDetailsPage,
    "rent-machine-details.html": renderRentMachineDetailsPage,
    "vendor-details.html": renderVendorDetailsPage,
    "agreement-details.html": renderAgreementDetailsPage,
    "ticket-details.html": renderTicketDetailsPage,
    "ticket-assign.html": renderTicketAssignPage,
    "technician-task-update.html": renderTechnicianTaskUpdatePage,
    "technician-tasks.html": renderTechnicianTasksPage,
    "machine-history.html": renderMachineHistoryPage,
    "rent-machine-history.html": renderRentMachineHistoryPage,
    "pm-due.html": renderPmDuePage,
    "return-replace.html": renderReturnReplacePage,
    "breakdown-history.html": renderBreakdownHistoryPage
  };

  const workflowEnhancers = {
    "breakdown-form.html": renderBreakdownFormPage,
    "ticket-close.html": renderTicketClosePage,
    "pm-checklist.html": renderPmChecklistPage,
    "pm-complete.html": renderPmCompletePage,
    "spare-parts.html": renderSparePartsPage,
    "spare-low-stock.html": renderSpareLowStockPage,
    "stock-history.html": renderStockHistoryPage,
    "breakdown-list.html": applyBreakdownListRoleLogic,
    "ticket-details.html": applyTicketDetailsRoleLogic,
    "ticket-assign.html": applyTicketAssignRoleLogic,
    "technician-task-update.html": applyTechnicianTaskUpdateRoleLogic,
    "technician-tasks.html": applyTechnicianTasksRoleLogic,
    "pm-schedule.html": applyPmScheduleRoleLogic,
    "pm-due.html": applyPmDueRoleLogic,
    "return-replace.html": applyReturnReplaceRoleLogic
  };

  function runCurrentPageHandler(registry) {
    if (!registry || typeof registry[currentFileName] !== "function") {
      return;
    }

    registry[currentFileName]();
  }

  function renderOperationalPages() {
    runCurrentPageHandler(pageRenderers);
    runCurrentPageHandler(workflowEnhancers);

    if (layout && typeof layout.refreshPageOutline === "function") {
      layout.refreshPageOutline();
    }

    if (layout && typeof layout.refreshAdaptiveLayout === "function") {
      layout.refreshAdaptiveLayout();
    }

    decoratePrototypeActions(document);
  }

  function initLayoutChrome() {
    if (layout) {
      layout.initLayout();
    }

    if (prototypeActions) {
      prototypeActions.initPrototypeActions();
    }
  }

  function initSidebarInteractions() {
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 992) {
        closeSidebar();
      }

      if (layout && typeof layout.refreshAdaptiveLayout === "function") {
        layout.refreshAdaptiveLayout();
      }
    });
  }

  function initLoginInteractions() {
    if (togglePassword && passwordInput) {
      togglePassword.addEventListener("click", function () {
        const isPassword = passwordInput.getAttribute("type") === "password";
        passwordInput.setAttribute("type", isPassword ? "text" : "password");
        togglePassword.textContent = isPassword ? "Hide" : "Show";
      });
    }

    demoRoleButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (userIdInput) {
          userIdInput.value = button.getAttribute("data-user") || "";
        }

        if (userRoleSelect) {
          userRoleSelect.value = button.getAttribute("data-role") || "Admin";
        }

        const demoName = button.getAttribute("data-name");
        const demoUserId = button.getAttribute("data-user") || "";
        if (demoName) {
          demoUserNames[demoUserId] = demoName;
        }

        if (loginAlert) {
          loginAlert.className = "alert alert-success mb-0";
          loginAlert.textContent = "Demo role loaded. Click login to continue.";
        }
      });
    });

    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        saveCurrentUser();

        if (loginAlert) {
          loginAlert.className = "alert alert-primary mb-0";
          loginAlert.textContent = "Login successful. Redirecting to dashboard...";
        }

        window.setTimeout(function () {
          window.location.href = "dashboard.html";
        }, 700);
      });
    }
  }

  function initSharedFieldSync() {
    if (currentDateLabel) {
      currentDateLabel.textContent = formatDate(new Date());
    }

    populateSharedLookups();

    if (machineCodeInput) {
      syncMachineType();
      machineCodeInput.addEventListener("change", syncMachineType);
      machineCodeInput.addEventListener("input", syncMachineType);
    }

    if (problemTypeSelect) {
      syncProblemDetails();
      problemTypeSelect.addEventListener("change", syncProblemDetails);
    }

    if (complaintDateInput || complaintTimeInput) {
      setCurrentDateTime();
    }

    if (raisedByInput || raisedRoleSelect) {
      fillComplaintUserInfo();
    }

    setupMachineForm();
  }

  initLayoutChrome();
  initSidebarInteractions();
  initLoginInteractions();
  initSharedFieldSync();

  if (!isLoginPage) {
    if (!redirectRestrictedRolePage()) {
      renderOperationalPages();
      applyReadOnlyRoleUiRestrictions();
    }
  }
});
