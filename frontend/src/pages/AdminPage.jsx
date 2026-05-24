/**
 * ADMIN PAGE COMPONENT
 * The administrative command dashboard of Revora (Revora).
 * Features:
 * 1. Secure authorization gate (asks for login if token is missing).
 * 2. Key Performance Indicators (KPIs) cards detailing Revenue, Active Bookings, and fleet catalogs.
 * 3. Double tabs layout: "Orders Dashboard" and "Fleet Catalog Manager".
 * 4. Orders Dashboard: Displays all customer purchases, and updates fulfillment phase instantly.
 * 5. Fleet Catalog Manager: Provides modal templates to create, edit, or delete vehicles catalogs.
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { Lock, LogOut, DollarSign, ShoppingBag, Car, Plus, Edit, Trash2, Check, X, ShieldAlert } from 'lucide-react';

const AdminPage = () => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('revora_admin_token'));
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard states
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'inventory'
  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form inputs state for Add/Edit Car modals
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null); // If set, we are editing, else adding
  const [carFormData, setCarFormData] = useState({
    name: '',
    brand: '',
    price: '',
    imageUrl: '',
    description: '',
    seats: '',
    luggage: '',
    category: 'First Class',
    inStock: true
  });

  // 1. Fetch dashboard data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Execute parallel requests to load orders and cars
        const [ordersRes, carsRes] = await Promise.all([
          api.get('/admin/orders'),
          api.get('/cars')
        ]);

        if (ordersRes.data.success) setOrders(ordersRes.data.data);
        if (carsRes.data.success) setCars(carsRes.data.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Session expired or access denied. Please log in again.');
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  // Admin login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error('Email and Password are required.');
      return;
    }

    setAuthLoading(true);

    try {
      // POST /api/admin/login using Axios client
      const response = await api.post('/admin/login', {
        email: loginEmail.trim(),
        password: loginPassword
      });

      if (response.data.success) {
        // Save JWT session credentials in local storage
        localStorage.setItem('revora_admin_token', response.data.token);
        localStorage.setItem('revora_admin_email', response.data.admin.email);
        
        setIsAuthenticated(true);
        toast.success('Welcome back, Admin!');
      } else {
        toast.error(response.data.message || 'Login failed.');
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message || 'Login failed. Check server connection.';
      toast.error(serverMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  // Admin logout handler
  const handleLogout = () => {
    localStorage.removeItem('revora_admin_token');
    localStorage.removeItem('revora_admin_email');
    setIsAuthenticated(false);
    setLoginPassword('');
    toast.success('Logged out successfully.');
  };

  // Order status update trigger handler
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // PUT /api/admin/orders/:id/status using Axios instance
      const response = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      
      if (response.data.success) {
        toast.success(`Fulfillment updated to "${newStatus}"!`);
        // Refresh local orders list state
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message || 'Fulfillment change failed.';
      toast.error(serverMessage);
    }
  };

  // Open modal template to create/insert a new car listing
  const openAddCarModal = () => {
    setEditingCar(null);
    setCarFormData({
      name: '',
      brand: '',
      price: '',
      imageUrl: '',
      description: '',
      seats: '',
      luggage: '',
      category: 'First Class',
      inStock: true
    });
    setShowCarModal(true);
  };

  // Open modal template to edit/modify an existing car listing
  const openEditCarModal = (car) => {
    setEditingCar(car);
    setCarFormData({
      name: car.name,
      brand: car.brand,
      price: car.price,
      imageUrl: car.imageUrl,
      description: car.description,
      seats: car.seats,
      luggage: car.luggage || 2,
      category: car.category,
      inStock: car.inStock
    });
    setShowCarModal(true);
  };

  // Delete a car listing handler
  const handleDeleteCar = async (carId, name) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${name}" from inventory?`)) return;

    try {
      // DELETE /api/admin/cars/:id using Axios instance
      const response = await api.delete(`/admin/cars/${carId}`);
      if (response.data.success) {
        toast.success(`Removed ${name} successfully!`);
        // Remove from local cars list state
        setCars(prev => prev.filter(c => c._id !== carId));
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message || 'Deletion failed.';
      toast.error(serverMessage);
    }
  };

  // Form submit handler for Add OR Edit car actions
  const handleCarFormSubmit = async (e) => {
    e.preventDefault();

    // Check basic validators
    if (!carFormData.name || !carFormData.brand || !carFormData.price || !carFormData.imageUrl || !carFormData.description || !carFormData.seats || !carFormData.luggage) {
      toast.error('All fields are required.');
      return;
    }

    try {
      let response;
      if (editingCar) {
        // Update car listing (PUT)
        response = await api.put(`/admin/cars/${editingCar._id}`, carFormData);
      } else {
        // Add new car listing (POST)
        response = await api.post('/admin/cars', carFormData);
      }

      if (response.data.success) {
        toast.success(editingCar ? 'Car listing updated!' : 'New car added successfully!');
        setShowCarModal(false);
        
        // Refresh local car list state
        const refreshedCars = await api.get('/cars');
        if (refreshedCars.data.success) setCars(refreshedCars.data.data);
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message || 'Transaction failed. Check inputs.';
      toast.error(serverMessage);
    }
  };

  // Handle nested inputs changes
  const handleFormInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCarFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Helper: compute analytical sums
  const calculateTotalRevenue = () => {
    // Sum totalAmount of orders that are not cancelled
    return orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  };

  const calculateSalesVolume = () => {
    // Sum item counts across orders
    return orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.items.reduce((cSum, i) => cSum + i.quantity, 0), 0);
  };

  // Currency formatting helper
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  /**
   * =========================================================================
   * RENDERING A: AUTHORIZATION GATING SHIELD
   * =========================================================================
   */
  if (!isAuthenticated) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-brand-charcoal text-center space-y-6 animate-slide-up">
          {/* Glowing lock logo */}
          <div className="w-16 h-16 rounded-full bg-brand-red bg-opacity-10 border border-brand-red border-opacity-20 flex items-center justify-center mx-auto text-brand-red shadow-[0_0_20px_rgba(102,252,241,0.15)]">
            <Lock size={26} className="stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Admin Gate</h2>
            <p className="text-brand-steel text-xs">Access is restricted to authorized Revora officials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. admin@revora.com"
                className="form-input text-sm"
                required
                disabled={authLoading}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Passphrase</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input text-sm"
                required
                disabled={authLoading}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full btn-red text-sm font-semibold py-3 flex items-center justify-center pt-3.5"
            >
              {authLoading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>Authenticate Session</span>
              )}
            </button>
          </form>

          <div className="text-[10px] text-gray-500 flex items-center justify-center space-x-1.5 p-2 bg-brand-charcoal bg-opacity-40 rounded-lg">
            <ShieldAlert size={12} className="text-brand-silver" />
            <span>Authorized access logs are actively recorded for auditing.</span>
          </div>

        </div>
      </div>
    );
  }

  /**
   * =========================================================================
   * RENDERING B: GENERAL MANAGEMENT DASHBOARD
   * =========================================================================
   */
  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8 text-left">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 border-b border-brand-charcoal pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
          <span className="text-brand-steel text-xs text-opacity-80">Log session: admin@revora.com</span>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="btn-silver py-2 px-4 text-xs font-semibold flex items-center justify-center space-x-1.5 bg-transparent border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors duration-300"
        >
          <LogOut size={14} />
          <span>Terminate Session</span>
        </button>
      </div>

      {/* 1. KEY PERFORMANCE INDICATORS (KPIs) GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* KPI A: Total Revenue */}
        <div className="glass-card p-6 rounded-2xl border border-brand-charcoal flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Total Revenue</span>
            <span className="text-2xl font-black text-brand-silver">{formatPrice(calculateTotalRevenue())}</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#D4AF37] bg-opacity-10 text-brand-silver flex items-center justify-center border border-[#D4AF37] border-opacity-15">
            <DollarSign size={20} />
          </div>
        </div>

        {/* KPI B: Completed Checkouts */}
        <div className="glass-card p-6 rounded-2xl border border-brand-charcoal flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Cars Ordered</span>
            <span className="text-2xl font-black text-brand-red">{calculateSalesVolume()}</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-brand-red bg-opacity-10 text-brand-red flex items-center justify-center border border-brand-red border-opacity-15">
            <ShoppingBag size={20} />
          </div>
        </div>

        {/* KPI C: Fleet Count */}
        <div className="glass-card p-6 rounded-2xl border border-brand-charcoal flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Fleet Inventory</span>
            <span className="text-2xl font-black text-brand-emerald">{cars.length} Listings</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-brand-emerald bg-opacity-10 text-brand-emerald flex items-center justify-center border border-brand-emerald border-opacity-15">
            <Car size={20} />
          </div>
        </div>
      </div>

      {/* 2. SECTION NAV TABS */}
      <div className="flex space-x-3 border-b border-brand-charcoal pb-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`text-xs font-semibold py-2 px-4 rounded-md transition-all duration-300 ${
            activeTab === 'orders' ? 'bg-brand-red text-black shadow-md' : 'text-brand-steel hover:text-white'
          }`}
        >
          Orders Log ({orders.length})
        </button>
        
        <button
          onClick={() => setActiveTab('inventory')}
          className={`text-xs font-semibold py-2 px-4 rounded-md transition-all duration-300 ${
            activeTab === 'inventory' ? 'bg-brand-red text-black shadow-md' : 'text-brand-steel hover:text-white'
          }`}
        >
          Catalog Fleet ({cars.length})
        </button>
      </div>

      {/* 3. DYNAMIC CONTENT WORKSPACES */}
      {activeTab === 'orders' ? (
        /* =========================================================================
            TABS A: ORDERS DATABASE TAB
           ========================================================================= */
        <div className="glass-card rounded-2xl border border-brand-charcoal overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="font-bold text-white text-base">No orders log registered</h3>
              <p className="text-brand-steel text-xs mt-1">Customers have not made any checkout orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-black bg-opacity-40 border-b border-brand-charcoal text-brand-steel font-bold tracking-wider uppercase">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Items Overview</th>
                    <th className="p-4">Total Price</th>
                    <th className="p-4 text-center">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-charcoal divide-opacity-35">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-brand-charcoal hover:bg-opacity-20 transition-colors">
                      <td className="p-4 font-mono font-bold text-brand-red select-all">{o.orderNumber}</td>
                      <td className="p-4 space-y-1">
                        <span className="font-bold text-white text-sm block">{o.customer.fullName}</span>
                        <span className="text-[10px] text-brand-steel block">{o.customer.phone}</span>
                        <span className="text-[10px] text-gray-500 block truncate max-w-xs">{o.customer.address}</span>
                      </td>
                      <td className="p-4 space-y-1.5">
                        {o.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between max-w-xs text-[10px] text-brand-steel">
                            <span>• {i.name} (x{i.quantity})</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-bold text-white text-sm">{formatPrice(o.totalAmount)}</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            className="bg-black border border-brand-charcoal text-white rounded-md py-1.5 px-3 text-xs outline-none focus:border-brand-red"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
            TABS B: INVENTORY FLEET CRUD TAB
           ========================================================================= */
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={openAddCarModal}
              className="btn-red py-2 text-xs flex items-center justify-center space-x-1 font-semibold"
            >
              <Plus size={14} className="stroke-[3]" />
              <span>Add Fleet Car</span>
            </button>
          </div>

          <div className="glass-card rounded-2xl border border-brand-charcoal overflow-hidden animate-fade-in">
            {cars.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="font-bold text-white text-base">No cars seeded</h3>
                <p className="text-brand-steel text-xs mt-1">Your inventory fleet is completely empty.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-black bg-opacity-40 border-b border-brand-charcoal text-brand-steel font-bold tracking-wider uppercase">
                      <th className="p-4">Preview</th>
                      <th className="p-4">Car Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Specs</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-charcoal divide-opacity-35">
                    {cars.map((car) => (
                      <tr key={car._id} className="hover:bg-brand-charcoal hover:bg-opacity-20 transition-colors">
                        <td className="p-4">
                          <img
                            src={car.imageUrl}
                            alt={car.name}
                            className="w-12 h-10 rounded-md object-cover bg-brand-charcoal border border-white border-opacity-5"
                          />
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest block">{car.brand}</span>
                          <span className="font-bold text-white text-sm block mt-0.5">{car.name}</span>
                        </td>
                        <td className="p-4 uppercase text-brand-red text-[10px] font-bold tracking-wider">{car.category}</td>
                        <td className="p-4 space-y-0.5 text-[10px] text-brand-steel">
                          <div>Seats: {car.seats}</div>
                          <div>Luggage: {car.luggage}</div>
                        </td>
                        <td className="p-4 font-bold text-white text-sm">{formatPrice(car.price)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] border ${
                            car.inStock
                              ? 'bg-green-500 bg-opacity-15 text-green-400 border-green-500'
                              : 'bg-red-500 bg-opacity-15 text-red-400 border-red-500'
                          }`}>
                            {car.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center space-x-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => openEditCarModal(car)}
                              className="p-1.5 rounded bg-brand-charcoal text-brand-steel hover:text-brand-red border border-white border-opacity-5 transition-colors"
                              title="Edit listing details"
                            >
                              <Edit size={14} />
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteCar(car._id, car.name)}
                              className="p-1.5 rounded bg-brand-charcoal text-brand-steel hover:text-red-400 border border-white border-opacity-5 transition-colors"
                              title="Delete listing"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. MODALS OVERLAYS: ADD / EDIT CAR */}
      {showCarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl glass-card rounded-2xl border border-brand-charcoal overflow-hidden shadow-2xl animate-slide-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-brand-charcoal bg-black bg-opacity-35 flex justify-between items-center">
              <h3 className="font-bold text-white text-base">
                {editingCar ? `Edit Listing details: ${editingCar.name}` : 'Add Fleet Car Listing'}
              </h3>
              <button
                onClick={() => setShowCarModal(false)}
                className="p-1 rounded-full text-brand-steel hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCarFormSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brand */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Manufacturer / Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={carFormData.brand}
                    onChange={handleFormInputChange}
                    placeholder="e.g. Mercedes-Benz"
                    className="form-input text-xs"
                    required
                  />
                </div>
                
                {/* Name */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Car Model Name</label>
                  <input
                    type="text"
                    name="name"
                    value={carFormData.name}
                    onChange={handleFormInputChange}
                    placeholder="e.g. S-Class 450D"
                    className="form-input text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Price */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Purchase Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={carFormData.price}
                    onChange={handleFormInputChange}
                    placeholder="e.g. 85000"
                    className="form-input text-xs"
                    min="0"
                    required
                  />
                </div>

                {/* Seats */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Seats Capacity (1-9)</label>
                  <input
                    type="number"
                    name="seats"
                    value={carFormData.seats}
                    onChange={handleFormInputChange}
                    placeholder="e.g. 4"
                    className="form-input text-xs"
                    min="1"
                    max="9"
                    required
                  />
                </div>

                {/* Luggage */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Luggage Limit</label>
                  <input
                    type="number"
                    name="luggage"
                    value={carFormData.luggage}
                    onChange={handleFormInputChange}
                    placeholder="e.g. 3"
                    className="form-input text-xs"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category select */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Class Segment</label>
                  <select
                    name="category"
                    value={carFormData.category}
                    onChange={handleFormInputChange}
                    className="bg-black border border-brand-charcoal text-white rounded-md py-2 px-3 text-xs outline-none focus:border-brand-red"
                  >
                    <option value="First Class">First Class</option>
                    <option value="Business Class">Business Class</option>
                    <option value="SUV">SUV</option>
                    <option value="Economy">Economy</option>
                  </select>
                </div>

                {/* Stock Checkbox */}
                <div className="flex items-center space-x-2 pt-5">
                  <input
                    type="checkbox"
                    id="inStock"
                    name="inStock"
                    checked={carFormData.inStock}
                    onChange={handleFormInputChange}
                    className="w-4 h-4 bg-black border border-brand-charcoal text-brand-red focus:ring-brand-red rounded"
                  />
                  <label htmlFor="inStock" className="text-xs font-bold text-brand-steel uppercase tracking-wider cursor-pointer">
                    Available in Stock
                  </label>
                </div>
              </div>

              {/* Image URL */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Image Preview URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={carFormData.imageUrl}
                  onChange={handleFormInputChange}
                  placeholder="https://picsum.photos/id/111/400/300"
                  className="form-input text-xs"
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-brand-steel uppercase tracking-wider">Overview Descriptions (max 500 chars)</label>
                <textarea
                  name="description"
                  value={carFormData.description}
                  onChange={handleFormInputChange}
                  rows={3}
                  placeholder="Provide brief high-end commercial overview descriptions..."
                  maxLength="500"
                  className="form-input resize-none text-xs"
                  required
                />
              </div>

              {/* Actions submit buttons */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-brand-charcoal">
                <button
                  type="button"
                  onClick={() => setShowCarModal(false)}
                  className="bg-brand-charcoal text-brand-steel hover:text-white py-2 px-4 rounded-md border border-white border-opacity-5 hover:bg-opacity-80 transition-all text-xs font-semibold"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn-red py-2 px-5 text-xs font-semibold"
                >
                  {editingCar ? 'Update Listing' : 'Sead Listing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
