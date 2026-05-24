import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { 
  Heart, Share2, ShieldCheck, Check, Calendar, Settings, Fuel, 
  Wind, MapPin, Phone, MessageSquare, ChevronDown, ChevronUp, Star, StarHalf, ArrowRight,
  Quote, Award, Truck, ThumbsUp, CheckCircle, TrendingUp
} from 'lucide-react';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for interactive components
  const [activeTab, setActiveTab] = useState('specs'); // specs, dimensions, interior, safety, exterior
  const [activeImage, setActiveImage] = useState(0);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [tenure, setTenure] = useState(36);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/cars/${id}`);
        if (response.data.success) {
          setCar(response.data.data);
          
          // Fetch similar cars (just a mock fetch from /cars)
          const simRes = await api.get('/cars?limit=4');
          if (simRes.data.success) {
            setSimilarCars(simRes.data.data.filter(c => c._id !== id).slice(0, 4));
          }
        } else {
          toast.error('لم يتم العثور على السيارة');
          navigate('/');
        }
      } catch (err) {
        toast.error('خطأ في تحميل تفاصيل السيارة');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!car) return null;

  // ---------------- MOCK DATA FOR NEW SPECS ----------------
  // We dynamically generate plausible technical data since our backend only has basic fields
  const mockImages = [
    car.imageUrl,
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    'https://images.unsplash.com/photo-1503376712344-c8c3603dcf3e?w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800'
  ];

  const specs = {
    engine: car.category === 'SUV' ? 'V8 BiTurbo' : (car.brand === 'Tesla' ? 'Dual Motor' : 'V6 3.0L'),
    hp: car.category === 'First Class' ? '585 حصان' : '320 حصان',
    torque: '850 نيوتن/متر',
    transmission: car.brand === 'Tesla' ? 'كهربائي مباشر' : '9 سرعات أوتوماتيك (9G-TRONIC)',
    drive: car.category === 'SUV' ? 'رباعي (AWD)' : 'خلفي (RWD)',
    fuel: car.brand === 'Tesla' ? 'كهرباء' : 'بنزين',
    consumption: car.brand === 'Tesla' ? '0 لتر/100 كم' : '11.5 لتر/100 كم',
    length: '4,873 مم',
    width: '1,984 مم',
    height: '1,969 مم',
    wheelbase: '2,890 مم',
    trunk: `${car.luggage * 120} لتر`,
    tank: car.brand === 'Tesla' ? '100 kWh' : '100 لتر',
    weight: '2,560 كجم'
  };

  const interior = ['مقاعد جلد نابا فاخر', 'شاشة وسطية 12.3 بوصة', 'نظام صوتي Burmester 15 سماعة', 'مكيف هواء ثلاثي المناطق', 'فتحة سقف بانوراما', 'تشغيل المحرك عن بعد'];
  const safety = ['9 وسائد هوائية', 'نظام الفرامل المانع للانغلاق ABS', 'توزيع إلكتروني للفرامل EBD', 'نظام الثبات الإلكتروني ESP', 'كاميرا محيطية 360 درجة', 'رادار ومثبت سرعة متكيف', 'مراقبة ضغط الإطارات'];
  const exterior = ['جنوط ألومنيوم مقاس 22 بوصة', 'مصابيح أمامية MULTIBEAM LED', 'إضاءة نهارية مستمرة', 'حساسات مطر وإضاءة'];

  // ---------------- CALCULATOR LOGIC ----------------
  const cashPrice = car.price;
  const downPaymentAmount = (cashPrice * downPaymentPct) / 100;
  const loanAmount = cashPrice - downPaymentAmount;
  
  // Mock interest rates based on tenure
  const calculateInstallment = (baseRate) => {
    const rateMultiplier = 1 + (baseRate * (tenure / 12));
    const totalWithInterest = loanAmount * rateMultiplier;
    return Math.round(totalWithInterest / tenure);
  };

  const formatEGP = (val) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(val);

  // SEO Schema
  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": car.name,
    "image": car.imageUrl,
    "description": car.description,
    "brand": { "@type": "Brand", "name": car.brand },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "EGP",
      "price": car.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": car.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "124"
    }
  };

  return (
    <div className="font-arabic max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32 space-y-12">
      
      {/* SEO Helmet */}
      <Helmet>
        <title>شراء {car.brand} {car.model} {car.year} - متجر ريفورا للسيارات</title>
        <meta name="description" content={`اشترِ الآن سيارة ${car.name} الفاخرة بأفضل سعر كاش أو تقسيط مريح يبدأ من ${formatEGP(calculateInstallment(0.12))} شهرياً.`} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* Breadcrumb & Navigation */}
      <nav className="flex items-center text-sm text-gray-400 space-x-2 space-x-reverse mb-6">
        <Link to="/" className="hover:text-brand-red transition-colors">الرئيسية</Link>
        <span>/</span>
        <span className="hover:text-brand-red transition-colors cursor-pointer">{car.category}</span>
        <span>/</span>
        <span className="text-white font-bold">{car.brand}</span>
      </nav>

      {/* TOP SECTION: Gallery & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* RIGHT (RTL) - GALLERY */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-charcoal border border-white/5 shadow-2xl group">
            <img src={mockImages[activeImage]} alt={car.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute top-4 right-4 bg-brand-red text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
              {car.condition || 'جديدة (كسر زيرو)'}
            </div>
            {/* 360 View Button Mock */}
            <button className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors font-bold">
              عرض 360° درجة
            </button>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {mockImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-brand-red scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
              </button>
            ))}
          </div>
        </div>

        {/* LEFT (RTL) - INFO & CTA */}
        <div className="lg:col-span-5 space-y-8 glass-card p-8 rounded-2xl border border-brand-charcoal relative">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">{car.brand} <span className="text-brand-red">{car.model}</span> {car.year}</h1>
              <div className="flex space-x-2 space-x-reverse">
                <button onClick={() => setIsWishlisted(!isWishlisted)} className={`p-2 rounded-full border transition-all ${isWishlisted ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
                <button className="p-2 rounded-full bg-black/40 border border-white/10 text-gray-400 hover:text-white transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 space-x-reverse text-sm">
              <div className="flex text-yellow-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <StarHalf size={16} fill="currentColor" />
              </div>
              <span className="text-white font-bold">4.8</span>
              <span className="text-brand-steel underline cursor-pointer">(124 تقييم)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 shadow-inner">
            <div className="text-brand-steel text-sm mb-1 font-semibold">السعر النقدي الإجمالي (شامل الضريبة)</div>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {formatEGP(car.price)}
            </div>
            <div className="mt-4 flex items-center text-xs text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-3 py-1.5 rounded-md w-fit font-bold">
              <ShieldCheck size={14} className="ml-1.5" />
              ضمان ممتد لمدة 3 سنوات أو 100,000 كم
            </div>
          </div>

          {/* Core Highlights */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg bg-black/20 border border-white/5">
              <Calendar className="text-brand-red" size={20} />
              <div>
                <div className="text-[10px] text-gray-500">سنة الصنع</div>
                <div className="font-bold text-white">{car.year}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg bg-black/20 border border-white/5">
              <Fuel className="text-brand-red" size={20} />
              <div>
                <div className="text-[10px] text-gray-500">نوع الوقود</div>
                <div className="font-bold text-white">{specs.fuel}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg bg-black/20 border border-white/5">
              <Settings className="text-brand-red" size={20} />
              <div>
                <div className="text-[10px] text-gray-500">ناقل الحركة</div>
                <div className="font-bold text-white text-xs truncate max-w-[100px]">{specs.transmission}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg bg-black/20 border border-white/5">
              <Wind className="text-brand-red" size={20} />
              <div>
                <div className="text-[10px] text-gray-500">قوة المحرك</div>
                <div className="font-bold text-white">{specs.hp}</div>
              </div>
            </div>
          </div>

          {/* Desktop Checkout CTA */}
          <div className="hidden lg:block space-y-3">
            <button 
              onClick={() => {
                addToCart(car, 1);
                navigate('/checkout'); // We will build checkout soon
              }}
              className="w-full btn-red py-4 text-lg font-black tracking-wide flex items-center justify-center space-x-2 space-x-reverse"
            >
              <span>أتمم الشراء الآن</span>
              <ArrowRight size={20} />
            </button>
            <button className="w-full btn-silver py-3 text-sm font-bold flex items-center justify-center">
              أضف إلى السلة
            </button>
          </div>

          {/* Quick Contact Line */}
          <div className="flex items-center justify-between border-t border-white/5 pt-6 text-sm">
            <span className="text-gray-400">تحتاج مساعدة في القرار؟</span>
            <div className="flex space-x-3 space-x-reverse">
              <button className="flex items-center text-green-500 hover:text-green-400 font-bold transition-colors">
                <MessageSquare size={16} className="ml-1.5" /> واتساب
              </button>
              <button className="flex items-center text-brand-red hover:text-brand-red/80 font-bold transition-colors">
                <Phone size={16} className="ml-1.5" /> اتصال مباشر
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1.5 TRUST STATISTICS BAR */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-8 border-y border-white/5 bg-black/20 rounded-2xl px-6 my-10">
        <div className="flex flex-col items-center justify-center text-center space-y-2 p-2">
          <TrendingUp className="text-brand-red w-8 h-8" />
          <span className="font-black text-white text-lg mt-1">10,000+</span>
          <span className="text-xs text-gray-400">Cars Sold</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-2 p-2">
          <ThumbsUp className="text-brand-emerald w-8 h-8" />
          <span className="font-black text-white text-lg mt-1">98%</span>
          <span className="text-xs text-gray-400">Happy Customers</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-2 p-2">
          <Star className="text-yellow-400 w-8 h-8" fill="currentColor" />
          <span className="font-black text-white text-lg mt-1">4.8 / 5</span>
          <span className="text-xs text-gray-400">Google Rating</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-2 p-2">
          <Award className="text-brand-red w-8 h-8" />
          <span className="font-black text-white text-lg mt-1">Up to 5 Years</span>
          <span className="text-xs text-gray-400">Warranty</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-2 p-2 md:col-span-1 col-span-2">
          <Truck className="text-blue-400 w-8 h-8" />
          <span className="font-black text-white text-lg mt-1">Free</span>
          <span className="text-xs text-gray-400">Delivery Nationwide</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. ADVANCED INSTALLMENT CALCULATOR (HIGHLIGHT FEATURE) */}
      {/* ========================================================= */}
      <section className="bg-brand-charcoal/30 border border-brand-red/20 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-[0_0_50px_rgba(230,0,0,0.05)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="mb-8 text-center sm:text-right">
          <h2 className="text-3xl font-black text-white mb-2">حاسبة التقسيط الذكية</h2>
          <p className="text-gray-400 text-sm">اكتشف خطة الدفع الأنسب لك مع شركائنا من البنوك وشركات التمويل.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-8">
            {/* Downpayment Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-white font-bold">الدفعة المقدمة (المقدم)</label>
                <div className="text-brand-red font-black text-xl">{formatEGP(downPaymentAmount)}</div>
              </div>
              <input 
                type="range" 
                min="10" 
                max="80" 
                step="5"
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-brand-red"
              />
              <div className="flex justify-between text-xs text-gray-500 font-bold">
                <span>10%</span>
                <span className="text-white bg-white/10 px-2 py-0.5 rounded">{downPaymentPct}%</span>
                <span>80%</span>
              </div>
            </div>

            {/* Tenure Selectors */}
            <div className="space-y-4">
              <label className="text-white font-bold block">مدة التقسيط (الأشهر)</label>
              <div className="flex flex-wrap gap-3">
                {[12, 24, 36, 48, 60].map(months => (
                  <button 
                    key={months}
                    onClick={() => setTenure(months)}
                    className={`flex-1 min-w-[70px] py-3 rounded-xl font-bold transition-all border ${tenure === months ? 'bg-brand-red text-white border-brand-red shadow-[0_4px_15px_rgba(230,0,0,0.3)]' : 'bg-black/40 text-gray-400 border-white/5 hover:border-white/20'}`}
                  >
                    {months}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start space-x-3 space-x-reverse text-blue-200 text-sm">
              <ShieldCheck size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <p>نحن نضمن لك الشفافية التامة. لا توجد رسوم خفية، والشروط والأحكام تخضع لموافقة جهة التمويل.</p>
            </div>
          </div>

          {/* Results / Providers */}
          <div className="space-y-4">
            <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">عروض التمويل المتاحة (تقريبي)</h3>
            
            {/* Provider 1: Ahli Bank */}
            <div className="glass-card-interactive p-4 rounded-xl flex items-center justify-between border-l-4 border-l-green-500">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1 border border-gray-200">
                  {/* Fake Ahli Logo */}
                  <div className="font-black text-green-700 text-[10px] text-center leading-tight">البنك<br/>الأهلي</div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">البنك الأهلي المصري</h4>
                  <div className="text-[10px] text-gray-400 mt-0.5">فائدة 14% متناقصة • أسرع موافقة</div>
                </div>
              </div>
              <div className="text-left">
                <div className="text-brand-emerald font-black text-lg">{formatEGP(calculateInstallment(0.14))}</div>
                <div className="text-[10px] text-gray-500">شهرياً</div>
              </div>
            </div>

            {/* Provider 2: valU */}
            <div className="glass-card-interactive p-4 rounded-xl flex items-center justify-between border-l-4 border-l-yellow-400">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center p-1 border border-yellow-400/30">
                  <div className="font-black text-yellow-400 text-xs">valU</div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">شركة فاليو (valU)</h4>
                  <div className="text-[10px] text-gray-400 mt-0.5">بدون مقدم للكاش • فائدة 18% ثابتة</div>
                </div>
              </div>
              <div className="text-left">
                <div className="text-yellow-400 font-black text-lg">{formatEGP(calculateInstallment(0.18))}</div>
                <div className="text-[10px] text-gray-500">شهرياً</div>
              </div>
            </div>

            {/* Provider 3: Contact */}
            <div className="glass-card-interactive p-4 rounded-xl flex items-center justify-between border-l-4 border-l-blue-500">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1 border border-gray-200">
                  <div className="font-black text-blue-700 text-xs">Contact</div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">كونتكت للتمويل</h4>
                  <div className="text-[10px] text-gray-400 mt-0.5">تأمين شامل هدية أول سنة • فائدة 16%</div>
                </div>
              </div>
              <div className="text-left">
                <div className="text-blue-400 font-black text-lg">{formatEGP(calculateInstallment(0.16))}</div>
                <div className="text-[10px] text-gray-500">شهرياً</div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. TECHNICAL SPECIFICATIONS TABS */}
      {/* ========================================================= */}
      <section className="pt-8">
        <h2 className="text-2xl font-black text-white mb-6">المواصفات والتفاصيل الفنية</h2>
        
        {/* Tab Headers */}
        <div className="flex overflow-x-auto border-b border-white/10 hide-scrollbar mb-8 gap-6">
          {[
            { id: 'specs', label: 'المواصفات الأساسية' },
            { id: 'dimensions', label: 'الأبعاد والوزن' },
            { id: 'interior', label: 'التجهيزات الداخلية' },
            { id: 'safety', label: 'أنظمة الأمان' },
            { id: 'exterior', label: 'التجهيزات الخارجية' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 whitespace-nowrap font-bold text-sm transition-all border-b-2 px-1 ${activeTab === tab.id ? 'text-brand-red border-brand-red' : 'text-gray-500 border-transparent hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="bg-black/30 border border-brand-charcoal rounded-2xl p-6 sm:p-8 min-h-[300px]">
          
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 animate-fade-in text-sm">
              <SpecRow label="سعة المحرك / النوع" value={specs.engine} />
              <SpecRow label="القوة الحصانية" value={specs.hp} />
              <SpecRow label="عزم الدوران" value={specs.torque} />
              <SpecRow label="ناقل الحركة" value={specs.transmission} />
              <SpecRow label="نوع الجر / الدفع" value={specs.drive} />
              <SpecRow label="نوع الوقود" value={specs.fuel} />
              <SpecRow label="معدل استهلاك الوقود" value={specs.consumption} />
            </div>
          )}

          {activeTab === 'dimensions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 animate-fade-in text-sm">
              <SpecRow label="الطول الكلي" value={specs.length} />
              <SpecRow label="العرض الكلي" value={specs.width} />
              <SpecRow label="الارتفاع الكلي" value={specs.height} />
              <SpecRow label="قاعدة العجلات" value={specs.wheelbase} />
              <SpecRow label="سعة الشنطة الخلفية" value={specs.trunk} />
              <SpecRow label="سعة خزان الوقود" value={specs.tank} />
              <SpecRow label="الوزن الفارغ" value={specs.weight} />
            </div>
          )}

          {activeTab === 'interior' && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              {interior.map((item, i) => <FeatureItem key={i} text={item} />)}
            </ul>
          )}

          {activeTab === 'safety' && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              {safety.map((item, i) => <FeatureItem key={i} text={item} />)}
            </ul>
          )}

          {activeTab === 'exterior' && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              {exterior.map((item, i) => <FeatureItem key={i} text={item} />)}
            </ul>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. CUSTOMER TESTIMONIALS & TRUST SECTION */}
      {/* ========================================================= */}
      <section className="pt-16" id="testimonials">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">What Our Customers Say</h2>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl font-black text-white">4.8</span>
            <div className="flex text-yellow-400">
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><StarHalf size={18} fill="currentColor" />
            </div>
          </div>
          <p className="text-gray-400 text-sm">Based on +2,500 verified reviews</p>
        </div>

        {/* Testimonials Carousel / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-xl">
            <Quote className="absolute top-4 right-4 w-24 h-24 text-gray-100 z-0 opacity-50 transform rotate-180" />
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">John D.</h4>
                    <span className="text-[10px] text-gray-500">Dubai, UAE • 1 week ago</span>
                  </div>
                </div>
                <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed min-h-[60px] font-medium">
                "One of the smoothest purchasing experiences I've ever had. The car matched the photos exactly, and delivery was right on schedule. Thank you!"
              </p>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs font-bold text-green-600">
                  <CheckCircle size={14} /> <span>Verified Purchase</span>
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{car.brand} {car.model}</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-xl">
            <Quote className="absolute top-4 right-4 w-24 h-24 text-gray-100 z-0 opacity-50 transform rotate-180" />
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img src="https://i.pravatar.cc/150?img=33" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Sarah M.</h4>
                    <span className="text-[10px] text-gray-500">Abu Dhabi, UAE • 3 weeks ago</span>
                  </div>
                </div>
                <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed min-h-[60px] font-medium">
                "I was nervous about financing, but the sales team completed all the paperwork in under 48 hours. My dream car is now in my garage."
              </p>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs font-bold text-green-600">
                  <CheckCircle size={14} /> <span>Verified Purchase</span>
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Financed {car.brand}</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-xl">
            <Quote className="absolute top-4 right-4 w-24 h-24 text-gray-100 z-0 opacity-50 transform rotate-180" />
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img src="https://i.pravatar.cc/150?img=47" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Omar S.</h4>
                    <span className="text-[10px] text-gray-500">Sharjah, UAE • 1 month ago</span>
                  </div>
                </div>
                <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed min-h-[60px] font-medium">
                "First time buying a car online — I was hesitant. But their transparency at every step earned my trust. I'll definitely buy my next car from them."
              </p>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs font-bold text-green-600">
                  <CheckCircle size={14} /> <span>Verified Purchase</span>
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{car.category} Zero</span>
              </div>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-xl hidden lg:block">
            <Quote className="absolute top-4 right-4 w-24 h-24 text-gray-100 z-0 opacity-50 transform rotate-180" />
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Yasser N.</h4>
                    <span className="text-[10px] text-gray-500">Al Ain, UAE • 2 months ago</span>
                  </div>
                </div>
                <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed min-h-[60px] font-medium">
                "My new car arrived at my doorstep, and they walked me through every step of inspection and handover. A premium experience by every measure."
              </p>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs font-bold text-green-600">
                  <CheckCircle size={14} /> <span>Verified Purchase</span>
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">VIP Delivery</span>
              </div>
            </div>
          </div>
          
          {/* Card 5 */}
          <div className="bg-white rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-xl hidden lg:block">
            <Quote className="absolute top-4 right-4 w-24 h-24 text-gray-100 z-0 opacity-50 transform rotate-180" />
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img src="https://i.pravatar.cc/150?img=59" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Kareem T.</h4>
                    <span className="text-[10px] text-gray-500">Dubai, UAE • 3 months ago</span>
                  </div>
                </div>
                <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed min-h-[60px] font-medium">
                "Their after-sales service is on a whole different level. The representative answers any question at any time. Special thanks to the support team."
              </p>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs font-bold text-green-600">
                  <CheckCircle size={14} /> <span>Verified Purchase</span>
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Gold Service</span>
              </div>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-xl hidden lg:block">
            <Quote className="absolute top-4 right-4 w-24 h-24 text-gray-100 z-0 opacity-50 transform rotate-180" />
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img src="https://i.pravatar.cc/150?img=68" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Tarek D.</h4>
                    <span className="text-[10px] text-gray-500">Dubai, UAE • 4 months ago</span>
                  </div>
                </div>
                <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><StarHalf size={14} fill="currentColor" /></div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed min-h-[60px] font-medium">
                "I spent 6 months searching for this car and found it here at the best price on the market. Warranty and maintenance have been flawless."
              </p>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs font-bold text-green-600">
                  <CheckCircle size={14} /> <span>Verified Purchase</span>
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Best Price</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-10 flex justify-center">
          <button className="btn-silver text-sm px-8">See More Reviews (2,500+)</button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SIMILAR CARS (Cross-sell) */}
      {/* ========================================================= */}
      <section className="pt-12 border-t border-brand-charcoal">
        <h2 className="text-2xl font-black text-white mb-8">سيارات مشابهة قد تعجبك</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarCars.map((simCar) => (
            <Link key={simCar._id} to={`/cars/${simCar._id}`} className="glass-card-interactive rounded-xl overflow-hidden group block">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={simCar.imageUrl} alt={simCar.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-sm line-clamp-1">{simCar.name}</h3>
                <div className="text-brand-red font-black mt-2">{formatEGP(simCar.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* STICKY MOBILE CHECKOUT FOOTER (Visible only on small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-brand-dark/95 backdrop-blur-lg border-t border-brand-charcoal p-4 z-50 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-gray-400">السعر الإجمالي</div>
          <div className="text-lg font-black text-white">{formatEGP(car.price)}</div>
        </div>
        <button 
          onClick={() => {
            addToCart(car, 1);
            navigate('/checkout');
          }}
          className="btn-red py-3 px-8 text-sm font-bold shadow-[0_0_15px_rgba(230,0,0,0.3)]"
        >
          أتمم الشراء الآن
        </button>
      </div>
      
    </div>
  );
};

// HELPER COMPONENTS
const SpecRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-white/5 pb-3">
    <span className="text-gray-400">{label}</span>
    <span className="text-white font-bold text-left">{value}</span>
  </div>
);

const FeatureItem = ({ text }) => (
  <li className="flex items-start space-x-3 space-x-reverse text-sm text-gray-300 bg-black/20 p-3 rounded-lg border border-white/5">
    <Check size={18} className="text-brand-emerald flex-shrink-0 mt-0.5" />
    <span>{text}</span>
  </li>
);

export default CarDetailsPage;
