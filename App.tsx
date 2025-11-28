import React, { useState, useEffect, useContext, createContext } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Home, 
  History, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Newspaper, 
  Briefcase, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X,
  UserCircle
} from 'lucide-react';
import { User, UserType, Message } from './types';
import { Button } from './components/Button';
import { Input, FileInput } from './components/Input';
import { generateBusinessAnswer } from './services/geminiService';

// --- Contexts ---

interface AuthContextType {
  user: User | null;
  login: (type: UserType, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

const useAuth = () => useContext(AuthContext);

// --- Components ---

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const NavLink = ({ to, icon: Icon, text }: { to: string, icon: any, text: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
          isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Icon size={20} />
        <span>{text}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
              த
            </div>
            <span className="text-xl font-bold text-primary hidden md:block">தமிழ் வணிகர் பேரவை</span>
            <span className="text-xl font-bold text-primary md:hidden">TVP</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" icon={Home} text="முகப்பு" />
            <NavLink to="/history-commerce" icon={History} text="வணிக வரலாறு" />
            <NavLink to="/connect" icon={Users} text="தொடர்பு" />
            <NavLink to="/qa" icon={MessageSquare} text="கேள்வி பதில்" />
            
            {user ? (
              <>
                 <NavLink to="/dashboard" icon={Briefcase} text="முகப்பு பலகை" />
                 <div className="flex items-center gap-4 ml-4 border-l pl-4">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-gray-800">{user.name}</span>
                      <span className="text-xs font-semibold text-gray-500">
                        {user.type === UserType.UNREGISTERED ? 'தனிநபர்' :
                         user.type === UserType.REGISTERED ? 'உறுப்பினர்' : 'உதவியாளர்'}
                      </span>
                    </div>
                    <Button variant="ghost" onClick={logout} className="!px-2 text-red-600">
                      <LogOut size={20} />
                    </Button>
                 </div>
              </>
            ) : (
              <Link to="/login">
                <Button variant="primary" className="ml-2">நுழைவு / பதிவு</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-2 shadow-xl absolute w-full">
            <NavLink to="/" icon={Home} text="முகப்பு" />
            <NavLink to="/history-commerce" icon={History} text="வணிக வரலாறு" />
            <NavLink to="/history-tamil" icon={BookOpen} text="தமிழ் வரலாறு" />
            <NavLink to="/connect" icon={Users} text="தொடர்பு" />
            <NavLink to="/qa" icon={MessageSquare} text="கேள்வி பதில்" />
            <NavLink to="/news" icon={Newspaper} text="செய்திகள்" />
            
            {user ? (
               <>
                <NavLink to="/dashboard" icon={Briefcase} text="முகப்பு பலகை" />
                <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-red-600 font-bold">
                  <LogOut size={20} /> வெளியேறு
                </button>
               </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="mt-2">
                <Button className="w-full">நுழைவு / பதிவு</Button>
              </Link>
            )}
        </div>
      )}
    </nav>
  );
};

// --- Pages ---

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-red-900 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">தமிழ் வணிகர் பேரவை</h1>
          <p className="text-xl md:text-2xl font-semibold opacity-90 mb-8 max-w-3xl mx-auto">
            தமிழர் வணிகம் தழைத்தோங்க, உலகமெங்கும் எம் புகழ் பரவ, ஒன்றிணைவோம்.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login">
              <Button variant="secondary" className="text-lg px-8 py-3">இப்போதே இணையுங்கள்</Button>
            </Link>
            <Link to="/history-commerce">
              <Button variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary">
                வரலாறு அறிவோம்
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">எங்கள் சேவைகள்</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-primary">
            <Users size={40} className="text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">வணிகத் தொடர்பு</h3>
            <p className="text-gray-600 font-medium">உலகளாவிய தமிழ் வணிகர்களுடன் தொடர்பு கொள்ள சிறந்த தளம்.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-secondary">
            <Briefcase size={40} className="text-secondary mb-4" />
            <h3 className="text-xl font-bold mb-2">தொழில் வழிகாட்டுதல்</h3>
            <p className="text-gray-600 font-medium">புதிய தொழில்முனைவோருக்கான பயிற்சிகள் மற்றும் ஆலோசனைகள்.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-accent">
            <MessageSquare size={40} className="text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">செயற்கை நுண்ணறிவு உதவி</h3>
            <p className="text-gray-600 font-medium">உங்கள் சந்தேகங்களுக்கு உடனடி பதில் அளிக்கும் AI உதவியாளர்.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<'type1' | 'type2' | 'type3'>('type1');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let type = UserType.UNREGISTERED;
    if (activeTab === 'type2') type = UserType.REGISTERED;
    if (activeTab === 'type3') type = UserType.ASSISTANT;

    // Simulate login
    if (username) {
      login(type, username);
      navigate('/dashboard');
    }
  };

  const tabs = [
    { id: 'type1', label: 'பதிவு செய்யாதவர்', desc: 'தனிநபர் / Start-up' },
    { id: 'type2', label: 'பதிவு பெற்றவர்', desc: 'நிறுவன உறுப்பினர்' },
    { id: 'type3', label: 'உதவியாளர்', desc: 'Business Assistant' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Visual */}
        <div className="md:w-5/12 bg-primary p-8 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">வணக்கம்!</h2>
                <p className="text-lg font-medium opacity-90 mb-6">
                    தமிழ் வணிகர் பேரவையில் இணைய உங்கள் கணக்கில் நுழையவும்.
                </p>
                <div className="space-y-2 text-sm font-light">
                    <p>• வர்த்தக செய்திகள்</p>
                    <p>• தொழில் பட்டறைகள்</p>
                    <p>• வணிக தொடர்புகள்</p>
                </div>
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-7/12 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">உறுப்பினர் நுழைவு</h2>
            
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-8 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-2 px-2 text-sm rounded-md transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-white text-primary font-bold shadow-sm' 
                            : 'text-gray-500 font-semibold hover:text-gray-700'
                        }`}
                    >
                        <span className="block">{tab.label}</span>
                        <span className="text-xs opacity-75">{tab.desc}</span>
                    </button>
                ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                    <p className="text-sm text-blue-800 font-medium">
                        {activeTab === 'type1' && "பொது உறுப்பினர், பதிவு செய்யாத ஸ்டார்ட்-அப், உள்ளூர் பங்கேற்பாளர் ஆகியோருக்கான நுழைவு."}
                        {activeTab === 'type2' && "பதிவு செய்யப்பட்ட பொது உறுப்பினர், அசோசியேட் உறுப்பினர் மற்றும் நிறுவனங்களுக்கான நுழைவு."}
                        {activeTab === 'type3' && "உள்நாட்டு மற்றும் வெளிநாட்டு வணிக உதவியாளர்களுக்கான பிரத்யேக நுழைவு."}
                    </p>
                </div>

                <Input 
                  label="பயனர்பெயர் / மின்னஞ்சல்" 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="உங்கள் பெயரை உள்ளிடவும்"
                  required
                />
                <Input 
                  label="கடவுச்சொல்" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                
                <Button type="submit" className="w-full py-3 text-lg">
                    உள்ளே நுழைய
                </Button>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 font-medium">
                        புதியவரா? {' '}
                        <Link to={`/register?type=${activeTab}`} className="text-primary font-bold hover:underline">
                            இங்கு பதிவு செய்யவும்
                        </Link>
                    </p>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type') || 'type1';
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("பதிவு கோரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது! நிர்வாகி ஒப்புதலுக்குப் பிறகு மின்னஞ்சல் அனுப்பப்படும்.");
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
             <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8">
                <div className="border-b pb-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {type === 'type1' ? 'பதிவு செய்யாத தனிநபர் பதிவு' : 'நிறுவன / உதவியாளர் பதிவு'}
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">
                        கீழே உள்ள படிவத்தை பூர்த்தி செய்து உங்கள் அடையாள அட்டையை இணைக்கவும்.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input label="பெயர் (Name)" placeholder="உங்கள் முழு பெயர்" required />
                        <Input label="தொலைபேசி எண்" type="tel" placeholder="+91 XXXXX XXXXX" required />
                        <Input label="மின்னஞ்சல்" type="email" placeholder="example@email.com" required />
                        {type !== 'type1' && (
                            <Input label="நிறுவனத்தின் பெயர்" placeholder="Company Name" />
                        )}
                        <Input label="ஊர் / நகரம்" placeholder="Chennai" required />
                        {type === 'type3' && (
                             <Input label="சிறப்புத் துறை" placeholder="Marketing, Accounting, etc." />
                        )}
                    </div>

                    <div className="mt-6">
                        <FileInput label="புகைப்படம் பதிவேற்றம் (Photo Upload)" required />
                    </div>

                    <div className="mt-6">
                        <FileInput label="ஆதார் / அடையாள அட்டை (ID Proof)" required />
                    </div>

                    <div className="mt-8 flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700 font-medium cursor-pointer">
                            நான் தமிழ் வணிகர் பேரவையின் விதிமுறைகள் மற்றும் நிபந்தனைகளை படித்து புரிந்து கொண்டேன். நான் அளித்துள்ள தகவல்கள் அனைத்தும் உண்மையானவை என்று உறுதி கூறுகிறேன். (I agree to the Terms and Conditions).
                        </label>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                         <Link to="/login">
                             <Button type="button" variant="ghost">ரத்து செய்</Button>
                         </Link>
                         <Button type="submit" disabled={!agreed}>பதிவு செய்</Button>
                    </div>
                </form>
             </div>
        </div>
    );
};

const ContentPageLayout = ({ title, children, icon: Icon }: any) => (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-8 border-b-2 border-primary pb-4">
            <Icon size={32} className="text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </div>
        {children}
    </div>
);

const HistoryCommercePage = () => (
    <ContentPageLayout title="தமிழ் வணிக வரலாறு" icon={History}>
        <div className="prose prose-lg max-w-none">
            <div className="bg-amber-50 p-6 rounded-xl border-l-4 border-amber-500 mb-8">
                <p className="text-xl font-semibold text-amber-900 leading-relaxed">
                    "திரைகடல் ஓடியும் திரவியம் தேடு" என்ற முதுமொழி தமிழர்களின் வணிகப் பாரம்பரியத்திற்கு சான்று. சங்க காலம் தொட்டே தமிழர்கள் ரோமானியர்கள், சீனர்கள் மற்றும் தென்கிழக்கு ஆசிய நாடுகளுடன் வணிகம் செய்து வந்துள்ளனர்.
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white shadow-md p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3 text-primary">சங்க கால வணிகம்</h3>
                    <p className="text-gray-600 font-medium leading-relaxed">
                        பூம்புகார், முசிறி, கொற்கை போன்ற துறைமுக நகரங்கள் உலகப் புகழ் பெற்றவை. மிளகு, முத்து, தந்தம், மற்றும் நறுமணப் பொருட்கள் இங்கிருந்து ஏற்றுமதி செய்யப்பட்டன.
                    </p>
                </div>
                <div className="bg-white shadow-md p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3 text-primary">வணிகச் சாத்துக்கள்</h3>
                    <p className="text-gray-600 font-medium leading-relaxed">
                        வணிகர்கள் கூட்டாக பயணம் செய்யும் முறை 'சாத்து' எனப்பட்டது. ஐநூற்றுவர், நானாதேசிகள் போன்ற வணிகக் குழுக்கள் கடல் கடந்து வணிகம் செய்தனர்.
                    </p>
                </div>
            </div>
            
            <img src="https://picsum.photos/800/400?grayscale" alt="Ancient Trade" className="w-full rounded-xl shadow-lg mb-8" />
        </div>
    </ContentPageLayout>
);

const ConnectPage = () => (
    <ContentPageLayout title="வணிகத் தொடர்பு (Connect)" icon={Users}>
        <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
                    <div className="h-32 bg-gray-200">
                        <img src={`https://picsum.photos/300/200?random=${i}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-bold">வணிகர் பெயர் {i}</h3>
                        <p className="text-sm text-primary font-semibold mb-2">ஜவுளி ஏற்றுமதி</p>
                        <p className="text-xs text-gray-500 mb-4">சென்னை, தமிழ்நாடு</p>
                        <Button variant="outline" className="w-full text-sm">தொடர்பு கொள்ள</Button>
                    </div>
                </div>
            ))}
        </div>
    </ContentPageLayout>
);

const QAPage = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'model', text: 'வணக்கம்! நான் உங்கள் தொழில் வணிக உதவியாளர். வணிகம், ஜிஎஸ்டி (GST), ஏற்றுமதி அல்லது உரிமங்கள் பற்றிய கேள்விகளைக் கேளுங்கள்.', timestamp: Date.now() }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const answer = await generateBusinessAnswer(input);
        
        const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: answer, timestamp: Date.now() };
        setMessages(prev => [...prev, botMsg]);
        setLoading(false);
    };

    return (
        <ContentPageLayout title="கேள்வி பதில் (AI Assistant)" icon={MessageSquare}>
            <div className="bg-white rounded-xl shadow-xl h-[600px] flex flex-col border border-gray-200">
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-xl shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                            }`}>
                                <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                             <div className="bg-white p-4 rounded-xl border border-gray-200 rounded-tl-none flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                             </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-white border-t">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="உங்கள் கேள்வியைத் தமிழில் கேட்கவும்..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button type="submit" isLoading={loading}>அனுப்பு</Button>
                    </form>
                </div>
            </div>
        </ContentPageLayout>
    );
};

// --- Member Protected Pages ---

const Dashboard = () => {
    const { user } = useAuth();
    
    return (
        <ContentPageLayout title={`வணக்கம், ${user?.name}`} icon={UserCircle}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link to="/ads" className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
                    <Newspaper size={32} className="mb-4 text-white opacity-80" />
                    <h3 className="text-xl font-bold mb-1">விளம்பரங்கள்</h3>
                    <p className="text-sm opacity-80">உங்கள் தயாரிப்புகளை விளம்பரப்படுத்த</p>
                </Link>
                <Link to="/products" className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
                    <ShoppingBag size={32} className="mb-4 text-white opacity-80" />
                    <h3 className="text-xl font-bold mb-1">பொருட்கள்</h3>
                    <p className="text-sm opacity-80">நிறுவனத்தின் தயாரிப்புகள்</p>
                </Link>
                <Link to="/workshops" className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
                    <Users size={32} className="mb-4 text-white opacity-80" />
                    <h3 className="text-xl font-bold mb-1">பயிற்சி வகுப்புகள்</h3>
                    <p className="text-sm opacity-80">Workshops & Tutorials</p>
                </Link>
                <Link to="/news" className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
                    <BookOpen size={32} className="mb-4 text-white opacity-80" />
                    <h3 className="text-xl font-bold mb-1">செய்திகள்</h3>
                    <p className="text-sm opacity-80">வணிக உலகம்</p>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-4">சமீபத்திய அறிவிப்புகள்</h2>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-blue-900 font-medium">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        அடுத்த வாராந்திர கூட்டம் திங்கள் அன்று நடைபெறும்.
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-green-900 font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        புதிய ஏற்றுமதி விதிமுறைகள் பற்றிய கருத்தரங்கு.
                    </li>
                </ul>
            </div>
        </ContentPageLayout>
    );
};

const AdsPage = () => (
    <ContentPageLayout title="விளம்பர மேலாண்மை" icon={Newspaper}>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">உங்கள் விளம்பரங்கள்</h3>
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 border-2 border-dashed">
                    <p className="mb-4">நீங்கள் இதுவரை எந்த விளம்பரமும் பதிவிடவில்லை.</p>
                    <Button>புதிய விளம்பரம் உருவாக்க</Button>
                </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
                <h3 className="text-lg font-bold mb-4 text-gray-800">பரிந்துரைகள்</h3>
                <ul className="space-y-4">
                    <li className="bg-white p-4 rounded shadow-sm">
                        <p className="font-bold text-sm text-primary">தீபாவளி சலுகை</p>
                        <p className="text-xs text-gray-600 mt-1">சிறப்பு சலுகைகளை இப்போது பதிவிடுங்கள்.</p>
                    </li>
                    <li className="bg-white p-4 rounded shadow-sm">
                        <p className="font-bold text-sm text-primary">B2B வாய்ப்புகள்</p>
                        <p className="text-xs text-gray-600 mt-1">மொத்த வியாபாரிகளுக்கான விளம்பரங்கள்.</p>
                    </li>
                </ul>
            </div>
        </div>
    </ContentPageLayout>
);

const ProductsPage = () => (
    <ContentPageLayout title="தயாரிப்புகள் & சேவைகள்" icon={ShoppingBag}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img src={`https://picsum.photos/400/300?random=${i+10}`} alt="Product" className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">கைத்தறி சேலைகள்</h3>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">₹ 2,500</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">தூய பருத்தி மற்றும் பட்டு இழைகளால் நெய்யப்பட்ட பாரம்பரிய சேலைகள்.</p>
                        <Button variant="outline" className="w-full text-sm">விவரம் பார்க்க</Button>
                    </div>
                </div>
            ))}
        </div>
    </ContentPageLayout>
);

const WorkshopsPage = () => (
    <ContentPageLayout title="பயிற்சி வகுப்புகள் & செய்திகள்" icon={BookOpen}>
         <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-bold mb-4 text-secondary">வரவிருக்கும் பயிற்சிகள்</h2>
                <div className="bg-white rounded-xl shadow-lg border-l-8 border-secondary overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-gray-200">
                        <img src="https://picsum.photos/400/300?business" alt="Workshop" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 md:w-2/3">
                        <h3 className="text-xl font-bold mb-2">டிஜிட்டல் மார்க்கெட்டிங் பயிலரங்கம்</h3>
                        <p className="text-gray-600 font-medium mb-4">உங்கள் தொழிலை இணையத்தில் வளர்ப்பது எப்படி? முழுமையான வழிகாட்டுதல்.</p>
                        <div className="flex gap-4 text-sm text-gray-500 font-semibold mb-6">
                            <span>📅 அக் 25, 2023</span>
                            <span>📍 சென்னை</span>
                            <span>💰 ₹ 500</span>
                        </div>
                        <Button>பதிவு செய்ய</Button>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4 text-primary">வணிகச் செய்திகள்</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">ஏற்றுமதி கொள்கையில் மாற்றம்</h4>
                        <p className="text-gray-600 text-sm">மத்திய அரசு ஜவுளித் துறைக்கான புதிய ஏற்றுமதி சலுகைகளை அறிவித்துள்ளது...</p>
                        <a href="#" className="text-primary text-sm font-bold mt-2 inline-block">மேலும் படிக்க</a>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                        <h4 className="font-bold text-lg mb-2">சிறுகுறு தொழில் கடன் முகாம்</h4>
                        <p className="text-gray-600 text-sm">வரும் ஞாயிறு அன்று கோயம்புத்தூரில் மாபெரும் கடன் மேளா...</p>
                        <a href="#" className="text-primary text-sm font-bold mt-2 inline-block">மேலும் படிக்க</a>
                    </div>
                </div>
            </section>
         </div>
    </ContentPageLayout>
);

// --- Main App Logic ---

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/history-commerce" element={<HistoryCommercePage />} />
                    <Route path="/connect" element={<ConnectPage />} />
                    <Route path="/qa" element={<QAPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/ads" element={<ProtectedRoute><AdsPage /></ProtectedRoute>} />
                    <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
                    <Route path="/workshops" element={<ProtectedRoute><WorkshopsPage /></ProtectedRoute>} />
                    <Route path="/news" element={<ProtectedRoute><WorkshopsPage /></ProtectedRoute>} /> {/* Reusing workshops page layout for news mix */}
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <footer className="bg-gray-900 text-white py-8 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-xl font-bold mb-2">தமிழ் வணிகர் பேரவை</h3>
                    <p className="text-gray-400 text-sm font-medium">© 2023 Tamil Vanigar Peravai. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  // Load user from local storage on mount (Simulation)
  useEffect(() => {
    const stored = localStorage.getItem('tvp_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (type: UserType, name: string) => {
    const newUser: User = { id: Date.now().toString(), name, type };
    setUser(newUser);
    localStorage.setItem('tvp_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tvp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthContext.Provider>
  );
}