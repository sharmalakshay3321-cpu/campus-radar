import avatar1 from "../../assets/a1.png";
import avatar2 from "../../assets/a2.png";
import avatar3 from "../../assets/a3.png";
import avatar4 from "../../assets/a4.png";
import avatar5 from "../../assets/a5.png";
import avatar6 from "../../assets/a6.png";
import avatar7 from "../../assets/a7.png";

export const AVATARS = [
  { id: "a1", name: "Avatar 1", src: avatar1 },
  { id: "a2", name: "Avatar 2", src: avatar2 },
  { id: "a3", name: "Avatar 3", src: avatar3 },
  { id: "a4", name: "Avatar 4", src: avatar4 },
  { id: "a5", name: "Avatar 5", src: avatar5 },
  { id: "a6", name: "Avatar 6", src: avatar6 },
  { id: "a7", name: "Avatar 7", src: avatar7 },
];

export const DEFAULT_AVATAR_ID = "a1";

export const PLACEHOLDER_AVATAR =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
      <rect width="120" height="120" rx="60" fill="#e8e9ed"/>
      <circle cx="60" cy="43" r="21" fill="#a3a7b3"/>
      <path d="M20 110c4-24 19-36 40-36s36 12 40 36" fill="#a3a7b3"/>
    </svg>
  `);

export function getAvatar(id) {
  return AVATARS.find((avatar) => avatar.id === id) || AVATARS[0];
}