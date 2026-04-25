(function () {
  const scope = {
    totalMachines: 248,
    ownMachines: 198,
    rentMachines: 50,
    totalVendors: 22,
    totalAgreements: 14,
    totalPmPlansThisMonth: 64,
    totalBreakdownTicketsThisMonth: 32,
    lowStockItems: 7
  };

  const metrics = {
    dashboard: {
      openBreakdowns: 12,
      urgentItems: 6,
      duePm: 18,
      overduePm: 6,
      repeatWatch: 3,
      vendorSlaRisk: 2,
      lowStock: 7,
      mttrHours: 2.6,
      mtbfDays: 19,
      technicianUtilization: 84,
      machineAvailability: 86,
      pmPressureItems: 24,
      spareImpactCases: 3,
      outputLossRiskHours: 16.8,
      lineImpactLines: 3,
      acceptancePending: 3,
      backupPending: 2
    },
    vendors: {
      active: 16,
      expiringSoon: 3,
      pendingApproval: 2
    },
    agreements: {
      active: 9,
      expiringSoon: 3,
      blocked: 2
    },
    rent: {
      active: 38,
      reviewPending: 5,
      expiringSoon: 2
    },
    breakdown: {
      open: 6,
      assigned: 9,
      inProgress: 7,
      closedToday: 10
    },
    pm: {
      dueToday: 18,
      overdue: 6,
      completed: 40,
      compliance: 63
    },
    reports: {
      availability: 86,
      closureRate: 78,
      lowStockRisk: 7,
      mttrHours: 2.6,
      repeatRiskMachines: 3,
      pmPressureItems: 24,
      vendorRiskCases: 2,
      downtimeHours: 61.4,
      outputLossRiskHours: 16.8,
      spareImpactCases: 3,
      lineImpactLines: 3
    }
  };

  const managementMetrics = {
    maintenance: {
      mttrHours: 2.6,
      mtbfDays: 19,
      repeatIssueMachines: 3,
      repeatIssueIntervalDays: 11,
      pmPressureItems: 24,
      overduePm: 6,
      vendorSlaWatch: 2,
      spareImpactCases: 3,
      technicianProductivity: 78,
      criticalEscalations: 4,
      rootCausePending: 4,
      deferApprovals: 2
    },
    production: {
      impactedLines: 3,
      downtimeHours: 61.4,
      outputLossRiskHours: 16.8,
      acceptancePending: 3,
      backupArrangementPending: 2,
      lineStoppageOpen: 2,
      highestRiskLine: "Line 03",
      highestRiskOperators: 22
    }
  };

  const reportMetrics = {
    overview: {
      machineAvailability: 86,
      mttrHours: 2.6,
      repeatIssueWatch: 3,
      pmPressureItems: 24,
      vendorRiskCases: 2,
      lowStockRisk: 7,
      spareImpactCases: 3,
      downtimeHours: 61.4,
      outputLossRiskHours: 16.8,
      lineImpactLines: 3
    },
    breakdown: {
      reportedTickets: 32,
      closureRate: 78,
      averageDowntimeHours: 1.9,
      repeatIssueMachines: 6,
      lineImpactLines: 3,
      rootCausePending: 4,
      partsDelayCases: 2,
      productionAcceptancePending: 3
    },
    pm: {
      scheduledPlans: 64,
      compliance: 63,
      dueAndOverdue: 24,
      rentPmRisk: 2,
      deferPending: 2,
      dailyCompliance: 82,
      weeklyCompliance: 50,
      monthlyCompliance: 25,
      breakdownLinkedDelays: 3
    },
    rent: {
      totalMachines: 50,
      activeMachines: 43,
      returnReplaceWatch: 5,
      agreementRisk: 2,
      vendorSlaRisk: 2,
      downtimeHours: 12.9,
      backupPending: 2,
      expiryRiskMachines: 4
    },
    downtime: {
      totalHours: 61.4,
      averagePerTicket: 1.9,
      highestLossLine: "Line 03",
      highestLossHours: 14.6,
      repeatMachines: 5,
      outputLossRiskHours: 16.8,
      vendorDelayCases: 2,
      partsDelayCases: 3
    }
  };

  const users = [
    { id: "admin.lml", name: "Mahmud Hasan", role: "Admin", department: "System Admin", approvalLevel: "Admin Control" },
    { id: "mhead01", name: "Jahidul Islam", role: "Maintenance Head", department: "Maintenance", approvalLevel: "Final Approver" },
    { id: "sup.line03", name: "Rahima Begum", role: "Supervisor", department: "Production", approvalLevel: "Line Approval" },
    { id: "sup.finish02", name: "Jui Sarker", role: "Supervisor", department: "Finishing", approvalLevel: "Production Acceptance" },
    { id: "prod.user01", name: "Salma Akter", role: "Production User", department: "Production", approvalLevel: "Complaint Entry" },
    { id: "tech.rana", name: "Sohel Rana", role: "Technician", department: "Maintenance", approvalLevel: "Execution" },
    { id: "tech.rafiq", name: "Rafiqul Islam", role: "Technician", department: "Maintenance", approvalLevel: "Execution" },
    { id: "tech.shamim", name: "Shamim Mia", role: "Technician", department: "Maintenance", approvalLevel: "Execution" },
    { id: "tech.hasan", name: "Hasan Ali", role: "Technician", department: "Maintenance", approvalLevel: "Execution" },
    { id: "store.user", name: "Nasima Akter", role: "Store User", department: "Store", approvalLevel: "Stock Update" },
    { id: "store.coord", name: "Shahadat Hossain", role: "Store User", department: "Store", approvalLevel: "Receive and Return Posting" },
    { id: "gm.prod", name: "Kamrul Hasan", role: "Production GM", department: "Production", approvalLevel: "Management Review" },
    { id: "gm.ops", name: "Sabbir Hossain", role: "Operation GM", department: "Production", approvalLevel: "Limited Management Approval" },
    { id: "ie.manager", name: "Nusrat Jahan", role: "IE Manager", department: "IE", approvalLevel: "Analytics Review" },
    { id: "ie.executive", name: "Farhana Sultana", role: "IE Executive", department: "IE", approvalLevel: "Analytics View" }
  ];

  const vendors = [
    {
      id: "VEN-001",
      name: "ABC Sewing Support",
      type: "Rent Machine Vendor",
      city: "Dhaka",
      contactPerson: "Md. Kamal Hossain",
      contactRole: "Service Coordinator",
      phone: "01711-456789",
      email: "abc.support@email.com",
      status: "Active",
      agreementStatus: "Active Agreement",
      machineCoverage: 14,
      responseHours: 6
    },
    {
      id: "VEN-004",
      name: "Prime Machine Service",
      type: "Rent Machine Vendor",
      city: "Gazipur",
      contactPerson: "Shafiqur Rahman",
      contactRole: "Manager - Rental Support",
      phone: "01819-225577",
      email: "prime.service@email.com",
      officePhone: "02-8899112",
      address: "House 18, Block C, Tongi Industrial Area, Gazipur, Bangladesh",
      status: "Active",
      agreementStatus: "Expiring Soon",
      machineCoverage: 18,
      responseHours: 12
    },
    {
      id: "VEN-006",
      name: "Metro Tech Engineering",
      type: "Rent Machine Vendor",
      city: "Narayanganj",
      contactPerson: "Habibur Rahman",
      contactRole: "Support Lead",
      phone: "01913-556677",
      email: "metro.tech@email.com",
      status: "Active",
      agreementStatus: "Active Agreement",
      machineCoverage: 9,
      responseHours: 8
    },
    {
      id: "VEN-008",
      name: "Golden Parts Center",
      type: "Spare Parts Vendor",
      city: "Dhaka",
      contactPerson: "Faruk Hossain",
      contactRole: "Parts Supply Manager",
      phone: "01718-336699",
      email: "golden.parts@email.com",
      status: "Pending Approval",
      agreementStatus: "Draft",
      machineCoverage: 0,
      responseHours: 24
    }
  ];

  const agreements = [
    {
      id: "AGR-2026-001",
      vendorId: "VEN-001",
      type: "Rent Machine",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      coverage: "14 Rent Machines",
      monthlyCost: 180000,
      status: "Active",
      renewalRisk: "Low"
    },
    {
      id: "AGR-2026-002",
      vendorId: "VEN-001",
      type: "Rent Machine",
      startDate: "2026-01-15",
      endDate: "2026-06-30",
      coverage: "6 Rent Machines",
      monthlyCost: 72000,
      status: "Expiring Soon",
      renewalRisk: "Medium"
    },
    {
      id: "AGR-2025-011",
      vendorId: "VEN-004",
      type: "Service support only",
      startDate: "2025-07-01",
      endDate: "2025-12-31",
      coverage: "Closed cycle support",
      monthlyCost: 78000,
      status: "Expired",
      renewalRisk: "Closed"
    },
    {
      id: "AGR-2026-003",
      vendorId: "VEN-004",
      type: "Rent Machine",
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      coverage: "Short-term bridging contract",
      monthlyCost: 58000,
      status: "Expired",
      renewalRisk: "Historical"
    },
    {
      id: "AGR-2026-004",
      vendorId: "VEN-004",
      type: "Rent Machine",
      startDate: "2026-02-01",
      endDate: "2026-05-15",
      coverage: "18 Rent Machines",
      monthlyCost: 245000,
      status: "Expiring Soon",
      renewalRisk: "High"
    },
    {
      id: "AGR-2026-006",
      vendorId: "VEN-006",
      type: "Rent Machine",
      startDate: "2026-02-10",
      endDate: "2026-12-31",
      coverage: "9 Rent Machines",
      monthlyCost: 118000,
      status: "Active",
      renewalRisk: "Low"
    },
    {
      id: "AGR-2026-008",
      vendorId: "VEN-008",
      type: "Spare Parts Supply",
      startDate: "2026-03-01",
      endDate: "2026-12-31",
      coverage: "Critical Overlock and Flatlock Parts",
      monthlyCost: 64000,
      status: "Draft",
      renewalRisk: "Approval Pending"
    }
  ];

  const lines = [
    { id: "LINE-01", floor: "Sewing Floor 02", line: "Line 01", totalMachines: 24, activeCount: 22, idleCount: 1, breakdownCount: 0, maintenanceCount: 1, operatorCount: 24 },
    { id: "LINE-03", floor: "Sewing Floor 02", line: "Line 03", totalMachines: 26, activeCount: 21, idleCount: 1, breakdownCount: 2, maintenanceCount: 2, operatorCount: 22 },
    { id: "LINE-05", floor: "Sewing Floor 02", line: "Line 05", totalMachines: 22, activeCount: 19, idleCount: 1, breakdownCount: 0, maintenanceCount: 2, operatorCount: 20 },
    { id: "LINE-07", floor: "Sewing Floor 03", line: "Line 07", totalMachines: 23, activeCount: 20, idleCount: 1, breakdownCount: 0, maintenanceCount: 2, operatorCount: 23 },
    { id: "LINE-10", floor: "Sewing Floor 03", line: "Line 10", totalMachines: 22, activeCount: 19, idleCount: 2, breakdownCount: 0, maintenanceCount: 1, operatorCount: 21 }
  ];

  const machines = [
    {
      id: "MC-1001",
      name: "Single Needle Machine",
      type: "Single Needle",
      brand: "Juki",
      model: "DDL-9000C",
      serialNo: "JK-24-1108-7781",
      ownership: "Own",
      floor: "Sewing Floor 02",
      line: "Line 01",
      status: "Active",
      criticality: "A",
      repeatWatch: false
    },
    {
      id: "MC-1014",
      name: "Overlock Machine",
      type: "Overlock",
      brand: "Juki",
      model: "MO-6714S",
      serialNo: "JK-OL-1014-4412",
      ownership: "Own",
      floor: "Sewing Floor 02",
      line: "Line 03",
      status: "Breakdown",
      criticality: "A",
      repeatWatch: true
    },
    {
      id: "MC-1035",
      name: "Single Needle Machine",
      type: "Single Needle",
      brand: "Brother",
      model: "S-7300A",
      serialNo: "BR-1035-8821",
      ownership: "Own",
      floor: "Sewing Floor 02",
      line: "Line 01",
      status: "Active",
      criticality: "B",
      repeatWatch: false
    },
    {
      id: "MC-1050",
      name: "Button Attach Machine",
      type: "Button Attach",
      brand: "Brother",
      model: "BE-438HX",
      serialNo: "BT-1050-3391",
      ownership: "Own",
      floor: "Sewing Floor 03",
      line: "Line 10",
      status: "Active",
      criticality: "B",
      repeatWatch: false
    },
    {
      id: "MC-1084",
      name: "Button Hole Machine",
      type: "Button Hole",
      brand: "Juki",
      model: "LBH-1790",
      serialNo: "BH-1084-1107",
      ownership: "Own",
      floor: "Sewing Floor 03",
      line: "Line 11",
      status: "Active",
      criticality: "B",
      repeatWatch: false
    },
    {
      id: "RM-2003",
      assetTag: "RT-03",
      receiveDate: "2026-01-05",
      name: "Flatlock Machine",
      type: "Flatlock",
      brand: "Pegasus",
      model: "W562",
      serialNo: "PG-RM-2003-5512",
      ownership: "Rent",
      vendorId: "VEN-001",
      agreementId: "AGR-2026-001",
      floor: "Sewing Floor 03",
      line: "Line 07",
      status: "Under Maintenance",
      criticality: "A",
      repeatWatch: false,
      returnReplaceStatus: "No Request"
    },
    {
      id: "RM-2006",
      assetTag: "RT-06",
      receiveDate: "2026-01-18",
      name: "Single Needle Machine",
      type: "Single Needle",
      brand: "Jack",
      model: "A4E",
      serialNo: "JK-RM-2006-7714",
      ownership: "Rent",
      vendorId: "VEN-001",
      agreementId: "AGR-2026-002",
      floor: "Store Hold",
      line: "Not Assigned",
      status: "Returned",
      criticality: "B",
      repeatWatch: false,
      returnReplaceStatus: "Pickup Pending"
    },
    {
      id: "RM-2008",
      assetTag: "RT-08",
      receiveDate: "2026-02-02",
      name: "Overlock Machine",
      type: "Overlock",
      brand: "Juki",
      model: "MO-6714S",
      serialNo: "JUK-RM-6714S-2208",
      ownership: "Rent",
      vendorId: "VEN-004",
      agreementId: "AGR-2026-004",
      floor: "Sewing Floor 02",
      line: "Line 03",
      status: "Under Maintenance",
      criticality: "A",
      repeatWatch: true,
      monthlyRent: 14500,
      returnReplaceStatus: "Replacement Review"
    },
    {
      id: "RM-2010",
      assetTag: "RT-10",
      receiveDate: "2026-02-10",
      name: "Single Needle Machine",
      type: "Single Needle",
      brand: "Jack",
      model: "A4E",
      serialNo: "JK-RM-2010-9912",
      ownership: "Rent",
      vendorId: "VEN-004",
      agreementId: "AGR-2026-004",
      floor: "Sewing Floor 02",
      line: "Line 05",
      status: "Active",
      criticality: "A",
      repeatWatch: true,
      monthlyRent: 13800,
      returnReplaceStatus: "Agreement Review"
    },
    {
      id: "RM-2011",
      assetTag: "RT-11",
      receiveDate: "2026-04-05",
      name: "Single Needle Machine",
      type: "Single Needle",
      brand: "Jack",
      model: "A4E",
      serialNo: "JK-RM-2011-4011",
      ownership: "Rent",
      vendorId: "VEN-006",
      agreementId: "AGR-2026-006",
      floor: "Sewing Floor 03",
      line: "Line 10",
      status: "Active",
      criticality: "B",
      repeatWatch: false,
      monthlyRent: 13200,
      returnReplaceStatus: "No Request"
    },
    {
      id: "RM-2014",
      assetTag: "RT-14",
      receiveDate: "2026-02-18",
      name: "Overlock Machine",
      type: "Overlock",
      brand: "Juki",
      model: "MO-6714S",
      serialNo: "JUK-RM-2014-6614",
      ownership: "Rent",
      vendorId: "VEN-004",
      agreementId: "AGR-2026-004",
      floor: "Sewing Floor 03",
      line: "Line 12",
      status: "Active",
      criticality: "B",
      repeatWatch: false,
      monthlyRent: 14600,
      returnReplaceStatus: "No Request"
    },
    {
      id: "RM-2018",
      assetTag: "RT-18",
      receiveDate: "2026-03-02",
      name: "Button Attach Machine",
      type: "Button Attach",
      brand: "Brother",
      model: "BE-438HX",
      serialNo: "BT-RM-2018-7718",
      ownership: "Rent",
      vendorId: "VEN-004",
      agreementId: "AGR-2026-004",
      floor: "Sewing Floor 03",
      line: "Line 15",
      status: "Active",
      criticality: "B",
      repeatWatch: false,
      monthlyRent: 14900,
      returnReplaceStatus: "No Request"
    },
    {
      id: "RM-2022",
      assetTag: "RT-22",
      receiveDate: "2026-04-10",
      name: "Flatlock Machine",
      type: "Flatlock",
      brand: "Pegasus",
      model: "W664",
      serialNo: "PG-RM-2022-6604",
      ownership: "Rent",
      vendorId: "VEN-006",
      agreementId: "AGR-2026-006",
      floor: "Sewing Floor 03",
      line: "Line 10",
      status: "Active",
      criticality: "B",
      repeatWatch: false,
      returnReplaceStatus: "No Request"
    }
  ];

  const tickets = [
    {
      id: "BD-2026-0004",
      machineId: "RM-2003",
      date: "2026-04-10",
      floor: "Sewing Floor 03",
      line: "Line 07",
      issue: "Needle bar setting problem",
      priority: "Medium",
      raisedBy: "Rahima Begum",
      raisedRole: "Supervisor",
      technician: "Sohel Rana",
      status: "Closed",
      downtimeHours: 1.4,
      impact: "Trial run hold",
      rootCause: "Needle bar position drift",
      correctiveAction: "Needle bar reset and trial run complete",
      preventiveAction: "Shift startup stability check",
      escalation: "None",
      acceptedByProduction: true
    },
    {
      id: "BD-2026-0001",
      machineId: "MC-1014",
      date: "2026-04-05",
      floor: "Sewing Floor 02",
      line: "Line 03",
      issue: "Looper issue, thread break",
      priority: "High",
      raisedBy: "Salma Akter",
      raisedRole: "Production User",
      technician: "Rafiqul Islam",
      status: "Closed",
      downtimeHours: 1.9,
      impact: "Line stoppage",
      rootCause: "Looper timing drift",
      correctiveAction: "Timing reset and sample run complete",
      preventiveAction: "Weekly repeat issue review",
      escalation: "None",
      acceptedByProduction: true
    },
    {
      id: "BD-2026-0121",
      machineId: "MC-1014",
      date: "2026-04-23",
      floor: "Sewing Floor 02",
      line: "Line 03",
      issue: "Looper issue, thread break",
      priority: "High",
      raisedBy: "Salma Akter",
      raisedRole: "Production User",
      technician: "",
      status: "Open",
      downtimeHours: 0.8,
      impact: "Line stoppage",
      rootCause: "Thread path instability",
      correctiveAction: "Pending technician assignment",
      preventiveAction: "Escalate repeat issue review",
      escalation: "Maintenance Head Review",
      acceptedByProduction: false
    },
    {
      id: "BD-2026-0119",
      machineId: "RM-2008",
      date: "2026-04-22",
      floor: "Sewing Floor 02",
      line: "Line 03",
      issue: "Repeat thread break and looper timing drift",
      priority: "High",
      raisedBy: "Rahima Begum",
      raisedRole: "Supervisor",
      technician: "Sohel Rana",
      status: "In Progress",
      downtimeHours: 1.6,
      impact: "Output loss risk",
      rootCause: "Looper timing drift",
      correctiveAction: "Timing reset and spring check",
      preventiveAction: "Weekly alignment verification",
      escalation: "Vendor Pending",
      acceptedByProduction: false
    },
    {
      id: "BD-2026-0118",
      machineId: "RM-2003",
      date: "2026-04-21",
      floor: "Sewing Floor 03",
      line: "Line 07",
      issue: "Needle bar setting problem",
      priority: "Medium",
      raisedBy: "Rahima Begum",
      raisedRole: "Supervisor",
      technician: "Sohel Rana",
      status: "Assigned",
      downtimeHours: 0.9,
      impact: "Trial run hold",
      rootCause: "Needle bar position drift",
      correctiveAction: "Adjustment in progress",
      preventiveAction: "Shift startup check",
      escalation: "None",
      acceptedByProduction: false
    },
    {
      id: "BD-2026-0107",
      machineId: "MC-1035",
      date: "2026-04-20",
      floor: "Sewing Floor 02",
      line: "Line 01",
      issue: "Fabric feeding uneven",
      priority: "Medium",
      raisedBy: "Shila Akter",
      raisedRole: "Production User",
      technician: "Rafiqul Islam",
      status: "Closed",
      downtimeHours: 1.1,
      impact: "Minor quality risk",
      rootCause: "Feed dog wear",
      correctiveAction: "Feed dog alignment complete",
      preventiveAction: "Weekly wear check",
      escalation: "None",
      acceptedByProduction: true
    },
    {
      id: "BD-2026-0096",
      machineId: "RM-2010",
      date: "2026-04-18",
      floor: "Sewing Floor 02",
      line: "Line 05",
      issue: "Motor noise and overheating",
      priority: "High",
      raisedBy: "Nasima Akter",
      raisedRole: "Store User",
      technician: "Hasan Ali",
      status: "Completed",
      downtimeHours: 2.2,
      impact: "Reduced line speed",
      rootCause: "Motor belt wear",
      correctiveAction: "Temporary cool-down and observation",
      preventiveAction: "Replace belt before next peak load",
      escalation: "Spare Pending",
      acceptedByProduction: false
    },
    {
      id: "BD-2026-0088",
      machineId: "MC-1050",
      date: "2026-04-17",
      floor: "Sewing Floor 03",
      line: "Line 10",
      issue: "Pressure test alarm",
      priority: "Low",
      raisedBy: "Rokeya Begum",
      raisedRole: "Supervisor",
      technician: "Shamim Mia",
      status: "Assigned",
      downtimeHours: 0.5,
      impact: "No stoppage",
      rootCause: "Sensor setting gap",
      correctiveAction: "Inspection pending",
      preventiveAction: "Sensor calibration in PM",
      escalation: "None",
      acceptedByProduction: false
    }
  ];

  const pmPlans = [
    {
      id: "PM-2026-041",
      machineId: "MC-1001",
      frequency: "Daily",
      lastPm: "2026-04-22",
      nextDue: "2026-04-23",
      technician: "Rafiqul Islam",
      status: "Due",
      exceptionReason: "",
      vendorAware: false
    },
    {
      id: "PM-2026-042",
      machineId: "MC-1014",
      frequency: "Weekly",
      lastPm: "2026-04-15",
      nextDue: "2026-04-21",
      technician: "Sohel Rana",
      status: "Overdue",
      exceptionReason: "Breakdown recovery took priority before PM closure.",
      vendorAware: false
    },
    {
      id: "PM-2026-043",
      machineId: "RM-2010",
      frequency: "Monthly",
      lastPm: "2026-03-18",
      nextDue: "2026-04-18",
      technician: "Hasan Ali",
      status: "Overdue",
      exceptionReason: "Motor belt set not available. Vendor and store follow-up required.",
      vendorAware: true
    },
    {
      id: "PM-2026-044",
      machineId: "MC-1050",
      frequency: "Weekly",
      lastPm: "2026-04-16",
      nextDue: "2026-04-23",
      technician: "Shamim Mia",
      status: "Due",
      exceptionReason: "",
      vendorAware: false
    },
    {
      id: "PM-2026-045",
      machineId: "RM-2008",
      frequency: "Monthly",
      lastPm: "2026-03-16",
      nextDue: "2026-04-16",
      technician: "Rafiqul Islam",
      status: "Planned",
      exceptionReason: "PM defer pending maintenance head review because machine is already under corrective work.",
      vendorAware: true
    },
    {
      id: "PM-2026-046",
      machineId: "RM-2022",
      frequency: "Monthly",
      lastPm: "2026-04-20",
      nextDue: "2026-05-20",
      technician: "Hasan Ali",
      status: "Completed",
      exceptionReason: "",
      vendorAware: true
    }
  ];

  const spareParts = [
    {
      id: "SP-LOOPER-01",
      code: "SP-LOOPER-01",
      name: "Looper Set",
      stockQty: 2,
      reorderLevel: 5,
      status: "Critical",
      machineType: "Overlock",
      linkedMachines: ["MC-1014", "RM-2008"],
      vendorId: "VEN-008"
    },
    {
      id: "SP-BELT-01",
      code: "SP-BELT-01",
      name: "Motor Belt Set",
      stockQty: 1,
      reorderLevel: 4,
      status: "Low",
      machineType: "Single Needle",
      linkedMachines: ["RM-2010"],
      vendorId: "VEN-008"
    },
    {
      id: "SP-NEEDLE-01",
      code: "SP-NEEDLE-01",
      name: "DBx1 Needle Pack",
      stockQty: 28,
      reorderLevel: 20,
      status: "Healthy",
      machineType: "General",
      linkedMachines: ["MC-1001", "MC-1035", "RM-2010"],
      vendorId: "VEN-008"
    },
    {
      id: "SP-SENSOR-01",
      code: "SP-SENSOR-01",
      name: "Button Attach Sensor",
      stockQty: 3,
      reorderLevel: 6,
      status: "Low",
      machineType: "Button Attach",
      linkedMachines: ["MC-1050"],
      vendorId: "VEN-008"
    }
  ];

  const reportViews = {
    overview: {
      snapshot: [
        {
          area: "Machine Availability",
          status: "Stable",
          figure: "86% Available",
          note: "214 production-ready machines from the central control scope",
          gap: "3 repeat-risk assets still affect output stability",
          action: "machines.html",
          actionLabel: "Machine Review"
        },
        {
          area: "Breakdown Control",
          status: "Needs Follow-up",
          figure: "MTTR 2.6 Hrs",
          note: "32 tickets reviewed with stronger closure discipline this month",
          gap: "Line 03 and Line 05 still carry the highest output-loss pressure",
          action: "report-breakdown.html",
          actionLabel: "Breakdown Report"
        },
        {
          area: "PM Pressure",
          status: "Overdue Risk",
          figure: "24 Due / Overdue",
          note: "Monthly PM backlog is the main compliance weakness",
          gap: "2 defer approvals and 2 rent-machine PM risks need management review",
          action: "report-pm.html",
          actionLabel: "PM Review"
        },
        {
          area: "Rent Machine Dependency",
          status: "Decision Pending",
          figure: "2 Vendor SLA Risks",
          note: "AGR-2026-004 remains the main contract and standby-planning pressure point",
          gap: "RM-2008 and RM-2010 still need continuity and response-time decisions",
          action: "report-rent-machine.html",
          actionLabel: "Rent Review"
        },
        {
          area: "Spare and Downtime Impact",
          status: "Shortage Watch",
          figure: "61.4 Hrs Downtime",
          note: "3 low-stock items already influence breakdown and PM closure timing",
          gap: "Belt and looper shortage continue to stretch repair lead time",
          action: "report-downtime.html",
          actionLabel: "Downtime Report"
        }
      ],
      highlights: [
        {
          color: "danger",
          title: "RM-2008 still holds both vendor SLA and backup-arrangement risk",
          note: "Maintenance head and operations management should review replacement readiness together before the next heavy overlock batch.",
          time: "Today"
        },
        {
          color: "warning",
          title: "MC-1014 remains the top repeat-issue machine",
          note: "Root cause closure, PM discipline, and operator restart confidence should be treated as one control loop.",
          time: "Today"
        },
        {
          color: "primary",
          title: "PM pressure is now linked with spare availability",
          note: "RM-2010 monthly PM defer and SP-BELT-01 shortage are shaping both MTTR and compliance score.",
          time: "Today"
        }
      ],
      exportOptions: [
        {
          label: "GM Control Summary",
          note: "High-level decision pack with MTTR, PM pressure, and output loss risk",
          value: "PDF",
          badgeClass: "primary"
        },
        {
          label: "Maintenance Exception Review",
          note: "Repeat issue, defer approval, and vendor SLA-focused review sheet",
          value: "Excel",
          badgeClass: "warning"
        },
        {
          label: "Production Impact Review",
          note: "Line-wise downtime and backup-arrangement discussion pack",
          value: "PDF",
          badgeClass: "danger"
        },
        {
          label: "Store and Vendor Dependency Pack",
          note: "Low stock exposure with vendor and agreement watch references",
          value: "Excel",
          badgeClass: "dark"
        }
      ]
    },
    breakdown: {
      snapshot: [
        {
          area: "Complaint Volume and Ownership",
          figure: "32 Tickets",
          observation: "Open and assigned pressure is now concentrated on fewer, higher-impact lines.",
          gap: "4 critical or repeat-risk cases still need stronger escalation closure.",
          action: "ticket-assign.html",
          actionLabel: "Assignment Review"
        },
        {
          area: "Closure and Acceptance",
          figure: "78% Closure Rate",
          observation: "Technician completion is improving, but production acceptance still delays final closeout.",
          gap: "3 tickets remain in acceptance or management review state.",
          action: "ticket-close.html",
          actionLabel: "Closure Review"
        },
        {
          area: "Downtime Impact",
          figure: "1.9 Hrs Avg",
          observation: "Downtime increases quickly when repeat issue, spare shortage, or vendor wait overlap in the same ticket.",
          gap: "Line 03 and Line 07 are driving most output-loss exposure.",
          action: "report-downtime.html",
          actionLabel: "Downtime Impact"
        },
        {
          area: "Root Cause Discipline",
          figure: "6 Repeat Machines",
          observation: "Repeat issue machines now point directly to PM follow-up, vendor support, or corrective standard weakness.",
          gap: "4 tickets still need stronger corrective and preventive action closure.",
          action: "pm-schedule.html",
          actionLabel: "PM Follow-Up"
        }
      ],
      lineWise: [
        { line: "Sewing Floor 02 / Line 03", reported: 9, closed: 6, avgDowntime: "2.3 Hrs", machineType: "Overlock", status: "High Risk" },
        { line: "Sewing Floor 03 / Line 07", reported: 8, closed: 6, avgDowntime: "2.1 Hrs", machineType: "Flatlock", status: "Needs Follow-up" },
        { line: "Sewing Floor 02 / Line 05", reported: 6, closed: 4, avgDowntime: "1.8 Hrs", machineType: "Single Needle", status: "Watch" },
        { line: "Sewing Floor 02 / Line 01", reported: 5, closed: 5, avgDowntime: "1.2 Hrs", machineType: "Single Needle", status: "Controlled" }
      ],
      repeatMachines: [
        { machineId: "MC-1014", note: "Overlock, Line 03", ownership: "Own", count: "3 tickets in 21 days", issue: "Looper timing and thread break", action: "Root-cause review and weekly PM attention", status: "Repeat Risk" },
        { machineId: "RM-2008", note: "Overlock, Line 03", ownership: "Rent", count: "2 tickets in 14 days", issue: "Thread break after heavy use and vendor delay", action: "Vendor coordination and backup plan review", status: "Vendor Watch" },
        { machineId: "RM-2010", note: "Single Needle, Line 05", ownership: "Rent", count: "2 tickets in 18 days", issue: "Motor belt wear and service dependency", action: "Spare support and PM recovery action", status: "Parts Risk" }
      ],
      rootCauseWatch: [
        { label: "Thread Break / Tension", note: "9 tickets across overlock and flatlock lines", value: "R1", badgeClass: "danger" },
        { label: "Looper / Timing Issue", note: "7 tickets with repeat service demand", value: "R2", badgeClass: "warning" },
        { label: "Motor / Belt Problem", note: "5 tickets tied to part wear or stock delay", value: "R3", badgeClass: "info" }
      ],
      technicianClosure: [
        { label: "Rafiqul Islam", note: "8 tickets closed, best repeat-issue recovery discipline", value: "Strong", badgeClass: "success" },
        { label: "Sohel Rana", note: "7 tickets closed, but 2 rent-machine cases still keep vendor-linked risk open", value: "Loaded", badgeClass: "warning" },
        { label: "Shamim Mia", note: "6 tickets closed, strongest closure quality on PM-linked machines", value: "Balanced", badgeClass: "primary" }
      ],
      notes: [
        { title: "22 Apr 2026, 11:15 AM", note: "Line 03 created the highest complaint pressure and should be reviewed with machine history, PM delay, and operator backup together." },
        { title: "22 Apr 2026, 09:40 AM", note: "RM-2008 and RM-2010 remain the top rent-machine contributors to vendor-linked closure delay." },
        { title: "21 Apr 2026, 05:20 PM", note: "Thread cutter knife and motor belt shortage were confirmed as direct reasons for longer recovery in two high-risk tickets." }
      ]
    },
    pm: {
      snapshot: [
        {
          area: "Completion Output",
          figure: "40 Completed",
          observation: "Daily PM closes relatively well, but weekly and monthly items slip when breakdown load spikes.",
          gap: "24 items are still due or overdue and 2 defer approvals remain open.",
          action: "pm-due.html",
          actionLabel: "Due Board"
        },
        {
          area: "Due and Overdue Pressure",
          figure: "24 Items",
          observation: "PM backlog is now visible as both compliance loss and repeat-issue risk on critical lines.",
          gap: "6 overdue items need recovery planning before the next monthly cycle starts.",
          action: "technician-tasks.html",
          actionLabel: "Technician Follow-Up"
        },
        {
          area: "Frequency Control",
          figure: "Monthly 25%",
          observation: "Monthly PM remains the weakest control point because long-gap tasks are easiest to defer.",
          gap: "Breakdown overlap and spare shortage are both delaying proper completion.",
          action: "pm-complete.html",
          actionLabel: "Completion Review"
        },
        {
          area: "Rent Machine PM",
          figure: "2 Risk Machines",
          observation: "RM-2008 and RM-2010 need vendor-aware planning, not only internal technician focus.",
          gap: "Contract timing, defer approval, and standby planning can all be affected if PM stays pending.",
          action: "rent-machines.html",
          actionLabel: "Rent Review"
        }
      ],
      frequencyPerformance: [
        { frequency: "Daily PM", scheduled: 34, completed: 28, dueOverdue: 6, compliance: "82%", status: "Controlled" },
        { frequency: "Weekly PM", scheduled: 18, completed: 9, dueOverdue: 9, compliance: "50%", status: "Needs Follow-up" },
        { frequency: "Monthly PM", scheduled: 12, completed: 3, dueOverdue: 9, compliance: "25%", status: "Overdue Risk" }
      ],
      areaPressure: [
        { line: "Sewing Floor 02 / Line 03", scheduled: 15, completed: 8, dueOverdue: 7, machineType: "Overlock", status: "High Pressure" },
        { line: "Sewing Floor 03 / Line 07", scheduled: 13, completed: 7, dueOverdue: 6, machineType: "Flatlock", status: "Watch" },
        { line: "Sewing Floor 02 / Line 05", scheduled: 10, completed: 5, dueOverdue: 5, machineType: "Single Needle", status: "Risk" },
        { line: "Sewing Floor 02 / Line 01", scheduled: 12, completed: 10, dueOverdue: 2, machineType: "Single Needle", status: "Stable" }
      ],
      technicianClosure: [
        { label: "Rafiqul Islam", note: "11 PM items closed, strongest daily clearance and checklist discipline", value: "Strong", badgeClass: "success" },
        { label: "Hasan Ali", note: "9 PM items closed, but rent-machine monthly PM still needs tighter vendor coordination", value: "Balanced", badgeClass: "primary" },
        { label: "Sohel Rana", note: "7 PM items closed, yet breakdown queue is still pulling time away from weekly PM closure", value: "Loaded", badgeClass: "warning" }
      ],
      riskWatch: [
        { label: "Monthly PM Backlog", note: "9 monthly plans remain due or overdue and need decision-level follow-up", value: "R1", badgeClass: "danger" },
        { label: "Rent Machine PM", note: "RM-2008 and RM-2010 still need vendor-aware PM recovery planning", value: "R2", badgeClass: "warning" },
        { label: "Breakdown Interruption", note: "3 PM items slipped because technicians were redirected to complaint recovery", value: "R3", badgeClass: "info" }
      ],
      notes: [
        { title: "22 Apr 2026, 11:30 AM", note: "Monthly PM remains the weakest cycle and now needs separate management review from daily and weekly planning." },
        { title: "22 Apr 2026, 09:10 AM", note: "Line 03, Line 07, and Line 05 contribute most of the current PM pressure and need technician rebalancing." },
        { title: "21 Apr 2026, 04:50 PM", note: "Two rent-machine PM items stayed overdue because breakdown support, spare shortage, and vendor follow-up overlapped in the same shift." }
      ]
    },
    rent: {
      snapshot: [
        {
          area: "Active Utilization",
          figure: "43 Active",
          observation: "Rent machines are now a live production-support layer, not just a backup pool.",
          gap: "Higher dependency means vendor delay or return decision can hit output quickly.",
          action: "allocation.html",
          actionLabel: "Allocation Review"
        },
        {
          area: "Agreement Exposure",
          figure: "2 Risk Agreements",
          observation: "AGR-2026-004 remains the main renewal and continuity pressure point.",
          gap: "Late agreement decision may block replacement and standby planning.",
          action: "agreements.html",
          actionLabel: "Agreement Review"
        },
        {
          area: "Vendor Response",
          figure: "2 SLA Watch",
          observation: "Prime Machine Service currently carries the highest response-time pressure on repeat-risk assets.",
          gap: "Vendor timing is stretching both breakdown closure and replacement decision windows.",
          action: "vendors.html",
          actionLabel: "Vendor Review"
        },
        {
          area: "Return / Replace Readiness",
          figure: "5 Cases",
          observation: "Repeated issue, agreement timing, and line dependency are now driving decisions more than standard billing cycle alone.",
          gap: "Backup arrangement must be confirmed early for high-output lines.",
          action: "return-replace.html",
          actionLabel: "Flow Review"
        }
      ],
      vendorPerformance: [
        { vendor: "Prime Machine Service", machineCount: 18, activeUse: "15 Active", watch: "RM-2008, RM-2010", avgDowntime: "2.3 Hrs", status: "Needs Follow-up" },
        { vendor: "ABC Sewing Support", machineCount: 14, activeUse: "12 Active", watch: "1 return review", avgDowntime: "1.6 Hrs", status: "Controlled" },
        { vendor: "Metro Tech Engineering", machineCount: 9, activeUse: "8 Active", watch: "1 agreement renewal", avgDowntime: "1.9 Hrs", status: "Stable" }
      ],
      riskList: [
        { machineId: "RM-2008", note: "Overlock, Line 03", vendor: "Prime Machine Service", agreement: "AGR-2026-004", risk: "Repeat breakdown and delayed vendor support", position: "Under maintenance with replacement watch", action: "Vendor review and standby machine planning", status: "Critical Watch" },
        { machineId: "RM-2010", note: "Single Needle, Line 05", vendor: "Prime Machine Service", agreement: "AGR-2026-004", risk: "Spare-linked PM delay and service dependence", position: "Active with PM defer pressure", action: "Fix parts support and PM recovery", status: "Monitor" },
        { machineId: "RM-2006", note: "Single Needle, Store Hold", vendor: "ABC Sewing Support", agreement: "AGR-2026-002", risk: "Return flow still open after repeated service interruption", position: "Waiting final pickup and billing closeout", action: "Close return and confirm next billing risk", status: "Return Review" }
      ],
      agreementRisk: [
        { label: "AGR-2026-004", note: "RM-2008 and RM-2010 remain the main continuity and service-risk machines under this contract.", value: "Renewal Watch", badgeClass: "warning" },
        { label: "AGR-2026-002", note: "Return closeout should happen before the next billing cycle continues on RM-2006.", value: "Closeout", badgeClass: "info" },
        { label: "AGR-2026-006", note: "Metro Tech agreement remains active with lower operational pressure.", value: "Stable", badgeClass: "success" }
      ],
      notes: [
        { title: "22 Apr 2026, 11:25 AM", note: "Line 03 and Line 05 continue to depend most on rent-machine support and should be reviewed with breakdown, PM, and standby capacity together." },
        { title: "22 Apr 2026, 09:35 AM", note: "RM-2008 remains the top repeat-risk machine and now needs both vendor SLA and replacement readiness review." },
        { title: "21 Apr 2026, 05:10 PM", note: "One return review and one PM defer remain open because vendor timing and internal approval did not close in the same window." }
      ]
    },
    downtime: {
      snapshot: [
        {
          area: "Total Downtime Volume",
          figure: "61.4 Hrs",
          observation: "The issue is no longer only ticket count; it is concentration on high-output lines and repeat assets.",
          gap: "3 lines still carry the bulk of productive-hour loss.",
          action: "report-breakdown.html",
          actionLabel: "Breakdown Link"
        },
        {
          area: "Recovery Speed",
          figure: "MTTR 1.9 Hrs",
          observation: "Recovery is stable on one-time faults but slows when repeat issue, vendor wait, or spare shortage overlap.",
          gap: "2 vendor-delay and 3 parts-delay cases stretched release time.",
          action: "technician-tasks.html",
          actionLabel: "Recovery Review"
        },
        {
          area: "Line Exposure",
          figure: "Line 03 / 14.6 Hrs",
          observation: "Overlock-heavy lines remain the highest output-loss risk area.",
          gap: "Backup arrangement and faster escalation are still needed there.",
          action: "machines.html",
          actionLabel: "Line Machine Review"
        },
        {
          area: "Repeat Interruption",
          figure: "5 Machines",
          observation: "Repeated downtime is now more important than one-time failure when deciding PM and replacement priority.",
          gap: "MC-1014, RM-2008, and RM-2010 still lead repeated loss.",
          action: "pm-schedule.html",
          actionLabel: "PM Link Review"
        }
      ],
      lineWise: [
        { line: "Sewing Floor 02 / Line 03", totalTickets: 9, totalDowntime: "14.6 Hrs", avgPerTicket: "1.6 Hrs", machineType: "Overlock", status: "High Loss" },
        { line: "Sewing Floor 03 / Line 07", totalTickets: 8, totalDowntime: "12.2 Hrs", avgPerTicket: "1.5 Hrs", machineType: "Flatlock", status: "Watch" },
        { line: "Sewing Floor 02 / Line 05", totalTickets: 6, totalDowntime: "9.4 Hrs", avgPerTicket: "1.6 Hrs", machineType: "Single Needle", status: "Risk" },
        { line: "Sewing Floor 02 / Line 01", totalTickets: 5, totalDowntime: "7.4 Hrs", avgPerTicket: "1.5 Hrs", machineType: "Single Needle", status: "Controlled" }
      ],
      topMachines: [
        { machineId: "RM-2008", note: "Overlock, Line 03", ownership: "Rent", downtime: "6.8 Hrs", issue: "Repeat thread break with vendor-linked response delay", action: "Vendor review and standby support plan", status: "Critical Watch" },
        { machineId: "MC-1014", note: "Overlock, Line 03", ownership: "Own", downtime: "5.9 Hrs", issue: "Looper timing drift and repeat thread break", action: "Root-cause correction and PM tightening", status: "Repeat Risk" },
        { machineId: "RM-2010", note: "Single Needle, Line 05", ownership: "Rent", downtime: "4.7 Hrs", issue: "Motor belt wear and PM defer pressure", action: "Parts support and vendor-aware PM recovery", status: "Parts Risk" }
      ],
      causeWatch: [
        { label: "Thread Break / Tension", note: "Largest share of downtime on overlock and flatlock lines", value: "C1", badgeClass: "danger" },
        { label: "Looper / Timing Issue", note: "Repeat interruption when PM and corrective closure are incomplete", value: "C2", badgeClass: "warning" },
        { label: "Parts / Vendor Delay", note: "Main reason downtime stays longer on rent-machine and PM-linked cases", value: "C3", badgeClass: "info" }
      ],
      recoveryBoard: [
        { label: "Rafiqul Islam", note: "Best average recovery speed on own-machine tickets", value: "1.4 Hrs", badgeClass: "success" },
        { label: "Sohel Rana", note: "Strong closure count but slower when rent-machine and vendor-linked tickets cluster together", value: "2.1 Hrs", badgeClass: "warning" },
        { label: "Hasan Ali", note: "More stable release performance on PM-linked single-needle recovery", value: "1.3 Hrs", badgeClass: "primary" }
      ],
      notes: [
        { title: "22 Apr 2026, 11:45 AM", note: "Line 03 continues to create the highest downtime and should be reviewed together with repeat-machine pressure and PM backlog." },
        { title: "22 Apr 2026, 09:25 AM", note: "RM-2008 remains the top rent-machine downtime contributor because vendor-linked recovery is slower than own-machine closure." },
        { title: "21 Apr 2026, 05:00 PM", note: "Parts shortage and timing drift were identified as the main causes behind extended closure in three higher-impact tickets." }
      ]
    }
  };

  const roleProfiles = {
    "Production User": {
      emphasis: "Complaint raise, line stoppage visibility, and closure tracking",
      actions: ["Raise complaint", "Add line impact note", "Track assigned ticket"],
      restricted: ["Assign technician", "Approve defer", "Close ticket"]
    },
    Supervisor: {
      emphasis: "Assignment control, production acceptance, and shift handover risk",
      actions: ["Assign technician", "Confirm production acceptance", "Escalate repeat issue"],
      restricted: ["Approve stock adjustment", "Finalize user access"]
    },
    Technician: {
      emphasis: "Execution note discipline, root cause entry, and support request clarity",
      actions: ["Post work update", "Record corrective action", "Request spare or vendor support"],
      restricted: ["Approve return or replace", "Approve PM defer"]
    },
    "Maintenance Head": {
      emphasis: "Exception approval, escalation control, and maintenance performance visibility",
      actions: ["Approve PM defer", "Approve return or replace", "Review critical escalation"],
      restricted: ["Post routine store movement", "Raise basic complaint on behalf of user"]
    },
    "Store User": {
      emphasis: "Stock posting, shortage escalation, and spare dependency follow-up",
      actions: ["Post receive and issue", "Escalate low stock", "Confirm spare availability"],
      restricted: ["Close breakdown", "Approve return or replace"]
    },
    Admin: {
      emphasis: "Cross-module audit readiness and authority routing visibility",
      actions: ["Review approval chain", "Monitor workflow metadata", "Support master control"],
      restricted: ["Daily technician execution"]
    },
    "Production GM": {
      emphasis: "Line impact, output loss risk, and critical asset decision review",
      actions: ["Review critical production impact", "Validate backup arrangement", "Observe management risk"],
      restricted: ["Post technician update", "Handle store posting"]
    },
    "Operation GM": {
      emphasis: "Machine availability, downtime impact, PM review, and operational risk visibility",
      actions: ["Review machine availability", "Review management reports", "Approve limited operational escalation"],
      restricted: ["Edit machine master", "Post technician update", "Close breakdown or store stock movement"]
    },
    "IE Manager": {
      emphasis: "Line efficiency, downtime trend, machine availability, and analytics-focused management review",
      actions: ["Review dashboard trends", "Analyze line impact and downtime", "Export management reports"],
      restricted: ["Create or assign breakdown", "Execute PM or technician updates", "Edit master or admin records"]
    },
    "IE Executive": {
      emphasis: "Line impact, downtime trend, PM summary, and read-only analytical review",
      actions: ["Review dashboard analytics", "Review breakdown and PM summary", "Analyze downtime and machine status"],
      restricted: ["Export reports", "Control workflow actions", "Edit master, store, or user records"]
    }
  };

  const roleUiPolicies = {
    "Operation GM": {
      sidebarHiddenGroups: ["Setup", "Users & Access"],
      sidebarHiddenItems: ["Technician Tasks"],
      moreSheetHiddenLinks: ["user-list.html"],
      redirectPages: {
        "factory-list.html": "dashboard.html",
        "floor-list.html": "dashboard.html",
        "line-list.html": "dashboard.html",
        "section-list.html": "dashboard.html",
        "machine-category.html": "machines.html",
        "machine-registration.html": "machines.html",
        "machine-edit.html": "machines.html",
        "rent-machine-form.html": "rent-machines.html",
        "vendor-form.html": "vendors.html",
        "agreement-form.html": "agreements.html",
        "breakdown-form.html": "breakdown-list.html",
        "spare-part-form.html": "spare-parts.html",
        "user-list.html": "dashboard.html",
        "user-form.html": "dashboard.html",
        "roles-permissions.html": "dashboard.html"
      },
      readOnlyForms: ["allocationForm", "returnReplaceForm"],
      restrictedActionTextTokens: [
        "add ",
        "create ",
        "new complaint",
        "save",
        "submit",
        "edit",
        "raise",
        "assign",
        "update",
        "post",
        "complete",
        "approve",
        "receive",
        "allocate",
        "transfer",
        "renew",
        "close",
        "issue",
        "need",
        "reschedule",
        "start replacement"
      ],
      restrictedActionHrefTokens: [
        "factory-list.html",
        "floor-list.html",
        "line-list.html",
        "section-list.html",
        "machine-category.html",
        "machine-registration.html",
        "machine-edit.html",
        "rent-machine-form.html",
        "vendor-form.html",
        "agreement-form.html",
        "breakdown-form.html",
        "ticket-close.html",
        "technician-tasks.html",
        "technician-task-update.html",
        "spare-part-form.html",
        "user-form.html",
        "user-list.html",
        "roles-permissions.html"
      ],
      readOnlyNoticePages: {
        "allocation.html": "Operation GM can review this page, but edit and posting controls are hidden.",
        "return-replace.html": "Operation GM can review this page, but edit and posting controls are hidden."
      }
    },
    "IE Manager": {
      sidebarHiddenGroups: ["Setup", "Users & Access"],
      sidebarHiddenItems: ["Technician Tasks"],
      moreSheetHiddenLinks: ["user-list.html"],
      redirectPages: {
        "factory-list.html": "dashboard.html",
        "floor-list.html": "dashboard.html",
        "line-list.html": "dashboard.html",
        "section-list.html": "dashboard.html",
        "machine-category.html": "machines.html",
        "machine-registration.html": "machines.html",
        "machine-edit.html": "machines.html",
        "rent-machine-form.html": "rent-machines.html",
        "vendor-form.html": "vendors.html",
        "agreement-form.html": "agreements.html",
        "breakdown-form.html": "breakdown-list.html",
        "ticket-assign.html": "breakdown-list.html",
        "ticket-close.html": "breakdown-list.html",
        "technician-task-update.html": "breakdown-list.html",
        "technician-tasks.html": "breakdown-list.html",
        "pm-checklist.html": "pm-schedule.html",
        "pm-complete.html": "pm-due.html",
        "spare-part-form.html": "spare-parts.html",
        "user-list.html": "dashboard.html",
        "user-form.html": "dashboard.html",
        "roles-permissions.html": "dashboard.html"
      },
      readOnlyForms: ["allocationForm", "returnReplaceForm"],
      headerActions: {
        "dashboard.html": [
          { label: "Export IE Review Pack" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "machine-details.html": [
          { label: "Machine List", href: "machines.html" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "rent-machine-details.html": [
          { label: "Rent Machine List", href: "rent-machines.html" },
          { label: "Open Reports", href: "report-rent-machine.html" }
        ],
        "vendor-details.html": [
          { label: "Vendor List", href: "vendors.html" },
          { label: "Open Reports", href: "reports.html" }
        ],
        "agreement-details.html": [
          { label: "Agreement List", href: "agreements.html" },
          { label: "Open Reports", href: "reports.html" }
        ],
        "machine-history.html": [
          { label: "Machine List", href: "machines.html" },
          { label: "Export History" }
        ],
        "rent-machine-history.html": [
          { label: "Rent Machine List", href: "rent-machines.html" },
          { label: "Export History" },
          { label: "Open Reports", href: "report-rent-machine.html" }
        ],
        "machines.html": [
          { label: "Export List" },
          { label: "Review Dashboard", href: "dashboard.html" }
        ],
        "rent-machines.html": [
          { label: "Export Rent List" },
          { label: "Open Reports", href: "report-rent-machine.html" }
        ],
        "vendors.html": [
          { label: "Export Vendor List" },
          { label: "Open Reports", href: "reports.html" }
        ],
        "agreements.html": [
          { label: "Export Agreement List" },
          { label: "Open Reports", href: "reports.html" }
        ],
        "breakdown-list.html": [
          { label: "Export Ticket List" },
          { label: "View Breakdown Board", href: "report-breakdown.html" }
        ],
        "ticket-details.html": [
          { label: "Ticket List", href: "breakdown-list.html" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "breakdown-history.html": [
          { label: "Breakdown Board", href: "breakdown-list.html" },
          { label: "Export History" }
        ],
        "pm-schedule.html": [
          { label: "View PM Due", href: "pm-due.html" },
          { label: "Open Reports", href: "report-pm.html" }
        ],
        "pm-due.html": [
          { label: "PM Schedule", href: "pm-schedule.html" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "spare-parts.html": [
          { label: "Export Stock List" },
          { label: "Open Reports", href: "reports.html" }
        ],
        "stock-history.html": [
          { label: "Spare Parts List", href: "spare-parts.html" },
          { label: "Export History" }
        ],
        "allocation.html": [
          { label: "Export Allocation List" },
          { label: "Review Dashboard", href: "dashboard.html" }
        ],
        "return-replace.html": [
          { label: "Export Flow List" },
          { label: "Open Reports", href: "report-rent-machine.html" }
        ],
        "reports.html": [
          { label: "Export IE Review Pack" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ]
      },
      extraRestrictedSelectors: [
        ".main-content .erp-card a.btn",
        ".main-content .erp-card button.btn",
        ".main-content a.mini-stat-item"
      ],
      restrictedActionTextTokens: [
        "add ",
        "create ",
        "new complaint",
        "save",
        "submit",
        "edit",
        "raise",
        "assign",
        "update",
        "post",
        "complete",
        "approve",
        "receive",
        "allocate",
        "transfer",
        "renew",
        "close",
        "issue",
        "need",
        "reschedule",
        "start replacement",
        "unlock",
        "reset",
        "follow up"
      ],
      restrictedActionHrefTokens: [
        "factory-list.html",
        "floor-list.html",
        "line-list.html",
        "section-list.html",
        "machine-category.html",
        "machine-registration.html",
        "machine-edit.html",
        "rent-machine-form.html",
        "vendor-form.html",
        "agreement-form.html",
        "breakdown-form.html",
        "ticket-assign.html",
        "ticket-close.html",
        "technician-tasks.html",
        "technician-task-update.html",
        "pm-checklist.html",
        "pm-complete.html",
        "spare-part-form.html",
        "user-form.html",
        "user-list.html",
        "roles-permissions.html"
      ],
      readOnlyNoticePages: {
        "allocation.html": "IE Manager can review this page, but edit and posting controls are hidden.",
        "return-replace.html": "IE Manager can review this page, but edit and posting controls are hidden."
      }
    },
    "IE Executive": {
      sidebarHiddenGroups: ["Setup", "Users & Access"],
      sidebarHiddenItems: ["Technician Tasks"],
      moreSheetHiddenLinks: ["user-list.html"],
      redirectPages: {
        "factory-list.html": "dashboard.html",
        "floor-list.html": "dashboard.html",
        "line-list.html": "dashboard.html",
        "section-list.html": "dashboard.html",
        "machine-category.html": "machines.html",
        "machine-registration.html": "machines.html",
        "machine-edit.html": "machines.html",
        "rent-machine-form.html": "rent-machines.html",
        "vendor-form.html": "vendors.html",
        "agreement-form.html": "agreements.html",
        "breakdown-form.html": "breakdown-list.html",
        "ticket-assign.html": "breakdown-list.html",
        "ticket-close.html": "breakdown-list.html",
        "technician-task-update.html": "breakdown-list.html",
        "technician-tasks.html": "breakdown-list.html",
        "pm-checklist.html": "pm-schedule.html",
        "pm-complete.html": "pm-due.html",
        "spare-part-form.html": "spare-parts.html",
        "user-list.html": "dashboard.html",
        "user-form.html": "dashboard.html",
        "roles-permissions.html": "dashboard.html"
      },
      readOnlyForms: ["allocationForm", "returnReplaceForm"],
      headerActions: {
        "dashboard.html": [
          { label: "View Reports", href: "reports.html" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "machine-details.html": [
          { label: "Machine List", href: "machines.html" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "rent-machine-details.html": [
          { label: "Rent Machine List", href: "rent-machines.html" },
          { label: "View Reports", href: "report-rent-machine.html" }
        ],
        "vendor-details.html": [
          { label: "Vendor List", href: "vendors.html" },
          { label: "View Reports", href: "reports.html" }
        ],
        "agreement-details.html": [
          { label: "Agreement List", href: "agreements.html" },
          { label: "View Reports", href: "reports.html" }
        ],
        "machine-history.html": [
          { label: "Machine List", href: "machines.html" },
          { label: "View Reports", href: "reports.html" }
        ],
        "rent-machine-history.html": [
          { label: "Rent Machine List", href: "rent-machines.html" },
          { label: "View Reports", href: "report-rent-machine.html" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "machines.html": [
          { label: "Review Machine Status", href: "machines.html" },
          { label: "View Dashboard", href: "dashboard.html" }
        ],
        "rent-machines.html": [
          { label: "Review Machine Status", href: "rent-machines.html" },
          { label: "View Reports", href: "report-rent-machine.html" }
        ],
        "vendors.html": [
          { label: "View Reports", href: "reports.html" },
          { label: "View Dashboard", href: "dashboard.html" }
        ],
        "agreements.html": [
          { label: "View Reports", href: "reports.html" },
          { label: "View Dashboard", href: "dashboard.html" }
        ],
        "breakdown-list.html": [
          { label: "View Breakdown List", href: "breakdown-list.html" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "ticket-details.html": [
          { label: "Ticket List", href: "breakdown-list.html" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "breakdown-history.html": [
          { label: "View Breakdown List", href: "breakdown-list.html" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "pm-schedule.html": [
          { label: "View PM Due", href: "pm-due.html" },
          { label: "View Reports", href: "report-pm.html" }
        ],
        "pm-due.html": [
          { label: "View PM Schedule", href: "pm-schedule.html" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "spare-parts.html": [
          { label: "View Reports", href: "reports.html" },
          { label: "View Dashboard", href: "dashboard.html" }
        ],
        "spare-low-stock.html": [
          { label: "Spare Parts List", href: "spare-parts.html" },
          { label: "View Reports", href: "reports.html" }
        ],
        "stock-history.html": [
          { label: "Spare Parts List", href: "spare-parts.html" },
          { label: "View Reports", href: "reports.html" }
        ],
        "allocation.html": [
          { label: "View Dashboard", href: "dashboard.html" },
          { label: "Review Machine Status", href: "machines.html" }
        ],
        "return-replace.html": [
          { label: "View Reports", href: "report-rent-machine.html" },
          { label: "View Dashboard", href: "dashboard.html" }
        ],
        "reports.html": [
          { label: "View Dashboard", href: "dashboard.html" },
          { label: "Analyze Downtime", href: "report-downtime.html" }
        ],
        "report-breakdown.html": [
          { label: "View Reports", href: "reports.html" },
          { label: "View Breakdown List", href: "breakdown-list.html" }
        ],
        "report-pm.html": [
          { label: "View Reports", href: "reports.html" },
          { label: "View PM Schedule", href: "pm-schedule.html" }
        ],
        "report-rent-machine.html": [
          { label: "View Reports", href: "reports.html" },
          { label: "Review Machine Status", href: "rent-machines.html" }
        ],
        "report-downtime.html": [
          { label: "View Reports", href: "reports.html" },
          { label: "View Dashboard", href: "dashboard.html" }
        ]
      },
      extraRestrictedSelectors: [
        ".main-content .erp-card a.btn",
        ".main-content .erp-card button.btn",
        ".main-content a.mini-stat-item"
      ],
      restrictedActionTextTokens: [
        "add ",
        "create ",
        "new complaint",
        "save",
        "submit",
        "edit",
        "raise",
        "assign",
        "update",
        "post",
        "complete",
        "approve",
        "receive",
        "allocate",
        "transfer",
        "renew",
        "close",
        "issue",
        "need",
        "reschedule",
        "start replacement",
        "unlock",
        "reset",
        "follow up",
        "export",
        "download",
        "print"
      ],
      restrictedActionHrefTokens: [
        "factory-list.html",
        "floor-list.html",
        "line-list.html",
        "section-list.html",
        "machine-category.html",
        "machine-registration.html",
        "machine-edit.html",
        "rent-machine-form.html",
        "vendor-form.html",
        "agreement-form.html",
        "breakdown-form.html",
        "ticket-assign.html",
        "ticket-close.html",
        "technician-tasks.html",
        "technician-task-update.html",
        "pm-checklist.html",
        "pm-complete.html",
        "spare-part-form.html",
        "user-form.html",
        "user-list.html",
        "roles-permissions.html"
      ],
      readOnlyNoticePages: {
        "allocation.html": "IE Executive can review this page, but edit and posting controls are hidden.",
        "return-replace.html": "IE Executive can review this page, but edit and posting controls are hidden."
      }
    }
  };

  const pageRoleDefaults = {
    "dashboard.html": "Maintenance Head",
    "breakdown-form.html": "Production User",
    "breakdown-list.html": "Supervisor",
    "ticket-details.html": "Supervisor",
    "ticket-assign.html": "Supervisor",
    "ticket-close.html": "Supervisor",
    "pm-schedule.html": "Maintenance Head",
    "pm-due.html": "Maintenance Head",
    "pm-checklist.html": "Technician",
    "pm-complete.html": "Technician",
    "technician-tasks.html": "Technician",
    "technician-task-update.html": "Technician",
    "return-replace.html": "Maintenance Head",
    "spare-parts.html": "Store User",
    "spare-low-stock.html": "Store User",
    "stock-history.html": "Store User",
    "reports.html": "Production GM",
    "report-breakdown.html": "Maintenance Head",
    "report-pm.html": "Maintenance Head",
    "report-rent-machine.html": "Production GM",
    "report-downtime.html": "Production GM"
  };

  const workflowBlueprints = {
    breakdown: {
      stages: [
        { key: "raise", label: "Complaint Raise", owner: "Production User", nextOwner: "Supervisor", note: "Complaint must include line impact and machine reference." },
        { key: "assign", label: "Assignment", owner: "Supervisor", nextOwner: "Technician", note: "Critical or repeat cases can move to maintenance head review." },
        { key: "execute", label: "Technician Update", owner: "Technician", nextOwner: "Supervisor", note: "Root cause, corrective action, spare need, and vendor need must be visible." },
        { key: "complete", label: "Repair Complete", owner: "Technician", nextOwner: "Supervisor", note: "Repair can complete only after stable trial result." },
        { key: "close", label: "Close with Production Acceptance", owner: "Supervisor", nextOwner: "History", note: "Production acceptance is mandatory before final close." }
      ],
      approvals: [
        "Critical ticket escalation -> Maintenance Head",
        "Vendor pending beyond SLA -> Maintenance Head",
        "Repeat breakdown review -> Supervisor + Maintenance Head"
      ]
    },
    pm: {
      stages: [
        { key: "plan", label: "PM Plan", owner: "Maintenance Head", nextOwner: "Technician", note: "Frequency and due date must stay consistent with machine master." },
        { key: "due", label: "Due Review", owner: "Maintenance Head", nextOwner: "Technician", note: "Overdue items need exception reason and closure owner." },
        { key: "execute", label: "Checklist Execution", owner: "Technician", nextOwner: "Supervisor", note: "Checklist, observation, and spare use must be captured." },
        { key: "complete", label: "PM Completion", owner: "Technician", nextOwner: "Maintenance Head", note: "Delayed PM needs approval-ready exception note." }
      ],
      approvals: [
        "PM defer -> Maintenance Head approval",
        "Rent machine PM blocked by vendor/spare -> escalate to Maintenance Head",
        "Production release after PM observation -> Supervisor confirmation"
      ]
    },
    returnReplace: {
      stages: [
        { key: "request", label: "Request Raise", owner: "Maintenance Head", nextOwner: "Vendor", note: "Reason must show production impact and linked agreement." },
        { key: "vendor", label: "Vendor Review", owner: "Vendor", nextOwner: "Maintenance Head", note: "Vendor reply date and standby plan should stay visible." },
        { key: "approval", label: "Approval", owner: "Maintenance Head", nextOwner: "Admin", note: "Approval owner can be maintenance head or admin based on risk." },
        { key: "complete", label: "Pickup / Replacement Close", owner: "Store User", nextOwner: "History", note: "Final outcome should keep agreement and machine history aligned." }
      ],
      approvals: [
        "Return or replace approval -> Maintenance Head",
        "Contract risk review -> Admin or Management",
        "Line backup arrangement review -> Production GM"
      ]
    },
    spare: {
      stages: [
        { key: "stock", label: "Stock Watch", owner: "Store User", nextOwner: "Maintenance Head", note: "Balance, reorder level, and machine dependency should remain visible." },
        { key: "issue", label: "Issue / Receive", owner: "Store User", nextOwner: "Technician", note: "Movement reference should point to PM or ticket." },
        { key: "alert", label: "Low Stock Escalation", owner: "Store User", nextOwner: "Maintenance Head", note: "Critical shortage needs approval-ready escalation." },
        { key: "approval", label: "Purchase / Adjustment Approval", owner: "Admin", nextOwner: "Store User", note: "High-risk stock adjustments should carry approver metadata." }
      ],
      approvals: [
        "Critical low stock -> Maintenance Head review",
        "Stock adjustment -> Admin approval",
        "Vendor lead-time risk -> Store User follow-up"
      ]
    },
    technician: {
      stages: [
        { key: "queue", label: "Task Queue", owner: "Technician", nextOwner: "Technician", note: "Breakdown and PM should stay visible but distinct." },
        { key: "support", label: "Support Request", owner: "Technician", nextOwner: "Store User / Supervisor", note: "Support need should identify spare, vendor, or decision owner." },
        { key: "handover", label: "Shift Handover", owner: "Technician", nextOwner: "Supervisor", note: "Open risks must be explained before shift end." }
      ],
      approvals: [
        "Vendor-needed work -> Maintenance Head",
        "Spare-needed work -> Store User and Maintenance Head"
      ]
    }
  };

  const approvalQueue = [
    {
      id: "APR-PM-045",
      module: "PM Defer Approval",
      referenceId: "PM-2026-045",
      requestedBy: "Rafiqul Islam",
      requestedRole: "Technician",
      approver: "Jahidul Islam",
      approverRole: "Maintenance Head",
      status: "Pending",
      note: "Rent machine PM defer requested because corrective work and vendor review are both still open."
    },
    {
      id: "APR-BD-119",
      module: "Critical Ticket Escalation",
      referenceId: "BD-2026-0119",
      requestedBy: "Rahima Begum",
      requestedRole: "Supervisor",
      approver: "Jahidul Islam",
      approverRole: "Maintenance Head",
      status: "Pending",
      note: "Repeat issue on RM-2008 is affecting Line 03 output and may require vendor SLA intervention."
    },
    {
      id: "APR-RR-007",
      module: "Replacement Approval",
      referenceId: "RR-2026-0007",
      requestedBy: "Jahidul Islam",
      requestedRole: "Maintenance Head",
      approver: "Mahmud Hasan",
      approverRole: "Admin",
      status: "Approved",
      note: "Replacement review approved, pending vendor standby decision."
    },
    {
      id: "APR-STK-021",
      module: "Low Stock Escalation",
      referenceId: "SP-BELT-01",
      requestedBy: "Nasima Akter",
      requestedRole: "Store User",
      approver: "Jahidul Islam",
      approverRole: "Maintenance Head",
      status: "Pending",
      note: "Motor belt shortage is affecting overdue PM closure and breakdown standby readiness."
    }
  ];

  const stockMovements = [
    {
      id: "RCV-2026-041",
      partCode: "SP-LOOPER-01",
      movementType: "Receive",
      reference: "PO-2026-118",
      quantity: "+3 pcs",
      balanceAfter: "5 pcs",
      date: "2026-04-18",
      postedBy: "Nasima Akter",
      status: "Posted",
      note: "Urgent receive to support overlock repeat issue recovery."
    },
    {
      id: "ISS-2026-119",
      partCode: "SP-LOOPER-01",
      movementType: "Issue",
      reference: "BD-2026-0119",
      quantity: "-1 pc",
      balanceAfter: "4 pcs",
      date: "2026-04-22",
      postedBy: "Nasima Akter",
      status: "Posted",
      note: "Issued against RM-2008 corrective work under supervisor follow-up."
    },
    {
      id: "ISS-2026-123",
      partCode: "SP-BELT-01",
      movementType: "Pending Issue",
      reference: "PM-2026-043",
      quantity: "0 pc",
      balanceAfter: "1 pc",
      date: "2026-04-23",
      postedBy: "Nasima Akter",
      status: "Pending",
      note: "Belt not issued because approval and replenishment are both pending."
    },
    {
      id: "ADJ-2026-007",
      partCode: "SP-SENSOR-01",
      movementType: "Adjustment",
      reference: "Cycle Count",
      quantity: "-1 pc",
      balanceAfter: "2 pcs",
      date: "2026-04-20",
      postedBy: "Mahmud Hasan",
      status: "Adjusted",
      note: "Audit correction after physical count mismatch."
    }
  ];

  const pageContext = {
    machineDetailsId: "MC-1014",
    rentMachineDetailsId: "RM-2008",
    vendorDetailsId: "VEN-004",
    agreementDetailsId: "AGR-2026-004",
    ticketDetailsId: "BD-2026-0119",
    ticketAssignId: "BD-2026-0121",
    ticketCloseId: "BD-2026-0096",
    technicianUpdateReference: "BD-2026-0119",
    pmChecklistId: "PM-2026-044",
    pmCompleteId: "PM-2026-041",
    stockFocusCode: "SP-BELT-01"
  };

  const histories = {
    machineEvents: [
      {
        date: "2026-04-23",
        time: "09:10 AM",
        machineId: "MC-1014",
        eventType: "Breakdown",
        details: "Machine moved into active breakdown follow-up after repeat looper issue was raised from Line 03.",
        linkedRef: "BD-2026-0121",
        linkedRefType: "Ticket reference",
        updatedBy: "Salma Akter",
        statusAfterEvent: "Breakdown"
      },
      {
        date: "2026-04-22",
        time: "10:10 AM",
        machineId: "RM-2008",
        eventType: "Breakdown",
        details: "Rent machine entered corrective maintenance and replacement review after thread break repeat case.",
        linkedRef: "BD-2026-0119",
        linkedRefType: "Ticket reference",
        updatedBy: "Rahima Begum",
        statusAfterEvent: "Under Maintenance"
      },
      {
        date: "2026-04-21",
        time: "11:30 AM",
        machineId: "MC-1014",
        eventType: "PM Update",
        details: "Weekly PM moved to overdue watch because breakdown recovery received higher priority.",
        linkedRef: "PM-2026-042",
        linkedRefType: "PM plan",
        updatedBy: "Sohel Rana",
        statusAfterEvent: "Breakdown"
      },
      {
        date: "2026-04-18",
        time: "02:00 PM",
        machineId: "RM-2010",
        eventType: "Breakdown",
        details: "Motor belt wear complaint completed with spare shortage note for next PM follow-up.",
        linkedRef: "BD-2026-0096",
        linkedRefType: "Ticket reference",
        updatedBy: "Hasan Ali",
        statusAfterEvent: "Active"
      },
      {
        date: "2026-04-17",
        time: "03:25 PM",
        machineId: "MC-1050",
        eventType: "PM Update",
        details: "Weekly PM executed and next due date updated after pressure line inspection.",
        linkedRef: "PM-2026-044",
        linkedRefType: "PM plan",
        updatedBy: "Shamim Mia",
        statusAfterEvent: "Active"
      },
      {
        date: "2026-04-10",
        time: "09:20 AM",
        machineId: "RM-2022",
        eventType: "Registration",
        details: "Rent machine received and linked to vendor and agreement before line allocation.",
        linkedRef: "AGR-2026-006",
        linkedRefType: "Agreement reference",
        updatedBy: "Shahadat Hossain",
        statusAfterEvent: "Active"
      }
    ],
    rentMachineAllocations: {
      "RM-2008": [
        {
          date: "2026-04-18",
          floor: "Sewing Floor 02",
          line: "Line 03",
          allocatedBy: "Rahima Begum",
          status: "Active",
          remarks: "Kept on Line 03 to protect overlock output during export batch run."
        },
        {
          date: "2026-03-02",
          floor: "Sewing Floor 03",
          line: "Line 10",
          allocatedBy: "Nasima Akter",
          status: "Reallocated",
          remarks: "Temporary balancing support during style change window."
        },
        {
          date: "2026-02-02",
          floor: "Store Hold",
          line: "Not Assigned",
          allocatedBy: "Shahadat Hossain",
          status: "Received",
          remarks: "Receive entry completed before first production deployment."
        }
      ]
    },
    rentMachineHistory: {
      "RM-2008": [
        {
          date: "2026-04-22",
          time: "10:10 AM",
          eventType: "Breakdown",
          details: "Repeat thread break complaint logged after looper timing drift was observed on live line.",
          linkedRef: "BD-2026-0119",
          linkedRefType: "Breakdown ticket",
          updatedBy: "Rahima Begum",
          statusAfterEvent: "Under Maintenance"
        },
        {
          date: "2026-04-21",
          time: "04:20 PM",
          eventType: "Return / Replace",
          details: "Replacement review opened because repeated corrective support is affecting stable output.",
          linkedRef: "RR-2026-0007",
          linkedRefType: "Return / replace request",
          updatedBy: "Jahidul Islam",
          statusAfterEvent: "Replacement Review"
        },
        {
          date: "2026-04-16",
          time: "11:40 AM",
          eventType: "PM Update",
          details: "Monthly PM deferred until corrective maintenance is closed and maintenance head approves next slot.",
          linkedRef: "PM-2026-045",
          linkedRefType: "PM plan",
          updatedBy: "Rafiqul Islam",
          statusAfterEvent: "Planned"
        },
        {
          date: "2026-02-02",
          time: "09:25 AM",
          eventType: "Receive",
          details: "Rent machine received, tagged, and linked with vendor and agreement before allocation.",
          linkedRef: "AGR-2026-004",
          linkedRefType: "Agreement reference",
          updatedBy: "Shahadat Hossain",
          statusAfterEvent: "Active"
        }
      ]
    },
    ticketUpdates: {
      "BD-2026-0119": [
        {
          time: "10:32 AM",
          updatedBy: "Sohel Rana",
          updatedRole: "Technician",
          workNote: "Reached line and inspected looper timing, spring tension, and thread path condition.",
          nextStep: "Open front cover and inspect looper drive play.",
          supportNeed: "No extra support yet",
          status: "Accepted"
        },
        {
          time: "10:58 AM",
          updatedBy: "Sohel Rana",
          updatedRole: "Technician",
          workNote: "Looper timing reset completed and spring check performed. Repeat vibration still observed at higher speed.",
          nextStep: "Run trial pieces and monitor 30-minute output.",
          supportNeed: "Spare and vendor watch",
          status: "In Progress"
        },
        {
          time: "11:22 AM",
          updatedBy: "Rahima Begum",
          updatedRole: "Supervisor",
          workNote: "Trial pieces accepted visually, but maintenance asked to keep the machine under watch before closure.",
          nextStep: "Continue monitored run and confirm production acceptance.",
          supportNeed: "Production acceptance pending",
          status: "Review"
        }
      ]
    },
    returnReplaceRequests: [
      {
        id: "RR-2026-0007",
        machineId: "RM-2008",
        requestType: "Replacement",
        requestDate: "2026-04-21",
        flowStatus: "Vendor Review",
        vendorReplyDate: "2026-04-22",
        requestedBy: "Jahidul Islam",
        approvedBy: "Mahmud Hasan",
        approvalStage: "Final approval already cleared",
        completionTarget: "2026-04-24",
        issueReference: "BD-2026-0119",
        lineImpact: "Line 03 overlock support is unstable during export batch.",
        alternateSupport: "Shift one standby overlock from Line 10 if vendor misses target.",
        reason: "Repeat looper timing issue and thread break after multiple support attempts. Production on Line 03 is affected.",
        remarks: "Vendor asked for one final monitored run before dispatching a replacement machine."
      },
      {
        id: "RR-2026-0006",
        machineId: "RM-2010",
        requestType: "Return",
        requestDate: "2026-04-18",
        flowStatus: "Agreement Review",
        vendorReplyDate: "2026-04-20",
        requestedBy: "Jahidul Islam",
        approvedBy: "Kamrul Hasan",
        approvalStage: "Agreement review still open",
        completionTarget: "2026-04-26",
        issueReference: "PM-2026-043",
        lineImpact: "Line 05 can continue only if spare supply normalizes.",
        alternateSupport: "Keep one own machine as backup for day shift only.",
        reason: "Agreement-linked PM delay and repeated motor belt shortage increased service dependency.",
        remarks: "Return will be considered only if spare and PM closure stay blocked."
      },
      {
        id: "RR-2026-0004",
        machineId: "RM-2006",
        requestType: "Return",
        requestDate: "2026-04-12",
        flowStatus: "Completed",
        vendorReplyDate: "2026-04-14",
        requestedBy: "Shahadat Hossain",
        approvedBy: "Mahmud Hasan",
        approvalStage: "Closed with pickup confirmation",
        completionTarget: "2026-04-16",
        issueReference: "AGR-2026-002",
        lineImpact: "No active production impact after scope reduction.",
        alternateSupport: "Not required",
        reason: "Machine no longer needed after line balancing and contract scope reduction.",
        remarks: "Pickup pending remark closed after vendor collection confirmation."
      }
    ],
    technicianBoard: [
      {
        reference: "BD-2026-0119",
        type: "Breakdown",
        machineId: "RM-2008",
        technician: "Sohel Rana",
        note: "Trial run under watch after looper timing reset.",
        status: "In Progress",
        supportNeed: "Production acceptance pending",
        escalation: "Vendor on stand by",
        handover: "Keep under watch if not closed before shift end.",
        actionHref: "ticket-details.html",
        actionLabel: "Ticket",
        secondaryHref: "technician-task-update.html",
        secondaryLabel: "Update"
      },
      {
        reference: "PM-2026-043",
        type: "PM",
        machineId: "RM-2010",
        technician: "Hasan Ali",
        note: "Monthly PM overdue due to motor belt shortage and vendor-aware follow-up.",
        status: "Overdue",
        supportNeed: "Store approval needed",
        escalation: "PM defer pending maintenance head",
        handover: "Share shortage note with next shift if stock remains blocked.",
        actionHref: "pm-checklist.html",
        actionLabel: "Checklist",
        secondaryHref: "technician-task-update.html",
        secondaryLabel: "Update"
      },
      {
        reference: "BD-2026-0121",
        type: "Breakdown",
        machineId: "MC-1014",
        technician: "Rafiqul Islam",
        note: "High priority open ticket waiting assignment and root cause review.",
        status: "Assigned",
        supportNeed: "Supervisor assignment confirmation",
        escalation: "Repeat issue watch",
        handover: "Escalate if no visit in 30 minutes.",
        actionHref: "ticket-details.html",
        actionLabel: "Ticket",
        secondaryHref: "technician-task-update.html",
        secondaryLabel: "Update"
      },
      {
        reference: "PM-2026-044",
        type: "PM",
        machineId: "MC-1050",
        technician: "Shamim Mia",
        note: "Weekly PM checklist pending in second shift maintenance slot.",
        status: "Due",
        supportNeed: "No extra support",
        escalation: "Close today to protect weekly compliance",
        handover: "Complete before shift close.",
        actionHref: "pm-checklist.html",
        actionLabel: "Checklist",
        secondaryHref: "technician-task-update.html",
        secondaryLabel: "Update"
      }
    ],
    breakdownHistory: [
      {
        ticketId: "BD-2026-0107",
        machineId: "MC-1035",
        issueSummary: "Fabric feeding uneven",
        technician: "Rafiqul Islam",
        raisedAt: "20 Apr 2026, 09:20 AM",
        closedAt: "20 Apr 2026, 10:26 AM",
        closureTime: "1 Hr 06 Min",
        finalStatus: "Closed",
        closureNote: "Feed dog alignment completed and production confirmed stable seam quality."
      },
      {
        ticketId: "BD-2026-0096",
        machineId: "RM-2010",
        issueSummary: "Motor noise and overheating",
        technician: "Hasan Ali",
        raisedAt: "18 Apr 2026, 11:15 AM",
        closedAt: "18 Apr 2026, 01:27 PM",
        closureTime: "2 Hrs 12 Min",
        finalStatus: "Completed",
        closureNote: "Temporary correction completed; next PM still depends on motor belt issue."
      },
      {
        ticketId: "BD-2026-0088",
        machineId: "MC-1050",
        issueSummary: "Pressure test alarm",
        technician: "Shamim Mia",
        raisedAt: "17 Apr 2026, 02:05 PM",
        closedAt: "17 Apr 2026, 02:40 PM",
        closureTime: "35 Min",
        finalStatus: "Assigned",
        closureNote: "Inspection note captured and calibration shifted into weekly PM plan."
      }
    ]
  };

  function mapById(items) {
    return items.reduce(function (accumulator, item) {
      accumulator[item.id] = item;
      return accumulator;
    }, {});
  }

  const vendorMap = mapById(vendors);
  const agreementMap = mapById(agreements);
  const machineMap = mapById(machines);

  const helpers = {
    formatCurrency: function (value) {
      return "BDT " + Number(value).toLocaleString("en-US");
    },

    statusBadgeClass: function (status) {
      const map = {
        Active: "success",
        Idle: "secondary",
        Breakdown: "danger",
        "Under Maintenance": "warning",
        Returned: "secondary",
        Replaced: "primary",
        Open: "danger",
        Assigned: "primary",
        "In Progress": "info",
        Completed: "success",
        Closed: "success",
        Due: "warning",
        Overdue: "danger",
        Planned: "secondary",
        Stable: "success",
        "Needs Follow-up": "warning",
        "Overdue Risk": "danger",
        "Decision Pending": "warning",
        "Shortage Watch": "danger",
        Controlled: "success",
        "High Risk": "danger",
        "Repeat Risk": "danger",
        "Parts Risk": "warning",
        "High Pressure": "danger",
        "High Loss": "danger",
        "Critical Watch": "danger",
        "Renewal Watch": "warning",
        "Service Risk": "danger",
        Closeout: "info",
        Risk: "warning",
        "Vendor Watch": "warning",
        "Return Review": "warning",
        "Expiring Soon": "warning",
        "Pending Approval": "danger",
        "Active Agreement": "success",
        "Vendor Review": "warning",
        Approved: "success",
        Rejected: "danger",
        "No Request": "secondary",
        "Replacement Review": "primary",
        "Agreement Review": "warning",
        "Pickup Pending": "warning",
        Draft: "secondary",
        Expired: "secondary",
        Critical: "danger",
        Low: "warning",
        Healthy: "success",
        Accepted: "primary",
        Review: "info",
        Pending: "warning",
        Watch: "warning",
        Urgent: "danger",
        Running: "primary",
        Met: "success",
        Captured: "secondary",
        "Stand By": "warning",
        Posted: "primary",
        Adjusted: "danger",
        Hold: "secondary",
        Ready: "success",
        Clear: "success"
      };

      return map[status] || "secondary";
    },

    priorityBadgeClass: function (priority) {
      const map = {
        High: "danger",
        Medium: "warning",
        Low: "secondary"
      };

      return map[priority] || "secondary";
    },

    getVendor: function (vendorId) {
      return vendorMap[vendorId] || null;
    },

    getAgreement: function (agreementId) {
      return agreementMap[agreementId] || null;
    },

    getMachine: function (machineId) {
      return machineMap[machineId] || null;
    },

    getMachineVendor: function (machine) {
      const targetMachine = typeof machine === "string" ? machineMap[machine] : machine;
      if (!targetMachine || !targetMachine.vendorId) {
        return null;
      }

      return vendorMap[targetMachine.vendorId] || null;
    },

    getMachineAgreement: function (machine) {
      const targetMachine = typeof machine === "string" ? machineMap[machine] : machine;
      if (!targetMachine || !targetMachine.agreementId) {
        return null;
      }

      return agreementMap[targetMachine.agreementId] || null;
    },

    getRentMachines: function () {
      return machines.filter(function (machine) {
        return machine.ownership === "Rent";
      });
    },

    getOwnMachines: function () {
      return machines.filter(function (machine) {
        return machine.ownership === "Own";
      });
    },

    getOpenTickets: function () {
      return tickets.filter(function (ticket) {
        return ["Open", "Assigned", "In Progress", "Completed"].indexOf(ticket.status) > -1;
      });
    },

    getClosedTickets: function () {
      return tickets.filter(function (ticket) {
        return ticket.status === "Closed";
      });
    },

    getOverduePmPlans: function () {
      return pmPlans.filter(function (plan) {
        return plan.status === "Overdue";
      });
    },

    getDuePmPlans: function () {
      return pmPlans.filter(function (plan) {
        return plan.status === "Due";
      });
    },

    getLowStockParts: function () {
      return spareParts.filter(function (part) {
        return part.status === "Critical" || part.status === "Low";
      });
    },

    getRepeatIssueMachines: function () {
      return machines.filter(function (machine) {
        return machine.repeatWatch;
      });
    },

    getMachineTickets: function (machineId) {
      return tickets.filter(function (ticket) {
        return ticket.machineId === machineId;
      });
    },

    getMachinePmPlans: function (machineId) {
      return pmPlans.filter(function (plan) {
        return plan.machineId === machineId;
      });
    },

    getActiveMachineCount: function () {
      return machines.filter(function (machine) {
        return machine.status === "Active";
      }).length;
    },

    getTotalDowntimeHours: function (ticketList) {
      const list = Array.isArray(ticketList) ? ticketList : tickets;
      return list.reduce(function (total, ticket) {
        return total + Number(ticket.downtimeHours || 0);
      }, 0);
    },

    getAverageDowntimeHours: function (ticketList) {
      const list = Array.isArray(ticketList) ? ticketList : tickets;
      if (!list.length) {
        return 0;
      }

      return helpers.getTotalDowntimeHours(list) / list.length;
    },

    getOutputLossTickets: function () {
      return tickets.filter(function (ticket) {
        return /Line stoppage|Output loss risk|Reduced line speed/i.test(ticket.impact || "");
      });
    },

    getProductionAcceptancePendingTickets: function () {
      return tickets.filter(function (ticket) {
        return !ticket.acceptedByProduction && ticket.status !== "Closed";
      });
    },

    getRentRiskMachines: function () {
      return machines.filter(function (machine) {
        return machine.ownership === "Rent" && (
          machine.repeatWatch ||
          machine.status === "Under Maintenance" ||
          (machine.returnReplaceStatus && machine.returnReplaceStatus !== "No Request")
        );
      });
    },

    getVendorRiskAgreements: function () {
      return agreements.filter(function (agreement) {
        return agreement.type === "Rent Machine" && (
          agreement.status === "Expiring Soon" ||
          agreement.renewalRisk === "High"
        );
      });
    },

    getUserByName: function (userName) {
      return users.find(function (user) {
        return user.name === userName;
      }) || null;
    },

    getUsersByRole: function (role) {
      return users.filter(function (user) {
        return user.role === role;
      });
    },

    getTechnicianLoad: function () {
      const load = {};

      tickets.forEach(function (ticket) {
        if (!ticket.technician) {
          return;
        }

        if (!load[ticket.technician]) {
          load[ticket.technician] = { breakdown: 0, pm: 0 };
        }

        if (ticket.status !== "Closed") {
          load[ticket.technician].breakdown += 1;
        }
      });

      pmPlans.forEach(function (plan) {
        if (!plan.technician) {
          return;
        }

        if (!load[plan.technician]) {
          load[plan.technician] = { breakdown: 0, pm: 0 };
        }

        if (plan.status === "Due" || plan.status === "Overdue" || plan.status === "Planned") {
          load[plan.technician].pm += 1;
        }
      });

      return Object.keys(load).map(function (technician) {
        return {
          technician: technician,
          breakdown: load[technician].breakdown,
          pm: load[technician].pm
        };
      });
    }
  };

  window.LMLData = {
    scope: scope,
    metrics: metrics,
    managementMetrics: managementMetrics,
    reportMetrics: reportMetrics,
    users: users,
    vendors: vendors,
    agreements: agreements,
    lines: lines,
    machines: machines,
    tickets: tickets,
    pmPlans: pmPlans,
    spareParts: spareParts,
    reportViews: reportViews,
    roleProfiles: roleProfiles,
    roleUiPolicies: roleUiPolicies,
    pageRoleDefaults: pageRoleDefaults,
    workflowBlueprints: workflowBlueprints,
    approvalQueue: approvalQueue,
    stockMovements: stockMovements,
    pageContext: pageContext,
    histories: histories,
    helpers: helpers
  };
})();
