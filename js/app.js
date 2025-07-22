// Firebase configuration
const firebaseConfig = {
  // Your actual Firebase configuration
  apiKey: "AIzaSyBwzNIvMzEAeEP8dBWnaZ-X2Q6PrBRHPJY",
  authDomain: "meda-dashboard-29b8a.firebaseapp.com",
  projectId: "meda-dashboard-29b8a",
  storageBucket: "meda-dashboard-29b8a.firebasestorage.app",
  messagingSenderId: "348327233249",
  appId: "1:348327233249:web:d13485a5ff146e709a19a0",
  measurementId: "G-SDZMEVNY1Z",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Generate MEDA ID
function generateMedaId() {
  const prefix = "MEDA";
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return prefix + randomNum;
}

// DOM Elements
const authScreens = document.getElementById("authScreens");
const signupScreen = document.getElementById("signupScreen");
const loginScreen = document.getElementById("loginScreen");
const forgotPasswordScreen = document.getElementById("forgotPasswordScreen");
const dashboard = document.getElementById("dashboard");
const loanModal = document.getElementById("loanModal");
const loanDetailModal = document.getElementById("loanDetailModal");

// MODIFIED: Added specific table body IDs for dynamic updates
const dashboardLoanTableBody = document.getElementById(
  "dashboardLoanTableBody"
);
// Make sure your HTML has <tbody id="dashboardLoanTableBody"> inside the dashboard's loan table

// Auth navigation (these are fine as they are purely UI display)
document.getElementById("showLogin").addEventListener("click", (e) => {
  e.preventDefault();
  signupScreen.style.display = "none";
  loginScreen.style.display = "flex";
});

document.getElementById("showSignup").addEventListener("click", (e) => {
  e.preventDefault();
  loginScreen.style.display = "none";
  signupScreen.style.display = "flex";
});

document.getElementById("showForgotPassword").addEventListener("click", (e) => {
  e.preventDefault();
  loginScreen.style.display = "none";
  forgotPasswordScreen.style.display = "flex";
});

document
  .getElementById("showLoginFromForgot")
  .addEventListener("click", (e) => {
    e.preventDefault();
    forgotPasswordScreen.style.display = "none";
    loginScreen.style.display = "flex";
  });

// Firebase Authentication
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fullName = document.getElementById("signupFullName").value;
  const email = document.getElementById("signupEmail").value;
  const phone = document.getElementById("signupPhone").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById(
    "signupConfirmPassword"
  ).value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;
    const medaId = generateMedaId();

    await db.collection("users").doc(user.uid).set({
      fullName,
      email,
      phone,
      medaId,
      program: "YOU-LEAP", // Default program
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    alert("Account created successfully! Your MEDA ID: " + medaId);
    // MODIFIED: Let onAuthStateChanged handle the screen transition after successful signup
    // signupScreen.style.display = "none";
    // loginScreen.style.display = "flex";
  } catch (error) {
    alert("Error: " + error.message);
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value; // This is email for Firebase Auth
  const password = document.getElementById("loginPassword").value;

  // MODIFIED: Simplified login to strictly use email for now
  // For MEDA ID login, you'd typically use a Cloud Function to look up the email first
  // and then perform client-side signInWithEmailAndPassword with that email.
  // For direct client-side Firebase Auth, it must be an email.
  let emailToLogin = username;
  if (!username.includes("@")) {
    // Basic check if it's likely not an email
    alert("Please log in with your email address for now.");
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(emailToLogin, password);
    // MODIFIED: Let onAuthStateChanged handle the screen transition
    // authScreens.style.display = "none";
    // dashboard.style.display = "flex";
  } catch (error) {
    alert("Error: " + error.message);
  }
});

document
  .getElementById("forgotPasswordForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("forgotEmail").value; // Assuming this is an email now

    // MODIFIED: Removed MEDA ID lookup for client-side password reset for simplicity.
    // Firebase Auth's sendPasswordResetEmail strictly takes an email.
    if (!emailInput.includes("@")) {
      alert("Please enter your email address to reset your password.");
      return;
    }

    try {
      await auth.sendPasswordResetEmail(emailInput);
      alert("Password reset link sent to your email (if account exists).");
      forgotPasswordScreen.style.display = "none";
      loginScreen.style.display = "flex";
    } catch (error) {
      alert("Error: " + error.message);
    }
  });

// NEW: Variable to store the current user's data fetched from Firestore
let currentFirestoreUserData = null;
// NEW: Variable to store the unsubscribe function for the real-time loan listener
let unsubscribeLoansListener = null;

// Auth state observer - CENTRALIZED UI MANAGEMENT
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // User is signed in. Fetch user data and show dashboard.
    console.log("User logged in:", user.uid);
    authScreens.style.display = "none";
    dashboard.style.display = "flex";

    try {
      // MODIFIED: Using onSnapshot for user data as well, for real-time profile updates
      // This listener will automatically update user info if profile data changes in Firestore
      db.collection("users")
        .doc(user.uid)
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              currentFirestoreUserData = doc.data();
              console.log(
                "Current Firestore User Data:",
                currentFirestoreUserData
              );

              // Populate user data in dashboard
              document.getElementById("userName").textContent =
                currentFirestoreUserData.fullName || "MEDA User";
              document.getElementById("medaIdDisplay").textContent =
                currentFirestoreUserData.medaId || "N/A";
              document.getElementById("welcomeUserName").textContent = (
                currentFirestoreUserData.fullName || "MEDA User"
              ).split(" ")[0];
              const avatarInitials = (currentFirestoreUserData.fullName || "MU")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2);
              document.getElementById("userAvatar").textContent =
                avatarInitials;
              document.getElementById("headerUserAvatar").textContent =
                avatarInitials;

              // Trigger loading of dashboard content and loan data
              // This ensures content is ready after user data is loaded
              loadDashboardContent(user.uid); // This sets up dashboard structure and triggers loan listener
            } else {
              console.warn(
                "User data not found in Firestore for UID:",
                user.uid
              );
              currentFirestoreUserData = null;
              // Optionally force logout if user data is missing
              auth.signOut();
            }
          },
          (error) => {
            console.error("Error fetching real-time user data:", error);
            alert("Error loading user profile: " + error.message);
          }
        );
    } catch (error) {
      console.error("Error setting up user data listener:", error);
      alert("Error preparing dashboard: " + error.message);
    }
  } else {
    // User is signed out. Show auth screens.
    console.log("User logged out.");
    dashboard.style.display = "none";
    authScreens.style.display = "flex";
    loginScreen.style.display = "flex"; // Default to login
    signupScreen.style.display = "none";
    forgotPasswordScreen.style.display = "none";

    currentFirestoreUserData = null; // Clear user data
    // NEW: Stop listening to loan updates if user logs out
    if (unsubscribeLoansListener) {
      unsubscribeLoansListener();
      unsubscribeLoansListener = null;
    }
    // Clear dashboard content if user logs out
    document.getElementById("dashboardContent").innerHTML = "";
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  await auth.signOut(); // onAuthStateChanged will handle UI transition
});

document.getElementById("menuLogout").addEventListener("click", async (e) => {
  e.preventDefault();
  await auth.signOut(); // onAuthStateChanged will handle UI transition
});

// NEW: Function to dynamically load dashboard sections
async function loadDashboardContent(userId) {
  const content = document.getElementById("dashboardContent");
  const header = document.querySelector(".header h2");
  header.textContent = "Dashboard";

  // MODIFIED: Dynamically populate stat card IDs for easy update
  content.innerHTML = `
    <div class="card welcome-card">
        <div class="card-header">
            <h3>Welcome back, <span id="welcomeUserName">${
              currentFirestoreUserData?.fullName?.split(" ")[0] || "User"
            }</span>!</h3>
        </div>
        <p>You're enrolled in the <strong>${
          currentFirestoreUserData?.program || "N/A"
        }</strong> program. Track your loan applications and program progress below.</p>
    </div>
    <div class="stats-grid">
        <div class="stat-card">
            <h4>Active Loans</h4>
            <p id="activeLoansCount">0</p>
        </div>
        <div class="stat-card success">
            <h4>Approved Loans</h4>
            <p id="approvedLoansCount">0</p>
        </div>
        <div class="stat-card">
            <h4>Total Applications</h4>
            <p id="totalApplicationsCount">0</p>
        </div>
        <div class="stat-card warning">
            <h4>Pending Applications</h4>
            <p id="pendingApplicationsCount">0</p>
        </div>
    </div>
    <div class="card">
        <div class="card-header">
            <h3>Recent Loan Applications</h3>
            <button class="btn btn-accent" id="newLoanBtn">New Application</button>
        </div>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Loan ID</th>
                        <th>Amount</th>
                        <th>Date Applied</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="dashboardLoanTableBody">
                    <!-- Loans will be dynamically loaded here by real-time listener -->
                    <tr><td colspan="5">Loading loans...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="card">
        <div class="card-header">
            <h3>Program Progress</h3>
        </div>
        <p>You are currently at <strong>Phase 2</strong> of the YOU-LEAP program. Next training session: <strong>Dec 5, 2025</strong>.</p>
        <div style="margin-top: 20px; height: 10px; background-color: #eee; border-radius: 5px;">
            <div style="width: 60%; height: 100%; background-color: var(--primary-color); border-radius: 5px;"></div>
        </div>
    </div>
  `;

  // Re-attach event listener for the 'New Application' button now that it's in the DOM
  document.getElementById("newLoanBtn").addEventListener("click", () => {
    loanModal.classList.add("active");
  });

  // NEW: Start listening for real-time loan updates
  listenForUserLoanRequests(userId);
}

// NEW: Real-time listener for user's loan requests
function listenForUserLoanRequests(userId) {
  // If there's an active listener, unsubscribe it first to prevent duplicates
  if (unsubscribeLoansListener) {
    unsubscribeLoansListener();
  }

  unsubscribeLoansListener = db
    .collection("loans") // Ensure your collection is named 'loans'
    .where("userId", "==", userId)
    .orderBy("requestDate", "desc") // Assuming 'requestDate' field exists
    .onSnapshot(
      (snapshot) => {
        const loans = [];
        let pendingCount = 0;
        let approvedCount = 0;
        let disbursedCount = 0;

        snapshot.forEach((doc) => {
          const loan = { id: doc.id, ...doc.data() };
          loans.push(loan);

          // Update counts for stat cards
          if (loan.status === "pending") pendingCount++;
          else if (loan.status === "approved") approvedCount++;
          else if (loan.status === "disbursed") disbursedCount++;
        });

        // Update dashboard stat counts
        document.getElementById("activeLoansCount").textContent =
          disbursedCount;
        document.getElementById("approvedLoansCount").textContent =
          approvedCount;
        document.getElementById("totalApplicationsCount").textContent =
          loans.length;
        document.getElementById("pendingApplicationsCount").textContent =
          pendingCount;

        // Populate loan table
        const tableBody = document.getElementById("dashboardLoanTableBody");
        if (tableBody) {
          // Check if the table body exists (it should after loadDashboardContent)
          tableBody.innerHTML = ""; // Clear existing rows
          if (loans.length === 0) {
            tableBody.innerHTML =
              '<tr><td colspan="5">No loan applications found.</td></tr>';
          } else {
            loans.forEach((loan) => {
              const row = document.createElement("tr");
              const statusBadgeClass = `status-${loan.status}`;
              const displayStatus =
                loan.status.charAt(0).toUpperCase() + loan.status.slice(1);
              // Convert Firestore Timestamp to readable date
              const date =
                loan.requestDate && loan.requestDate.toDate
                  ? new Date(loan.requestDate.toDate()).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" }
                    )
                  : "N/A";

              row.innerHTML = `
                    <td>${loan.id}</td>
                    <td>₦${
                      loan.amount ? loan.amount.toLocaleString() : "N/A"
                    }</td>
                    <td>${date}</td>
                    <td><span class="status-badge ${statusBadgeClass}">${displayStatus}</span></td>
                    <td><a href="#" class="view-loan" data-loan-id="${
                      loan.id
                    }">View</a></td>
                `;
              tableBody.appendChild(row);
            });
          }
          // Re-attach view loan listeners after table content is updated
          attachLoanViewListeners();
        } else {
          console.warn("Dashboard loan table body not found.");
        }
      },
      (error) => {
        console.error("Error fetching real-time loan requests:", error);
        const tableBody = document.getElementById("dashboardLoanTableBody");
        if (tableBody) {
          tableBody.innerHTML =
            '<tr><td colspan="5">Error loading loans.</td></tr>';
        }
      }
    );
}

// Loan application modal (existing UI logic, Firebase submission below)
document.getElementById("newLoanBtn")?.addEventListener("click", () => {
  loanModal.classList.add("active");
});

document.getElementById("closeLoanModal").addEventListener("click", () => {
  loanModal.classList.remove("active");
});

document.getElementById("cancelLoanBtn").addEventListener("click", () => {
  loanModal.classList.remove("active");
});

// MODIFIED: Submit loan application to Firestore
document.getElementById("submitLoanBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to submit a loan request.");
    return;
  }

  const loanAmount = parseInt(document.getElementById("loanAmount").value);
  const loanPurpose = document.getElementById("loanPurpose").value;
  const loanDescription = document.getElementById("loanDescription").value;
  const repaymentPlan = document.getElementById("repaymentPlan").value;
  const loanTermsAccepted = document.getElementById("loanTerms").checked; // NEW: Check terms accepted

  if (!loanTermsAccepted) {
    // NEW: Add validation for terms
    alert("You must agree to the loan terms and conditions.");
    return;
  }
  if (!loanAmount || !loanPurpose || !loanDescription || !repaymentPlan) {
    alert("Please fill in all loan application fields.");
    return;
  }

  try {
    const loanData = {
      userId: user.uid,
      amount: loanAmount,
      requestDate: firebase.firestore.FieldValue.serverTimestamp(), // Use requestDate for consistent naming
      status: "pending",
      purpose: loanPurpose,
      description: loanDescription,
      repaymentPlan: repaymentPlan,
    };

    const docRef = await db.collection("loans").add(loanData); // Ensure your collection is named 'loans'
    alert("Loan application submitted successfully! Loan ID: " + docRef.id);
    loanModal.classList.remove("active");
    document.getElementById("loanApplicationForm").reset(); // Clear form
    // The real-time listener (listenForUserLoanRequests) will automatically update the dashboard
  } catch (error) {
    console.error("Error submitting loan application:", error);
    alert("Error submitting loan application: " + error.message);
  }
});

// View loan details - RE-IMPLEMENTED to fetch from currently displayed loans (not separate query)
function attachLoanViewListeners() {
  document.querySelectorAll(".view-loan").forEach((link) => {
    // MODIFIED: Remove existing listener to prevent duplicates
    link.removeEventListener("click", handleLoanViewClick);
    link.addEventListener("click", handleLoanViewClick);
  });
}

// NEW: Handler for view loan clicks
async function handleLoanViewClick(e) {
  e.preventDefault();
  const loanId = e.target.dataset.loanId; // Get loan ID from data attribute

  try {
    // Fetch the specific loan from Firestore directly for details, as it might contain more info
    const loanDoc = await db.collection("loans").doc(loanId).get();
    if (!loanDoc.exists) {
      alert("Loan details not found.");
      return;
    }
    const loan = { id: loanDoc.id, ...loanDoc.data() };

    let statusClass = "";
    let statusText = "";
    let extraInfo = "";

    const requestDateFormatted =
      loan.requestDate && loan.requestDate.toDate
        ? new Date(loan.requestDate.toDate()).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "N/A";

    switch (loan.status) {
      case "pending":
        statusClass = "status-pending";
        statusText = "Pending Review";
        extraInfo =
          "<p>Your application is currently being reviewed by our team. You will be notified once a decision is made.</p>";
        break;
      case "approved":
        statusClass = "status-approved";
        statusText = "Approved";
        const approvalDate =
          loan.approvalDate && loan.approvalDate.toDate
            ? new Date(loan.approvalDate.toDate()).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "N/A";
        extraInfo = `
                    <p>Your loan was approved on <strong>${approvalDate}</strong>.</p>
                    <p>Disbursement is being processed and you will receive funds within 3-5 business days.</p>
                `;
        break;
      case "disbursed":
        statusClass = "status-disbursed";
        statusText = "Disbursed";
        const disbursementDate =
          loan.disbursementDate && loan.disbursementDate.toDate
            ? new Date(loan.disbursementDate.toDate()).toLocaleDateString(
                "en-GB",
                { day: "numeric", month: "short", year: "numeric" }
              )
            : "N/A";
        extraInfo = `
                    <p>Your loan was disbursed on <strong>${disbursementDate}</strong>.</p>
                    <p>Funds have been successfully transferred to your account.</p>
                `;
        break;
      default:
        statusClass = "status-pending";
        statusText = "Unknown Status";
        break;
    }

    const detailContent = `
            <h4>Loan ID: ${loan.id}</h4>
            <p><strong>Amount:</strong> ₦${
              loan.amount ? loan.amount.toLocaleString() : "N/A"
            }</p>
            <p><strong>Purpose:</strong> ${loan.purpose}</p>
            <p><strong>Description:</strong> ${loan.description || "N/A"}</p>
            <p><strong>Repayment Plan:</strong> ${loan.repaymentPlan}</p>
            <p><strong>Application Date:</strong> ${requestDateFormatted}</p>
            <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${statusText}</span></p>
            ${extraInfo}
        `;

    document.getElementById("loanDetailContent").innerHTML = detailContent;
    loanDetailModal.classList.add("active");
  } catch (error) {
    console.error("Error loading loan details:", error);
    alert("Could not load loan details: " + error.message);
  }
}

document
  .getElementById("closeLoanDetailModal")
  .addEventListener("click", () => {
    loanDetailModal.classList.remove("active");
  });

document.getElementById("closeDetailBtn").addEventListener("click", () => {
  loanDetailModal.classList.remove("active");
});

// Sidebar navigation - MODIFIED to use currentFirestoreUserData and real-time loans
document.querySelectorAll(".sidebar-menu a").forEach((link) => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();
    document
      .querySelectorAll(".sidebar-menu a")
      .forEach((a) => a.classList.remove("active"));
    link.classList.add("active");

    const content = document.getElementById("dashboardContent");
    const header = document.querySelector(".header h2");
    const user = auth.currentUser;

    if (!user || !currentFirestoreUserData) {
      console.warn(
        "User not logged in or user data not loaded for sidebar navigation."
      );
      return;
    }

    try {
      if (link.id === "menuLoans") {
        header.textContent = "Loan Applications";
        // MODIFIED: Setup the static HTML structure for loans page table.
        // The listenForUserLoanRequests will populate the tbody in real-time.
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>My Loan Applications</h3>
                    <button class="btn btn-accent" id="newLoanBtn">New Application</button>
                </div>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Loan ID</th>
                                <th>Amount</th>
                                <th>Date Applied</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="dashboardLoanTableBody">
                            <!-- Loans will be dynamically loaded here by real-time listener -->
                            <tr><td colspan="5">Loading loans...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        // Re-attach new loan button listener for this page
        document.getElementById("newLoanBtn").addEventListener("click", () => {
          loanModal.classList.add("active");
        });
        // Ensure the real-time listener is active for this view
        listenForUserLoanRequests(user.uid);
      } else if (link.id === "menuPrograms") {
        header.textContent = "My Programs";
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Program Progress</h3>
                </div>
                <p>You are currently at <strong>Phase 2</strong> of the YOU-LEAP program. Next training session: <strong>Dec 5, 2025</strong>.</p>
                <div style="margin-top: 20px; height: 10px; background-color: #eee; border-radius: 5px;">
                    <div style="width: 60%; height: 100%; background-color: var(--primary-color); border-radius: 5px;"></div>
                </div>
            </div>
        `;
        // NEW: Stop loan listener if navigating away from loans view
        if (unsubscribeLoansListener) {
          unsubscribeLoansListener();
          unsubscribeLoansListener = null;
        }
      } else if (link.id === "menuProfile") {
        header.textContent = "Profile";
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>My Profile</h3>
                </div>
                <p><strong>Full Name:</strong> ${currentFirestoreUserData.fullName}</p>
                <p><strong>Email:</strong> ${currentFirestoreUserData.email}</p>
                <p><strong>Phone:</strong> ${currentFirestoreUserData.phone}</p>
                <p><strong>MEDA ID:</strong> ${currentFirestoreUserData.medaId}</p>
                <p><strong>Program:</strong> ${currentFirestoreUserData.program}</p>
            </div>
        `;
        // NEW: Stop loan listener if navigating away from loans view
        if (unsubscribeLoansListener) {
          unsubscribeLoansListener();
          unsubscribeLoansListener = null;
        }
      } else if (link.id === "menuSupport") {
        header.textContent = "Support";
        content.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Contact Support</h3>
                </div>
                <p>For any inquiries, please contact our support team at:</p>
                <p><strong>Email:</strong> support@meda.org</p>
                <p><strong>Phone:</strong> +234 123 456 7890</p>
                <p><strong>Working Hours:</strong> Mon-Fri, 9 AM - 5 PM</p>
            </div>
        `;
        // NEW: Stop loan listener if navigating away from loans view
        if (unsubscribeLoansListener) {
          unsubscribeLoansListener();
          unsubscribeLoansListener = null;
        }
      } else {
        // Default: Dashboard
        loadDashboardContent(user.uid); // This re-renders dashboard and starts loan listener
      }
    } catch (error) {
      console.error("Error loading content:", error);
      alert("Error loading content: " + error.message);
    }
  });
});
