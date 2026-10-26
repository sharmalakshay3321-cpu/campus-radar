export const GATHER_STORAGE_KEY = "campusRadar_gatherPosts";
export const SAVED_STORAGE_KEY = "campusRadar_savedItems";
export const CURRENT_USER_KEY = "campusRadar_currentUser";

export function readArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
export function readCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
    return user && typeof user === "object" ? user : null;
  } catch { return null; }
}
export function getIdentity() {
  const user = readCurrentUser();
  if (!user?.id) return { id: "guest-session", type: "student", name: "Campus member", initials: "CM" };
  const name = user.name || user.clubName || user.organizationName || "Campus member";
  return { id: String(user.id), type: user.userType === "club" ? "club" : "student", name, initials: name.split(/\s+/).slice(0,2).map((s) => s[0]).join("").toUpperCase() };
}
export function getPosts() {
  return readArray(GATHER_STORAGE_KEY).filter((p) => p && typeof p === "object" && p.id && p.type === "gatherPost");
}
export function savePosts(posts) {
  try { localStorage.setItem(GATHER_STORAGE_KEY, JSON.stringify(posts)); return true; }
  catch { return false; }
}
export function savedItems() { return readArray(SAVED_STORAGE_KEY); }
export function isSaved(postId, userId) {
  return savedItems().some((x) => x.itemType === "gatherPost" && String(x.itemId) === String(postId) && String(x.userId) === String(userId));
}
export function toggleSaved(postId, userId) {
  const items = savedItems();
  const found = items.some((x) => x && x.itemType === "gatherPost" && String(x.itemId) === String(postId) && String(x.userId) === String(userId));
  const next = items.filter((x) => !x || !(x.itemType === "gatherPost" && String(x.itemId) === String(postId) && String(x.userId) === String(userId)));
  if (!found) next.push({ id: `saved-${postId}-${userId}`, userId, itemType: "gatherPost", itemId: postId, savedAt: new Date().toISOString() });
  try { localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next)); return !found; } catch { return found; }
}
export function updatePost(postId, updater) {
  const posts = getPosts();
  const index = posts.findIndex((p) => String(p.id) === String(postId));
  if (index < 0) return { ok: false, posts };
  const next = [...posts];
  next[index] = updater(posts[index]);
  return { ok: savePosts(next), posts: next };
}
