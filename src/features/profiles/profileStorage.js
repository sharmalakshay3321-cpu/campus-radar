const CURRENT_USER_KEY = "campusRadar_currentUser";
const USERS_KEY = "campusRadar_users";

const CONTENT_TYPES = {
  event: { key: "campusRadar_events", label: "Event" },
  crewCall: { key: "campusRadar_crewCalls", label: "Crew Call" },
  gatherPost: { key: "campusRadar_gatherPosts", label: "Gather Call" },
};

function readStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function toList(value) {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function normalizeProfile(user = {}) {
  return {
    ...user,
    id: user.id ?? "",
    userType: user.userType ?? "student",
    name: user.name ?? "",
    email: user.email ?? "",
    bio: user.bio ?? "",
    course: user.course ?? "",
    branch: user.branch ?? "",
    year: user.year ?? "",
    semester: user.semester ?? "",
    skills: toList(user.skills),
    interests: toList(user.interests),
    avatarId: user.avatarId ?? "a1",
  };
}

export function getCurrentUser() {
  return readStorage(CURRENT_USER_KEY, null);
}

export function saveCurrentUser(profile) {
  const currentUser = getCurrentUser();

  if (!currentUser) return false;

  const updatedUser = {
    ...currentUser,
    ...profile,
    id: currentUser.id,
    userType: currentUser.userType,
  };

  // Never save a password through the profile editor.
  delete updatedUser.password;

  writeStorage(CURRENT_USER_KEY, updatedUser);

  const users = readStorage(USERS_KEY, []);

  if (Array.isArray(users)) {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id
        ? { ...user, ...updatedUser }
        : user
    );

    writeStorage(USERS_KEY, updatedUsers);
  }

  return true;
}

export function getMyPosts(userId) {
  if (!userId) return [];

  const posts = [];

  Object.entries(CONTENT_TYPES).forEach(([type, config]) => {
    const items = readStorage(config.key, []);

    if (!Array.isArray(items)) return;

    items.forEach((item) => {
      // Supports both the older and newer ownership field names.
      const creatorId = item.createdById ?? item.createdBy;

      if (String(creatorId) === String(userId)) {
        posts.push({
          type,
          id: item.id,
          data: item,
        });
      }
    });
  });

  return posts;
}

function getCollectionItems(storageKey, userId) {
  const collection = readStorage(storageKey, []);

  if (!Array.isArray(collection)) return [];

  const results = [];

  collection.forEach((entry) => {
    if (String(entry.userId) !== String(userId)) return;

    const type = entry.itemType;
    const config = CONTENT_TYPES[type];

    if (!config) return;

    const originalItems = readStorage(config.key, []);

    const originalItem = originalItems.find(
      (item) => String(item.id) === String(entry.itemId)
    );

    if (originalItem) {
      results.push({
        type,
        id: originalItem.id,
        data: originalItem,
      });
    }
  });

  return results;
}

export function getSavedItems(userId) {
  if (!userId) return [];

  return getCollectionItems("campusRadar_savedItems", userId);
}

export function getArchivedItems(userId) {
  if (!userId) return [];

  return getCollectionItems("campusRadar_archivedItems", userId);
}

export { CONTENT_TYPES };