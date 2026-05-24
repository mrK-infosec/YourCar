import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Helmet } from 'react-helmet-async';
import { Check, ShieldCheck, MapPin, Truck, CreditCard, Landmark, Banknote, ArrowRight, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems: cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Form states
  const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'القاهرة',
    paymentMethod: 'cash',
    deliveryMethod: 'home'
  });

  const formatEGP = (val) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(val);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && step === 1) {
      toast.error('سلة المشتريات فارغة');
      navigate('/');
    }
  }, [cart, navigate, step]);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.14; // 14% VAT (just for show, though usually car prices include VAT)
  const total = subtotal; // Assuming VAT is included in the base price for this example

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      toast.error('يرجى إكمال البيانات الأساسية');
      return;
    }
    
    // Move to OTP step
    setStep(2);
  };

  const verifyOTPAndComplete = () => {
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      setStep(3);
    }, 2000);
  };

  if (step === 3) {
    return (
      <div dir="rtl" className="font-arabic min-h-screen flex items-center justify-center pt-20 px-4">
        <Helmet><title>تم تأكيد الطلب بنجاح - ريفورا</title></Helmet>
        <div className="glass-card max-w-lg w-full p-10 rounded-3xl text-center space-y-6">
          <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-500/30">
            <Check size={48} className="stroke-[3]" />
          </div>
          <h1 className="text-3xl font-black text-white">تم تأكيد طلبك بنجاح!</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            شكراً لثقتك في ريفورا. رقم طلبك هو <span className="text-white font-bold tracking-widest bg-white/10 px-2 py-1 rounded mx-1">#REV-{Math.floor(Math.random() * 90000) + 10000}</span>.
            <br /> سيقوم أحد ممثلي المبيعات بالتواصل معك خلال 24 ساعة لترتيب إجراءات التسليم.
          </p>
          <div className="pt-6">
            <Link to="/" className="btn-red w-full flex justify-center py-4 text-lg font-bold">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div dir="rtl" className="font-arabic min-h-screen flex items-center justify-center pt-20 px-4">
        <Helmet><title>تأكيد رقم الهاتف - ريفورا</title></Helmet>
        <div className="glass-card max-w-md w-full p-10 rounded-3xl text-center space-y-6 border border-brand-red/20">
          <h1 className="text-2xl font-black text-white">رمز التحقق (OTP)</h1>
          <p className="text-gray-400 text-sm">
            تم إرسال كود من 4 أرقام إلى الرقم <b className="text-white" dir="ltr">{formData.phone}</b>
          </p>
          <div className="flex justify-center gap-4 py-4" dir="ltr">
            {[1, 2, 3, 4].map(i => (
              <input key={i} type="text" maxLength="1" className="w-14 h-14 text-center text-2xl font-black bg-black/50 border border-white/20 rounded-xl text-white focus:border-brand-red focus:outline-none" />
            ))}
          </div>
          <button 
            onClick={verifyOTPAndComplete}
            disabled={isSubmitting}
            className="btn-red w-full flex justify-center items-center py-4 text-lg font-bold disabled:opacity-50"
          >
            {isSubmitting ? <Loader className="animate-spin" /> : 'تأكيد الطلب'}
          </button>
          <button onClick={() => setStep(1)} className="text-xs text-gray-500 hover:text-white pt-2">رجوع وتعديل البيانات</button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="font-arabic max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
      <Helmet><title>إتمام الشراء - ريفورا</title></Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">إتمام الشراء (Checkout)</h1>
        <p className="text-gray-400 text-sm mt-2">يرجى إكمال بياناتك لتأكيد حجز السيارة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* RIGHT COLUMN: Form Details */}
        <div className="lg:col-span-8 space-y-8">
          
          <form onSubmit={handleConfirmOrder} className="space-y-8">
            {/* 1. Customer Details */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">1. البيانات الشخصية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-bold">الاسم الرباعي <span className="text-brand-red">*</span></label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand-red focus:outline-none" placeholder="مثال: أحمد محمد علي" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-bold">رقم الهاتف الأساسي <span className="text-brand-red">*</span></label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" dir="ltr" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand-red focus:outline-none text-right" placeholder="01X XXXX XXXX" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-gray-400 font-bold">البريد الإلكتروني (اختياري)</label>
                  <input name="email" value={formData.email} onChange={handleInputChange} type="email" dir="ltr" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand-red focus:outline-none text-right" placeholder="your@email.com" />
                </div>
              </div>
            </div>

            {/* 2. Delivery Method */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">2. طريقة الاستلام</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button type="button" onClick={() => setFormData({...formData, deliveryMethod: 'home'})} className={`flex items-center space-x-3 space-x-reverse p-4 rounded-xl border-2 transition-all ${formData.deliveryMethod === 'home' ? 'border-brand-red bg-brand-red/10 text-white' : 'border-white/10 text-gray-400 bg-black/20 hover:border-white/30'}`}>
                  <Truck size={24} className={formData.deliveryMethod === 'home' ? 'text-brand-red' : ''} />
                  <span className="font-bold">توصيل للمنزل (ونش VIP)</span>
                </button>
                <button type="button" onClick={() => setFormData({...formData, deliveryMethod: 'pickup'})} className={`flex items-center space-x-3 space-x-reverse p-4 rounded-xl border-2 transition-all ${formData.deliveryMethod === 'pickup' ? 'border-brand-red bg-brand-red/10 text-white' : 'border-white/10 text-gray-400 bg-black/20 hover:border-white/30'}`}>
                  <MapPin size={24} className={formData.deliveryMethod === 'pickup' ? 'text-brand-red' : ''} />
                  <span className="font-bold">استلام من المعرض</span>
                </button>
              </div>

              {formData.deliveryMethod === 'home' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-bold">المحافظة / المدينة</label>
                    <select name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand-red focus:outline-none appearance-none">
                      <option value="القاهرة">القاهرة</option>
                      <option value="الجيزة">الجيزة</option>
                      <option value="الإسكندرية">الإسكندرية</option>
                      <option value="أخرى">أخرى (يحدد لاحقاً)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-bold">العنوان التفصيلي</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows="2" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand-red focus:outline-none" placeholder="الشارع، رقم العمارة، رقم الشقة..."></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Payment Method */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-brand-red/30 shadow-[0_0_30px_rgba(230,0,0,0.05)]">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">3. طريقة الدفع</h2>
              <div className="grid grid-cols-1 gap-4">
                
                {/* Cash */}
                <label className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cash' ? 'border-brand-red bg-brand-red/5' : 'border-white/10 bg-black/20 hover:border-white/30'}`}>
                  <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleInputChange} className="mt-1 ml-3 accent-brand-red" />
                  <div>
                    <div className="flex items-center text-white font-bold text-lg"><Banknote size={20} className="mr-2 ml-2 text-green-500" /> كاش (دفع نقدي أو كاشير)</div>
                    <p className="text-xs text-gray-400 mt-1">يتم دفع مبلغ حجز مبدئي وتكملة الباقي عند الاستلام.</p>
                  </div>
                </label>

                {/* Transfer */}
                <label className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'transfer' ? 'border-brand-red bg-brand-red/5' : 'border-white/10 bg-black/20 hover:border-white/30'}`}>
                  <input type="radio" name="paymentMethod" value="transfer" checked={formData.paymentMethod === 'transfer'} onChange={handleInputChange} className="mt-1 ml-3 accent-brand-red" />
                  <div>
                    <div className="flex items-center text-white font-bold text-lg"><Landmark size={20} className="mr-2 ml-2 text-blue-500" /> تحويل بنكي مقصّة</div>
                    <p className="text-xs text-gray-400 mt-1">سيتم تزويدك برقم الحساب البنكي لشركة ريفورا بعد تأكيد الطلب.</p>
                  </div>
                </label>

                {/* Installment */}
                <label className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'installment' ? 'border-brand-red bg-brand-red/5' : 'border-white/10 bg-black/20 hover:border-white/30'}`}>
                  <input type="radio" name="paymentMethod" value="installment" checked={formData.paymentMethod === 'installment'} onChange={handleInputChange} className="mt-1 ml-3 accent-brand-red" />
                  <div>
                    <div className="flex items-center text-white font-bold text-lg"><CreditCard size={20} className="mr-2 ml-2 text-yellow-500" /> تقسيط / تمويل بنكي</div>
                    <p className="text-xs text-gray-400 mt-1">يتطلب استعلام بنكي وموافقة مبدئية من جهة التمويل (البنك الأهلي، valU، Contact).</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="hidden lg:block">
              <button type="submit" className="w-full btn-red py-4 text-xl font-black shadow-[0_0_25px_rgba(230,0,0,0.3)]">
                تأكيد حجز السيارة
              </button>
            </div>
          </form>
        </div>

        {/* LEFT COLUMN: Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10 sticky top-28">
            <h2 className="text-xl font-bold text-white mb-6">ملخص الطلب</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item, idx) => (
                <div key={idx} className="flex space-x-3 space-x-reverse border-b border-white/5 pb-4">
                  <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm line-clamp-1">{item.name}</h4>
                    <div className="text-[10px] text-gray-500 mb-1">اللون: أسود ملكي (افتراضي)</div>
                    <div className="text-brand-emerald font-bold text-sm">{formatEGP(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-b border-white/5 pb-6 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>المجموع الفرعي</span>
                <span className="text-white">{formatEGP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>مصاريف التجهيز والنقل</span>
                <span className="text-white">{formData.deliveryMethod === 'home' ? formatEGP(5000) : 'مجاناً'}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>ضريبة القيمة المضافة (شامل)</span>
                <span className="text-white">--</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-6">
              <span className="text-white font-bold">الإجمالي النهائي</span>
              <span className="text-3xl font-black text-brand-red">
                {formatEGP(total + (formData.deliveryMethod === 'home' ? 5000 : 0))}
              </span>
            </div>

            <div className="flex items-start space-x-2 space-x-reverse bg-black/30 p-3 rounded-lg text-[10px] text-gray-400">
              <ShieldCheck size={16} className="text-brand-emerald flex-shrink-0" />
              <p>بياناتك محمية بتشفير 256-bit SSL. نحن لا نشارك بياناتك مع أي طرف ثالث غير معني بعملية التمويل.</p>
            </div>

            {/* Mobile Submit Button (shows under summary on small screens) */}
            <div className="lg:hidden mt-6">
              <button 
                onClick={handleConfirmOrder} 
                className="w-full btn-red py-4 text-xl font-black shadow-[0_0_25px_rgba(230,0,0,0.3)]"
              >
                تأكيد حجز السيارة
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
