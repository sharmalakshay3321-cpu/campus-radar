
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import EventsPage from "./features/events/EventsPage";
import CreateEventPage from "./features/events/CreateEventPage";
import EventDetailsPage from "./features/events/EventDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Open the Events page by default */}
        <Route
          path="/"
          element={<Navigate to="/events" replace />}
        />

        {/* Events listing page */}
        <Route
          path="/events"
          element={<EventsPage />}
        />

        {/* Create a new event */}
        <Route
          path="/events/create"
          element={<CreateEventPage />}
        />

        {/* View an individual event */}
        <Route
          path="/events/:eventId"
          element={<EventDetailsPage />}
        />

        {/* Redirect unknown URLs */}
        <Route
          path="*"
          element={<Navigate to="/events" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
