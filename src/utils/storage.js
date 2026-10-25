// ========================================
// CAMPUS RADAR - SHARED STORAGE UTILITIES
// ========================================

// Shared localStorage keys
export const STORAGE_KEYS = {
  USERS: "campusRadar_users",
  CLUBS: "campusRadar_clubs",
  CURRENT_USER: "campusRadar_currentUser",
  EVENTS: "campusRadar_events",
  CREW_CALLS: "campusRadar_crewCalls",
  APPLICATIONS: "campusRadar_applications",
  GATHER_POSTS: "campusRadar_gatherPosts",
  SAVED_ITEMS: "campusRadar_savedItems",
  ARCHIVED_ITEMS: "campusRadar_archivedItems",
  NOTIFICATIONS: "campusRadar_notifications",
};


// ========================================
// READ DATA
// ========================================

// Read an array from localStorage
export function getStorageArray(key) {
  try {
    const data = localStorage.getItem(key);

    if (!data) {
      return [];
    }

    const parsedData = JSON.parse(data);

    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
}


// Read the current signed-in account
export function getCurrentUser() {
  try {
    const data = localStorage.getItem(
      STORAGE_KEYS.CURRENT_USER
    );

    if (!data) {
      return null;
    }

    const user = JSON.parse(data);

    if (
      !user ||
      !["student", "club"].includes(user.userType)
    ) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error reading current user:", error);
    return null;
  }
}


// ========================================
// WRITE DATA
// ========================================

// Save an array to localStorage
export function setStorageArray(key, data) {
  if (!Array.isArray(data)) {
    throw new Error("Storage data must be an array.");
  }

  localStorage.setItem(key, JSON.stringify(data));
}


// Save the current signed-in account
// Never put the password in CURRENT_USER.
export function setCurrentUser(user) {
  if (
    !user ||
    !["student", "club"].includes(user.userType)
  ) {
    throw new Error("Invalid Campus Radar account.");
  }

  const { password, ...safeUser } = user;

  localStorage.setItem(
    STORAGE_KEYS.CURRENT_USER,
    JSON.stringify(safeUser)
  );
}


// ========================================
// ACCOUNT REGISTRATION
// ========================================

// Register a student account
export function registerStudent(student) {
  const students = getStorageArray(STORAGE_KEYS.USERS);

  const name = student.name?.trim();
  const email = student.email?.trim().toLowerCase();
  const password = student.password;

  // Validate required fields
  if (!name || !email || !password) {
    return {
      success: false,
      message: "Please provide your name, email, and password.",
    };
  }

  // Check whether the email is already registered
  const emailExists = students.some(
    (user) =>
      user.email?.trim().toLowerCase() === email
  );

  if (emailExists) {
    return {
      success: false,
      message: "An account with this email already exists.",
    };
  }

  // Create the student account
  const newStudent = {
    id: `user-${crypto.randomUUID()}`,
    userType: "student",
    name,
    email,
    password,
    bio: "",
    skills: [],
    interests: [],
  };

  students.push(newStudent);

  setStorageArray(STORAGE_KEYS.USERS, students);

  return {
    success: true,
    message: "Student account created successfully.",
    user: {
      id: newStudent.id,
      userType: newStudent.userType,
      name: newStudent.name,
      email: newStudent.email,
      bio: newStudent.bio,
      skills: newStudent.skills,
      interests: newStudent.interests,
    },
  };
}


// Register a club account
export function registerClub(club) {
  const clubs = getStorageArray(STORAGE_KEYS.CLUBS);

  const clubName = club.clubName?.trim();
  const email = club.email?.trim().toLowerCase();
  const password = club.password;

  // Validate required fields
  if (!clubName || !email || !password) {
    return {
      success: false,
      message: "Please provide the club name, email, and password.",
    };
  }

  // Check whether the email is already registered
  const emailExists = clubs.some(
    (existingClub) =>
      existingClub.email?.trim().toLowerCase() === email
  );

  if (emailExists) {
    return {
      success: false,
      message: "A club account with this email already exists.",
    };
  }

  // Create the club account
  const newClub = {
    id: `club-${crypto.randomUUID()}`,
    userType: "club",
    clubName,
    email,
    password,
    category: club.category?.trim() || "",
    description: club.description?.trim() || "",
  };

  clubs.push(newClub);

  setStorageArray(STORAGE_KEYS.CLUBS, clubs);

  return {
    success: true,
    message: "Club account created successfully.",
    user: {
      id: newClub.id,
      userType: newClub.userType,
      clubName: newClub.clubName,
      email: newClub.email,
      category: newClub.category,
      description: newClub.description,
    },
  };
}


// ========================================
// FIND ACCOUNTS BY EMAIL
// ========================================

// Find an existing student account by email
export function findStudentByEmail(email) {
  if (!email?.trim()) {
    return null;
  }

  const students = getStorageArray(STORAGE_KEYS.USERS);

  return (
    students.find(
      (student) =>
        student.email?.trim().toLowerCase() ===
        email.trim().toLowerCase()
    ) || null
  );
}


// Find an existing club account by email
export function findClubByEmail(email) {
  if (!email?.trim()) {
    return null;
  }

  const clubs = getStorageArray(STORAGE_KEYS.CLUBS);

  return (
    clubs.find(
      (club) =>
        club.email?.trim().toLowerCase() ===
        email.trim().toLowerCase()
    ) || null
  );
}


// ========================================
// LOGIN
// ========================================

// Sign in a student using email and password
export function loginStudent(email, password) {
  const student = findStudentByEmail(email);

  if (!student) {
    return {
      success: false,
      message: "No student account found with this email.",
    };
  }

  if (student.password !== password) {
    return {
      success: false,
      message: "Incorrect password. Please try again.",
    };
  }

  loginUser(student);

  return {
    success: true,
    message: "Student login successful.",
    user: {
      id: student.id,
      userType: student.userType,
      name: student.name,
      email: student.email,
      bio: student.bio,
      skills: student.skills,
      interests: student.interests,
    },
  };
}


// Sign in a club using email and password
export function loginClub(email, password) {
  const club = findClubByEmail(email);

  if (!club) {
    return {
      success: false,
      message: "No club account found with this email.",
    };
  }

  if (club.password !== password) {
    return {
      success: false,
      message: "Incorrect password. Please try again.",
    };
  }

  loginUser(club);

  return {
    success: true,
    message: "Club login successful.",
    user: {
      id: club.id,
      userType: club.userType,
      clubName: club.clubName,
      email: club.email,
      category: club.category,
      description: club.description,
    },
  };
}


// Sign in an existing account
export function loginUser(user) {
  setCurrentUser(user);

  return user;
}


// ========================================
// LOGOUT
// ========================================

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}