import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./GatherPage.css";
import { getIdentity, toggleSaved } from "./gatherStorage";
import Sidebar from "../dashboard/Sidebar";
import gatherBanner from "../../assets/gather-banner.png";

const STORAGE_KEY = "campusRadar_gatherPosts";

const samplePosts = [
  {
    id: "demo-discussion-1",
    type: "gatherPost",
    postType: "discussion",
    title: "Where can we find good DBMS notes?",
    content: "Looking for concise notes and practice questions before the next test. Any recommendations?",
    createdById: "student-1",
    createdByType: "student",
    authorName: "Aarav Sharma",
    authorInitials: "AS",
    category: "Academics",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    comments: 8,
    reactions: 12,
  },
  {
    id: "demo-pitch-1",
    type: "gatherPost",
    postType: "pitch",
    title: "Create a late-night exam study zone",
    content: "A proposal to keep a quiet, well-lit study space open later during exam weeks.",
    createdById: "student-2",
    createdByType: "student",
    authorName: "Mehak Kaur",
    authorInitials: "MK",
    category: "Campus Life",
    status: "Gathering support",
    supporters: ["student-3", "student-4", "student-5", "student-6", "student-7", "student-8"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    comments: 24,
    reactions: 0,
  },
  {
    id: "demo-poll-1",
    type: "gatherPost",
    postType: "poll",
    title: "Which workshop should we host next?",
    content: "Help the community choose a topic for the next student workshop.",
    createdById: "club-1",
    createdByType: "club",
    authorName: "Coding Club",
    authorInitials: "CC",
    category: "Clubs",
    options: ["Web Development", "Artificial Intelligence", "Cybersecurity"],
    votes: { "Web Development": 42, "Artificial Intelligence": 57, Cybersecurity: 31 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    comments: 13,
    reactions: 0,
  },
  {
    id: "demo-discussion-2",
    type: "gatherPost",
    postType: "discussion",
    title: "Anyone joining the robotics meetup?",
    content: "I’m planning to go this Friday. Would be great to meet other people interested in robotics.",
    createdById: "student-3",
    createdByType: "student",
    authorName: "Rohan Verma",
    authorInitials: "RV",
    category: "Clubs",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    comments: 6,
    reactions: 19,
  },
];

const typeLabels = {
  all: "Everything",
  discussion: "Discussion",
  pitch: "Pitch",
  poll: "Poll",
};

function readPosts() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(stored)) return samplePosts;
    const valid = stored.filter((post) => post && typeof post === "object" && post.id && post.type === "gatherPost");
    // Keep demo examples visible while allowing real posts to be added.
    return [...valid, ...samplePosts.filter((sample) => !valid.some((p) => p.id === sample.id))];
  } catch {
    return samplePosts;
  }
}

function timeAgo(value) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function PostIcon({ type }) {
  if (type === "pitch") return <span className="gather-page__type-icon gather-page__type-icon--pitch">✳</span>;
  if (type === "poll") return <span className="gather-page__type-icon gather-page__type-icon--poll">▥</span>;
  return <span className="gather-page__type-icon gather-page__type-icon--discussion">↗</span>;
}

function PostCard({ post, saved, onToggleSave, onVote }) {
  const postType = post.postType || "discussion";
  const options = Array.isArray(post.options) ? post.options : [];
  const votes = post.votes || {};
  const totalVotes = Object.values(votes).reduce((sum, count) => sum + Number(count || 0), 0);

  return (
    <article className={`gather-page__post gather-page__post--${postType}`}>
      <div className="gather-page__post-topline">
        <div className="gather-page__author">
          <div className={`gather-page__avatar ${post.createdByType === "club" ? "gather-page__avatar--club" : ""}`}>
            {post.authorInitials || post.authorName?.slice(0, 2).toUpperCase() || "CR"}
          </div>
          <div>
            <div className="gather-page__author-name">
              {post.authorName || (post.createdByType === "club" ? "Campus Club" : "Campus Radar student")}
              {post.createdByType === "club" && <span className="gather-page__official">Club</span>}
            </div>
            <div className="gather-page__meta">{timeAgo(post.createdAt || new Date().toISOString())} <span>·</span> {post.category || "Campus Life"}</div>
          </div>
        </div>
        <span className={`gather-page__type-pill gather-page__type-pill--${postType}`}>
          <PostIcon type={postType} />
          {typeLabels[postType] || "Discussion"}
        </span>
      </div>

      <Link className="gather-page__post-title-link" to={`/gather/${post.id}`}>
        <h2 className="gather-page__post-title">{post.title}</h2>
      </Link>
      <p className="gather-page__post-content">{post.content || post.description || "Open this post to see more details."}</p>

      {postType === "pitch" && (
        <div className="gather-page__pitch-progress">
          <div className="gather-page__pitch-progress-top">
            <span><span className="gather-page__status-dot" /> {post.status || "Idea"}</span>
            <strong>{Array.isArray(post.supporters) ? post.supporters.length : Number(post.supporters || 0)} supporters</strong>
          </div>
          <div className="gather-page__progress-track"><span style={{ width: `${Math.min(100, (Array.isArray(post.supporters) ? post.supporters.length : Number(post.supporters || 0)) * 5)}%` }} /></div>
        </div>
      )}

      {postType === "poll" && options.length > 0 && (
        <div className="gather-page__poll-options">
          {options.slice(0, 3).map((option) => {
            const count = Number(votes[option] || 0);
            const percentage = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
            return (
              <button className="gather-page__poll-option" key={option} onClick={() => onVote(post, option)} type="button">
                <span>{option}</span>
                <span className="gather-page__poll-bar" style={{ width: `${percentage}%` }} />
                <strong>{count}</strong>
              </button>
            );
          })}
          <div className="gather-page__poll-footnote">{totalVotes} votes · Select an option to vote</div>
        </div>
      )}

      <div className="gather-page__post-actions">
        <Link className="gather-page__action" to={`/gather/${post.id}`}><span>◯</span> {Array.isArray(post.comments) ? post.comments.length : Number(post.comments || 0)} comments</Link>
        {postType === "pitch" ? (
          <button className="gather-page__action" type="button" onClick={() => onVote(post, "__support__")}><span>↑</span> Support</button>
        ) : (
          <button className="gather-page__action" type="button" onClick={() => onVote(post, "__react__")}><span>♡</span> {Array.isArray(post.reactions) ? post.reactions.length : Number(post.reactions || 0)} reactions</button>
        )}
        <span className="gather-page__action-spacer" />
        <button className={`gather-page__save ${saved ? "is-saved" : ""}`} type="button" onClick={() => onToggleSave(post)} aria-label={saved ? "Remove saved post" : "Save post"} title={saved ? "Saved" : "Save post"}>
          {saved ? "★" : "☆"}
        </button>
      </div>
    </article>
  );
}

export default function GatherPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(readPosts);
  const identity = getIdentity();
  const [activeType, setActiveType] = useState("all");
  const [sort, setSort] = useState("latest");
  const [query, setQuery] = useState("");
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem("campusRadar_savedItems") || "[]");
      return new Set(data.filter((item) => item.itemType === "gatherPost" && String(item.userId) === String(identity.id)).map((item) => item.itemId));
    } catch { return new Set(); }
  });
  const [notice, setNotice] = useState("");

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = posts.filter((post) => {
      const matchesType = activeType === "all" || post.postType === activeType;
      const matchesQuery = !q || [post.title, post.content, post.authorName, post.category, ...(Array.isArray(post.tags) ? post.tags : [])].some((value) => String(value || "").toLowerCase().includes(q));
      return matchesType && matchesQuery;
    });
    if (sort === "trending") {
      result = [...result].sort((a, b) => ((b.comments || 0) + (b.reactions || 0) + (Array.isArray(b.supporters) ? b.supporters.length : Number(b.supporters || 0))) - ((a.comments || 0) + (a.reactions || 0) + (Array.isArray(a.supporters) ? a.supporters.length : Number(a.supporters || 0))));
    } else {
      result = [...result].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return result;
  }, [posts, activeType, query, sort]);

  function persistPosts(next) {
    setPosts(next);
    const realPosts = next.filter((post) => !String(post.id).startsWith("demo-"));
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(realPosts)); } catch { setNotice("Couldn't save this change. Check browser storage."); }
  }

  function toggleSave(post) {
    const isNowSaved = toggleSaved(post.id, identity.id);
    setSavedIds((current) => {
      const next = new Set(current);
      if (isNowSaved) next.add(post.id); else next.delete(post.id);
      return next;
    });
  }

  function interact(post, action) {
    if (String(post.id).startsWith("demo-")) {
      setNotice("This is a preview post. Create a post to try this action.");
      return;
    }
    if (action === "__support__") {
      setNotice("Pitch interactions are under construction.");
    } else if (action === "__react__") {
      const reactions = Array.isArray(post.reactions) ? post.reactions : [];
      const updated = { ...post, reactions: reactions.includes(identity.id) ? reactions.filter((id) => id !== identity.id) : [...reactions, identity.id] };
      persistPosts(posts.map((item) => item.id === post.id ? updated : item));
      setNotice(reactions.includes(identity.id) ? "Reaction removed" : "Reaction added");
    } else if (post.postType === "poll") {
      if (post.expiresAt && Date.now() > new Date(post.expiresAt).getTime()) { setNotice("This poll has closed."); return; }
      const voterIds = Array.isArray(post.voterIds) ? post.voterIds : [];
      if (voterIds.includes(identity.id)) { setNotice("You've already voted in this poll."); return; }
      const votes = { ...(post.votes || {}), [action]: Number((post.votes || {})[action] || 0) + 1 };
      const updated = { ...post, votes, voterIds: [...voterIds, identity.id] };
      persistPosts(posts.map((item) => item.id === post.id ? updated : item));
      setNotice("Your vote has been counted");
    }
    window.setTimeout(() => setNotice(""), 2200);
  }

  return (
    <div className="gather-shell">
      <Sidebar />
      <div className="gather-shell__content">
    <main className="gather-page">
      <div className="gather-page__banner-wrap">
        <img className="gather-page__banner" src={gatherBanner} alt="Gather — ask, discuss, share. Real chats, real people." />
      </div>

      <section className="gather-page__intro">
        <div>
          <div className="gather-page__eyebrow"><span /> YOUR CAMPUS, YOUR COMMUNITY</div>
          <h1>Good things start with <em>a conversation.</em></h1>
          <p>Ask something, share an idea, or help decide what happens next on campus.</p>
        </div>
        <button className="gather-page__create-button" type="button" onClick={() => navigate("/gather/create")}>
          <span>＋</span> Create a post
        </button>
      </section>

      <section className="gather-page__controls" aria-label="Search and filter Gather posts">
        <label className="gather-page__search">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations, ideas, polls..." />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
        </label>
        <label className="gather-page__sort">
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="latest">Latest</option>
            <option value="trending">Trending</option>
          </select>
        </label>
      </section>

      <nav className="gather-page__tabs" aria-label="Post type">
        {Object.entries(typeLabels).map(([key, label]) => (
          <button key={key} type="button" className={`gather-page__tab ${activeType === key ? "is-active" : ""}`} onClick={() => setActiveType(key)}>
            {key === "all" ? "✦" : key === "discussion" ? "↗" : key === "pitch" ? "✳" : "▥"} <span>{label}</span>
            {key !== "all" && <small>{posts.filter((post) => post.postType === key).length}</small>}
          </button>
        ))}
      </nav>

      <section className="gather-page__feed-layout">
        <div className="gather-page__feed">
          <div className="gather-page__feed-heading">
            <div><h2>{activeType === "all" ? "Happening around campus" : `${typeLabels[activeType]}s`}</h2><p>{filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} to explore</p></div>
            <span className="gather-page__live-dot">Community feed</span>
          </div>
          {filteredPosts.length ? filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} saved={savedIds.has(post.id)} onToggleSave={toggleSave} onVote={interact} />
          )) : (
            <div className="gather-page__empty">
              <div className="gather-page__empty-icon">✳</div>
              <h3>No posts found just yet</h3>
              <p>Try another search or be the first to start this conversation.</p>
              <button className="gather-page__create-button" type="button" onClick={() => navigate("/gather/create")}>Create a post</button>
            </div>
          )}
        </div>

        <aside className="gather-page__side">
          <div className="gather-page__side-card gather-page__pitch-cta">
            <span className="gather-page__side-illustration">✳</span>
            <div className="gather-page__side-kicker">HAVE AN IDEA?</div>
            <h3>Make it more than an idea.</h3>
            <p>Pitch a campus improvement, find supporters, and make it happen together.</p>
            <button type="button" onClick={() => navigate("/gather/create?type=pitch")}>Start a Pitch <span>↗</span></button>
          </div>
          <div className="gather-page__side-card">
            <div className="gather-page__side-heading"><h3>How Gather works</h3><span>✦</span></div>
            <div className="gather-page__how-row"><span className="gather-page__how-icon how-discussion">↗</span><div><strong>Discuss</strong><p>Ask questions and share perspectives.</p></div></div>
            <div className="gather-page__how-row"><span className="gather-page__how-icon how-pitch">✳</span><div><strong>Pitch</strong><p>Turn campus ideas into action.</p></div></div>
            <div className="gather-page__how-row"><span className="gather-page__how-icon how-poll">▥</span><div><strong>Poll</strong><p>Make decisions together.</p></div></div>
          </div>
          <div className="gather-page__community-note"><span>♡</span><p><strong>A little reminder</strong><br />Be kind, stay curious, and make space for every voice.</p></div>
        </aside>
      </section>
      {notice && <div className="gather-page__toast" role="status">{notice}</div>}
    </main>
      </div>
    </div>
  );
}
