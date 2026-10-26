import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { getIdentity, getPosts, savePosts } from "./gatherStorage";
import "./GatherForms.css";
import discussionIcon from "../../assets/gather-discussion-icon.png";
import pollIcon from "../../assets/gather-poll-icon.png";

const categories = ["Academics", "Campus Life", "Clubs", "Events", "Placements", "Technology", "Wellbeing", "Other"];
export default function GatherCreatePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialType = params.get("type") === "pitch" ? "pitch" : params.get("type") === "poll" ? "poll" : "discussion";
  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Campus Life");
  const [tags, setTags] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [multiple, setMultiple] = useState(false);
  const [expiry, setExpiry] = useState("7");
  const [error, setError] = useState("");
  const [pitchDialog, setPitchDialog] = useState(initialType === "pitch");

  function publish(event) {
    event.preventDefault();
    setError("");
    if (type === "pitch") { setPitchDialog(true); return; }
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    if (cleanTitle.length < 5) return setError("Add a title with at least 5 characters.");
    if (cleanContent.length < 10) return setError("Add a little more detail (at least 10 characters).");
    let pollOptions = [];
    if (type === "poll") {
      pollOptions = options.map((x) => x.trim()).filter(Boolean);
      if (pollOptions.length < 2 || pollOptions.length > 10) return setError("A poll needs between 2 and 10 non-empty options.");
      if (new Set(pollOptions.map((x) => x.toLowerCase())).size !== pollOptions.length) return setError("Poll options must be unique.");
    }
    const user = getIdentity();
    const now = new Date();
    const post = {
      id: `gather-${now.getTime()}-${Math.random().toString(36).slice(2,8)}`,
      type: "gatherPost", postType: type, title: cleanTitle, content: cleanContent,
      category, tags: tags.split(",").map((x) => x.trim().replace(/^#/, "")).filter(Boolean).slice(0,8),
      createdById: user.id, createdByType: user.type, authorName: user.name, authorInitials: user.initials,
      createdAt: now.toISOString(), comments: [], reactions: [], status: type === "pitch" ? "Idea" : undefined,
      ...(type === "poll" ? { options: pollOptions, votes: {}, voterIds: [], allowMultiple: multiple, expiresAt: new Date(now.getTime() + Number(expiry) * 86400000).toISOString() } : {})
    };
    const posts = getPosts();
    if (!savePosts([post, ...posts])) return setError("Your browser couldn't save this post. Check storage settings and try again.");
    navigate(`/gather/${post.id}`);
  }
  return <main className="gather-form-page">
    <header className="gather-form-header"><Link to="/gather" className="gather-back">← Back to Gather</Link><span className="gather-form-brand">CAMPUS RADAR <i>·</i> GATHER</span></header>
    <section className="gather-form-shell">
      <div className="gather-form-kicker">MAKE YOUR VOICE PART OF CAMPUS</div>
      <h1>Create something <em>together.</em></h1>
      <p className="gather-form-lead">Start a conversation, ask your community, or help shape campus life.</p>
      <div className="gather-type-picker" role="group" aria-label="Post type">
        <button type="button" className={type==="discussion"?"active":""} onClick={()=>setType("discussion")}><img className="gather-type-icon" src={discussionIcon} alt="" aria-hidden="true" /><b>Discussion</b><small>Ask &amp; share</small></button>
        <button type="button" className={type==="poll"?"active":""} onClick={()=>setType("poll")}><img className="gather-type-icon" src={pollIcon} alt="" aria-hidden="true" /><b>Poll</b><small>Decide together</small></button>
        <button type="button" className={type==="pitch"?"active":""} onClick={()=>{setType("pitch");setPitchDialog(true)}}>✨ <b>Pitch</b><small>Propose an idea</small></button>
      </div>
      <form onSubmit={publish} className="gather-form">
        <label>Title <span>Required</span><input value={title} onChange={e=>setTitle(e.target.value)} maxLength={140} placeholder={type==="poll"?"What should we decide together?":"What would you like to talk about?"} required /></label>
        <label>Details <span>Required</span><textarea value={content} onChange={e=>setContent(e.target.value)} maxLength={5000} rows={5} placeholder="Add context so other students can join in…" required /></label>
        <div className="gather-form-two"><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Tags <small>(comma separated)</small><input value={tags} onChange={e=>setTags(e.target.value)} placeholder="e.g. exams, DBMS, library" /></label></div>
        {type==="poll" && <section className="gather-poll-config"><h2>Poll options</h2><p>Add 2–10 distinct options. Empty rows are ignored.</p>{options.map((o,i)=><div className="gather-option-row" key={i}><input aria-label={`Option ${i+1}`} value={o} maxLength={100} onChange={e=>setOptions(old=>old.map((x,j)=>i===j?e.target.value:x))} placeholder={`Option ${i+1}`} />{options.length>2&&<button type="button" onClick={()=>setOptions(old=>old.filter((_,j)=>j!==i))} aria-label={`Remove option ${i+1}`}>×</button>}</div>)}{options.length<10&&<button className="gather-add-option" type="button" onClick={()=>setOptions(old=>[...old,""])}>＋ Add option</button>}<label className="gather-check"><input type="checkbox" checked={multiple} onChange={e=>setMultiple(e.target.checked)} /> Allow voters to select multiple options</label><label>Poll closes in<select value={expiry} onChange={e=>setExpiry(e.target.value)}><option value="1">1 day</option><option value="3">3 days</option><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option></select></label></section>}
        {error&&<p className="gather-form-error" role="alert">{error}</p>}
        {type==="pitch"&&<p className="gather-form-hint">Pitch publishing is not available yet. Your draft will not be saved.</p>}
        <div className="gather-form-actions"><Link to="/gather">Cancel</Link><button type="submit" disabled={type==="pitch"}>Publish {type==="poll"?"poll":"discussion"} <span>↗</span></button></div>
      </form>
    </section>
    {pitchDialog&&<div className="gather-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setPitchDialog(false)}}><section className="gather-modal" role="dialog" aria-modal="true" aria-labelledby="pitch-title"><div className="gather-modal-icon">✦</div><button className="gather-modal-close" onClick={()=>setPitchDialog(false)} aria-label="Close dialog">×</button><span className="gather-form-kicker">A BIG IDEA IS ON THE WAY</span><h2 id="pitch-title">Pitch is under construction</h2><p>We're preparing a thoughtful space for campus ideas, supporters, and progress updates. Pitch creation will be available in a future update.</p><button className="gather-modal-primary" onClick={()=>{setPitchDialog(false);setType("discussion")}}>Start a discussion instead</button></section></div>}
  </main>;
}
