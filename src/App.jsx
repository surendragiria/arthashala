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
  TrendingDown, Percent, Wallet, Settings, CircleDot, Sparkles,
  ShieldCheck, AlertTriangle, Gauge, ScrollText, Scale, Flag,
  Banknote, Receipt, PieChart, LineChart, FileBarChart, Fingerprint,
  BadgeCheck, RefreshCw
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

// Pre-qualification stages (before the loan pipeline kicks in)
const PREQUAL_STAGES = {
  NEW: { label: 'New', tone: 'sky', icon: CircleDot, desc: 'Just received, not yet contacted' },
  CONTACTED: { label: 'Contacted', tone: 'violet', icon: Phone, desc: 'First call / email made' },
  QUALIFIED: { label: 'Qualified', tone: 'indigo', icon: CheckCircle2, desc: 'Eligible and interested' },
  MANDATE_PENDING: { label: 'Mandate Pending', tone: 'amber', icon: ScrollText, desc: 'Awaiting mandate signature' },
  MANDATE_SIGNED: { label: 'Mandate Signed', tone: 'emerald', icon: FileCheck, desc: 'Ready to proceed to application' },
  CONVERTED: { label: 'Converted', tone: 'green', icon: CheckCheck, desc: 'Formal loan application created' },
  NOT_INTERESTED: { label: 'Not Interested', tone: 'stone', icon: XCircle, desc: 'Borrower declined' },
  NOT_ELIGIBLE: { label: 'Not Eligible', tone: 'rose', icon: XCircle, desc: 'Does not meet basic criteria' },
  DUPLICATE: { label: 'Duplicate', tone: 'stone', icon: Trash2, desc: 'Already in system' },
};
const PREQUAL_ORDER = ['NEW', 'CONTACTED', 'QUALIFIED', 'MANDATE_PENDING', 'MANDATE_SIGNED', 'CONVERTED'];

const LEAD_SOURCES = {
  DIRECT: { label: 'Direct', icon: User, desc: 'Direct inquiry — referral, word-of-mouth' },
  ASSOCIATE: { label: 'Associate', icon: Handshake, desc: 'Referred by an Arthashala associate' },
  WEBSITE: { label: 'Website', icon: Home, desc: 'Contact form / website inquiry' },
  DIGITAL_ADS: { label: 'Digital Ads', icon: Target, desc: 'Google, Meta, LinkedIn campaigns' },
  EVENT: { label: 'Event', icon: Calendar, desc: 'Trade expo, banker meet, conference' },
  COLD_OUTREACH: { label: 'Cold Outreach', icon: Phone, desc: 'Back-office initiated outbound' },
  PARTNER_REFERRAL: { label: 'Partner Referral', icon: Briefcase, desc: 'CA / auditor / consultant referral' },
};

const TOUCHPOINT_CHANNELS = {
  CALL: { label: 'Phone Call', icon: Phone },
  EMAIL: { label: 'Email', icon: Mail },
  WHATSAPP: { label: 'WhatsApp', icon: MessageSquare },
  MEETING: { label: 'Meeting', icon: Users },
  SMS: { label: 'SMS', icon: MessageSquare },
  SITE_VISIT: { label: 'Site Visit', icon: MapPin },
};

const TOUCHPOINT_OUTCOMES = {
  CONNECTED: { label: 'Connected — positive', tone: 'emerald' },
  CONNECTED_NEUTRAL: { label: 'Connected — informational', tone: 'sky' },
  NO_ANSWER: { label: 'No answer', tone: 'stone' },
  CALLBACK: { label: 'Requested callback', tone: 'amber' },
  NOT_INTERESTED: { label: 'Not interested', tone: 'rose' },
  DOCS_SENT: { label: 'Sent documents/info', tone: 'indigo' },
  DOCS_RECEIVED: { label: 'Received documents', tone: 'emerald' },
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
  { id: 'u_admin', role: 'ADMIN', email: 'admin@arthashala.in', password: 'admin123', name: 'Aarav Nair', phone: '+91 98111 00001', createdAt: '2024-01-05' },
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
    gstin: '24AABCM1234F1Z5', pan: 'AABCM1234F', aadhaar: '987654321012',
    turnover: 180000000, turnoverPrev: 142000000, netProfit: 18500000,
    existingLoans: true, existingAmount: 35000000, monthlyEmi: 420000,
    loanAmount: 80000000, loanType: 'Term Loan', secured: true, tenure: 84,
    purpose: 'Capex — new injection moulding line', collateral: 'Factory land & building, Sanand',
    source: 'DIRECT', sourceDetail: 'Referred by existing client Kapoor Industries', associateId: null, assignedTo: 'Back Office',
    status: 'SENT_TO_LENDERS',
    prequalStage: 'CONVERTED',
    nextFollowUp: null,
    touchpoints: [
      { id: 't1', at: '2026-04-16T10:45:00', by: 'Aarav Nair', channel: 'CALL', outcome: 'CONNECTED', note: 'Initial call. Borrower explained capex plans. Ticket size and profile fit our book. Scheduled doc collection.', nextAction: 'Collect KYC + 3-yr financials', nextDate: '2026-04-16' },
      { id: 't2', at: '2026-04-16T15:20:00', by: 'Neha Iyer', channel: 'EMAIL', outcome: 'DOCS_SENT', note: 'Sent document checklist + mandate for review.', nextAction: 'Follow up on mandate signing', nextDate: '2026-04-17' },
      { id: 't3', at: '2026-04-17T10:15:00', by: 'Aarav Nair', channel: 'WHATSAPP', outcome: 'DOCS_RECEIVED', note: 'Mandate signed. KYC + GSTR-3B received.', nextAction: 'Credit review', nextDate: '2026-04-17' },
    ],
    mandate: {
      status: 'Signed',
      generatedAt: '2026-04-16T15:15:00',
      sentAt: '2026-04-16T15:20:00',
      signedAt: '2026-04-17T09:42:00',
      feePercent: 1.5, feeCap: null, validity: 90,
      authorizedLenders: 'All empanelled lenders (HDFC, ICICI, Axis, Kotak, IDFC First, Bajaj Finserv, Tata Capital, Lendingkart)',
      signedBy: { name: 'Sunil Mehta', ip: '103.22.14.88', userAgent: 'Safari 17.3 · iPhone' },
      documentId: 'MND-2026-00412',
      consents: { authorization: true, fee: true },
    },
    verifications: {
      pan: { status: 'Verified', verifiedAt: '2026-04-16T11:30:00', verifiedBy: 'Aarav Nair',
        raw: { pan: 'AABCM1234F', name: 'Meridian Polymers Pvt Ltd', entityType: 'Company', status: 'Active', aadhaarLinked: true, lastUpdated: '2025-09-12' } },
      gstin: { status: 'Verified', verifiedAt: '2026-04-16T11:32:00', verifiedBy: 'Aarav Nair',
        raw: { gstin: '24AABCM1234F1Z5', legalName: 'Meridian Polymers Pvt Ltd', tradeName: 'Meridian Polymers', state: 'Gujarat', registrationDate: '2019-07-15', status: 'Active', taxpayerType: 'Regular' } },
      aadhaar: { status: 'Verified', verifiedAt: '2026-04-16T11:35:00', verifiedBy: 'Aarav Nair',
        raw: { maskedAadhaar: 'XXXX XXXX 1012', name: 'Sunil Mehta', nameMatch: 'Exact', gender: 'M', ageBand: '40-50', mobileLinked: true, method: 'OTP-based eKYC' } },
    },
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
    creditReview: {
      cibilScore: 756,
      bankingConduct: 'Excellent',
      promoterBackground: 'Founder-promoter has 22 years in polymer manufacturing. Previously ran a smaller plastics unit in Rajkot (divested cleanly in 2012). No related-party concerns. Two references from existing lenders confirmed strong repayment track record.',
      notes: 'Site visit on 16 Apr — plant well-maintained, capacity utilisation at ~78%. Bank statements show consistent inflows, no bounces in last 18 months. GST filings regular. Promoter confident on new injection moulding line payback within 4 years.',
      lastUpdatedBy: 'Aarav Nair',
      lastUpdatedAt: '2026-04-17T14:00:00',
      history: [
        {
          id: 'h1',
          at: '2026-04-17T14:00:00',
          by: 'Aarav Nair',
          score: 82,
          recommendation: 'PROCEED',
          reason: 'Strong financials (45% turnover growth, 10% PAT margin), clean CIBIL at 756, healthy DSCR at 2.1x. Promoter track record vetted. Approved to share with HDFC, Axis, and Bajaj Finserv given secured term loan nature.',
          cibilScore: 756,
        }
      ]
    },
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
  // -------- PRE-QUALIFICATION STAGE LEADS (not yet formal applications) --------
  {
    id: 'L-00420', createdAt: '2026-04-19T09:15:00', updatedAt: '2026-04-19T09:15:00',
    companyName: 'Anand Diesel Engineering', contactName: 'Pratap Anand', designation: 'Proprietor',
    phone: '+91 98900 12345', email: 'pratap@ananddiesel.in',
    businessType: 'Proprietorship', industry: 'Manufacturing', vintage: 8,
    city: 'Kolhapur', state: 'Maharashtra', pin: '416003',
    gstin: '27AAFPA1122Q1Z4', pan: 'AAFPA1122Q', aadhaar: '',
    turnover: 42000000, turnoverPrev: 36000000, netProfit: 2900000,
    existingLoans: false, existingAmount: 0, monthlyEmi: 0,
    loanAmount: 12000000, loanType: 'Machinery Loan', secured: true, tenure: 60,
    purpose: 'Purchase CNC lathes for capacity expansion',
    collateral: 'Machinery hypothecation',
    source: 'DIGITAL_ADS', sourceDetail: 'Google Ads — "business loan machinery"', associateId: null, assignedTo: 'Back Office',
    status: 'NEW', prequalStage: 'NEW',
    nextFollowUp: '2026-04-19',
    touchpoints: [],
    documents: [], lenders: [],
    notes: [{ text: 'Inbound lead from Google Ads campaign. Contacted via web form.', by: 'System', at: '2026-04-19T09:15:00' }],
  },
  {
    id: 'L-00419', createdAt: '2026-04-18T14:30:00', updatedAt: '2026-04-19T11:00:00',
    companyName: 'Lakshmi Handlooms', contactName: 'Suma Devi', designation: 'Partner',
    phone: '+91 98456 78901', email: 'suma@lakshmihandlooms.in',
    businessType: 'Partnership', industry: 'Textiles', vintage: 14,
    city: 'Karur', state: 'Tamil Nadu', pin: '639001',
    gstin: '33AAFFL5566H1Z2', pan: 'AAFFL5566H', aadhaar: '',
    turnover: 88000000, turnoverPrev: 75000000, netProfit: 6800000,
    existingLoans: true, existingAmount: 18000000, monthlyEmi: 285000,
    loanAmount: 35000000, loanType: 'Working Capital', secured: true, tenure: 12,
    purpose: 'Festive season inventory & export order financing',
    collateral: 'Stock & receivables',
    source: 'ASSOCIATE', sourceDetail: 'Referred by Priya (Chennai)', associateId: 'a2', assignedTo: 'Back Office',
    status: 'NEW', prequalStage: 'CONTACTED',
    nextFollowUp: '2026-04-21',
    touchpoints: [
      { id: 't1', at: '2026-04-19T11:00:00', by: 'Priya Subramaniam', channel: 'CALL', outcome: 'CONNECTED', note: 'First call. Genuine need, healthy business. Promised to send doc list via WhatsApp.', nextAction: 'Send eligibility + doc checklist', nextDate: '2026-04-21' },
    ],
    documents: [], lenders: [],
    notes: [],
  },
  {
    id: 'L-00418', createdAt: '2026-04-17T16:00:00', updatedAt: '2026-04-19T10:00:00',
    companyName: 'Om Shivam Retail', contactName: 'Harshad Joshi', designation: 'Director',
    phone: '+91 98201 33445', email: 'harshad@omshivam.in',
    businessType: 'Private Limited', industry: 'Retail', vintage: 11,
    city: 'Nashik', state: 'Maharashtra', pin: '422005',
    gstin: '27AACCO7788R1Z9', pan: 'AACCO7788R', aadhaar: '',
    turnover: 125000000, turnoverPrev: 98000000, netProfit: 8900000,
    existingLoans: true, existingAmount: 22000000, monthlyEmi: 320000,
    loanAmount: 45000000, loanType: 'Term Loan', secured: true, tenure: 72,
    purpose: 'Open 4 new outlets in Pune and Aurangabad',
    collateral: 'Commercial property',
    source: 'EVENT', sourceDetail: 'Retailers meet — April 2026', associateId: null, assignedTo: 'Back Office',
    status: 'NEW', prequalStage: 'QUALIFIED',
    nextFollowUp: '2026-04-20',
    touchpoints: [
      { id: 't1', at: '2026-04-18T09:30:00', by: 'Aarav Nair', channel: 'CALL', outcome: 'CONNECTED', note: 'Discussed expansion plan. Eligible — good vintage, growing business.', nextAction: 'Share mandate', nextDate: '2026-04-19' },
      { id: 't2', at: '2026-04-19T10:00:00', by: 'Aarav Nair', channel: 'EMAIL', outcome: 'DOCS_SENT', note: 'Mandate generated and emailed for signing.', nextAction: 'Follow up on signing', nextDate: '2026-04-20' },
    ],
    documents: [], lenders: [],
    notes: [],
    mandate: {
      status: 'Sent', generatedAt: '2026-04-19T09:55:00', sentAt: '2026-04-19T10:00:00',
      feePercent: 1.5, feeCap: null, validity: 90,
      authorizedLenders: 'All empanelled lenders',
      documentId: 'MND-2026-00418',
      consents: { authorization: false, fee: false },
    },
  },
  {
    id: 'L-00417', createdAt: '2026-04-17T11:00:00', updatedAt: '2026-04-18T16:00:00',
    companyName: 'TechBridge Solutions', contactName: 'Rohan Sharma', designation: 'Founder',
    phone: '+91 98711 22334', email: 'rohan@techbridge.co.in',
    businessType: 'Private Limited', industry: 'IT / Software', vintage: 4,
    city: 'Bengaluru', state: 'Karnataka', pin: '560100',
    gstin: '29AACCT1122G1Z6', pan: 'AACCT1122G', aadhaar: '',
    turnover: 28000000, turnoverPrev: 18000000, netProfit: 2400000,
    existingLoans: false, existingAmount: 0, monthlyEmi: 0,
    loanAmount: 15000000, loanType: 'Unsecured Business Loan', secured: false, tenure: 36,
    purpose: 'Hiring + working capital',
    collateral: null,
    source: 'WEBSITE', sourceDetail: 'Website contact form', associateId: null, assignedTo: 'Back Office',
    status: 'NEW', prequalStage: 'MANDATE_PENDING',
    nextFollowUp: '2026-04-20',
    touchpoints: [
      { id: 't1', at: '2026-04-17T11:30:00', by: 'Neha Iyer', channel: 'CALL', outcome: 'CONNECTED', note: 'Founder walked through business. Good story, fast growth, but vintage is just 4 years.', nextAction: 'Share mandate', nextDate: '2026-04-18' },
      { id: 't2', at: '2026-04-18T10:00:00', by: 'Neha Iyer', channel: 'EMAIL', outcome: 'DOCS_SENT', note: 'Mandate shared.', nextAction: 'Call to walk through mandate', nextDate: '2026-04-18' },
      { id: 't3', at: '2026-04-18T16:00:00', by: 'Neha Iyer', channel: 'CALL', outcome: 'CALLBACK', note: 'Founder wants to review with his co-founder before signing. Will confirm tomorrow.', nextAction: 'Follow up', nextDate: '2026-04-20' },
    ],
    documents: [], lenders: [],
    notes: [],
    mandate: {
      status: 'Sent', generatedAt: '2026-04-18T09:50:00', sentAt: '2026-04-18T10:00:00',
      feePercent: 2.0, feeCap: 500000, validity: 90,
      authorizedLenders: 'NBFCs only (Bajaj Finserv, Tata Capital, Aditya Birla, Lendingkart, Indifi)',
      documentId: 'MND-2026-00417',
      consents: { authorization: false, fee: false },
    },
  },
  {
    id: 'L-00416', createdAt: '2026-04-16T12:00:00', updatedAt: '2026-04-17T09:00:00',
    companyName: 'Sharma Garments', contactName: 'Raj Sharma', designation: 'Proprietor',
    phone: '+91 98765 00011', email: 'raj@sharmagarments.in',
    businessType: 'Proprietorship', industry: 'Textiles', vintage: 2,
    city: 'Ludhiana', state: 'Punjab', pin: '141001',
    gstin: '', pan: '', aadhaar: '',
    turnover: 8000000, turnoverPrev: 3000000, netProfit: 300000,
    existingLoans: false, existingAmount: 0, monthlyEmi: 0,
    loanAmount: 5000000, loanType: 'Working Capital', secured: false, tenure: 12,
    purpose: 'Working capital',
    collateral: null,
    source: 'COLD_OUTREACH', sourceDetail: 'Data list — Ludhiana textile SMEs', associateId: null, assignedTo: 'Back Office',
    status: 'NEW', prequalStage: 'NOT_ELIGIBLE',
    prequalDropReason: 'Vintage < 3 years and turnover below ₹1 Cr threshold for most lenders',
    nextFollowUp: null,
    touchpoints: [
      { id: 't1', at: '2026-04-17T09:00:00', by: 'Aarav Nair', channel: 'CALL', outcome: 'NOT_INTERESTED', note: 'Business too young for our lender panel. Advised to approach MUDRA / local co-operative bank.', nextAction: null, nextDate: null },
    ],
    documents: [], lenders: [],
    notes: [],
  },
];

// ============================================================
// STORAGE HOOKS
// ============================================================

function useStorage(key, seed) {
  const [data, setData] = useState(seed);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        setData(JSON.parse(raw));
      } else {
        localStorage.setItem(key, JSON.stringify(seed));
        setData(seed);
      }
    } catch {
      setData(seed);
    }
    setLoaded(true);
    // eslint-disable-next-line
  }, []);

  const save = (next) => {
    const value = typeof next === 'function' ? next(data) : next;
    setData(value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
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
  ADMIN: { label: 'Administrator', icon: ShieldCheck, blurb: 'Full system access. Manage users, permissions, and configuration.' },
  BACKOFFICE: { label: 'Back Office', icon: Briefcase, blurb: 'Manage the pipeline, associates, and lender submissions.' },
  ASSOCIATE: { label: 'Associate', icon: Network, blurb: 'Refer leads and track your commissions.' },
  BORROWER: { label: 'Borrower', icon: Building2, blurb: 'Apply for a loan and track its progress.' },
};

// Permissions catalog — grouped by module, each entry is a toggle per role
const PERMISSIONS = {
  LEAD_VIEW_ALL: { label: 'View all leads', group: 'Leads', default: ['ADMIN', 'BACKOFFICE'] },
  LEAD_CREATE: { label: 'Create new lead', group: 'Leads', default: ['ADMIN', 'BACKOFFICE', 'ASSOCIATE', 'BORROWER'] },
  LEAD_EDIT: { label: 'Edit lead details', group: 'Leads', default: ['ADMIN', 'BACKOFFICE'] },
  LEAD_DELETE: { label: 'Delete lead', group: 'Leads', default: ['ADMIN'] },
  LEAD_CHANGE_STATUS: { label: 'Change lead status', group: 'Leads', default: ['ADMIN', 'BACKOFFICE'] },
  CREDIT_VIEW: { label: 'View credit review', group: 'Credit', default: ['ADMIN', 'BACKOFFICE'] },
  CREDIT_EDIT: { label: 'Edit credit review', group: 'Credit', default: ['ADMIN', 'BACKOFFICE'] },
  VERIFY_KYC: { label: 'Run KYC verifications', group: 'Credit', default: ['ADMIN', 'BACKOFFICE'] },
  MANDATE_GENERATE: { label: 'Generate mandate', group: 'Mandate', default: ['ADMIN', 'BACKOFFICE'] },
  MANDATE_SIGN: { label: 'Sign mandate', group: 'Mandate', default: ['BORROWER'] },
  LENDER_SUBMIT: { label: 'Submit to lenders', group: 'Lenders', default: ['ADMIN', 'BACKOFFICE'] },
  LENDER_MANAGE: { label: 'Manage lender panel', group: 'Lenders', default: ['ADMIN'] },
  ASSOCIATE_MANAGE: { label: 'Manage associates', group: 'Users', default: ['ADMIN', 'BACKOFFICE'] },
  USER_MANAGE: { label: 'Manage all users', group: 'Users', default: ['ADMIN'] },
  PERMISSIONS_EDIT: { label: 'Edit role permissions', group: 'Admin', default: ['ADMIN'] },
  REPORTS_VIEW: { label: 'View management reports', group: 'Reports', default: ['ADMIN', 'BACKOFFICE'] },
  REPORTS_EXPORT: { label: 'Export reports', group: 'Reports', default: ['ADMIN', 'BACKOFFICE'] },
  SETTINGS_EDIT: { label: 'Edit system settings', group: 'Admin', default: ['ADMIN'] },
  AUDIT_VIEW: { label: 'View audit log', group: 'Admin', default: ['ADMIN'] },
};

const DEFAULT_PERMISSIONS = Object.fromEntries(
  Object.entries(PERMISSIONS).map(([k, v]) => [k, v.default])
);

const DEFAULT_SETTINGS = {
  orgName: 'Arthashala',
  orgTagline: 'Loan Intermediation Suite',
  orgAddress: '',
  orgGSTIN: '',
  orgPAN: '',
  defaultFeePercent: 1.5,
  defaultFeeCap: null,
  defaultValidity: 90,
  gstRate: 0.18,
  minTicket: 5000000,   // ₹50 L
  maxTicket: 300000000, // ₹30 Cr
  associateCommissionDefault: 0.75,
  requiredDocs: REQUIRED_DOCS,
  loanTypes: LOAN_TYPES,
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
    ADMIN: [
      { k: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { k: 'leads', label: 'All Leads', icon: Inbox },
      { k: 'associates', label: 'Associates', icon: Handshake },
      { k: 'lenders', label: 'Lenders', icon: Landmark },
      { k: 'reports', label: 'Reports', icon: BarChart3 },
      { k: 'admin', label: 'Admin', icon: Settings, divider: true },
    ],
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
  const items = menus[role] || [];

  return (
    <aside className="hidden md:block w-60 shrink-0 border-r border-stone-200 bg-stone-100/40">
      <nav className="sticky top-16 p-3 space-y-0.5">
        {items.map(item => (
          <React.Fragment key={item.k}>
            {item.divider && <div className="my-3 h-px bg-stone-200 mx-3" />}
            <button
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
          </React.Fragment>
        ))}
        <div className="pt-6 px-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400">Role</p>
          <p className="text-xs text-stone-600 mt-1">
            {role === 'ADMIN' && 'Administrator. Full access to all modules, users, and configuration.'}
            {role === 'BACKOFFICE' && 'Full pipeline access — manage leads, associates, and lender integrations.'}
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

const LeadManagementWidgets = ({ leads, openLead, setView }) => {
  // Today & overdue follow-ups
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayLeads = leads.filter(l => {
    if (!l.nextFollowUp) return false;
    const d = new Date(l.nextFollowUp); d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime() && !['CONVERTED', 'NOT_INTERESTED', 'NOT_ELIGIBLE', 'DUPLICATE'].includes(l.prequalStage);
  });
  const overdueLeads = leads.filter(l => {
    if (!l.nextFollowUp) return false;
    const d = new Date(l.nextFollowUp); d.setHours(0, 0, 0, 0);
    return d < today && !['CONVERTED', 'NOT_INTERESTED', 'NOT_ELIGIBLE', 'DUPLICATE'].includes(l.prequalStage);
  });

  // Pre-qual pipeline
  const prequalCounts = PREQUAL_ORDER.map(stage => ({
    stage,
    count: leads.filter(l => l.prequalStage === stage).length,
    amount: leads.filter(l => l.prequalStage === stage).reduce((s, l) => s + Number(l.loanAmount || 0), 0),
  }));
  const prequalTotal = prequalCounts.reduce((s, p) => s + p.count, 0);

  // Source mix (last 30 days)
  const thirtyAgo = Date.now() - 30 * 86400000;
  const recentLeads = leads.filter(l => new Date(l.createdAt).getTime() > thirtyAgo);
  const sourceCounts = {};
  Object.keys(LEAD_SOURCES).forEach(k => { sourceCounts[k] = 0; });
  recentLeads.forEach(l => { sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1; });
  const topSources = Object.entries(sourceCounts)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1]);
  const maxSourceCount = topSources.length ? topSources[0][1] : 1;

  // Mandate status
  const mandateStats = {
    signed: leads.filter(l => l.mandate?.status === 'Signed').length,
    pending: leads.filter(l => l.mandate?.status === 'Sent').length,
    draft: leads.filter(l => l.mandate?.status === 'Draft').length,
    none: leads.filter(l => !l.mandate && !['NOT_INTERESTED', 'NOT_ELIGIBLE', 'DUPLICATE', 'CONVERTED'].includes(l.prequalStage)).length,
  };

  return (
    <div className="space-y-6">
      {/* Follow-ups row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FollowUpBucket
          title="Overdue follow-ups"
          tone="rose"
          leads={overdueLeads}
          openLead={openLead}
          emptyMsg="No overdue follow-ups"
          icon={AlertTriangle}
        />
        <FollowUpBucket
          title="Today's follow-ups"
          tone="amber"
          leads={todayLeads}
          openLead={openLead}
          emptyMsg="No follow-ups due today"
          icon={Clock}
        />
        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <ScrollText size={14} className="text-stone-700" />
            <h3 className="font-serif text-base text-stone-900">Mandate status</h3>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <Badge tone="emerald"><BadgeCheck size={10} className="inline -mt-0.5 mr-0.5" /> Signed</Badge>
              <span className="tabular-nums font-medium text-stone-900">{mandateStats.signed}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <Badge tone="amber"><Clock size={10} className="inline -mt-0.5 mr-0.5" /> Awaiting signature</Badge>
              <span className="tabular-nums font-medium text-stone-900">{mandateStats.pending}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <Badge tone="stone">Draft</Badge>
              <span className="tabular-nums font-medium text-stone-900">{mandateStats.draft}</span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-stone-100">
              <span className="text-xs text-stone-500">Active leads without mandate</span>
              <span className="tabular-nums font-medium text-rose-700">{mandateStats.none}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-qual funnel + Source mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target size={14} className="text-stone-700" />
            <h3 className="font-serif text-base text-stone-900">Pre-qualification pipeline</h3>
            <span className="ml-auto text-xs text-stone-500">{prequalTotal} leads</span>
          </div>
          <div className="space-y-2.5">
            {prequalCounts.map(p => {
              const meta = PREQUAL_STAGES[p.stage];
              const pct = prequalTotal > 0 ? (p.count / prequalTotal) * 100 : 0;
              return (
                <div key={p.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5">
                      <meta.icon size={11} className="text-stone-500" />
                      <span className="text-stone-800">{meta.label}</span>
                    </span>
                    <span className="tabular-nums text-stone-600">{p.count} · {formatINR(p.amount)}</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${pct}%`,
                      backgroundColor:
                        meta.tone === 'sky' ? '#7dd3fc' :
                        meta.tone === 'violet' ? '#c4b5fd' :
                        meta.tone === 'indigo' ? '#a5b4fc' :
                        meta.tone === 'amber' ? '#fcd34d' :
                        meta.tone === 'emerald' ? '#6ee7b7' :
                        meta.tone === 'green' ? '#86efac' : '#d6d3d1'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={14} className="text-stone-700" />
            <h3 className="font-serif text-base text-stone-900">Lead sources · last 30 days</h3>
            <span className="ml-auto text-xs text-stone-500">{recentLeads.length} new</span>
          </div>
          {topSources.length === 0 ? (
            <div className="text-sm text-stone-500 py-6 text-center">No new leads in the last 30 days.</div>
          ) : (
            <div className="space-y-2.5">
              {topSources.map(([src, count]) => {
                const meta = LEAD_SOURCES[src];
                return (
                  <div key={src}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-1.5">
                        <meta.icon size={11} className="text-stone-500" />
                        <span className="text-stone-800">{meta.label}</span>
                      </span>
                      <span className="tabular-nums text-stone-600">{count}</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-stone-800 rounded-full" style={{ width: `${(count / maxSourceCount) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FollowUpBucket = ({ title, tone, leads, openLead, emptyMsg, icon: Icon }) => (
  <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
    <div className="flex items-center gap-2 mb-4">
      <Icon size={14} className={tone === 'rose' ? 'text-rose-600' : tone === 'amber' ? 'text-amber-600' : 'text-stone-700'} />
      <h3 className="font-serif text-base text-stone-900">{title}</h3>
      <span className={`ml-auto tabular-nums text-sm font-medium ${tone === 'rose' ? 'text-rose-700' : tone === 'amber' ? 'text-amber-700' : 'text-stone-900'}`}>{leads.length}</span>
    </div>
    {leads.length === 0 ? (
      <div className="text-sm text-stone-500 py-4 text-center">{emptyMsg}</div>
    ) : (
      <ul className="space-y-2 max-h-56 overflow-y-auto">
        {leads.slice(0, 6).map(l => {
          const stageMeta = PREQUAL_STAGES[l.prequalStage] || { label: 'Unknown', tone: 'stone' };
          return (
            <li key={l.id}>
              <button
                onClick={() => openLead(l.id)}
                className="w-full text-left flex items-center justify-between gap-3 p-2 rounded-md hover:bg-stone-50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm text-stone-900 truncate">{l.companyName}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="font-mono">{l.id}</span>
                    <Badge tone={stageMeta.tone}>{stageMeta.label}</Badge>
                  </div>
                </div>
                <div className="text-xs tabular-nums text-stone-500 shrink-0">{formatINR(l.loanAmount)}</div>
              </button>
            </li>
          );
        })}
        {leads.length > 6 && <li className="text-xs text-stone-500 text-center pt-1">+{leads.length - 6} more</li>}
      </ul>
    )}
  </div>
);

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

      <LeadManagementWidgets leads={leads} openLead={openLead} setView={setView} />

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
// VERIFICATIONS & ANALYSIS — PAN, GST, Aadhaar, GST Analysis,
// Bank Statement Analysis, Financial Statement Analysis, Composite Scoring
// ============================================================

// --- PAN / GST / Aadhaar format validation ---
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const AADHAAR_RE = /^[0-9]{12}$/;
const maskAadhaar = (a) => (a && a.length === 12) ? `XXXX XXXX ${a.slice(-4)}` : a;
const maskPAN = (p) => (p && p.length === 10) ? `${p.slice(0, 3)}XX${p.slice(5, 9)}X` : p;

// --- Simulated verification APIs (replace with Signzy/Karza/Zoop in prod) ---
async function verifyPAN(pan, expectedEntityName) {
  await new Promise(r => setTimeout(r, 900)); // simulate network
  if (!PAN_RE.test(pan || '')) {
    return { status: 'Failed', reason: 'Invalid PAN format', raw: { pan } };
  }
  // Deterministic simulation: 4th char tells us entity type
  const types = { C: 'Company', P: 'Individual', H: 'HUF', F: 'Firm', T: 'Trust', A: 'AOP', B: 'BOI', L: 'Local Authority' };
  const entityType = types[pan[3]] || 'Unknown';
  return {
    status: 'Verified',
    verifiedAt: new Date().toISOString(),
    raw: {
      pan,
      name: expectedEntityName,
      entityType,
      status: 'Active',
      aadhaarLinked: true,
      lastUpdated: '2025-09-12',
    }
  };
}

async function verifyGSTIN(gstin, expectedEntityName) {
  await new Promise(r => setTimeout(r, 1100));
  if (!GSTIN_RE.test(gstin || '')) {
    return { status: 'Failed', reason: 'Invalid GSTIN format', raw: { gstin } };
  }
  const stateCodes = { '24': 'Gujarat', '27': 'Maharashtra', '33': 'Tamil Nadu', '29': 'Karnataka', '06': 'Haryana', '36': 'Telangana', '08': 'Rajasthan', '19': 'West Bengal', '09': 'Uttar Pradesh', '07': 'Delhi' };
  const state = stateCodes[gstin.slice(0, 2)] || 'Unknown';
  return {
    status: 'Verified',
    verifiedAt: new Date().toISOString(),
    raw: {
      gstin,
      legalName: expectedEntityName,
      tradeName: expectedEntityName,
      state,
      registrationDate: '2019-07-15',
      status: 'Active',
      taxpayerType: 'Regular',
      natureOfBusiness: 'Wholesale Business, Retail Business',
      lastFiling: 'GSTR-3B (Feb 2026) — filed on time',
    }
  };
}

async function verifyAadhaar(aadhaar, expectedName) {
  await new Promise(r => setTimeout(r, 1300));
  if (!AADHAAR_RE.test(aadhaar || '')) {
    return { status: 'Failed', reason: 'Invalid Aadhaar format', raw: {} };
  }
  // Simulated OTP-based eKYC (in prod: trigger OTP to promoter's registered mobile)
  return {
    status: 'Verified',
    verifiedAt: new Date().toISOString(),
    raw: {
      maskedAadhaar: maskAadhaar(aadhaar),
      name: expectedName,
      nameMatch: 'Exact',
      gender: 'M',
      ageBand: '40-50',
      mobileLinked: true,
      method: 'OTP-based eKYC',
    }
  };
}

// --- Seeded deterministic "synthetic" data for GST / Bank analysis demo ---
// Uses lead id as seed so same lead always produces same numbers
function seedFromLead(leadId) {
  let h = 0;
  for (let i = 0; i < leadId.length; i++) h = ((h << 5) - h) + leadId.charCodeAt(i);
  return () => { h = (h * 9301 + 49297) % 233280; return h / 233280; };
}

function generateGSTData(lead) {
  const rand = seedFromLead(lead.id + 'gst');
  const monthlyTurnover = (lead.turnover || 0) / 12;
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const seasonality = 0.75 + rand() * 0.5; // 0.75–1.25
    const sales = Math.round(monthlyTurnover * seasonality);
    const taxRate = 0.18;
    const tax = Math.round(sales * taxRate);
    const taxPaid = Math.round(tax * (0.88 + rand() * 0.10));
    const filedOnTime = rand() > 0.15;
    const filedAt = filedOnTime ? 'On time' : `${1 + Math.floor(rand() * 8)}d late`;
    months.push({
      month: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
      sales,
      tax,
      taxPaid,
      filedOnTime,
      filedAt,
      nilReturn: sales === 0,
    });
  }
  return months;
}

function analyzeGST(gstData) {
  const total = gstData.reduce((s, m) => s + m.sales, 0);
  const avg = total / gstData.length;
  const maxMonth = Math.max(...gstData.map(m => m.sales));
  const minMonth = Math.min(...gstData.map(m => m.sales));
  const variance = gstData.reduce((s, m) => s + Math.pow(m.sales - avg, 2), 0) / gstData.length;
  const cv = avg > 0 ? Math.sqrt(variance) / avg : 1;
  const onTimeCount = gstData.filter(m => m.filedOnTime).length;
  const onTimeRate = onTimeCount / gstData.length;
  const nilCount = gstData.filter(m => m.nilReturn).length;
  const taxToSales = total > 0 ? gstData.reduce((s, m) => s + m.taxPaid, 0) / (total * 0.18) : 0;
  const recentHalf = gstData.slice(6);
  const earlierHalf = gstData.slice(0, 6);
  const recentTotal = recentHalf.reduce((s, m) => s + m.sales, 0);
  const earlierTotal = earlierHalf.reduce((s, m) => s + m.sales, 0);
  const halfYearGrowth = earlierTotal > 0 ? (recentTotal / earlierTotal - 1) : 0;

  // Scoring
  const sub = {};
  sub.filing = onTimeRate >= 0.95 ? 100 : onTimeRate >= 0.85 ? 80 : onTimeRate >= 0.70 ? 55 : 25;
  sub.stability = cv <= 0.15 ? 100 : cv <= 0.25 ? 80 : cv <= 0.40 ? 55 : 25;
  sub.growth = halfYearGrowth >= 0.15 ? 100 : halfYearGrowth >= 0 ? 75 : halfYearGrowth >= -0.10 ? 45 : 20;
  sub.taxCompliance = taxToSales >= 0.92 ? 100 : taxToSales >= 0.80 ? 75 : taxToSales >= 0.65 ? 45 : 20;
  sub.nilReturns = nilCount === 0 ? 100 : nilCount <= 1 ? 75 : nilCount <= 3 ? 45 : 15;

  const score = Math.round(
    sub.filing * 0.30 + sub.stability * 0.25 + sub.growth * 0.20 +
    sub.taxCompliance * 0.15 + sub.nilReturns * 0.10
  );

  return {
    score,
    sub,
    stats: {
      totalSales: total,
      avgMonthly: avg,
      maxMonth,
      minMonth,
      cv,
      onTimeRate,
      nilCount,
      halfYearGrowth,
      taxCompliance: taxToSales,
    }
  };
}

function generateBankData(lead) {
  const rand = seedFromLead(lead.id + 'bank');
  const monthlyTurnover = (lead.turnover || 0) / 12;
  const months = [];
  const now = new Date();
  let runningBalance = monthlyTurnover * 0.35;
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const inflow = Math.round(monthlyTurnover * (0.90 + rand() * 0.25));
    const outflow = Math.round(inflow * (0.85 + rand() * 0.12));
    const avgBalance = Math.round(runningBalance + (rand() - 0.5) * monthlyTurnover * 0.1);
    const closingBalance = Math.round(avgBalance + inflow - outflow);
    const inwardBounces = rand() < 0.08 ? Math.floor(1 + rand() * 2) : 0;
    const outwardBounces = rand() < 0.05 ? 1 : 0;
    const cashDepositPct = 0.02 + rand() * 0.08;
    const emiDebit = Math.round((lead.monthlyEmi || 0) * (0.98 + rand() * 0.04));
    runningBalance = closingBalance;
    months.push({
      month: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
      inflow, outflow, avgBalance, closingBalance,
      inwardBounces, outwardBounces,
      cashDepositPct,
      emiDebit,
      credits: Math.floor(20 + rand() * 40),
      debits: Math.floor(30 + rand() * 50),
    });
  }
  return months;
}

function analyzeBank(bankData, lead) {
  const totalInflow = bankData.reduce((s, m) => s + m.inflow, 0);
  const totalOutflow = bankData.reduce((s, m) => s + m.outflow, 0);
  const avgBalance = bankData.reduce((s, m) => s + m.avgBalance, 0) / bankData.length;
  const minAvgBalance = Math.min(...bankData.map(m => m.avgBalance));
  const totalBounces = bankData.reduce((s, m) => s + m.inwardBounces + m.outwardBounces, 0);
  const avgMonthlyInflow = totalInflow / 12;
  const avgCashPct = bankData.reduce((s, m) => s + m.cashDepositPct, 0) / bankData.length;

  const recentHalf = bankData.slice(6);
  const earlierHalf = bankData.slice(0, 6);
  const recentAvg = recentHalf.reduce((s, m) => s + m.avgBalance, 0) / 6;
  const earlierAvg = earlierHalf.reduce((s, m) => s + m.avgBalance, 0) / 6;
  const balanceTrend = earlierAvg > 0 ? (recentAvg / earlierAvg - 1) : 0;

  const emiBurden = (lead.monthlyEmi || 0);
  const emiToInflow = avgMonthlyInflow > 0 ? emiBurden / avgMonthlyInflow : 0;

  // Scoring
  const sub = {};
  sub.balance = avgBalance >= (lead.turnover / 12) * 0.4 ? 100 : avgBalance >= (lead.turnover / 12) * 0.2 ? 75 : avgBalance >= (lead.turnover / 12) * 0.10 ? 45 : 20;
  sub.bounces = totalBounces === 0 ? 100 : totalBounces <= 2 ? 70 : totalBounces <= 5 ? 40 : 15;
  sub.balanceTrend = balanceTrend >= 0.10 ? 100 : balanceTrend >= 0 ? 80 : balanceTrend >= -0.10 ? 50 : 20;
  sub.emiStrain = emiToInflow <= 0.12 ? 100 : emiToInflow <= 0.20 ? 75 : emiToInflow <= 0.30 ? 45 : 20;
  sub.cashHygiene = avgCashPct <= 0.05 ? 100 : avgCashPct <= 0.10 ? 75 : avgCashPct <= 0.20 ? 45 : 20;

  const score = Math.round(
    sub.balance * 0.25 + sub.bounces * 0.25 + sub.balanceTrend * 0.20 +
    sub.emiStrain * 0.20 + sub.cashHygiene * 0.10
  );

  return {
    score,
    sub,
    stats: {
      totalInflow, totalOutflow, avgBalance, minAvgBalance,
      totalBounces, balanceTrend, emiToInflow, avgCashPct, avgMonthlyInflow,
    }
  };
}

function analyzeFinancials(lead) {
  const rand = seedFromLead(lead.id + 'fin');
  // Derive some standard ratios (in practice parsed from actual balance sheet)
  const turnover = lead.turnover || 0;
  const turnoverPrev = lead.turnoverPrev || turnover * 0.85;
  const netProfit = lead.netProfit || 0;
  const existingDebt = lead.existingAmount || 0;
  const estEquity = Math.max(turnover * 0.25, netProfit * 3);
  const estCurrentAssets = turnover * 0.30;
  const estCurrentLiab = turnover * 0.18 + existingDebt * 0.25;
  const estInterestExp = existingDebt * 0.12;
  const estEbit = netProfit + estInterestExp;

  const growth = turnoverPrev > 0 ? (turnover / turnoverPrev - 1) : 0;
  const patMargin = turnover > 0 ? netProfit / turnover : 0;
  const currentRatio = estCurrentLiab > 0 ? estCurrentAssets / estCurrentLiab : 2;
  const debtEquity = estEquity > 0 ? existingDebt / estEquity : 1;
  const interestCover = estInterestExp > 0 ? estEbit / estInterestExp : 5;
  const roce = (estEquity + existingDebt) > 0 ? estEbit / (estEquity + existingDebt) : 0.15;

  const sub = {};
  sub.growth = growth >= 0.25 ? 100 : growth >= 0.10 ? 80 : growth >= 0 ? 55 : 20;
  sub.margin = patMargin >= 0.12 ? 100 : patMargin >= 0.07 ? 80 : patMargin >= 0.03 ? 55 : 20;
  sub.liquidity = currentRatio >= 1.5 ? 100 : currentRatio >= 1.2 ? 75 : currentRatio >= 1.0 ? 50 : 20;
  sub.leverage = debtEquity <= 1.0 ? 100 : debtEquity <= 1.5 ? 75 : debtEquity <= 2.5 ? 45 : 15;
  sub.interestCover = interestCover >= 3 ? 100 : interestCover >= 2 ? 75 : interestCover >= 1.5 ? 45 : 15;
  sub.roce = roce >= 0.20 ? 100 : roce >= 0.15 ? 75 : roce >= 0.10 ? 50 : 20;

  const score = Math.round(
    sub.growth * 0.20 + sub.margin * 0.20 + sub.liquidity * 0.15 +
    sub.leverage * 0.20 + sub.interestCover * 0.15 + sub.roce * 0.10
  );

  return {
    score,
    sub,
    ratios: { growth, patMargin, currentRatio, debtEquity, interestCover, roce },
    derived: { estEquity, estCurrentAssets, estCurrentLiab, estEbit, estInterestExp }
  };
}

function analyzeExistingDebt(lead) {
  const turnover = lead.turnover || 1;
  const existing = lead.existingAmount || 0;
  const emi = (lead.monthlyEmi || 0) * 12;
  const proposedEmi = estimateEMI(lead.loanAmount, lead.tenure, 0.12) * 12;
  const totalObligation = emi + proposedEmi;
  const dscr = totalObligation > 0 ? ((lead.netProfit || 0) + emi * 0.7) / totalObligation : 3;
  const debtToTurnover = (existing + Number(lead.loanAmount)) / turnover;

  let score;
  if (dscr >= 2.0 && debtToTurnover <= 0.40) score = 95;
  else if (dscr >= 1.5 && debtToTurnover <= 0.60) score = 80;
  else if (dscr >= 1.25 && debtToTurnover <= 0.85) score = 60;
  else if (dscr >= 1.0) score = 35;
  else score = 15;

  return { score, dscr, debtToTurnover, existingAnnualEmi: emi, proposedAnnualEmi: proposedEmi };
}

function analyzeSecurityCover(lead) {
  if (!lead.secured) {
    // For unsecured, evaluate intrinsic risk-buffer: negligible, score neutral 50
    return { score: 50, ltv: null, securityValue: null, note: 'Unsecured — LTV not applicable' };
  }
  // If reviewer has entered security value, use it; otherwise estimate
  const securityValue = lead.creditReview?.securityValue || (Number(lead.loanAmount) * 1.8);
  const ltv = Number(lead.loanAmount) / securityValue;
  let score;
  if (ltv <= 0.50) score = 100;
  else if (ltv <= 0.65) score = 85;
  else if (ltv <= 0.75) score = 65;
  else if (ltv <= 0.85) score = 40;
  else score = 20;
  return { score, ltv, securityValue, note: null };
}

function analyzeCIBIL(cibilScore) {
  if (!cibilScore) return { score: null, band: 'Not captured' };
  let score, band;
  if (cibilScore >= 780) { score = 100; band = 'Excellent'; }
  else if (cibilScore >= 750) { score = 90; band = 'Very Good'; }
  else if (cibilScore >= 720) { score = 78; band = 'Good'; }
  else if (cibilScore >= 680) { score = 55; band = 'Fair'; }
  else if (cibilScore >= 640) { score = 35; band = 'Marginal'; }
  else { score = 15; band = 'Poor'; }
  return { score, band };
}

function estimateEMI(principal, months, annualRate = 0.12) {
  const P = Number(principal) || 0;
  const n = Number(months) || 60;
  const r = annualRate / 12;
  if (P === 0 || n === 0) return 0;
  return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

// --- Composite scoring ---
const COMPOSITE_WEIGHTS = {
  cibil: 0.20,
  gst: 0.20,
  bank: 0.20,
  financials: 0.20,
  existingDebt: 0.10,
  security: 0.10,
};

function computeCompositeScore(lead, gstAnalysis, bankAnalysis, finAnalysis) {
  const cibil = analyzeCIBIL(lead.creditReview?.cibilScore);
  const debt = analyzeExistingDebt(lead);
  const security = analyzeSecurityCover(lead);

  const parts = [
    { key: 'cibil', label: 'CIBIL', score: cibil.score, weight: COMPOSITE_WEIGHTS.cibil, detail: cibil },
    { key: 'gst', label: 'GST Analysis', score: gstAnalysis.score, weight: COMPOSITE_WEIGHTS.gst, detail: gstAnalysis },
    { key: 'bank', label: 'Banking Conduct', score: bankAnalysis.score, weight: COMPOSITE_WEIGHTS.bank, detail: bankAnalysis },
    { key: 'financials', label: 'Financials', score: finAnalysis.score, weight: COMPOSITE_WEIGHTS.financials, detail: finAnalysis },
    { key: 'existingDebt', label: 'Debt Serviceability', score: debt.score, weight: COMPOSITE_WEIGHTS.existingDebt, detail: debt },
    { key: 'security', label: 'Security Cover', score: security.score, weight: COMPOSITE_WEIGHTS.security, detail: security },
  ];

  let totalW = 0, totalS = 0;
  parts.forEach(p => {
    if (p.score !== null && p.score !== undefined) {
      totalW += p.weight;
      totalS += p.score * p.weight;
    }
  });
  const final = totalW > 0 ? Math.round(totalS / totalW) : 0;

  let grade, band, tone;
  if (final >= 85) { grade = 'A+'; band = 'Excellent'; tone = 'emerald'; }
  else if (final >= 75) { grade = 'A'; band = 'Strong'; tone = 'emerald'; }
  else if (final >= 65) { grade = 'B+'; band = 'Good'; tone = 'amber'; }
  else if (final >= 55) { grade = 'B'; band = 'Acceptable'; tone = 'amber'; }
  else if (final >= 45) { grade = 'C'; band = 'Marginal'; tone = 'amber'; }
  else { grade = 'D'; band = 'Weak'; tone = 'rose'; }

  return { final, grade, band, tone, parts };
}

function computeRiskFlags(lead, composite, gstA, bankA, finA, debtA, secA) {
  const flags = [];
  if (finA.ratios.growth < 0) flags.push({ tone: 'rose', msg: 'Turnover has declined year-on-year' });
  else if (finA.ratios.growth >= 0.30) flags.push({ tone: 'emerald', msg: 'Strong revenue growth (>30%)' });
  if (finA.ratios.patMargin < 0.03) flags.push({ tone: 'rose', msg: 'Thin PAT margin (<3%)' });
  else if (finA.ratios.patMargin >= 0.15) flags.push({ tone: 'emerald', msg: 'Healthy profitability (>15% PAT)' });
  if (debtA.dscr < 1.25) flags.push({ tone: 'rose', msg: `Weak debt serviceability (DSCR ${debtA.dscr.toFixed(2)}x)` });
  else if (debtA.dscr >= 2) flags.push({ tone: 'emerald', msg: `Strong debt cover (DSCR ${debtA.dscr.toFixed(2)}x)` });
  if (finA.ratios.debtEquity > 2) flags.push({ tone: 'rose', msg: 'High leverage (D/E > 2x)' });
  if ((lead.vintage || 0) < 3) flags.push({ tone: 'amber', msg: 'Limited vintage (<3 years)' });
  if (bankA.stats.totalBounces > 3) flags.push({ tone: 'rose', msg: `${bankA.stats.totalBounces} cheque bounces in last 12 months` });
  if (bankA.stats.balanceTrend < -0.10) flags.push({ tone: 'rose', msg: 'Declining bank balance trend' });
  if (bankA.stats.avgCashPct > 0.15) flags.push({ tone: 'amber', msg: 'High cash deposit proportion (>15%)' });
  if (gstA.stats.onTimeRate < 0.85) flags.push({ tone: 'amber', msg: `GST filing irregularity (${Math.round(gstA.stats.onTimeRate * 100)}% on-time)` });
  if (gstA.stats.nilCount >= 2) flags.push({ tone: 'amber', msg: `${gstA.stats.nilCount} nil returns in 12 months` });
  if (gstA.stats.halfYearGrowth < -0.10) flags.push({ tone: 'rose', msg: 'GST sales falling (H2 vs H1)' });
  const docsCount = (lead.documents || []).length;
  if (docsCount < 7) flags.push({ tone: 'amber', msg: `Only ${docsCount} of 9 docs uploaded` });
  const cibil = lead.creditReview?.cibilScore;
  if (cibil && cibil < 700) flags.push({ tone: 'rose', msg: `Sub-700 CIBIL (${cibil})` });
  else if (cibil && cibil >= 780) flags.push({ tone: 'emerald', msg: `Excellent CIBIL (${cibil})` });
  if (!lead.secured && Number(lead.loanAmount) > 5e7) flags.push({ tone: 'amber', msg: 'Large unsecured ticket (>₹5 Cr)' });
  if (secA.ltv !== null && secA.ltv > 0.75) flags.push({ tone: 'amber', msg: `High LTV (${Math.round(secA.ltv * 100)}%)` });
  // Verifications
  const v = lead.verifications || {};
  if (!v.pan || v.pan.status !== 'Verified') flags.push({ tone: 'amber', msg: 'PAN not verified' });
  if (!v.gstin || v.gstin.status !== 'Verified') flags.push({ tone: 'amber', msg: 'GSTIN not verified' });
  if (!v.aadhaar || v.aadhaar.status !== 'Verified') flags.push({ tone: 'amber', msg: 'Promoter Aadhaar not verified' });
  return flags;
}

function suggestLenders(lead, composite) {
  const suggestions = [];
  const amt = Number(lead.loanAmount);
  const secured = lead.secured;
  const cibil = lead.creditReview?.cibilScore || 0;
  const strong = composite.final >= 70;
  if (secured && amt <= 5e7 && strong) suggestions.push({ name: 'HDFC Bank', reason: 'Bank-grade profile; fits their secured SME appetite' });
  if (secured && amt <= 3e7 && strong) suggestions.push({ name: 'ICICI Bank', reason: 'Strong secured book for this ticket size' });
  if (secured && amt > 5e7) suggestions.push({ name: 'IDFC First Bank', reason: 'Handles larger secured tickets' });
  if (!secured && amt <= 3e7 && cibil >= 720) suggestions.push({ name: 'Bajaj Finserv', reason: 'Strong in unsecured business loans' });
  if (!secured && amt <= 5e7) suggestions.push({ name: 'Lendingkart', reason: 'Fintech — fast turnaround, unsecured' });
  if (composite.final >= 55 && composite.final < 70) suggestions.push({ name: 'Aditya Birla Finance', reason: 'Accommodative NBFC for moderate-risk profiles' });
  if (lead.industry === 'IT / Software' && !secured) suggestions.push({ name: 'Indifi', reason: 'IT services sector familiarity' });
  if (amt >= 15e7) suggestions.push({ name: 'Axis Bank', reason: 'Better for larger tickets' });
  const seen = new Set();
  return suggestions.filter(s => { if (seen.has(s.name)) return false; seen.add(s.name); return true; });
}

// ============================================================
// CREDIT REVIEW PANEL — multi-tab module
// ============================================================

const CreditReviewPanel = ({ lead, updateLead, currentUser }) => {
  const [subTab, setSubTab] = useState('scorecard');

  // Source precedence: manual > auto-fetch simulation
  const gstSource = lead.gstManual?.months?.length >= 6 ? 'manual' : 'auto';
  const bankSource = lead.bankManual?.months?.length >= 6 ? 'manual' : 'auto';

  const gstData = useMemo(
    () => gstSource === 'manual' ? lead.gstManual.months : generateGSTData(lead),
    [gstSource, lead.id, lead.turnover, lead.gstManual]
  );
  const bankData = useMemo(
    () => bankSource === 'manual' ? lead.bankManual.months : generateBankData(lead),
    [bankSource, lead.id, lead.turnover, lead.monthlyEmi, lead.bankManual]
  );
  const gstA = useMemo(() => analyzeGST(gstData), [gstData]);
  const bankA = useMemo(() => analyzeBank(bankData, lead), [bankData, lead]);
  const finA = useMemo(() => analyzeFinancials(lead), [lead]);
  const composite = useMemo(() => computeCompositeScore(lead, gstA, bankA, finA), [lead, gstA, bankA, finA]);
  const debtA = analyzeExistingDebt(lead);
  const secA = analyzeSecurityCover(lead);
  const flags = useMemo(() => computeRiskFlags(lead, composite, gstA, bankA, finA, debtA, secA), [lead, composite, gstA, bankA, finA, debtA, secA]);
  const lenderSuggestions = useMemo(() => suggestLenders(lead, composite), [lead, composite]);

  const subTabs = [
    { k: 'scorecard', label: 'Scorecard', icon: Gauge },
    { k: 'verification', label: 'KYC Verification', icon: BadgeCheck },
    { k: 'gst', label: 'GST Analysis', icon: Receipt },
    { k: 'bank', label: 'Bank Analysis', icon: Banknote },
    { k: 'financials', label: 'Financial Analysis', icon: FileBarChart },
    { k: 'review', label: 'Reviewer & Decision', icon: Scale },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 flex-wrap bg-white rounded-lg p-1 ring-1 ring-stone-200">
        {subTabs.map(t => (
          <button
            key={t.k}
            onClick={() => setSubTab(t.k)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              subTab === t.k ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {subTab === 'scorecard' && (
        <ScorecardView composite={composite} flags={flags} lenderSuggestions={lenderSuggestions} setSubTab={setSubTab} />
      )}
      {subTab === 'verification' && (
        <VerificationView lead={lead} updateLead={updateLead} currentUser={currentUser} />
      )}
      {subTab === 'gst' && (
        <GSTAnalysisView gstData={gstData} gstA={gstA} lead={lead} source={gstSource} updateLead={updateLead} currentUser={currentUser} />
      )}
      {subTab === 'bank' && (
        <BankAnalysisView bankData={bankData} bankA={bankA} lead={lead} source={bankSource} updateLead={updateLead} currentUser={currentUser} />
      )}
      {subTab === 'financials' && (
        <FinancialsAnalysisView finA={finA} debtA={debtA} secA={secA} lead={lead} updateLead={updateLead} />
      )}
      {subTab === 'review' && (
        <ReviewerDecisionView lead={lead} updateLead={updateLead} currentUser={currentUser} composite={composite} />
      )}
    </div>
  );
};

// --- Scorecard view ---
const ScorecardView = ({ composite, flags, lenderSuggestions, setSubTab }) => {
  const toneColor = { emerald: '#10b981', amber: '#f59e0b', rose: '#f43f5e' };
  const color = toneColor[composite.tone];

  return (
    <div className="space-y-6">
      {/* Top card */}
      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-6">
            <ScoreGauge value={composite.final} color={color} />
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-stone-500">Composite Credit Score</div>
              <div className="flex items-baseline gap-3 mt-0.5">
                <div className="font-serif text-5xl text-stone-900 tabular-nums">{composite.final}</div>
                <div className="font-serif text-2xl text-stone-400">/100</div>
                <div className="font-serif text-3xl text-stone-900" style={{ color }}>{composite.grade}</div>
              </div>
              <div className="mt-2"><Badge tone={composite.tone}>{composite.band}</Badge></div>
            </div>
          </div>
          <div className="text-right max-w-xs">
            <div className="text-[11px] uppercase tracking-[0.15em] text-stone-500">How we score</div>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Weighted composite of CIBIL (20%), GST Analysis (20%), Banking Conduct (20%), Financials (20%), Debt Serviceability (10%), and Security Cover (10%).
            </p>
          </div>
        </div>

        {/* Sub-score tiles */}
        <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {composite.parts.map(p => {
            const clickable = ['gst', 'bank', 'financials'].includes(p.key);
            return (
              <button
                key={p.key}
                onClick={() => {
                  if (p.key === 'gst') setSubTab('gst');
                  else if (p.key === 'bank') setSubTab('bank');
                  else if (p.key === 'financials') setSubTab('financials');
                  else if (p.key === 'cibil') setSubTab('review');
                  else if (p.key === 'security') setSubTab('financials');
                  else if (p.key === 'existingDebt') setSubTab('financials');
                }}
                className={`text-left p-3 rounded-md ring-1 transition-all ${clickable ? 'bg-white ring-stone-200 hover:ring-stone-400 hover:shadow-sm cursor-pointer' : 'bg-stone-50 ring-stone-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-wider text-stone-500">{p.label}</div>
                  <div className="text-[10px] text-stone-400">{Math.round(p.weight * 100)}%</div>
                </div>
                <div className="font-serif text-2xl text-stone-900 tabular-nums mt-1">
                  {p.score === null || p.score === undefined ? '—' : p.score}
                </div>
                <div className="mt-1.5 h-1 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: p.score ? `${p.score}%` : '0%',
                    backgroundColor: !p.score ? '#d6d3d1' : p.score >= 75 ? '#10b981' : p.score >= 55 ? '#f59e0b' : '#f43f5e'
                  }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Flags + Lender suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flag size={15} className="text-stone-700" />
            <h3 className="font-serif text-lg text-stone-900">Risk Signals</h3>
            <span className="ml-auto text-xs text-stone-500">{flags.length} signals</span>
          </div>
          {flags.length === 0 ? (
            <div className="text-sm text-stone-500 py-4">No material flags detected.</div>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {flags.map((f, i) => (
                <li key={i} className={`flex items-start gap-2 text-sm px-3 py-2 rounded-md ring-1 ring-inset ${TONE_MAP[f.tone]}`}>
                  {f.tone === 'rose' && <AlertTriangle size={14} className="shrink-0 mt-0.5" />}
                  {f.tone === 'amber' && <AlertCircle size={14} className="shrink-0 mt-0.5" />}
                  {f.tone === 'emerald' && <CheckCircle2 size={14} className="shrink-0 mt-0.5" />}
                  <span>{f.msg}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={15} className="text-stone-700" />
            <h3 className="font-serif text-lg text-stone-900">Suggested Lenders</h3>
          </div>
          {lenderSuggestions.length === 0 ? (
            <div className="text-sm text-stone-500 py-4">No strong lender fit identified.</div>
          ) : (
            <ul className="space-y-2">
              {lenderSuggestions.slice(0, 6).map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm py-2 border-b border-stone-100 last:border-0">
                  <div className="w-7 h-7 bg-stone-100 rounded-md grid place-items-center font-serif text-xs text-stone-700 shrink-0">
                    {s.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="text-stone-900">{s.name}</div>
                    <div className="text-xs text-stone-500">{s.reason}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Verification view ---
const VerificationView = ({ lead, updateLead, currentUser }) => {
  const v = lead.verifications || {};
  const [busyKey, setBusyKey] = useState(null);

  const runVerification = async (kind) => {
    setBusyKey(kind);
    let result;
    try {
      if (kind === 'pan') result = await verifyPAN(lead.pan, lead.companyName);
      else if (kind === 'gstin') result = await verifyGSTIN(lead.gstin, lead.companyName);
      else if (kind === 'aadhaar') result = await verifyAadhaar(lead.aadhaar, lead.contactName);
      updateLead({
        verifications: {
          ...(lead.verifications || {}),
          [kind]: { ...result, verifiedBy: currentUser.name }
        }
      });
    } catch (e) {
      updateLead({
        verifications: {
          ...(lead.verifications || {}),
          [kind]: { status: 'Failed', reason: e.message, verifiedBy: currentUser.name, verifiedAt: new Date().toISOString() }
        }
      });
    }
    setBusyKey(null);
  };

  const tiles = [
    { k: 'pan', label: 'PAN Verification', value: lead.pan ? maskPAN(lead.pan) : null, raw: lead.pan, icon: FileCheck, hint: 'Verifies PAN against NSDL / Income Tax database' },
    { k: 'gstin', label: 'GSTIN Verification', value: lead.gstin, raw: lead.gstin, icon: Receipt, hint: 'Verifies GSTIN against GSTN portal' },
    { k: 'aadhaar', label: 'Promoter Aadhaar', value: lead.aadhaar ? maskAadhaar(lead.aadhaar) : null, raw: lead.aadhaar, icon: Fingerprint, hint: 'OTP-based Aadhaar eKYC' },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 ring-1 ring-amber-200 rounded-md px-4 py-3 text-xs text-amber-900 leading-relaxed">
        <strong>Prototype note:</strong> Verifications are simulated with seeded responses. In production, wire these to Signzy / Karza / Zoop / IDfy — the code structure matches real API response shapes so swap-in is a few lines per verifier.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {tiles.map(tile => {
          const result = v[tile.k];
          const verified = result?.status === 'Verified';
          const failed = result?.status === 'Failed';
          return (
            <div key={tile.k} className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-stone-100 rounded-md grid place-items-center text-stone-700">
                  <tile.icon size={16} />
                </div>
                {verified && <Badge tone="emerald"><BadgeCheck size={10} className="inline -mt-0.5 mr-0.5" /> Verified</Badge>}
                {failed && <Badge tone="rose">Failed</Badge>}
                {!result && <Badge tone="stone">Not verified</Badge>}
              </div>
              <div className="font-serif text-base text-stone-900 mt-3">{tile.label}</div>
              <div className="text-xs text-stone-500 mt-1 leading-relaxed">{tile.hint}</div>

              <div className="mt-4 pt-4 border-t border-stone-100">
                {!tile.raw ? (
                  <div className="text-xs text-stone-500">No {tile.label.split(' ')[0]} on file. Edit the application to add it.</div>
                ) : (
                  <>
                    <div className="text-[10px] uppercase tracking-wider text-stone-500">Value on file</div>
                    <div className="font-mono text-sm text-stone-900 mt-0.5">{tile.value}</div>
                  </>
                )}
              </div>

              {result && result.raw && verified && (
                <div className="mt-3 bg-stone-50 rounded-md p-3 space-y-1 text-xs">
                  {Object.entries(result.raw).slice(0, 6).map(([k, val]) => (
                    <div key={k} className="flex items-start justify-between gap-2">
                      <span className="text-stone-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-stone-900 text-right">{typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}</span>
                    </div>
                  ))}
                </div>
              )}
              {failed && (
                <div className="mt-3 text-xs text-rose-700 bg-rose-50 ring-1 ring-rose-200 rounded-md px-3 py-2">
                  {result.reason || 'Verification failed'}
                </div>
              )}

              {result?.verifiedAt && (
                <div className="text-[10px] text-stone-500 mt-3">
                  {result.verifiedBy} · {daysAgo(result.verifiedAt)}
                </div>
              )}

              <div className="mt-4">
                <Button
                  size="sm"
                  variant={verified ? 'secondary' : 'primary'}
                  onClick={() => runVerification(tile.k)}
                  disabled={!tile.raw || busyKey === tile.k}
                  className="w-full"
                >
                  {busyKey === tile.k && <RefreshCw size={12} className="animate-spin" />}
                  {verified ? 'Re-verify' : 'Verify now'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- GST Analysis view ---
const GSTAnalysisView = ({ gstData, gstA, lead, source, updateLead, currentUser }) => {
  const [mode, setMode] = useState(source); // 'auto' | 'manual'
  const maxSales = Math.max(...gstData.map(m => m.sales));

  return (
    <div className="space-y-5">
      <DataSourceSwitch
        label="GST Data Source"
        source={source}
        mode={mode}
        onModeChange={setMode}
        onClearManual={() => {
          if (confirm('Remove manually entered GST data? The system will revert to auto-fetch.')) {
            updateLead({ gstManual: null });
            setMode('auto');
          }
        }}
      />

      {mode === 'manual' && source === 'auto' && (
        <GSTManualUploadForm lead={lead} updateLead={updateLead} currentUser={currentUser} onSaved={() => setMode('auto')} />
      )}

      {mode === 'manual' && source === 'manual' && (
        <GSTManualUploadForm lead={lead} updateLead={updateLead} currentUser={currentUser} existing={lead.gstManual} />
      )}

      {mode === 'auto' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Stat label="GST Score" value={`${gstA.score}/100`} sub={gstA.score >= 75 ? 'Strong compliance' : gstA.score >= 55 ? 'Acceptable' : 'Needs attention'} icon={Receipt} accent={gstA.score >= 75 ? 'bg-emerald-50 text-emerald-700' : gstA.score >= 55 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'} />
            <Stat label="12-month sales" value={formatINR(gstA.stats.totalSales)} sub={`avg ${formatINR(gstA.stats.avgMonthly)}/month`} icon={TrendingUp} />
            <Stat label="On-time filing" value={`${Math.round(gstA.stats.onTimeRate * 100)}%`} sub={`${gstA.stats.nilCount} nil returns`} icon={CheckCircle2} />
          </div>

          <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
            <h3 className="font-serif text-lg text-stone-900">Monthly GSTR-3B (last 12 months)</h3>
            <div className="mt-5 grid grid-cols-12 gap-1 h-40 items-end">
              {gstData.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-1 group">
                  <div className="text-[9px] tabular-nums text-stone-400 opacity-0 group-hover:opacity-100 transition">{formatINR(m.sales)}</div>
                  <div
                    className={`w-full rounded-t transition-colors ${m.filedOnTime ? 'bg-stone-900' : 'bg-amber-500'}`}
                    style={{ height: `${(m.sales / maxSales) * 100}%`, minHeight: '4px' }}
                  />
                  <div className="text-[9px] text-stone-500">{m.month}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 bg-stone-900 rounded-sm" /> Filed on time</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded-sm" /> Filed late</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
              <h3 className="font-serif text-base text-stone-900">Sub-score breakdown</h3>
              <div className="mt-4 space-y-2.5">
                {[
                  ['Filing Regularity', gstA.sub.filing, `${Math.round(gstA.stats.onTimeRate * 100)}% on time`],
                  ['Sales Stability', gstA.sub.stability, `CV ${(gstA.stats.cv * 100).toFixed(0)}%`],
                  ['Growth Trajectory', gstA.sub.growth, `${(gstA.stats.halfYearGrowth * 100).toFixed(1)}% H2 vs H1`],
                  ['Tax Compliance', gstA.sub.taxCompliance, `${Math.round(gstA.stats.taxCompliance * 100)}% tax paid`],
                  ['Continuity', gstA.sub.nilReturns, `${gstA.stats.nilCount} nil returns`],
                ].map(([label, score, detail]) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="text-xs text-stone-700 w-36 shrink-0">{label}</div>
                    <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: score >= 75 ? '#10b981' : score >= 55 ? '#f59e0b' : '#f43f5e' }} />
                    </div>
                    <div className="text-xs tabular-nums text-stone-500 w-24 text-right">{detail}</div>
                    <div className="text-xs tabular-nums text-stone-900 w-8 text-right">{score}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
              <h3 className="font-serif text-base text-stone-900">Filing register</h3>
              <div className="mt-3 max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="text-[10px] uppercase tracking-wider text-stone-500 sticky top-0 bg-white">
                    <tr><th className="text-left py-1.5">Month</th><th className="text-right">Sales</th><th className="text-right">Tax</th><th className="text-right">Filing</th></tr>
                  </thead>
                  <tbody>
                    {[...gstData].reverse().map((m, i) => (
                      <tr key={i} className="border-t border-stone-100">
                        <td className="py-2 text-stone-900">{m.month}</td>
                        <td className="py-2 text-right tabular-nums">{formatINR(m.sales)}</td>
                        <td className="py-2 text-right tabular-nums">{formatINR(m.taxPaid)}</td>
                        <td className={`py-2 text-right ${m.filedOnTime ? 'text-emerald-700' : 'text-amber-700'}`}>{m.filedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Bank Analysis view ---
// --- Data source switch (auto-fetch vs manual upload) ---
const DataSourceSwitch = ({ label, source, mode, onModeChange, onClearManual }) => (
  <div className="bg-white rounded-lg ring-1 ring-stone-200 p-4 flex items-center gap-4 flex-wrap">
    <div className="flex items-center gap-2">
      <div className="text-[10px] uppercase tracking-[0.15em] text-stone-500">{label}</div>
      {source === 'manual'
        ? <Badge tone="amber"><Upload size={10} className="inline -mt-0.5 mr-0.5" /> Manual upload</Badge>
        : <Badge tone="emerald"><RefreshCw size={10} className="inline -mt-0.5 mr-0.5" /> Auto-fetched</Badge>}
    </div>
    <div className="ml-auto flex items-center gap-1 bg-stone-100 rounded-md p-1">
      <button
        onClick={() => onModeChange('auto')}
        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${mode === 'auto' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
      >
        View analysis
      </button>
      <button
        onClick={() => onModeChange('manual')}
        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${mode === 'manual' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
      >
        {source === 'manual' ? 'Edit manual data' : 'Upload manually'}
      </button>
    </div>
    {source === 'manual' && (
      <Button variant="ghost" size="sm" onClick={onClearManual}>
        <Trash2 size={12} /> Clear
      </Button>
    )}
  </div>
);

// --- GST Manual Upload Form ---
const GSTManualUploadForm = ({ lead, updateLead, currentUser, existing, onSaved }) => {
  const buildMonths = () => {
    const arr = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const existingMonth = existing?.months?.find(m => m.month === d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }));
      arr.push(existingMonth || {
        month: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        sales: '', tax: '', taxPaid: '', filedOnTime: true, filedAt: 'On time', nilReturn: false,
        file: null,
      });
    }
    return arr;
  };

  const [months, setMonths] = useState(buildMonths);
  const [notes, setNotes] = useState(existing?.notes || '');

  const updateMonth = (idx, patch) => {
    setMonths(m => m.map((x, i) => i === idx ? { ...x, ...patch } : x));
  };

  const autoFill = () => {
    // Use the auto-simulated data as a starting point to save reviewer time
    const seeded = generateGSTData(lead);
    setMonths(seeded.map(s => ({ ...s, file: null })));
  };

  const fillUniform = () => {
    const avg = (lead.turnover || 0) / 12;
    setMonths(ms => ms.map(m => ({
      ...m,
      sales: Math.round(avg),
      tax: Math.round(avg * 0.18),
      taxPaid: Math.round(avg * 0.18),
      filedOnTime: true,
      filedAt: 'On time',
      nilReturn: false,
    })));
  };

  const handleFileUpload = (idx, docName) => {
    const filename = `gstr3b_${months[idx].month.toLowerCase().replace(' ', '_').replace("'", '')}.pdf`;
    updateMonth(idx, { file: { filename, uploadedAt: new Date().toISOString() } });
  };

  const saveAll = () => {
    // Ensure numbers are numbers
    const cleaned = months.map(m => ({
      ...m,
      sales: Number(m.sales) || 0,
      tax: Number(m.tax) || 0,
      taxPaid: Number(m.taxPaid) || 0,
      nilReturn: Number(m.sales) === 0,
    }));
    const hasEnoughData = cleaned.filter(m => m.sales > 0).length >= 6;
    if (!hasEnoughData) {
      if (!confirm('Fewer than 6 months have data. GST score may be unreliable. Save anyway?')) return;
    }
    updateLead({
      gstManual: {
        months: cleaned,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUser.name,
        notes: notes.trim(),
      }
    });
    alert('GST data saved. Score will recompute based on entered data.');
    if (onSaved) onSaved();
  };

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 ring-1 ring-amber-200 rounded-md px-4 py-3 text-xs text-amber-900 leading-relaxed">
        <strong>Manual GST Entry.</strong> Use this when auto-fetch via GSTN API is not available or the borrower prefers to share filings directly. Upload each month's GSTR-3B PDF and enter the key figures below. Once saved, GST score will be computed from your entries.
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h3 className="font-serif text-lg text-stone-900">Month-wise GSTR-3B</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={fillUniform}>Fill uniform (₹{Math.round((lead.turnover || 0) / 12 / 100000)}L/m)</Button>
            <Button variant="ghost" size="sm" onClick={autoFill}>Seed from simulation</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-stone-500 border-b border-stone-200">
                <th className="text-left font-medium py-2.5 pr-3">Month</th>
                <th className="text-right font-medium px-2">Sales (₹)</th>
                <th className="text-right font-medium px-2">Tax Paid (₹)</th>
                <th className="text-center font-medium px-2">Filing</th>
                <th className="text-center font-medium px-2">GSTR-3B</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m, i) => (
                <tr key={i} className="border-b border-stone-100">
                  <td className="py-2 pr-3 text-stone-900 font-medium">{m.month}</td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={m.sales}
                      onChange={(e) => updateMonth(i, { sales: e.target.value })}
                      placeholder="0"
                      className="w-full px-2 py-1.5 text-right text-sm tabular-nums bg-stone-50 border border-stone-200 rounded focus:border-stone-900 focus:bg-white outline-none"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={m.taxPaid}
                      onChange={(e) => updateMonth(i, { taxPaid: e.target.value })}
                      placeholder="0"
                      className="w-full px-2 py-1.5 text-right text-sm tabular-nums bg-stone-50 border border-stone-200 rounded focus:border-stone-900 focus:bg-white outline-none"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <select
                      value={m.filedOnTime ? 'ontime' : 'late'}
                      onChange={(e) => updateMonth(i, { filedOnTime: e.target.value === 'ontime', filedAt: e.target.value === 'ontime' ? 'On time' : 'Filed late' })}
                      className="w-full px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded focus:border-stone-900 outline-none"
                    >
                      <option value="ontime">On time</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                  <td className="py-2 px-2 text-center">
                    {m.file ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                        <CheckCircle2 size={12} /> {m.file.filename.slice(0, 16)}…
                      </span>
                    ) : (
                      <button
                        onClick={() => handleFileUpload(i)}
                        className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900"
                      >
                        <Upload size={12} /> Upload
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
        <Textarea
          label="Reviewer notes on GST data"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any context — e.g. 'Nov was nil due to plant shutdown for maintenance', 'Late filing in Mar due to ITC reconciliation'…"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="amber" onClick={saveAll}>
          <CheckCircle2 size={14} /> Save GST data
        </Button>
      </div>
    </div>
  );
};

// --- Bank Manual Upload Form ---
const BankManualUploadForm = ({ lead, updateLead, currentUser, existing, onSaved }) => {
  const buildMonths = () => {
    const arr = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      const existingMonth = existing?.months?.find(m => m.month === monthLabel);
      arr.push(existingMonth || {
        month: monthLabel,
        inflow: '', outflow: '', avgBalance: '', closingBalance: '',
        inwardBounces: 0, outwardBounces: 0,
        cashDepositPct: 0.05, emiDebit: '',
        credits: '', debits: '',
        file: null,
      });
    }
    return arr;
  };

  const [months, setMonths] = useState(buildMonths);
  const [bankName, setBankName] = useState(existing?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(existing?.accountNumberMasked || '');
  const [notes, setNotes] = useState(existing?.notes || '');

  const updateMonth = (idx, patch) => {
    setMonths(m => m.map((x, i) => i === idx ? { ...x, ...patch } : x));
  };

  const autoFill = () => {
    const seeded = generateBankData(lead);
    setMonths(seeded.map(s => ({ ...s, file: null })));
  };

  const handleFileUpload = (idx) => {
    const filename = `bank_stmt_${months[idx].month.toLowerCase().replace(' ', '_').replace("'", '')}.pdf`;
    updateMonth(idx, { file: { filename, uploadedAt: new Date().toISOString() } });
  };

  const saveAll = () => {
    const cleaned = months.map(m => ({
      month: m.month,
      inflow: Number(m.inflow) || 0,
      outflow: Number(m.outflow) || 0,
      avgBalance: Number(m.avgBalance) || 0,
      closingBalance: Number(m.closingBalance) || Number(m.avgBalance) || 0,
      inwardBounces: Number(m.inwardBounces) || 0,
      outwardBounces: Number(m.outwardBounces) || 0,
      cashDepositPct: Number(m.cashDepositPct) || 0,
      emiDebit: Number(m.emiDebit) || 0,
      credits: Number(m.credits) || 0,
      debits: Number(m.debits) || 0,
      file: m.file,
    }));
    const hasEnoughData = cleaned.filter(m => m.inflow > 0 || m.avgBalance > 0).length >= 6;
    if (!hasEnoughData) {
      if (!confirm('Fewer than 6 months have data. Banking score may be unreliable. Save anyway?')) return;
    }
    updateLead({
      bankManual: {
        bankName: bankName.trim(),
        accountNumberMasked: accountNumber.trim(),
        months: cleaned,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUser.name,
        notes: notes.trim(),
      }
    });
    alert('Bank statement data saved. Banking score will recompute based on entered data.');
    if (onSaved) onSaved();
  };

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 ring-1 ring-amber-200 rounded-md px-4 py-3 text-xs text-amber-900 leading-relaxed">
        <strong>Manual Bank Statement Entry.</strong> Use this when the borrower cannot share access via Account Aggregator (NBFC-AA) and prefers to upload statements directly. Upload each month's PDF and enter the key summary figures. Typically needed: monthly inflow/outflow, avg balance, bounce count, EMI debits.
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. HDFC Bank" />
          <Input label="Account number (masked)" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="e.g. XXXX1234" />
        </div>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h3 className="font-serif text-lg text-stone-900">Month-wise summary</h3>
          <Button variant="ghost" size="sm" onClick={autoFill}>Seed from simulation</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-stone-500 border-b border-stone-200">
                <th className="text-left font-medium py-2.5 pr-2">Month</th>
                <th className="text-right font-medium px-1.5">Inflow (₹)</th>
                <th className="text-right font-medium px-1.5">Avg Bal (₹)</th>
                <th className="text-right font-medium px-1.5">Bounces (In)</th>
                <th className="text-right font-medium px-1.5">Bounces (Out)</th>
                <th className="text-right font-medium px-1.5">Cash %</th>
                <th className="text-center font-medium px-1.5">PDF</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m, i) => (
                <tr key={i} className="border-b border-stone-100">
                  <td className="py-2 pr-2 text-stone-900 font-medium">{m.month}</td>
                  <td className="py-2 px-1.5">
                    <input type="number" value={m.inflow} onChange={(e) => updateMonth(i, { inflow: e.target.value })} placeholder="0"
                      className="w-full px-1.5 py-1.5 text-right text-sm tabular-nums bg-stone-50 border border-stone-200 rounded focus:border-stone-900 focus:bg-white outline-none" />
                  </td>
                  <td className="py-2 px-1.5">
                    <input type="number" value={m.avgBalance} onChange={(e) => updateMonth(i, { avgBalance: e.target.value })} placeholder="0"
                      className="w-full px-1.5 py-1.5 text-right text-sm tabular-nums bg-stone-50 border border-stone-200 rounded focus:border-stone-900 focus:bg-white outline-none" />
                  </td>
                  <td className="py-2 px-1.5">
                    <input type="number" min="0" value={m.inwardBounces} onChange={(e) => updateMonth(i, { inwardBounces: e.target.value })}
                      className="w-16 px-1.5 py-1.5 text-right text-sm tabular-nums bg-stone-50 border border-stone-200 rounded focus:border-stone-900 focus:bg-white outline-none" />
                  </td>
                  <td className="py-2 px-1.5">
                    <input type="number" min="0" value={m.outwardBounces} onChange={(e) => updateMonth(i, { outwardBounces: e.target.value })}
                      className="w-16 px-1.5 py-1.5 text-right text-sm tabular-nums bg-stone-50 border border-stone-200 rounded focus:border-stone-900 focus:bg-white outline-none" />
                  </td>
                  <td className="py-2 px-1.5">
                    <input type="number" step="0.01" min="0" max="1" value={m.cashDepositPct} onChange={(e) => updateMonth(i, { cashDepositPct: e.target.value })}
                      className="w-20 px-1.5 py-1.5 text-right text-sm tabular-nums bg-stone-50 border border-stone-200 rounded focus:border-stone-900 focus:bg-white outline-none" />
                  </td>
                  <td className="py-2 px-1.5 text-center">
                    {m.file ? (
                      <span className="inline-flex items-center gap-0.5 text-xs text-emerald-700">
                        <CheckCircle2 size={12} />
                      </span>
                    ) : (
                      <button
                        onClick={() => handleFileUpload(i)}
                        className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900"
                      >
                        <Upload size={12} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-stone-500 mt-3 leading-relaxed">
          <strong>Tip:</strong> Cash deposits % is a fraction (e.g. 0.08 = 8% of inflow came in as cash deposits). Keep low for best banking score.
        </p>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
        <Textarea
          label="Reviewer notes on banking"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any context — e.g. 'Two bounces in Feb due to vendor payment mismatch; subsequently cleared'…"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="amber" onClick={saveAll}>
          <CheckCircle2 size={14} /> Save bank data
        </Button>
      </div>
    </div>
  );
};

const BankAnalysisView = ({ bankData, bankA, lead, source, updateLead, currentUser }) => {
  const [mode, setMode] = useState(source);
  const maxBalance = Math.max(...bankData.map(m => m.avgBalance));

  return (
    <div className="space-y-5">
      <DataSourceSwitch
        label="Bank Statement Source"
        source={source}
        mode={mode}
        onModeChange={setMode}
        onClearManual={() => {
          if (confirm('Remove manually entered bank data? The system will revert to auto-fetch.')) {
            updateLead({ bankManual: null });
            setMode('auto');
          }
        }}
      />

      {mode === 'manual' && source === 'auto' && (
        <BankManualUploadForm lead={lead} updateLead={updateLead} currentUser={currentUser} onSaved={() => setMode('auto')} />
      )}

      {mode === 'manual' && source === 'manual' && (
        <BankManualUploadForm lead={lead} updateLead={updateLead} currentUser={currentUser} existing={lead.bankManual} />
      )}

      {mode === 'auto' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Stat label="Bank Score" value={`${bankA.score}/100`} sub={bankA.score >= 75 ? 'Clean conduct' : bankA.score >= 55 ? 'Acceptable' : 'Concerning'} icon={Banknote} accent={bankA.score >= 75 ? 'bg-emerald-50 text-emerald-700' : bankA.score >= 55 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'} />
            <Stat label="Avg balance" value={formatINR(bankA.stats.avgBalance)} sub={`min ${formatINR(bankA.stats.minAvgBalance)}`} icon={Wallet} />
            <Stat label="Total bounces" value={bankA.stats.totalBounces} sub="inward + outward (12m)" icon={AlertCircle} accent={bankA.stats.totalBounces === 0 ? 'bg-emerald-50 text-emerald-700' : bankA.stats.totalBounces > 3 ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'} />
            <Stat label="EMI / inflow" value={`${(bankA.stats.emiToInflow * 100).toFixed(1)}%`} sub="Debt strain indicator" icon={Percent} />
          </div>

          <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
            <h3 className="font-serif text-lg text-stone-900">Avg monthly balance trend</h3>
            <div className="mt-5 grid grid-cols-12 gap-1 h-40 items-end">
              {bankData.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-1 group">
                  <div className="text-[9px] tabular-nums text-stone-400 opacity-0 group-hover:opacity-100 transition">{formatINR(m.avgBalance)}</div>
                  <div
                    className={`w-full rounded-t ${m.inwardBounces > 0 ? 'bg-rose-500' : 'bg-stone-900'}`}
                    style={{ height: `${(m.avgBalance / maxBalance) * 100}%`, minHeight: '4px' }}
                  />
                  <div className="text-[9px] text-stone-500">{m.month}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 bg-stone-900 rounded-sm" /> Clean month</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 bg-rose-500 rounded-sm" /> Bounces</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
              <h3 className="font-serif text-base text-stone-900">Sub-score breakdown</h3>
              <div className="mt-4 space-y-2.5">
                {[
                  ['Balance adequacy', bankA.sub.balance, `${formatINR(bankA.stats.avgBalance)} avg`],
                  ['Bounce record', bankA.sub.bounces, `${bankA.stats.totalBounces} bounces`],
                  ['Balance trend', bankA.sub.balanceTrend, `${(bankA.stats.balanceTrend * 100).toFixed(1)}% H2 vs H1`],
                  ['EMI strain', bankA.sub.emiStrain, `${(bankA.stats.emiToInflow * 100).toFixed(1)}% of inflow`],
                  ['Cash hygiene', bankA.sub.cashHygiene, `${(bankA.stats.avgCashPct * 100).toFixed(1)}% cash deposits`],
                ].map(([label, score, detail]) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="text-xs text-stone-700 w-32 shrink-0">{label}</div>
                    <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: score >= 75 ? '#10b981' : score >= 55 ? '#f59e0b' : '#f43f5e' }} />
                    </div>
                    <div className="text-xs tabular-nums text-stone-500 w-24 text-right">{detail}</div>
                    <div className="text-xs tabular-nums text-stone-900 w-8 text-right">{score}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
              <h3 className="font-serif text-base text-stone-900">Monthly summary</h3>
              <div className="mt-3 max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="text-[10px] uppercase tracking-wider text-stone-500 sticky top-0 bg-white">
                    <tr><th className="text-left py-1.5">Month</th><th className="text-right">Inflow</th><th className="text-right">Avg Bal</th><th className="text-right">Bounces</th></tr>
                  </thead>
                  <tbody>
                    {[...bankData].reverse().map((m, i) => (
                      <tr key={i} className="border-t border-stone-100">
                        <td className="py-2 text-stone-900">{m.month}</td>
                        <td className="py-2 text-right tabular-nums">{formatINR(m.inflow)}</td>
                        <td className="py-2 text-right tabular-nums">{formatINR(m.avgBalance)}</td>
                        <td className={`py-2 text-right tabular-nums ${(m.inwardBounces + m.outwardBounces) > 0 ? 'text-rose-700' : 'text-stone-500'}`}>
                          {m.inwardBounces + m.outwardBounces || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Financials Analysis view ---
const FinancialsAnalysisView = ({ finA, debtA, secA, lead, updateLead }) => {
  const [securityValue, setSecurityValue] = useState(lead.creditReview?.securityValue || '');

  const saveSecurity = () => {
    updateLead({
      creditReview: {
        ...(lead.creditReview || {}),
        securityValue: Number(securityValue) || null,
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Stat label="Financials Score" value={`${finA.score}/100`} sub="From ratios + growth" icon={FileBarChart} accent={finA.score >= 75 ? 'bg-emerald-50 text-emerald-700' : finA.score >= 55 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'} />
        <Stat label="Debt Serviceability" value={`${debtA.score}/100`} sub={`DSCR ${debtA.dscr.toFixed(2)}x`} icon={Scale} />
        <Stat label="Security Cover" value={secA.ltv !== null ? `LTV ${Math.round(secA.ltv * 100)}%` : 'Unsecured'} sub={secA.ltv !== null ? `Score ${secA.score}/100` : 'Score neutral'} icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
          <h3 className="font-serif text-base text-stone-900">Key financial ratios</h3>
          <div className="mt-4 space-y-3">
            <RatioRow label="YoY Growth" value={`${(finA.ratios.growth * 100).toFixed(1)}%`} score={finA.sub.growth} />
            <RatioRow label="PAT Margin" value={`${(finA.ratios.patMargin * 100).toFixed(1)}%`} score={finA.sub.margin} />
            <RatioRow label="Current Ratio" value={`${finA.ratios.currentRatio.toFixed(2)}x`} score={finA.sub.liquidity} />
            <RatioRow label="Debt / Equity" value={`${finA.ratios.debtEquity.toFixed(2)}x`} score={finA.sub.leverage} />
            <RatioRow label="Interest Cover" value={`${finA.ratios.interestCover.toFixed(2)}x`} score={finA.sub.interestCover} />
            <RatioRow label="ROCE" value={`${(finA.ratios.roce * 100).toFixed(1)}%`} score={finA.sub.roce} />
          </div>
          <div className="mt-4 pt-4 border-t border-stone-100 text-[11px] text-stone-500 leading-relaxed">
            Some ratios are estimated from available data (turnover, PAT, existing debt). Upload full audited balance sheet + P&amp;L for precise computation.
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
            <h3 className="font-serif text-base text-stone-900">Debt serviceability</h3>
            <div className="mt-3 space-y-2 text-sm">
              <InfoRow label="Existing annual EMI" value={formatINR(debtA.existingAnnualEmi)} />
              <InfoRow label="Proposed annual EMI" value={formatINR(debtA.proposedAnnualEmi)} />
              <InfoRow label="Total obligation" value={formatINR(debtA.existingAnnualEmi + debtA.proposedAnnualEmi)} />
              <InfoRow label="DSCR" value={`${debtA.dscr.toFixed(2)}x`} />
              <InfoRow label="Debt / Turnover" value={`${(debtA.debtToTurnover * 100).toFixed(0)}%`} />
            </div>
          </div>

          <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
            <h3 className="font-serif text-base text-stone-900">Security cover</h3>
            {lead.secured ? (
              <>
                <div className="mt-3 space-y-2 text-sm">
                  <InfoRow label="Collateral" value={lead.collateral} />
                  <InfoRow label="Est. security value" value={formatINR(secA.securityValue)} />
                  <InfoRow label="Loan amount" value={formatINR(lead.loanAmount)} />
                  <InfoRow label="LTV ratio" value={`${Math.round(secA.ltv * 100)}%`} />
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <label className="block text-xs text-stone-600 mb-1.5 uppercase tracking-wide">Override security value (from valuation report)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={securityValue}
                      onChange={(e) => setSecurityValue(e.target.value)}
                      placeholder="₹ in rupees"
                      className="flex-1 px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:border-stone-900 outline-none"
                    />
                    <Button size="sm" variant="secondary" onClick={saveSecurity}>Save</Button>
                  </div>
                  {securityValue && <div className="text-xs text-stone-500 mt-1">{formatINR(securityValue)}</div>}
                </div>
              </>
            ) : (
              <div className="mt-3 text-sm text-stone-600">This is an unsecured facility. LTV does not apply.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RatioRow = ({ label, value, score }) => (
  <div className="flex items-center gap-3">
    <div className="text-xs text-stone-700 w-28 shrink-0">{label}</div>
    <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: score >= 75 ? '#10b981' : score >= 55 ? '#f59e0b' : '#f43f5e' }} />
    </div>
    <div className="text-xs tabular-nums text-stone-900 w-20 text-right">{value}</div>
    <div className="text-xs tabular-nums text-stone-500 w-8 text-right">{score}</div>
  </div>
);

// --- Reviewer Decision view ---
const ReviewerDecisionView = ({ lead, updateLead, currentUser, composite }) => {
  const [cibilScore, setCibilScore] = useState(lead.creditReview?.cibilScore || '');
  const [promoterBackground, setPromoterBackground] = useState(lead.creditReview?.promoterBackground || '');
  const [reviewNotes, setReviewNotes] = useState(lead.creditReview?.notes || '');
  const [recommendation, setRecommendation] = useState('');
  const [recReason, setRecReason] = useState('');

  const reviewHistory = lead.creditReview?.history || [];

  const saveInputs = () => {
    updateLead({
      creditReview: {
        ...(lead.creditReview || {}),
        cibilScore: Number(cibilScore) || null,
        promoterBackground,
        notes: reviewNotes,
        lastUpdatedBy: currentUser.name,
        lastUpdatedAt: new Date().toISOString(),
      }
    });
  };

  const submitRecommendation = () => {
    if (!recommendation) { alert('Please select a recommendation.'); return; }
    if (!recReason.trim()) { alert('Please add a reason.'); return; }

    const statusMap = {
      PROCEED: 'SENT_TO_LENDERS', MORE_INFO: 'DOCS_PENDING',
      REJECT: 'REJECTED', HOLD: 'ON_HOLD',
    };
    const newEntry = {
      id: uid(), at: new Date().toISOString(), by: currentUser.name,
      score: composite.final, grade: composite.grade,
      recommendation, reason: recReason.trim(),
      cibilScore: Number(cibilScore) || null,
    };
    const newNote = {
      text: `Credit review: ${REC_META[recommendation].label}. Score ${composite.final}/100 (${composite.grade}). ${recReason.trim()}`,
      by: currentUser.name, at: new Date().toISOString(),
    };

    updateLead({
      status: statusMap[recommendation],
      creditReview: {
        ...(lead.creditReview || {}),
        cibilScore: Number(cibilScore) || null,
        promoterBackground, notes: reviewNotes,
        history: [...reviewHistory, newEntry],
        lastUpdatedBy: currentUser.name,
        lastUpdatedAt: new Date().toISOString(),
      },
      notes: [...(lead.notes || []), newNote],
    });
    setRecommendation(''); setRecReason('');
    alert(`Review submitted. Status updated to "${STATUSES[statusMap[recommendation]].label}".`);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
        <h3 className="font-serif text-lg text-stone-900">Reviewer inputs</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="CIBIL / Commercial Bureau Score"
            type="number"
            value={cibilScore}
            onChange={(e) => setCibilScore(e.target.value)}
            placeholder="300–900"
            hint="Pulled from bureau. Feeds into composite score."
          />
          <div className="flex items-end">
            <div className="text-xs text-stone-500">
              {cibilScore ? (
                <>Score band: <span className="text-stone-900 font-medium">{analyzeCIBIL(Number(cibilScore)).band}</span> · Contribution: <span className="text-stone-900 font-medium">{analyzeCIBIL(Number(cibilScore)).score}/100 × 20%</span></>
              ) : 'Enter CIBIL to see impact on composite.'}
            </div>
          </div>
        </div>
        <Textarea label="Promoter background" className="mt-4" value={promoterBackground} onChange={(e) => setPromoterBackground(e.target.value)} placeholder="Experience, prior ventures, references…" />
        <Textarea label="Reviewer notes" className="mt-4" value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} placeholder="Site visit observations, interview notes, unit economics…" rows={4} />
        <div className="flex justify-end mt-4">
          <Button variant="secondary" size="sm" onClick={saveInputs}>Save reviewer inputs</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
        <h3 className="font-serif text-lg text-stone-900">Decision</h3>
        <p className="text-xs text-stone-500 mt-1">Current composite score: <span className="text-stone-900 font-medium tabular-nums">{composite.final}/100 ({composite.grade})</span></p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          {Object.entries(REC_META).map(([k, m]) => (
            <button
              key={k}
              onClick={() => setRecommendation(k)}
              className={`p-3 rounded-md text-left transition-colors ring-1 ${
                recommendation === k ? `${TONE_MAP[m.tone]} ring-2` : 'bg-white ring-stone-200 text-stone-700 hover:ring-stone-400'
              }`}
            >
              <m.icon size={14} className={recommendation === k ? '' : 'text-stone-500'} />
              <div className="text-sm font-medium mt-1.5">{m.label}</div>
              <div className="text-[10px] mt-0.5 leading-snug opacity-80">{m.sub}</div>
            </button>
          ))}
        </div>
        <Textarea label="Reasoning" className="mt-4" value={recReason} onChange={(e) => setRecReason(e.target.value)} placeholder="Justification — logged in audit trail" />
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
          <div className="text-xs text-stone-500">Submitting updates the lead status and logs an audit entry.</div>
          <Button variant="amber" onClick={submitRecommendation} disabled={!recommendation}>
            Submit review <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      {reviewHistory.length > 0 && (
        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
          <h3 className="font-serif text-lg text-stone-900">Review history</h3>
          <div className="mt-4 space-y-3">
            {[...reviewHistory].reverse().map((h) => {
              const m = REC_META[h.recommendation];
              return (
                <div key={h.id} className="border-l-2 border-stone-200 pl-4 py-1">
                  <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                    <span className="font-medium text-stone-900">{h.by}</span>
                    <span>·</span>
                    <span>{daysAgo(h.at)}</span>
                    <span>·</span>
                    <Badge tone={m.tone}>{m.label}</Badge>
                    <span className="ml-auto tabular-nums">Score {h.score}{h.grade ? ` (${h.grade})` : ''}/100{h.cibilScore ? ` · CIBIL ${h.cibilScore}` : ''}</span>
                  </div>
                  <p className="text-sm text-stone-700 mt-1.5 leading-relaxed">{h.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const REC_META = {
  PROCEED: { label: 'Proceed to Lenders', sub: 'Share with lenders', tone: 'emerald', icon: ArrowUpRight },
  MORE_INFO: { label: 'Request More Info', sub: 'Pend until clarified', tone: 'amber', icon: AlertCircle },
  HOLD: { label: 'Put on Hold', sub: 'Pause this application', tone: 'stone', icon: PauseCircle },
  REJECT: { label: 'Reject', sub: 'Decline the application', tone: 'rose', icon: XCircle },
};

const ScoreGauge = ({ value, color }) => {
  const size = 96, stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f5f5f4" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <Gauge size={20} style={{ color }} />
      </div>
    </div>
  );
};


// ============================================================
// FOLLOW-UPS PANEL
// ============================================================

const FollowUpsPanel = ({ lead, updateLead, currentUser, role }) => {
  const [showForm, setShowForm] = useState(false);
  const [channel, setChannel] = useState('CALL');
  const [outcome, setOutcome] = useState('CONNECTED');
  const [note, setNote] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [nextDate, setNextDate] = useState('');

  const touchpoints = lead.touchpoints || [];
  const nextFollowUp = lead.nextFollowUp;
  const followUpDate = nextFollowUp ? new Date(nextFollowUp) : null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isOverdue = followUpDate && followUpDate < today;
  const isToday = followUpDate && followUpDate.toDateString() === today.toDateString();

  const logTouchpoint = () => {
    if (!note.trim()) { alert('Please add a note for this touchpoint.'); return; }
    const tp = {
      id: uid(),
      at: new Date().toISOString(),
      by: currentUser.name,
      channel, outcome,
      note: note.trim(),
      nextAction: nextAction.trim() || null,
      nextDate: nextDate || null,
    };
    updateLead({
      touchpoints: [...touchpoints, tp],
      nextFollowUp: nextDate || lead.nextFollowUp,
    });
    setShowForm(false);
    setNote(''); setNextAction(''); setNextDate('');
    setChannel('CALL'); setOutcome('CONNECTED');
  };

  return (
    <div className="space-y-5">
      {/* Next follow-up banner */}
      <div className={`rounded-lg p-5 ring-1 ${
        isOverdue ? 'bg-rose-50 ring-rose-200' :
        isToday ? 'bg-amber-50 ring-amber-200' :
        nextFollowUp ? 'bg-sky-50 ring-sky-200' :
        'bg-white ring-stone-200'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-stone-600">Next follow-up</div>
            {nextFollowUp ? (
              <div className="font-serif text-2xl text-stone-900 mt-1">
                {followUpDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                {isOverdue && <span className="ml-3 text-sm text-rose-700">· Overdue</span>}
                {isToday && <span className="ml-3 text-sm text-amber-700">· Today</span>}
              </div>
            ) : (
              <div className="font-serif text-2xl text-stone-500 mt-1">No follow-up scheduled</div>
            )}
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={14} /> Log touchpoint
          </Button>
        </div>
      </div>

      {/* Log touchpoint form */}
      {showForm && (
        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
          <h3 className="font-serif text-lg text-stone-900 mb-4">Log a touchpoint</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              options={Object.entries(TOUCHPOINT_CHANNELS).map(([k, v]) => ({ value: k, label: v.label }))}
            />
            <Select
              label="Outcome"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              options={Object.entries(TOUCHPOINT_OUTCOMES).map(([k, v]) => ({ value: k, label: v.label }))}
            />
          </div>
          <Textarea
            label="Note"
            className="mt-4"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was discussed? Any commitments made?"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Next action" value={nextAction} onChange={(e) => setNextAction(e.target.value)} placeholder="e.g. Collect audited financials" />
            <Input label="Next follow-up date" type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-stone-100">
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={logTouchpoint}>Save touchpoint</Button>
          </div>
        </div>
      )}

      {/* Touchpoint history */}
      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
        <h3 className="font-serif text-lg text-stone-900 mb-4">Touchpoint history ({touchpoints.length})</h3>
        {touchpoints.length === 0 ? (
          <div className="text-sm text-stone-500 py-8 text-center">No touchpoints logged yet. Click "Log touchpoint" to record the first interaction.</div>
        ) : (
          <ol className="relative border-l-2 border-stone-100 ml-2 space-y-5">
            {[...touchpoints].reverse().map((tp) => {
              const ChannelIcon = TOUCHPOINT_CHANNELS[tp.channel]?.icon || Phone;
              const outcomeMeta = TOUCHPOINT_OUTCOMES[tp.outcome];
              return (
                <li key={tp.id} className="ml-5 relative">
                  <div className="absolute -left-[30px] w-6 h-6 rounded-full bg-white ring-2 ring-stone-200 grid place-items-center">
                    <ChannelIcon size={11} className="text-stone-600" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-xs text-stone-500">
                    <span className="font-medium text-stone-900">{tp.by}</span>
                    <span>·</span>
                    <span>{TOUCHPOINT_CHANNELS[tp.channel]?.label}</span>
                    <span>·</span>
                    <span>{daysAgo(tp.at)}</span>
                    {outcomeMeta && <Badge tone={outcomeMeta.tone}>{outcomeMeta.label}</Badge>}
                  </div>
                  <p className="text-sm text-stone-800 mt-1.5 leading-relaxed">{tp.note}</p>
                  {(tp.nextAction || tp.nextDate) && (
                    <div className="mt-2 bg-stone-50 rounded-md px-3 py-2 text-xs border border-stone-100">
                      <span className="text-stone-500 uppercase tracking-wider text-[10px]">Next: </span>
                      {tp.nextAction && <span className="text-stone-800">{tp.nextAction}</span>}
                      {tp.nextDate && <span className="text-stone-600"> · {new Date(tp.nextDate).toLocaleDateString('en-IN')}</span>}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
};


// ============================================================
// MANDATE PANEL — Authorization + Fee Agreement
// ============================================================

const MandatePanel = ({ lead, updateLead, currentUser, role }) => {
  const mandate = lead.mandate;
  const [generating, setGenerating] = useState(false);
  const [showSigningFlow, setShowSigningFlow] = useState(false);

  // Fee config state (back office only, when generating)
  const [feePercent, setFeePercent] = useState(mandate?.feePercent ?? 1.5);
  const [feeCap, setFeeCap] = useState(mandate?.feeCap ?? '');
  const [validity, setValidity] = useState(mandate?.validity ?? 90);
  const [authorizedLenders, setAuthorizedLenders] = useState(mandate?.authorizedLenders ?? 'All empanelled lenders');

  const generateMandate = () => {
    const docId = `MND-${new Date().getFullYear()}-${lead.id.replace(/[^0-9]/g, '')}`;
    updateLead({
      mandate: {
        status: 'Draft',
        generatedAt: new Date().toISOString(),
        generatedBy: currentUser.name,
        feePercent: Number(feePercent),
        feeCap: feeCap ? Number(feeCap) : null,
        validity: Number(validity),
        authorizedLenders,
        documentId: docId,
        consents: { authorization: false, fee: false },
      }
    });
  };

  const sendMandate = () => {
    updateLead({
      mandate: {
        ...mandate,
        status: 'Sent',
        sentAt: new Date().toISOString(),
        sentBy: currentUser.name,
      },
      prequalStage: (lead.prequalStage === 'NEW' || lead.prequalStage === 'CONTACTED' || lead.prequalStage === 'QUALIFIED') ? 'MANDATE_PENDING' : lead.prequalStage,
    });
    alert('Mandate sent to borrower for e-signature.');
  };

  const regenerateMandate = () => {
    if (!confirm('This will replace the current mandate. Continue?')) return;
    updateLead({ mandate: null });
  };

  // ============== VIEWS ==============

  if (!mandate) {
    // No mandate yet
    if (role !== 'BACKOFFICE') {
      return (
        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-10 text-center">
          <ScrollText size={32} className="mx-auto text-stone-300" />
          <p className="text-sm text-stone-600 mt-3">No mandate has been generated for this lead yet.</p>
          {role === 'BORROWER' && <p className="text-xs text-stone-500 mt-1">Our team will share the mandate for your e-signature shortly.</p>}
        </div>
      );
    }

    // Back office: generation form
    return (
      <div className="space-y-5">
        <div className="bg-amber-50 ring-1 ring-amber-200 rounded-md px-4 py-3 text-xs text-amber-900 leading-relaxed">
          <strong>About the mandate.</strong> The mandate authorizes Arthashala to approach lenders on behalf of the borrower and secures the borrower's agreement to pay a success fee on disbursement. It is a prerequisite before sharing with any lender.
        </div>

        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
          <h3 className="font-serif text-lg text-stone-900 mb-4">Configure mandate terms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Success fee (%)"
              type="number" step="0.25"
              value={feePercent}
              onChange={(e) => setFeePercent(e.target.value)}
              hint="Typically 1.0–2.5% of sanctioned amount"
            />
            <Input
              label="Fee cap (optional, ₹)"
              type="number"
              value={feeCap}
              onChange={(e) => setFeeCap(e.target.value)}
              placeholder="Leave blank for no cap"
              hint={feeCap ? formatINR(feeCap) : 'No cap'}
            />
            <Input
              label="Validity (days)"
              type="number"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              hint="Mandate expires after this period"
            />
          </div>
          <Textarea
            label="Authorized lenders"
            className="mt-4"
            value={authorizedLenders}
            onChange={(e) => setAuthorizedLenders(e.target.value)}
            placeholder="e.g. All empanelled lenders / NBFCs only / HDFC, ICICI, Bajaj only"
            hint="Names the lenders Arthashala may approach on behalf of the borrower"
          />
          <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-stone-100">
            <Button variant="amber" onClick={generateMandate}>
              <ScrollText size={14} /> Generate mandate
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mandate exists — compute derived values
  const estimatedFee = Number(lead.loanAmount) * (mandate.feePercent / 100);
  const payableFee = mandate.feeCap ? Math.min(estimatedFee, mandate.feeCap) : estimatedFee;
  const sentDate = mandate.sentAt ? new Date(mandate.sentAt) : null;
  const expiresAt = sentDate ? new Date(sentDate.getTime() + mandate.validity * 86400000) : null;
  const isExpired = expiresAt && new Date() > expiresAt && mandate.status !== 'Signed';

  return (
    <div className="space-y-5">
      {/* Status card */}
      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl text-stone-900">Mandate</h2>
              {mandate.status === 'Signed' && <Badge tone="emerald"><BadgeCheck size={10} className="inline -mt-0.5 mr-0.5" /> Signed</Badge>}
              {mandate.status === 'Sent' && !isExpired && <Badge tone="amber"><Clock size={10} className="inline -mt-0.5 mr-0.5" /> Awaiting signature</Badge>}
              {mandate.status === 'Draft' && <Badge tone="stone">Draft</Badge>}
              {isExpired && <Badge tone="rose">Expired</Badge>}
            </div>
            <div className="text-xs text-stone-500 mt-2 font-mono">{mandate.documentId}</div>
          </div>
          {role === 'BACKOFFICE' && mandate.status !== 'Signed' && (
            <Button variant="ghost" size="sm" onClick={regenerateMandate}>
              <Trash2 size={12} /> Discard & regenerate
            </Button>
          )}
        </div>

        <div className="mt-5 pt-5 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-stone-500">Success fee</div>
            <div className="font-serif text-xl text-stone-900 tabular-nums mt-1">{mandate.feePercent}%</div>
            <div className="text-xs text-stone-500 mt-0.5">
              {mandate.feeCap ? `capped at ${formatINR(mandate.feeCap)}` : 'no cap'}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-stone-500">Est. fee if sanctioned</div>
            <div className="font-serif text-xl text-stone-900 tabular-nums mt-1">{formatINR(payableFee)}</div>
            <div className="text-xs text-stone-500 mt-0.5">on ₹{(lead.loanAmount / 1e7).toFixed(2)} Cr loan</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-stone-500">Validity</div>
            <div className="font-serif text-xl text-stone-900 tabular-nums mt-1">{mandate.validity} days</div>
            <div className="text-xs text-stone-500 mt-0.5">
              {expiresAt ? `expires ${expiresAt.toLocaleDateString('en-IN')}` : 'starts when sent'}
            </div>
          </div>
        </div>
      </div>

      {/* Mandate document preview */}
      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center pb-5 border-b border-stone-200">
            <div className="text-[10px] uppercase tracking-[0.2em] text-amber-700">Arthashala · Loan Intermediation Mandate</div>
            <div className="font-serif text-3xl text-stone-900 mt-2">Mandate of Authorization</div>
            <div className="text-xs text-stone-500 mt-1 font-mono">Document ID: {mandate.documentId}</div>
          </div>

          <div className="mt-6 space-y-4 text-sm text-stone-800 leading-relaxed">
            <p>
              This Mandate is executed by <strong>{lead.companyName}</strong>, a {lead.businessType} having its registered office at {lead.city}, {lead.state} — {lead.pin} (hereinafter referred to as the "Borrower"), acting through its authorized signatory <strong>{lead.contactName}</strong> ({lead.designation}).
            </p>

            <div>
              <div className="font-medium text-stone-900 mt-5 mb-2">1. Scope of Authorization</div>
              <p>The Borrower hereby authorizes <strong>Arthashala</strong> to act as its representative for the purpose of sourcing, negotiating, and facilitating a business loan facility of up to <strong>{formatINR(lead.loanAmount)}</strong> ({lead.loanType}, {lead.secured ? 'secured' : 'unsecured'}, tenure {lead.tenure} months) from lenders empanelled with Arthashala.</p>
              <p className="mt-2">Authorized lenders under this mandate: <em>{mandate.authorizedLenders}</em>.</p>
            </div>

            <div>
              <div className="font-medium text-stone-900 mt-5 mb-2">2. Information Sharing</div>
              <p>The Borrower authorizes Arthashala to share its financial, KYC, and business information with the authorized lenders solely for the purpose of loan evaluation. Arthashala agrees to maintain confidentiality and not to use such information for any other purpose.</p>
            </div>

            <div>
              <div className="font-medium text-stone-900 mt-5 mb-2">3. Success Fee</div>
              <p>The Borrower agrees to pay Arthashala a success fee of <strong>{mandate.feePercent}%</strong> (plus applicable GST) of the loan amount sanctioned and disbursed through Arthashala's efforts{mandate.feeCap ? `, subject to a maximum cap of ${formatINR(mandate.feeCap)}` : ''}. The fee is payable within seven (7) days of loan disbursement.</p>
              <p className="mt-2 text-xs text-stone-600">Estimated fee on full sanction of {formatINR(lead.loanAmount)}: <strong className="text-stone-900">{formatINR(payableFee)}</strong> (plus GST).</p>
            </div>

            <div>
              <div className="font-medium text-stone-900 mt-5 mb-2">4. Validity</div>
              <p>This mandate shall remain valid for a period of <strong>{mandate.validity} days</strong> from the date of signature, unless withdrawn in writing by the Borrower or extended by mutual consent.</p>
            </div>

            <div>
              <div className="font-medium text-stone-900 mt-5 mb-2">5. No Guarantee of Sanction</div>
              <p>The Borrower acknowledges that Arthashala does not guarantee loan sanction. The final decision rests solely with the lender(s), and Arthashala's role is limited to facilitation.</p>
            </div>
          </div>

          {/* Signature block */}
          <div className="mt-8 pt-6 border-t border-stone-200">
            {mandate.status === 'Signed' ? (
              <div className="bg-emerald-50 rounded-lg p-5 ring-1 ring-emerald-200">
                <div className="flex items-center gap-2">
                  <BadgeCheck size={18} className="text-emerald-700" />
                  <span className="font-serif text-lg text-stone-900">Electronically signed</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-stone-700">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-500">Signed by</div>
                    <div className="text-stone-900 mt-0.5">{mandate.signedBy?.name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-500">Signed on</div>
                    <div className="text-stone-900 mt-0.5">{new Date(mandate.signedAt).toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-500">IP address</div>
                    <div className="text-stone-900 mt-0.5 font-mono">{mandate.signedBy?.ip}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-500">Device</div>
                    <div className="text-stone-900 mt-0.5">{mandate.signedBy?.userAgent}</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-emerald-200 text-[11px] text-stone-600 leading-relaxed">
                  Both consents captured: <strong>Authorization to approach lenders</strong> ✓ · <strong>Success fee agreement</strong> ✓
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 rounded-lg p-5 ring-1 ring-stone-200 border-dashed">
                <div className="text-[10px] uppercase tracking-wider text-stone-500">Signature block</div>
                <div className="font-serif text-lg text-stone-400 italic mt-1">— Not yet signed —</div>
                <div className="text-xs text-stone-500 mt-1">To be e-signed by {lead.contactName}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions by role */}
      {role === 'BACKOFFICE' && (
        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-500">Back office actions</div>
              <div className="text-sm text-stone-700 mt-1">
                {mandate.status === 'Draft' && 'Mandate is a draft. Send to borrower to proceed.'}
                {mandate.status === 'Sent' && !isExpired && `Sent to ${lead.email}. Awaiting e-signature.`}
                {mandate.status === 'Signed' && 'Mandate signed and locked. Proceed to lender submissions.'}
                {isExpired && 'Mandate has expired. Regenerate and resend.'}
              </div>
            </div>
            <div className="flex gap-2">
              {mandate.status === 'Draft' && <Button onClick={sendMandate}><Send size={14} /> Send to borrower</Button>}
              {mandate.status === 'Sent' && !isExpired && (
                <Button variant="secondary" onClick={() => {
                  updateLead({ mandate: { ...mandate, sentAt: new Date().toISOString() } });
                  alert('Reminder sent.');
                }}>
                  <Mail size={14} /> Resend reminder
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {role === 'BORROWER' && mandate.status !== 'Signed' && !isExpired && (
        <div className="bg-stone-900 rounded-lg p-6 text-stone-100">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <h3 className="font-serif text-xl text-stone-50">Please review and sign</h3>
              <p className="text-sm text-stone-300 mt-2 leading-relaxed">
                By signing, you authorize Arthashala to approach lenders on your behalf and agree to pay a success fee of {mandate.feePercent}% on the loan amount sanctioned and disbursed.
              </p>
            </div>
            <Button variant="amber" onClick={() => setShowSigningFlow(true)}>
              Review & sign <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {showSigningFlow && (
        <MandateSigningModal
          lead={lead}
          mandate={mandate}
          payableFee={payableFee}
          currentUser={currentUser}
          onClose={() => setShowSigningFlow(false)}
          onSign={(signatureData) => {
            updateLead({
              mandate: {
                ...mandate,
                status: 'Signed',
                signedAt: new Date().toISOString(),
                signedBy: signatureData,
                consents: { authorization: true, fee: true },
              },
              prequalStage: 'MANDATE_SIGNED',
            });
            setShowSigningFlow(false);
          }}
        />
      )}
    </div>
  );
};


// --- E-signature modal ---
const MandateSigningModal = ({ lead, mandate, payableFee, currentUser, onClose, onSign }) => {
  const [authConsent, setAuthConsent] = useState(false);
  const [feeConsent, setFeeConsent] = useState(false);
  const [typedName, setTypedName] = useState('');
  const expectedName = lead.contactName;

  const canSign = authConsent && feeConsent && typedName.trim().toLowerCase() === expectedName.toLowerCase();

  const handleSign = () => {
    // Simulated IP + user agent (in production, server-captured)
    const fakeIP = `${Math.floor(Math.random() * 223 + 1)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const ua = navigator.userAgent.includes('Chrome') ? 'Chrome · ' : navigator.userAgent.includes('Safari') ? 'Safari · ' : 'Browser · ';
    const device = /Mobi|Android|iPhone/.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
    onSign({
      name: typedName.trim(),
      ip: fakeIP,
      userAgent: ua + device,
    });
  };

  return (
    <Modal open={true} onClose={onClose} title="Review and sign mandate" size="lg">
      <div className="space-y-5">
        {/* Summary */}
        <div className="bg-stone-50 rounded-md p-4 ring-1 ring-stone-200">
          <div className="text-[10px] uppercase tracking-wider text-stone-500">Summary of terms</div>
          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
            <div>
              <div className="text-stone-500 text-xs">Loan amount</div>
              <div className="text-stone-900 font-serif">{formatINR(lead.loanAmount)}</div>
            </div>
            <div>
              <div className="text-stone-500 text-xs">Loan type</div>
              <div className="text-stone-900">{lead.loanType}</div>
            </div>
            <div>
              <div className="text-stone-500 text-xs">Success fee</div>
              <div className="text-stone-900">{mandate.feePercent}% {mandate.feeCap ? `(cap ${formatINR(mandate.feeCap)})` : '(no cap)'}</div>
            </div>
            <div>
              <div className="text-stone-500 text-xs">Est. fee if sanctioned fully</div>
              <div className="text-stone-900 font-serif">{formatINR(payableFee)}</div>
            </div>
            <div className="col-span-2">
              <div className="text-stone-500 text-xs">Authorized lenders</div>
              <div className="text-stone-900 text-sm">{mandate.authorizedLenders}</div>
            </div>
          </div>
        </div>

        {/* Consent checkboxes */}
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded-md ring-1 ring-stone-200 cursor-pointer hover:bg-stone-50">
            <input
              type="checkbox"
              checked={authConsent}
              onChange={(e) => setAuthConsent(e.target.checked)}
              className="mt-0.5"
            />
            <div className="text-sm text-stone-800">
              <strong>Authorization.</strong> I authorize Arthashala to approach the lenders named above on my behalf, share my financial and KYC information with them for the purpose of evaluating this loan application, and negotiate terms on my behalf.
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-md ring-1 ring-stone-200 cursor-pointer hover:bg-stone-50">
            <input
              type="checkbox"
              checked={feeConsent}
              onChange={(e) => setFeeConsent(e.target.checked)}
              className="mt-0.5"
            />
            <div className="text-sm text-stone-800">
              <strong>Fee agreement.</strong> I agree to pay Arthashala a success fee of {mandate.feePercent}% (plus GST) on the loan amount sanctioned and disbursed through their efforts{mandate.feeCap ? `, capped at ${formatINR(mandate.feeCap)}` : ''}, payable within 7 days of disbursement. No fee is payable if no loan is sanctioned.
            </div>
          </label>
        </div>

        {/* Typed signature */}
        <div className="bg-stone-50 rounded-md p-4 ring-1 ring-stone-200">
          <label className="block">
            <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">Type your full name to sign</div>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={expectedName}
              className="w-full px-4 py-3 text-xl font-serif italic bg-white border border-stone-300 rounded focus:border-stone-900 outline-none"
            />
            <div className="text-xs text-stone-500 mt-2">
              Must match exactly: <strong>{expectedName}</strong>
              {typedName && typedName.trim().toLowerCase() !== expectedName.toLowerCase() && (
                <span className="text-rose-700 ml-2">Name doesn't match</span>
              )}
            </div>
          </label>
        </div>

        <div className="text-[11px] text-stone-500 leading-relaxed">
          By clicking "Sign mandate" you agree that your electronic signature, along with the timestamp, IP address, and device details captured at the time of signing, constitute a legally valid signature under the Information Technology Act, 2000.
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="amber" onClick={handleSign} disabled={!canSign}>
            <BadgeCheck size={14} /> Sign mandate
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// ============================================================
// LEAD DETAIL — with tabs (Overview, Financials, Documents, Credit, Lenders, Activity)
// ============================================================

const LeadDetail = ({ lead, associates, leads, setLeads, onBack, role, currentUser }) => {
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
    ...(role !== 'BORROWER' ? [{ k: 'followups', label: 'Follow-ups', icon: Phone }] : []),
    { k: 'mandate', label: 'Mandate', icon: ScrollText },
    { k: 'financials', label: 'Financials', icon: IndianRupee },
    { k: 'documents', label: 'Documents', icon: FileText },
    ...(role === 'BACKOFFICE' ? [{ k: 'credit', label: 'Credit Review', icon: ClipboardCheck }] : []),
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

      {tab === 'followups' && role !== 'BORROWER' && (
        <FollowUpsPanel lead={lead} updateLead={updateLead} currentUser={currentUser} role={role} />
      )}

      {tab === 'mandate' && (
        <MandatePanel lead={lead} updateLead={updateLead} currentUser={currentUser} role={role} />
      )}

      {tab === 'credit' && role === 'BACKOFFICE' && (
        <CreditReviewPanel lead={lead} updateLead={updateLead} currentUser={currentUser} />
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
    city: '', state: '', pin: '', gstin: '', pan: '', aadhaar: '',
    turnover: '', turnoverPrev: '', netProfit: '',
    existingLoans: false, existingAmount: '', monthlyEmi: '',
    loanAmount: '', loanType: 'Term Loan', secured: true, tenure: 60,
    purpose: '', collateral: '',
    source: role === 'ASSOCIATE' ? 'ASSOCIATE' : (role === 'BORROWER' ? 'DIRECT' : 'DIRECT'),
    sourceDetail: '',
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
      prequalStage: role === 'BORROWER' ? 'CONVERTED' : 'NEW',
      nextFollowUp: role === 'BORROWER' ? null : new Date().toISOString().slice(0, 10),
      touchpoints: [],
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
            <Input label="GSTIN" value={data.gstin} onChange={(e) => update('gstin', e.target.value.toUpperCase())} />
            <Input label="Promoter Aadhaar" className="md:col-span-2" value={data.aadhaar} onChange={(e) => update('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="12-digit Aadhaar" hint="Stored masked. Used for promoter KYC verification." />
          </div>
          {role === 'BACKOFFICE' && (
            <div className="pt-4 border-t border-stone-100 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Lead source" value={data.source} onChange={(e) => update('source', e.target.value)} options={
                  Object.entries(LEAD_SOURCES).map(([k, v]) => ({ value: k, label: v.label }))
                } />
                {data.source === 'ASSOCIATE' && (
                  <Select label="Associate" value={data.associateId} onChange={(e) => update('associateId', e.target.value)} options={[
                    { value: '', label: 'Select associate…' },
                    ...associates.map(a => ({ value: a.id, label: `${a.name} (${a.city})` }))
                  ]} />
                )}
              </div>
              <Input
                label={`Source detail ${data.source === 'DIGITAL_ADS' ? '(campaign name)' : data.source === 'EVENT' ? '(event name)' : data.source === 'PARTNER_REFERRAL' ? '(partner name)' : '(optional)'}`}
                value={data.sourceDetail || ''}
                onChange={(e) => update('sourceDetail', e.target.value)}
                placeholder={
                  data.source === 'DIGITAL_ADS' ? 'e.g. Google Ads — "business loan"' :
                  data.source === 'EVENT' ? 'e.g. Retailers Meet April 2026' :
                  data.source === 'PARTNER_REFERRAL' ? 'e.g. CA Ravi Khanna' :
                  data.source === 'WEBSITE' ? 'e.g. Contact form' :
                  'Additional context about the source'
                }
              />
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

      {lead.mandate && lead.mandate.status !== 'Signed' && (
        <div className="bg-stone-900 rounded-lg p-6 text-stone-100">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-10 h-10 bg-amber-500 text-stone-900 rounded-md grid place-items-center shrink-0">
              <ScrollText size={18} />
            </div>
            <div className="flex-1 min-w-[260px]">
              <div className="text-[11px] uppercase tracking-[0.15em] text-amber-400">Action Required</div>
              <h3 className="font-serif text-xl text-stone-50 mt-1">Please review and sign your mandate</h3>
              <p className="text-sm text-stone-300 mt-2 leading-relaxed">
                This authorizes Arthashala to approach lenders on your behalf and sets the success fee terms. Your application cannot proceed until this is signed.
              </p>
            </div>
            <Button variant="amber" onClick={() => setView && setView('dashboard')} title="Open mandate from the lead detail">
              Review mandate <ArrowRight size={14} />
            </Button>
          </div>
          <p className="text-xs text-stone-400 mt-3">Find the Mandate tab in your application to sign.</p>
        </div>
      )}

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
// PERMISSION HELPER
// ============================================================
const hasPermission = (role, key, permissions) => {
  if (!role || !permissions || !permissions[key]) return false;
  return permissions[key].includes(role);
};

// ============================================================
// ADMIN MODULE
// ============================================================

const AdminModule = ({ users, setUsers, permissions, setPermissions, settings, setSettings, auditLog, setAuditLog, currentUser, leads }) => {
  const [tab, setTab] = useState('users');

  const addAudit = (action, detail) => {
    const entry = {
      id: uid(),
      at: new Date().toISOString(),
      by: currentUser.name,
      byId: currentUser.id,
      action, detail,
    };
    setAuditLog(prev => [entry, ...(prev || [])].slice(0, 500));
  };

  const tabs = [
    { k: 'users', label: 'Users', icon: Users },
    { k: 'permissions', label: 'Permissions', icon: ShieldCheck },
    { k: 'lenders', label: 'Lender Panel', icon: Landmark },
    { k: 'fees', label: 'Fees & Commissions', icon: Percent },
    { k: 'org', label: 'Organization', icon: Building2 },
    { k: 'audit', label: 'Audit Log', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-stone-900">Admin</h1>
        <p className="text-sm text-stone-600 mt-1">System-wide configuration. Handle with care.</p>
      </div>

      <div className="flex items-center gap-1 flex-wrap bg-white rounded-lg p-1 ring-1 ring-stone-200">
        {tabs.map(t => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              tab === t.k ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'users' && <AdminUsersView users={users} setUsers={setUsers} currentUser={currentUser} addAudit={addAudit} />}
      {tab === 'permissions' && <AdminPermissionsView permissions={permissions} setPermissions={setPermissions} addAudit={addAudit} />}
      {tab === 'lenders' && <AdminLendersView addAudit={addAudit} />}
      {tab === 'fees' && <AdminFeesView settings={settings} setSettings={setSettings} addAudit={addAudit} />}
      {tab === 'org' && <AdminOrgView settings={settings} setSettings={setSettings} addAudit={addAudit} />}
      {tab === 'audit' && <AdminAuditView auditLog={auditLog} />}
    </div>
  );
};

// --- User Management ---
const AdminUsersView = ({ users, setUsers, currentUser, addAudit }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = users.filter(u => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const changeRole = (userId, newRole) => {
    const u = users.find(x => x.id === userId);
    if (!u) return;
    if (u.id === currentUser.id && newRole !== 'ADMIN') {
      alert("You can't downgrade your own ADMIN role. Ask another admin to do it.");
      return;
    }
    setUsers(users.map(x => x.id === userId ? { ...x, role: newRole } : x));
    addAudit('USER_ROLE_CHANGED', `${u.name} (${u.email}): ${u.role} → ${newRole}`);
  };

  const resetPassword = (userId) => {
    const newPass = 'temp' + Math.random().toString(36).slice(2, 8);
    setUsers(users.map(x => x.id === userId ? { ...x, password: newPass } : x));
    const u = users.find(x => x.id === userId);
    addAudit('PASSWORD_RESET', `Reset password for ${u.name} (${u.email})`);
    alert(`Password reset. Temporary password: ${newPass}\n\nShare this securely with the user and ask them to change it immediately.`);
  };

  const toggleDisabled = (userId) => {
    const u = users.find(x => x.id === userId);
    if (!u) return;
    if (u.id === currentUser.id) {
      alert("You can't disable your own account.");
      return;
    }
    setUsers(users.map(x => x.id === userId ? { ...x, disabled: !x.disabled } : x));
    addAudit(u.disabled ? 'USER_ENABLED' : 'USER_DISABLED', `${u.name} (${u.email})`);
  };

  const deleteUser = (userId) => {
    const u = users.find(x => x.id === userId);
    if (!u) return;
    if (u.id === currentUser.id) { alert("You can't delete your own account."); return; }
    if (!confirm(`Permanently delete ${u.name}? This cannot be undone.`)) return;
    setUsers(users.filter(x => x.id !== userId));
    addAudit('USER_DELETED', `${u.name} (${u.email})`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex-1 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name or email…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:border-stone-900 outline-none"
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="text-sm px-3 py-2 bg-white border border-stone-300 rounded-md">
            <option value="ALL">All roles</option>
            {Object.keys(ROLE_META).map(r => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
          </select>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus size={14} /> Add user</Button>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50 border-b border-stone-200">
              <th className="text-left font-medium px-6 py-3">User</th>
              <th className="text-left font-medium px-3 py-3">Role</th>
              <th className="text-left font-medium px-3 py-3">Joined</th>
              <th className="text-left font-medium px-3 py-3">Status</th>
              <th className="text-right font-medium px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan="5" className="text-center py-8 text-sm text-stone-500">No users match.</td></tr>
            )}
            {filtered.map(u => (
              <tr key={u.id} className="border-t border-stone-100 hover:bg-stone-50/50">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-400 grid place-items-center font-serif text-sm shrink-0">
                      {u.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="text-stone-900">{u.name} {u.id === currentUser.id && <span className="text-xs text-stone-500">(you)</span>}</div>
                      <div className="text-xs text-stone-500 truncate">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="text-xs px-2 py-1 bg-white border border-stone-300 rounded"
                  >
                    {Object.keys(ROLE_META).map(r => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3 text-xs text-stone-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                <td className="px-3 py-3">
                  {u.disabled ? <Badge tone="rose">Disabled</Badge> : <Badge tone="emerald">Active</Badge>}
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <button onClick={() => resetPassword(u.id)} className="p-1.5 text-stone-500 hover:text-stone-900" title="Reset password">
                      <RefreshCw size={13} />
                    </button>
                    <button onClick={() => toggleDisabled(u.id)} className="p-1.5 text-stone-500 hover:text-stone-900" title={u.disabled ? 'Enable' : 'Disable'}>
                      {u.disabled ? <CheckCircle2 size={13} /> : <PauseCircle size={13} />}
                    </button>
                    <button onClick={() => deleteUser(u.id)} className="p-1.5 text-stone-500 hover:text-rose-700" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminNewUserModal open={showNew} onClose={() => setShowNew(false)} onCreate={(u) => {
        if (users.find(x => x.email.toLowerCase() === u.email.toLowerCase())) {
          alert('Email already exists.');
          return;
        }
        setUsers([...users, u]);
        addAudit('USER_CREATED', `${u.name} (${u.email}) as ${u.role}`);
        setShowNew(false);
      }} />
    </div>
  );
};

const AdminNewUserModal = ({ open, onClose, onCreate }) => {
  const [data, setData] = useState({ name: '', email: '', phone: '', role: 'BACKOFFICE', password: '', city: '', commission: 0.75, companyName: '' });

  const submit = () => {
    if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
      alert('Name, email, and password are required.'); return;
    }
    if (data.password.length < 6) { alert('Password must be at least 6 characters.'); return; }
    const u = {
      id: `u_${uid()}`,
      role: data.role,
      email: data.email.trim().toLowerCase(),
      password: data.password,
      name: data.name.trim(),
      phone: data.phone.trim(),
      createdAt: new Date().toISOString(),
      ...(data.role === 'ASSOCIATE' && { city: data.city.trim(), commission: Number(data.commission) || 0.75 }),
      ...(data.role === 'BORROWER' && { companyName: data.companyName.trim() }),
    };
    onCreate(u);
    setData({ name: '', email: '', phone: '', role: 'BACKOFFICE', password: '', city: '', commission: 0.75, companyName: '' });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add new user" size="md">
      <div className="space-y-4">
        <Select label="Role" value={data.role} onChange={(e) => setData({ ...data, role: e.target.value })}
          options={Object.keys(ROLE_META).map(r => ({ value: r, label: ROLE_META[r].label }))} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Full name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
          <Input label="Phone" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
        </div>
        <Input label="Email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
        <Input label="Initial password" type="text" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} hint="User should change on first login" />
        {data.role === 'ASSOCIATE' && (
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })} />
            <Input label="Commission %" type="number" step="0.25" value={data.commission} onChange={(e) => setData({ ...data, commission: e.target.value })} />
          </div>
        )}
        {data.role === 'BORROWER' && (
          <Input label="Company name" value={data.companyName} onChange={(e) => setData({ ...data, companyName: e.target.value })} />
        )}
      </div>
      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-stone-200">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={submit}>Create user</Button>
      </div>
    </Modal>
  );
};

// --- Permissions Matrix ---
const AdminPermissionsView = ({ permissions, setPermissions, addAudit }) => {
  const groups = {};
  Object.entries(PERMISSIONS).forEach(([k, v]) => {
    if (!groups[v.group]) groups[v.group] = [];
    groups[v.group].push([k, v]);
  });

  const togglePermission = (permKey, role) => {
    const current = permissions[permKey] || [];
    const next = current.includes(role)
      ? current.filter(r => r !== role)
      : [...current, role];
    setPermissions({ ...permissions, [permKey]: next });
    addAudit('PERMISSION_CHANGED', `${PERMISSIONS[permKey].label} · ${role}: ${current.includes(role) ? 'revoked' : 'granted'}`);
  };

  const resetDefaults = () => {
    if (!confirm('Reset all permissions to defaults? Any custom configuration will be lost.')) return;
    setPermissions(DEFAULT_PERMISSIONS);
    addAudit('PERMISSIONS_RESET', 'All permissions reset to defaults');
  };

  const roles = Object.keys(ROLE_META);

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 ring-1 ring-amber-200 rounded-md px-4 py-3 text-xs text-amber-900 leading-relaxed">
        <strong>Role-based access control.</strong> Toggle which roles can perform each action. Changes take effect immediately. Admin retains all critical permissions by default.
      </div>

      {Object.entries(groups).map(([group, perms]) => (
        <div key={group} className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-200">
            <h3 className="font-serif text-base text-stone-900">{group}</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-stone-500 border-b border-stone-100">
                <th className="text-left font-medium px-6 py-2.5">Permission</th>
                {roles.map(r => <th key={r} className="text-center font-medium px-3 py-2.5">{ROLE_META[r].label}</th>)}
              </tr>
            </thead>
            <tbody>
              {perms.map(([pk, pv]) => (
                <tr key={pk} className="border-t border-stone-100">
                  <td className="px-6 py-3">
                    <div className="text-stone-900">{pv.label}</div>
                    <div className="text-[10px] font-mono text-stone-500 mt-0.5">{pk}</div>
                  </td>
                  {roles.map(r => {
                    const checked = (permissions[pk] || []).includes(r);
                    return (
                      <td key={r} className="px-3 py-3 text-center">
                        <button
                          onClick={() => togglePermission(pk, r)}
                          className={`w-5 h-5 rounded grid place-items-center transition-colors ${
                            checked ? 'bg-stone-900 text-stone-50' : 'bg-stone-100 hover:bg-stone-200 text-transparent'
                          }`}
                          title={checked ? `Revoke from ${ROLE_META[r].label}` : `Grant to ${ROLE_META[r].label}`}
                        >
                          <CheckCircle2 size={12} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="flex justify-end">
        <Button variant="ghost" onClick={resetDefaults}><RefreshCw size={12} /> Reset to defaults</Button>
      </div>
    </div>
  );
};

// --- Lender Panel Management (read-only for now; LENDERS is a constant) ---
const AdminLendersView = ({ addAudit }) => (
  <div className="space-y-5">
    <div className="bg-stone-100 ring-1 ring-stone-200 rounded-md px-4 py-3 text-xs text-stone-700 leading-relaxed">
      <strong>Lender panel.</strong> These are the {LENDERS.length} lenders currently on your panel. In production, you'd add/edit/remove lenders, configure integration credentials (API keys, email routing), and set lender-specific eligibility rules. For this prototype, changes here are visual only.
    </div>
    <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50 border-b border-stone-200">
            <th className="text-left font-medium px-6 py-3">Lender</th>
            <th className="text-left font-medium px-3 py-3">Type</th>
            <th className="text-left font-medium px-3 py-3">Integration</th>
            <th className="text-left font-medium px-3 py-3">Credentials</th>
            <th className="text-right font-medium px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {LENDERS.map(l => (
            <tr key={l.name} className="border-t border-stone-100">
              <td className="px-6 py-3 text-stone-900">{l.name}</td>
              <td className="px-3 py-3"><Badge tone="stone">{l.type}</Badge></td>
              <td className="px-3 py-3">
                <Badge tone={l.integration === 'API' ? 'emerald' : 'amber'}>
                  {l.integration === 'API' ? 'LOS API' : 'Email'}
                </Badge>
              </td>
              <td className="px-3 py-3 text-xs font-mono text-stone-500">
                {l.integration === 'API' ? 'api_key_••••••••4f2a' : 'sme-leads@' + l.name.toLowerCase().replace(/\s+/g, '') + '.com'}
              </td>
              <td className="px-6 py-3 text-right">
                <button className="text-xs text-stone-500 hover:text-stone-900">Configure</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Fees & Commissions ---
const AdminFeesView = ({ settings, setSettings, addAudit }) => {
  const [form, setForm] = useState(settings);

  const save = () => {
    setSettings(form);
    addAudit('SETTINGS_UPDATED', `Fees & Commissions updated`);
    alert('Settings saved.');
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <h3 className="font-serif text-lg text-stone-900 mb-1">Default mandate terms</h3>
        <p className="text-xs text-stone-500 mb-5">These values pre-fill when generating a new mandate. Back office can override per lead.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Success fee (%)" type="number" step="0.25" value={form.defaultFeePercent}
            onChange={(e) => setForm({ ...form, defaultFeePercent: Number(e.target.value) })} />
          <Input label="Default fee cap (₹)" type="number" value={form.defaultFeeCap || ''}
            onChange={(e) => setForm({ ...form, defaultFeeCap: e.target.value ? Number(e.target.value) : null })}
            placeholder="Blank for no cap" hint={form.defaultFeeCap ? formatINR(form.defaultFeeCap) : 'No cap'} />
          <Input label="Default validity (days)" type="number" value={form.defaultValidity}
            onChange={(e) => setForm({ ...form, defaultValidity: Number(e.target.value) })} />
        </div>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <h3 className="font-serif text-lg text-stone-900 mb-1">Tax configuration</h3>
        <p className="text-xs text-stone-500 mb-5">GST applied on fee invoices.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="GST rate (%)" type="number" step="0.5" value={form.gstRate * 100}
            onChange={(e) => setForm({ ...form, gstRate: Number(e.target.value) / 100 })} />
        </div>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <h3 className="font-serif text-lg text-stone-900 mb-1">Associate commissions</h3>
        <p className="text-xs text-stone-500 mb-5">Default commission when onboarding new associates.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Default commission (%)" type="number" step="0.25" value={form.associateCommissionDefault}
            onChange={(e) => setForm({ ...form, associateCommissionDefault: Number(e.target.value) })} />
        </div>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <h3 className="font-serif text-lg text-stone-900 mb-1">Loan ticket size</h3>
        <p className="text-xs text-stone-500 mb-5">Minimum and maximum loan amounts accepted.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Minimum (₹)" type="number" value={form.minTicket}
            onChange={(e) => setForm({ ...form, minTicket: Number(e.target.value) })} hint={formatINR(form.minTicket)} />
          <Input label="Maximum (₹)" type="number" value={form.maxTicket}
            onChange={(e) => setForm({ ...form, maxTicket: Number(e.target.value) })} hint={formatINR(form.maxTicket)} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="amber" onClick={save}>Save settings</Button>
      </div>
    </div>
  );
};

// --- Organization Settings ---
const AdminOrgView = ({ settings, setSettings, addAudit }) => {
  const [form, setForm] = useState(settings);
  const save = () => {
    setSettings(form);
    addAudit('ORG_UPDATED', `Organization details updated`);
    alert('Organization settings saved.');
  };
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <h3 className="font-serif text-lg text-stone-900 mb-1">Organization profile</h3>
        <p className="text-xs text-stone-500 mb-5">Your firm's details as they appear on mandates, invoices, and reports.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Organization name" value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} />
          <Input label="Tagline" value={form.orgTagline} onChange={(e) => setForm({ ...form, orgTagline: e.target.value })} />
          <Input label="GSTIN" value={form.orgGSTIN} onChange={(e) => setForm({ ...form, orgGSTIN: e.target.value.toUpperCase() })} placeholder="e.g. 27AAACA1234E1Z5" />
          <Input label="PAN" value={form.orgPAN} onChange={(e) => setForm({ ...form, orgPAN: e.target.value.toUpperCase() })} />
        </div>
        <Textarea label="Registered address" className="mt-4" value={form.orgAddress} onChange={(e) => setForm({ ...form, orgAddress: e.target.value })} rows={3} />
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <h3 className="font-serif text-lg text-stone-900 mb-1">Document requirements</h3>
        <p className="text-xs text-stone-500 mb-3">Documents requested from every borrower. Edit the list below (one per line).</p>
        <textarea
          value={form.requiredDocs.join('\n')}
          onChange={(e) => setForm({ ...form, requiredDocs: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
          rows={10}
          className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:border-stone-900 outline-none font-mono"
        />
        <p className="text-xs text-stone-500 mt-2">{form.requiredDocs.length} documents</p>
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <h3 className="font-serif text-lg text-stone-900 mb-1">Loan types</h3>
        <p className="text-xs text-stone-500 mb-3">Products you offer. Edit the list below (one per line).</p>
        <textarea
          value={form.loanTypes.join('\n')}
          onChange={(e) => setForm({ ...form, loanTypes: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
          rows={8}
          className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:border-stone-900 outline-none font-mono"
        />
      </div>

      <div className="flex justify-end">
        <Button variant="amber" onClick={save}>Save settings</Button>
      </div>
    </div>
  );
};

// --- Audit Log ---
const AdminAuditView = ({ auditLog }) => {
  const [search, setSearch] = useState('');
  const filtered = (auditLog || []).filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.action.toLowerCase().includes(q) || (e.detail || '').toLowerCase().includes(q) || e.by.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-sm text-stone-600">{filtered.length} entries · last 500 tracked</div>
        <div className="relative w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search actions, users…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:border-stone-900 outline-none" />
        </div>
      </div>
      <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50 border-b border-stone-200">
              <th className="text-left font-medium px-6 py-3">When</th>
              <th className="text-left font-medium px-3 py-3">User</th>
              <th className="text-left font-medium px-3 py-3">Action</th>
              <th className="text-left font-medium px-6 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan="4" className="text-center py-12 text-sm text-stone-500">
                No audit entries{search ? ' match' : ' yet'}. Significant admin actions will be logged here.
              </td></tr>
            )}
            {filtered.map(e => (
              <tr key={e.id} className="border-t border-stone-100">
                <td className="px-6 py-3 text-xs text-stone-600 tabular-nums">{new Date(e.at).toLocaleString('en-IN')}</td>
                <td className="px-3 py-3 text-sm text-stone-900">{e.by}</td>
                <td className="px-3 py-3">
                  <Badge tone="stone">{e.action.replace(/_/g, ' ').toLowerCase()}</Badge>
                </td>
                <td className="px-6 py-3 text-xs text-stone-700">{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// ============================================================
// MANAGEMENT REPORTS
// ============================================================

const ManagementReports = ({ leads, users, settings, currentUser }) => {
  const [tab, setTab] = useState('summary');
  const [dateRange, setDateRange] = useState('mtd');

  // Date range bounds
  const now = new Date();
  const rangeStart = useMemo(() => {
    const d = new Date(now);
    if (dateRange === 'mtd') return new Date(d.getFullYear(), d.getMonth(), 1);
    if (dateRange === 'qtd') return new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1);
    if (dateRange === 'ytd') return new Date(d.getFullYear(), 0, 1);
    if (dateRange === '30d') return new Date(d.getTime() - 30 * 86400000);
    if (dateRange === '90d') return new Date(d.getTime() - 90 * 86400000);
    return new Date(0);
  // eslint-disable-next-line
  }, [dateRange]);

  const inRangeLeads = leads.filter(l => new Date(l.createdAt) >= rangeStart);
  const associates = users.filter(u => u.role === 'ASSOCIATE');

  const exportCSV = (filename, rows) => {
    if (!rows || rows.length === 0) { alert('Nothing to export.'); return; }
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(','), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { k: 'summary', label: 'Business Summary', icon: LayoutDashboard },
    { k: 'pipeline', label: 'Pipeline Health', icon: Activity },
    { k: 'associates', label: 'Associate Performance', icon: Handshake },
    { k: 'lenders', label: 'Lender Performance', icon: Landmark },
    { k: 'sources', label: 'Source Attribution', icon: PieChart },
    { k: 'revenue', label: 'Revenue & Commissions', icon: Wallet },
    { k: 'geography', label: 'Industry & Geography', icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Management Reports</h1>
          <p className="text-sm text-stone-600 mt-1">Insight for decision-making. All figures reflect the selected period.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
            className="text-sm px-3 py-2 bg-white border border-stone-300 rounded-md">
            <option value="mtd">Month to date</option>
            <option value="qtd">Quarter to date</option>
            <option value="ytd">Year to date</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <Button variant="secondary" onClick={() => window.print()}>
            <FileText size={14} /> Print
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-wrap bg-white rounded-lg p-1 ring-1 ring-stone-200">
        {tabs.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              tab === t.k ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:bg-stone-100'
            }`}>
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'summary' && <ReportSummary leads={inRangeLeads} allLeads={leads} settings={settings} exportCSV={exportCSV} />}
      {tab === 'pipeline' && <ReportPipelineHealth leads={leads} exportCSV={exportCSV} />}
      {tab === 'associates' && <ReportAssociatePerformance leads={inRangeLeads} allLeads={leads} associates={associates} exportCSV={exportCSV} />}
      {tab === 'lenders' && <ReportLenderPerformance leads={inRangeLeads} exportCSV={exportCSV} />}
      {tab === 'sources' && <ReportSourceAttribution leads={inRangeLeads} exportCSV={exportCSV} />}
      {tab === 'revenue' && <ReportRevenue leads={inRangeLeads} settings={settings} associates={associates} exportCSV={exportCSV} />}
      {tab === 'geography' && <ReportGeography leads={inRangeLeads} exportCSV={exportCSV} />}
    </div>
  );
};

// --- Report: Business Summary ---
const ReportSummary = ({ leads, allLeads, settings, exportCSV }) => {
  const totalLeads = leads.length;
  const qualified = leads.filter(l => ['QUALIFIED', 'MANDATE_PENDING', 'MANDATE_SIGNED', 'CONVERTED'].includes(l.prequalStage)).length;
  const sanctioned = leads.filter(l => l.status === 'SANCTIONED' || l.status === 'DISBURSED');
  const disbursed = leads.filter(l => l.status === 'DISBURSED');
  const disbursedAmt = disbursed.reduce((s, l) => s + Number(l.loanAmount || 0), 0);
  const pipelineAmt = leads.filter(l => !['DISBURSED', 'REJECTED'].includes(l.status)).reduce((s, l) => s + Number(l.loanAmount || 0), 0);
  const avgTicket = disbursed.length > 0 ? disbursedAmt / disbursed.length : 0;
  const feeEarned = disbursedAmt * (settings.defaultFeePercent / 100);
  const lead2Qual = totalLeads > 0 ? (qualified / totalLeads * 100) : 0;
  const qual2Sanc = qualified > 0 ? (sanctioned.length / qualified * 100) : 0;
  const sanc2Disb = sanctioned.length > 0 ? (disbursed.length / sanctioned.length * 100) : 0;
  const overallConversion = totalLeads > 0 ? (disbursed.length / totalLeads * 100) : 0;

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Leads received" value={totalLeads} sub={`${qualified} qualified`} icon={Inbox} accent="bg-sky-50 text-sky-700" />
        <Stat label="Sanctioned" value={sanctioned.length} sub={`${disbursed.length} disbursed`} icon={ThumbsUp} accent="bg-amber-50 text-amber-700" />
        <Stat label="Disbursed value" value={formatINR(disbursedAmt)} sub={`avg ${formatINR(avgTicket)}`} icon={TrendingUp} accent="bg-emerald-50 text-emerald-700" />
        <Stat label="Fee earned" value={formatINR(feeEarned)} sub={`@ ${settings.defaultFeePercent}% + GST`} icon={Wallet} accent="bg-stone-900 text-amber-400" />
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <h3 className="font-serif text-xl text-stone-900">Conversion funnel</h3>
        <div className="mt-6 space-y-4">
          <FunnelRow label="Leads received" value={totalLeads} pct={100} color="#7dd3fc" />
          <FunnelRow label="Qualified" value={qualified} pct={lead2Qual} color="#a5b4fc" sub={`${lead2Qual.toFixed(1)}% of leads`} />
          <FunnelRow label="Sanctioned" value={sanctioned.length} pct={totalLeads > 0 ? sanctioned.length / totalLeads * 100 : 0} color="#6ee7b7" sub={`${qual2Sanc.toFixed(1)}% of qualified`} />
          <FunnelRow label="Disbursed" value={disbursed.length} pct={overallConversion} color="#86efac" sub={`${sanc2Disb.toFixed(1)}% of sanctioned`} />
        </div>
        <div className="mt-5 pt-4 border-t border-stone-100 text-sm text-stone-600">
          Overall lead-to-disbursement conversion: <span className="text-stone-900 font-medium tabular-nums">{overallConversion.toFixed(1)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
          <h3 className="font-serif text-lg text-stone-900 mb-4">Active pipeline</h3>
          <div className="font-serif text-4xl text-stone-900 tabular-nums">{formatINR(pipelineAmt)}</div>
          <div className="text-sm text-stone-600 mt-1">{leads.filter(l => !['DISBURSED', 'REJECTED'].includes(l.status)).length} live deals</div>
        </div>
        <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
          <h3 className="font-serif text-lg text-stone-900 mb-4">Period highlights</h3>
          <ul className="space-y-2 text-sm text-stone-700">
            <li>• {leads.filter(l => l.source === 'ASSOCIATE').length} leads from associates</li>
            <li>• {leads.filter(l => l.source === 'DIGITAL_ADS').length} from digital ads</li>
            <li>• {leads.filter(l => l.mandate?.status === 'Signed').length} mandates signed</li>
            <li>• {leads.filter(l => l.status === 'REJECTED').length} leads rejected</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => exportCSV('business_summary.csv', [
          { metric: 'Leads received', value: totalLeads },
          { metric: 'Qualified', value: qualified },
          { metric: 'Sanctioned', value: sanctioned.length },
          { metric: 'Disbursed', value: disbursed.length },
          { metric: 'Disbursed amount', value: disbursedAmt },
          { metric: 'Avg ticket', value: Math.round(avgTicket) },
          { metric: 'Fee earned', value: Math.round(feeEarned) },
          { metric: 'Overall conversion %', value: overallConversion.toFixed(1) },
        ])}><Download size={12} /> Export CSV</Button>
      </div>
    </div>
  );
};

const FunnelRow = ({ label, value, pct, color, sub }) => (
  <div>
    <div className="flex items-center justify-between text-sm mb-1.5">
      <span className="text-stone-900">{label}</span>
      <span className="tabular-nums">
        <span className="text-stone-900 font-medium">{value}</span>
        <span className="text-stone-500 ml-2 text-xs">{pct.toFixed(1)}%</span>
        {sub && <span className="text-stone-400 ml-3 text-xs">{sub}</span>}
      </span>
    </div>
    <div className="h-6 bg-stone-100 rounded overflow-hidden">
      <div className="h-full rounded flex items-center justify-start pl-2 text-[11px] text-stone-900 font-medium transition-all" style={{ width: `${Math.max(pct, 3)}%`, backgroundColor: color }}>
        {pct > 15 && value}
      </div>
    </div>
  </div>
);

// --- Report: Pipeline Health ---
const ReportPipelineHealth = ({ leads, exportCSV }) => {
  const active = leads.filter(l => !['DISBURSED', 'REJECTED'].includes(l.status));
  const now = Date.now();
  const aged = active.map(l => ({
    ...l,
    ageDays: Math.floor((now - new Date(l.createdAt).getTime()) / 86400000),
    inactiveDays: Math.floor((now - new Date(l.updatedAt).getTime()) / 86400000),
  }));
  const ageBuckets = { '<7d': 0, '8-14d': 0, '15-30d': 0, '31-60d': 0, '>60d': 0 };
  aged.forEach(l => {
    if (l.ageDays <= 7) ageBuckets['<7d']++;
    else if (l.ageDays <= 14) ageBuckets['8-14d']++;
    else if (l.ageDays <= 30) ageBuckets['15-30d']++;
    else if (l.ageDays <= 60) ageBuckets['31-60d']++;
    else ageBuckets['>60d']++;
  });
  const stale = aged.filter(l => l.inactiveDays > 14);
  const maxCount = Math.max(...Object.values(ageBuckets), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Stat label="Active deals" value={active.length} sub="not disbursed or rejected" icon={Activity} />
        <Stat label="Stale (>14d inactive)" value={stale.length} sub="need immediate follow-up" icon={AlertTriangle} accent="bg-rose-50 text-rose-700" />
        <Stat label="Avg age" value={aged.length > 0 ? `${Math.round(aged.reduce((s, l) => s + l.ageDays, 0) / aged.length)}d` : '—'} sub="all active deals" icon={Clock} />
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <h3 className="font-serif text-lg text-stone-900 mb-4">Pipeline aging</h3>
        <div className="space-y-2.5">
          {Object.entries(ageBuckets).map(([bucket, count]) => (
            <div key={bucket} className="flex items-center gap-3">
              <div className="text-xs text-stone-700 w-20 shrink-0">{bucket}</div>
              <div className="flex-1 h-5 bg-stone-100 rounded overflow-hidden">
                <div className="h-full bg-stone-800 rounded flex items-center pl-2 text-[11px] text-stone-50"
                  style={{ width: `${(count / maxCount) * 100}%` }}>
                  {count > 0 && count}
                </div>
              </div>
              <div className="text-xs tabular-nums text-stone-500 w-10 text-right">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {stale.length > 0 && (
        <div className="bg-rose-50 rounded-lg ring-1 ring-rose-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-rose-200">
            <h3 className="font-serif text-lg text-stone-900">Stale leads ({stale.length})</h3>
            <p className="text-xs text-rose-700 mt-0.5">No activity for more than 14 days</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-rose-100/50">
                <th className="text-left font-medium px-6 py-2">Lead</th>
                <th className="text-left font-medium px-3 py-2">Status</th>
                <th className="text-right font-medium px-3 py-2">Age</th>
                <th className="text-right font-medium px-6 py-2">Inactive</th>
              </tr>
            </thead>
            <tbody>
              {stale.slice(0, 10).map(l => (
                <tr key={l.id} className="border-t border-rose-100">
                  <td className="px-6 py-2.5">
                    <div className="text-stone-900">{l.companyName}</div>
                    <div className="text-xs font-mono text-stone-500">{l.id}</div>
                  </td>
                  <td className="px-3 py-2.5"><StatusBadge status={l.status} /></td>
                  <td className="px-3 py-2.5 text-right text-xs tabular-nums">{l.ageDays}d</td>
                  <td className="px-6 py-2.5 text-right text-xs tabular-nums text-rose-700">{l.inactiveDays}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Report: Associate Performance ---
const ReportAssociatePerformance = ({ leads, allLeads, associates, exportCSV }) => {
  const rows = associates.map(a => {
    const aLeads = leads.filter(l => l.associateId === a.id);
    const disbursed = aLeads.filter(l => l.status === 'DISBURSED');
    const disbursedAmt = disbursed.reduce((s, l) => s + Number(l.loanAmount || 0), 0);
    const active = aLeads.filter(l => !['DISBURSED', 'REJECTED'].includes(l.status));
    const commission = disbursedAmt * (a.commission / 100);
    const conversion = aLeads.length > 0 ? (disbursed.length / aLeads.length * 100) : 0;
    const avgTicket = disbursed.length > 0 ? disbursedAmt / disbursed.length : 0;
    return {
      name: a.name, city: a.city, commissionRate: a.commission,
      totalLeads: aLeads.length, activeLeads: active.length,
      disbursedCount: disbursed.length, disbursedAmt,
      conversion, avgTicket, commission,
    };
  }).sort((a, b) => b.disbursedAmt - a.disbursedAmt);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50 border-b border-stone-200">
              <th className="text-left font-medium px-6 py-3">Associate</th>
              <th className="text-right font-medium px-3 py-3">Leads</th>
              <th className="text-right font-medium px-3 py-3">Active</th>
              <th className="text-right font-medium px-3 py-3">Disbursed</th>
              <th className="text-right font-medium px-3 py-3">Vol. disbursed</th>
              <th className="text-right font-medium px-3 py-3">Conv %</th>
              <th className="text-right font-medium px-3 py-3">Avg ticket</th>
              <th className="text-right font-medium px-6 py-3">Commission</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name} className="border-t border-stone-100">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-stone-400 text-xs w-4">{i + 1}.</span>
                    <div>
                      <div className="text-stone-900">{r.name}</div>
                      <div className="text-xs text-stone-500">{r.city} · {r.commissionRate}%</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{r.totalLeads}</td>
                <td className="px-3 py-3 text-right tabular-nums">{r.activeLeads}</td>
                <td className="px-3 py-3 text-right tabular-nums">{r.disbursedCount}</td>
                <td className="px-3 py-3 text-right tabular-nums">{formatINR(r.disbursedAmt)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{r.conversion.toFixed(1)}%</td>
                <td className="px-3 py-3 text-right tabular-nums">{r.avgTicket ? formatINR(r.avgTicket) : '—'}</td>
                <td className="px-6 py-3 text-right tabular-nums text-stone-900 font-medium">{formatINR(r.commission)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => exportCSV('associate_performance.csv', rows)}>
          <Download size={12} /> Export CSV
        </Button>
      </div>
    </div>
  );
};

// --- Report: Lender Performance ---
const ReportLenderPerformance = ({ leads, exportCSV }) => {
  const map = {};
  leads.forEach(l => {
    (l.lenders || []).forEach(le => {
      if (!map[le.name]) map[le.name] = { name: le.name, submissions: 0, approved: 0, declined: 0, disbursed: 0, amount: 0, tatDays: [] };
      map[le.name].submissions++;
      const s = (le.status || '').toLowerCase();
      if (s.includes('sanction')) map[le.name].approved++;
      if (s.includes('declined') || s.includes('reject')) map[le.name].declined++;
      if (s.includes('disbursed')) { map[le.name].disbursed++; map[le.name].amount += Number(l.loanAmount || 0); }
      if (le.sentAt) {
        const days = (Date.now() - new Date(le.sentAt).getTime()) / 86400000;
        if (days < 60) map[le.name].tatDays.push(Math.round(days));
      }
    });
  });
  const rows = Object.values(map).map(r => ({
    ...r,
    approvalRate: r.submissions > 0 ? (r.approved / r.submissions * 100) : 0,
    avgTat: r.tatDays.length > 0 ? Math.round(r.tatDays.reduce((s, d) => s + d, 0) / r.tatDays.length) : '—',
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50 border-b border-stone-200">
              <th className="text-left font-medium px-6 py-3">Lender</th>
              <th className="text-right font-medium px-3 py-3">Submissions</th>
              <th className="text-right font-medium px-3 py-3">Approved</th>
              <th className="text-right font-medium px-3 py-3">Declined</th>
              <th className="text-right font-medium px-3 py-3">Approval %</th>
              <th className="text-right font-medium px-3 py-3">Disbursed</th>
              <th className="text-right font-medium px-6 py-3">Volume</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8 text-sm text-stone-500">No lender submissions yet in this period.</td></tr>
            ) : rows.map(r => (
              <tr key={r.name} className="border-t border-stone-100">
                <td className="px-6 py-3 text-stone-900">{r.name}</td>
                <td className="px-3 py-3 text-right tabular-nums">{r.submissions}</td>
                <td className="px-3 py-3 text-right tabular-nums text-emerald-700">{r.approved}</td>
                <td className="px-3 py-3 text-right tabular-nums text-rose-700">{r.declined}</td>
                <td className="px-3 py-3 text-right tabular-nums">{r.approvalRate.toFixed(1)}%</td>
                <td className="px-3 py-3 text-right tabular-nums">{r.disbursed}</td>
                <td className="px-6 py-3 text-right tabular-nums">{r.amount ? formatINR(r.amount) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => exportCSV('lender_performance.csv', rows)}>
          <Download size={12} /> Export CSV
        </Button>
      </div>
    </div>
  );
};

// --- Report: Source Attribution ---
const ReportSourceAttribution = ({ leads, exportCSV }) => {
  const map = {};
  Object.keys(LEAD_SOURCES).forEach(k => { map[k] = { source: k, count: 0, qualified: 0, sanctioned: 0, disbursed: 0, amount: 0 }; });
  leads.forEach(l => {
    if (!map[l.source]) return;
    map[l.source].count++;
    if (['QUALIFIED', 'MANDATE_PENDING', 'MANDATE_SIGNED', 'CONVERTED'].includes(l.prequalStage)) map[l.source].qualified++;
    if (l.status === 'SANCTIONED' || l.status === 'DISBURSED') map[l.source].sanctioned++;
    if (l.status === 'DISBURSED') { map[l.source].disbursed++; map[l.source].amount += Number(l.loanAmount || 0); }
  });
  const rows = Object.values(map).filter(r => r.count > 0).sort((a, b) => b.amount - a.amount);
  const maxCount = Math.max(...rows.map(r => r.count), 1);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50 border-b border-stone-200">
              <th className="text-left font-medium px-6 py-3">Source</th>
              <th className="text-left font-medium px-3 py-3">Volume</th>
              <th className="text-right font-medium px-3 py-3">Leads</th>
              <th className="text-right font-medium px-3 py-3">Qualified</th>
              <th className="text-right font-medium px-3 py-3">Qual %</th>
              <th className="text-right font-medium px-3 py-3">Disbursed</th>
              <th className="text-right font-medium px-6 py-3">Disbursed amt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const qualPct = r.count > 0 ? (r.qualified / r.count * 100) : 0;
              return (
                <tr key={r.source} className="border-t border-stone-100">
                  <td className="px-6 py-3 text-stone-900">{LEAD_SOURCES[r.source].label}</td>
                  <td className="px-3 py-3 min-w-[120px]">
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-stone-800" style={{ width: `${(r.count / maxCount) * 100}%` }} />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{r.count}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{r.qualified}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{qualPct.toFixed(1)}%</td>
                  <td className="px-3 py-3 text-right tabular-nums">{r.disbursed}</td>
                  <td className="px-6 py-3 text-right tabular-nums">{r.amount ? formatINR(r.amount) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => exportCSV('source_attribution.csv', rows)}>
          <Download size={12} /> Export CSV
        </Button>
      </div>
    </div>
  );
};

// --- Report: Revenue & Commissions ---
const ReportRevenue = ({ leads, settings, associates, exportCSV }) => {
  const disbursed = leads.filter(l => l.status === 'DISBURSED');
  const sanctioned = leads.filter(l => l.status === 'SANCTIONED');
  const disbursedAmt = disbursed.reduce((s, l) => s + Number(l.loanAmount || 0), 0);
  const sanctionedAmt = sanctioned.reduce((s, l) => s + Number(l.loanAmount || 0), 0);

  const realizedFee = disbursed.reduce((s, l) => {
    const pct = l.mandate?.feePercent || settings.defaultFeePercent;
    const cap = l.mandate?.feeCap;
    let fee = Number(l.loanAmount) * (pct / 100);
    if (cap) fee = Math.min(fee, cap);
    return s + fee;
  }, 0);
  const recognizedFee = sanctioned.reduce((s, l) => {
    const pct = l.mandate?.feePercent || settings.defaultFeePercent;
    const cap = l.mandate?.feeCap;
    let fee = Number(l.loanAmount) * (pct / 100);
    if (cap) fee = Math.min(fee, cap);
    return s + fee;
  }, 0);
  const gst = realizedFee * settings.gstRate;
  const net = realizedFee;

  const commissionPayable = disbursed.reduce((s, l) => {
    if (!l.associateId) return s;
    const assoc = associates.find(a => a.id === l.associateId);
    if (!assoc) return s;
    return s + Number(l.loanAmount) * (assoc.commission / 100);
  }, 0);

  const byLead = disbursed.map(l => {
    const pct = l.mandate?.feePercent || settings.defaultFeePercent;
    const cap = l.mandate?.feeCap;
    let fee = Number(l.loanAmount) * (pct / 100);
    if (cap) fee = Math.min(fee, cap);
    return {
      id: l.id, company: l.companyName, loanAmount: l.loanAmount,
      feePercent: pct, fee: Math.round(fee), gst: Math.round(fee * settings.gstRate),
      total: Math.round(fee * (1 + settings.gstRate)),
      associate: l.associateId ? (associates.find(a => a.id === l.associateId)?.name || '—') : 'Direct',
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Realized fee (disbursed)" value={formatINR(realizedFee)} sub={`on ${formatINR(disbursedAmt)} loans`} icon={Wallet} accent="bg-emerald-50 text-emerald-700" />
        <Stat label="Recognized fee (sanctioned)" value={formatINR(recognizedFee)} sub="pending disbursal" icon={Clock} accent="bg-amber-50 text-amber-700" />
        <Stat label="GST liability" value={formatINR(gst)} sub={`@ ${(settings.gstRate * 100).toFixed(0)}%`} icon={Receipt} />
        <Stat label="Commission payable" value={formatINR(commissionPayable)} sub="to associates" icon={Handshake} accent="bg-stone-900 text-amber-400" />
      </div>

      <div className="bg-white rounded-lg ring-1 ring-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200">
          <h3 className="font-serif text-lg text-stone-900">Invoice register (disbursed deals)</h3>
          <p className="text-xs text-stone-500 mt-0.5">{byLead.length} invoices · {formatINR(realizedFee * (1 + settings.gstRate))} total including GST</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-stone-500 bg-stone-50">
              <th className="text-left font-medium px-6 py-2.5">Lead</th>
              <th className="text-right font-medium px-3 py-2.5">Loan</th>
              <th className="text-right font-medium px-3 py-2.5">Fee %</th>
              <th className="text-right font-medium px-3 py-2.5">Fee</th>
              <th className="text-right font-medium px-3 py-2.5">GST</th>
              <th className="text-right font-medium px-3 py-2.5">Total</th>
              <th className="text-left font-medium px-6 py-2.5">Associate</th>
            </tr>
          </thead>
          <tbody>
            {byLead.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8 text-sm text-stone-500">No disbursed deals in this period.</td></tr>
            ) : byLead.map(r => (
              <tr key={r.id} className="border-t border-stone-100">
                <td className="px-6 py-2.5">
                  <div className="text-stone-900">{r.company}</div>
                  <div className="text-xs font-mono text-stone-500">{r.id}</div>
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatINR(r.loanAmount)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{r.feePercent}%</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatINR(r.fee)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-stone-500">{formatINR(r.gst)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-stone-900 font-medium">{formatINR(r.total)}</td>
                <td className="px-6 py-2.5 text-xs text-stone-600">{r.associate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => exportCSV('revenue_commissions.csv', byLead)}>
          <Download size={12} /> Export CSV
        </Button>
      </div>
    </div>
  );
};

// --- Report: Geography & Industry ---
const ReportGeography = ({ leads, exportCSV }) => {
  const byState = {};
  const byIndustry = {};
  leads.forEach(l => {
    byState[l.state || 'Unknown'] = (byState[l.state || 'Unknown'] || 0) + 1;
    byIndustry[l.industry] = (byIndustry[l.industry] || 0) + 1;
  });
  const stateRows = Object.entries(byState).sort((a, b) => b[1] - a[1]);
  const industryRows = Object.entries(byIndustry).sort((a, b) => b[1] - a[1]);
  const maxState = stateRows.length > 0 ? stateRows[0][1] : 1;
  const maxIndustry = industryRows.length > 0 ? industryRows[0][1] : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <h3 className="font-serif text-lg text-stone-900 mb-4">By state</h3>
        <div className="space-y-2.5">
          {stateRows.map(([state, count]) => (
            <div key={state} className="flex items-center gap-3">
              <div className="text-sm text-stone-700 w-32 shrink-0 truncate">{state}</div>
              <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-800" style={{ width: `${(count / maxState) * 100}%` }} />
              </div>
              <div className="text-xs tabular-nums text-stone-600 w-8 text-right">{count}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg ring-1 ring-stone-200 p-6">
        <h3 className="font-serif text-lg text-stone-900 mb-4">By industry</h3>
        <div className="space-y-2.5">
          {industryRows.map(([ind, count]) => (
            <div key={ind} className="flex items-center gap-3">
              <div className="text-sm text-stone-700 w-32 shrink-0 truncate">{ind}</div>
              <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${(count / maxIndustry) * 100}%` }} />
              </div>
              <div className="text-xs tabular-nums text-stone-600 w-8 text-right">{count}</div>
            </div>
          ))}
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

  const [users, setUsers, usersLoaded] = useStorage('users_v2', SEED_USERS);
  const [leads, setLeads, leadsLoaded] = useStorage('leads_v5', SEED_LEADS);
  const [permissions, setPermissions, permLoaded] = useStorage('permissions_v1', DEFAULT_PERMISSIONS);
  const [settings, setSettings, settingsLoaded] = useStorage('settings_v1', DEFAULT_SETTINGS);
  const [auditLog, setAuditLog, auditLoaded] = useStorage('audit_v1', []);
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

  if (!usersLoaded || !leadsLoaded || !sessionLoaded || !permLoaded || !settingsLoaded || !auditLoaded) {
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
          {/* ADMIN & BACK OFFICE share most views */}
          {(role === 'BACKOFFICE' || role === 'ADMIN') && !activeLeadId && (
            <>
              {view === 'dashboard' && <BackOfficeDashboard leads={leads} associates={associates} setView={setView} openLead={openLead} />}
              {view === 'leads' && <LeadsList leads={leads} associates={associates} openLead={openLead} onNewLead={() => setNewLeadOpen(true)} role={role} />}
              {view === 'associates' && <AssociatesList users={users} setUsers={setUsers} leads={leads} />}
              {view === 'lenders' && <LendersList leads={leads} />}
              {view === 'reports' && <ManagementReports leads={leads} users={users} settings={settings} currentUser={currentUser} />}
              {view === 'admin' && role === 'ADMIN' && (
                <AdminModule
                  users={users} setUsers={setUsers}
                  permissions={permissions} setPermissions={setPermissions}
                  settings={settings} setSettings={setSettings}
                  auditLog={auditLog} setAuditLog={setAuditLog}
                  currentUser={currentUser}
                  leads={leads}
                />
              )}
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
              currentUser={currentUser}
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
