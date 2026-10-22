(() => {
  "use strict";

  const STORAGE_KEY = "pathway-campus-demo-v1";
  const demoStudents = [
    { id: "s1", name: "Aarav Sharma", email: "aarav.sharma@northstar.edu", program: "B.Tech · Computer Science", graduation: 2026, skills: ["Python", "React", "SQL", "Machine Learning"], locations: ["Bengaluru", "Remote"], alerts: true, sharing: true, projects: ["Built a campus peer-learning platform serving 600+ students", "Trained an image classifier using PyTorch"] },
    { id: "s2", name: "Maya Patel", email: "maya.patel@northstar.edu", program: "B.Tech · Information Technology", graduation: 2027, skills: ["Java", "Spring Boot", "SQL", "REST APIs"], locations: ["Bengaluru", "Pune"], alerts: true, sharing: true, projects: ["Designed an inventory API with Spring Boot", "Open-source contributor to a campus scheduling app"] },
    { id: "s3", name: "Rohan Iyer", email: "rohan.iyer@northstar.edu", program: "B.Sc. · Data Science", graduation: 2026, skills: ["Python", "Machine Learning", "SQL", "Data Visualization"], locations: ["Remote", "Hyderabad"], alerts: true, sharing: false, projects: ["Analyzed public transport patterns using Python", "Built an interactive dashboard with Tableau"] },
    { id: "s4", name: "Anika Rao", email: "anika.rao@northstar.edu", program: "B.Tech · Computer Science", graduation: 2027, skills: ["JavaScript", "React", "TypeScript", "Figma"], locations: ["Bengaluru", "Remote"], alerts: true, sharing: true, projects: ["Created an accessible React design system", "Prototyped an appointment-booking app in Figma"] },
    { id: "s5", name: "Kabir Mehta", email: "kabir.mehta@northstar.edu", program: "B.Tech · Software Engineering", graduation: 2026, skills: ["Java", "Python", "AWS", "Docker"], locations: ["Pune", "Mumbai"], alerts: false, sharing: false, projects: ["Containerized a microservices demo with Docker", "Deployed a serverless portfolio on AWS"] },
    { id: "s6", name: "Diya Nair", email: "diya.nair@northstar.edu", program: "BBA · Business Analytics", graduation: 2027, skills: ["SQL", "Excel", "Tableau", "Communication"], locations: ["Bengaluru", "Chennai"], alerts: true, sharing: true, projects: ["Built a sales performance dashboard in Tableau", "Presented customer retention insights to a student startup"] }
  ];

  const demoJobs = [
    { id: "j1", title: "Graduate Software Engineer", company: "Atlassian", initials: "A", logo: "logo-blue", location: "Bengaluru · Hybrid", type: "Full-time", skills: ["Java", "Python", "React", "SQL"], graduation: [2026, 2027], deadline: "2026-11-14", url: "https://www.atlassian.com/company/careers", source: "Employer partner", contact: "earlycareers@atlassian.example", created: "2 hours ago" },
    { id: "j2", title: "Data Analyst Intern", company: "Razorpay", initials: "R", logo: "logo-orange", location: "Bengaluru · On-site", type: "Internship", skills: ["SQL", "Python", "Tableau", "Excel"], graduation: [2026, 2027], deadline: "2026-11-02", url: "https://razorpay.com/jobs/", source: "Public careers feed", contact: "campus@razorpay.example", created: "5 hours ago" },
    { id: "j3", title: "Frontend Developer", company: "Freshworks", initials: "F", logo: "logo-green", location: "Remote · India", type: "Full-time", skills: ["React", "JavaScript", "TypeScript"], graduation: [2026], deadline: "2026-10-27", url: "https://www.freshworks.com/company/careers/", source: "Employer partner", contact: "university@freshworks.example", created: "1 day ago" },
    { id: "j4", title: "Backend Engineering Intern", company: "Postman", initials: "P", logo: "logo-purple", location: "Bengaluru · Hybrid", type: "Internship", skills: ["Java", "REST APIs", "SQL", "Python"], graduation: [2027], deadline: "2026-11-09", url: "https://www.postman.com/company/careers/", source: "Public careers feed", contact: "talent@postman.example", created: "1 day ago" },
    { id: "j5", title: "Associate Product Analyst", company: "Swiggy", initials: "S", logo: "logo-orange", location: "Bengaluru · Hybrid", type: "Full-time", skills: ["SQL", "Excel", "Communication", "Tableau"], graduation: [2026, 2027], deadline: "2026-11-20", url: "https://careers.swiggy.com/", source: "Employer partner", contact: "campus@swiggy.example", created: "2 days ago" }
  ];

  const initialLogs = [
    { id: "l1", kind: "email", action: "Job alert simulated", details: "Graduate Software Engineer · Atlassian", recipient: "Aarav Sharma", status: "Delivered", time: "18 min ago" },
    { id: "l2", kind: "match", action: "New eligible match", details: "Data Analyst Intern · Razorpay", recipient: "Diya Nair", status: "Matched", time: "32 min ago" },
    { id: "l3", kind: "company", action: "Candidate recommendation simulated", details: "Backend Engineering Intern · Postman", recipient: "Postman recruiter", status: "Delivered", time: "1 hr ago" },
    { id: "l4", kind: "match", action: "Profile sharing skipped", details: "Student sharing consent not enabled", recipient: "Private profile", status: "Skipped", time: "2 hrs ago" }
  ];

  const clone = value => JSON.parse(JSON.stringify(value));
  let state;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    state = stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn("Pathway could not load saved demo data; using fresh sample data.", error);
    state = null;
  }
  if (!state || !Array.isArray(state.students) || !Array.isArray(state.jobs)) {
    state = { students: clone(demoStudents), jobs: clone(demoJobs), logs: clone(initialLogs), sentAlerts: ["j1:s1", "j2:s6"], sentRecommendations: ["j4:s2"], automation: { discovery: true, alerts: true, sharing: true }, customJobCount: 0 };
  }

  const el = (selector, root = document) => root.querySelector(selector);
  const els = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const safeUrl = value => {
    try { const url = new URL(value); return url.protocol === "https:" ? url.href : "#"; } catch { return "#"; }
  };
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { console.error("Pathway could not save demo data.", error); toast("Could not save changes. Check browser storage settings."); }
  };
  const initials = name => String(name).split(/\s+/).map(part => part[0] || "").slice(0, 2).join("").toUpperCase();
  const readableDate = date => date ? new Date(`${date}T00:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" }) : "Not set";
  const relativeTime = () => "Just now";
  const isJobActive = job => !job.deadline || new Date(`${job.deadline}T23:59:59`) >= new Date();
  const isClosingSoon = job => isJobActive(job) && job.deadline && new Date(`${job.deadline}T23:59:59`) <= new Date(Date.now() + 9 * 86400000);
  const addLog = (kind, action, details, recipient, status) => {
    state.logs.unshift({ id: `l${Date.now()}${Math.random().toString(36).slice(2, 6)}`, kind, action, details, recipient, status, time: relativeTime() });
  };

  function toast(message) {
    const item = document.createElement("div");
    item.className = "toast";
    item.innerHTML = `<span>✳</span>${escapeHtml(message)}`;
    el("#toast-region").append(item);
    window.setTimeout(() => item.remove(), 3900);
  }

  function scoreMatch(student, job) {
    const matchedSkills = student.skills.filter(skill => job.skills.some(required => required.toLowerCase() === skill.toLowerCase()));
    const graduationEligible = !job.graduation?.length || job.graduation.includes(Number(student.graduation));
    const locationMatch = !student.locations?.length || student.locations.some(preference => job.location.toLowerCase().includes(preference.toLowerCase()) || (preference.toLowerCase() === "remote" && job.location.toLowerCase().includes("remote")));
    const skillScore = job.skills.length ? matchedSkills.length / job.skills.length : 0;
    const score = Math.round(skillScore * 72 + (graduationEligible ? 18 : 0) + (locationMatch ? 10 : 0));
    const missing = job.skills.filter(skill => !matchedSkills.some(matched => matched.toLowerCase() === skill.toLowerCase()));
    return { score, matchedSkills, missing, graduationEligible, locationMatch };
  }

  function eligibleMatches(job, options = {}) {
    if (!isJobActive(job)) return [];
    return state.students.map(student => ({ student, ...scoreMatch(student, job) }))
      .filter(match => match.graduationEligible && match.score >= (options.threshold ?? 45))
      .sort((a, b) => b.score - a.score);
  }

  function getRoleInitials(company) {
    const job = state.jobs.find(item => item.company === company);
    return job ? { initials: job.initials || initials(company), logo: job.logo || "logo-green" } : { initials: initials(company), logo: "logo-green" };
  }

  function renderFreshMatches() {
    const matches = state.jobs.flatMap(job => eligibleMatches(job).map(match => ({ ...match, job })))
      .sort((a, b) => b.score - a.score).slice(0, 4);
    el("#fresh-matches").innerHTML = matches.length ? matches.map((match, index) => {
      const avatarClass = ["", "a2", "a3"][index % 3];
      return `<div class="match-row"><div class="student-cell"><span class="student-avatar ${avatarClass}">${escapeHtml(initials(match.student.name))}</span><div class="cell-copy"><strong>${escapeHtml(match.student.name)}</strong><span>${escapeHtml(match.student.program.split("·").pop().trim())} · Class of ${escapeHtml(match.student.graduation)}</span></div></div><div class="job-cell"><strong>${escapeHtml(match.job.title)}</strong><span>${escapeHtml(match.job.company)}</span></div><div class="match-score"><span class="score-ring">${match.score}%</span><small>aligned</small></div><button class="row-arrow" aria-label="View match details" data-match="${escapeHtml(match.student.id)}:${escapeHtml(match.job.id)}">↗</button></div>`;
    }).join("") : `<div class="empty-state">No eligible matches yet. Add a student or opportunity to get started.</div>`;
  }

  function renderJobRows(target, jobs, compact = false) {
    const list = compact ? jobs.slice(0, 3) : jobs;
    el(target).innerHTML = list.length ? list.map(job => {
      const matches = eligibleMatches(job);
      const deadlineStyle = !isJobActive(job) || isClosingSoon(job) ? ` style="color:#c47c5d"` : "";
      const deadline = isJobActive(job) ? readableDate(job.deadline) : "Expired";
      return `<tr><td><div class="company-cell"><span class="company-logo ${escapeHtml(job.logo || "logo-green")}">${escapeHtml(job.initials || initials(job.company))}</span><div><div class="company-title">${escapeHtml(job.title)}</div><div class="company-name">${escapeHtml(job.company)}</div></div></div></td><td>${escapeHtml(job.location)}</td><td><span class="type-pill">${escapeHtml(job.type)}</span></td>${compact ? `<td><span class="table-match">${matches.length} students</span></td><td><span${deadlineStyle}>${escapeHtml(deadline)}</span></td>` : `<td>${job.skills.slice(0, 3).map(skill => `<span class="skill-chip">${escapeHtml(skill)}</span>`).join(" ")}</td><td><span class="table-match">${matches.length} matches</span></td><td><span${deadlineStyle}>${escapeHtml(deadline)}</span></td>`}</tr>`;
    }).join("") : `<tr><td colspan="6" class="no-results">No opportunities found.</td></tr>`;
  }

  function renderStudents() {
    const query = (el("#student-search")?.value || "").toLowerCase().trim();
    const consentFilter = el("#student-consent-filter")?.value || "all";
    const students = state.students.filter(student => {
      const text = [student.name, student.email, student.program, ...student.skills].join(" ").toLowerCase();
      return text.includes(query) && (consentFilter === "all" || (consentFilter === "sharing" ? student.sharing : !student.sharing));
    });
    el("#all-students").innerHTML = students.length ? students.map(student => `<tr><td><div class="company-cell"><span class="student-avatar">${escapeHtml(initials(student.name))}</span><div><div class="company-title">${escapeHtml(student.name)}</div><div class="company-name">${escapeHtml(student.email)}</div></div></div></td><td>${escapeHtml(student.program)}</td><td>${escapeHtml(student.graduation)}</td><td>${student.skills.slice(0, 3).map(skill => `<span class="skill-chip">${escapeHtml(skill)}</span>`).join(" ")}</td><td><label class="toggle" aria-label="Job alerts for ${escapeHtml(student.name)}"><input type="checkbox" data-pref="alerts" data-student="${escapeHtml(student.id)}" ${student.alerts ? "checked" : ""}><span></span></label></td><td><label class="toggle" aria-label="Recruiter sharing consent for ${escapeHtml(student.name)}"><input type="checkbox" data-pref="sharing" data-student="${escapeHtml(student.id)}" ${student.sharing ? "checked" : ""}><span></span></label> <span class="${student.sharing ? "consent-badge" : "private-badge"}">${student.sharing ? "Consented" : "Private"}</span></td></tr>`).join("") : `<tr><td colspan="6" class="no-results">No students match your search.</td></tr>`;
    el("#student-total").textContent = state.students.length;
    el("#consent-total").textContent = state.students.filter(student => student.sharing).length;
  }

  function renderRecommendations() {
    const query = (el("#recommendation-search")?.value || "").toLowerCase().trim();
    const strongOnly = el("#recommendation-filter")?.value === "high";
    const recommendations = state.jobs.flatMap(job => eligibleMatches(job, { threshold: 55 })
      .filter(match => match.student.sharing)
      .map(match => ({ ...match, job })))
      .filter(match => !strongOnly || match.score >= 80)
      .filter(match => [match.student.name, match.job.title, match.job.company, ...match.matchedSkills].join(" ").toLowerCase().includes(query))
      .sort((a, b) => b.score - a.score);
    el("#recommendation-cards").innerHTML = recommendations.length ? recommendations.map((match, index) => {
      const company = getRoleInitials(match.job.company);
      const missingText = match.missing.length ? `Skills to build next: <strong>${match.missing.map(escapeHtml).join(", ")}</strong>.` : `<strong>All listed skills match</strong> in this profile.`;
      return `<article class="recommendation-card"><div class="recommendation-card-top"><span class="company-logo ${escapeHtml(company.logo)}">${escapeHtml(company.initials)}</span><div class="job-cell"><strong>${escapeHtml(match.job.title)}</strong><span>${escapeHtml(match.job.company)} · ${escapeHtml(match.job.location)}</span></div><span class="score-ring">${match.score}%</span></div><div class="student-cell"><span class="student-avatar ${index % 2 ? "a2" : ""}">${escapeHtml(initials(match.student.name))}</span><div class="cell-copy"><strong>${escapeHtml(match.student.name)}</strong><span>${escapeHtml(match.student.program)} · Class of ${escapeHtml(match.student.graduation)}</span></div></div><div class="skill-list">${match.matchedSkills.map(skill => `<span class="skill-chip">✓ ${escapeHtml(skill)}</span>`).join("")}</div><div class="explanation">Match explanation: ${match.matchedSkills.length} of ${match.job.skills.length} required skills align; ${match.graduationEligible ? "graduation year is eligible" : "graduation year needs review"}; ${match.locationMatch ? "location preference aligns" : "location preference may differ"}. ${missingText}</div><div class="recommendation-footer"><small>✓ Sharing consent recorded · ${escapeHtml(match.student.projects?.length ? `${match.student.projects.length} approved projects` : "skills & education only")}</small><button data-recommend="${escapeHtml(match.student.id)}:${escapeHtml(match.job.id)}">Share shortlist →</button></div></article>`;
    }).join("") : `<div class="empty-state">No consented matches found. Private student profiles are intentionally excluded from recruiter recommendations.</div>`;
  }

  function renderLogs() {
    const icon = { email: ["✉", "email"], match: ["⌕", "match"], company: ["♙", "company"], system: ["✳", "match"] };
    el("#recent-activity").innerHTML = state.logs.slice(0, 4).map(log => {
      const [symbol, className] = icon[log.kind] || icon.system;
      const action = log.kind === "email" ? `<strong>Job alert</strong> sent to <strong>${escapeHtml(log.recipient)}</strong>` : log.kind === "company" ? `<strong>Candidate recommendation</strong> shared with <strong>${escapeHtml(log.recipient)}</strong>` : `<strong>${escapeHtml(log.action)}</strong> · ${escapeHtml(log.details)}`;
      return `<div class="activity-item"><span class="activity-icon ${className}">${symbol}</span><div class="activity-copy"><p>${action}</p><small>${escapeHtml(log.time)} · ${escapeHtml(log.status)}</small></div></div>`;
    }).join("") || `<div class="no-results">No activity recorded yet.</div>`;
    el("#full-activity").innerHTML = state.logs.map(log => {
      const statusClass = log.status === "Delivered" ? "status-delivered" : log.status === "Skipped" ? "status-skipped" : "status-info";
      return `<tr><td><strong>${escapeHtml(log.action)}</strong></td><td>${escapeHtml(log.details)}</td><td>${escapeHtml(log.recipient)}</td><td><span class="status-pill ${statusClass}">● ${escapeHtml(log.status)}</span></td><td>${escapeHtml(log.time)}</td></tr>`;
    }).join("") || `<tr><td colspan="5" class="no-results">No activity recorded yet.</td></tr>`;
    el("#log-count").textContent = state.logs.length;
  }

  function renderStats() {
    const activeJobs = state.jobs.filter(job => !job.deadline || new Date(`${job.deadline}T23:59:59`) >= new Date()).length;
    const matches = state.jobs.reduce((total, job) => total + eligibleMatches(job).length, 0);
    el("#stat-jobs").textContent = 123 + activeJobs;
    el("#stat-matches").textContent = 336 + matches;
    el("#stat-alerts").textContent = 274 + state.logs.filter(log => log.kind === "email" && log.status === "Delivered").length;
    el("#stat-recommendations").textContent = 62 + state.logs.filter(log => log.kind === "company" && log.status === "Delivered").length;
    el("#nav-jobs-count").textContent = state.jobs.length + 7;
  }

  function renderAll() {
    el("#current-date").textContent = new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).toUpperCase();
    renderFreshMatches();
    renderJobRows("#new-opportunities", state.jobs, true);
    const query = (el("#job-search")?.value || "").toLowerCase().trim();
    const filter = el("#job-filter")?.value || "all";
    const filteredJobs = state.jobs.filter(job => {
      const matchesQuery = [job.title, job.company, job.location, ...job.skills].join(" ").toLowerCase().includes(query);
      return matchesQuery && (filter === "all" || (filter === "active" ? isJobActive(job) : isClosingSoon(job)));
    });
    renderJobRows("#all-opportunities", filteredJobs);
    renderStudents();
    renderRecommendations();
    renderLogs();
    renderStats();
    for (const key of ["discovery", "alerts", "sharing"]) {
      const checkbox = el(`#toggle-${key}`);
      if (checkbox) checkbox.checked = Boolean(state.automation[key]);
    }
  }

  function runMatching() {
    let alertsSent = 0;
    let recommendationsSent = 0;
    let skipped = 0;
    if (state.automation.alerts) {
      for (const job of state.jobs) {
        for (const match of eligibleMatches(job, { threshold: 55 })) {
          const key = `${job.id}:${match.student.id}`;
          if (!match.student.alerts || state.sentAlerts.includes(key)) continue;
          state.sentAlerts.push(key);
          alertsSent += 1;
          addLog("email", "Job alert simulated", `${job.title} · ${job.company} · ${match.score}% alignment`, match.student.name, "Delivered");
        }
      }
    }
    if (state.automation.sharing) {
      for (const job of state.jobs) {
        for (const match of eligibleMatches(job, { threshold: 55 })) {
          const key = `${job.id}:${match.student.id}`;
          if (!match.student.sharing) {
            if (match.score >= 55) skipped += 1;
            continue;
          }
          if (state.sentRecommendations.includes(key)) continue;
          state.sentRecommendations.push(key);
          recommendationsSent += 1;
          addLog("company", "Candidate recommendation simulated", `${job.title} · ${match.job?.company || job.company} · ${match.score}% alignment`, job.company, "Delivered");
        }
      }
    }
    addLog("system", "Matching run completed", `${alertsSent} student alerts · ${recommendationsSent} consented introductions${skipped ? ` · ${skipped} private profiles excluded` : ""}`, "Placement workflow", "Completed");
    save();
    renderAll();
    toast(`Matching complete · ${alertsSent} student alerts, ${recommendationsSent} consented introductions${skipped ? `, ${skipped} private profiles excluded` : ""}.`);
  }

  const viewNames = { overview: "Overview", opportunities: "Opportunities", students: "Students", recommendations: "Recommendations", activity: "Activity log", automations: "Automations", settings: "Settings" };
  function showView(view) {
    if (!viewNames[view]) return;
    els(".page-view").forEach(page => page.classList.toggle("active", page.id === `view-${view}`));
    els(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === view));
    el("#breadcrumb-current").textContent = viewNames[view];
    el("#sidebar").classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (view === "students") renderStudents();
    if (view === "recommendations") renderRecommendations();
  }

  function openDialog(id) { el(id).showModal(); }
  function closeDialog(button) { button.closest("dialog").close(); }

  document.addEventListener("click", event => {
    const viewButton = event.target.closest("[data-view]");
    if (viewButton) { showView(viewButton.dataset.view); return; }
    const closeButton = event.target.closest("[data-close-modal]");
    if (closeButton) { closeDialog(closeButton); return; }
    const recommendationButton = event.target.closest("[data-recommend]");
    if (recommendationButton) {
      const [studentId, jobId] = recommendationButton.dataset.recommend.split(":");
      const student = state.students.find(item => item.id === studentId);
      const job = state.jobs.find(item => item.id === jobId);
      if (!student || !job) { toast("This recommendation is no longer available."); return; }
      if (!state.automation.sharing || !student.sharing) { toast("This student has not consented to profile sharing."); return; }
      const key = `${job.id}:${student.id}`;
      if (state.sentRecommendations.includes(key)) { toast("This consented recommendation was already recorded."); return; }
      state.sentRecommendations.push(key);
      addLog("company", "Candidate recommendation simulated", `${job.title} · ${job.company} · approved skills, education & projects`, job.company, "Delivered");
      save(); renderAll(); toast(`Consent-approved recommendation recorded for ${job.company} (demo mode).`); return;
    }
    const matchButton = event.target.closest("[data-match]");
    if (matchButton) {
      const [studentId, jobId] = matchButton.dataset.match.split(":");
      const student = state.students.find(item => item.id === studentId);
      const job = state.jobs.find(item => item.id === jobId);
      if (student && job) {
        const match = scoreMatch(student, job);
        const missing = match.missing.length ? ` Skills to build: ${match.missing.join(", ")}.` : " All required skills are represented.";
        toast(`${student.name} ↔ ${job.title}: ${match.score}% alignment. ${match.matchedSkills.length}/${job.skills.length} skills match.${missing}`);
      }
    }
  });

  el("#mobile-menu").addEventListener("click", () => el("#sidebar").classList.toggle("open"));
  el("#workspace-switcher").addEventListener("click", () => toast("Northstar University is the only workspace available in this demo."));
  el("#user-profile").addEventListener("click", () => showView("settings"));
  el(".brand").addEventListener("click", event => { event.preventDefault(); showView("overview"); });
  el("#run-workflow").addEventListener("click", runMatching);
  el("#run-workflow-secondary").addEventListener("click", runMatching);
  el("#recommendation-refresh").addEventListener("click", runMatching);
  el("#add-job-button").addEventListener("click", () => openDialog("#job-modal"));
  el("#add-student-button").addEventListener("click", () => openDialog("#student-modal"));
  el("#job-search").addEventListener("input", renderAll);
  el("#job-filter").addEventListener("change", renderAll);
  el("#student-search").addEventListener("input", renderStudents);
  el("#student-consent-filter").addEventListener("change", renderStudents);
  el("#recommendation-search").addEventListener("input", renderRecommendations);
  el("#recommendation-filter").addEventListener("change", renderRecommendations);
  el("#insight-action").addEventListener("click", () => {
    const gaps = state.jobs.flatMap(job => eligibleMatches(job).flatMap(match => match.missing));
    const counts = gaps.reduce((result, skill) => { result[skill] = (result[skill] || 0) + 1; return result; }, {});
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    toast(top ? `${top[0]} is the most common skill gap in current matches (${top[1]} opportunities).` : "Current eligible matches cover all listed required skills.");
  });
  el("#notification-button").addEventListener("click", () => showView("activity"));

  for (const key of ["discovery", "alerts", "sharing"]) {
    el(`#toggle-${key}`).addEventListener("change", event => {
      state.automation[key] = event.target.checked;
      save();
      const names = { discovery: "Opportunity discovery", alerts: "Student job alerts", sharing: "Company recommendations" };
      addLog("system", `${names[key]} ${event.target.checked ? "enabled" : "paused"}`, "Automation settings updated", "Placement workflow", "Updated");
      save(); renderLogs();
      toast(`${names[key]} ${event.target.checked ? "enabled" : "paused"}.`);
    });
  }

  document.addEventListener("change", event => {
    const input = event.target.closest("[data-pref]");
    if (!input) return;
    const student = state.students.find(item => item.id === input.dataset.student);
    if (!student) return;
    student[input.dataset.pref] = input.checked;
    if (input.dataset.pref === "sharing" && !input.checked) {
      state.sentRecommendations = state.sentRecommendations.filter(key => !key.endsWith(`:${student.id}`));
      addLog("system", "Recruiter-sharing consent withdrawn", "Future profile sharing is disabled", student.name, "Updated");
    } else if (input.dataset.pref === "alerts" && !input.checked) {
      addLog("system", "Job-alert preference updated", "Future student job alerts are disabled", student.name, "Updated");
    } else {
      addLog("system", `${input.dataset.pref === "sharing" ? "Recruiter-sharing consent" : "Job-alert preference"} enabled`, "Student preference updated", student.name, "Updated");
    }
    save(); renderAll();
    toast(input.dataset.pref === "sharing" ? `Recruiter sharing ${input.checked ? "enabled with consent" : "withdrawn"} for ${student.name}.` : `Job alerts ${input.checked ? "enabled" : "paused"} for ${student.name}.`);
  });

  el("#job-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const company = String(form.get("company")).trim();
    const graduation = String(form.get("graduation")).split(",").map(year => Number(year.trim())).filter(year => Number.isInteger(year) && year > 2000);
    const job = {
      id: `custom-${Date.now()}`, title: String(form.get("title")).trim(), company,
      initials: initials(company), logo: ["logo-blue", "logo-orange", "logo-green", "logo-purple"][state.customJobCount % 4],
      location: String(form.get("location")).trim(), type: String(form.get("type")), skills: String(form.get("skills")).split(",").map(skill => skill.trim()).filter(Boolean),
      graduation, deadline: String(form.get("deadline")), url: safeUrl(String(form.get("url"))), source: "Manually verified", contact: "", created: "Just now"
    };
    if (job.url === "#") { toast("Please provide a valid official HTTPS application URL."); return; }
    if (!isJobActive(job)) { toast("This opportunity deadline has passed. Expired roles cannot be added."); return; }
    const duplicate = state.jobs.some(existing => existing.title.toLowerCase() === job.title.toLowerCase() && existing.company.toLowerCase() === job.company.toLowerCase());
    if (duplicate) { toast("This role already exists for that company. Duplicate opportunity skipped."); return; }
    state.customJobCount = (state.customJobCount || 0) + 1;
    state.jobs.unshift(job);
    addLog("system", "New opportunity added", `${job.title} · ${company} · verified HTTPS link`, "Placement workflow", "Added");
    event.currentTarget.closest("dialog").close();
    event.currentTarget.reset();
    save(); renderAll(); showView("opportunities"); runMatching();
  });

  el("#student-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name")).trim();
    const student = {
      id: `student-${Date.now()}`, name, email: String(form.get("email")).trim(), program: String(form.get("program")).trim(), graduation: Number(form.get("graduation")),
      skills: String(form.get("skills")).split(",").map(skill => skill.trim()).filter(Boolean),
      locations: String(form.get("locations")).split(",").map(location => location.trim()).filter(Boolean),
      alerts: form.get("alerts") === "on", sharing: form.get("sharing") === "on", projects: []
    };
    state.students.unshift(student);
    addLog("system", "Student profile added", `${student.program} · Class of ${student.graduation} · sharing ${student.sharing ? "consented" : "private"}`, name, "Added");
    event.currentTarget.closest("dialog").close();
    event.currentTarget.reset();
    save(); renderAll(); showView("students"); runMatching();
  });

  el("#export-activity").addEventListener("click", () => {
    const rows = [["Action", "Details", "Recipient", "Status", "Time"], ...state.logs.map(log => [log.action, log.details, log.recipient, log.status, log.time])];
    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "pathway-activity-log.csv"; link.click(); URL.revokeObjectURL(url);
    toast("Activity log exported as CSV.");
  });

  el("#global-search").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      const query = event.currentTarget.value.trim();
      if (!query) return;
      const student = state.students.find(item => [item.name, item.email, ...item.skills].join(" ").toLowerCase().includes(query.toLowerCase()));
      const job = state.jobs.find(item => [item.title, item.company, ...item.skills].join(" ").toLowerCase().includes(query.toLowerCase()));
      if (student) { showView("students"); el("#student-search").value = query; renderStudents(); }
      else if (job) { showView("opportunities"); el("#job-search").value = query; renderAll(); }
      else toast(`No students or opportunities found for “${query}”.`);
    }
  });
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); el("#global-search").focus(); }
    if (event.key === "Escape") el("#sidebar").classList.remove("open");
  });
  document.addEventListener("click", event => {
    if (event.target.tagName === "DIALOG") event.target.close();
  });

  renderAll();
})();
