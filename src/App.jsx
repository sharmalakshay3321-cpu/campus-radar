import { Navigate, Route, Routes } from "react-router-dom";
import GatherPage from "./features/gather/GatherPage";
import GatherCreatePage from "./features/gather/GatherCreatePage";
import GatherDetailPage from "./features/gather/GatherDetailPage";
import ProfilePage from "./features/profiles/ProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/gather" replace />} />
      <Route path="/gather" element={<GatherPage />} />
      <Route path="/gather/create" element={<GatherCreatePage />} />
      <Route path="/gather/:postId" element={<GatherDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/gather" replace />} />
    </Routes>
  );
}
