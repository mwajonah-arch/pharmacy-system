import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle, Package, DollarSign, Users, FileText, Pill, TrendingUp, Calendar, ShoppingCart, Archive, Bell, Settings, Home, BarChart3, X, Edit, Trash2, Save, ChevronDown, Filter } from 'lucide-react';

// Sample initial data
const initialInventory = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Pharmaceutical', type: 'Tablet', quantity: 150, minStock: 50, price: 2.50, cost: 1.20, supplier: 'MediSupply Co', expiryDate: '2025-12-31', prescriptionRequired: false, barcode: '8901234567890' },
  { id: 2, name: 'Amoxicillin 250mg', category: 'Pharmaceutical', type: 'Capsule', quantity: 80, minStock: 30, price: 5.00, cost: 2.50, supplier: 'PharmaCare Ltd', expiryDate: '2025-08-15', prescriptionRequired: true, barcode: '8901234567891' },
  { id: 3, name: 'Cough Syrup', category: 'Pharmaceutical', type: 'Syrup', quantity: 45, minStock: 20, price: 8.50, cost: 4.00, supplier: 'MediSupply Co', expiryDate: '2025-06-30', prescriptionRequired: false, barcode: '8901234567892' },
  { id: 4, name: 'Face Masks (Box of 50)', category: 'Non-Pharmaceutical', type: 'PPE', quantity: 200, minStock: 50, price: 12.00, cost: 6.00, supplier: 'HealthGear Inc', expiryDate: '2027-12-31', prescriptionRequired: false, barcode: '8901234567893' },
  { id: 5, name: 'Hand Sanitizer 500ml', category: 'Non-Pharmaceutical', type: 'Hygiene', quantity: 35, minStock: 40, price: 6.50, cost: 3.00, supplier: 'HealthGear Inc', expiryDate: '2026-03-31', prescriptionRequired: false, barcode: '8901234567894' },
  { id: 6, name: 'Vitamin C 1000mg', category: 'Non-Pharmaceutical', type: 'Supplement', quantity: 120, minStock: 30, price: 15.00, cost: 7.50, supplier: 'VitaHealth', expiryDate: '2026-09-30', prescriptionRequired: false, barcode: '8901234567895' },
  { id: 7, name: 'Insulin Injection', category: 'Pharmaceutical', type: 'Injection', quantity: 25, minStock: 15, price: 45.00, cost: 25.00, supplier: 'PharmaCare Ltd', expiryDate: '2025-05-20', prescriptionRequired: true, barcode: '8901234567896' },
  { id: 8, name: 'Blood Pressure Monitor', category: 'Non-Pharmaceutical', type: 'Equipment', quantity: 15, minStock: 5, price: 85.00, cost: 50.00, supplier: 'MedTech Solutions', expiryDate: '2030-12-31', prescriptionRequired: false, barcode: '8901234567897' },
];

const initialCustomers = [
  { id: 1, name: 'John Doe', phone: '+254712345678', email: 'john@email.com', address: '123 Main St, Nairobi', allergies: 'Penicillin', notes: 'Regular customer', joinDate: '2024-01-15' },
  { id: 2, name: 'Jane Smith', phone: '+254723456789', email: 'jane@email.com', address: '456 Oak Ave, Nairobi', allergies: 'None', notes: '', joinDate: '2024-03-20' },
];

const initialSuppliers = [
  { id: 1, name: 'MediSupply Co', contact: 'Alex Johnson', phone: '+254734567890', email: 'alex@medisupply.com', address: 'Industrial Area, Nairobi', paymentTerms: 'Net 30' },
  { id: 2, name: 'PharmaCare Ltd', contact: 'Sarah Williams', phone: '+254745678901', email: 'sarah@pharmacare.com', address: 'Westlands, Nairobi', paymentTerms: 'Net 45' },
  { id: 3, name: 'HealthGear Inc', contact: 'Mike Brown', phone: '+254756789012', email: 'mike@healthgear.com', address: 'Mombasa Road, Nairobi', paymentTerms: 'Net 30' },
];

const initialPrescriptions = [
  { id: 1, customerId: 1, customerName: 'John Doe', date: '2026-02-05', doctor: 'Dr. Emily Wilson', items: [{ itemId: 2, itemName: 'Amoxicillin 250mg', quantity: 30, dosage: '1 capsule 3x daily' }], status: 'Active', refillsRemaining: 2 },
  { id: 2, customerId: 2, customerName: 'Jane Smith', date: '2026-02-01', doctor: 'Dr. Robert Chen', items: [{ itemId: 7, itemName: 'Insulin Injection', quantity: 10, dosage: 'As directed' }], status: 'Active', refillsRemaining: 5 },
];

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState(initialInventory);
  const [customers, setCustomers] = useState(initialCustomers);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2026-02-01', category: 'Rent', amount: 50000, description: 'Monthly rent', supplier: '' },
    { id: 2, date: '2026-02-03', category: 'Utilities', amount: 8000, description: 'Electricity bill', supplier: '' },
    { id: 3, date: '2026-02-05', category: 'Inventory', amount: 125000, description: 'Stock purchase', supplier: 'MediSupply Co' },
  ]);
  
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  // Form states
  const [itemForm, setItemForm] = useState({
    name: '', category: 'Pharmaceutical', type: '', quantity: 0, minStock: 0,
    price: 0, cost: 0, supplier: '', expiryDate: '', prescriptionRequired: false, barcode: ''
  });
  const [customerForm, setCustomerForm] = useState({
    name: '', phone: '', email: '', address: '', allergies: '', notes: ''
  });
  const [supplierForm, setSupplierForm] = useState({
    name: '', contact: '', phone: '', email: '', address: '', paymentTerms: 'Net 30'
  });
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0], category: 'Inventory', amount: 0, description: '', supplier: ''
  });

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    // Default admin credentials
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
  };

  // Analytics calculations
  const getLowStockItems = () => inventory.filter(item => item.quantity <= item.minStock);
  const getExpiringItems = () => {
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return inventory.filter(item => new Date(item.expiryDate) <= threeMonthsFromNow);
  };

  const getTotalRevenue = () => sales.reduce((sum, sale) => sum + sale.total, 0);
  const getTotalExpenses = () => expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const getProfit = () => getTotalRevenue() - getTotalExpenses();
  const getInventoryValue = () => inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  // Add to cart
  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Update cart quantity
  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  // Complete sale
  const completeSale = () => {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newSale = {
      id: sales.length + 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      customer: selectedCustomer?.name || 'Walk-in Customer',
      customerId: selectedCustomer?.id,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      total,
      paymentMethod: 'Cash'
    };
    
    setSales([...sales, newSale]);
    
    // Update inventory
    setInventory(inventory.map(item => {
      const cartItem = cart.find(ci => ci.id === item.id);
      if (cartItem) {
        return { ...item, quantity: item.quantity - cartItem.quantity };
      }
      return item;
    }));
    
    setCart([]);
    setSelectedCustomer(null);
    alert('Sale completed successfully!');
  };

  // CRUD operations
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    
    if (type === 'item') {
      setItemForm(item || {
        name: '', category: 'Pharmaceutical', type: '', quantity: 0, minStock: 0,
        price: 0, cost: 0, supplier: '', expiryDate: '', prescriptionRequired: false, barcode: ''
      });
    } else if (type === 'customer') {
      setCustomerForm(item || {
        name: '', phone: '', email: '', address: '', allergies: '', notes: ''
      });
    } else if (type === 'supplier') {
      setSupplierForm(item || {
        name: '', contact: '', phone: '', email: '', address: '', paymentTerms: 'Net 30'
      });
    } else if (type === 'expense') {
      setExpenseForm(item || {
        date: new Date().toISOString().split('T')[0], category: 'Inventory', amount: 0, description: '', supplier: ''
      });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const saveItem = () => {
    if (editingItem) {
      setInventory(inventory.map(item => item.id === editingItem.id ? { ...itemForm, id: item.id } : item));
    } else {
      setInventory([...inventory, { ...itemForm, id: inventory.length + 1 }]);
    }
    closeModal();
  };

  const deleteItem = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const saveCustomer = () => {
    if (editingItem) {
      setCustomers(customers.map(c => c.id === editingItem.id ? { ...customerForm, id: c.id } : c));
    } else {
      setCustomers([...customers, { ...customerForm, id: customers.length + 1, joinDate: new Date().toISOString().split('T')[0] }]);
    }
    closeModal();
  };

  const saveSupplier = () => {
    if (editingItem) {
      setSuppliers(suppliers.map(s => s.id === editingItem.id ? { ...supplierForm, id: s.id } : s));
    } else {
      setSuppliers([...suppliers, { ...supplierForm, id: suppliers.length + 1 }]);
    }
    closeModal();
  };

  const saveExpense = () => {
    if (editingItem) {
      setExpenses(expenses.map(e => e.id === editingItem.id ? { ...expenseForm, id: e.id } : e));
    } else {
      setExpenses([...expenses, { ...expenseForm, id: expenses.length + 1 }]);
    }
    closeModal();
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.barcode.includes(searchTerm);
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#e2e8f0'
    }}>
      {/* Login Page */}
      {!isLoggedIn ? (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'float 8s ease-in-out infinite reverse'
          }}></div>

          <style>
            {`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
              }
              @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>

          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '3rem',
            maxWidth: '450px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'slideIn 0.6s ease-out',
            zIndex: 1
          }}>
            {/* Logo and Title */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                borderRadius: '20px',
                marginBottom: '1.5rem',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
              }}>
                <Pill size={40} style={{ color: 'white' }} />
              </div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                margin: '0 0 0.5rem 0',
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                SJ Medipoint
              </h1>
              <p style={{
                fontSize: '0.95rem',
                color: '#94a3b8',
                margin: 0,
                fontWeight: '500'
              }}>
                Pharmacy Management System
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1'
                }}>
                  Username
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="Enter your username"
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1'
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              {loginError && (
                <div style={{
                  padding: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertTriangle size={16} />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                  marginTop: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                }}
              >
                Sign In
              </button>

              {/* Default Credentials Info */}
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#60a5fa' }}>
                  Default Credentials:
                </p>
                <p style={{ margin: '0 0 0.25rem 0', color: '#94a3b8' }}>
                  Username: <span style={{ color: '#e2e8f0', fontWeight: '600' }}>admin</span>
                </p>
                <p style={{ margin: 0, color: '#94a3b8' }}>
                  Password: <span style={{ color: '#e2e8f0', fontWeight: '600' }}>admin123</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
        padding: '1.5rem 2rem',
        borderBottom: '2px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Pill size={32} style={{ color: '#60a5fa' }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0, color: 'white' }}>SJ Medipoint</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} />
              <span>Admin</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Bell size={24} style={{ cursor: 'pointer', color: 'white' }} />
              {(getLowStockItems().length + getExpiringItems().length) > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  {getLowStockItems().length + getExpiringItems().length}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        background: '#1e293b',
        padding: '0.5rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'dashboard', icon: Home, label: 'Dashboard' },
          { id: 'pos', icon: ShoppingCart, label: 'Point of Sale' },
          { id: 'inventory', icon: Package, label: 'Inventory' },
          { id: 'prescriptions', icon: FileText, label: 'Prescriptions' },
          { id: 'customers', icon: Users, label: 'Customers' },
          { id: 'suppliers', icon: Archive, label: 'Suppliers' },
          { id: 'finance', icon: DollarSign, label: 'Finance' },
          { id: 'reports', icon: BarChart3, label: 'Reports' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ padding: '2rem' }}>
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: 'white' }}>Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.25)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.25)';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0 0 0.5rem 0' }}>Total Revenue</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>KES {getTotalRevenue().toLocaleString()}</p>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    padding: '0.75rem', 
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <DollarSign size={32} style={{ opacity: 0.9 }} />
                  </div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.25)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.25)';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0 0 0.5rem 0' }}>Inventory Value</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>KES {getInventoryValue().toLocaleString()}</p>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    padding: '0.75rem', 
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Package size={32} style={{ opacity: 0.9 }} />
                  </div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.25)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.25)';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0 0 0.5rem 0' }}>Net Profit</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>KES {getProfit().toLocaleString()}</p>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    padding: '0.75rem', 
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <TrendingUp size={32} style={{ opacity: 0.9 }} />
                  </div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.25)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(245, 158, 11, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.25)';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0 0 0.5rem 0' }}>Total Customers</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>{customers.length}</p>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    padding: '0.75rem', 
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Users size={32} style={{ opacity: 0.9 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {/* Low Stock Alert */}
              {getLowStockItems().length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                  border: '2px solid #ef4444',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 8px 25px rgba(239, 68, 68, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      padding: '0.5rem',
                      borderRadius: '8px'
                    }}>
                      <AlertTriangle size={24} style={{ color: '#ef4444' }} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: 'white' }}>Low Stock Alert</h3>
                  </div>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {getLowStockItems().map(item => (
                      <div key={item.id} style={{
                        padding: '0.875rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}>
                        <span style={{ fontWeight: '500' }}>{item.name}</span>
                        <span style={{ 
                          color: '#ef4444', 
                          fontWeight: '600',
                          background: 'rgba(239, 68, 68, 0.2)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.875rem'
                        }}>
                          {item.quantity} / {item.minStock}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expiring Items Alert */}
              {getExpiringItems().length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                  border: '2px solid #f59e0b',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 8px 25px rgba(245, 158, 11, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      padding: '0.5rem',
                      borderRadius: '8px'
                    }}>
                      <Calendar size={24} style={{ color: '#f59e0b' }} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: 'white' }}>Expiring Soon</h3>
                  </div>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {getExpiringItems().map(item => (
                      <div key={item.id} style={{
                        padding: '0.875rem',
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}>
                        <span style={{ fontWeight: '500' }}>{item.name}</span>
                        <span style={{ 
                          color: '#f59e0b', 
                          fontWeight: '600',
                          background: 'rgba(245, 158, 11, 0.2)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.875rem'
                        }}>
                          {item.expiryDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Sales */}
            {sales.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginTop: '2rem',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>Recent Sales</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '1rem 0.75rem', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Date</th>
                        <th style={{ padding: '1rem 0.75rem', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Customer</th>
                        <th style={{ padding: '1rem 0.75rem', textAlign: 'right', color: '#94a3b8', fontWeight: '600' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.slice(-5).reverse().map(sale => (
                        <tr key={sale.id} style={{ 
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '1rem 0.75rem', fontSize: '0.9rem' }}>{sale.date} {sale.time}</td>
                          <td style={{ padding: '1rem 0.75rem', fontSize: '0.9rem' }}>{sale.customer}</td>
                          <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: '600', color: '#10b981', fontSize: '0.95rem' }}>
                            KES {sale.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Point of Sale */}
        {activeTab === 'pos' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: 'white' }}>Point of Sale</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              {/* Product Selection */}
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input
                      type="text"
                      placeholder="Search products by name or barcode..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 3rem',
                        background: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                  {filteredInventory.map(item => (
                    <div
                      key={item.id}
                      onClick={() => addToCart(item)}
                      style={{
                        background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                        padding: '1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Pill size={16} style={{ color: item.category === 'Pharmaceutical' ? '#60a5fa' : '#10b981' }} />
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.category}</span>
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: 'white' }}>{item.name}</h4>
                      <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981', margin: 0 }}>KES {item.price.toFixed(2)}</p>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Stock: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>Current Sale</h3>
                
                {/* Customer Selection */}
                <div style={{ marginBottom: '1rem' }}>
                  <select
                    value={selectedCustomer?.id || ''}
                    onChange={(e) => setSelectedCustomer(customers.find(c => c.id === parseInt(e.target.value)))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="">Walk-in Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                </div>

                {/* Cart Items */}
                <div style={{ marginBottom: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {cart.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Cart is empty</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} style={{
                        background: '#0f172a',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</span>
                          <X
                            size={16}
                            style={{ cursor: 'pointer', color: '#ef4444' }}
                            onClick={() => updateCartQuantity(item.id, 0)}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              style={{
                                background: '#334155',
                                border: 'none',
                                color: 'white',
                                width: '30px',
                                height: '30px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >-</button>
                            <span style={{ width: '40px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              style={{
                                background: '#334155',
                                border: 'none',
                                color: 'white',
                                width: '30px',
                                height: '30px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >+</button>
                          </div>
                          <span style={{ fontWeight: '600', color: '#10b981' }}>
                            KES {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Total */}
                <div style={{
                  borderTop: '2px solid rgba(255,255,255,0.1)',
                  paddingTop: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '700' }}>
                    <span>Total:</span>
                    <span style={{ color: '#10b981' }}>
                      KES {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Complete Sale Button */}
                <button
                  onClick={completeSale}
                  disabled={cart.length === 0}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: cart.length === 0 ? '#334155' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Inventory */}
        {activeTab === 'inventory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: 'white' }}>Inventory Management</h2>
              <button
                onClick={() => openModal('item')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Plus size={20} />
                Add Item
              </button>
            </div>

            {/* Search and Filter */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Categories</option>
                <option value="Pharmaceutical">Pharmaceutical</option>
                <option value="Non-Pharmaceutical">Non-Pharmaceutical</option>
              </select>
            </div>

            {/* Inventory Table */}
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#94a3b8' }}>Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#94a3b8' }}>Category</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#94a3b8' }}>Type</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: '#94a3b8' }}>Stock</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', color: '#94a3b8' }}>Price</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#94a3b8' }}>Expiry</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#94a3b8' }}>Supplier</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          background: item.category === 'Pharmaceutical' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: item.category === 'Pharmaceutical' ? '#60a5fa' : '#10b981'
                        }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{item.type}</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: item.quantity <= item.minStock ? '#ef4444' : '#10b981'
                      }}>
                        {item.quantity}
                        {item.quantity <= item.minStock && <AlertTriangle size={14} style={{ marginLeft: '0.25rem', display: 'inline' }} />}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>KES {item.price.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem' }}>{item.expiryDate}</td>
                      <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{item.supplier}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <Edit
                            size={18}
                            style={{ cursor: 'pointer', color: '#3b82f6' }}
                            onClick={() => openModal('item', item)}
                          />
                          <Trash2
                            size={18}
                            style={{ cursor: 'pointer', color: '#ef4444' }}
                            onClick={() => deleteItem(item.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: 'white' }}>Prescription Management</h2>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem' }}>
              {prescriptions.map(prescription => (
                <div key={prescription.id} style={{
                  background: '#0f172a',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: 'white' }}>
                        {prescription.customerName}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>Dr. {prescription.doctor}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0 0 0.25rem 0' }}>{prescription.date}</p>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        background: prescription.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: prescription.status === 'Active' ? '#10b981' : '#ef4444'
                      }}>
                        {prescription.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Medications:</h4>
                    {prescription.items.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: '0.5rem' }}>
                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600' }}>{item.itemName} × {item.quantity}</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>{item.dosage}</p>
                      </div>
                    ))}
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.75rem' }}>
                      Refills remaining: {prescription.refillsRemaining}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customers */}
        {activeTab === 'customers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: 'white' }}>Customer Management</h2>
              <button
                onClick={() => openModal('customer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Plus size={20} />
                Add Customer
              </button>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#94a3b8' }}>Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#94a3b8' }}>Phone</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#94a3b8' }}>Email</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#94a3b8' }}>Allergies</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#94a3b8' }}>Join Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', color: '#94a3b8' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>{customer.name}</td>
                      <td style={{ padding: '0.75rem' }}>{customer.phone}</td>
                      <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{customer.email}</td>
                      <td style={{ padding: '0.75rem', color: customer.allergies !== 'None' ? '#ef4444' : '#94a3b8' }}>
                        {customer.allergies}
                      </td>
                      <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{customer.joinDate}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <Edit
                          size={18}
                          style={{ cursor: 'pointer', color: '#3b82f6' }}
                          onClick={() => openModal('customer', customer)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Suppliers */}
        {activeTab === 'suppliers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: 'white' }}>Supplier Management</h2>
              <button
                onClick={() => openModal('supplier')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Plus size={20} />
                Add Supplier
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {suppliers.map(supplier => (
                <div key={supplier.id} style={{
                  background: '#1e293b',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: 'white' }}>{supplier.name}</h3>
                    <Edit
                      size={18}
                      style={{ cursor: 'pointer', color: '#3b82f6' }}
                      onClick={() => openModal('supplier', supplier)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                      <strong>Contact:</strong> {supplier.contact}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                      <strong>Phone:</strong> {supplier.phone}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                      <strong>Email:</strong> {supplier.email}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                      <strong>Address:</strong> {supplier.address}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      <strong>Payment Terms:</strong> <span style={{ color: '#10b981' }}>{supplier.paymentTerms}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Finance */}
        {activeTab === 'finance' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: 'white' }}>Financial Management</h2>

            {/* Financial Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0 0 0.5rem 0' }}>Total Revenue</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>KES {getTotalRevenue().toLocaleString()}</p>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0 0 0.5rem 0' }}>Total Expenses</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>KES {getTotalExpenses().toLocaleString()}</p>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0 0 0.5rem 0' }}>Net Profit</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>KES {getProfit().toLocaleString()}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Sales History */}
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>Sales History</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {sales.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No sales recorded</p>
                  ) : (
                    sales.map(sale => (
                      <div key={sale.id} style={{
                        background: '#0f172a',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: '600' }}>{sale.customer}</span>
                          <span style={{ color: '#10b981', fontWeight: '600' }}>KES {sale.total.toFixed(2)}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                          {sale.date} at {sale.time}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Expenses */}
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: 'white' }}>Expenses</h3>
                  <button
                    onClick={() => openModal('expense')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {expenses.map(expense => (
                    <div key={expense.id} style={{
                      background: '#0f172a',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600' }}>{expense.description}</span>
                        <span style={{ color: '#ef4444', fontWeight: '600' }}>-KES {expense.amount.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8' }}>
                        <span>{expense.category}</span>
                        <span>{expense.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: 'white' }}>Reports & Analytics</h2>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Summary Report */}
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'white' }}>Business Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Total Products</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: 'white', margin: 0 }}>{inventory.length}</p>
                  </div>
                  <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Total Sales</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: 'white', margin: 0 }}>{sales.length}</p>
                  </div>
                  <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Active Prescriptions</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: 'white', margin: 0 }}>
                      {prescriptions.filter(p => p.status === 'Active').length}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Low Stock Items</p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444', margin: 0 }}>{getLowStockItems().length}</p>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'white' }}>Inventory by Category</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Pharmaceutical Items</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#60a5fa', margin: 0 }}>
                      {inventory.filter(i => i.category === 'Pharmaceutical').length}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                      Total Value: KES {inventory.filter(i => i.category === 'Pharmaceutical')
                        .reduce((sum, item) => sum + (item.quantity * item.cost), 0).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Non-Pharmaceutical Items</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', margin: 0 }}>
                      {inventory.filter(i => i.category === 'Non-Pharmaceutical').length}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                      Total Value: KES {inventory.filter(i => i.category === 'Non-Pharmaceutical')
                        .reduce((sum, item) => sum + (item.quantity * item.cost), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: '#1e293b',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: 'white' }}>
                {editingItem ? 'Edit' : 'Add'} {modalType === 'item' ? 'Item' : modalType === 'customer' ? 'Customer' : modalType === 'supplier' ? 'Supplier' : 'Expense'}
              </h3>
              <X size={24} style={{ cursor: 'pointer' }} onClick={closeModal} />
            </div>

            {/* Item Form */}
            {modalType === 'item' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Item Name"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <select
                  value={itemForm.category}
                  onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="Pharmaceutical">Pharmaceutical</option>
                  <option value="Non-Pharmaceutical">Non-Pharmaceutical</option>
                </select>
                <input
                  type="text"
                  placeholder="Type (e.g., Tablet, Capsule)"
                  value={itemForm.type}
                  onChange={(e) => setItemForm({ ...itemForm, type: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm({ ...itemForm, quantity: parseFloat(e.target.value) })}
                    style={{
                      padding: '0.75rem',
                      background: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Minimum Stock"
                    value={itemForm.minStock}
                    onChange={(e) => setItemForm({ ...itemForm, minStock: parseFloat(e.target.value) })}
                    style={{
                      padding: '0.75rem',
                      background: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Cost Price"
                    value={itemForm.cost}
                    onChange={(e) => setItemForm({ ...itemForm, cost: parseFloat(e.target.value) })}
                    style={{
                      padding: '0.75rem',
                      background: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Selling Price"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) })}
                    style={{
                      padding: '0.75rem',
                      background: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Barcode"
                  value={itemForm.barcode}
                  onChange={(e) => setItemForm({ ...itemForm, barcode: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <select
                  value={itemForm.supplier}
                  onChange={(e) => setItemForm({ ...itemForm, supplier: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <input
                  type="date"
                  placeholder="Expiry Date"
                  value={itemForm.expiryDate}
                  onChange={(e) => setItemForm({ ...itemForm, expiryDate: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={itemForm.prescriptionRequired}
                    onChange={(e) => setItemForm({ ...itemForm, prescriptionRequired: e.target.checked })}
                  />
                  <span>Prescription Required</span>
                </label>
                <button
                  onClick={saveItem}
                  style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Save Item
                </button>
              </div>
            )}

            {/* Customer Form */}
            {modalType === 'customer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Allergies (comma separated)"
                  value={customerForm.allergies}
                  onChange={(e) => setCustomerForm({ ...customerForm, allergies: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <textarea
                  placeholder="Notes"
                  value={customerForm.notes}
                  onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                  rows={3}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
                <button
                  onClick={saveCustomer}
                  style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Save Customer
                </button>
              </div>
            )}

            {/* Supplier Form */}
            {modalType === 'supplier' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Contact Person"
                  value={supplierForm.contact}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={supplierForm.email}
                  onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <select
                  value={supplierForm.paymentTerms}
                  onChange={(e) => setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
                <button
                  onClick={saveSupplier}
                  style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Save Supplier
                </button>
              </div>
            )}

            {/* Expense Form */}
            {modalType === 'expense' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="Inventory">Inventory</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Salaries">Salaries</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount (KES)"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: parseFloat(e.target.value) })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <select
                  value={expenseForm.supplier}
                  onChange={(e) => setExpenseForm({ ...expenseForm, supplier: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Supplier (Optional)</option>
                  {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
                <button
                  onClick={saveExpense}
                  style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Save Expense
                </button>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default App;
