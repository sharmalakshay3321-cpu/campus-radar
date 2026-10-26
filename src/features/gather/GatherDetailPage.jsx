import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getIdentity, getPosts, updatePost, toggleSaved, isSaved } from "./gatherStorage";
import "./GatherForms.css";

function niceDate(value) { const d = new Date(value); return Number.isNaN(d.getTime()) ? "Recently" : d.toLocaleString(undefined,{dateStyle:"medium",timeStyle:"short"}); }
export default function GatherDetailPage() {
  const { postId } = useParams();
  const [refresh, setRefresh] = useState(0);
  const [clockNow] = useState(() => Date.now());
  const [comment, setComment] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [notice, setNotice] = useState("");
  const user = getIdentity();
  const post = useMemo(()=>{
    const saved = getPosts().find(p=>String(p.id)===String(postId));
    if (saved) return saved;
    const demos = {
      "demo-discussion-1": {id:"demo-discussion-1",type:"gatherPost",postType:"discussion",title:"Where can we find good DBMS notes?",content:"Looking for concise notes and practice questions before the next test. Any recommendations?",authorName:"Aarav Sharma",authorInitials:"AS",createdById:"student-1",createdByType:"student",category:"Academics",createdAt:"2026-10-25T17:42:00.000Z",comments:8,reactions:12},
      "demo-discussion-2": {id:"demo-discussion-2",type:"gatherPost",postType:"discussion",title:"Anyone joining the robotics meetup?",content:"I’m planning to go this Friday. Would be great to meet other people interested in robotics.",authorName:"Rohan Verma",authorInitials:"RV",createdById:"student-3",createdByType:"student",category:"Clubs",createdAt:"2026-10-24T12:00:00.000Z",comments:6,reactions:19},
      "demo-pitch-1": {id:"demo-pitch-1",type:"gatherPost",postType:"pitch",title:"Create a late-night exam study zone",content:"A proposal to keep a quiet, well-lit study space open later during exam weeks.",authorName:"Mehak Kaur",authorInitials:"MK",createdById:"student-2",createdByType:"student",category:"Campus Life",createdAt:"2026-10-25T14:00:00.000Z",comments:24,supporters:6,status:"Gathering support"},
      "demo-poll-1": {id:"demo-poll-1",type:"gatherPost",postType:"poll",title:"Which workshop should we host next?",content:"Help the community choose a topic for the next student workshop.",authorName:"Coding Club",authorInitials:"CC",createdById:"club-1",createdByType:"club",category:"Clubs",createdAt:"2026-10-24T02:00:00.000Z",comments:13,options:["Web Development","Artificial Intelligence","Cybersecurity"],votes:{"Web Development":42,"Artificial Intelligence":57,"Cybersecurity":31},voterIds:[]}
    };
    return demos[String(postId)] || null;
  },[postId,refresh]);
  const [saved,setSaved] = useState(()=>isSaved(postId,user.id));
  function update(fn) {
    const result=updatePost(postId,fn);
    if(!result.ok){setNotice("Couldn't save this change. Check browser storage.");return false;}
    setRefresh(x=>x+1);return true;
  }
  function react() {
    if(!post)return;
    const reactions=Array.isArray(post.reactions)?post.reactions:[];
    update(p=>({...p,reactions:reactions.includes(user.id)?reactions.filter(id=>id!==user.id):[...reactions,user.id]}));
  }
  function vote(option) {
    if(!post || post.postType!=="poll")return;
    if(post.expiresAt && clockNow>new Date(post.expiresAt).getTime()){setNotice("This poll has closed.");return;}
    const voters=Array.isArray(post.voterIds)?post.voterIds:[];
    if(voters.includes(user.id)){setNotice("You've already voted in this poll.");return;}
    if(post.allowMultiple) {
      setSelectedOptions(current => current.includes(option) ? current.filter(x=>x!==option) : [...current,option]);
      return;
    }
    update(p=>({...p,votes:{...(p.votes||{}),[option]:Number((p.votes||{})[option]||0)+1},voterIds:[...(p.voterIds||[]),user.id]}));
  }
  function submitComment(e) {
    e.preventDefault(); const text=comment.trim();
    if(text.length<2){setNotice("Write at least 2 characters for your comment.");return;}
    if(!post)return;
    const entry={id:`comment-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,userId:user.id,authorName:user.name,createdAt:new Date().toISOString(),content:text,parentId:replyTo};
    if(update(p=>({...p,comments:[...(Array.isArray(p.comments)?p.comments:[]),entry]}))){setComment("");setReplyTo(null);setNotice("Comment added.");}
  }
  if(!post) return <main className="gather-form-page"><header className="gather-form-header"><Link to="/gather" className="gather-back">← Back to Gather</Link><span className="gather-form-brand">CAMPUS RADAR · GATHER</span></header><section className="gather-detail-shell"><div className="gather-not-found"> <span>✦</span><h1>This post isn't here</h1><p>It may have been deleted, or the link may be out of date.</p><Link className="gather-detail-primary" to="/gather">Return to Gather</Link></div></section></main>;
  const comments=Array.isArray(post.comments)?post.comments:[];
  const votes=post.votes||{};
  const totalVotes=Object.values(votes).reduce((sum,n)=>sum+Math.max(0,Number(n)||0),0);
  const isPollClosed=post.expiresAt && clockNow>new Date(post.expiresAt).getTime();
  const owned=String(post.createdById??post.createdBy)===String(user.id);
  return <main className="gather-form-page"><header className="gather-form-header"><Link to="/gather" className="gather-back">← Back to Gather</Link><span className="gather-form-brand">CAMPUS RADAR <i>·</i> GATHER</span></header>
    <section className="gather-detail-shell"><div className="gather-detail-crumb">GATHER <span>›</span> {post.postType||"discussion"}</div><article className="gather-detail-card"><div className="gather-detail-meta"><span className={`gather-detail-type ${post.postType||"discussion"}`}>{post.postType==="poll"?"📊 Poll":post.postType==="pitch"?"✨ Pitch":"💬 Discussion"}</span><span>{niceDate(post.createdAt)}</span></div><div className="gather-detail-author"><span className="gather-detail-avatar">{post.authorInitials||"CM"}</span><div><b>{post.authorName||"Campus member"}</b><small>{post.createdByType==="club"?"Club account":"Campus community"} · {post.category||"Campus Life"}</small></div></div><h1>{post.title||"Untitled post"}</h1><p className="gather-detail-content">{post.content||post.description||"No additional details were provided."}</p>{Array.isArray(post.tags)&&post.tags.length>0&&<div className="gather-detail-tags">{post.tags.map(t=><span key={t}>#{t}</span>)}</div>}
      {post.postType==="poll"&&<section className="gather-detail-poll"><div className="gather-poll-heading"><h2>Cast your vote</h2><span>{isPollClosed?"Closed":`${post.expiresAt?`Closes ${new Date(post.expiresAt).toLocaleDateString()}`:"No closing date"}`}</span></div>{(Array.isArray(post.options)?post.options:[]).map(option=>{const count=Math.max(0,Number(votes[option])||0);const percent=totalVotes?Math.round(count/totalVotes*100):0;return <button key={option} className={`gather-detail-vote ${selectedOptions.includes(option)?"is-selected":""}`} disabled={!!isPollClosed||(post.voterIds||[]).includes(user.id)} onClick={()=>vote(option)}><span>{post.allowMultiple?(selectedOptions.includes(option)?"☑":"□"):"◯"} {option}</span><span className="gather-detail-vote-track"><i style={{width:`${percent}%`}} /></span><b>{count} · {percent}%</b></button>})}{post.allowMultiple&&!(post.voterIds||[]).includes(user.id)&&!isPollClosed&&<button className="gather-modal-primary" disabled={!selectedOptions.length} onClick={()=>{const selected=[...selectedOptions];if(selected.length){update(p=>({...p,votes:{...(p.votes||{}),...Object.fromEntries(selected.map(o=>[o,Number((p.votes||{})[o]||0)+1]))},voterIds:[...(p.voterIds||[]),user.id]}));setSelectedOptions([]);}}}>Submit selected votes</button>}<p>{totalVotes} total {totalVotes===1?"vote":"votes"}{(post.voterIds||[]).includes(user.id)?" · Your vote is recorded":""}{post.allowMultiple?" · Multiple selections allowed":""}</p></section>}
      {post.postType==="pitch"&&<div className="gather-pitch-notice"><b>Pitch is under construction</b><p>Pitch interactions will be available in a future update.</p></div>}
      <div className="gather-detail-actions"><button onClick={react} type="button">♡ {Array.isArray(post.reactions)?post.reactions.length:Number(post.reactions||0)} {Array.isArray(post.reactions)&&post.reactions.includes(user.id)?"Liked":"Like"}</button><button onClick={()=>{setSaved(toggleSaved(post.id,user.id));setRefresh(x=>x+1)}} type="button">{saved?"★ Saved":"☆ Save"}</button>{owned&&<span className="gather-owner-note">You created this post</span>}</div>
    </article>
    <section className="gather-comments"><div className="gather-comments-heading"><h2>Conversation</h2><span>{comments.length} {comments.length===1?"comment":"comments"}</span></div><form onSubmit={submitComment}><label htmlFor="gather-comment">{replyTo?"Write a reply":"Add to the conversation"}</label><textarea id="gather-comment" rows="3" maxLength="2000" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Be thoughtful. Your perspective matters."/><div className="gather-comment-actions">{replyTo&&<button type="button" onClick={()=>setReplyTo(null)}>Cancel reply</button>}<button type="submit">Post comment</button></div></form>{comments.length===0?<div className="gather-comments-empty">No comments yet. Start the conversation.</div>:comments.map((c,i)=><article className="gather-comment" key={c.id||i}><div className="gather-detail-avatar">{(c.authorName||"CM").split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase()}</div><div className="gather-comment-body"><div><b>{c.authorName||"Campus member"}</b><small>{niceDate(c.createdAt)}</small></div><p>{typeof c==="string"?c:c.content||""}</p>{typeof c!=="string"&&<button type="button" onClick={()=>{setReplyTo(c.id);document.getElementById("gather-comment")?.focus()}}>Reply</button>}</div></article>)}</section>{notice&&<div className="gather-detail-notice" role="status">{notice}</div>}</section></main>;
}
