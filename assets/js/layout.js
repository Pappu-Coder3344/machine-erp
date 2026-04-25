(function () {
  const storageKey = "lmlCurrentUser";
  const data = window.LMLData || null;

  function getCurrentFileName() {
    const path = window.location.pathname || "";
    const fileName = path.split("/").pop();
    return fileName || "dashboard.html";
  }

  function getCurrentUserProfile() {
    try {
      const storedValue = localStorage.getItem(storageKey);
      if (storedValue) {
        const parsedValue = JSON.parse(storedValue);
        if (parsedValue && parsedValue.displayName) {
          return parsedValue;
        }
      }
    } catch (error) {
      return {
        displayName: "Mahmud Hasan",
        role: "Admin"
      };
    }

    return {
      displayName: "Mahmud Hasan",
      role: "Admin"
    };
  }

  function getInitials(name) {
    return (name || "System")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(function (part) {
        return part.charAt(0).toUpperCase();
      })
      .join("");
  }

  function getModuleKey(fileName) {
    if (fileName === "dashboard.html") {
      return "dashboard";
    }

    if (fileName.indexOf("factory-") > -1 || fileName.indexOf("floor-") > -1 || fileName.indexOf("line-") > -1 || fileName.indexOf("section-") > -1 || fileName.indexOf("category") > -1) {
      return "setup";
    }

    if (fileName.indexOf("machine") > -1 && fileName.indexOf("rent-machine") === -1) {
      return "machines";
    }

    if (fileName.indexOf("rent-machine") > -1 || fileName === "rent-machines.html" || fileName === "return-replace.html" || fileName === "allocation.html" || fileName.indexOf("vendor") > -1 || fileName.indexOf("agreement") > -1) {
      return "rent";
    }

    if (fileName.indexOf("breakdown") > -1 || fileName.indexOf("ticket-") > -1 || fileName.indexOf("pm-") > -1 || fileName.indexOf("technician") > -1) {
      return "maintenance";
    }

    if (fileName.indexOf("spare") > -1 || fileName.indexOf("stock-history") > -1) {
      return "store";
    }

    if (fileName.indexOf("user-") > -1 || fileName.indexOf("roles-") > -1 || fileName.indexOf("profile") > -1 || fileName.indexOf("password") > -1) {
      return "users";
    }

    if (fileName.indexOf("report") > -1 || fileName === "reports.html") {
      return "reports";
    }

    return "";
  }

  function getPageKind(fileName) {
    if (fileName === "dashboard.html") {
      return "dashboard";
    }

    if (fileName.indexOf("report") > -1 || fileName === "reports.html") {
      return "report";
    }

    if (fileName.indexOf("history") > -1) {
      return "history";
    }

    if (fileName.indexOf("details") > -1) {
      return "detail";
    }

    if (fileName.indexOf("form") > -1 || fileName.indexOf("registration") > -1 || fileName.indexOf("edit") > -1) {
      return "form";
    }

    return "operational";
  }

  function getSidebarGroups() {
    return [
      {
        title: "Overview",
        items: [
          { label: "Dashboard", href: "dashboard.html", key: "dashboard", matches: ["dashboard.html"] }
        ]
      },
      {
        title: "Setup",
        items: [
          { label: "Factory Setup", href: "factory-list.html", key: "setup", matches: ["factory-list.html", "floor-list.html", "line-list.html", "section-list.html"] },
          { label: "Machine Category", href: "machine-category.html", key: "setup", matches: ["machine-category.html"] }
        ]
      },
      {
        title: "Machines",
        items: [
          { label: "Machine Master", href: "machines.html", key: "machines", matches: ["machines.html", "machine-registration.html", "machine-edit.html", "machine-details.html", "machine-history.html"] },
          { label: "Rent Machines", href: "rent-machines.html", key: "rent", matches: ["rent-machines.html", "rent-machine-form.html", "rent-machine-details.html", "rent-machine-history.html"] },
          { label: "Vendors", href: "vendors.html", key: "rent", matches: ["vendors.html", "vendor-form.html", "vendor-details.html"] },
          { label: "Agreements", href: "agreements.html", key: "rent", matches: ["agreements.html", "agreement-form.html", "agreement-details.html"] },
          { label: "Allocation", href: "allocation.html", key: "rent", matches: ["allocation.html"] },
          { label: "Return / Replace", href: "return-replace.html", key: "rent", matches: ["return-replace.html"] }
        ]
      },
      {
        title: "Maintenance",
        items: [
          { label: "Breakdown", href: "breakdown-list.html", key: "maintenance", matches: ["breakdown-list.html", "breakdown-form.html", "breakdown-history.html", "ticket-details.html", "ticket-assign.html", "ticket-close.html"] },
          { label: "PM Schedule", href: "pm-schedule.html", key: "maintenance", matches: ["pm-schedule.html", "pm-due.html", "pm-checklist.html", "pm-complete.html"] },
          { label: "Technician Tasks", href: "technician-tasks.html", key: "maintenance", matches: ["technician-tasks.html", "technician-task-update.html"] }
        ]
      },
      {
        title: "Store",
        items: [
          { label: "Spare Parts", href: "spare-parts.html", key: "store", matches: ["spare-parts.html", "spare-part-form.html", "spare-low-stock.html", "stock-history.html"] }
        ]
      },
      {
        title: "Users & Access",
        items: [
          { label: "User List", href: "user-list.html", key: "users", matches: ["user-list.html", "user-form.html", "roles-permissions.html"] },
          { label: "Profile", href: "profile.html", key: "users", matches: ["profile.html", "change-password.html"] }
        ]
      },
      {
        title: "Reports",
        items: [
          { label: "Reports", href: "reports.html", key: "reports", matches: ["reports.html", "report-breakdown.html", "report-downtime.html", "report-pm.html", "report-rent-machine.html"] }
        ]
      }
    ];
  }

  function getRoleUiPolicy(roleName) {
    if (!data || !data.roleUiPolicies) {
      return null;
    }

    return data.roleUiPolicies[roleName] || null;
  }

  function getCurrentRoleUiPolicy() {
    const currentUser = getCurrentUserProfile();
    return currentUser && currentUser.role ? getRoleUiPolicy(currentUser.role) : null;
  }

  function filterSidebarGroupsForRole(groups) {
    const policy = getCurrentRoleUiPolicy();
    if (!policy) {
      return groups;
    }

    const hiddenGroups = policy.sidebarHiddenGroups || [];
    const hiddenItems = policy.sidebarHiddenItems || [];

    return groups
      .filter(function (group) {
        return hiddenGroups.indexOf(group.title) === -1;
      })
      .map(function (group) {
        return {
          title: group.title,
          items: group.items.filter(function (item) {
            return hiddenItems.indexOf(item.label) === -1;
          })
        };
      })
      .filter(function (group) {
        return group.items.length > 0;
      });
  }

  function itemMatchesPage(item, fileName) {
    return item.href === fileName || (item.matches || []).indexOf(fileName) > -1;
  }

  function renderSidebarNavigation() {
    const sidebarNav = document.querySelector(".sidebar-nav");
    if (!sidebarNav) {
      return;
    }

    const fileName = getCurrentFileName();
    const groups = filterSidebarGroupsForRole(getSidebarGroups());
    const hasExplicitMatch = groups.some(function (group) {
      return group.items.some(function (item) {
        return itemMatchesPage(item, fileName);
      });
    });
    const currentModuleKey = getModuleKey(fileName);
    let fallbackActivated = false;

    const groupsMarkup = groups.map(function (group) {
      const itemsMarkup = group.items.map(function (item) {
        let isActive = itemMatchesPage(item, fileName);

        if (!isActive && !hasExplicitMatch && !fallbackActivated && item.key === currentModuleKey) {
          isActive = true;
          fallbackActivated = true;
        }

        return '<a class="nav-link-item' + (isActive ? " active" : "") + '" href="' + item.href + '">' + item.label + "</a>";
      }).join("");

      return [
        '<div class="sidebar-nav-group">',
        '<span class="sidebar-nav-heading">' + group.title + "</span>",
        itemsMarkup,
        "</div>"
      ].join("");
    }).join("");

    sidebarNav.innerHTML = groupsMarkup;
  }

  function getPageTrail(fileName) {
    const dashboard = { label: "Dashboard", href: "dashboard.html" };
    const explicitMap = {
      "dashboard.html": [dashboard],
      "factory-list.html": [dashboard, { label: "Factory Setup" }],
      "floor-list.html": [dashboard, { label: "Factory Setup", href: "factory-list.html" }, { label: "Floor List" }],
      "line-list.html": [dashboard, { label: "Factory Setup", href: "factory-list.html" }, { label: "Line List" }],
      "section-list.html": [dashboard, { label: "Factory Setup", href: "factory-list.html" }, { label: "Section List" }],
      "machine-category.html": [dashboard, { label: "Factory Setup", href: "factory-list.html" }, { label: "Machine Category" }],
      "machines.html": [dashboard, { label: "Machine Master" }],
      "machine-registration.html": [dashboard, { label: "Machine Master", href: "machines.html" }, { label: "Machine Registration" }],
      "machine-edit.html": [dashboard, { label: "Machine Master", href: "machines.html" }, { label: "Machine Edit" }],
      "machine-details.html": [dashboard, { label: "Machine Master", href: "machines.html" }, { label: "Machine Details" }],
      "machine-history.html": [dashboard, { label: "Machine Master", href: "machines.html" }, { label: "Machine History" }],
      "rent-machines.html": [dashboard, { label: "Rent Machines" }],
      "rent-machine-form.html": [dashboard, { label: "Rent Machines", href: "rent-machines.html" }, { label: "Rent Machine Entry" }],
      "rent-machine-details.html": [dashboard, { label: "Rent Machines", href: "rent-machines.html" }, { label: "Rent Machine Details" }],
      "rent-machine-history.html": [dashboard, { label: "Rent Machines", href: "rent-machines.html" }, { label: "Rent Machine History" }],
      "vendors.html": [dashboard, { label: "Vendors" }],
      "vendor-form.html": [dashboard, { label: "Vendors", href: "vendors.html" }, { label: "Vendor Form" }],
      "vendor-details.html": [dashboard, { label: "Vendors", href: "vendors.html" }, { label: "Vendor Details" }],
      "agreements.html": [dashboard, { label: "Agreements" }],
      "agreement-form.html": [dashboard, { label: "Agreements", href: "agreements.html" }, { label: "Agreement Form" }],
      "agreement-details.html": [dashboard, { label: "Agreements", href: "agreements.html" }, { label: "Agreement Details" }],
      "allocation.html": [dashboard, { label: "Allocation" }],
      "return-replace.html": [dashboard, { label: "Return / Replace" }],
      "breakdown-list.html": [dashboard, { label: "Breakdown" }],
      "breakdown-form.html": [dashboard, { label: "Breakdown", href: "breakdown-list.html" }, { label: "Complaint Entry" }],
      "breakdown-history.html": [dashboard, { label: "Breakdown", href: "breakdown-list.html" }, { label: "Breakdown History" }],
      "ticket-details.html": [dashboard, { label: "Breakdown", href: "breakdown-list.html" }, { label: "Ticket Details" }],
      "ticket-assign.html": [dashboard, { label: "Breakdown", href: "breakdown-list.html" }, { label: "Ticket Assign" }],
      "ticket-close.html": [dashboard, { label: "Breakdown", href: "breakdown-list.html" }, { label: "Ticket Close" }],
      "pm-schedule.html": [dashboard, { label: "PM Schedule" }],
      "pm-due.html": [dashboard, { label: "PM Schedule", href: "pm-schedule.html" }, { label: "PM Due" }],
      "pm-checklist.html": [dashboard, { label: "PM Schedule", href: "pm-schedule.html" }, { label: "PM Checklist" }],
      "pm-complete.html": [dashboard, { label: "PM Schedule", href: "pm-schedule.html" }, { label: "PM Completion" }],
      "technician-tasks.html": [dashboard, { label: "Technician Tasks" }],
      "technician-task-update.html": [dashboard, { label: "Technician Tasks", href: "technician-tasks.html" }, { label: "Task Update" }],
      "spare-parts.html": [dashboard, { label: "Spare Parts" }],
      "spare-part-form.html": [dashboard, { label: "Spare Parts", href: "spare-parts.html" }, { label: "Spare Part Form" }],
      "spare-low-stock.html": [dashboard, { label: "Spare Parts", href: "spare-parts.html" }, { label: "Low Stock" }],
      "stock-history.html": [dashboard, { label: "Spare Parts", href: "spare-parts.html" }, { label: "Stock History" }],
      "user-list.html": [dashboard, { label: "Users & Access" }],
      "user-form.html": [dashboard, { label: "Users & Access", href: "user-list.html" }, { label: "User Form" }],
      "roles-permissions.html": [dashboard, { label: "Users & Access", href: "user-list.html" }, { label: "Roles and Permissions" }],
      "profile.html": [dashboard, { label: "Users & Access", href: "user-list.html" }, { label: "Profile" }],
      "change-password.html": [dashboard, { label: "Users & Access", href: "profile.html" }, { label: "Change Password" }],
      "reports.html": [dashboard, { label: "Reports" }],
      "report-breakdown.html": [dashboard, { label: "Reports", href: "reports.html" }, { label: "Breakdown Report" }],
      "report-downtime.html": [dashboard, { label: "Reports", href: "reports.html" }, { label: "Downtime Report" }],
      "report-pm.html": [dashboard, { label: "Reports", href: "reports.html" }, { label: "PM Report" }],
      "report-rent-machine.html": [dashboard, { label: "Reports", href: "reports.html" }, { label: "Rent Machine Report" }]
    };

    return explicitMap[fileName] || [dashboard];
  }

  function getPageContextLabel(fileName) {
    const pageKind = getPageKind(fileName);

    if (pageKind === "report") {
      return "Management Review";
    }

    if (pageKind === "history") {
      return "History Record";
    }

    if (pageKind === "detail") {
      return "Detail View";
    }

    if (pageKind === "form") {
      return "Entry Form";
    }

    if (pageKind === "dashboard") {
      return "Control Tower";
    }

    return "Operational View";
  }

  function injectUserMenu() {
    const headerActions = document.querySelector(".header-actions");
    if (!headerActions || headerActions.querySelector(".app-user-menu")) {
      return;
    }

    const currentUser = getCurrentUserProfile();
    const wrapper = document.createElement("div");
    wrapper.className = "dropdown app-user-menu";
    wrapper.innerHTML = [
      '<button class="btn user-menu-trigger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">',
      '<span class="user-avatar">' + getInitials(currentUser.displayName) + "</span>",
      '<span class="user-meta"><strong>' + currentUser.displayName + "</strong><span>" + currentUser.role + "</span></span>",
      "</button>",
      '<ul class="dropdown-menu dropdown-menu-end shadow-sm">',
      '<li><a class="dropdown-item" href="profile.html">Profile</a></li>',
      '<li><a class="dropdown-item" href="change-password.html">Change Password</a></li>',
      '<li><hr class="dropdown-divider"></li>',
      '<li><button class="dropdown-item" type="button" data-action="logout">Logout</button></li>',
      "</ul>"
    ].join("");

    headerActions.appendChild(wrapper);
  }

  function injectBreadcrumb() {
    const mainContent = document.querySelector(".main-content");
    if (!mainContent || mainContent.querySelector(".page-breadcrumb-card")) {
      return;
    }

    const fileName = getCurrentFileName();
    const trail = getPageTrail(fileName);
    const currentUser = getCurrentUserProfile();
    const section = document.createElement("section");
    section.className = "content-section";

    const trailMarkup = trail.map(function (item, index) {
      const isLast = index === trail.length - 1;
      if (isLast || !item.href) {
        return '<li class="breadcrumb-item active" aria-current="page">' + item.label + "</li>";
      }

      return '<li class="breadcrumb-item"><a href="' + item.href + '">' + item.label + "</a></li>";
    }).join("");

    section.innerHTML = [
      '<div class="erp-card page-breadcrumb-card">',
      '<div class="page-breadcrumb">',
      '<nav aria-label="breadcrumb">',
      '<ol class="breadcrumb mb-0">',
      trailMarkup,
      "</ol>",
      "</nav>",
      '<div class="page-breadcrumb-meta">',
      '<span class="page-context-chip">' + getPageContextLabel(fileName) + "</span>",
      '<span class="page-role-chip">' + currentUser.role + "</span>",
      "</div>",
      "</div>",
      "</div>"
    ].join("");

    mainContent.insertBefore(section, mainContent.firstChild);
  }

  function shouldInjectAuditCard(fileName) {
    const keywords = ["form", "details", "history", "report", "profile", "password", "registration", "edit", "assign", "close", "checklist", "complete"];
    return keywords.some(function (keyword) {
      return fileName.indexOf(keyword) > -1;
    });
  }

  function injectAuditMeta() {
    const mainContent = document.querySelector(".main-content");
    const fileName = getCurrentFileName();
    if (!mainContent || mainContent.querySelector(".audit-meta-card") || !shouldInjectAuditCard(fileName)) {
      return;
    }

    const currentUser = getCurrentUserProfile();
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    const section = document.createElement("section");
    section.className = "content-section";
    section.innerHTML = [
      '<div class="erp-card audit-meta-card">',
      '<div class="section-header mb-3">',
      "<div>",
      '<h3 class="section-title">Audit and Record Readiness</h3>',
      '<p class="section-text mb-0">Prototype metadata block aligned with future backend fields like created by, approved by, and status traceability.</p>',
      "</div>",
      "</div>",
      '<div class="audit-meta-grid">',
      '<div class="audit-meta-item"><strong>Created By</strong><span>System Prototype</span></div>',
      '<div class="audit-meta-item"><strong>Created On</strong><span>05 Jan 2026</span></div>',
      '<div class="audit-meta-item"><strong>Last Updated By</strong><span>' + currentUser.displayName + "</span></div>",
      '<div class="audit-meta-item"><strong>Last Updated On</strong><span>' + today + "</span></div>",
      "</div>",
      "</div>"
    ].join("");

    mainContent.appendChild(section);
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function shouldInjectSectionOutline(fileName) {
    const pageKind = getPageKind(fileName);
    if (["detail", "history", "report"].indexOf(pageKind) > -1) {
      return true;
    }

    return ["dashboard.html", "pm-schedule.html", "reports.html", "breakdown-list.html", "technician-tasks.html", "spare-parts.html"].indexOf(fileName) > -1;
  }

  function collectOutlineItems(mainContent) {
    const items = [];
    const seen = {};
    const titleNodes = mainContent.querySelectorAll(".erp-card .section-title");

    titleNodes.forEach(function (titleNode) {
      const titleText = (titleNode.textContent || "").trim();
      const card = titleNode.closest(".erp-card");

      if (!titleText || !card || card.classList.contains("page-breadcrumb-card") || card.classList.contains("audit-meta-card")) {
        return;
      }

      if (seen[titleText]) {
        return;
      }

      seen[titleText] = true;

      if (!card.id) {
        card.id = "section-" + slugify(titleText);
      }

      card.classList.add("section-anchor-target");
      items.push({
        label: titleText,
        href: "#" + card.id
      });
    });

    return items.slice(0, 8);
  }

  function injectPageOutline() {
    const mainContent = document.querySelector(".main-content");
    const fileName = getCurrentFileName();
    if (!mainContent) {
      return;
    }

    const existingOutline = mainContent.querySelector(".page-outline-section");
    if (existingOutline) {
      existingOutline.remove();
    }

    if (!shouldInjectSectionOutline(fileName)) {
      return;
    }

    const outlineItems = collectOutlineItems(mainContent);
    if (outlineItems.length < 2) {
      return;
    }

    const section = document.createElement("section");
    section.className = "content-section page-outline-section";
    section.innerHTML = [
      '<div class="erp-card page-outline-card">',
      '<div class="page-outline-header">',
      '<strong>Quick Jump</strong>',
      '<span>Use this section index to move through the page faster.</span>',
      "</div>",
      '<div class="page-outline-links">',
      outlineItems.map(function (item) {
        return '<a class="page-outline-link" href="' + item.href + '">' + item.label + "</a>";
      }).join(""),
      "</div>",
      "</div>"
    ].join("");

    const breadcrumbSection = mainContent.querySelector(".page-breadcrumb-card");
    if (breadcrumbSection && breadcrumbSection.parentElement) {
      breadcrumbSection.parentElement.insertAdjacentElement("afterend", section);
      return;
    }

    mainContent.insertBefore(section, mainContent.firstChild);
  }

  function setBodyContextClasses() {
    const body = document.body;
    const fileName = getCurrentFileName();
    const moduleKey = getModuleKey(fileName) || "default";
    const pageKind = getPageKind(fileName) || "operational";

    Array.from(body.classList).forEach(function (className) {
      if (className.indexOf("app-module-") === 0 || className.indexOf("app-kind-") === 0) {
        body.classList.remove(className);
      }
    });

    body.classList.add("app-module-" + moduleKey);
    body.classList.add("app-kind-" + pageKind);
  }

  function isMobileViewport() {
    return window.innerWidth <= 767.98;
  }

  function getPrototypeActionsApi() {
    return window.LMLPrototypeActions || null;
  }

  function getSidebarElements() {
    return {
      body: document.body,
      sidebar: document.getElementById("sidebar"),
      backdrop: document.getElementById("sidebarBackdrop"),
      toggle: document.getElementById("sidebarToggle")
    };
  }

  function setSidebarOpen(nextState) {
    const elements = getSidebarElements();
    const isOpen = Boolean(nextState);

    elements.body.classList.toggle("sidebar-open", isOpen);

    if (elements.sidebar) {
      elements.sidebar.classList.toggle("is-open", isOpen);
    }

    if (elements.backdrop) {
      elements.backdrop.classList.toggle("is-visible", isOpen);
    }

    if (elements.toggle) {
      elements.toggle.setAttribute("aria-expanded", String(isOpen));
      elements.toggle.setAttribute("aria-controls", "sidebar");
    }
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function toggleSidebar(forceState) {
    if (window.innerWidth >= 992) {
      closeSidebar();
      return;
    }

    if (typeof forceState === "boolean") {
      setSidebarOpen(forceState);
      return;
    }

    const sidebar = document.getElementById("sidebar");
    const isOpen = document.body.classList.contains("sidebar-open") || (sidebar && sidebar.classList.contains("is-open"));
    setSidebarOpen(!isOpen);
  }

  function refreshPageOutline() {
    if (document.body.classList.contains("login-page")) {
      return;
    }

    injectPageOutline();
  }

  function buildActionClone(element, asDropdownItem) {
    const clone = element.cloneNode(true);
    clone.removeAttribute("id");

    if (asDropdownItem) {
      clone.className = element.tagName === "A" ? "dropdown-item" : "dropdown-item";
    } else {
      clone.classList.add("mobile-header-primary-btn");
    }

    if (clone.tagName === "BUTTON") {
      clone.setAttribute("type", "button");
    }

    return clone;
  }

  function getHeaderActionNodes() {
    return Array.from(document.querySelectorAll(".header-actions > .btn, .header-actions > a.btn")).filter(function (element) {
      return !element.classList.contains("user-menu-trigger");
    });
  }

  function syncMobileHeaderActions() {
    const header = document.querySelector(".top-header");
    const headerStart = header ? header.querySelector(".header-start") : null;
    const prototypeActions = getPrototypeActionsApi();

    if (!header || !headerStart) {
      return;
    }

    let mobileActionBar = header.querySelector(".mobile-header-actions");
    if (!mobileActionBar) {
      mobileActionBar = document.createElement("div");
      mobileActionBar.className = "mobile-header-actions";
      mobileActionBar.innerHTML = [
        '<div class="mobile-header-primary"></div>',
        '<div class="dropdown mobile-header-overflow">',
        '<button class="btn btn-outline-secondary mobile-overflow-trigger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">More</button>',
        '<ul class="dropdown-menu dropdown-menu-end mobile-header-overflow-menu"></ul>',
        "</div>"
      ].join("");

      header.insertBefore(mobileActionBar, headerStart.nextSibling);
    }

    const primaryWrap = mobileActionBar.querySelector(".mobile-header-primary");
    const overflowWrap = mobileActionBar.querySelector(".mobile-header-overflow");
    const overflowMenu = mobileActionBar.querySelector(".mobile-header-overflow-menu");
    const actionNodes = getHeaderActionNodes();
    const currentUser = getCurrentUserProfile();

    primaryWrap.innerHTML = "";
    overflowMenu.innerHTML = "";

    if (actionNodes[0]) {
      primaryWrap.appendChild(buildActionClone(actionNodes[0], false));
    }

    actionNodes.slice(1).forEach(function (node) {
      const item = document.createElement("li");
      item.appendChild(buildActionClone(node, true));
      overflowMenu.appendChild(item);
    });

    [
      { href: "profile.html", label: "Profile" },
      { href: "change-password.html", label: "Change Password" }
    ].forEach(function (itemConfig) {
      const item = document.createElement("li");
      item.innerHTML = '<a class="dropdown-item" href="' + itemConfig.href + '">' + itemConfig.label + "</a>";
      overflowMenu.appendChild(item);
    });

    const divider = document.createElement("li");
    divider.innerHTML = '<hr class="dropdown-divider">';
    overflowMenu.appendChild(divider);

    const logoutItem = document.createElement("li");
    logoutItem.innerHTML = '<button class="dropdown-item" type="button" data-action="logout">Logout ' + currentUser.role + "</button>";
    overflowMenu.appendChild(logoutItem);

    overflowWrap.classList.toggle("d-none", overflowMenu.children.length === 0);

    if (prototypeActions && typeof prototypeActions.decorateActionElements === "function") {
      prototypeActions.decorateActionElements(mobileActionBar);
    }
  }

  function toggleMobileMoreSheet(forceState) {
    const nextState = typeof forceState === "boolean" ? forceState : !document.body.classList.contains("mobile-more-sheet-open");
    document.body.classList.toggle("mobile-more-sheet-open", nextState);
  }

  function buildMoreSheetLinks() {
    const policy = getCurrentRoleUiPolicy();
    const links = [
      { href: "rent-machines.html", label: "Rent Machines" },
      { href: "vendors.html", label: "Vendors" },
      { href: "agreements.html", label: "Agreements" },
      { href: "allocation.html", label: "Allocation" },
      { href: "return-replace.html", label: "Return / Replace" },
      { href: "spare-parts.html", label: "Spare Parts" },
      { href: "reports.html", label: "Reports" },
      { href: "user-list.html", label: "Users & Access" },
      { href: "profile.html", label: "Profile" }
    ];

    if (policy && policy.moreSheetHiddenLinks && policy.moreSheetHiddenLinks.length) {
      return links.filter(function (link) {
        return policy.moreSheetHiddenLinks.indexOf(link.href) === -1;
      });
    }

    return links;
  }

  function injectMobileQuickNav() {
    const fileName = getCurrentFileName();
    const moduleKey = getModuleKey(fileName);
    const prototypeActions = getPrototypeActionsApi();
    let quickNav = document.querySelector(".mobile-quick-nav");
    let moreSheet = document.querySelector(".mobile-more-sheet");
    let moreBackdrop = document.querySelector(".mobile-more-backdrop");

    if (!quickNav) {
      quickNav = document.createElement("nav");
      quickNav.className = "mobile-quick-nav";
      document.body.appendChild(quickNav);
    }

    quickNav.innerHTML = [
      '<a class="mobile-quick-link' + (fileName === "dashboard.html" ? " active" : "") + '" href="dashboard.html"><span>Dashboard</span></a>',
      '<a class="mobile-quick-link' + (moduleKey === "maintenance" && fileName.indexOf("pm-") === -1 && fileName.indexOf("technician") === -1 ? " active" : "") + '" href="breakdown-list.html"><span>Breakdown</span></a>',
      '<a class="mobile-quick-link' + (fileName.indexOf("pm-") > -1 ? " active" : "") + '" href="pm-schedule.html"><span>PM</span></a>',
      '<a class="mobile-quick-link' + ((moduleKey === "machines" || fileName.indexOf("rent-machine") > -1 || fileName === "rent-machines.html") ? " active" : "") + '" href="machines.html"><span>Machines</span></a>'
    ].join("");

    if (moreSheet) {
      moreSheet.remove();
      moreSheet = null;
    }

    if (moreBackdrop) {
      moreBackdrop.remove();
      moreBackdrop = null;
    }

    toggleMobileMoreSheet(false);

    if (prototypeActions && typeof prototypeActions.decorateActionElements === "function") {
      prototypeActions.decorateActionElements(quickNav);
    }
  }

  function getQuickFilterChipLabels(fileName, moduleKey) {
    const explicitMap = {
      "dashboard.html": ["Today", "Urgent", "Overdue", "Low Stock"],
      "breakdown-list.html": ["Open", "High Priority", "My Shift", "Repeat Risk"],
      "pm-schedule.html": ["Due Today", "Overdue", "My Shift", "Rent PM"],
      "pm-due.html": ["Overdue", "Today", "Rent PM", "Exception"],
      "technician-tasks.html": ["My Tasks", "Breakdown", "PM", "Support Need"],
      "spare-parts.html": ["Low Stock", "Issue", "Receive", "PM Linked"],
      "spare-low-stock.html": ["Critical", "Machine Impact", "Purchase", "Store"],
      "machines.html": ["Active", "Breakdown", "Idle", "Line 03"],
      "rent-machines.html": ["Active", "Expiry Risk", "Vendor Risk", "Return Watch"],
      "reports.html": ["Today", "MTTR", "Vendor Risk", "Output Loss"]
    };

    if (explicitMap[fileName]) {
      return explicitMap[fileName];
    }

    const moduleMap = {
      maintenance: ["Open", "High Priority", "My Shift"],
      machines: ["Active", "Breakdown", "Line Watch"],
      rent: ["Rent Only", "Vendor Risk", "Expiry"],
      store: ["Low Stock", "Receive", "Issue"],
      reports: ["Today", "Weekly", "Risk"],
      users: ["Active", "Pending", "Approval"]
    };

    return moduleMap[moduleKey] || ["Today", "Open", "My Shift"];
  }

  function enhanceFilterPanels() {
    const fileName = getCurrentFileName();
    const moduleKey = getModuleKey(fileName);
    const prototypeActions = getPrototypeActionsApi();

    document.querySelectorAll(".filter-panel").forEach(function (panel) {
      panel.classList.add("mobile-adaptive-filter");

      let bodyWrap = panel.querySelector(".filter-panel-body");
      if (!bodyWrap) {
        bodyWrap = document.createElement("div");
        bodyWrap.className = "filter-panel-body";

        while (panel.firstChild) {
          bodyWrap.appendChild(panel.firstChild);
        }

        panel.appendChild(bodyWrap);
      }

      let mobileBar = panel.querySelector(".mobile-filter-toolbar");
      if (!mobileBar) {
        mobileBar = document.createElement("div");
        mobileBar.className = "mobile-filter-toolbar";
        mobileBar.innerHTML = [
          '<div class="mobile-filter-actions">',
          '<button class="btn btn-outline-secondary mobile-filter-toggle" type="button" data-filter-toggle="true" aria-expanded="false">Filters</button>',
          '<button class="btn btn-primary mobile-filter-apply" type="button" data-action="filter">Apply Filter</button>',
          "</div>",
          '<div class="mobile-filter-chips"></div>'
        ].join("");

        panel.insertBefore(mobileBar, bodyWrap);
      }

      const chipsWrap = mobileBar.querySelector(".mobile-filter-chips");
      const toggleButton = mobileBar.querySelector(".mobile-filter-toggle");
      chipsWrap.innerHTML = getQuickFilterChipLabels(fileName, moduleKey).map(function (label) {
        return '<button type="button" class="mobile-filter-chip" data-action="filter">' + label + "</button>";
      }).join("");

      if (isMobileViewport()) {
        panel.classList.add("is-filter-collapsed");
        toggleButton.setAttribute("aria-expanded", "false");
      } else {
        panel.classList.remove("is-filter-collapsed");
        toggleButton.setAttribute("aria-expanded", "true");
      }

      if (prototypeActions && typeof prototypeActions.decorateActionElements === "function") {
        prototypeActions.decorateActionElements(panel);
      }
    });
  }

  function cleanupMobileRow(row) {
    row.classList.remove("is-mobile-row", "is-expanded");
    row.querySelectorAll(".mobile-row-extra").forEach(function (cell) {
      cell.classList.remove("mobile-row-extra");
    });
    row.querySelectorAll(".mobile-action-extra").forEach(function (button) {
      button.classList.remove("mobile-action-extra");
    });
    row.querySelectorAll(".mobile-row-toggle").forEach(function (button) {
      button.remove();
    });
  }

  function enhanceMobileTables() {
    document.querySelectorAll(".mobile-card-table tbody tr").forEach(function (row) {
      cleanupMobileRow(row);

      if (!isMobileViewport()) {
        return;
      }

      const cells = Array.from(row.querySelectorAll("td"));
      const actionCell = cells.find(function (cell) {
        return cell.querySelector(".table-actions");
      }) || null;
      const nonActionCells = cells.filter(function (cell) {
        return cell !== actionCell;
      });
      const pinnedCells = [];

      nonActionCells.forEach(function (cell, index) {
        const label = (cell.getAttribute("data-label") || "").toLowerCase();
        const isAlwaysVisible = index < 3 || label.indexOf("status") > -1 || label.indexOf("priority") > -1;
        if (isAlwaysVisible) {
          pinnedCells.push(cell);
        }
      });

      const extraCells = nonActionCells.filter(function (cell) {
        return pinnedCells.indexOf(cell) === -1;
      });

      extraCells.forEach(function (cell) {
        cell.classList.add("mobile-row-extra");
      });

      let extraActionsCount = 0;
      if (actionCell) {
        const actions = Array.from(actionCell.querySelectorAll(".table-actions .btn, .table-actions a"));
        actions.slice(2).forEach(function (button) {
          button.classList.add("mobile-action-extra");
          extraActionsCount += 1;
        });
      }

      if (extraCells.length || extraActionsCount) {
        const toggleHost = actionCell || pinnedCells[pinnedCells.length - 1] || cells[cells.length - 1];
        if (toggleHost) {
          const toggle = document.createElement("button");
          toggle.type = "button";
          toggle.className = "mobile-row-toggle";
          toggle.setAttribute("aria-expanded", "false");
          toggle.textContent = "More details";
          toggleHost.appendChild(toggle);
          row.classList.add("is-mobile-row");
        }
      }
    });
  }

  function setupCollapsibleCards() {
    const fileName = getCurrentFileName();
    const pageKind = getPageKind(fileName);
    const shouldCollapse = isMobileViewport() && ["detail", "history", "report"].indexOf(pageKind) > -1;

    document.querySelectorAll(".main-content .erp-card").forEach(function (card, index) {
      if (card.classList.contains("page-breadcrumb-card") || card.classList.contains("page-outline-card") || card.classList.contains("audit-meta-card") || card.classList.contains("filter-panel")) {
        return;
      }

      const header = card.querySelector(".section-header");
      if (!header) {
        return;
      }

      let bodyWrap = card.querySelector(".mobile-card-body");
      if (!bodyWrap) {
        bodyWrap = document.createElement("div");
        bodyWrap.className = "mobile-card-body";

        while (header.nextSibling) {
          bodyWrap.appendChild(header.nextSibling);
        }

        card.appendChild(bodyWrap);
      }

      let toggle = header.querySelector(".mobile-card-toggle");
      if (!toggle) {
        toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "mobile-card-toggle";
        toggle.setAttribute("aria-expanded", "true");
        toggle.textContent = "Hide";
        header.appendChild(toggle);
      }

      card.classList.add("mobile-collapsible-card");

      if (!shouldCollapse) {
        card.classList.add("mobile-card-expanded");
        toggle.setAttribute("aria-expanded", "true");
        toggle.textContent = "Hide";
        return;
      }

      const defaultExpanded = index < 2;
      card.classList.toggle("mobile-card-expanded", defaultExpanded);
      toggle.setAttribute("aria-expanded", defaultExpanded ? "true" : "false");
      toggle.textContent = defaultExpanded ? "Hide" : "Show";
    });
  }

  function applyMobileSectionOrdering() {
    const mainContent = document.querySelector(".main-content");
    const fileName = getCurrentFileName();

    if (!mainContent) {
      return;
    }

    const sections = Array.from(mainContent.children).filter(function (node) {
      return node.classList && node.classList.contains("content-section");
    });

    sections.forEach(function (section, index) {
      section.style.order = "";
      section.dataset.sectionOrder = String(index + 1);
    });

    mainContent.classList.remove("mobile-ordered-layout");

    if (!isMobileViewport() || fileName !== "dashboard.html") {
      return;
    }

    const filterSection = sections.find(function (section) {
      return section.querySelector(".filter-panel");
    });
    const summarySection = sections.find(function (section) {
      return section.querySelector(".summary-card");
    });
    const prioritySection = sections.find(function (section) {
      return section.querySelector(".priority-list");
    });

    mainContent.classList.add("mobile-ordered-layout");
    sections.forEach(function (section, index) {
      section.style.order = String(index + 1);
    });

    if (prioritySection) {
      prioritySection.style.order = "3";
    }

    if (filterSection) {
      filterSection.style.order = "4";
    }

    if (summarySection) {
      summarySection.style.order = "5";
    }
  }

  function refreshAdaptiveLayout() {
    if (document.body.classList.contains("login-page")) {
      return;
    }

    if (!isMobileViewport()) {
      toggleMobileMoreSheet(false);
    }

    syncMobileHeaderActions();
    injectMobileQuickNav();
    enhanceFilterPanels();
    enhanceMobileTables();
    setupCollapsibleCards();
    applyMobileSectionOrdering();
  }

  function bindAdaptiveInteractions() {
    if (document.body.dataset.layoutAdaptiveBound === "true") {
      return;
    }

    document.body.dataset.layoutAdaptiveBound = "true";

    document.addEventListener("click", function (event) {
      const sidebarToggle = event.target.closest("#sidebarToggle");
      if (sidebarToggle) {
        event.preventDefault();
        toggleSidebar();
        return;
      }

      if (event.target.closest("#sidebarBackdrop")) {
        closeSidebar();
        return;
      }

      const sidebarLink = event.target.closest(".sidebar .nav-link-item");
      if (sidebarLink && window.innerWidth < 992) {
        closeSidebar();
      }

      const filterToggle = event.target.closest("[data-filter-toggle]");
      if (filterToggle) {
        const panel = filterToggle.closest(".filter-panel");
        if (panel) {
          const isCollapsed = panel.classList.toggle("is-filter-collapsed");
          filterToggle.setAttribute("aria-expanded", String(!isCollapsed));
        }
        return;
      }

      const rowToggle = event.target.closest(".mobile-row-toggle");
      if (rowToggle) {
        const row = rowToggle.closest("tr");
        if (row) {
          const nextState = !row.classList.contains("is-expanded");
          row.classList.toggle("is-expanded", nextState);
          rowToggle.setAttribute("aria-expanded", String(nextState));
          rowToggle.textContent = nextState ? "Hide details" : "More details";
        }
        return;
      }

      const cardToggle = event.target.closest(".mobile-card-toggle");
      if (cardToggle) {
        const card = cardToggle.closest(".mobile-collapsible-card");
        if (card) {
          const nextState = !card.classList.contains("mobile-card-expanded");
          card.classList.toggle("mobile-card-expanded", nextState);
          cardToggle.setAttribute("aria-expanded", String(nextState));
          cardToggle.textContent = nextState ? "Hide" : "Show";
        }
        return;
      }

      const moreToggle = event.target.closest("[data-mobile-more-toggle]");
      if (moreToggle) {
        toggleMobileMoreSheet();
        return;
      }

      if (event.target.closest("[data-mobile-more-close]") || event.target.closest(".mobile-more-backdrop") || event.target.closest(".mobile-more-link")) {
        toggleMobileMoreSheet(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeSidebar();
        toggleMobileMoreSheet(false);
      }
    });
  }

  function initLayout() {
    if (document.body.classList.contains("login-page")) {
      return;
    }

    setBodyContextClasses();
    renderSidebarNavigation();
    injectUserMenu();
    injectBreadcrumb();
    injectPageOutline();
    injectAuditMeta();
    bindAdaptiveInteractions();
    refreshAdaptiveLayout();
  }

  window.LMLLayout = {
    getCurrentFileName: getCurrentFileName,
    getCurrentUserProfile: getCurrentUserProfile,
    getPageKind: getPageKind,
    initLayout: initLayout,
    refreshPageOutline: refreshPageOutline,
    refreshAdaptiveLayout: refreshAdaptiveLayout,
    setSidebarOpen: setSidebarOpen,
    closeSidebar: closeSidebar,
    toggleSidebar: toggleSidebar
  };
})();
