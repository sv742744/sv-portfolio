import { useState, useEffect, useRef } from 'react'

// Types
interface Project {
  id: number
  num: string
  featured?: boolean
  title: string
  desc: string
  problem: string
  tags: { text: string; color: string }[]
  url: string
  urlDisplay: string
  preview: React.ReactNode
}

interface Skill {
  cat: string
  name: string
  level: string
  percent: number
  color: string
}

interface Achievement {
  icon: string
  name: string
  sub: string
  image?: string
  year: string
  category: string
}

interface Decision {
  q: string
  tag: string
  content: string
}

interface TimelineItem {
  dot: string
  year: string
  heading: string
  desc: string
  tags: { text: string; color?: string }[]
}

// Social Links Data
const socialLinks = [
  { name: 'Email', icon: 'mail', url: 'mailto:shashivardhan@example.com' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/in/shashivardhan' },
  { name: 'GitHub', icon: 'github', url: 'https://github.com/shashivardhan' },
  { name: 'LeetCode', icon: 'leetcode', url: 'https://leetcode.com/shashivardhan' },
  { name: 'CodeChef', icon: 'codechef', url: 'https://www.codechef.com/users/shashivardhan' },
  { name: 'HackerRank', icon: 'hackerrank', url: 'https://www.hackerrank.com/shashivardhan' },
  { name: 'Codeforces', icon: 'codeforces', url: 'https://codeforces.com/profile/shashivardhan' },
  { name: 'Kaggle', icon: 'kaggle', url: 'https://kaggle.com/shashivardhan' },
]

// SVG Icons
const SocialIcon = ({ name }: { name: string }) => {
  const icons: Record<string, JSX.Element> = {
    mail: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    github: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
    leetcode: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
      </svg>
    ),
    codechef: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.257.004C5.963.136 1.04 4.788.041 10.016c-.67 3.496.41 7.25 2.85 9.86 2.024 2.153 4.792 3.485 7.663 3.84.47.059.944.084 1.418.084 5.578 0 10.74-3.914 12.153-9.335C25.84 8.213 19.86.15 12.7.004c-.482-.01-.963-.01-1.443 0zm-.228 1.16l.228-.003.212.003c4.788.113 9.268 3.322 10.843 7.91.433 1.26.588 2.59.533 3.9-.045 1.035-.218 2.067-.561 3.044C20.99 19.7 17.2 22.526 13.034 22.88c-.388.034-.778.047-1.166.047-3.245 0-6.485-1.376-8.674-3.804C1.264 16.87.37 13.648.937 10.59 1.802 5.897 6.219 2.19 11.03 1.164z"/>
      </svg>
    ),
    hackerrank: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24C10.715 24 2.25 19.114 1.608 18 .963 16.885.963 7.115 1.608 6 2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V7.057a.258.258 0 0 0-.258-.258h-1.9a.258.258 0 0 0-.258.258v9.887c0 .141.117.258.258.258h1.9a.258.258 0 0 0 .258-.258V13.01h4.074v3.934c0 .141.117.258.258.258h1.9a.258.258 0 0 0 .258-.258V7.057a.258.258 0 0 0-.258-.258z"/>
      </svg>
    ),
    codeforces: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5V19.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V4.5C9 3.672 9.672 3 10.5 3h3zm9 7.5c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-9c0-.828.672-1.5 1.5-1.5h3z"/>
      </svg>
    ),
    kaggle: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334"/>
      </svg>
    ),
  }
  return <span className="social-icon">{icons[name] || icons.github}</span>
}

// Projects Data
const projects: Project[] = [
  {
    id: 1,
    num: '01',
    featured: true,
    title: 'Student Result Portal',
    desc: 'A secure, login-protected academic result management system. Students authenticate and instantly view exam results — replacing manual mark sheet distribution with a fast digital experience.',
    problem: 'Manual result announcements cause delays and anxiety. This portal gives instant, authenticated access 24/7.',
    tags: [
      { text: 'React', color: 'purple' },
      { text: 'Authentication', color: 'teal' },
      { text: 'Student Portal', color: 'green' },
      { text: 'Vercel', color: 'orange' },
    ],
    url: 'https://result-qu59fzija-shashis-projects-bb764d44.vercel.app/',
    urlDisplay: 'result-qu59fzija-shashis-projects-bb764d44.vercel.app',
    preview: <ResultPreview />,
  },
  {
    id: 2,
    num: '02',
    title: 'Student Grievance System',
    desc: 'A full-stack React app where students raise complaints, track resolution status, and communicate with administration — digitizing the entire grievance lifecycle with a transparent dashboard.',
    problem: 'Paper grievances get lost. This gives every complaint a trackable ID, status, and resolution timeline.',
    tags: [
      { text: 'React', color: 'purple' },
      { text: 'Full Stack', color: 'teal' },
      { text: 'Admin Panel', color: 'green' },
    ],
    url: 'https://student-grievance-theta.vercel.app/',
    urlDisplay: 'student-grievance-theta.vercel.app',
    preview: <GrievancePreview />,
  },
  {
    id: 3,
    num: '03',
    title: 'CRM Dashboard',
    desc: 'A Customer Relationship Management web app for tracking leads, managing client interactions, and visualizing sales pipelines — built with React and clean dashboard UI patterns.',
    problem: "Small businesses can't afford enterprise CRMs. This gives teams a lightweight, fast pipeline manager without the bloat.",
    tags: [
      { text: 'React', color: 'purple' },
      { text: 'Dashboard', color: 'teal' },
      { text: 'CRM', color: 'orange' },
    ],
    url: 'https://crm-gilt-mu.vercel.app/',
    urlDisplay: 'crm-gilt-mu.vercel.app',
    preview: <CrmPreview />,
  },
  {
    id: 4,
    num: '04',
    title: 'E-Commerce Website',
    desc: 'A complete e-commerce storefront built using only HTML & CSS — zero JavaScript, zero frameworks. Product listings, nav, cart UI, hover effects — all with pure markup and styling mastery.',
    problem: 'Build a complete shopping UI without a single line of JavaScript. Proves deep CSS layout and design fundamentals.',
    tags: [
      { text: 'HTML', color: 'orange' },
      { text: 'CSS Only', color: 'teal' },
      { text: 'No JS', color: 'green' },
    ],
    url: 'https://ecomerce-website-with-only-html.vercel.app/',
    urlDisplay: 'ecomerce-website-with-only-html.vercel.app',
    preview: <EcomPreview />,
  },
  {
    id: 5,
    num: '05',
    title: 'Personal Portfolio V1',
    desc: "My first personal portfolio website — clean, responsive, and fully custom. The foundation that evolved into the premium AI portfolio you're viewing right now.",
    problem: 'Build a personal brand online that communicates identity and ambition to recruiters and collaborators.',
    tags: [
      { text: 'HTML/CSS', color: 'purple' },
      { text: 'Responsive', color: 'teal' },
      { text: 'Personal Brand', color: 'green' },
    ],
    url: 'https://sv-portfolio-khaki.vercel.app/',
    urlDisplay: 'sv-portfolio-khaki.vercel.app',
    preview: <PortfolioPreview />,
  },
]

// Preview Components
function ResultPreview() {
  return (
    <div className="pj-screen pj-screen-result">
      <div className="pj-result-ui">
        <div className="pj-result-header">
          <div className="pj-result-logo">🎓</div>
          <div className="pj-result-brand">Academic Results Portal</div>
          <div className="pj-result-tagline">Secure · Fast · Reliable</div>
        </div>
        <div className="pj-result-card">
          <div className="pj-result-card-title">Student Login</div>
          <div className="pj-input-mock">
            <span className="pj-input-label">Roll Number</span>
            <div className="pj-input-field">2023CS••••</div>
          </div>
          <div className="pj-input-mock">
            <span className="pj-input-label">Password</span>
            <div className="pj-input-field">••••••••</div>
          </div>
          <div className="pj-btn-mock">View My Results →</div>
          <div className="pj-result-sub">Powered by secure authentication</div>
        </div>
        <div className="pj-result-stats">
          <div className="pj-stat-pill">📊 Results Available</div>
          <div className="pj-stat-pill">🔒 Encrypted</div>
        </div>
      </div>
    </div>
  )
}

function GrievancePreview() {
  return (
    <div className="pj-screen pj-screen-grievance">
      <div className="pj-grievance-ui">
        <div className="pj-grv-header">
          <span className="pj-grv-logo">📣</span>
          <span className="pj-grv-brand">Student Grievance Portal</span>
          <div className="pj-grv-nav">
            <span>Dashboard</span>
            <span>New Grievance</span>
            <span>Track</span>
          </div>
        </div>
        <div className="pj-grv-stats">
          <div className="pj-grv-stat">
            <div className="pj-grv-stat-num" style={{ color: '#6c63ff' }}>12</div>
            <div className="pj-grv-stat-lab">Total</div>
          </div>
          <div className="pj-grv-stat">
            <div className="pj-grv-stat-num" style={{ color: '#34d399' }}>8</div>
            <div className="pj-grv-stat-lab">Resolved</div>
          </div>
          <div className="pj-grv-stat">
            <div className="pj-grv-stat-num" style={{ color: '#f472b6' }}>4</div>
            <div className="pj-grv-stat-lab">Pending</div>
          </div>
        </div>
        <div className="pj-grv-list">
          <div className="pj-grv-item">
            <span className="pj-grv-id">#GRV-001</span>
            <span className="pj-grv-txt">Library access issue</span>
            <span className="pj-grv-status resolved">Resolved</span>
          </div>
          <div className="pj-grv-item">
            <span className="pj-grv-id">#GRV-002</span>
            <span className="pj-grv-txt">Hostel maintenance</span>
            <span className="pj-grv-status pending">Pending</span>
          </div>
          <div className="pj-grv-item">
            <span className="pj-grv-id">#GRV-003</span>
            <span className="pj-grv-txt">Fee receipt missing</span>
            <span className="pj-grv-status resolved">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CrmPreview() {
  return (
    <div className="pj-screen pj-screen-crm">
      <div className="pj-crm-ui">
        <div className="pj-crm-sidebar">
          <div className="pj-crm-logo">📊 CRM</div>
          <div className="pj-crm-menu">
            <div className="pj-crm-mi active">Dashboard</div>
            <div className="pj-crm-mi">Leads</div>
            <div className="pj-crm-mi">Clients</div>
            <div className="pj-crm-mi">Pipeline</div>
          </div>
        </div>
        <div className="pj-crm-main">
          <div className="pj-crm-kpis">
            <div className="pj-kpi">
              <div className="pj-kpi-n" style={{ color: '#6c63ff' }}>48</div>
              <div className="pj-kpi-l">Leads</div>
            </div>
            <div className="pj-kpi">
              <div className="pj-kpi-n" style={{ color: '#34d399' }}>₹2.4L</div>
              <div className="pj-kpi-l">Revenue</div>
            </div>
            <div className="pj-kpi">
              <div className="pj-kpi-n" style={{ color: '#22d3ee' }}>12</div>
              <div className="pj-kpi-l">Clients</div>
            </div>
          </div>
          <div className="pj-crm-pipeline">
            <div className="pj-pipe-label">Pipeline</div>
            <div className="pj-pipe-bar">
              <div className="pj-pipe-fill" style={{ width: '72%', background: 'linear-gradient(90deg,#6c63ff,#22d3ee)' }}></div>
            </div>
            <div className="pj-pipe-bar" style={{ marginTop: '5px' }}>
              <div className="pj-pipe-fill" style={{ width: '45%', background: 'linear-gradient(90deg,#34d399,#22d3ee)' }}></div>
            </div>
            <div className="pj-pipe-bar" style={{ marginTop: '5px' }}>
              <div className="pj-pipe-fill" style={{ width: '88%', background: 'linear-gradient(90deg,#f472b6,#a78bfa)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EcomPreview() {
  return (
    <div className="pj-screen pj-screen-ecom">
      <div className="pj-ecom-ui">
        <div className="pj-ecom-nav">
          <span className="pj-ecom-logo">🛒 ShopSV</span>
          <div className="pj-ecom-links">
            <span>Home</span>
            <span>Products</span>
            <span>Cart 🛒</span>
          </div>
        </div>
        <div className="pj-ecom-hero">
          <div className="pj-ecom-h1">Premium Products</div>
          <div className="pj-ecom-sub">Best deals every day</div>
          <div className="pj-ecom-cta">Shop Now →</div>
        </div>
        <div className="pj-ecom-products">
          <div className="pj-ecom-card">
            <div className="pj-ecom-img" style={{ background: 'linear-gradient(135deg,#6c63ff22,#22d3ee22)' }}>👟</div>
            <div className="pj-ecom-name">Sneakers</div>
            <div className="pj-ecom-price">₹1,299</div>
          </div>
          <div className="pj-ecom-card">
            <div className="pj-ecom-img" style={{ background: 'linear-gradient(135deg,#34d39922,#6c63ff22)' }}>👜</div>
            <div className="pj-ecom-name">Handbag</div>
            <div className="pj-ecom-price">₹2,199</div>
          </div>
          <div className="pj-ecom-card">
            <div className="pj-ecom-img" style={{ background: 'linear-gradient(135deg,#f472b622,#fbbf2422)' }}>⌚</div>
            <div className="pj-ecom-name">Watch</div>
            <div className="pj-ecom-price">₹3,499</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PortfolioPreview() {
  return (
    <div className="pj-screen pj-screen-port">
      <div className="pj-port-ui">
        <div className="pj-port-nav">
          <span className="pj-port-logo">SV.</span>
          <div className="pj-port-links">
            <span>About</span>
            <span>Skills</span>
            <span>Projects</span>
            <span>Contact</span>
          </div>
        </div>
        <div className="pj-port-hero">
          <div className="pj-port-greeting">Hi, I'm</div>
          <div className="pj-port-name">Shashivardhan</div>
          <div className="pj-port-role">AI & Data Science Student</div>
          <div className="pj-port-btns">
            <div className="pj-port-btn1">View Projects</div>
            <div className="pj-port-btn2">Contact Me</div>
          </div>
        </div>
        <div className="pj-port-skills-row" style={{ display: 'flex', gap: '6px', padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
          <div className="pj-port-skill" style={{ padding: '4px 10px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '20px', fontSize: '10px', color: 'var(--accent2)', fontWeight: 500 }}>Python</div>
          <div className="pj-port-skill" style={{ padding: '4px 10px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '20px', fontSize: '10px', color: 'var(--accent2)', fontWeight: 500 }}>React</div>
          <div className="pj-port-skill" style={{ padding: '4px 10px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '20px', fontSize: '10px', color: 'var(--accent2)', fontWeight: 500 }}>ML</div>
          <div className="pj-port-skill" style={{ padding: '4px 10px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '20px', fontSize: '10px', color: 'var(--accent2)', fontWeight: 500 }}>SQL</div>
        </div>
      </div>
    </div>
  )
}

// Skills Data
const skillsData: { cat: string; catLabel: string; color: string; skills: Skill[] }[] = [
  {
    cat: 'prog',
    catLabel: 'Programming Languages',
    color: '#a78bfa',
    skills: [
      { cat: 'prog', name: 'Python', level: 'Advanced', percent: 90, color: '#a78bfa' },
      { cat: 'prog', name: 'Java', level: 'Intermediate', percent: 68, color: '#a78bfa' },
      { cat: 'prog', name: 'C++', level: 'Intermediate', percent: 62, color: '#a78bfa' },
    ],
  },
  {
    cat: 'aiml',
    catLabel: 'AI & Machine Learning',
    color: '#34d399',
    skills: [
      { cat: 'aiml', name: 'Scikit-Learn', level: 'Advanced', percent: 85, color: '#34d399' },
      { cat: 'aiml', name: 'Pandas', level: 'Advanced', percent: 88, color: '#34d399' },
      { cat: 'aiml', name: 'NumPy', level: 'Advanced', percent: 85, color: '#34d399' },
      { cat: 'aiml', name: 'TensorFlow', level: 'Intermediate', percent: 72, color: '#34d399' },
    ],
  },
  {
    cat: 'web',
    catLabel: 'Web Development',
    color: '#22d3ee',
    skills: [
      { cat: 'web', name: 'React', level: 'Intermediate', percent: 70, color: '#22d3ee' },
      { cat: 'web', name: 'TypeScript', level: 'Learning', percent: 55, color: '#22d3ee' },
      { cat: 'web', name: 'Tailwind CSS', level: 'Intermediate', percent: 65, color: '#22d3ee' },
    ],
  },
  {
    cat: 'db',
    catLabel: 'Databases',
    color: '#f97316',
    skills: [
      { cat: 'db', name: 'MySQL', level: 'Intermediate', percent: 72, color: '#f97316' },
      { cat: 'db', name: 'MongoDB', level: 'Learning', percent: 52, color: '#f97316' },
    ],
  },
  {
    cat: 'tools',
    catLabel: 'Tools & Environment',
    color: '#888780',
    skills: [
      { cat: 'tools', name: 'Git & GitHub', level: 'Advanced', percent: 82, color: '#888780' },
      { cat: 'tools', name: 'VS Code', level: 'Advanced', percent: 90, color: '#888780' },
      { cat: 'tools', name: 'Jupyter Notebook', level: 'Advanced', percent: 88, color: '#888780' },
    ],
  },
  {
    cat: 'aiml',
    catLabel: 'Currently Learning',
    color: '#34d399',
    skills: [
      { cat: 'aiml', name: 'Generative AI / LLMs', level: 'Learning', percent: 40, color: '#34d399' },
      { cat: 'aiml', name: 'RAG Systems', level: 'Learning', percent: 32, color: '#34d399' },
      { cat: 'aiml', name: 'AI Agents', level: 'Learning', percent: 28, color: '#34d399' },
    ],
  },
]

// Achievements Data
const achievementsData: Achievement[] = [
  { icon: '🏆', name: 'Machine Learning Fundamentals', sub: 'Coursera · 2024', image: '/images/certificates/sv-gen_process_internship.png', year: '2024', category: 'ML' },
  { icon: '🎯', name: 'Hackathon Participant', sub: 'Smart India Hackathon · 2024', year: '2024', category: 'Competition' },
  { icon: '📜', name: 'Python for Data Science', sub: 'IBM · 2024', image: '/images/certificates/sv-coharent_14_google_certificate', year: '2024', category: 'Data Science' },
  { icon: '⭐', name: 'Deep Learning Specialization', sub: 'Coursera · 2025', year: '2025', category: 'Deep Learning' },
  { icon: '🔧', name: 'Full Stack Web Development', sub: 'Workshop · 2024', year: '2024', category: 'Web Dev' },
  { icon: '🧠', name: 'NLP with TensorFlow', sub: 'DeepLearning.AI · 2025', year: '2025', category: 'NLP' },
  { icon: '💡', name: 'Technical Symposium Speaker', sub: 'College Event · 2025', year: '2025', category: 'Speaking' },
  { icon: '🚀', name: 'Open Source Contributor', sub: 'GitHub · 2025–Present', year: '2025', category: 'Open Source' },
]

// Decisions Data
const decisionsData: Decision[] = [
  {
    q: 'Why Random Forest instead of XGBoost for healthcare predictions?',
    tag: 'Model Selection',
    content: `<strong>Context:</strong> Predicting patient risk from tabular health data where interpretability matters for clinical use.<br/><br/><strong>Decision:</strong> Random Forest over XGBoost, despite XGBoost's typical accuracy edge.<br/><br/><strong>Reasoning:</strong> Healthcare models need interpretability for regulatory compliance. Random Forest's feature importance scores are more intuitive for domain experts. XGBoost can overfit on small medical datasets without careful tuning. The 2.1% accuracy trade-off was worth the interpretability gain. Used SHAP values on top for deeper explainability.<br/><br/><strong>Outcome:</strong> Clinical stakeholders could validate the model's reasoning, increasing trust and adoption.`,
  },
  {
    q: 'How did accuracy improve from 78% to 89% in the healthcare model?',
    tag: 'Optimization',
    content: `<strong>Initial State:</strong> 78.2% accuracy with raw features fed directly into the model.<br/><br/><strong>Problem Diagnosed:</strong> High correlation between features causing redundancy.<br/><br/><strong>Actions Taken:</strong><br/>1. Feature engineering — created interaction terms (age×BMI, pressure×glucose)<br/>2. Removed multicollinear features using VIF analysis<br/>3. Applied SMOTE for class imbalance (1:4 ratio was skewing predictions)<br/>4. Hyperparameter tuning via Bayesian optimization<br/><br/><strong>Result:</strong> 89.1% accuracy. The biggest gain (6%) came from SMOTE alone.`,
  },
  {
    q: 'Why React + TypeScript instead of plain JavaScript for dashboards?',
    tag: 'Tech Stack',
    content: `<strong>Context:</strong> Building data-heavy dashboards with complex state and many dynamic components.<br/><br/><strong>Decision:</strong> React + TypeScript over Vue or plain JS.<br/><br/><strong>React rationale:</strong> Component reusability for chart wrappers, filter controls, and metric cards.<br/><br/><strong>TypeScript rationale:</strong> Dashboards have complex data shapes. TypeScript catches type mismatches at compile time — the upfront cost of typing paid back 3× in debugging time saved.<br/><br/><strong>What I'd change:</strong> For a smaller project, Svelte + TypeScript would be my pick.`,
  },
  {
    q: 'TF-IDF vs BERT for resume keyword extraction — what was the trade-off?',
    tag: 'NLP',
    content: `<strong>TF-IDF:</strong> Fast, interpretable, no GPU required. But treats words as independent — misses semantic similarity.<br/><br/><strong>BERT:</strong> Understands context and synonyms. But requires significant compute for real-time inference.<br/><br/><strong>Decision:</strong> Hybrid approach — TF-IDF for initial shortlisting (speed), BERT re-ranking for top 50 candidates (quality). This gave 92% of BERT's accuracy at 15% of the compute cost.<br/><br/><strong>Lesson:</strong> Don't optimize for the best model. Optimize for the best system.`,
  },
]

// Timeline Data
const timelineData: TimelineItem[] = [
  {
    dot: '✦',
    year: '2019',
    heading: 'School — Where Curiosity Began',
    desc: 'Developed foundational logical thinking through mathematics and science. First experiments with basic programming sparked a deep curiosity for how software works.',
    tags: [{ text: 'Mathematics' }, { text: 'Problem Solving', color: 'teal' }],
  },
  {
    dot: '✦',
    year: '2021',
    heading: 'Intermediate — Foundations of CS',
    desc: 'Explored programming fundamentals. Wrote first algorithms and understood the elegance of computational thinking. Realized this was not just a subject but a superpower.',
    tags: [{ text: 'C Programming' }, { text: 'Algorithms', color: 'teal' }, { text: 'Logic', color: 'green' }],
  },
  {
    dot: '✦',
    year: '2023',
    heading: 'Engineering — AI & Data Science',
    desc: 'Enrolled in AI & Data Science Engineering. Deep-dived into Python, Java, C++, data structures, and the mathematical foundations of machine learning. Every subject clicked into a bigger picture.',
    tags: [{ text: 'Python' }, { text: 'Java' }, { text: 'C++', color: 'teal' }, { text: 'Data Structures', color: 'green' }],
  },
  {
    dot: '✦',
    year: '2024',
    heading: 'Learning AI — Models & Math',
    desc: 'Studied Machine Learning, Deep Learning, and Neural Networks deeply. Worked with TensorFlow, Scikit-Learn, and Pandas. Built first ML models — a transformer from understanding to implementation.',
    tags: [{ text: 'TensorFlow' }, { text: 'Scikit-Learn', color: 'teal' }, { text: 'Neural Networks' }, { text: 'NumPy', color: 'green' }],
  },
  {
    dot: '✦',
    year: '2025',
    heading: 'Building Projects — From Theory to Impact',
    desc: 'Started building real systems — student portals, CRM dashboards, e-commerce sites. Began full-stack development. Participating in hackathons and contributing to open source.',
    tags: [{ text: 'React' }, { text: 'Full Stack', color: 'teal' }, { text: 'AI Systems' }, { text: 'Open Source', color: 'green' }],
  },
  {
    dot: '★',
    year: '2026',
    heading: 'Placement Ready — Value Driven',
    desc: 'Actively building, learning Generative AI, RAG systems, and AI agents. Ready to bring engineering thinking, problem-solving capability, and AI expertise to a forward-thinking organization.',
    tags: [{ text: 'GenAI' }, { text: 'RAG Systems', color: 'teal' }, { text: 'AI Agents' }, { text: 'Placement Ready ✓', color: 'green' }],
  },
]

// Main App Component
function App() {
  const [loading, setLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [loadText, setLoadText] = useState('Initializing...')
  const [dark, setDark] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [skillFilter, setSkillFilter] = useState('all')
  const [openDecision, setOpenDecision] = useState<number | null>(null)
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Loading simulation
  useEffect(() => {
    const loaderMsgs = ['Initializing...', 'Loading modules...', 'Building UI...', 'Ready.']
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10
      if (progress > 100) progress = 100
      setLoadProgress(progress)
      setLoadText(loaderMsgs[Math.min(Math.floor(progress / 26), 3)])
      if (progress === 100) {
        clearInterval(interval)
        setTimeout(() => setLoading(false), 400)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Intersection observer for reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    document.querySelectorAll('.reveal, .timeline-item').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [loading])

  // Canvas particles
  useEffect(() => {
    if (loading || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number; c: string }[] = []
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.6 + 0.1,
        c: ['#6c63ff', '#a78bfa', '#22d3ee', '#34d399'][Math.floor(Math.random() * 4)],
      })
    }

    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const handleResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', handleResize)

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, W, H)

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.strokeStyle = `rgba(108,99,255,${0.15 * (1 - d / 100)})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 120) {
          p.vx += (dx / d) * 0.3
          p.vy += (dy / d) * 0.3
        }

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1

        ctx.save()
        ctx.globalAlpha = p.a
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      frame = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [loading])

  // Counter animation
  useEffect(() => {
    if (loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-target]').forEach((el) => {
              const target = parseInt((el as HTMLElement).dataset.target || '0')
              let current = 0
              const step = target / 50
              const timer = setInterval(() => {
                current += step
                if (current >= target) {
                  current = target
                  clearInterval(timer)
                }
                el.textContent = Math.floor(current).toString()
              }, 30)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    const statsGrid = document.querySelector('#dashboard .stats-grid')
    if (statsGrid) observer.observe(statsGrid)

    return () => observer.disconnect()
  }, [loading])

  // Animate skill bars when visible
  useEffect(() => {
    if (loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.sk-bar').forEach((bar) => {
              const width = (bar as HTMLElement).style.getPropertyValue('--w')
              ;(bar as HTMLElement).style.width = width
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    const skillGrid = document.getElementById('sk-grid')
    if (skillGrid) observer.observe(skillGrid)

    return () => observer.disconnect()
  }, [loading, skillFilter])

  const toggleTheme = () => {
    setDark(!dark)
    document.documentElement.setAttribute('data-theme', dark ? '' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light') {
      setDark(false)
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [])

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = (form.querySelector('#f-name') as HTMLInputElement).value.trim()
    const email = (form.querySelector('#f-email') as HTMLInputElement).value.trim()
    const message = (form.querySelector('#f-message') as HTMLTextAreaElement).value.trim()

    if (!name || !email || !message) {
      setFormStatus('error')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormStatus('error')
      return
    }
    setFormStatus('success')
    setTimeout(() => setFormStatus('idle'), 4000)
  }

  if (loading) {
    return (
      <div id="loader">
        <div className="loader-logo">SV</div>
        <div className="loader-bar">
          <div className="loader-progress" style={{ width: `${loadProgress}%` }}></div>
        </div>
        <div className="loader-text">{loadText}</div>
      </div>
    )
  }

  return (
    <>
      {/* DRAWER OVERLAY */}
      <div
        className={`nav-drawer-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* SLIDE-OUT DRAWER */}
      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="nav-drawer-header">
          <div className="nav-drawer-logo">SV.</div>
          <button className="nav-drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <div className="nav-drawer-links">
          {[
            { num: '00', label: 'Home',                     href: '#hero' },
            { num: '01', label: 'Developer Stats',          href: '#dashboard' },
            { num: '02', label: 'My Projects',              href: '#projects' },
            { num: '03', label: 'Technical Skills',         href: '#skills' },
            { num: '04', label: 'Future Projects',          href: '#now' },
            { num: '05', label: 'My Journey',               href: '#journey' },
            { num: '06', label: 'Certifications',           href: '#achievements' },
            { num: '07', label: 'Engineering Thinking',     href: '#decisions' },
            { num: '08', label: "Let's Connect",            href: '#contact' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-link-num">{item.num}</span>
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-drawer-footer">
          <span className="nav-available-dot">Available 2026</span>
          <span className="nav-drawer-footer-text">Hyderabad, India</span>
        </div>
      </div>

      {/* NAV BAR */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-logo">SV<span>.</span></div>

        {/* Center quick links — desktop only */}
        <div className="nav-quick">
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#now">Building</a>
          <a href="#journey">Journey</a>
          <a href="#contact">Connect</a>
        </div>

        <div className="nav-right">
          <button className="btn-theme" onClick={toggleTheme} aria-label="Toggle theme">
            {dark ? '🌙' : '☀️'}
          </button>
          <button
            className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <canvas id="canvas-bg" ref={canvasRef}></canvas>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="dot"></span>
            Available for Internships & Projects · 2026
          </div>
          <h1 className="hero-title">
            <span>Hi, I'm</span>
            <span className="hero-name">Shashivardhan.</span>
          </h1>
          <p className="hero-sub">
            Building <em>intelligent systems</em> using AI, Data Science, and Software Engineering.
            Turning complex problems into elegant solutions.
          </p>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={() => scrollToSection('#projects')}>
              View My Projects
            </button>
            <button className="btn-secondary" onClick={() => scrollToSection('#contact')}>
              Let's Connect
            </button>
          </div>

          {/* SOCIAL LINKS */}
          <div className="hero-socials">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={link.name}
                title={link.name}
              >
                <SocialIcon name={link.icon} />
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="hero-scroll">
          <span>SCROLL</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* DEVELOPER STATS */}
      <section id="dashboard">
        <div className="container">
          <div className="section-label">Developer Stats</div>
          <h2 className="section-title reveal">By The Numbers</h2>
          <p className="section-sub reveal">A snapshot of my coding journey so far.</p>
          <div className="stats-grid reveal">
            <div className="stat-card">
              <div className="stat-num" data-target="5">0</div>
              <div className="stat-label">Projects Deployed</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" data-target="12">0</div>
              <div className="stat-label">Technologies Used</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" data-target="8">0</div>
              <div className="stat-label">Certifications</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" data-target="320">0</div>
              <div className="stat-label">Coding Problems Solved</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" data-target="3">0</div>
              <div className="stat-label">Hackathons Participated</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" data-target="89">0</div>
              <div className="stat-label">Best Model Accuracy %</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="container">
          <div className="section-label">Real Work, Real Impact</div>
          <h2 className="section-title reveal">My Projects</h2>
          <p className="section-sub reveal">5 live projects shipped and deployed. Click any preview to open it.</p>

          <div className="pj-list">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className={`pj-row reveal ${project.featured ? 'pj-featured' : ''}`}
                style={{ transitionDelay: `${idx * 0.05}s` }}
              >
                <div className="pj-info">
                  <div className="pj-meta">
                    <span className="pj-num">{project.num}</span>
                    {project.featured && <span className="pj-badge featured">✦ Featured</span>}
                    <span className="pj-live-dot"></span>
                    <span className="pj-live-text">Live</span>
                  </div>
                  <h3 className="pj-title">{project.title}</h3>
                  <p className="pj-desc">{project.desc}</p>
                  <div className="pj-problem">
                    <span className="pj-prob-tag">{project.id === 4 ? 'Challenge' : 'Problem Solved'}</span>
                    {project.problem}
                  </div>
                  <div className="pj-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className={`ptag ${tag.color}`}>
                        {tag.text}
                      </span>
                    ))}
                  </div>
                  <div className="pj-actions">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pj-btn-primary"
                    >
                      ↗ Open Live Site
                    </a>
                  </div>
                </div>
                <div className="pj-preview-wrap">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pj-browser"
                    aria-label={`Open ${project.title}`}
                  >
                    <div className="pj-browser-bar">
                      <span className="pj-dot r"></span>
                      <span className="pj-dot y"></span>
                      <span className="pj-dot g"></span>
                      <span className="pj-url">{project.urlDisplay}</span>
                    </div>
                    {project.preview}
                    <div className="pj-screen-overlay">
                      <span className="pj-open-label">↗ Click to Open</span>
                    </div>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="proj-bottom-cta reveal">
            <span className="proj-cta-text">All 5 projects are live and deployed on Vercel</span>
            <a
              href="https://github.com/shashivardhan"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              🐙 View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="container">
          <div className="section-label">Capabilities</div>
          <h2 className="section-title reveal">Technical Skills</h2>
          <p className="section-sub reveal">Every tool I know, grouped by domain — with honest proficiency levels.</p>

          <div className="sk-filters reveal">
            {['all', 'prog', 'aiml', 'web', 'db', 'tools'].map((cat) => (
              <button
                key={cat}
                className={`sk-filter-btn ${skillFilter === cat ? 'active' : ''}`}
                onClick={() => setSkillFilter(cat)}
              >
                {cat === 'all' ? 'All' : cat === 'prog' ? 'Programming' : cat === 'aiml' ? 'AI & ML' : cat === 'web' ? 'Web Dev' : cat === 'db' ? 'Databases' : 'Tools'}
              </button>
            ))}
          </div>

          <div className="sk-grid reveal" id="sk-grid">
            {skillsData
              .filter((group) => skillFilter === 'all' || group.cat === skillFilter)
              .map((group, idx) => (
                <div key={idx} className="sk-card" data-scat={group.cat}>
                  <div className="sk-card-head">
                    <div className="sk-dot" style={{ background: group.color }}></div>
                    <span className="sk-cat-name">{group.catLabel}</span>
                  </div>
                  {group.skills.map((skill, i) => (
                    <div key={i} className="sk-item">
                      <div className="sk-row">
                        <span className="sk-name">{skill.name}</span>
                        <span className={`sk-level ${skill.level === 'Advanced' ? 'advanced' : skill.level === 'Intermediate' ? 'mid' : 'learn'}`}>
                          {skill.level}
                        </span>
                      </div>
                      <div className="sk-bar-bg">
                        <div
                          className="sk-bar"
                          style={{ '--c': skill.color, '--w': `${skill.percent}%` } as React.CSSProperties}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          <div className="sk-legend reveal">
            <span className="sk-legend-label">Proficiency —</span>
            <span className="sk-legend-item">
              <span className="sk-legend-dot" style={{ background: '#a78bfa' }}></span>
              Advanced · 80–95%
            </span>
            <span className="sk-legend-item">
              <span className="sk-legend-dot" style={{ background: '#22d3ee' }}></span>
              Intermediate · 60–79%
            </span>
            <span className="sk-legend-item">
              <span className="sk-legend-dot" style={{ background: '#34d399' }}></span>
              Learning · 25–55%
            </span>
          </div>
        </div>
      </section>

      {/* NOW BUILDING */}
      <section id="now">
        <div className="container">
          <div className="section-label">What's Next</div>
          <h2 className="section-title reveal">Future Projects &amp; Now Building</h2>
          <p className="section-sub reveal">Real-time view of what I'm working on, learning, and planning to build next.</p>
          <div className="now-grid">
            <div className="now-card reveal">
              <div className="now-icon">📚</div>
              <div className="now-heading">Currently Learning</div>
              <div className="now-items">
                <div className="now-item">Generative AI & LLMs</div>
                <div className="now-item">RAG Systems Architecture</div>
                <div className="now-item">AI Agents & Tool Use</div>
                <div className="now-item">Vector Databases</div>
                <div className="now-item">Prompt Engineering</div>
              </div>
            </div>
            <div className="now-card reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="now-icon">🔨</div>
              <div className="now-heading">Currently Building</div>
              <div className="now-items">
                <div className="now-item">AI-powered web applications</div>
                <div className="now-item">Full-stack data dashboards</div>
                <div className="now-item">ML model serving APIs</div>
                <div className="now-item">Data science experiments</div>
                <div className="now-item">Portfolio & personal brand</div>
              </div>
            </div>
            <div className="now-card reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="now-icon">🚀</div>
              <div className="now-heading">Future Project Ideas</div>
              <div className="now-items">
                <div className="now-item">AI Resume Builder with LLM</div>
                <div className="now-item">Real-time stock sentiment analyzer</div>
                <div className="now-item">Multimodal AI chatbot</div>
                <div className="now-item">Smart campus management system</div>
                <div className="now-item">Open source ML toolkit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section id="journey">
        <div className="container">
          <div className="section-label">My Journey</div>
          <h2 className="section-title reveal">An Engineering Story</h2>
          <p className="section-sub reveal">From curious student to AI builder — every step shaped my thinking.</p>
          <div className="timeline">
            {timelineData.map((item, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-dot">{item.dot}</div>
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-heading">{item.heading}</div>
                <div className="timeline-desc">{item.desc}</div>
                <div className="timeline-tags">
                  {item.tags.map((tag, i) => (
                    <span key={i} className={`tag ${tag.color || ''}`}>
                      {tag.text}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements">
        <div className="container">
          <div className="section-label">Recognition</div>
          <h2 className="section-title reveal">Certifications &amp; Achievements</h2>
          <p className="section-sub reveal">Milestones earned through learning, building, and competing. Hover over certificates to view them up close.</p>
          <div className="achievement-grid">
            {achievementsData.map((item, idx) => (
              <div key={idx} className="achievement-card reveal" style={{ transitionDelay: `${idx * 0.05}s` }}>
                {item.image && (
                  <div className="achievement-cert-wrap">
                    <img
                      src={item.image}
                      alt={`${item.name} certificate`}
                      className="achievement-cert-img"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="achievement-card-body">
                  <div className="achievement-icon-wrap">
                    <span className="achievement-icon-emoji">{item.icon}</span>
                  </div>
                  <div className="achievement-details">
                    <div className="achievement-name">{item.name}</div>
                    <div className="achievement-sub">{item.sub}</div>
                    <div className="achievement-meta">
                      <span className="achievement-category">{item.category}</span>
                      <span className="achievement-year">{item.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DECISIONS */}
      <section id="decisions">
        <div className="container">
          <div className="section-label">Engineering Thinking</div>
          <h2 className="section-title reveal">Decision Log</h2>
          <p className="section-sub reveal">The reasoning behind technical choices — where real engineering thinking lives.</p>
          <div className="decision-list reveal">
            {decisionsData.map((item, idx) => (
              <div
                key={idx}
                className={`decision-item ${openDecision === idx ? 'open' : ''}`}
                onClick={() => setOpenDecision(openDecision === idx ? null : idx)}
              >
                <div className="decision-header">
                  <div className="decision-q">{item.q}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="decision-tag">{item.tag}</span>
                    <span className="decision-toggle">+</span>
                  </div>
                </div>
                <div className={`decision-body ${openDecision === idx ? 'open' : ''}`}>
                  <div className="decision-content" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="container">
          <div className="section-label">Let's Connect</div>
          <h2 className="section-title reveal">Start a Conversation</h2>
          <div className="contact-grid">
            <div className="contact-info reveal">
              <p style={{ fontSize: '17px', color: 'var(--text2)', lineHeight: '1.7', marginBottom: '8px' }}>
                Whether you're a recruiter, collaborator, or fellow builder — I'd love to hear from you.
              </p>
              <div className="contact-method" style={{ marginTop: '24px' }}>
                <div className="contact-method-icon">✉️</div>
                <div>
                  <div className="contact-method-label">Email</div>
                  <a href="mailto:shashivardhan@example.com" className="contact-method-val" style={{ color: 'var(--accent2)' }}>
                    shashivardhan@example.com
                  </a>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-method-icon">💼</div>
                <div>
                  <div className="contact-method-label">LinkedIn</div>
                  <a href="https://linkedin.com/in/shashivardhan" target="_blank" rel="noopener noreferrer" className="contact-method-val" style={{ color: 'var(--accent2)' }}>
                    linkedin.com/in/shashivardhan
                  </a>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-method-icon">🐙</div>
                <div>
                  <div className="contact-method-label">GitHub</div>
                  <a href="https://github.com/shashivardhan" target="_blank" rel="noopener noreferrer" className="contact-method-val" style={{ color: 'var(--accent2)' }}>
                    github.com/shashivardhan
                  </a>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-method-icon">📍</div>
                <div>
                  <div className="contact-method-label">Location</div>
                  <div className="contact-method-val">Hyderabad, India</div>
                </div>
              </div>
            </div>
            <div className="reveal">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-input" id="f-name" type="text" placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" id="f-email" type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" id="f-subject" type="text" placeholder="e.g. Internship opportunity, Collaboration..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-input" id="f-message" rows={5} placeholder="Tell me about the opportunity or idea..."></textarea>
                </div>
                <button className="btn-submit" type="submit">Send Message →</button>
                {formStatus !== 'idle' && (
                  <div className={`form-status ${formStatus}`}>
                    {formStatus === 'success'
                      ? "✓ Message sent successfully! I'll get back to you within 24 hours."
                      : 'Please fill in all required fields with valid data.'}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <div className="footer-copy">© 2026 Shashivardhan · Built with purpose</div>
            <div className="footer-links">
              <a href="#hero">Home</a>
              <a href="#projects">Projects</a>
              <a href="https://github.com/shashivardhan" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://linkedin.com/in/shashivardhan" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
