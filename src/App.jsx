import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Users, FileText, Building2, Upload, Send,
  TrendingUp, CheckCircle2, Clock, XCircle, AlertCircle,
  Search, Plus, Eye, Filter, Download, Mail, Phone,
  MapPin, Calendar, IndianRupee, User, Briefcase, FileCheck,
  ChevronRight, X, Paperclip, MessageSquare, ArrowUpRight,
  Activity, Target, Award, UserCircle, LogOut, BarChart3,
  Landmark, Home, Trash2, CheckCheck, Hourglass, ThumbsUp,
  PauseCircle, ChevronDown, File as FileIcon, MoreVertical,
  Handshake, Network, ClipboardCheck, ArrowRight, Inbox,
  TrendingDown, Percent, Wallet, Settings, CircleDot, Sparkles
} from 'lucide-react';

// ============================================================
// CONSTANTS & SEED DATA
// ============================================================

const STATUSES = {
  NEW: { label: 'New Lead', tone: 'sky', icon: CircleDot },
  DOCS_PENDING: { label: 'Docs Pending', tone: 'amber', icon: Clock },
  UNDER_REVIEW: { label: 'Credit Review', tone: 'violet', icon: Hourglass },
  SENT_TO_LENDERS: { label: 'With Lenders', tone: 'indigo', icon: Send },
  SANCTIONED: { label: 'Sanctioned', tone: 'emerald', icon: ThumbsUp },
  DISBURSED: { label: 'Disbursed', tone: 'green', icon: CheckCheck },
  REJECTED: { label: 'Rejected', tone: 'rose', icon: XCircle },
  ON_HOLD: { label: 'On Hold', tone: 'stone', icon: PauseCircle },
};

const TONE_MAP = {
  sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  green: 'bg-green-50 text-green-800 ring-green-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  stone: 'bg-stone-100 text-stone-700 ring-stone-200',
};

const STATUS_ORDER = ['NEW', 'DOCS_PENDING', 'UNDER_REVIEW', 'SENT_TO_LENDERS', 'SANCTIONED', 'DISBURSED'];

const LOAN_TYPES = [
  'Term Loan', 'Working Capital', 'Cash Credit / OD',
  'Machinery Loan', 'Loan Against Property',
  'Unsecured Business Loan', 'Invoice Discounting', 'Project Finance'
];

const BUSINESS_TYPES = [
  'Proprietorship', 'Partnership', 'Private Limited',
  'LLP', 'Public Limited'
];

const INDUSTRIES = [
  'Manufacturing', 'Trading', 'Services', 'Construction',
  'IT / Software', 'Healthcare', 'Education', 'Retail',
  'Hospitality', 'Textiles', 'Food Processing', 'Logistics', 'Other'
];

const LENDERS = [
  { name: 'HDFC Bank', type: 'Bank', integration: 'API' },
  { name: 'ICICI Bank', type: 'Bank', integration: 'API' },
  { name: 'Axis Bank', type: 'Bank', integration: 'Email' },
  { name: 'Kotak Mahindra Bank', type: 'Bank', integration: 'Email' },
  { name: 'IDFC First Bank', type: 'Bank', integration: 'API' },
  { name: 'Yes Bank', type: 'Bank', integration: 'Email' },
  { name: 'Bajaj Finserv', type: 'NBFC', integration: 'API' },
  { name: 'Tata Capital', type: 'NBFC', integration: 'Email' },
  { name: 'Aditya Birla Finance', type: 'NBFC', integration: 'Email' },
  { name: 'Lendingkart', type: 'Fintech', integration: 'API' },
  { name: 'Indifi', type: 'Fintech', integration: 'API' },
];

const REQUIRED_DOCS = [
  'PAN Card (Entity)', 'GST Certificate', 'Incorporation Proof',
  'ITR (Last 3 Years)', 'Audited Financials (3 Years)',
  'Bank Statements (12 Months)', 'KYC of Promoters',
  'Existing Loan Sanction Letters', 'Property Documents (if LAP)'
];

const formatINR = (amt) => {
  if (amt == null || amt === '') return '—';
  const n = Number(amt);
  if (n >= 1e7) return `₹ ${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹ ${(n / 1e5).toFixed(2)} L`;
  return `₹ ${n.toLocaleString('en-IN')}`;
};

const daysAgo = (dateStr) => {
  const d = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
  if (d < 1) return 'today';
  if (d < 2) return 'yesterday';
  return `${Math.floor(d)}d ago`;
};

const uid = () => Math.random().toString(36).slice(2, 10);

// Seed users (all three roles in one collection)
const SEED_USERS = [
  // Back office
  { id: 'u_admin', role: 'BACKOFFICE', email: 'admin@arthashala.in', password: 'admin123', name: 'Aarav Nair', phone: '+91 98111 00001', createdAt: '2024-01-05' },
  { id: 'u_bo2', role: 'BACKOFFICE', email: 'ops@arthashala.in', password: 'ops12345', name: 'Neha Iyer', phone: '+91 98112 00002', createdAt: '2024-02-10' },
  // Associates (ids kept as a1..a5 to preserve lead references)
  { id: 'a1', role: 'ASSOCIATE', email: 'rakesh@arthashala.in', password: 'demo1234', name: 'Rakesh Khanna', phone: '+91 98101 22334', city: 'Mumbai', commission: 0.75, createdAt: '2024-03-14' },
  { id: 'a2', role: 'ASSOCIATE', email: 'priya@arthashala.in', password: 'demo1234', name: 'Priya Subramaniam', phone: '+91 98411 55667', city: 'Chennai', commission: 0.80, createdAt: '2024-06-22' },
  { id: 'a3', role: 'ASSOCIATE', email: 'vikram@arthashala.in', password: 'demo1234', name: 'Vikram Chauhan', phone: '+91 93115 78899', city: 'Jaipur', commission: 0.75, createdAt: '2024-09-10' },
  { id: 'a4', role: 'ASSOCIATE', email: 'anjali@arthashala.in', password: 'demo1234', name: 'Anjali Deshpande', phone: '+91 98224 11223', city: 'Pune', commission: 0.70, createdAt: '2025-01-18' },
  { id: 'a5', role: 'ASSOCIATE', email: 'tariq@arthashala.in', password: 'demo1234', name: 'Md. Tariq Ansari', phone: '+91 98307 99001', city: 'Kolkata', commission: 0.75, createdAt: '2025-04-05' },
  // Borrowers (linked to seed leads via borrowerUserId)
  { id: 'b_sunil', role: 'BORROWER', email: 'sunil@meridian.in', password: 'demo1234', name: 'Sunil Mehta', phone: '+91 98765 43210', companyName: 'Meridian Polymers Pvt Ltd', createdAt: '2026-04-16' },
  { id: 'b_rajesh', role: 'BORROWER', email: 'rajeshwari@bharatagro.in', password: 'demo1234', name: 'Rajeshwari Patil', phone: '+91 98224 55667', companyName: 'Bharat Agro Foods', createdAt: '2026-04-14' },
  { id: 'b_karthik', role: 'BORROWER', email: 'karthik@deccanit.in', password: 'demo1234', name: 'Karthik Reddy', phone: '+91 98480 33445', companyName: 'Deccan IT Services Pvt Ltd', createdAt: '2026-04-13' },
];

const SEED_LEADS = [
  {
    id: 'L-00412', createdAt: '2026-04-16T10:30:00', updatedAt: '2026-04-18T14:20:00',
    borrowerUserId: 'b_sunil',
    companyName: 'Meridian Polymers Pvt Ltd', contactName: 'Sunil Mehta', designation: 'Managing Director',
    phone: '+91 98765 43210', email: 'sunil@meridianpolymers.in',
    businessType: 'Private Limited', industry: 'Manufacturing', vintage: 12,
    city: 'Ahmedabad', state: 'Gujarat', pin: '380015',
    gstin: '24AABCM1234F1Z5', pan: 'AABCM1234F',
    turnover: 180000000, turnoverPrev: 142000000, netProfit: 18500000,
    existingLoans: true, existingAmount: 35000000, monthlyEmi: 420000,
    loanAmount: 80000000, loanType: 'Term Loan', secured: true, tenure: 84,
    purpose: 'Capex — new injection moulding line', collateral: 'Factory land & building, Sanand',
    source: 'DIRECT', associateId: null, assignedTo: 'Back Office',
    status: 'SENT_TO_LENDERS',
    documents: [
      { name: 'PAN Card (Entity)', filename: 'pan_meridian.pdf', uploadedAt: '2026-04-16T11:00:00' },
      { name: 'GST Certificate', filename: 'gst_cert.pdf', uploadedAt: '2026-04-16T11:02:00' },
      { name: 'ITR (Last 3 Years)', filename: 'itr_fy23_24_25.pdf', uploadedAt: '2026-04-16T11:10:00' },
      { name: 'Audited Financials (3 Years)', filename: 'financials.pdf', uploadedAt: '2026-04-16T11:12:00' },
      { name: 'Bank Statements (12 Months)', filename: 'bank_stmt.pdf', uploadedAt: '2026-04-17T09:00:00' },
    ],
    lenders: [
      { name: 'HDFC Bank', sentAt: '2026-04-17T16:00:00', method: 'API', status: 'Under Review' },
      { name: 'Axis Bank', sentAt: '2026-04-17T16:05:00', method: 'Email', status: 'Awaiting Response' },
      { name: 'Bajaj Finserv', sentAt: '2026-04-17T16:10:00', method: 'API', status: 'Query Raised' },
    ],
    notes: [
      { text: 'Strong financials. Promoter has 20+ years experience. Clean CIBIL (756).', by: 'Back Office', at: '2026-04-16T12:00:00' },
      { text: 'All documents received. Sharing with three lenders today.', by: 'Back Office', at: '2026-04-17T15:30:00' },
    ],
  },
  {
    id: 'L-00411', createdAt: '2026-04-15T09:15:00', updatedAt: '2026-04-18T11:00:00',
    companyName: 'Kaveri Textiles LLP', contactName: 'Priya Subramaniam', designation: 'Partner',
    phone: '+91 98411 22334', email: 'priya@kaveritextiles.in',
    businessType: 'LLP', industry: 'Textiles', vintage: 8,
    city: 'Coimbatore', state: 'Tamil Nadu', pin: '641001',
    gstin: '33AAFFK9012G1Z3', pan: 'AAFFK9012G',
    turnover: 62000000, turnoverPrev: 48000000, netProfit: 4200000,
    existingLoans: true, existingAmount: 9000000, monthlyEmi: 145000,
    loanAmount: 25000000, loanType: 'Working Capital', secured: true, tenure: 12,
    purpose: 'Working capital — festive season inventory build-up',
    collateral: 'Stock & book debts',
    source: 'ASSOCIATE', associateId: 'a2', assignedTo: 'Back Office',
    status: 'SANCTIONED',
    documents: REQUIRED_DOCS.slice(0, 7).map((d, i) => ({
      name: d, filename: `${d.toLowerCase().replace(/[^a-z]/g, '_')}.pdf`,
      uploadedAt: '2026-04-15T10:00:00'
    })),
    lenders: [
      { name: 'ICICI Bank', sentAt: '2026-04-16T10:00:00', method: 'API', status: 'Sanctioned ₹2.5Cr @ 11.25%' },
      { name: 'Kotak Mahindra Bank', sentAt: '2026-04-16T10:05:00', method: 'Email', status: 'Declined' },
    ],
    notes: [
      { text: 'Referred by Priya (Chennai associate). Repeat customer — second facility.', by: 'Back Office', at: '2026-04-15T10:30:00' },
      { text: 'ICICI has sanctioned at 11.25%. Awaiting final docs from borrower.', by: 'Back Office', at: '2026-04-18T11:00:00' },
    ],
  },
  {
    id: 'L-00410', createdAt: '2026-04-14T14:00:00', updatedAt: '2026-04-17T10:00:00',
    companyName: 'Northstar Logistics Pvt Ltd', contactName: 'Amitabh Kapoor', designation: 'Director',
    phone: '+91 98100 11223', email: 'amitabh@northstarlog.in',
    businessType: 'Private Limited', industry: 'Logistics', vintage: 15,
    city: 'Gurugram', state: 'Haryana', pin: '122002',
    gstin: '06AADCN5566P1Z1', pan: 'AADCN5566P',
    turnover: 340000000, turnoverPrev: 295000000, netProfit: 28000000,
    existingLoans: true, existingAmount: 95000000, monthlyEmi: 1200000,
    loanAmount: 150000000, loanType: 'Loan Against Property', secured: true, tenure: 180,
    purpose: 'Fleet expansion & warehouse acquisition',
    collateral: 'Commercial warehouse, Bilaspur (HR)',
    source: 'DIRECT', associateId: null, assignedTo: 'Back Office',
    status: 'UNDER_REVIEW',
    documents: REQUIRED_DOCS.map((d, i) => ({
      name: d, filename: `${d.toLowerCase().replace(/[^a-z]/g, '_')}.pdf`,
      uploadedAt: '2026-04-15T10:00:00'
    })),
    lenders: [],
    notes: [
      { text: 'Large ticket LAP. Credit team reviewing valuation report.', by: 'Back Office', at: '2026-04-16T15:00:00' },
    ],
  },
  {
    id: 'L-00409', createdAt: '2026-04-14T11:30:00', updatedAt: '2026-04-18T09:00:00',
    borrowerUserId: 'b_rajesh',
    companyName: 'Bharat Agro Foods', contactName: 'Rajeshwari Patil', designation: 'Proprietor',
    phone: '+91 98224 55667', email: 'rajeshwari@bharatagro.in',
    businessType: 'Proprietorship', industry: 'Food Processing', vintage: 6,
    city: 'Pune', state: 'Maharashtra', pin: '411014',
    gstin: '27AAEPP7788R1Z9', pan: 'AAEPP7788R',
    turnover: 45000000, turnoverPrev: 38000000, netProfit: 3100000,
    existingLoans: false, existingAmount: 0, monthlyEmi: 0,
    loanAmount: 12000000, loanType: 'Machinery Loan', secured: true, tenure: 60,
    purpose: 'Purchase of pulping & packaging machinery',
    collateral: 'Hypothecation of machinery',
    source: 'ASSOCIATE', associateId: 'a4', assignedTo: 'Back Office',
    status: 'DOCS_PENDING',
    documents: REQUIRED_DOCS.slice(0, 4).map((d) => ({
      name: d, filename: `${d.toLowerCase().replace(/[^a-z]/g, '_')}.pdf`,
      uploadedAt: '2026-04-15T10:00:00'
    })),
    lenders: [],
    notes: [
      { text: 'Awaiting bank statements and quotation for machinery.', by: 'Back Office', at: '2026-04-16T12:00:00' },
    ],
  },
  {
    id: 'L-00408', createdAt: '2026-04-13T16:00:00', updatedAt: '2026-04-18T15:00:00',
    borrowerUserId: 'b_karthik',
    companyName: 'Deccan IT Services Pvt Ltd', contactName: 'Karthik Reddy', designation: 'CEO',
    phone: '+91 98480 33445', email: 'karthik@deccanit.in',
    businessType: 'Private Limited', industry: 'IT / Software', vintage: 9,
    city: 'Hyderabad', state: 'Telangana', pin: '500081',
    gstin: '36AADCD9999D1Z7', pan: 'AADCD9999D',
    turnover: 95000000, turnoverPrev: 78000000, netProfit: 11500000,
    existingLoans: false, existingAmount: 0, monthlyEmi: 0,
    loanAmount: 30000000, loanType: 'Unsecured Business Loan', secured: false, tenure: 36,
    purpose: 'Hiring & office expansion ahead of a large US contract',
    collateral: null,
    source: 'DIRECT', associateId: null, assignedTo: 'Back Office',
    status: 'DISBURSED',
    documents: REQUIRED_DOCS.slice(0, 7).map((d) => ({
      name: d, filename: `${d.toLowerCase().replace(/[^a-z]/g, '_')}.pdf`,
      uploadedAt: '2026-04-14T10:00:00'
    })),
    lenders: [
      { name: 'Bajaj Finserv', sentAt: '2026-04-14T12:00:00', method: 'API', status: 'Disbursed ₹3 Cr @ 14.5%' },
    ],
    notes: [
      { text: 'Disbursal complete on 18 Apr. Commission invoice raised.', by: 'Back Office', at: '2026-04-18T15:00:00' },
    ],
  },
  {
    id: 'L-00407', createdAt: '2026-04-12T10:00:00', updatedAt: '2026-04-17T14:00:00',
    companyName: 'Sai Constructions', contactName: 'Vikram Chauhan', designation: 'Partner',
    phone: '+91 93115 78899', email: 'vikram@saiconstructions.in',
    businessType: 'Partnership', industry: 'Construction', vintage: 10,
    city: 'Jaipur', state: 'Rajasthan', pin: '302015',
    gstin: '08AAFFS1122X1Z0', pan: 'AAFFS1122X',
    turnover: 68000000, turnoverPrev: 55000000, netProfit: 5400000,
    existingLoans: true, existingAmount: 15000000, monthlyEmi: 285000,
    loanAmount: 18000000, loanType: 'Cash Credit / OD', secured: true, tenure: 12,
    purpose: 'Working capital for ongoing govt contracts',
    collateral: 'Receivables hypothecation',
    source: 'ASSOCIATE', associateId: 'a3', assignedTo: 'Back Office',
    status: 'NEW',
    documents: [],
    lenders: [],
    notes: [
      { text: 'Lead logged by Vikram. Initial call scheduled.', by: 'Vikram Chauhan', at: '2026-04-12T10:00:00' },
    ],
  },
  {
    id: 'L-00406', createdAt: '2026-04-10T13:00:00', updatedAt: '2026-04-15T10:00:00',
    companyName: 'Zenith Hotels & Resorts', contactName: 'Nikhil Shetty', designation: 'Director',
    phone: '+91 98213 44556', email: 'nikhil@zenithhotels.in',
    businessType: 'Private Limited', industry: 'Hospitality', vintage: 7,
    city: 'Mumbai', state: 'Maharashtra', pin: '400051',
    gstin: '27AACCZ3344L1Z2', pan: 'AACCZ3344L',
    turnover: 220000000, turnoverPrev: 180000000, netProfit: 19000000,
    existingLoans: true, existingAmount: 80000000, monthlyEmi: 950000,
    loanAmount: 280000000, loanType: 'Project Finance', secured: true, tenure: 120,
    purpose: 'New 80-room property in Alibaug',
    collateral: 'Project assets + promoter guarantee',
    source: 'ASSOCIATE', associateId: 'a1', assignedTo: 'Back Office',
    status: 'REJECTED',
    documents: REQUIRED_DOCS.map((d) => ({
      name: d, filename: `${d.toLowerCase().replace(/[^a-z]/g, '_')}.pdf`,
      uploadedAt: '2026-04-11T10:00:00'
    })),
    lenders: [
      { name: 'IDFC First Bank', sentAt: '2026-04-12T10:00:00', method: 'API', status: 'Declined — LTV concern' },
      { name: 'Tata Capital', sentAt: '2026-04-12T10:05:00', method: 'Email', status: 'Declined' },
    ],
    notes: [
      { text: 'Both lenders declined citing high LTV ratio. Exploring NBFC options.', by: 'Back Office', at: '2026-04-15T10:00:00' },
    ],
  },
  {
    id: 'L-00405', createdAt: '2026-04-09T11:00:00', updatedAt: '2026-04-18T10:00:00',
    companyName: 'Eastern Trading Co.', contactName: 'Tariq Ansari', designation: 'Proprietor',
    phone: '+91 98307 99001', email: 'tariq@easterntrading.in',
    businessType: 'Proprietorship', industry: 'Trading', vintage: 5,
    city: 'Kolkata', state: 'West Bengal', pin: '700016',
    gstin: '19AAEPA5566B1Z8', pan: 'AAEPA5566B',
    turnover: 32000000, turnoverPrev: 24000000, netProfit: 2100000,
    existingLoans: false, existingAmount: 0, monthlyEmi: 0,
    loanAmount: 8000000, loanType: 'Unsecured Business Loan', secured: false, tenure: 36,
    purpose: 'Inventory expansion',
    collateral: null,
    source: 'ASSOCIATE', associateId: 'a5', assignedTo: 'Back Office',
    status: 'ON_HOLD',
    documents: REQUIRED_DOCS.slice(0, 5).map((d) => ({
      name: d, filename: `${d.toLowerCase().replace(/[^a-z]/g, '_')}.pdf`,
      uploadedAt: '2026-04-10T10:00:00'
    })),
    lenders: [],
    notes: [
      { text: 'Borrower asked to pause for 2 weeks — awaiting FY outcome.', by: 'Back Office', at: '2026-04-18T10:00:00' },
    ],
  },
];

// ============================================================
// STORAGE HOOKS
// ============================================================

function useStorage(key, seed) {
  const [data, setData] = useState(seed);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await window.storage.get(key);
        if (!cancelled) {
          if (res && res.value) {
            setData(JSON.parse(res.value));
          } else {
            await window.storage.set(key, JSON.stringify(seed));
            setData(seed);
          }
          setLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setData(seed);
          setLoaded(true);
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, []);

  const save = async (next) => {
    const value = typeof next === 'function' ? next(data) : next;
    setData(value);
    try {
      await window.storage.set(key, JSON.stringify(value));
    } catch (e) {
      console.error('Save failed', e);
    }
  };

  return [data, save, loaded];
}

// ============================================================
// SMALL UI PRIMITIVES
// ============================================================

const Badge = ({ tone = 'stone', children, className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider ring-1 ring-inset ${TONE_MAP[tone]} ${className}`}>
    {children}
  </span>
);

const StatusBadge = ({ status }) => {
  const s = STATUSES[status];
  if (!s) return null;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wider ring-1 ring-inset ${TONE_MAP[s.tone]}`}>
      <Icon size={12} strokeWidth={2.5} /> {s.label}
    </span>
  );
};

const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  const variants = {
    primary: 'bg-stone-900 text-stone-50 hover:bg-stone-800 active:bg-stone-950 shadow-sm',
    secondary: 'bg-white text-stone-900 ring-1 ring-stone-300 hover:bg-stone-50 hover:ring-stone-400',
    ghost: 'text-stone-700 hover:bg-stone-100',
    amber: 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm',
    danger: 'text-rose-700 hover:bg-rose-50 ring-1 ring-rose-200',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ label, hint, className = '', ...props }) => (
  <label className={`block ${className}`}>
    {label && <span className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wide">{label}</span>}
    <input
      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-colors placeholder:text-stone-400"
      {...props}
    />
    {hint && <span className="block text-xs text-stone-500 mt-1">{hint}</span>}
  </label>
);

const Select = ({ label, options, className = '', ...props }) => (
  <label className={`block ${className}`}>
    {label && <span className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wide">{label}</span>}
    <select
      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-colors"
      {...props}
    >
      {options.map(o => typeof o === 'string'
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  </label>
);

const Textarea = ({ label, className = '', ...props }) => (
  <label className={`block ${className}`}>
    {label && <span className="block text-xs font-medium text-stone-600 mb-1.5 uppercase tracking-wide">{label}</span>}
    <textarea
      rows={3}
      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-colors placeholder:text-stone-400 resize-y"
      {...props}
    />
  </label>
);

const Modal = ({ open, onClose, title, children, size = 'lg' }) => {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-stone-950/50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className={`bg-stone-50 rounded-lg shadow-2xl w-full ${sizes[size]} my-8 ring-1 ring-stone-200`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="font-serif text-xl text-stone-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-stone-200 text-stone-500"><X size={18} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, sub, icon: Icon, accent }) => (
  <div className="relative bg-white rounded-lg p-5 ring-1 ring-stone-200 overflow-hidden">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.12em] text-stone-500 font-medium">{label}</p>
        <p className="mt-2 font-serif text-[28px] leading-none text-stone-900 tabular-nums">{value}</p>
        {sub && <p className="mt-2 text-xs text-stone-500">{sub}</p>}
      </div>
      {Icon && (
        <div className={`shrink-0 w-9 h-9 rounded-md grid place-items-center ${accent || 'bg-stone-100 text-stone-700'}`}>
          <Icon size={16} />
        </div>
      )}
    </div>
  </div>
);

// ============================================================
// HEADER & NAV
// ============================================================

const ROLE_META = {
  BACKOFFICE: { label: 'Back Office', icon: Briefcase, blurb: 'Manage the full pipeline, associates, and lender submissions.' },
  ASSOCIATE: { label: 'Associate', icon: Network, blurb: 'Refer leads and track your commissions.' },
  BORROWER: { label: 'Borrower', icon: Building2, blurb: 'Apply for a loan and track its progress.' },
};

const Header = ({ currentUser, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const role = ROLE_META[currentUser.role];
  const initials = currentUser.name.split(' ').map(w => w[0]).slice(0, 2).join('');

  return (
    <header className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
      <div className="flex items-center justify-between px-5 lg:px-8 h-16">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-stone-900 rounded-md grid place-items-center text-amber-500 font-serif italic text-xl">A</div>
          <div>
            <div className="font-serif text-lg text-stone-900 leading-none">Arthashala</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 mt-0.5">Loan Intermediation Suite</div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-stone-200/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 grid place-items-center font-serif text-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm text-stone-900 leading-tight">{currentUser.name}</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-stone-500">{role.label}</div>
            </div>
            <ChevronDown size={14} className="text-stone-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg ring-1 ring-stone-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-100">
                  <div className="text-sm text-stone-900">{currentUser.name}</div>
                  <div className="text-xs text-stone-500 truncate">{currentUser.email}</div>
                  <div className="mt-2"><Badge tone="stone">{role.label}</Badge></div>
                </div>
                {currentUser.role === 'ASSOCIATE' && (
                  <div className="px-4 py-3 border-b border-stone-100 text-xs text-stone-600 space-y-1">
                    <div className="flex justify-between"><span>City</span><span className="text-stone-900">{currentUser.city}</span></div>
                    <div className="flex justify-between"><span>Commission</span><span className="text-stone-900">{currentUser.commission}%</span></div>
                  </div>
                )}
                <button
                  onClick={() => { setMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 text-left"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const Sidebar = ({ role, view, setView }) => {
  const menus = {
    BACKOFFICE: [
      { k: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { k: 'leads', label: 'All Leads', icon: Inbox },
      { k: 'associates', label: 'Associates', icon: Handshake },
      { k: 'lenders', label: 'Lenders', icon: Landmark },
      { k: 'reports', label: 'Reports', icon: BarChart3 },
    ],
    ASSOCIATE: [
      { k: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { k: 'leads', label: 'My Leads', icon: Inbox },
      { k: 'new', label: 'Refer New Lead', icon: Plus },
    ],
    BORROWER: [
      { k: 'dashboard', label: 'My Applications', icon: ClipboardCheck },
      { k: 'documents', label: 'Documents', icon: FileText },
      { k: 'profile', label: 'Business Profile', icon: Building2 },
      { k: 'new', label: 'Apply for Loan', icon: Plus },
    ],
  };
  const items = menus[role];

  return (
    <aside className="hidden md:block w-60 shrink-0 border-r border-stone-200 bg-stone-100/40">
      <nav className="sticky top-16 p-3 space-y-0.5">
        {items.map(item => (
          <button
            key={item.k}
            onClick={() => setView(item.k)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left transition-colors ${
              view === item.k
                ? 'bg-stone-900 text-stone-50'
                : 'text-stone-700 hover:bg-stone-200/60'
            }`}
          >
            <item.icon size={15} strokeWidth={2} />
            <span>{item.label}</span>
          </button>
        ))}
        <div className="pt-6 px-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400">Role</p>
          <p className="text-xs text-stone-600 mt-1">
            {role === 'BACKOFFICE' && 'Full access — manage all pipelines, associates, and lender integrations.'}
            {role === 'ASSOCIATE' && 'You see only leads you have referred, with their live status.'}
            {role === 'BORROWER' && 'Track your loan application and upload required documents.'}
          </p>
        </div>
      </nav>
    </aside>
  );
};

// ============================================================
// BACK OFFICE — DASHBOARD
// ============================================================

const BackOfficeDashboard = ({ leads, associates, setView, openLead }) => {
  const stats = useMemo(() => {
    const total = leads.length;
    const active = leads.filter(l => !['DISBURSED', 'REJECTED'].includes(l.status)).length;
    const disbursed = leads.filter(l => l.status === 'DISBURSED');
    const sanctioned = leads.filter(l => l.status === 'SANCTIONED' || l.status === 'DISBURSED');
    const pipeline = leads
      .filter(l => !['DISBURSED', 'REJECTED'].includes(l.status))
      .reduce((s, l) => s + Number(l.loanAmount || 0), 0);
    const disbursedAmt = disbursed.reduce((s, l) => s + Number(l.loanAmount || 0), 0);
    const conversion = total ? Math.round((sanctioned.length / total) * 100) : 0;
    return { total, active, disbursed: disbursed.length, disbursedAmt, pipeline, conversion };
  }, [leads]);

  const pipelineByStatus = useMemo(() => {
    return STATUS_ORDER.map(k => ({
      key: k,
      status: STATUSES[k],
      count: leads.filter(l => l.status === k).length,
      amount: leads.filter(l => l.status === k).reduce((s, l) => s + Number(l.loanAmount || 0), 0),
    }));
  }, [leads]);

  const recentLeads = useMemo(
    () => [...leads].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6),
    [leads]
  );

  const maxAmount = Math.max(...pipelineByStatus.map(p => p.amount), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-stone-900">Good afternoon</h1>
        <p className="text-sm text-stone-600 mt-1">Here's where your pipeline stands today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active Pipeline" value={formatINR(stats.pipeline)} sub={`${stats.active} live applications`} icon={Activity} accent="bg-indigo-50 text-indigo-700" />
        <Stat label="Disbursed (YTD)" value={formatINR(stats.disbursedAmt)} sub={`${stats.disbursed} deals closed`} icon={TrendingUp} accent="bg-emerald-50 text-emerald-700" />
        <Stat label="Conversion" value={`${stats.conversion}%`} sub="Leads → Sanctioned" icon={Percent} accent="bg-amber-50 text-amber-700" />
        <Stat label="Total Leads" value={stats.total} sub="All-time" icon={Users} accent="bg-stone-900 text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg ring-1 ring-stone-200 p-6">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-serif text-xl text-stone-900">Pipeline by stage</h2>
            <button onClick={() => setView('leads')} className="text-xs text-stone-600 hover:text-stone-900 inline-flex items-center gap-1">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {pipelineByStatus.map(p => (
              <div key={p.key} className="group">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.key} />
                    <span className="text-stone-600 text-xs">{p.count} leads</span>
                  </div>
                  <span className="font-serif text-stone-900 tabular-nums text-sm">{formatINR(p.amount)}</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-${STATUSES[p.key].tone}-400`}
                    style={{
                      width: `${(p.amount / maxAmount) * 100}%`,
                      backgroundColor:
                        p.key === 'NEW' ? '#7dd3fc' :
                        p.key === 'DOCS_PENDING' ? '#fcd34d' :
                        p.key === 'UNDER_REVIEW' ? '#c4b5fd' :
                        p.key === 'SENT_TO_LENDERS' ? '#a5b4fc' :
                        p.key === 'SANCTIONED' ? '#6ee7b7' :
                        p.key === 'DISBURSED' ? '#86efac' : '#d6d3d1'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-stone-900 rounded-lg p-6 text-stone-100">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-[10px] uppercase tracking-[0.18em] text-amber-400">This week</span>
          </div>
          <h2 className="font-serif text-xl text-stone-50 mb-5">Attention required</h2>
          <div className="space-y-3">
            {leads.filter(l => l.status === 'DOCS_PENDING').slice(0, 2).map(l => (
              <div key={l.id} onClick={() => openLead(l.id)} className="cursor-pointer group">
                <div className="text-[11px] text-amber-400 uppercase tracking-wider">Awaiting docs</div>
                <div className="text-sm text-stone-100 group-hover:text-amber-200 transition-colors">{l.companyName}</div>
                <div className="text-xs text-stone-400 mt-0.5">{formatINR(l.loanAmount)} · {daysAgo(l.createdAt)}</div>
              </div>
            ))}
            {leads.filter(l => l.status === 'SANCTIONED').slice(0, 2).map(l => (
              <div key={l.id} onClick={() => openLead(l.id)} className="cursor-pointer group">
                <div className="text-[11px] text-emerald-400 uppercase tracking-wider">Ready to disburse</div>
                <div className="text-sm text-stone-100 group-hover:text-amber-200 transition-colors">{l.companyName}</div>
                <div className="text-xs text-stone-400 mt-0.5">{formatINR(l.loanAmount)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
        <div className="flex items-baseline justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="font-serif text-xl text-stone-900">Recent activity</h2>
          <button onClick={() => setView('leads')} className="text-xs text-stone-600 hover:text-stone-900 inline-flex items-center gap-1">
            All leads <ChevronRight size={12} />
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50/50">
              <th className="text-left font-medium px-6 py-2.5">Lead ID</th>
              <th className="text-left font-medium px-3 py-2.5">Borrower</th>
              <th className="text-left font-medium px-3 py-2.5">Amount</th>
              <th className="text-left font-medium px-3 py-2.5">Source</th>
              <th className="text-left font-medium px-3 py-2.5">Status</th>
              <th className="text-right font-medium px-6 py-2.5">Updated</th>
            </tr>
          </thead>
          <tbody>
            {recentLeads.map(l => {
              const assoc = associates.find(a => a.id === l.associateId);
              return (
                <tr key={l.id} onClick={() => openLead(l.id)} className="border-t border-stone-100 hover:bg-stone-50/80 cursor-pointer">
                  <td className="px-6 py-3 font-mono text-xs text-stone-500">{l.id}</td>
                  <td className="px-3 py-3 text-stone-900">{l.companyName}</td>
                  <td className="px-3 py-3 tabular-nums text-stone-900">{formatINR(l.loanAmount)}</td>
                  <td className="px-3 py-3">
                    {l.source === 'DIRECT'
                      ? <Badge tone="stone">Direct</Badge>
                      : <span className="text-xs text-stone-600">via {assoc?.name.split(' ')[0] || '—'}</span>
                    }
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-6 py-3 text-right text-xs text-stone-500">{daysAgo(l.updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// LEADS LIST
// ============================================================

const LeadsList = ({ leads, associates, openLead, onNewLead, role, currentAssociateId }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');

  const filtered = useMemo(() => {
    let list = role === 'ASSOCIATE'
      ? leads.filter(l => l.associateId === currentAssociateId)
      : leads;
    if (statusFilter !== 'ALL') list = list.filter(l => l.status === statusFilter);
    if (sourceFilter !== 'ALL') list = list.filter(l => l.source === sourceFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l =>
        l.companyName.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [leads, search, statusFilter, sourceFilter, role, currentAssociateId]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">{role === 'ASSOCIATE' ? 'My referred leads' : 'All leads'}</h1>
          <p className="text-sm text-stone-600 mt-1">{filtered.length} of {role === 'ASSOCIATE' ? leads.filter(l => l.associateId === currentAssociateId).length : leads.length} leads</p>
        </div>
        <Button onClick={onNewLead}>
          <Plus size={14} /> {role === 'ASSOCIATE' ? 'Refer a lead' : 'New lead'}
        </Button>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by borrower, lead ID, or city…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-md focus:border-stone-900 outline-none"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm px-3 py-2 bg-white border border-stone-300 rounded-md">
          <option value="ALL">All statuses</option>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {role !== 'ASSOCIATE' && (
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="text-sm px-3 py-2 bg-white border border-stone-300 rounded-md">
            <option value="ALL">All sources</option>
            <option value="DIRECT">Direct</option>
            <option value="ASSOCIATE">Associate</option>
          </select>
        )}
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50 border-b border-stone-200">
              <th className="text-left font-medium px-6 py-3">Lead</th>
              <th className="text-left font-medium px-3 py-3">Loan</th>
              <th className="text-left font-medium px-3 py-3">Source</th>
              <th className="text-left font-medium px-3 py-3">Status</th>
              <th className="text-right font-medium px-6 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-12 text-center text-stone-500 text-sm">No leads match your filters.</td></tr>
            )}
            {filtered.map(l => {
              const assoc = associates.find(a => a.id === l.associateId);
              return (
                <tr key={l.id} onClick={() => openLead(l.id)} className="border-t border-stone-100 hover:bg-stone-50/70 cursor-pointer transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-md bg-stone-100 grid place-items-center text-stone-600 font-serif text-sm shrink-0">
                        {l.companyName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-stone-900">{l.companyName}</div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          <span className="font-mono">{l.id}</span> · {l.contactName} · {l.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="tabular-nums text-stone-900">{formatINR(l.loanAmount)}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{l.loanType} · {l.secured ? 'Secured' : 'Unsecured'}</div>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {l.source === 'DIRECT'
                      ? <Badge tone="stone">Direct</Badge>
                      : <div>
                          <Badge tone="amber">Associate</Badge>
                          <div className="text-xs text-stone-500 mt-1">{assoc?.name}</div>
                        </div>
                    }
                  </td>
                  <td className="px-3 py-4"><StatusBadge status={l.status} /></td>
                  <td className="px-6 py-4 text-right text-xs text-stone-500">{daysAgo(l.updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// LEAD DETAIL — with tabs (Overview, Financials, Documents, Lenders, Activity)
// ============================================================

const LeadDetail = ({ lead, associates, leads, setLeads, onBack, role }) => {
  const [tab, setTab] = useState('overview');
  const [sendingModal, setSendingModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const associate = associates.find(a => a.id === lead.associateId);

  if (!lead) return null;

  const updateLead = (patch) => {
    const next = leads.map(l => l.id === lead.id
      ? { ...l, ...patch, updatedAt: new Date().toISOString() }
      : l
    );
    setLeads(next);
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    updateLead({
      notes: [...(lead.notes || []), {
        text: noteText.trim(),
        by: role === 'ASSOCIATE' ? associate?.name : role === 'BORROWER' ? lead.contactName : 'Back Office',
        at: new Date().toISOString()
      }]
    });
    setNoteText('');
  };

  const handleDocUpload = (docName) => {
    const filename = `${docName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.pdf`;
    const exists = lead.documents.find(d => d.name === docName);
    const newDocs = exists
      ? lead.documents
      : [...lead.documents, { name: docName, filename, uploadedAt: new Date().toISOString() }];
    updateLead({ documents: newDocs });
  };

  const removeDoc = (docName) => {
    updateLead({ documents: lead.documents.filter(d => d.name !== docName) });
  };

  const sendToLender = (lenderName, method) => {
    const entry = { name: lenderName, sentAt: new Date().toISOString(), method, status: 'Pending Response' };
    updateLead({
      lenders: [...lead.lenders, entry],
      status: lead.status === 'NEW' || lead.status === 'DOCS_PENDING' || lead.status === 'UNDER_REVIEW' ? 'SENT_TO_LENDERS' : lead.status
    });
  };

  const tabs = [
    { k: 'overview', label: 'Overview', icon: Eye },
    { k: 'financials', label: 'Financials', icon: IndianRupee },
    { k: 'documents', label: 'Documents', icon: FileText },
    { k: 'lenders', label: 'Lenders', icon: Landmark },
    { k: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-stone-600 hover:text-stone-900 inline-flex items-center gap-1.5">
        <ArrowRight size={14} className="rotate-180" /> Back to leads
      </button>

      {/* Header card */}
      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-stone-900 text-amber-400 grid place-items-center font-serif text-2xl shrink-0">
              {lead.companyName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-serif text-2xl text-stone-900">{lead.companyName}</h1>
                <StatusBadge status={lead.status} />
              </div>
              <div className="text-sm text-stone-600 mt-1.5 flex items-center gap-3 flex-wrap">
                <span className="font-mono text-xs">{lead.id}</span>
                <span className="text-stone-300">·</span>
                <span>{lead.contactName}, {lead.designation}</span>
                <span className="text-stone-300">·</span>
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> {lead.city}</span>
              </div>
              <div className="text-xs text-stone-500 mt-2">
                {lead.source === 'DIRECT'
                  ? 'Direct lead'
                  : <>Referred by <span className="text-stone-900 font-medium">{associate?.name}</span> ({associate?.city})</>
                }
                {' · '}created {daysAgo(lead.createdAt)}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] uppercase tracking-[0.15em] text-stone-500">Loan requirement</div>
            <div className="font-serif text-3xl text-stone-900 tabular-nums mt-0.5">{formatINR(lead.loanAmount)}</div>
            <div className="text-xs text-stone-600 mt-1">{lead.loanType} · {lead.tenure}m · {lead.secured ? 'Secured' : 'Unsecured'}</div>
          </div>
        </div>

        {role === 'BACKOFFICE' && (
          <div className="flex items-center gap-2 mt-6 pt-5 border-t border-stone-100 flex-wrap">
            <span className="text-xs text-stone-500 mr-2">Change status:</span>
            {Object.entries(STATUSES).map(([k, v]) => (
              <button
                key={k}
                onClick={() => updateLead({ status: k })}
                className={`text-[11px] px-2.5 py-1 rounded-md ring-1 ring-inset transition-colors uppercase tracking-wider font-medium ${
                  lead.status === k ? TONE_MAP[v.tone] + ' ring-2' : 'bg-white ring-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200">
        {tabs.map(t => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`inline-flex items-center gap-1.5 px-4 py-3 text-sm border-b-2 transition-colors -mb-px ${
              tab === t.k
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InfoCard title="Entity details">
              <InfoRow label="Company" value={lead.companyName} />
              <InfoRow label="Type" value={lead.businessType} />
              <InfoRow label="Industry" value={lead.industry} />
              <InfoRow label="Vintage" value={`${lead.vintage} years`} />
              <InfoRow label="PAN" value={lead.pan} mono />
              <InfoRow label="GSTIN" value={lead.gstin} mono />
              <InfoRow label="Location" value={`${lead.city}, ${lead.state} – ${lead.pin}`} />
            </InfoCard>

            <InfoCard title="Loan requirement">
              <InfoRow label="Amount" value={formatINR(lead.loanAmount)} />
              <InfoRow label="Type" value={lead.loanType} />
              <InfoRow label="Structure" value={lead.secured ? 'Secured' : 'Unsecured'} />
              <InfoRow label="Tenure" value={`${lead.tenure} months`} />
              <InfoRow label="Purpose" value={lead.purpose} />
              {lead.secured && <InfoRow label="Collateral" value={lead.collateral} />}
            </InfoCard>
          </div>

          <div className="space-y-6">
            <InfoCard title="Contact">
              <div className="space-y-2">
                <div className="text-sm text-stone-900">{lead.contactName}</div>
                <div className="text-xs text-stone-500">{lead.designation}</div>
                <div className="flex items-center gap-2 text-sm text-stone-700 mt-3">
                  <Phone size={12} className="text-stone-400" />{lead.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-700">
                  <Mail size={12} className="text-stone-400" />{lead.email}
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Quick stats">
              <InfoRow label="Docs uploaded" value={`${lead.documents.length} / ${REQUIRED_DOCS.length}`} />
              <InfoRow label="Lenders approached" value={lead.lenders.length} />
              <InfoRow label="Notes" value={(lead.notes || []).length} />
            </InfoCard>
          </div>
        </div>
      )}

      {tab === 'financials' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard title="Revenue & profitability">
            <InfoRow label="Turnover (FY25)" value={formatINR(lead.turnover)} />
            <InfoRow label="Turnover (FY24)" value={formatINR(lead.turnoverPrev)} />
            <InfoRow label="Growth" value={
              lead.turnoverPrev
                ? `${Math.round((lead.turnover / lead.turnoverPrev - 1) * 100)}%`
                : '—'
            } />
            <InfoRow label="Net profit (FY25)" value={formatINR(lead.netProfit)} />
            <InfoRow label="PAT margin" value={
              lead.turnover ? `${((lead.netProfit / lead.turnover) * 100).toFixed(1)}%` : '—'
            } />
          </InfoCard>

          <InfoCard title="Existing debt">
            <InfoRow label="Existing loans?" value={lead.existingLoans ? 'Yes' : 'No'} />
            {lead.existingLoans && (
              <>
                <InfoRow label="Outstanding" value={formatINR(lead.existingAmount)} />
                <InfoRow label="Monthly EMI" value={formatINR(lead.monthlyEmi)} />
                <InfoRow label="Total requested" value={formatINR(Number(lead.loanAmount) + Number(lead.existingAmount || 0))} />
              </>
            )}
          </InfoCard>
        </div>
      )}

      {tab === 'documents' && (
        <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200">
            <h3 className="font-serif text-lg text-stone-900">KYC & Income Documents</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {lead.documents.length} of {REQUIRED_DOCS.length} required documents uploaded
            </p>
          </div>
          <div className="divide-y divide-stone-100">
            {REQUIRED_DOCS.map(docName => {
              const doc = lead.documents.find(d => d.name === docName);
              return (
                <div key={docName} className="px-6 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-md grid place-items-center shrink-0 ${doc ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-400'}`}>
                      {doc ? <CheckCircle2 size={15} /> : <FileIcon size={15} />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-stone-900">{docName}</div>
                      {doc && <div className="text-xs text-stone-500 font-mono truncate">{doc.filename}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc ? (
                      <>
                        <span className="text-xs text-stone-500">{daysAgo(doc.uploadedAt)}</span>
                        {role !== 'BORROWER' && (
                          <button onClick={() => removeDoc(docName)} className="p-1 text-stone-400 hover:text-rose-600">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => handleDocUpload(docName)}>
                        <Upload size={12} /> Upload
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'lenders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg text-stone-900">Lender submissions</h3>
              <p className="text-xs text-stone-500 mt-0.5">{lead.lenders.length} lenders approached</p>
            </div>
            {role === 'BACKOFFICE' && (
              <Button onClick={() => setSendingModal(true)} variant="amber">
                <Send size={14} /> Share with lenders
              </Button>
            )}
          </div>

          {lead.lenders.length === 0 ? (
            <div className="bg-white rounded-lg ring-1 ring-stone-200 p-12 text-center">
              <Landmark size={32} className="mx-auto text-stone-300" />
              <p className="text-sm text-stone-500 mt-3">Not yet shared with any lenders.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50 border-b border-stone-200">
                    <th className="text-left font-medium px-6 py-3">Lender</th>
                    <th className="text-left font-medium px-3 py-3">Method</th>
                    <th className="text-left font-medium px-3 py-3">Sent</th>
                    <th className="text-left font-medium px-6 py-3">Status / Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {lead.lenders.map((le, i) => (
                    <tr key={i} className="border-t border-stone-100">
                      <td className="px-6 py-3 text-stone-900">{le.name}</td>
                      <td className="px-3 py-3">
                        <Badge tone={le.method === 'API' ? 'emerald' : 'stone'}>
                          {le.method === 'API' ? 'LOS Integration' : 'Email'}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-xs text-stone-500">{daysAgo(le.sentAt)}</td>
                      <td className="px-6 py-3 text-sm text-stone-700">{le.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'activity' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {role !== 'BORROWER' && (
              <div className="bg-white rounded-lg ring-1 ring-stone-200 p-4">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add an internal note or follow-up reminder…"
                  rows={2}
                  className="w-full text-sm bg-transparent outline-none resize-none placeholder:text-stone-400"
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" onClick={addNote} disabled={!noteText.trim()}>
                    <MessageSquare size={12} /> Add note
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {[...(lead.notes || [])].reverse().map((n, i) => (
                <div key={i} className="bg-white rounded-lg ring-1 ring-stone-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-stone-500">
                      <span className="font-medium text-stone-900">{n.by}</span> · {daysAgo(n.at)}
                    </div>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed">{n.text}</p>
                </div>
              ))}
              {(!lead.notes || lead.notes.length === 0) && (
                <div className="text-sm text-stone-500 text-center py-8">No activity yet.</div>
              )}
            </div>
          </div>

          <div>
            <InfoCard title="Timeline">
              <ol className="relative border-l border-stone-200 ml-1 space-y-4">
                <li className="ml-4">
                  <div className="absolute -left-1.5 w-3 h-3 bg-stone-900 rounded-full" />
                  <div className="text-xs text-stone-500">{daysAgo(lead.createdAt)}</div>
                  <div className="text-sm text-stone-900">Lead captured</div>
                </li>
                {lead.documents.length > 0 && (
                  <li className="ml-4">
                    <div className="absolute -left-1.5 w-3 h-3 bg-amber-500 rounded-full" />
                    <div className="text-xs text-stone-500">Documents</div>
                    <div className="text-sm text-stone-900">{lead.documents.length} docs uploaded</div>
                  </li>
                )}
                {lead.lenders.length > 0 && (
                  <li className="ml-4">
                    <div className="absolute -left-1.5 w-3 h-3 bg-indigo-500 rounded-full" />
                    <div className="text-xs text-stone-500">Shared with lenders</div>
                    <div className="text-sm text-stone-900">{lead.lenders.length} submissions</div>
                  </li>
                )}
                <li className="ml-4">
                  <div className={`absolute -left-1.5 w-3 h-3 rounded-full ${STATUSES[lead.status].tone === 'green' || STATUSES[lead.status].tone === 'emerald' ? 'bg-emerald-500' : STATUSES[lead.status].tone === 'rose' ? 'bg-rose-500' : 'bg-stone-400'}`} />
                  <div className="text-xs text-stone-500">Current status</div>
                  <div className="text-sm text-stone-900">{STATUSES[lead.status].label}</div>
                </li>
              </ol>
            </InfoCard>
          </div>
        </div>
      )}

      {/* Send to lenders modal */}
      <Modal open={sendingModal} onClose={() => setSendingModal(false)} title="Share with lenders" size="md">
        <p className="text-sm text-stone-600 mb-5">
          Select lenders to share this application with. API-integrated lenders receive the data directly; others are sent by email.
        </p>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {LENDERS.map(l => {
            const already = lead.lenders.find(x => x.name === l.name);
            return (
              <div key={l.name} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-stone-50">
                <div>
                  <div className="text-sm text-stone-900">{l.name}</div>
                  <div className="text-xs text-stone-500">{l.type} · {l.integration === 'API' ? 'LOS Integration' : 'Email'}</div>
                </div>
                {already ? (
                  <Badge tone="stone">Already sent</Badge>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => { sendToLender(l.name, l.integration); }}>
                    Send <ArrowUpRight size={12} />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-5 pt-4 border-t border-stone-200">
          <Button variant="secondary" onClick={() => setSendingModal(false)}>Done</Button>
        </div>
      </Modal>
    </div>
  );
};

const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
    <h3 className="font-serif text-base text-stone-900 mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const InfoRow = ({ label, value, mono }) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <div className="text-stone-500 text-xs uppercase tracking-wider shrink-0">{label}</div>
    <div className={`text-stone-900 text-right ${mono ? 'font-mono text-xs' : ''} tabular-nums`}>{value || '—'}</div>
  </div>
);

// ============================================================
// NEW LEAD FORM
// ============================================================

const NewLeadForm = ({ open, onClose, onCreate, role, currentUser, currentAssociateId, associates }) => {
  const [step, setStep] = useState(1);
  const buildInitial = () => ({
    companyName: role === 'BORROWER' ? (currentUser?.companyName || '') : '',
    contactName: role === 'BORROWER' ? (currentUser?.name || '') : '',
    designation: '',
    phone: role === 'BORROWER' ? (currentUser?.phone || '') : '',
    email: role === 'BORROWER' ? (currentUser?.email || '') : '',
    businessType: 'Private Limited', industry: 'Manufacturing', vintage: '',
    city: '', state: '', pin: '', gstin: '', pan: '',
    turnover: '', turnoverPrev: '', netProfit: '',
    existingLoans: false, existingAmount: '', monthlyEmi: '',
    loanAmount: '', loanType: 'Term Loan', secured: true, tenure: 60,
    purpose: '', collateral: '',
    source: role === 'ASSOCIATE' ? 'ASSOCIATE' : 'DIRECT',
    associateId: role === 'ASSOCIATE' ? currentAssociateId : '',
  });
  const [data, setData] = useState(buildInitial());

  // Reset form when opened or when role/currentUser changes
  useEffect(() => {
    if (open) setData(buildInitial());
    // eslint-disable-next-line
  }, [open, role, currentUser?.id]);

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const handleSubmit = () => {
    const newLead = {
      id: `L-${String(500 + Math.floor(Math.random() * 499)).padStart(5, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
      turnover: Number(data.turnover) || 0,
      turnoverPrev: Number(data.turnoverPrev) || 0,
      netProfit: Number(data.netProfit) || 0,
      loanAmount: Number(data.loanAmount) || 0,
      existingAmount: Number(data.existingAmount) || 0,
      monthlyEmi: Number(data.monthlyEmi) || 0,
      vintage: Number(data.vintage) || 0,
      tenure: Number(data.tenure) || 60,
      status: 'NEW',
      assignedTo: 'Back Office',
      associateId: data.source === 'ASSOCIATE' ? data.associateId : null,
      documents: [],
      lenders: [],
      notes: [{
        text: role === 'ASSOCIATE'
          ? `Lead referred by ${associates.find(a => a.id === currentAssociateId)?.name || 'associate'}.`
          : 'Lead captured.',
        by: role === 'ASSOCIATE' ? associates.find(a => a.id === currentAssociateId)?.name : role === 'BORROWER' ? data.contactName : 'Back Office',
        at: new Date().toISOString()
      }],
    };
    onCreate(newLead);
    setStep(1);
    onClose();
  };

  const steps = [
    { k: 1, label: 'Company & Contact' },
    { k: 2, label: 'Financials' },
    { k: 3, label: 'Loan Requirement' },
  ];

  return (
    <Modal open={open} onClose={onClose} title="New loan application" size="xl">
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <React.Fragment key={s.k}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium ${
              step === s.k ? 'bg-stone-900 text-stone-50' : step > s.k ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
            }`}>
              {step > s.k ? <CheckCircle2 size={12} /> : <span>{s.k}.</span>} {s.label}
            </div>
            {i < steps.length - 1 && <div className="h-px flex-1 bg-stone-200" />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <h3 className="font-serif text-lg text-stone-900">Borrower & business</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Company / Entity name*" value={data.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="e.g. Meridian Polymers Pvt Ltd" />
            <Select label="Entity type" value={data.businessType} onChange={(e) => update('businessType', e.target.value)} options={BUSINESS_TYPES} />
            <Input label="Contact person*" value={data.contactName} onChange={(e) => update('contactName', e.target.value)} placeholder="Name" />
            <Input label="Designation" value={data.designation} onChange={(e) => update('designation', e.target.value)} placeholder="e.g. Director" />
            <Input label="Phone*" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 …" />
            <Input label="Email*" type="email" value={data.email} onChange={(e) => update('email', e.target.value)} />
            <Select label="Industry" value={data.industry} onChange={(e) => update('industry', e.target.value)} options={INDUSTRIES} />
            <Input label="Years in business" type="number" value={data.vintage} onChange={(e) => update('vintage', e.target.value)} />
            <Input label="City" value={data.city} onChange={(e) => update('city', e.target.value)} />
            <Input label="State" value={data.state} onChange={(e) => update('state', e.target.value)} />
            <Input label="PIN" value={data.pin} onChange={(e) => update('pin', e.target.value)} />
            <Input label="PAN" value={data.pan} onChange={(e) => update('pan', e.target.value.toUpperCase())} />
            <Input label="GSTIN" className="md:col-span-2" value={data.gstin} onChange={(e) => update('gstin', e.target.value.toUpperCase())} />
          </div>
          {role === 'BACKOFFICE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <Select label="Lead source" value={data.source} onChange={(e) => update('source', e.target.value)} options={[
                { value: 'DIRECT', label: 'Direct' },
                { value: 'ASSOCIATE', label: 'Via Associate' },
              ]} />
              {data.source === 'ASSOCIATE' && (
                <Select label="Associate" value={data.associateId} onChange={(e) => update('associateId', e.target.value)} options={[
                  { value: '', label: 'Select associate…' },
                  ...associates.map(a => ({ value: a.id, label: `${a.name} (${a.city})` }))
                ]} />
              )}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h3 className="font-serif text-lg text-stone-900">Financials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Turnover FY25 (₹)" type="number" value={data.turnover} onChange={(e) => update('turnover', e.target.value)} placeholder="e.g. 100000000" hint={data.turnover ? formatINR(data.turnover) : ''} />
            <Input label="Turnover FY24 (₹)" type="number" value={data.turnoverPrev} onChange={(e) => update('turnoverPrev', e.target.value)} hint={data.turnoverPrev ? formatINR(data.turnoverPrev) : ''} />
            <Input label="Net profit FY25 (₹)" type="number" value={data.netProfit} onChange={(e) => update('netProfit', e.target.value)} hint={data.netProfit ? formatINR(data.netProfit) : ''} />
          </div>
          <div>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={data.existingLoans} onChange={(e) => update('existingLoans', e.target.checked)} className="rounded border-stone-300" />
              <span>Existing loans on books</span>
            </label>
          </div>
          {data.existingLoans && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Outstanding amount (₹)" type="number" value={data.existingAmount} onChange={(e) => update('existingAmount', e.target.value)} hint={data.existingAmount ? formatINR(data.existingAmount) : ''} />
              <Input label="Total monthly EMI (₹)" type="number" value={data.monthlyEmi} onChange={(e) => update('monthlyEmi', e.target.value)} />
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h3 className="font-serif text-lg text-stone-900">Loan requirement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Amount required (₹)*" type="number" value={data.loanAmount} onChange={(e) => update('loanAmount', e.target.value)} placeholder="5000000 – 300000000" hint={data.loanAmount ? formatINR(data.loanAmount) : 'Between ₹50 L and ₹30 Cr'} />
            <Select label="Loan type" value={data.loanType} onChange={(e) => update('loanType', e.target.value)} options={LOAN_TYPES} />
            <Select label="Structure" value={data.secured ? 'Secured' : 'Unsecured'} onChange={(e) => update('secured', e.target.value === 'Secured')} options={['Secured', 'Unsecured']} />
            <Input label="Tenure (months)" type="number" value={data.tenure} onChange={(e) => update('tenure', e.target.value)} />
          </div>
          <Textarea label="Purpose of loan" value={data.purpose} onChange={(e) => update('purpose', e.target.value)} placeholder="Brief description of what the funds will be used for" />
          {data.secured && (
            <Textarea label="Collateral offered" value={data.collateral} onChange={(e) => update('collateral', e.target.value)} placeholder="Describe the security / collateral" />
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-8 pt-5 border-t border-stone-200">
        <Button variant="ghost" onClick={step === 1 ? onClose : () => setStep(step - 1)}>
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 1 && (!data.companyName || !data.contactName || !data.phone)}>
            Continue <ArrowRight size={14} />
          </Button>
        ) : (
          <Button variant="amber" onClick={handleSubmit} disabled={!data.loanAmount}>
            <CheckCircle2 size={14} /> Submit application
          </Button>
        )}
      </div>
    </Modal>
  );
};

// ============================================================
// ASSOCIATES LIST (back office)
// ============================================================

const AssociatesList = ({ users, setUsers, leads }) => {
  const associates = useMemo(() => users.filter(u => u.role === 'ASSOCIATE'), [users]);
  const [showNew, setShowNew] = useState(false);
  const [newAssoc, setNewAssoc] = useState({ name: '', email: '', phone: '', city: '', commission: 0.75, password: 'demo1234' });

  const enriched = useMemo(() =>
    associates.map(a => {
      const assocLeads = leads.filter(l => l.associateId === a.id);
      const disbursed = assocLeads.filter(l => l.status === 'DISBURSED');
      const disbursedAmt = disbursed.reduce((s, l) => s + Number(l.loanAmount || 0), 0);
      const commissionEarned = disbursedAmt * (a.commission / 100);
      return {
        ...a,
        total: assocLeads.length,
        active: assocLeads.filter(l => !['DISBURSED', 'REJECTED'].includes(l.status)).length,
        disbursedCount: disbursed.length,
        disbursedAmt,
        commissionEarned,
      };
    }).sort((a, b) => b.disbursedAmt - a.disbursedAmt),
    [associates, leads]
  );

  const addAssociate = () => {
    if (users.find(u => u.email.toLowerCase() === newAssoc.email.toLowerCase())) {
      alert('A user with that email already exists.');
      return;
    }
    const entry = {
      id: `u_${uid()}`,
      role: 'ASSOCIATE',
      ...newAssoc,
      email: newAssoc.email.toLowerCase(),
      createdAt: new Date().toISOString(),
      commission: Number(newAssoc.commission),
    };
    setUsers([...users, entry]);
    setNewAssoc({ name: '', email: '', phone: '', city: '', commission: 0.75, password: 'demo1234' });
    setShowNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Associates</h1>
          <p className="text-sm text-stone-600 mt-1">{associates.length} partners across India</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus size={14} /> Onboard associate</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enriched.map(a => (
          <div key={a.id} className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-11 h-11 bg-amber-50 text-amber-700 rounded-full grid place-items-center font-serif text-lg">
                  {a.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <div className="font-serif text-lg text-stone-900 mt-3">{a.name}</div>
                <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5"><MapPin size={10} />{a.city}</div>
                <div className="text-xs text-stone-400 truncate mt-0.5">{a.email}</div>
              </div>
              <Badge tone="amber">{a.commission}%</Badge>
            </div>
            <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-500">Leads</div>
                <div className="font-serif text-lg text-stone-900 tabular-nums">{a.total}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-500">Active</div>
                <div className="font-serif text-lg text-stone-900 tabular-nums">{a.active}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-500">Disbursed</div>
                <div className="font-serif text-lg text-stone-900 tabular-nums">{a.disbursedCount}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100">
              <div className="text-[10px] uppercase tracking-wider text-stone-500">Commission earned</div>
              <div className="font-serif text-xl text-stone-900 tabular-nums mt-0.5">{formatINR(a.commissionEarned)}</div>
              <div className="text-xs text-stone-500 mt-0.5">on {formatINR(a.disbursedAmt)} disbursed</div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Onboard new associate" size="md">
        <p className="text-sm text-stone-600 mb-5">Creates a login for the associate. Share the default password with them and ask them to change it on first login.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full name" value={newAssoc.name} onChange={(e) => setNewAssoc({ ...newAssoc, name: e.target.value })} />
          <Input label="City" value={newAssoc.city} onChange={(e) => setNewAssoc({ ...newAssoc, city: e.target.value })} />
          <Input label="Phone" value={newAssoc.phone} onChange={(e) => setNewAssoc({ ...newAssoc, phone: e.target.value })} />
          <Input label="Email (login)" type="email" value={newAssoc.email} onChange={(e) => setNewAssoc({ ...newAssoc, email: e.target.value })} />
          <Input label="Commission %" type="number" step="0.25" value={newAssoc.commission} onChange={(e) => setNewAssoc({ ...newAssoc, commission: e.target.value })} />
          <Input label="Default password" value={newAssoc.password} onChange={(e) => setNewAssoc({ ...newAssoc, password: e.target.value })} />
        </div>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-stone-200">
          <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
          <Button onClick={addAssociate} disabled={!newAssoc.name || !newAssoc.city || !newAssoc.email}>Add associate</Button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// LENDERS
// ============================================================

const LendersList = ({ leads }) => {
  const stats = useMemo(() => {
    const map = {};
    leads.forEach(l => {
      l.lenders.forEach(le => {
        if (!map[le.name]) map[le.name] = { name: le.name, submissions: 0, sanctions: 0, amount: 0 };
        map[le.name].submissions += 1;
        if (le.status.toLowerCase().includes('sanctioned') || le.status.toLowerCase().includes('disbursed')) {
          map[le.name].sanctions += 1;
          map[le.name].amount += Number(l.loanAmount || 0);
        }
      });
    });
    return LENDERS.map(l => ({ ...l, ...(map[l.name] || { submissions: 0, sanctions: 0, amount: 0 }) }));
  }, [leads]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-stone-900">Lender partners</h1>
        <p className="text-sm text-stone-600 mt-1">Banks, NBFCs, and fintechs you work with</p>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50 border-b border-stone-200">
              <th className="text-left font-medium px-6 py-3">Lender</th>
              <th className="text-left font-medium px-3 py-3">Type</th>
              <th className="text-left font-medium px-3 py-3">Integration</th>
              <th className="text-right font-medium px-3 py-3">Submissions</th>
              <th className="text-right font-medium px-3 py-3">Sanctions</th>
              <th className="text-right font-medium px-6 py-3">Amount sanctioned</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(l => (
              <tr key={l.name} className="border-t border-stone-100 hover:bg-stone-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-stone-100 rounded-md grid place-items-center font-serif text-sm text-stone-600">
                      {l.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                    <span className="text-stone-900">{l.name}</span>
                  </div>
                </td>
                <td className="px-3 py-4"><Badge tone="stone">{l.type}</Badge></td>
                <td className="px-3 py-4">
                  <Badge tone={l.integration === 'API' ? 'emerald' : 'amber'}>
                    {l.integration === 'API' ? 'LOS API' : 'Email'}
                  </Badge>
                </td>
                <td className="px-3 py-4 text-right tabular-nums">{l.submissions}</td>
                <td className="px-3 py-4 text-right tabular-nums">{l.sanctions}</td>
                <td className="px-6 py-4 text-right tabular-nums text-stone-900">{l.amount ? formatINR(l.amount) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// REPORTS
// ============================================================

const Reports = ({ leads, associates }) => {
  const bySource = useMemo(() => {
    const direct = leads.filter(l => l.source === 'DIRECT');
    const assoc = leads.filter(l => l.source === 'ASSOCIATE');
    const directDisb = direct.filter(l => l.status === 'DISBURSED').reduce((s, l) => s + Number(l.loanAmount || 0), 0);
    const assocDisb = assoc.filter(l => l.status === 'DISBURSED').reduce((s, l) => s + Number(l.loanAmount || 0), 0);
    return { direct: direct.length, assoc: assoc.length, directDisb, assocDisb };
  }, [leads]);

  const byIndustry = useMemo(() => {
    const map = {};
    leads.forEach(l => {
      map[l.industry] = (map[l.industry] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  const byLoanType = useMemo(() => {
    const map = {};
    leads.forEach(l => {
      if (!map[l.loanType]) map[l.loanType] = { count: 0, amount: 0 };
      map[l.loanType].count += 1;
      map[l.loanType].amount += Number(l.loanAmount || 0);
    });
    return Object.entries(map).sort((a, b) => b[1].amount - a[1].amount);
  }, [leads]);

  const topAssociates = useMemo(() =>
    associates.map(a => {
      const assocLeads = leads.filter(l => l.associateId === a.id);
      const disbursed = assocLeads.filter(l => l.status === 'DISBURSED').reduce((s, l) => s + Number(l.loanAmount || 0), 0);
      return { ...a, total: assocLeads.length, disbursed };
    }).sort((a, b) => b.disbursed - a.disbursed).slice(0, 5),
    [associates, leads]
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Reports</h1>
          <p className="text-sm text-stone-600 mt-1">Pipeline analytics and commission summaries</p>
        </div>
        <Button variant="secondary"><Download size={14} /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
          <h2 className="font-serif text-lg text-stone-900">Source mix</h2>
          <p className="text-xs text-stone-500 mt-0.5">Direct vs associate-sourced</p>
          <div className="mt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-stone-900">Direct</span>
                <span className="tabular-nums text-stone-600">{bySource.direct} leads · {formatINR(bySource.directDisb)} disbursed</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-900" style={{ width: `${(bySource.direct / (bySource.direct + bySource.assoc)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-stone-900">Via associates</span>
                <span className="tabular-nums text-stone-600">{bySource.assoc} leads · {formatINR(bySource.assocDisb)} disbursed</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${(bySource.assoc / (bySource.direct + bySource.assoc)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
          <h2 className="font-serif text-lg text-stone-900">Top associates</h2>
          <p className="text-xs text-stone-500 mt-0.5">By disbursed volume</p>
          <div className="mt-5 space-y-3">
            {topAssociates.map((a, i) => (
              <div key={a.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-stone-400 text-sm w-4">{i + 1}.</span>
                  <div>
                    <div className="text-sm text-stone-900">{a.name}</div>
                    <div className="text-xs text-stone-500">{a.city} · {a.total} leads</div>
                  </div>
                </div>
                <div className="font-serif text-stone-900 tabular-nums">{formatINR(a.disbursed)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
          <h2 className="font-serif text-lg text-stone-900">By industry</h2>
          <div className="mt-5 space-y-2.5">
            {byIndustry.map(([ind, count]) => (
              <div key={ind} className="flex items-center gap-3">
                <div className="text-sm text-stone-700 w-36 shrink-0">{ind}</div>
                <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-stone-900" style={{ width: `${(count / byIndustry[0][1]) * 100}%` }} />
                </div>
                <div className="text-xs text-stone-600 tabular-nums w-6 text-right">{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
          <h2 className="font-serif text-lg text-stone-900">By loan type</h2>
          <div className="mt-5 space-y-2.5">
            {byLoanType.map(([lt, d]) => (
              <div key={lt}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-stone-700">{lt}</span>
                  <span className="text-xs text-stone-500 tabular-nums">{d.count} · {formatINR(d.amount)}</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${(d.amount / byLoanType[0][1].amount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ASSOCIATE DASHBOARD
// ============================================================

const AssociateDashboard = ({ leads, currentAssociateId, associates, setView, openLead }) => {
  const me = associates.find(a => a.id === currentAssociateId);
  const myLeads = leads.filter(l => l.associateId === currentAssociateId);
  const active = myLeads.filter(l => !['DISBURSED', 'REJECTED'].includes(l.status));
  const disbursed = myLeads.filter(l => l.status === 'DISBURSED');
  const disbursedAmt = disbursed.reduce((s, l) => s + Number(l.loanAmount || 0), 0);
  const pipelineAmt = active.reduce((s, l) => s + Number(l.loanAmount || 0), 0);
  const commission = disbursedAmt * (me?.commission / 100 || 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-stone-900">Welcome, {me?.name.split(' ')[0]}</h1>
        <p className="text-sm text-stone-600 mt-1">Your referral book from {me?.city}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active pipeline" value={formatINR(pipelineAmt)} sub={`${active.length} live`} icon={Activity} accent="bg-indigo-50 text-indigo-700" />
        <Stat label="Disbursed" value={formatINR(disbursedAmt)} sub={`${disbursed.length} deals`} icon={CheckCheck} accent="bg-emerald-50 text-emerald-700" />
        <Stat label="Commission earned" value={formatINR(commission)} sub={`@ ${me?.commission}%`} icon={Wallet} accent="bg-amber-50 text-amber-700" />
        <Stat label="Total referrals" value={myLeads.length} sub="All-time" icon={Users} accent="bg-stone-900 text-amber-400" />
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="font-serif text-xl text-stone-900">Your leads</h2>
          <Button size="sm" onClick={() => setView('new')}><Plus size={12} /> Refer new</Button>
        </div>
        {myLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox size={32} className="mx-auto text-stone-300" />
            <p className="text-sm text-stone-500 mt-3">You haven't referred any leads yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50/50">
                <th className="text-left font-medium px-6 py-2.5">Borrower</th>
                <th className="text-left font-medium px-3 py-2.5">Amount</th>
                <th className="text-left font-medium px-3 py-2.5">Status</th>
                <th className="text-right font-medium px-6 py-2.5">Updated</th>
              </tr>
            </thead>
            <tbody>
              {myLeads.map(l => (
                <tr key={l.id} onClick={() => openLead(l.id)} className="border-t border-stone-100 hover:bg-stone-50/80 cursor-pointer">
                  <td className="px-6 py-3">
                    <div className="text-stone-900">{l.companyName}</div>
                    <div className="text-xs text-stone-500 font-mono mt-0.5">{l.id}</div>
                  </td>
                  <td className="px-3 py-3 tabular-nums text-stone-900">{formatINR(l.loanAmount)}</td>
                  <td className="px-3 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-6 py-3 text-right text-xs text-stone-500">{daysAgo(l.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ============================================================
// BORROWER DASHBOARD
// ============================================================

const BorrowerDashboard = ({ lead, leads, setLeads, setView }) => {
  const updateLead = (patch) => {
    setLeads(leads.map(l => l.id === lead.id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l));
  };

  const handleDocUpload = (docName) => {
    const filename = `${docName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.pdf`;
    if (lead.documents.find(d => d.name === docName)) return;
    updateLead({
      documents: [...lead.documents, { name: docName, filename, uploadedAt: new Date().toISOString() }]
    });
  };

  const currentStageIndex = STATUS_ORDER.indexOf(lead.status);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-stone-900">Your application</h1>
        <p className="text-sm text-stone-600 mt-1 flex items-center gap-2">
          <span>{lead.companyName}</span>
          <span className="text-stone-300">·</span>
          <span className="font-mono text-xs">{lead.id}</span>
        </p>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-stone-500">Requested</div>
            <div className="font-serif text-4xl text-stone-900 tabular-nums mt-1">{formatINR(lead.loanAmount)}</div>
            <div className="text-sm text-stone-600 mt-1">{lead.loanType} · {lead.tenure}m · {lead.secured ? 'Secured' : 'Unsecured'}</div>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        {lead.status !== 'REJECTED' && lead.status !== 'ON_HOLD' && (
          <>
            <div className="relative h-1 bg-stone-100 rounded-full mt-8 mb-8">
              <div
                className="absolute inset-y-0 left-0 bg-stone-900 rounded-full transition-all"
                style={{ width: `${Math.max(0, (currentStageIndex / (STATUS_ORDER.length - 1)) * 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-6 gap-2 text-center">
              {STATUS_ORDER.map((s, i) => (
                <div key={s}>
                  <div className={`w-7 h-7 mx-auto rounded-full grid place-items-center ${
                    i <= currentStageIndex ? 'bg-stone-900 text-stone-50' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {i < currentStageIndex ? <CheckCircle2 size={14} /> : <span className="text-xs">{i + 1}</span>}
                  </div>
                  <div className={`text-[10px] uppercase tracking-wider mt-2 ${i <= currentStageIndex ? 'text-stone-900' : 'text-stone-400'}`}>
                    {STATUSES[s].label}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg text-stone-900">Required documents</h2>
              <p className="text-xs text-stone-500 mt-0.5">{lead.documents.length}/{REQUIRED_DOCS.length} uploaded</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setView('documents')}>View all <ChevronRight size={12} /></Button>
          </div>
          <div className="divide-y divide-stone-100">
            {REQUIRED_DOCS.slice(0, 5).map(docName => {
              const doc = lead.documents.find(d => d.name === docName);
              return (
                <div key={docName} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md grid place-items-center ${doc ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-400'}`}>
                      {doc ? <CheckCircle2 size={15} /> : <FileIcon size={15} />}
                    </div>
                    <div className="text-sm text-stone-900">{docName}</div>
                  </div>
                  {doc ? (
                    <span className="text-xs text-emerald-700">Uploaded</span>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => handleDocUpload(docName)}>
                      <Upload size={12} /> Upload
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-stone-900 rounded-lg p-6 text-stone-100">
          <h2 className="font-serif text-lg">What happens next?</h2>
          <div className="mt-5 space-y-4 text-sm">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-amber-500 text-stone-900 rounded-full grid place-items-center text-xs font-bold shrink-0">1</div>
              <div>
                <div className="text-stone-100">Complete documents</div>
                <div className="text-xs text-stone-400 mt-0.5">Upload all required KYC & income documents.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-stone-700 text-stone-300 rounded-full grid place-items-center text-xs font-bold shrink-0">2</div>
              <div>
                <div className="text-stone-100">Credit review</div>
                <div className="text-xs text-stone-400 mt-0.5">Our team evaluates your application.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-stone-700 text-stone-300 rounded-full grid place-items-center text-xs font-bold shrink-0">3</div>
              <div>
                <div className="text-stone-100">Shared with lenders</div>
                <div className="text-xs text-stone-400 mt-0.5">We approach multiple banks & NBFCs.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-stone-700 text-stone-300 rounded-full grid place-items-center text-xs font-bold shrink-0">4</div>
              <div>
                <div className="text-stone-100">Sanction & disbursal</div>
                <div className="text-xs text-stone-400 mt-0.5">You choose the best offer.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BorrowerDocuments = ({ lead, leads, setLeads }) => {
  const updateLead = (patch) => {
    setLeads(leads.map(l => l.id === lead.id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l));
  };
  const handleDocUpload = (docName) => {
    const filename = `${docName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.pdf`;
    if (lead.documents.find(d => d.name === docName)) return;
    updateLead({
      documents: [...lead.documents, { name: docName, filename, uploadedAt: new Date().toISOString() }]
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-stone-900">Documents</h1>
        <p className="text-sm text-stone-600 mt-1">Upload KYC, financials, and banking documents</p>
      </div>
      <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
        <div className="divide-y divide-stone-100">
          {REQUIRED_DOCS.map(docName => {
            const doc = lead.documents.find(d => d.name === docName);
            return (
              <div key={docName} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-md grid place-items-center shrink-0 ${doc ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-400'}`}>
                    {doc ? <CheckCircle2 size={18} /> : <FileIcon size={18} />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-stone-900">{docName}</div>
                    {doc
                      ? <div className="text-xs text-stone-500 font-mono truncate">{doc.filename} · {daysAgo(doc.uploadedAt)}</div>
                      : <div className="text-xs text-stone-500">PDF, max 5MB</div>
                    }
                  </div>
                </div>
                {doc ? (
                  <Badge tone="emerald">Uploaded</Badge>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => handleDocUpload(docName)}>
                    <Upload size={12} /> Upload
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const BorrowerProfile = ({ lead }) => (
  <div className="space-y-6">
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Business profile</h1>
      <p className="text-sm text-stone-600 mt-1">As submitted in your application</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InfoCard title="Entity">
        <InfoRow label="Name" value={lead.companyName} />
        <InfoRow label="Type" value={lead.businessType} />
        <InfoRow label="Industry" value={lead.industry} />
        <InfoRow label="Vintage" value={`${lead.vintage} years`} />
        <InfoRow label="PAN" value={lead.pan} mono />
        <InfoRow label="GSTIN" value={lead.gstin} mono />
        <InfoRow label="Address" value={`${lead.city}, ${lead.state} – ${lead.pin}`} />
      </InfoCard>
      <InfoCard title="Contact">
        <InfoRow label="Person" value={lead.contactName} />
        <InfoRow label="Designation" value={lead.designation} />
        <InfoRow label="Phone" value={lead.phone} />
        <InfoRow label="Email" value={lead.email} />
      </InfoCard>
      <InfoCard title="Financials">
        <InfoRow label="Turnover FY25" value={formatINR(lead.turnover)} />
        <InfoRow label="Turnover FY24" value={formatINR(lead.turnoverPrev)} />
        <InfoRow label="Net profit FY25" value={formatINR(lead.netProfit)} />
        <InfoRow label="Existing debt" value={lead.existingLoans ? formatINR(lead.existingAmount) : 'None'} />
      </InfoCard>
      <InfoCard title="Loan">
        <InfoRow label="Amount" value={formatINR(lead.loanAmount)} />
        <InfoRow label="Type" value={lead.loanType} />
        <InfoRow label="Structure" value={lead.secured ? 'Secured' : 'Unsecured'} />
        <InfoRow label="Tenure" value={`${lead.tenure} months`} />
        <InfoRow label="Purpose" value={lead.purpose} />
      </InfoCard>
    </div>
  </div>
);

// ============================================================
// AUTH — LOGIN & REGISTER
// ============================================================

const AuthScreen = ({ users, setUsers, onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regRole, setRegRole] = useState('BORROWER');
  const [regData, setRegData] = useState({
    name: '', email: '', password: '', phone: '',
    // associate
    city: '', commission: 0.75,
    // borrower
    companyName: '',
  });

  const submitLogin = (email, password) => {
    const u = users.find(
      x => x.email.toLowerCase() === email.toLowerCase().trim() && x.password === password
    );
    if (!u) {
      setError('Invalid email or password.');
      return;
    }
    setError('');
    onLogin(u);
  };

  const handleLogin = (e) => {
    e?.preventDefault?.();
    submitLogin(loginEmail, loginPassword);
  };

  const handleRegister = (e) => {
    e?.preventDefault?.();
    setError('');
    const email = regData.email.trim().toLowerCase();
    if (!regData.name.trim() || !email || !regData.password) {
      setError('Please fill in name, email, and password.');
      return;
    }
    if (regData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (users.find(u => u.email.toLowerCase() === email)) {
      setError('An account already exists with that email.');
      return;
    }
    if (regRole === 'ASSOCIATE' && !regData.city.trim()) {
      setError('Please enter your city.');
      return;
    }
    if (regRole === 'BORROWER' && !regData.companyName.trim()) {
      setError('Please enter your company / business name.');
      return;
    }

    const newUser = {
      id: `u_${uid()}`,
      role: regRole,
      email,
      password: regData.password,
      name: regData.name.trim(),
      phone: regData.phone.trim(),
      createdAt: new Date().toISOString(),
      ...(regRole === 'ASSOCIATE' && { city: regData.city.trim(), commission: Number(regData.commission) || 0.75 }),
      ...(regRole === 'BORROWER' && { companyName: regData.companyName.trim() }),
    };
    const next = [...users, newUser];
    setUsers(next);
    onLogin(newUser);
  };

  const demoAccounts = [
    { role: 'BACKOFFICE', email: 'admin@arthashala.in', password: 'admin123', label: 'Back Office', sub: 'Aarav Nair · Full pipeline access' },
    { role: 'ASSOCIATE', email: 'priya@arthashala.in', password: 'demo1234', label: 'Associate', sub: 'Priya Subramaniam · Chennai' },
    { role: 'BORROWER', email: 'sunil@meridian.in', password: 'demo1234', label: 'Borrower', sub: 'Sunil Mehta · Meridian Polymers' },
  ];

  return (
    <div className="min-h-screen bg-stone-100 font-sans">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left — brand panel */}
        <div className="hidden lg:flex flex-col justify-between bg-stone-900 text-stone-100 p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-3xl translate-y-1/3 -translate-x-1/3" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-amber-500 rounded-md grid place-items-center text-stone-900 font-serif italic text-2xl">A</div>
              <div>
                <div className="font-serif text-2xl leading-none">Arthashala</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-stone-400 mt-1">Loan Intermediation Suite</div>
              </div>
            </div>
          </div>

          <div className="relative max-w-md">
            <p className="font-serif text-4xl leading-tight text-stone-50">
              Where small and mid-sized businesses meet the right lenders.
            </p>
            <p className="text-stone-400 mt-5 leading-relaxed">
              From ₹50 Lakhs to ₹30 Crores. Secured or unsecured. Managed end-to-end by our team and a pan-India network of associates.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-4 pt-8 border-t border-stone-800">
            <div>
              <div className="font-serif text-3xl text-amber-400">₹210 Cr+</div>
              <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Facilitated</div>
            </div>
            <div>
              <div className="font-serif text-3xl text-amber-400">11</div>
              <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Lenders</div>
            </div>
            <div>
              <div className="font-serif text-3xl text-amber-400">18</div>
              <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Cities</div>
            </div>
          </div>
        </div>

        {/* Right — auth form */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-stone-900 rounded-md grid place-items-center text-amber-500 font-serif italic text-xl">A</div>
              <div>
                <div className="font-serif text-xl text-stone-900 leading-none">Arthashala</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 mt-0.5">Loan Intermediation</div>
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-md w-fit mb-8">
              {['login', 'register'].map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                    mode === m ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {m === 'login' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>

            {mode === 'login' && (
              <>
                <h1 className="font-serif text-3xl text-stone-900">Welcome back</h1>
                <p className="text-sm text-stone-600 mt-1 mb-6">Sign in to your Arthashala account.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <Input label="Email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@company.in" autoFocus />
                  <Input label="Password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  {error && <div className="text-sm text-rose-700 bg-rose-50 ring-1 ring-rose-200 rounded-md px-3 py-2">{error}</div>}
                  <Button type="submit" className="w-full" size="lg">Sign in</Button>
                </form>

                <div className="mt-8 pt-6 border-t border-stone-200">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-3">Or try a demo account</div>
                  <div className="space-y-2">
                    {demoAccounts.map(a => {
                      const meta = ROLE_META[a.role];
                      return (
                        <button
                          key={a.role}
                          onClick={() => submitLogin(a.email, a.password)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 bg-white ring-1 ring-stone-200 rounded-md hover:ring-stone-400 hover:bg-stone-50 transition-colors text-left group"
                        >
                          <div className="w-8 h-8 rounded-md bg-stone-100 text-stone-700 grid place-items-center group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors">
                            <meta.icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-stone-900">{a.label}</div>
                            <div className="text-xs text-stone-500 truncate">{a.sub}</div>
                          </div>
                          <ArrowRight size={14} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {mode === 'register' && (
              <>
                <h1 className="font-serif text-3xl text-stone-900">Create your account</h1>
                <p className="text-sm text-stone-600 mt-1 mb-6">Choose how you'll use Arthashala.</p>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  {['BORROWER', 'ASSOCIATE', 'BACKOFFICE'].map(r => {
                    const meta = ROLE_META[r];
                    const selected = regRole === r;
                    return (
                      <button
                        key={r}
                        onClick={() => setRegRole(r)}
                        className={`p-3 rounded-md text-left transition-colors ring-1 ${
                          selected ? 'bg-stone-900 text-stone-50 ring-stone-900' : 'bg-white ring-stone-200 text-stone-700 hover:ring-stone-400'
                        }`}
                      >
                        <meta.icon size={16} className={selected ? 'text-amber-400' : 'text-stone-500'} />
                        <div className="text-sm font-medium mt-2">{meta.label}</div>
                        <div className={`text-[10px] mt-1 leading-snug ${selected ? 'text-stone-400' : 'text-stone-500'}`}>{meta.blurb}</div>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <Input label="Full name" value={regData.name} onChange={(e) => setRegData({ ...regData, name: e.target.value })} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Email" type="email" value={regData.email} onChange={(e) => setRegData({ ...regData, email: e.target.value })} />
                    <Input label="Phone" value={regData.phone} onChange={(e) => setRegData({ ...regData, phone: e.target.value })} placeholder="+91 …" />
                  </div>
                  <Input label="Password" type="password" value={regData.password} onChange={(e) => setRegData({ ...regData, password: e.target.value })} hint="At least 6 characters" />

                  {regRole === 'ASSOCIATE' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                      <Input label="City" value={regData.city} onChange={(e) => setRegData({ ...regData, city: e.target.value })} placeholder="e.g. Mumbai" />
                      <Input label="Commission %" type="number" step="0.25" value={regData.commission} onChange={(e) => setRegData({ ...regData, commission: e.target.value })} hint="Typically 0.50–1.00%" />
                    </div>
                  )}

                  {regRole === 'BORROWER' && (
                    <div className="pt-2 border-t border-stone-100">
                      <Input label="Company / Business name" value={regData.companyName} onChange={(e) => setRegData({ ...regData, companyName: e.target.value })} placeholder="e.g. Meridian Polymers Pvt Ltd" />
                    </div>
                  )}

                  {error && <div className="text-sm text-rose-700 bg-rose-50 ring-1 ring-rose-200 rounded-md px-3 py-2">{error}</div>}
                  <Button type="submit" className="w-full" size="lg">Create account & continue</Button>
                </form>

                <p className="text-xs text-stone-500 mt-6 text-center">
                  By creating an account you agree to Arthashala's terms of service. This is a prototype — do not use real passwords.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ROOT APP
// ============================================================

export default function App() {
  // Inject serif font
  useEffect(() => {
    if (document.getElementById('fonts-link')) return;
    const link = document.createElement('link');
    link.id = 'fonts-link';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.textContent = `
      .font-serif { font-family: 'Instrument Serif', Georgia, serif; letter-spacing: -0.01em; }
      body, html, .font-sans { font-family: 'Manrope', system-ui, -apple-system, sans-serif; }
      * { -webkit-font-smoothing: antialiased; }
    `;
    document.head.appendChild(style);
  }, []);

  const [users, setUsers, usersLoaded] = useStorage('users_v1', SEED_USERS);
  const [leads, setLeads, leadsLoaded] = useStorage('leads_v2', SEED_LEADS);
  const [currentUserId, setCurrentUserId, sessionLoaded] = useStorage('session_v1', null);

  const [view, setView] = useState('dashboard');
  const [activeLeadId, setActiveLeadId] = useState(null);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [borrowerActiveLeadId, setBorrowerActiveLeadId] = useState(null);

  // Derived
  const currentUser = users.find(u => u.id === currentUserId) || null;
  const role = currentUser?.role;
  const associates = useMemo(() => users.filter(u => u.role === 'ASSOCIATE'), [users]);
  const myBorrowerLeads = useMemo(() => {
    if (role !== 'BORROWER' || !currentUser) return [];
    return leads
      .filter(l => l.borrowerUserId === currentUser.id || (l.email || '').toLowerCase() === currentUser.email.toLowerCase())
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [leads, currentUser, role]);

  // Reset ephemeral state on login change
  useEffect(() => {
    setActiveLeadId(null);
    setView('dashboard');
    setBorrowerActiveLeadId(null);
    setNewLeadOpen(false);
  }, [currentUserId]);

  // Default borrower's active lead to their most recent
  useEffect(() => {
    if (role === 'BORROWER' && myBorrowerLeads.length > 0 && !borrowerActiveLeadId) {
      setBorrowerActiveLeadId(myBorrowerLeads[0].id);
    }
  }, [role, myBorrowerLeads, borrowerActiveLeadId]);

  // Sidebar "refer new lead" / "apply for loan" opens modal
  useEffect(() => {
    if ((role === 'ASSOCIATE' || role === 'BORROWER') && view === 'new') {
      setNewLeadOpen(true);
      setView(role === 'BORROWER' ? 'dashboard' : 'leads');
    }
  }, [view, role]);

  const handleLogin = (user) => setCurrentUserId(user.id);
  const handleLogout = () => {
    setCurrentUserId(null);
  };

  const openLead = (id) => setActiveLeadId(id);
  const closeLead = () => setActiveLeadId(null);
  const activeLead = leads.find(l => l.id === activeLeadId);

  const createLead = (lead) => {
    const enriched = role === 'BORROWER'
      ? { ...lead, source: 'DIRECT', borrowerUserId: currentUser.id, associateId: null }
      : lead;
    setLeads([enriched, ...leads]);
    if (role === 'BORROWER') setBorrowerActiveLeadId(enriched.id);
  };

  if (!usersLoaded || !leadsLoaded || !sessionLoaded) {
    return (
      <div className="min-h-screen bg-stone-100 grid place-items-center">
        <div className="text-stone-500 text-sm">Loading…</div>
      </div>
    );
  }

  // Not logged in → Auth screen
  if (!currentUser) {
    return <AuthScreen users={users} setUsers={setUsers} onLogin={handleLogin} />;
  }

  const borrowerActiveLead = role === 'BORROWER'
    ? myBorrowerLeads.find(l => l.id === borrowerActiveLeadId) || myBorrowerLeads[0] || null
    : null;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <div className="flex">
        <Sidebar role={role} view={view} setView={setView} />

        <main className="flex-1 min-w-0 px-5 lg:px-10 py-8 max-w-7xl mx-auto w-full">
          {/* BACK OFFICE */}
          {role === 'BACKOFFICE' && !activeLeadId && (
            <>
              {view === 'dashboard' && <BackOfficeDashboard leads={leads} associates={associates} setView={setView} openLead={openLead} />}
              {view === 'leads' && <LeadsList leads={leads} associates={associates} openLead={openLead} onNewLead={() => setNewLeadOpen(true)} role={role} />}
              {view === 'associates' && <AssociatesList users={users} setUsers={setUsers} leads={leads} />}
              {view === 'lenders' && <LendersList leads={leads} />}
              {view === 'reports' && <Reports leads={leads} associates={associates} />}
            </>
          )}

          {/* ASSOCIATE */}
          {role === 'ASSOCIATE' && !activeLeadId && (
            <>
              {view === 'dashboard' && <AssociateDashboard leads={leads} currentAssociateId={currentUser.id} associates={associates} setView={setView} openLead={openLead} />}
              {view === 'leads' && <LeadsList leads={leads} associates={associates} openLead={openLead} onNewLead={() => setNewLeadOpen(true)} role={role} currentAssociateId={currentUser.id} />}
            </>
          )}

          {/* BORROWER */}
          {role === 'BORROWER' && !activeLeadId && (
            <>
              {myBorrowerLeads.length === 0 ? (
                <BorrowerEmpty currentUser={currentUser} onApply={() => setNewLeadOpen(true)} />
              ) : (
                <>
                  {myBorrowerLeads.length > 1 && (
                    <BorrowerAppSwitcher
                      apps={myBorrowerLeads}
                      activeId={borrowerActiveLead?.id}
                      onSelect={setBorrowerActiveLeadId}
                      onNewApp={() => setNewLeadOpen(true)}
                    />
                  )}
                  {borrowerActiveLead && view === 'dashboard' && <BorrowerDashboard lead={borrowerActiveLead} leads={leads} setLeads={setLeads} setView={setView} />}
                  {borrowerActiveLead && view === 'documents' && <BorrowerDocuments lead={borrowerActiveLead} leads={leads} setLeads={setLeads} />}
                  {borrowerActiveLead && view === 'profile' && <BorrowerProfile lead={borrowerActiveLead} />}
                </>
              )}
            </>
          )}

          {/* LEAD DETAIL */}
          {activeLead && (
            <LeadDetail
              lead={activeLead}
              associates={associates}
              leads={leads}
              setLeads={setLeads}
              onBack={closeLead}
              role={role}
            />
          )}
        </main>
      </div>

      <NewLeadForm
        open={newLeadOpen}
        onClose={() => setNewLeadOpen(false)}
        onCreate={createLead}
        role={role}
        currentUser={currentUser}
        currentAssociateId={currentUser.id}
        associates={associates}
      />
    </div>
  );
}

// Empty state for borrowers who haven't applied yet
const BorrowerEmpty = ({ currentUser, onApply }) => (
  <div className="min-h-[60vh] grid place-items-center">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-stone-900 text-amber-400 rounded-lg grid place-items-center font-serif italic text-3xl mx-auto">A</div>
      <h1 className="font-serif text-3xl text-stone-900 mt-6">Welcome, {currentUser.name.split(' ')[0]}</h1>
      <p className="text-sm text-stone-600 mt-3 leading-relaxed">
        You don't have any loan applications yet. Start a new application for <span className="text-stone-900">{currentUser.companyName}</span> and our team will guide you from KYC to disbursal.
      </p>
      <div className="mt-8">
        <Button size="lg" onClick={onApply}>
          <Plus size={14} /> Apply for a loan
        </Button>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-3 text-left">
        <div className="p-4 bg-white rounded-lg ring-1 ring-stone-200">
          <div className="font-serif text-2xl text-stone-900">₹50 L</div>
          <div className="text-xs text-stone-500 mt-1">Minimum ticket</div>
        </div>
        <div className="p-4 bg-white rounded-lg ring-1 ring-stone-200">
          <div className="font-serif text-2xl text-stone-900">₹30 Cr</div>
          <div className="text-xs text-stone-500 mt-1">Maximum ticket</div>
        </div>
        <div className="p-4 bg-white rounded-lg ring-1 ring-stone-200">
          <div className="font-serif text-2xl text-stone-900">11</div>
          <div className="text-xs text-stone-500 mt-1">Lender partners</div>
        </div>
      </div>
    </div>
  </div>
);

// Switcher for borrowers with multiple applications
const BorrowerAppSwitcher = ({ apps, activeId, onSelect, onNewApp }) => (
  <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
    {apps.map(a => (
      <button
        key={a.id}
        onClick={() => onSelect(a.id)}
        className={`shrink-0 px-3 py-2 rounded-md text-left transition-colors ring-1 ${
          a.id === activeId ? 'bg-stone-900 text-stone-50 ring-stone-900' : 'bg-white ring-stone-200 text-stone-700 hover:ring-stone-400'
        }`}
      >
        <div className="text-xs font-mono opacity-70">{a.id}</div>
        <div className="text-sm">{formatINR(a.loanAmount)} · {a.loanType}</div>
      </button>
    ))}
    <button
      onClick={onNewApp}
      className="shrink-0 px-3 py-2 rounded-md text-xs text-stone-600 hover:text-stone-900 ring-1 ring-dashed ring-stone-300 hover:ring-stone-500 inline-flex items-center gap-1.5"
    >
      <Plus size={12} /> New application
    </button>
  </div>
);
