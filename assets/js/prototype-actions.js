(function () {
  let observerStarted = false;

  function ensureToastContainer() {
    if (document.getElementById("appToastContainer")) {
      return;
    }

    const container = document.createElement("div");
    container.id = "appToastContainer";
    container.className = "toast-container position-fixed top-0 end-0 p-3 app-toast-container";
    document.body.appendChild(container);
  }

  function ensureActionModal() {
    if (document.getElementById("appActionModal")) {
      return;
    }

    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "appActionModal";
    modal.tabIndex = -1;
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = [
      '<div class="modal-dialog modal-dialog-centered">',
      '<div class="modal-content">',
      '<div class="modal-header">',
      '<h5 class="modal-title" id="appActionModalTitle">Confirm Action</h5>',
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>',
      "</div>",
      '<div class="modal-body" id="appActionModalBody">Do you want to continue with this prototype action?</div>',
      '<div class="modal-footer">',
      '<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>',
      '<button type="button" class="btn btn-primary" id="appActionModalConfirm">Confirm</button>',
      "</div>",
      "</div>",
      "</div>"
    ].join("");

    document.body.appendChild(modal);
  }

  function showToast(message, tone) {
    ensureToastContainer();

    const container = document.getElementById("appToastContainer");
    const classMap = {
      success: "text-bg-success",
      warning: "text-bg-warning",
      danger: "text-bg-danger",
      info: "text-bg-primary",
      primary: "text-bg-primary"
    };
    const toast = document.createElement("div");
    toast.className = "toast align-items-center border-0 " + (classMap[tone] || "text-bg-primary");
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-atomic", "true");
    toast.innerHTML = [
      '<div class="d-flex">',
      '<div class="toast-body">' + message + "</div>",
      '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>',
      "</div>"
    ].join("");

    container.appendChild(toast);

    if (window.bootstrap && window.bootstrap.Toast) {
      const bsToast = new window.bootstrap.Toast(toast, { delay: 2200 });
      bsToast.show();
      toast.addEventListener("hidden.bs.toast", function () {
        toast.remove();
      });
      return;
    }

    window.setTimeout(function () {
      toast.remove();
    }, 2200);
  }

  function confirmAction(title, message, onConfirm) {
    ensureActionModal();

    const modalElement = document.getElementById("appActionModal");
    const titleElement = document.getElementById("appActionModalTitle");
    const bodyElement = document.getElementById("appActionModalBody");
    const confirmButton = document.getElementById("appActionModalConfirm");

    titleElement.textContent = title;
    bodyElement.textContent = message;

    const newButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newButton, confirmButton);
    newButton.addEventListener("click", function () {
      if (window.bootstrap && window.bootstrap.Modal) {
        const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
        modalInstance.hide();
      }

      if (typeof onConfirm === "function") {
        onConfirm();
      }
    });

    if (window.bootstrap && window.bootstrap.Modal) {
      const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  }

  function getElementLabel(element) {
    return ((element && (element.dataset.prototypeLabel || element.textContent)) || "").trim();
  }

  function isActualNavigationLink(element) {
    const href = element.getAttribute("href") || "";
    return element.tagName === "A" && href && href !== "#" && !href.startsWith("javascript:");
  }

  function inferActionFromElement(element) {
    if (!element) {
      return "";
    }

    const explicitAction = (element.getAttribute("data-action") || "").trim().toLowerCase();
    if (explicitAction) {
      return explicitAction;
    }

    const label = getElementLabel(element).toLowerCase();
    const href = (element.getAttribute("href") || "").toLowerCase();
    const isNavigation = isActualNavigationLink(element);

    if (element.matches('.page-link[href="#"]')) {
      return "pagination";
    }

    if (label.indexOf("logout") > -1) {
      return "logout";
    }

    if (label.indexOf("export") > -1 || label.indexOf("download") > -1) {
      return label.indexOf("download") > -1 ? "download" : "export";
    }

    if (label.indexOf("print") > -1) {
      return "print";
    }

    if (label === "find" || label.indexOf("apply filter") > -1 || label.indexOf("search") > -1 || label.indexOf("refresh filter") > -1) {
      return "filter";
    }

    if (label.indexOf("approve") > -1) {
      return "approve";
    }

    if (label.indexOf("reject") > -1 || label.indexOf("decline") > -1) {
      return "reject";
    }

    if (label.indexOf("close") > -1) {
      return isNavigation ? "" : "close";
    }

    if (label.indexOf("complete") > -1) {
      return isNavigation ? "" : "complete";
    }

    if (label.indexOf("save") > -1 || label.indexOf("create ") > -1 || label.indexOf("generate sample") > -1 || label === "generate") {
      return isNavigation ? "" : "prototype-save";
    }

    if (label.indexOf("assign") > -1 || label.indexOf("follow up") > -1 || label.indexOf("status update") > -1) {
      return isNavigation ? "" : "status-update";
    }

    if (href.indexOf("reports") > -1 && label.indexOf("export") > -1) {
      return "export";
    }

    return "";
  }

  function getPreferredLabel(action, originalLabel) {
    if (!originalLabel) {
      return originalLabel;
    }

    if ((action === "export" || action === "download") && originalLabel.indexOf("Demo ") !== 0) {
      return "Demo " + originalLabel;
    }

    if (action === "print" && originalLabel.indexOf("Sample ") !== 0) {
      return "Sample " + originalLabel;
    }

    if (action === "filter" && originalLabel === "Find") {
      return "Apply Filter";
    }

    if (action === "prototype-save" && originalLabel === "Generate") {
      return "Generate Sample";
    }

    return originalLabel;
  }

  function getActionTitle(action) {
    const titleMap = {
      export: "Prototype export action using shared sample data",
      download: "Prototype download action using shared sample data",
      print: "Sample print action for this ERP prototype",
      filter: "Apply shared sample filters",
      "prototype-save": "Prototype save action without backend storage",
      "status-update": "Prototype workflow update action",
      approve: "Simulated approval action for workflow review",
      reject: "Simulated rejection action for workflow review"
    };

    return titleMap[action] || "";
  }

  function decorateActionElement(element) {
    if (!element || !element.tagName) {
      return;
    }

    if (!element.dataset.prototypeLabel) {
      element.dataset.prototypeLabel = getElementLabel(element);
    }

    const action = inferActionFromElement(element);
    const originalLabel = element.dataset.prototypeLabel || "";
    if (!action) {
      return;
    }

    element.setAttribute("data-action", action);
    const nextLabel = getPreferredLabel(action, originalLabel);

    if (nextLabel && element.textContent.trim() !== nextLabel) {
      element.textContent = nextLabel;
    }

    const title = getActionTitle(action);
    if (title && !element.getAttribute("title")) {
      element.setAttribute("title", title);
    }
  }

  function decorateActionElements(root) {
    const target = root && root.querySelectorAll ? root : document;
    const candidates = target.querySelectorAll("button, a.btn, .dropdown-item, .page-link");
    candidates.forEach(function (element) {
      decorateActionElement(element);
    });
  }

  function handleAction(element) {
    const action = (element.getAttribute("data-action") || "").toLowerCase();

    if (action === "logout") {
      localStorage.removeItem("lmlCurrentUser");
      showToast("You have been signed out from prototype mode.", "info");
      window.setTimeout(function () {
        window.location.href = "login.html";
      }, 450);
      return true;
    }

    if (action === "pagination") {
      showToast("Demo pagination is active. Additional pages can be linked later.", "info");
      return true;
    }

    if (action === "export" || action === "download") {
      showToast("Demo export prepared for management review.", "success");
      return true;
    }

    if (action === "filter") {
      showToast("Filter applied using centralized sample data.", "info");
      return true;
    }

    if (action === "print") {
      window.print();
      return true;
    }

    if (action === "approve") {
      confirmAction("Simulated Approval", "Do you want to approve this sample record?", function () {
        showToast("Approval captured in prototype mode.", "success");
      });
      return true;
    }

    if (action === "reject") {
      confirmAction("Simulated Rejection", "Do you want to reject this sample record?", function () {
        showToast("Rejection captured in prototype mode.", "warning");
      });
      return true;
    }

    if (action === "prototype-save") {
      showToast("Prototype save completed. Data structure is ready for backend binding.", "success");
      return true;
    }

    if (action === "status-update" || action === "close" || action === "complete") {
      confirmAction("Simulated Status Update", "Do you want to continue this workflow update?", function () {
        showToast("Workflow status updated in prototype mode.", "success");
      });
      return true;
    }

    return false;
  }

  function startActionObserver() {
    if (observerStarted || !window.MutationObserver) {
      return;
    }

    observerStarted = true;
    const observer = new window.MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(function (node) {
            if (node && node.nodeType === 1) {
              decorateActionElement(node);
              decorateActionElements(node);
            }
          });
        }

        if (mutation.type === "characterData" && mutation.target && mutation.target.parentElement) {
          decorateActionElement(mutation.target.parentElement);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function initPrototypeActions() {
    ensureToastContainer();
    ensureActionModal();
    decorateActionElements(document);
    startActionObserver();

    document.addEventListener("click", function (event) {
      const buttonLike = event.target.closest("button, a.btn, .dropdown-item, .page-link");
      if (!buttonLike) {
        return;
      }

      decorateActionElement(buttonLike);

      if (buttonLike.type === "submit") {
        return;
      }

      if (buttonLike.tagName === "A" && isActualNavigationLink(buttonLike) && !buttonLike.hasAttribute("data-action")) {
        return;
      }

      if (handleAction(buttonLike)) {
        event.preventDefault();
      }
    });

    document.addEventListener("submit", function (event) {
      const form = event.target;
      if (!form || form.id === "loginForm" || form.id === "machineForm") {
        return;
      }

      event.preventDefault();
      showToast("Prototype save completed. Data structure is ready for backend binding.", "success");
    });
  }

  window.LMLPrototypeActions = {
    decorateActionElement: decorateActionElement,
    decorateActionElements: decorateActionElements,
    inferActionFromElement: inferActionFromElement,
    showToast: showToast,
    confirmAction: confirmAction,
    initPrototypeActions: initPrototypeActions
  };
})();
