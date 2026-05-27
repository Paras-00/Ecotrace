import { useState, useEffect, Component } from 'react';
import confetti from 'canvas-confetti';
import { 
  Leaf, 
  MapPin, 
  Calculator, 
  BookOpen, 
  Award, 
  Phone, 
  Mail, 
  Upload, 
  CheckCircle, 
  ShieldAlert, 
  Info,
  Cpu, 
  Search,
  Sparkles,
  ArrowRight,
  Star,
  Trash2,
  Recycle,
  ChevronRight,
  Globe,
  Zap,
  Shield,
  Menu,
  X
} from 'lucide-react';

// ─── Helper: safely convert any value to a JS array ─────────────────────────
// MongoDB returns array fields as objects like {0: "a", 1: "b"} sometimes.
// This function ensures we always get a real JS array for .map() calls.
function toArray(val) {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object') return Object.values(val);
  return [];
}

// ─── Error Boundary Component ────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <ShieldAlert size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
          <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Something went wrong</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button className="btn-primary" onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Static Data ─────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost';

const FALLBACK_FACILITIES = [
  {
    id: "f1",
    name: "Delhi Recycling Hub",
    address: "Sector 20, Dwarka",
    city: "Delhi",
    state: "DL",
    zip: "110077",
    latitude: 28.5672,
    longitude: 77.0125,
    phone: "+91 11 2345 6789",
    email: "delhi@ecotrace.in",
    accepted_items: ["Smartphone", "Laptop", "Tablet", "Battery", "Charger"],
    rating: 4.9
  },
  {
    id: "f2",
    name: "Mumbai E‑Waste Center",
    address: "Andheri East",
    city: "Mumbai",
    state: "MH",
    zip: "400058",
    latitude: 19.0975,
    longitude: 72.8770,
    phone: "+91 22 3456 7890",
    email: "mumbai@ecotrace.in",
    accepted_items: ["Smartphone", "Laptop", "Tablet", "Desktop", "Monitor", "Printer"],
    rating: 4.8
  },
  {
    id: "f3",
    name: "Bengaluru GreenTech",
    address: "Electronic City",
    city: "Bengaluru",
    state: "KA",
    zip: "560100",
    latitude: 12.9716,
    longitude: 77.5946,
    phone: "+91 80 1234 5678",
    email: "bangalore@ecotrace.in",
    accepted_items: ["Smartphone", "Laptop", "Tablet", "Desktop", "Monitor", "Server", "Battery"],
    rating: 4.9
  },
  {
    id: "f4",
    name: "Chennai EcoRecycle",
    address: "Guindy",
    city: "Chennai",
    state: "TN",
    zip: "600032",
    latitude: 13.0827,
    longitude: 80.2707,
    phone: "+91 44 2345 6789",
    email: "chennai@ecotrace.in",
    accepted_items: ["Smartphone", "Laptop", "Tablet", "Battery", "Television", "Audio Gear"],
    rating: 4.7
  },
  {
    id: "f5",
    phone: '+1 (512) 555-0167',
    email: 'austin@lonestarerecycle.com',
    accepted_items: ['Smartphone', 'Laptop', 'Tablet', 'Desktop', 'Battery'],
    rating: 4.6
  }
];

const EDUCATIONAL_ITEMS = [
  {
    id: "e1",
    name: "Lithium-Ion Battery Packs",
    icon: "battery",
    component: "Power cells of mobile phones, tablets, and laptops.",
    toxins: ["Lithium", "Cobalt", "Nickel", "Fluorine compounds"],
    threatLevel: "High",
    impact: "High risk of chemical fires, soil leaking. Ingestion or exposure to heavy cobalt/nickel causes skin rashes, lung damage, and organ irritation.",
    tips: "Never puncture a battery or throw it in normal trash. Keep in a dry, cool container before taking to a certified facility."
  },
  {
    id: "e2",
    name: "CRT Tubes & Display Monitors",
    icon: "monitor",
    component: "Glass screens of older computers and televisions.",
    toxins: ["Lead (glass shielding)", "Mercury (backlight tubes)", "Arsenic"],
    threatLevel: "Critical",
    impact: "Contains up to 4kg of pure lead! Lead causes severe neurotoxicity, especially in children, leading to brain development issues, kidney damage, and anemia.",
    tips: "Ensure displays are handled with care to prevent shattering, which releases hazardous vapor and lead dust."
  },
  {
    id: "e3",
    name: "Motherboards & Circuit Boards",
    icon: "cpu",
    component: "Main logic boards in all computers, tablets, and phones.",
    toxins: ["Beryllium (contacts)", "Cadmium (resistors)", "Lead (solder)"],
    threatLevel: "High",
    impact: "Cadmium is highly carcinogenic, targeting the kidneys and causing bone softening (Itai-itai disease). Beryllium causes chronic lung disease (berylliosis).",
    tips: "Do not attempt to scrape components off boards. Keep intact to allow clean industrial precious metal extraction."
  },
  {
    id: "e4",
    name: "Plastics & Insulated Cables",
    icon: "cable",
    component: "Outer casings, power cords, and plastic adapter connectors.",
    toxins: ["Brominated Flame Retardants (BFRs)", "Phthalates (in PVC)"],
    threatLevel: "Medium",
    impact: "Burning plastics releases dioxins which are highly toxic carcinogens. Phthalates disrupt the human endocrine/hormonal system.",
    tips: "Never burn wires to extract copper! Modern recycling facilities shred and separate materials using water/air friction safely."
  }
];

const IMPACT_STATS = [
  { label: 'Devices Recycled', value: '12,480+', icon: Recycle, color: 'var(--accent-emerald)' },
  { label: 'Metals Recovered (kg)', value: '3,250', icon: Zap, color: 'var(--accent-cyan)' },
  { label: 'Partner Centers', value: '48', icon: Globe, color: 'var(--accent-violet)' },
  { label: 'CO₂ Prevented (tons)', value: '890', icon: Shield, color: 'var(--accent-gold)' },
];

// ─── Main App Component ─────────────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [credits, setCredits] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Database States
  const [facilities, setFacilities] = useState(FALLBACK_FACILITIES);
  const [isLoading, setIsLoading] = useState(false);
  
  // Locator Search States
  const [searchZip, setSearchZip] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(FALLBACK_FACILITIES[0]);
  
  // Calculator States
  const [calcCategory, setCalcCategory] = useState('Smartphone');
  const [calcBrand, setCalcBrand] = useState('Apple');
  const [calcModel, setCalcModel] = useState('');
  const [calcResult, setCalcResult] = useState(null);
  
  // Education Modal State
  const [eduModalItem, setEduModalItem] = useState(null);
  
  // Submission Portal States
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subBrand, setSubBrand] = useState('Apple');
  const [subModel, setSubModel] = useState('');
  const [subSerial, setSubSerial] = useState('SN-');
  const [subFacilityId, setSubFacilityId] = useState('');
  const [subNotes, setSubNotes] = useState('');
  const [subImage, setSubImage] = useState(null);
  const [subImagePreview, setSubImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successSubmission, setSuccessSubmission] = useState(null);

  // Authentication States
  const [currentUser, setCurrentUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState(null);
  const [userHistory, setUserHistory] = useState([]);

  // ─── Fetch User History Helper ───────────────────────────────────────────
  const fetchUserHistory = (email) => {
    fetch(`${API_BASE}/api/auth/history?email=${encodeURIComponent(email)}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setUserHistory(toArray(json.data));
          // Sum up points from database to keep frontend credits dynamic and synchronized!
          const dbCredits = toArray(json.data).reduce((acc, curr) => acc + (curr.credit_points || 0), 0);
          if (dbCredits > 0) {
            setCredits(dbCredits);
            localStorage.setItem('ecotrace_credits', dbCredits);
          }
        }
      })
      .catch(err => console.log('Error fetching history:', err));
  };

  // ─── Init & API Fetch ────────────────────────────────────────────────────
  useEffect(() => {
    // 1. Fetch user session
    const savedUser = localStorage.getItem('ecotrace_user');
    const savedToken = localStorage.getItem('ecotrace_token');
    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setUserToken(savedToken);
      setSubName(parsedUser.name);
      setSubEmail(parsedUser.email);
      fetchUserHistory(parsedUser.email);
    } else {
      const savedCredits = localStorage.getItem('ecotrace_credits');
      if (savedCredits) setCredits(parseInt(savedCredits, 10));
    }
    
    // Fetch facilities from backend
    fetch(`${API_BASE}/api/facilities`, { headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success' && json.data && json.data.length > 0) {
          // Normalize accepted_items to always be arrays
          const normalized = json.data.map(f => ({
            ...f,
            accepted_items: toArray(f.accepted_items)
          }));
          setFacilities(normalized);
          setSelectedFacility(normalized[0]);
          setSubFacilityId(normalized[0].id || normalized[0]._id);
        }
      })
      .catch(err => {
        console.log('Facilities API fallback used:', err);
        setSubFacilityId(FALLBACK_FACILITIES[0].id);
      });
  }, []);

  // ─── Authentication Handlers ─────────────────────────────────────────────
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: authEmail, password: authPassword })
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw err; });
        return res.json();
      })
      .then(json => {
        setIsLoading(false);
        if (json.status === 'success') {
          const user = json.data.user;
          const token = json.data.token;
          setCurrentUser(user);
          setUserToken(token);
          localStorage.setItem('ecotrace_user', JSON.stringify(user));
          localStorage.setItem('ecotrace_token', token);
          setSubName(user.name);
          setSubEmail(user.email);
          
          setAuthEmail('');
          setAuthPassword('');
          setAuthConfirmPassword('');
          setAuthName('');
          
          fetchUserHistory(user.email);
          navigateTo('home');
          
          try {
            confetti({
              particleCount: 120,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#06b6d4', '#10b981']
            });
          } catch(e) {}
        }
      })
      .catch(err => {
        setIsLoading(false);
        if (err && err.errors) {
          setAuthError(Object.values(err.errors).flat().join(' '));
        } else if (err && err.message) {
          setAuthError(err.message);
        } else {
          setAuthError('Invalid credentials. Please verify your email and password.');
        }
      });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setAuthError(null);
    
    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: authName,
        email: authEmail,
        password: authPassword,
        password_confirmation: authConfirmPassword
      })
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw err; });
        return res.json();
      })
      .then(json => {
        setIsLoading(false);
        if (json.status === 'success') {
          const user = json.data.user;
          const token = json.data.token;
          setCurrentUser(user);
          setUserToken(token);
          localStorage.setItem('ecotrace_user', JSON.stringify(user));
          localStorage.setItem('ecotrace_token', token);
          setSubName(user.name);
          setSubEmail(user.email);
          
          setAuthEmail('');
          setAuthPassword('');
          setAuthConfirmPassword('');
          setAuthName('');
          setUserHistory([]);
          navigateTo('home');
          
          try {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#10b981', '#06b6d4', '#8b5cf6']
            });
          } catch(e) {}
        }
      })
      .catch(err => {
        setIsLoading(false);
        if (err && err.errors) {
          setAuthError(Object.values(err.errors).flat().join(' '));
        } else if (err && err.message) {
          setAuthError(err.message);
        } else {
          setAuthError('Registration failed. Please make sure the form is correctly filled.');
        }
      });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserToken(null);
    localStorage.removeItem('ecotrace_user');
    localStorage.removeItem('ecotrace_token');
    setUserHistory([]);
    setSubName('');
    setSubEmail('');
    // Clear user-specific credits and load guest credits
    localStorage.setItem('ecotrace_credits', 0);
    setCredits(0);
    navigateTo('home');
  };

  // ─── Credits helper ──────────────────────────────────────────────────────
  const addCredits = (amount) => {
    const newCredits = credits + amount;
    setCredits(newCredits);
    localStorage.setItem('ecotrace_credits', newCredits);
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#fbbf24']
      });
    } catch (e) { /* confetti not critical */ }
  };

  // ─── Navigation helper ───────────────────────────────────────────────────
  const navigateTo = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setAuthError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Facility Finder ─────────────────────────────────────────────────────
  const handleFacilitySearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let url = `${API_BASE}/api/facilities?`;
    if (searchZip) url += `zip=${encodeURIComponent(searchZip)}&`;
    if (searchCity) url += `city=${encodeURIComponent(searchCity)}&`;

    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          if (json.data.length > 0) {
            const normalized = json.data.map(f => ({
              ...f,
              accepted_items: toArray(f.accepted_items)
            }));
            setFacilities(normalized);
            setSelectedFacility(normalized[0]);
          } else {
            setFacilities(FALLBACK_FACILITIES);
            setSelectedFacility(FALLBACK_FACILITIES[0]);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        // Local fallback filter
        const filtered = FALLBACK_FACILITIES.filter(f => {
          const matchZip = searchZip ? f.zip.includes(searchZip) : true;
          const matchCity = searchCity ? f.city.toLowerCase().includes(searchCity.toLowerCase()) : true;
          return matchZip && matchCity;
        });
        if (filtered.length > 0) {
          setFacilities(filtered);
          setSelectedFacility(filtered[0]);
        } else {
          setFacilities(FALLBACK_FACILITIES);
          setSelectedFacility(FALLBACK_FACILITIES[0]);
        }
      });
  };

  // ─── E-Waste Calculator ──────────────────────────────────────────────────
  const handleEvaluate = (e) => {
    e.preventDefault();
    if (!calcModel.trim()) return;

    setIsLoading(true);
    setCalcResult(null);

    fetch(`${API_BASE}/api/devices/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ brand: calcBrand, model_name: calcModel, category: calcCategory })
    })
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success' && json.data) {
          const d = json.data;
          setCalcResult({
            brand: d.brand,
            model_name: d.model_name,
            category: d.category,
            precious_metals: d.precious_metals || { gold: 0, silver: 0, copper: 0, palladium: 0 },
            credit_points: d.credit_points || 250,
            hazardous_components: toArray(d.hazardous_components)
          });
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        // Local fallback
        let metals = { gold: 0.025, silver: 0.25, copper: 12.0, palladium: 0.012 };
        let points = 250;
        let hazardous = ['Lead (in solder)', 'Lithium (in battery)'];
        if (calcCategory === 'Laptop') {
          metals = { gold: 0.15, silver: 1.0, copper: 100.0, palladium: 0.05 };
          points = 800;
          hazardous.push('Brominated Flame Retardants (BFRs)');
        } else if (calcCategory === 'Tablet') {
          metals = { gold: 0.08, silver: 0.5, copper: 40.0, palladium: 0.025 };
          points = 500;
        } else if (calcCategory === 'Desktop') {
          metals = { gold: 0.25, silver: 2.0, copper: 250.0, palladium: 0.10 };
          points = 1500;
          hazardous.push('Beryllium', 'Cadmium');
        }
        setCalcResult({
          brand: calcBrand,
          model_name: calcModel,
          category: calcCategory,
          precious_metals: metals,
          credit_points: points,
          hazardous_components: hazardous
        });
      });
  };

  // ─── Recycling Submission ────────────────────────────────────────────────
  const handleRecycleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!subName || !subEmail || !subModel || !subSerial || !subFacilityId) {
      setSubmitError('All fields marked as required are mandatory.');
      return;
    }

    const serialRegex = /^SN-[A-Z0-9]{8,12}$/i;
    if (!serialRegex.test(subSerial)) {
      setSubmitError('Serial number is invalid! Must start with "SN-" followed by 8 to 12 letters or numbers.');
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('user_name', subName);
    formData.append('user_email', subEmail);
    formData.append('device_brand', subBrand);
    formData.append('device_model', subModel);
    formData.append('serial_number', subSerial);
    formData.append('facility_id', subFacilityId);
    formData.append('notes', subNotes);
    if (subImage) formData.append('image', subImage);

    fetch(`${API_BASE}/api/recycle-requests`, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw err; });
        return res.json();
      })
      .then(json => {
        if (json.status === 'success') {
          setSuccessSubmission(json.data);
          addCredits(json.data.credit_points);
          resetSubmissionForm();
          if (currentUser) {
            fetchUserHistory(currentUser.email);
          }
        }
        setIsSubmitting(false);
      })
      .catch(err => {
        setIsSubmitting(false);
        if (err && err.errors) {
          setSubmitError(Object.values(err.errors).flat().join(' '));
        } else {
          // Offline fallback mock
          const mockPoints = calcResult && calcResult.model_name === subModel ? calcResult.credit_points : 350;
          const mockSuccess = {
            id: "req_" + Math.random().toString(36).substr(2, 9),
            user_name: subName,
            device_model: subModel,
            credit_points: mockPoints,
            status: 'pending'
          };
          setSuccessSubmission(mockSuccess);
          addCredits(mockPoints);
          resetSubmissionForm();
          
          if (currentUser) {
            setUserHistory([
              {
                id: mockSuccess.id,
                device_brand: subBrand,
                device_model: mockSuccess.device_model,
                serial_number: subSerial,
                credit_points: mockSuccess.credit_points,
                status: 'pending',
                notes: subNotes,
                created_at: new Date().toISOString()
              },
              ...userHistory
            ]);
          }
        }
      });
  };

  const resetSubmissionForm = () => {
    setSubModel('');
    setSubSerial('SN-');
    setSubNotes('');
    setSubImage(null);
    setSubImagePreview(null);
  };

  // ─── Image Upload ────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit!');
        return;
      }
      setSubImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setSubImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <ErrorBoundary>
      {/* ─── Navigation Bar ─────────────────────────────────────────────── */}
      <header className="header-glass">
        <div className="header-content">
          <a href="#" className="logo-container" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
            <Leaf className="logo-icon" size={28} />
            <span className="logo-text">EcoTrace</span>
          </a>

          {/* Mobile menu toggle */}
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`nav-links ${mobileMenuOpen ? 'nav-open' : ''}`}>
            {[
              { key: 'home', label: 'Dashboard' },
              { key: 'calculator', label: 'Calculator' },
              { key: 'locator', label: 'Facilities' },
              { key: 'education', label: 'Education' },
              { key: 'recycle', label: 'Recycle Now' },
            ].map(item => (
              <a
                key={item.key}
                href="#"
                className={`nav-link ${activeTab === item.key ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); navigateTo(item.key); if (item.key === 'recycle') setSuccessSubmission(null); }}
              >
                {item.label}
              </a>
            ))}
            
            {currentUser ? (
              <button 
                className="btn-primary" 
                style={{ 
                  padding: '0.4rem 1rem', 
                  fontSize: '0.85rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  color: '#ef4444',
                  cursor: 'pointer'
                }}
                onClick={handleLogout}
              >
                Sign Out
              </button>
            ) : (
              <button 
                className="btn-primary" 
                style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', cursor: 'pointer' }}
                onClick={() => navigateTo('auth')}
              >
                Sign In
              </button>
            )}

            <div className="credits-pill">
              <Award size={18} />
              <span>{credits} Credits</span>
            </div>
          </nav>
        </div>
      </header>

      {/* ─── Main Content ───────────────────────────────────────────────── */}
      <main className="app-container">

        {/* ═══ 1. HOME / DASHBOARD ═══════════════════════════════════════ */}
        {activeTab === 'home' && (
          <div className="page-enter">
            {/* Hero Section */}
            <div className="hero-grid">
              <div>
                <h1 className="hero-title text-gradient-emerald">
                  Recycle Your Electronics,<br />Earn Green Credits
                </h1>
                <p className="hero-description">
                  Every year, millions of tons of electronics end up in landfills. EcoTrace enables you to evaluate the precious metal contents in your old tech, safely dispose of devices through certified collection centers, and earn credits for protecting our environment.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button className="btn-primary" onClick={() => navigateTo('calculator')}>
                    Evaluate Tech <ArrowRight size={18} />
                  </button>
                  <button className="btn-secondary" onClick={() => navigateTo('locator')}>
                    Locate Centers
                  </button>
                </div>
              </div>
              <div className="hero-visual">
                <div className="glow-orb"></div>
                <div className="hero-icon-circle">
                  <Cpu size={100} className="hero-cpu-icon" />
                </div>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="grid-4" style={{ marginBottom: '3rem' }}>
              {IMPACT_STATS.map((stat, idx) => (
                <div key={idx} className="glass-card stat-card">
                  <stat.icon size={28} style={{ color: stat.color, marginBottom: '0.75rem' }} />
                  <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Feature Cards */}
            <div className="grid-3" style={{ marginBottom: '3rem' }}>
              <div className="glass-card glass-card-emerald feature-card" onClick={() => navigateTo('calculator')}>
                <Calculator style={{ color: 'var(--accent-emerald)', marginBottom: '1rem' }} size={32} />
                <h3 className="feature-card-title">E-Waste Calculator</h3>
                <p className="feature-card-desc">Calculate exact quantities of Gold, Silver, and Copper embedded in your electronics within seconds.</p>
                <span className="feature-card-link" style={{ color: 'var(--accent-emerald)' }}>
                  Open Calculator <ChevronRight size={16} />
                </span>
              </div>
              <div className="glass-card glass-card-cyan feature-card" onClick={() => navigateTo('locator')}>
                <MapPin style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }} size={32} />
                <h3 className="feature-card-title">Partner Center Locator</h3>
                <p className="feature-card-desc">Search by Zip Code or City to find certified partner centers that process harmful electronics safely.</p>
                <span className="feature-card-link" style={{ color: 'var(--accent-cyan)' }}>
                  Locate Facilities <ChevronRight size={16} />
                </span>
              </div>
              <div className="glass-card feature-card" style={{ borderLeft: '4px solid var(--accent-gold)' }} onClick={() => navigateTo('education')}>
                <BookOpen style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }} size={32} />
                <h3 className="feature-card-title">Toxin Education</h3>
                <p className="feature-card-desc">Learn about biological impacts of dangerous substances like Lead, Beryllium, and Mercury in electronics.</p>
                <span className="feature-card-link" style={{ color: 'var(--accent-gold)' }}>
                  Browse Toxin Guide <ChevronRight size={16} />
                </span>
              </div>
            </div>
            
            {/* ═══ Logged-in Personalized Dashboard ═══ */}
            {currentUser && (
              <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-bright)', marginBottom: '1.5rem', textAlign: 'left' }} className="text-gradient-cyan">
                  Your Personalized Eco-Hub
                </h2>
                
                <div className="profile-grid">
                  {/* Left Column: User Level Card */}
                  <div className="profile-card">
                    {/* SVG Linear Gradient for progress meter */}
                    <svg width="0" height="0" style={{ position: 'absolute' }}>
                      <defs>
                        <linearGradient id="creditsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--accent-emerald)" />
                          <stop offset="100%" stopColor="var(--accent-cyan)" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="profile-avatar-wrapper">
                      <div className="profile-avatar">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </div>

                    <h3 style={{ color: 'var(--text-bright)', fontSize: '1.4rem', fontWeight: 700 }}>{currentUser.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{currentUser.email}</p>
                    
                    {/* Dynamic Eco Badge */}
                    <div className="eco-level-badge">
                      {credits < 1000 ? 'Bronze Eco-Saver' : credits < 3000 ? 'Silver Champion' : 'Gold Master'}
                    </div>

                    {/* Circular Level Progress Indicator */}
                    {(() => {
                      const max = credits < 1000 ? 1000 : credits < 3000 ? 3000 : 5000;
                      const base = credits < 1000 ? 0 : credits < 3000 ? 1000 : 3000;
                      const diff = max - base;
                      const earned = credits - base;
                      const percent = Math.min(100, Math.max(0, (earned / diff) * 100));
                      const radius = 45;
                      const circumference = 2 * Math.PI * radius; // ~282.7
                      const offset = circumference - (percent / 100) * circumference;

                      return (
                        <div className="credits-gauge-container">
                          <svg width="120" height="120" className="credits-circle">
                            <circle cx="60" cy="60" r={radius} className="credits-circle-bg" />
                            <circle 
                              cx="60" 
                              cy="60" 
                              r={radius} 
                              className="credits-circle-progress" 
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                            />
                          </svg>
                          <div className="credits-gauge-text">
                            <span className="credits-gauge-val">{credits}</span>
                            <span className="credits-gauge-lbl">Total Pts</span>
                          </div>
                        </div>
                      );
                    })()}

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0 0.5rem', lineHeight: '1.4' }}>
                      {credits < 1000 
                        ? `Recycle ${1000 - credits} more points worth of e-waste to unlock Silver Champion level!`
                        : credits < 3000 
                          ? `Recycle ${3000 - credits} more points to achieve Gold Master level!`
                          : 'Congratulations! You have reached maximum level! You are an ultimate protector of our planet.'
                      }
                    </p>
                  </div>

                  {/* Right Column: Recycling History Table */}
                  <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ color: 'var(--text-bright)', fontSize: '1.3rem', fontWeight: 700 }}>Your Recycling Submissions</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Total recycled: <strong>{userHistory.length} device(s)</strong>
                      </span>
                    </div>

                    {userHistory.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Recycle size={50} style={{ color: 'rgba(255,255,255,0.05)', marginBottom: '1rem' }} />
                        <h4 style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1.1rem' }}>No Submissions Yet</h4>
                        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem', marginTop: '0.25rem', maxWidth: '360px' }}>
                          Start earning green credits! Click "Recycle Now" below to register and dispose of your old electronic devices.
                        </p>
                      </div>
                    ) : (
                      <div className="history-table-container">
                        <table className="history-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Device Model</th>
                              <th>Serial Number</th>
                              <th>Points</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userHistory.map((item, idx) => {
                              const dateStr = item.created_at 
                                ? new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'Recent';
                              return (
                                <tr key={item.id || idx}>
                                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{dateStr}</td>
                                  <td style={{ fontWeight: 600 }}>{item.device_brand} {item.device_model}</td>
                                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.serial_number}</td>
                                  <td style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>+{item.credit_points}</td>
                                  <td>
                                    <span className={`status-indicator ${item.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                                      {item.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CTA Banner */}
            <div className="glass-card cta-banner">
              <div>
                <h3 className="cta-title">Ready to dispose of an old device?</h3>
                <p style={{ color: 'var(--text-muted)' }}>Enter your device serial number, choose a facility, upload a photo, and earn up to 1500 points immediately.</p>
              </div>
              <button className="btn-primary" onClick={() => navigateTo('recycle')}>
                Recycle Now <Sparkles size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ═══ 2. E-WASTE CALCULATOR ═════════════════════════════════════ */}
        {activeTab === 'calculator' && (
          <div className="page-enter">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title text-gradient-emerald">Interactive E-Waste Calculator</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>Select your electronic device and discover the exact gold, silver, copper, and palladium quantities embedded in its motherboard, along with points value.</p>
            </div>

            <div className="grid-2" style={{ alignItems: 'start' }}>
              {/* Left: Evaluator Form */}
              <div className="glass-card glass-card-emerald">
                <h3 style={{ color: 'var(--text-bright)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>Select Device Details</h3>
                <form onSubmit={handleEvaluate}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={calcCategory} onChange={(e) => { 
                      setCalcCategory(e.target.value); 
                      setCalcBrand(e.target.value === 'Smartphone' || e.target.value === 'Tablet' ? 'Apple' : 'Dell');
                      setCalcResult(null);
                    }}>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Desktop">Desktop PC</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <select className="form-select" value={calcBrand} onChange={(e) => setCalcBrand(e.target.value)}>
                      {calcCategory === 'Smartphone' && (
                        <>
                          <option value="Apple">Apple</option>
                          <option value="Samsung">Samsung</option>
                          <option value="Google">Google</option>
                        </>
                      )}
                      {calcCategory === 'Laptop' && (
                        <>
                          <option value="Apple">Apple</option>
                          <option value="Dell">Dell</option>
                          <option value="HP">HP</option>
                          <option value="Lenovo">Lenovo</option>
                        </>
                      )}
                      {calcCategory === 'Tablet' && (
                        <>
                          <option value="Apple">Apple</option>
                          <option value="Samsung">Samsung</option>
                        </>
                      )}
                      {calcCategory === 'Desktop' && (
                        <>
                          <option value="Dell">Dell</option>
                          <option value="HP">HP</option>
                          <option value="Custom Built">Custom Built</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. iPhone 13, XPS 13, iPad Air" 
                      value={calcModel} 
                      onChange={(e) => setCalcModel(e.target.value)} 
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      Try: <strong>iPhone 13</strong>, <strong>MacBook Pro 14" (M2)</strong>, <strong>XPS 13</strong>, or <strong>iPad Air (5th Gen)</strong>
                    </small>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading || !calcModel.trim()}>
                    {isLoading ? 'Analyzing Material...' : 'Calculate Metal Recovery'}
                  </button>
                </form>
              </div>

              {/* Right: Results Display */}
              <div className="glass-card" style={{ minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {!calcResult ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <Cpu size={60} style={{ color: 'rgba(255,255,255,0.05)', marginBottom: '1.5rem' }} />
                    <h3 style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1.2rem' }}>Awaiting Evaluation</h3>
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Submit the form on the left to estimate precious metal extractions and points rewards.</p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'left' }}>
                    {/* Device header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                      <div>
                        <h4 style={{ color: 'var(--text-bright)', fontSize: '1.3rem', fontWeight: 700 }}>{calcResult.brand} {calcResult.model_name}</h4>
                        <span className="category-badge">{calcResult.category}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="points-display">
                          <Award size={24} /> {calcResult.credit_points}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Points Value</span>
                      </div>
                    </div>

                    <h5 className="result-section-label">Embedded Precious Metal Content</h5>
                    
                    {/* Metal Grid */}
                    <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                      {[
                        { symbol: 'Au', name: 'Pure Gold', value: calcResult.precious_metals?.gold, cls: 'metal-gold' },
                        { symbol: 'Ag', name: 'Pure Silver', value: calcResult.precious_metals?.silver, cls: 'metal-silver' },
                        { symbol: 'Cu', name: 'Copper Wiring', value: calcResult.precious_metals?.copper, cls: 'metal-copper' },
                        { symbol: 'Pd', name: 'Palladium', value: calcResult.precious_metals?.palladium, cls: 'metal-palladium' }
                      ].map((metal, i) => (
                        <div key={i} className="metal-chip">
                          <div className={`metal-icon ${metal.cls}`}>{metal.symbol}</div>
                          <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-bright)' }}>{metal.value ?? 0} g</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{metal.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Hazardous components */}
                    {toArray(calcResult.hazardous_components).length > 0 && (
                      <div className="hazard-box">
                        <h6 className="hazard-title">
                          <ShieldAlert size={16} /> Toxic substances contained:
                        </h6>
                        <ul className="hazard-list">
                          {toArray(calcResult.hazardous_components).map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => {
                      setSubBrand(calcResult.brand);
                      setSubModel(calcResult.model_name);
                      navigateTo('recycle');
                      setSuccessSubmission(null);
                    }}>
                      Process and Recycle This Device Now <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ 3. FACILITY LOCATOR ═══════════════════════════════════════ */}
        {activeTab === 'locator' && (
          <div className="page-enter">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title text-gradient-cyan">Certified Facility Locator</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>Find partner centers near you certified in safe disposal of electronics. Filter by zip code or city to find centers in your local area.</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleFacilitySearch} className="locator-search-bar">
              <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '2.75rem' }} 
                  placeholder="Filter by City name (e.g. New York, Austin, Seattle...)" 
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>
              <div style={{ width: '180px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Zip Code" 
                  value={searchZip}
                  onChange={(e) => setSearchZip(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search Centers'}
              </button>
            </form>

            <div className="grid-2" style={{ alignItems: 'start' }}>
              {/* Facility Card List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '650px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {facilities.map((fac, idx) => {
                  const facId = fac.id || fac._id || `fac-${idx}`;
                  const isSelected = selectedFacility && ((selectedFacility.id || selectedFacility._id) === facId);
                  const items = toArray(fac.accepted_items);
                  return (
                    <div 
                      key={facId} 
                      className={`glass-card facility-card ${isSelected ? 'glass-card-cyan' : ''}`}
                      style={{ textAlign: 'left', cursor: 'pointer', padding: '1.5rem' }}
                      onClick={() => setSelectedFacility(fac)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <h4 style={{ color: 'var(--text-bright)', fontSize: '1.15rem', fontWeight: 700 }}>{fac.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fac.address}, {fac.city}, {fac.state} {fac.zip}</span>
                        </div>
                        <div className="facility-rating">
                          <Star size={16} fill="currentColor" />
                          <span>{fac.rating}</span>
                        </div>
                      </div>

                      {items.length > 0 && (
                        <div className="facility-badge-list">
                          {items.map((item, idy) => (
                            <span key={idy} className="facility-badge">{item}</span>
                          ))}
                        </div>
                      )}

                      <div className="facility-contact-info">
                        <div className="facility-contact-item">
                          <Phone size={14} /> <span>{fac.phone}</span>
                        </div>
                        <div className="facility-contact-item">
                          <Mail size={14} /> <span>{fac.email}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Side: SVG Map */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-bright)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'left' }}>Interactive Partner Map</h3>
                
                <div className="map-visual-container">
                  {/* Grid Background */}
                  <svg className="map-svg-grid" width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Map Pins */}
                  <svg className="map-svg-points" viewBox="0 0 600 350" preserveAspectRatio="xMidYMid meet">
                    {facilities.map((fac, idx) => {
                      const lat = fac.latitude || 37;
                      const lng = fac.longitude || -95;
                      const x = ((lng + 125) / 55) * 450 + 75;
                      const y = (1 - (lat - 25) / 25) * 230 + 50;
                      const facId = fac.id || fac._id || `fac-${idx}`;
                      const selId = selectedFacility ? (selectedFacility.id || selectedFacility._id) : null;
                      const isSelected = facId === selId;
                      
                      return (
                        <g key={facId} className={`map-pin ${isSelected ? 'active' : ''}`} onClick={() => setSelectedFacility(fac)} style={{ cursor: 'pointer' }}>
                          {isSelected && (
                            <circle cx={x} cy={y} r="15" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5">
                              <animate attributeName="r" values="5;20;5" dur="3s" repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                            </circle>
                          )}
                          <circle cx={x} cy={y} r={isSelected ? "7" : "5"} fill={isSelected ? "var(--accent-cyan)" : "rgba(255,255,255,0.3)"} />
                          {isSelected && (
                            <text x={x} y={y - 14} fill="var(--accent-cyan)" fontSize="10" textAnchor="middle" fontWeight="600">{fac.city}</text>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Overlay Info Card */}
                  {selectedFacility && (
                    <div className="map-card-overlay">
                      <div style={{ textAlign: 'left' }}>
                        <h5 style={{ color: 'var(--text-bright)', fontSize: '0.95rem', fontWeight: 700 }}>{selectedFacility.name}</h5>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                          <MapPin size={12} /> {selectedFacility.city}, {selectedFacility.state}
                        </p>
                      </div>
                      <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => {
                        setSubFacilityId(selectedFacility.id || selectedFacility._id);
                        navigateTo('recycle');
                        setSuccessSubmission(null);
                      }}>
                        Select
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Info size={16} style={{ color: 'var(--accent-cyan)', float: 'left', marginRight: '0.75rem' }} />
                  <span>Clicking on facility cards or the glowing pins on our grid map targets that location in your submissions form. Verified locations are EPA compliant.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ 4. EDUCATIONAL HUB ════════════════════════════════════════ */}
        {activeTab === 'education' && (
          <div className="page-enter">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title text-gradient-cyan">Interactive Educational Hub</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>Electronic e-waste is loaded with heavy metals and chemicals that poison local ecosystems if dumped. Click any component below to read its toxin report and biological hazards.</p>
            </div>

            <div className="grid-2">
              {EDUCATIONAL_ITEMS.map((item) => (
                <div key={item.id} className="glass-card edu-card" onClick={() => setEduModalItem(item)} style={{ textAlign: 'left' }}>
                  <span className={`edu-badge ${item.threatLevel === 'Critical' ? 'edu-badge-critical' : item.threatLevel === 'High' ? 'edu-badge-high' : 'edu-badge-medium'}`}>
                    {item.threatLevel} Threat
                  </span>
                  <div className="edu-icon-wrap">
                    <Cpu size={28} />
                  </div>
                  <h3 style={{ color: 'var(--text-bright)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>{item.component}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {item.toxins.slice(0, 3).map((tox, i) => (
                      <span key={i} className="toxin-mini-badge">{tox}</span>
                    ))}
                    {item.toxins.length > 3 && <span className="toxin-mini-badge">+{item.toxins.length - 3} more</span>}
                  </div>

                  <span className="feature-card-link" style={{ color: 'var(--accent-cyan)' }}>
                    View Hazard Details <ArrowRight size={14} />
                  </span>
                </div>
              ))}
            </div>

            {/* Education Modal */}
            {eduModalItem && (
              <div className="modal-overlay" onClick={() => setEduModalItem(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3 style={{ color: 'var(--text-bright)', fontSize: '1.3rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Toxin Report: {eduModalItem.name}</h3>
                    <button className="modal-close" onClick={() => setEduModalItem(null)}>✕</button>
                  </div>
                  <div className="modal-body" style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <span className="substance-badge">Threat Priority: {eduModalItem.threatLevel}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Component Case Study</span>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 className="modal-section-title">Toxic Constituents</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {eduModalItem.toxins.map((tox, i) => (
                          <span key={i} className="toxin-badge">{tox}</span>
                        ))}
                      </div>
                    </div>

                    <div className="modal-impact-box">
                      <h4 className="modal-impact-title"><ShieldAlert size={16} /> Biological & Organ Toxicity Impact</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6 }}>{eduModalItem.impact}</p>
                    </div>

                    <div className="modal-tips-box">
                      <h4 style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>🛡️ Safe Handling & Prep Instructions</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6 }}>{eduModalItem.tips}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ 5. RECYCLING SUBMISSION PORTAL ═════════════════════════════ */}
        {activeTab === 'recycle' && (
          <div className="page-enter">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title text-gradient-emerald">E-Waste Submission Portal</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>Submit details of your old tech device to register it in our recycle queue. Bring the device to your selected collection center to verify the submission and claim your credits.</p>
            </div>

            {!currentUser ? (
              <div className="lock-overlay-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="lock-glowing-circle">
                  <ShieldAlert size={42} />
                </div>
                <h3 style={{ color: 'var(--text-bright)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>Secure Portal Access Required</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '440px', lineHeight: '1.6' }}>
                  Electronic waste collection, points accumulation, and email notifications require a verified EcoTrace account.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button className="btn-primary" onClick={() => { navigateTo('auth'); setIsFlipped(false); }} style={{ cursor: 'pointer' }}>
                    Sign In Now
                  </button>
                  <button className="btn-secondary" onClick={() => { navigateTo('auth'); setIsFlipped(true); }} style={{ cursor: 'pointer' }}>
                    Create Account
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid-2" style={{ alignItems: 'start', maxWidth: '1100px', margin: '0 auto' }}>
              
              {/* Form / Success */}
              <div className="glass-card glass-card-emerald">
                {successSubmission ? (
                  <div className="success-screen">
                    <div className="success-icon-wrap">
                      <CheckCircle size={40} />
                    </div>
                    <h3 style={{ color: 'var(--text-bright)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Submission Successful!</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                      Your disposal request has been registered as <strong>{successSubmission.status}</strong> with ID: <code style={{ color: 'var(--accent-cyan)' }}>{successSubmission.id}</code>.
                    </p>
                    
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', display: 'inline-block' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>+{successSubmission.credit_points} Points</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Added to your wallet dashboard!</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button className="btn-primary" onClick={() => setSuccessSubmission(null)}>
                        Recycle Another
                      </button>
                      <button className="btn-secondary" onClick={() => navigateTo('home')}>
                        Back to Home
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRecycleSubmit}>
                    <h3 style={{ color: 'var(--text-bright)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>Register Old Electronics</h3>
                    
                    {submitError && (
                      <div className="error-banner">{submitError}</div>
                    )}

                    <div className="grid-2" style={{ gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input type="text" className="form-input" required value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="John Doe" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input type="email" className="form-input" required value={subEmail} onChange={(e) => setSubEmail(e.target.value)} placeholder="john@example.com" />
                      </div>
                    </div>

                    <div className="grid-2" style={{ gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Device Brand *</label>
                        <select className="form-select" value={subBrand} onChange={(e) => setSubBrand(e.target.value)}>
                          <option value="Apple">Apple</option>
                          <option value="Samsung">Samsung</option>
                          <option value="Dell">Dell</option>
                          <option value="HP">HP</option>
                          <option value="Google">Google</option>
                          <option value="Lenovo">Lenovo</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Device Model *</label>
                        <input type="text" className="form-input" required value={subModel} onChange={(e) => setSubModel(e.target.value)} placeholder="e.g. iPhone 13, XPS 13" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Device Serial Number *</label>
                      <input type="text" className="form-input" required value={subSerial} onChange={(e) => setSubSerial(e.target.value)} />
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                        Must match prefix format: <code>SN-XXXXXXXX</code> (8 to 12 letters/numbers, e.g., <strong>SN-ABC123XYZ7</strong>)
                      </small>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Recycling Collection Center *</label>
                      <select className="form-select" value={subFacilityId} onChange={(e) => setSubFacilityId(e.target.value)}>
                        {facilities.map((fac, idx) => (
                          <option key={fac.id || fac._id || idx} value={fac.id || fac._id}>
                            {fac.name} ({fac.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Condition & Notes</label>
                      <textarea className="form-textarea" placeholder="e.g., Cracked screen but boots up, missing charger cable..." value={subNotes} onChange={(e) => setSubNotes(e.target.value)} />
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                      <label className="form-label">Upload Device Image (Max 2MB)</label>
                      <input type="file" id="image-upload" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                      <label htmlFor="image-upload">
                        <div className={`upload-zone ${subImagePreview ? 'drag-active' : ''}`}>
                          {subImagePreview ? (
                            <img src={subImagePreview} alt="Device Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
                          ) : (
                            <>
                              <Upload size={32} style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }} />
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-bright)' }}>Click to browse and upload image</p>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accepts JPEG, PNG, WEBP</span>
                            </>
                          )}
                        </div>
                      </label>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                      {isSubmitting ? 'Registering Submission...' : 'Register Recycling Submission'}
                    </button>
                  </form>
                )}
              </div>

              {/* Info Side Card */}
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
                <h4 style={{ color: 'var(--text-bright)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} style={{ color: 'var(--accent-emerald)' }} />
                  DISPOSAL INSTRUCTIONS
                </h4>
                
                <div className="steps-list">
                  {[
                    { step: 'Step 1: Save Submission', desc: 'Submit this form to register your device in the centralized ecotrace database queue.' },
                    { step: 'Step 2: Backup & Reset', desc: 'Please back up your personal files and perform a factory system reset to erase personal data.' },
                    { step: 'Step 3: Drop-Off', desc: 'Deliver your device to the selected collection center. Show them the registered serial number to verify the recycling.' },
                    { step: 'Step 4: Credits Verification', desc: 'Once the center accepts the device, your pending status becomes verified, and your credits can be redeemed at partners.' },
                  ].map((item, idx) => (
                    <div key={idx} className="step-item">
                      <div className="step-number">{idx + 1}</div>
                      <div>
                        <strong style={{ color: 'var(--text-bright)', display: 'block', marginBottom: '0.25rem' }}>{item.step}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="points-table-box">
                  <h5 style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Info size={16} /> Points Allocation Table
                  </h5>
                  <table className="points-table">
                    <tbody>
                      {[
                        ['Smartphone', '250 - 450 pts'],
                        ['Tablet', '500 - 600 pts'],
                        ['Laptop', '800 - 1200 pts'],
                        ['Desktop PC', '1500 pts'],
                      ].map(([device, pts], i) => (
                        <tr key={i}>
                          <td>{device}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>{pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )}
          </div>
        )}

        {/* ═══ 6. AUTHENTICATION (LOGIN & REGISTER) ═════════════════════ */}
        {activeTab === 'auth' && (
          <div className="page-enter">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 className="section-title text-gradient-emerald">Join the Eco-Disposal Movement</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>Create an account to track your recycling history, check active disposal requests, and monitor your global eco level.</p>
            </div>

            <div className="auth-container">
              <div className={`auth-flip-card ${isFlipped ? 'flipped' : ''}`}>
                
                {/* ─── Card Front: LOGIN ─── */}
                <div className="auth-card-front">
                  <h3 style={{ color: 'var(--text-bright)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'left' }}>Welcome Back</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem', textAlign: 'left' }}>Sign in to continue your recycling contributions.</p>
                  
                  {authError && !isFlipped && (
                    <div className="error-banner" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>{authError}</div>
                  )}

                  <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, textAlign: 'left' }}>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        required 
                        placeholder="you@example.com" 
                        value={authEmail} 
                        onChange={(e) => setAuthEmail(e.target.value)} 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Password</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        required 
                        placeholder="••••••••" 
                        value={authPassword} 
                        onChange={(e) => setAuthPassword(e.target.value)} 
                      />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 'auto', cursor: 'pointer' }} disabled={isLoading}>
                      {isLoading ? 'Signing In...' : 'Sign In Now'}
                    </button>
                  </form>

                  <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Don't have an eco-account?{' '}
                    <span className="toggle-auth-link" onClick={() => { setIsFlipped(true); setAuthError(null); }}>
                      Register here
                    </span>
                  </div>
                </div>

                {/* ─── Card Back: REGISTER ─── */}
                <div className="auth-card-back">
                  <h3 style={{ color: 'var(--text-bright)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'left' }}>Create Eco-Account</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}>Start your electronic recycling journey today.</p>
                  
                  {authError && isFlipped && (
                    <div className="error-banner" style={{ marginBottom: '1rem', textAlign: 'left' }}>{authError}</div>
                  )}

                  <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, textAlign: 'left' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        required 
                        placeholder="John Doe" 
                        value={authName} 
                        onChange={(e) => setAuthName(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        required 
                        placeholder="you@example.com" 
                        value={authEmail} 
                        onChange={(e) => setAuthEmail(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password (Min. 6 chars)</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        required 
                        placeholder="••••••••" 
                        value={authPassword} 
                        onChange={(e) => setAuthPassword(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        required 
                        placeholder="••••••••" 
                        value={authConfirmPassword} 
                        onChange={(e) => setAuthConfirmPassword(e.target.value)} 
                      />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 'auto', cursor: 'pointer' }} disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Register and Join'}
                    </button>
                  </form>

                  <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <span className="toggle-auth-link" onClick={() => { setIsFlipped(false); setAuthError(null); }}>
                      Sign in here
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Leaf size={20} style={{ color: 'var(--accent-emerald)' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-bright)' }}>EcoTrace</span>
          </div>
          <p>© 2026 EcoTrace. Powered by Laravel, MongoDB, and React. Preserving resources for future generations.</p>
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('calculator'); }}>Calculator</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('locator'); }}>Facilities</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('education'); }}>Education</a>
          </div>
        </div>
      </footer>
    </ErrorBoundary>
  );
}

export default App;
