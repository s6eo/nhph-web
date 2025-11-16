import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Calendar, Clock, Users, Phone, MapPin, Heart, Shield, Star, CheckCircle, AlertCircle, Loader2, Settings, UserPlus, CalendarPlus, BarChart3, LogOut, Eye, EyeOff, Palette, Type, Layout, Globe, Save, Download, Upload, Trash2, Edit, Plus, X, Database, RefreshCw } from 'lucide-react'
import './App.css'

const API_BASE_URL = 'http://localhost:5000/api'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [bookingStep, setBookingStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // حالة الإدارة
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [adminData, setAdminData] = useState(null)
  const [adminLoginData, setAdminLoginData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  // حالة Super Admin
  const [siteSettings, setSiteSettings] = useState({
    primaryColor: '#2563eb',
    secondaryColor: '#10b981',
    fontFamily: 'Cairo',
    fontSize: '16px',
    siteName: 'دار التمريض الخاص',
    siteDescription: 'مستشفى متخصص'
  })
  const [contentSettings, setContentSettings] = useState({
    heroTitle: 'مرحباً بكم في دار التمريض الخاص',
    heroDescription: 'نقدم أفضل الخدمات الطبية المتخصصة مع فريق من أمهر الأطباء والممرضين في بيئة طبية متطورة وآمنة'
  })

  // حالة الحجز
  const [selectedClinic, setSelectedClinic] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [patientData, setPatientData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: ''
  })
  const [bookingResult, setBookingResult] = useState(null)

  // البيانات
  const [clinics, setClinics] = useState([])
  const [doctors, setDoctors] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  const [dashboardStats, setDashboardStats] = useState({})

  // دوال الإدارة
  const handleAdminLogin = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(adminLoginData)
      })

      const data = await response.json()
      
      if (data.success) {
        setIsAdmin(true)
        setIsSuperAdmin(data.data.role === 'super_admin')
        setAdminData(data.data)
        setActiveSection('admin-dashboard')
        setSuccess('تم تسجيل الدخول بنجاح')
        fetchDashboardStats()
      } else {
        setError(data.message || 'اسم المستخدم أو كلمة المرور غير صحيحة')
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم')
      console.error('خطأ في تسجيل الدخول:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    setIsSuperAdmin(false)
    setAdminData(null)
    setActiveSection('home')
    setAdminLoginData({ username: '', password: '' })
    setSuccess('تم تسجيل الخروج بنجاح')
  }

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setDashboardStats(data.data)
      }
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error)
    } finally {
      setLoading(false)
    }
  }

  // باقي الدوال المطلوبة للتطبيق
  const fetchClinics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clinics`)
      const data = await response.json()
      if (data.success) {
        setClinics(data.data)
      }
    } catch (error) {
      console.error('خطأ في جلب العيادات:', error)
    }
  }

  const fetchDoctors = async (clinicId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clinics/${clinicId}/doctors`)
      const data = await response.json()
      if (data.success) {
        setDoctors(data.data)
      }
    } catch (error) {
      console.error('خطأ في جلب الأطباء:', error)
    }
  }

  const fetchAvailableSlots = async (doctorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}/available-slots`)
      const data = await response.json()
      if (data.success) {
        setAvailableSlots(data.data)
      }
    } catch (error) {
      console.error('خطأ في جلب المواعيد:', error)
    }
  }

  const handleBooking = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_name: patientData.name,
          patient_phone: patientData.phone,
          patient_email: patientData.email,
          patient_age: patientData.age ? parseInt(patientData.age) : null,
          patient_gender: patientData.gender,
          slot_id: parseInt(selectedSlot)
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setBookingResult(data.data)
        setBookingStep(5)
        setSuccess('تم حجز الموعد بنجاح!')
      } else {
        setError(data.message || 'حدث خطأ في الحجز')
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم')
      console.error('خطأ في الحجز:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (bookingStep < 5) {
      setBookingStep(bookingStep + 1)
    }
  }

  const prevStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1)
    }
  }

  const handleClinicSelect = (clinicId) => {
    setSelectedClinic(clinicId)
    setSelectedDoctor('')
    setSelectedSlot('')
    setDoctors([])
    setAvailableSlots([])
    fetchDoctors(clinicId)
  }

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctor(doctorId)
    setSelectedSlot('')
    setAvailableSlots([])
    fetchAvailableSlots(doctorId)
  }

  const resetBooking = () => {
    setBookingStep(1)
    setSelectedClinic('')
    setSelectedDoctor('')
    setSelectedSlot('')
    setPatientData({
      name: '',
      phone: '',
      email: '',
      age: '',
      gender: ''
    })
    setBookingResult(null)
    setError('')
    setSuccess('')
  }

  // بيانات العرض
  const clinics_display = [
    { id: 1, name: 'الطب الباطني', description: 'تشخيص وعلاج الأمراض الداخلية', icon: Heart },
    { id: 2, name: 'طب الأطفال', description: 'رعاية صحية شاملة للأطفال', icon: Users },
    { id: 3, name: 'الجراحة العامة', description: 'العمليات الجراحية المتخصصة', icon: Shield },
    { id: 4, name: 'طب النساء والولادة', description: 'رعاية صحة المرأة والحمل', icon: Heart },
    { id: 5, name: 'طب العيون', description: 'تشخيص وعلاج أمراض العيون', icon: Eye },
    { id: 6, name: 'طب الأسنان', description: 'علاج وتجميل الأسنان', icon: Star },
    { id: 7, name: 'الطب النفسي', description: 'الصحة النفسية والعلاج النفسي', icon: Heart },
    { id: 8, name: 'العلاج الطبيعي', description: 'إعادة التأهيل والعلاج الطبيعي', icon: Shield }
  ]

  const doctors_display = [
    { id: 1, name: 'د. أحمد محمد', specialty: 'طبيب باطني', experience: '15 سنة خبرة', rating: 4.9 },
    { id: 2, name: 'د. فاطمة علي', specialty: 'طبيبة أطفال', experience: '12 سنة خبرة', rating: 4.8 },
    { id: 3, name: 'د. محمد حسن', specialty: 'جراح عام', experience: '20 سنة خبرة', rating: 4.9 },
    { id: 4, name: 'د. سارة أحمد', specialty: 'طبيبة نساء وولادة', experience: '10 سنة خبرة', rating: 4.7 }
  ]

  // useEffect للتحميل الأولي
  useEffect(() => {
    if (activeSection === 'booking') {
      fetchClinics()
    }
    if (activeSection === 'admin-dashboard' && isAdmin) {
      fetchDashboardStats()
    }
  }, [activeSection, isAdmin])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
      {/* شريط التنقل */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-reverse space-x-8">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-blue-600 ml-2" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">دار التمريض الخاص</h1>
                  <p className="text-sm text-gray-600">مستشفى متخصص</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-reverse space-x-6">
              <Button
                variant={activeSection === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('home')}
                className="text-sm"
              >
                الرئيسية
              </Button>
              <Button
                variant={activeSection === 'services' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('services')}
                className="text-sm"
              >
                الخدمات
              </Button>
              <Button
                variant={activeSection === 'doctors' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('doctors')}
                className="text-sm"
              >
                الأطباء
              </Button>
              <Button
                variant={activeSection === 'contact' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('contact')}
                className="text-sm"
              >
                اتصل بنا
              </Button>
              
              {!isAdmin ? (
                <>
                  <Button
                    onClick={() => {
                      setActiveSection('booking')
                      resetBooking()
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    احجز موعد
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection('admin-login')}
                    className="text-sm"
                  >
                    الإدارة
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={activeSection === 'admin-dashboard' ? 'default' : 'ghost'}
                    onClick={() => setActiveSection('admin-dashboard')}
                    className="text-sm"
                  >
                    لوحة التحكم
                  </Button>
                  {isSuperAdmin && (
                    <Button
                      variant={activeSection === 'super-admin-settings' ? 'default' : 'ghost'}
                      onClick={() => setActiveSection('super-admin-settings')}
                      className="text-sm text-purple-600"
                    >
                      Super Admin
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleAdminLogout}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4 ml-1" />
                    تسجيل الخروج
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* رسائل النجاح والخطأ */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 ml-2" />
            {success}
            <button 
              onClick={() => setSuccess('')}
              className="mr-auto text-green-700 hover:text-green-900"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 ml-2" />
            {error}
            <button 
              onClick={() => setError('')}
              className="mr-auto text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* محتوى الصفحات */}
        {activeSection === 'home' && (
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              مرحباً بكم في <span className="text-blue-600">دار التمريض الخاص</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              نقدم أفضل الخدمات الطبية المتخصصة مع فريق من أمهر الأطباء والممرضين في بيئة طبية متطورة وآمنة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  setActiveSection('booking')
                  resetBooking()
                }}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-xl"
              >
                <Calendar className="w-5 h-5 ml-2" />
                احجز موعدك الآن
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setActiveSection('services')}
                className="px-8 py-3 text-lg rounded-xl"
              >
                <Heart className="w-5 h-5 ml-2" />
                تعرف على خدماتنا
              </Button>
            </div>
          </div>
        )}

        {/* صفحة تسجيل دخول الإدارة */}
        {activeSection === 'admin-login' && (
          <div className="max-w-md mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center">
                  <Settings className="w-6 h-6 ml-2 text-blue-600" />
                  تسجيل دخول الإدارة
                </CardTitle>
                <CardDescription className="text-center">
                  أدخل بيانات الدخول للوصول إلى لوحة التحكم
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="admin-username">اسم المستخدم</Label>
                  <Input
                    id="admin-username"
                    value={adminLoginData.username}
                    onChange={(e) => setAdminLoginData({...adminLoginData, username: e.target.value})}
                    placeholder="أدخل اسم المستخدم"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={adminLoginData.password}
                      onChange={(e) => setAdminLoginData({...adminLoginData, password: e.target.value})}
                      placeholder="أدخل كلمة المرور"
                      className="mt-1 pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handleAdminLogin}
                  disabled={!adminLoginData.username || !adminLoginData.password || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-600 mt-4">
                  <p>بيانات تجريبية:</p>
                  <p>المستخدم: admin | كلمة المرور: admin123</p>
                  <p>Super Admin: superadmin | كلمة المرور: super123</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* لوحة تحكم الإدارة مع Super Admin */}
        {activeSection === 'admin-dashboard' && isAdmin && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">لوحة التحكم</h2>
              <div className="flex items-center space-x-reverse space-x-4">
                <p className="text-gray-600">مرحباً، {adminData?.name}</p>
                {isSuperAdmin && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    Super Admin
                  </span>
                )}
              </div>
            </div>

            {/* أقسام الإدارة */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Super Admin Controls */}
              {isSuperAdmin && (
                <>
                  <Card 
                    className="bg-white/60 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveSection('super-admin-settings')}
                  >
                    <CardContent className="p-6 text-center">
                      <Palette className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">تخصيص التصميم</h3>
                      <p className="text-gray-600 text-sm">تعديل الألوان والخطوط والتصميم</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="bg-white/60 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveSection('admin-manager')}
                  >
                    <CardContent className="p-6 text-center">
                      <UserPlus className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">إدارة المديرين</h3>
                      <p className="text-gray-600 text-sm">إضافة وإدارة حسابات المديرين</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="bg-white/60 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveSection('system-info')}
                  >
                    <CardContent className="p-6 text-center">
                      <Settings className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">معلومات النظام</h3>
                      <p className="text-gray-600 text-sm">إحصائيات وأدوات النظام</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Regular Admin Controls */}
              <Card className="bg-white/60 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <CalendarPlus className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">إدارة المواعيد</h3>
                  <p className="text-gray-600 text-sm">عرض وإدارة مواعيد الأطباء</p>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-blue-600">{dashboardStats.total_bookings || 0}</p>
                    <p className="text-sm text-gray-500">إجمالي الحجوزات</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">إدارة الأطباء</h3>
                  <p className="text-gray-600 text-sm">إضافة وتعديل بيانات الأطباء</p>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-green-600">{dashboardStats.total_doctors || 0}</p>
                    <p className="text-sm text-gray-500">عدد الأطباء</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">التقارير</h3>
                  <p className="text-gray-600 text-sm">عرض التقارير والإحصائيات</p>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-orange-600">{dashboardStats.total_clinics || 0}</p>
                    <p className="text-sm text-gray-500">عدد العيادات</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* صفحة Super Admin Settings */}
        {activeSection === 'super-admin-settings' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">إعدادات Super Admin</h2>
              <Button
                variant="outline"
                onClick={() => setActiveSection('admin-dashboard')}
              >
                العودة للوحة التحكم
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* محرر التصميم */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">تخصيص التصميم</h3>
                <div className="space-y-4">
                  <div>
                    <Label>اللون الأساسي</Label>
                    <div className="flex items-center space-x-reverse space-x-2 mt-1">
                      <Input
                        type="color"
                        value={siteSettings.primaryColor}
                        onChange={(e) => setSiteSettings({...siteSettings, primaryColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={siteSettings.primaryColor}
                        onChange={(e) => setSiteSettings({...siteSettings, primaryColor: e.target.value})}
                        placeholder="#2563eb"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>اللون الثانوي</Label>
                    <div className="flex items-center space-x-reverse space-x-2 mt-1">
                      <Input
                        type="color"
                        value={siteSettings.secondaryColor}
                        onChange={(e) => setSiteSettings({...siteSettings, secondaryColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={siteSettings.secondaryColor}
                        onChange={(e) => setSiteSettings({...siteSettings, secondaryColor: e.target.value})}
                        placeholder="#10b981"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>نوع الخط</Label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                      value={siteSettings.fontFamily}
                      onChange={(e) => setSiteSettings({...siteSettings, fontFamily: e.target.value})}
                    >
                      <option value="Cairo">Cairo</option>
                      <option value="Tajawal">Tajawal</option>
                      <option value="Amiri">Amiri</option>
                      <option value="Noto Sans Arabic">Noto Sans Arabic</option>
                    </select>
                  </div>

                  <div>
                    <Label>حجم الخط الأساسي</Label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                      value={siteSettings.fontSize}
                      onChange={(e) => setSiteSettings({...siteSettings, fontSize: e.target.value})}
                    >
                      <option value="14px">صغير (14px)</option>
                      <option value="16px">متوسط (16px)</option>
                      <option value="18px">كبير (18px)</option>
                      <option value="20px">كبير جداً (20px)</option>
                    </select>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Save className="w-4 h-4 ml-2" />
                    حفظ إعدادات التصميم
                  </Button>
                </div>
              </Card>

              {/* محرر المحتوى */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">تحرير المحتوى</h3>
                <div className="space-y-4">
                  <div>
                    <Label>اسم الموقع</Label>
                    <Input
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                      placeholder="دار التمريض الخاص"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>وصف الموقع</Label>
                    <Input
                      value={siteSettings.siteDescription}
                      onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                      placeholder="مستشفى متخصص"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>عنوان الصفحة الرئيسية</Label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                      rows="2"
                      value={contentSettings.heroTitle}
                      onChange={(e) => setContentSettings({...contentSettings, heroTitle: e.target.value})}
                      placeholder="مرحباً بكم في دار التمريض الخاص"
                    />
                  </div>

                  <div>
                    <Label>وصف الصفحة الرئيسية</Label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                      rows="3"
                      value={contentSettings.heroDescription}
                      onChange={(e) => setContentSettings({...contentSettings, heroDescription: e.target.value})}
                      placeholder="نقدم أفضل الخدمات الطبية المتخصصة..."
                    />
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 ml-2" />
                    حفظ إعدادات المحتوى
                  </Button>
                </div>
              </Card>
            </div>

            {/* معاينة مباشرة */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">معاينة مباشرة</h3>
              <div 
                className="p-6 rounded-lg border-2 border-dashed border-gray-300"
                style={{
                  backgroundColor: siteSettings.primaryColor + '10',
                  fontFamily: siteSettings.fontFamily,
                  fontSize: siteSettings.fontSize
                }}
              >
                <h1 
                  className="text-3xl font-bold mb-4"
                  style={{ color: siteSettings.primaryColor }}
                >
                  {contentSettings.heroTitle}
                </h1>
                <p className="text-gray-600 mb-4">
                  {contentSettings.heroDescription}
                </p>
                <div className="flex space-x-reverse space-x-4">
                  <button 
                    className="px-6 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: siteSettings.primaryColor }}
                  >
                    احجز موعد
                  </button>
                  <button 
                    className="px-6 py-2 rounded-lg border-2 font-medium"
                    style={{ 
                      borderColor: siteSettings.secondaryColor,
                      color: siteSettings.secondaryColor
                    }}
                  >
                    تعرف على خدماتنا
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* صفحة إدارة المديرين */}
        {activeSection === 'admin-manager' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">إدارة المديرين</h2>
              <Button
                variant="outline"
                onClick={() => setActiveSection('admin-dashboard')}
              >
                العودة للوحة التحكم
              </Button>
            </div>
            <AdminManager />
          </div>
        )}

        {/* صفحة معلومات النظام */}
        {activeSection === 'system-info' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">معلومات النظام</h2>
              <Button
                variant="outline"
                onClick={() => setActiveSection('admin-dashboard')}
              >
                العودة للوحة التحكم
              </Button>
            </div>
            <SystemInfo />
          </div>
        )}

        {/* باقي الصفحات... */}
        {activeSection === 'services' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">خدماتنا الطبية</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                نقدم مجموعة شاملة من الخدمات الطبية المتخصصة على أيدي أفضل الأطباء
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {clinics_display.map((clinic) => {
                const IconComponent = clinic.icon
                return (
                  <Card key={clinic.id} className="bg-white/60 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <IconComponent className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{clinic.name}</h3>
                      <p className="text-gray-600 text-sm">{clinic.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {activeSection === 'doctors' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">فريقنا الطبي</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                أطباء متخصصون ذوو خبرة عالية ملتزمون بتقديم أفضل رعاية طبية
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors_display.map((doctor) => (
                <Card key={doctor.id} className="bg-white/60 backdrop-blur-sm border-green-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-blue-600 text-sm font-medium mb-1">{doctor.specialty}</p>
                    <p className="text-gray-600 text-xs mb-2">{doctor.experience}</p>
                    <div className="flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 mr-1">{doctor.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">اتصل بنا</h2>
              <p className="text-xl text-gray-600">
                نحن هنا لخدمتكم على مدار الساعة
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/60 backdrop-blur-sm border-blue-100">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">معلومات التواصل</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 ml-3" />
                      <div>
                        <p className="font-medium">الهاتف</p>
                        <p className="text-gray-600">+966 11 123 4567</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-blue-600 ml-3" />
                      <div>
                        <p className="font-medium">العنوان</p>
                        <p className="text-gray-600">الرياض، المملكة العربية السعودية</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-600 ml-3" />
                      <div>
                        <p className="font-medium">ساعات العمل</p>
                        <p className="text-gray-600">24/7 - على مدار الساعة</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border-green-100">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">أرسل رسالة</h3>
                  <div className="space-y-4">
                    <Input placeholder="الاسم الكامل" />
                    <Input placeholder="رقم الهاتف" />
                    <Input placeholder="البريد الإلكتروني" />
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      rows="4"
                      placeholder="اكتب رسالتك هنا..."
                    ></textarea>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      إرسال الرسالة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* صفحة الحجز */}
        {activeSection === 'booking' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">احجز موعدك</h2>
              <p className="text-xl text-gray-600">
                اختر العيادة والطبيب والموعد المناسب لك
              </p>
            </div>

            {/* مؤشر التقدم */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-reverse space-x-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= bookingStep 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 5 && (
                      <div className={`w-12 h-1 mx-2 ${
                        step < bookingStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  {bookingStep === 1 && 'اختر العيادة'}
                  {bookingStep === 2 && 'اختر الطبيب'}
                  {bookingStep === 3 && 'اختر الموعد'}
                  {bookingStep === 4 && 'أدخل بياناتك'}
                  {bookingStep === 5 && 'تأكيد الحجز'}
                </p>
              </div>
            </div>

            {/* خطوات الحجز */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardContent className="p-6">
                {/* الخطوة 1: اختيار العيادة */}
                {bookingStep === 1 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">اختر العيادة المناسبة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clinics.map((clinic) => (
                        <div
                          key={clinic.id}
                          onClick={() => handleClinicSelect(clinic.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedClinic === clinic.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <h4 className="font-medium text-gray-900">{clinic.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{clinic.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* الخطوة 2: اختيار الطبيب */}
                {bookingStep === 2 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">اختر الطبيب</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          onClick={() => handleDoctorSelect(doctor.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedDoctor === doctor.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                          <p className="text-sm text-blue-600">{doctor.specialty}</p>
                          <p className="text-sm text-gray-600 mt-1">{doctor.experience}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* الخطوة 3: اختيار الموعد */}
                {bookingStep === 3 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">اختر الموعد المناسب</h3>
                    <div className="space-y-6">
                      {Object.entries(
                        availableSlots.reduce((groups, slot) => {
                          const date = slot.date
                          if (!groups[date]) groups[date] = []
                          groups[date].push(slot)
                          return groups
                        }, {})
                      ).map(([date, slots]) => (
                        <div key={date}>
                          <h4 className="font-medium text-gray-900 mb-3">
                            {new Date(date).toLocaleDateString('ar-SA', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h4>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {slots.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot.id)}
                                disabled={!slot.is_available}
                                className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                                  selectedSlot === slot.id
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : slot.is_available
                                    ? 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* الخطوة 4: بيانات المريض */}
                {bookingStep === 4 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">أدخل بياناتك</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patient-name">الاسم الكامل *</Label>
                        <Input
                          id="patient-name"
                          value={patientData.name}
                          onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                          placeholder="أدخل الاسم الكامل"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="patient-phone">رقم الهاتف *</Label>
                        <Input
                          id="patient-phone"
                          value={patientData.phone}
                          onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="patient-email">البريد الإلكتروني</Label>
                        <Input
                          id="patient-email"
                          type="email"
                          value={patientData.email}
                          onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                          placeholder="example@email.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="patient-age">العمر</Label>
                        <Input
                          id="patient-age"
                          type="number"
                          value={patientData.age}
                          onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                          placeholder="25"
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="patient-gender">الجنس</Label>
                        <select
                          id="patient-gender"
                          value={patientData.gender}
                          onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                        >
                          <option value="">اختر الجنس</option>
                          <option value="male">ذكر</option>
                          <option value="female">أنثى</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* الخطوة 5: تأكيد الحجز */}
                {bookingStep === 5 && bookingResult && (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">تم حجز موعدك بنجاح!</h3>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4">تفاصيل الحجز</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>رقم الحجز:</span>
                          <span className="font-medium">{bookingResult.booking_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>اسم المريض:</span>
                          <span className="font-medium">{bookingResult.patient_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>العيادة:</span>
                          <span className="font-medium">{bookingResult.clinic_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الطبيب:</span>
                          <span className="font-medium">{bookingResult.doctor_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>التاريخ:</span>
                          <span className="font-medium">{bookingResult.appointment_date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الوقت:</span>
                          <span className="font-medium">{bookingResult.appointment_time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-blue-800">
                        <strong>ملاحظة:</strong> سيتم التواصل معك عبر الواتساب لتأكيد الموعد خلال ساعات العمل الرسمية.
                        يرجى الاحتفاظ برقم الحجز للمراجعة.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => {
                          const message = `مرحباً، أود تأكيد حجز الموعد رقم: ${bookingResult.booking_number}`
                          window.open(`https://wa.me/966501234567?text=${encodeURIComponent(message)}`, '_blank')
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        تأكيد عبر الواتساب
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveSection('home')
                          resetBooking()
                        }}
                      >
                        العودة للرئيسية
                      </Button>
                    </div>
                  </div>
                )}

                {/* أزرار التنقل */}
                {bookingStep < 5 && (
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={bookingStep === 1}
                    >
                      السابق
                    </Button>
                    
                    {bookingStep < 4 ? (
                      <Button
                        onClick={nextStep}
                        disabled={
                          (bookingStep === 1 && !selectedClinic) ||
                          (bookingStep === 2 && !selectedDoctor) ||
                          (bookingStep === 3 && !selectedSlot)
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        التالي
                      </Button>
                    ) : (
                      <Button
                        onClick={handleBooking}
                        disabled={!patientData.name || !patientData.phone || loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin ml-2" />
                            جاري الحجز...
                          </>
                        ) : (
                          'تأكيد الحجز'
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* تذييل الصفحة */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-blue-400 ml-2" />
                <div>
                  <h3 className="text-xl font-bold">دار التمريض الخاص</h3>
                  <p className="text-gray-400 text-sm">مستشفى متخصص</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                نقدم أفضل الخدمات الطبية المتخصصة مع فريق من أمهر الأطباء والممرضين
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">خدماتنا</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>الطب الباطني</li>
                <li>طب الأطفال</li>
                <li>الجراحة العامة</li>
                <li>طب النساء والولادة</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setActiveSection('home')}>الرئيسية</button></li>
                <li><button onClick={() => setActiveSection('services')}>الخدمات</button></li>
                <li><button onClick={() => setActiveSection('doctors')}>الأطباء</button></li>
                <li><button onClick={() => setActiveSection('contact')}>اتصل بنا</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 ml-2" />
                  <span>+966 11 123 4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 ml-2" />
                  <span>الرياض، السعودية</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 دار التمريض الخاص. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// مكون إدارة المديرين
const AdminManager = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">إدارة حسابات المديرين</h3>
      <p className="text-gray-600 mb-6">
        يمكنك إضافة وإدارة حسابات المديرين وتحديد صلاحياتهم.
      </p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="اسم المستخدم" />
          <Input placeholder="الاسم الكامل" />
          <Input placeholder="البريد الإلكتروني" />
          <Input type="password" placeholder="كلمة المرور" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">نوع الحساب</label>
          <select className="w-full p-2 border border-gray-300 rounded-lg">
            <option>مدير عادي</option>
            <option>مدير متقدم</option>
            <option>Super Admin</option>
          </select>
        </div>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 ml-2" />
            إضافة مدير جديد
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="font-medium mb-4">المديرين الحاليين</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">admin</p>
              <p className="text-sm text-gray-600">مدير النظام</p>
            </div>
            <div className="flex items-center space-x-reverse space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">نشط</span>
              <Button variant="outline" size="sm">تعديل</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">superadmin</p>
              <p className="text-sm text-gray-600">Super Admin</p>
            </div>
            <div className="flex items-center space-x-reverse space-x-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Super Admin</span>
              <Button variant="outline" size="sm">تعديل</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// مكون معلومات النظام
const SystemInfo = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">معلومات النظام</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">إحصائيات عامة</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>إجمالي الحجوزات:</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between">
                <span>عدد الأطباء:</span>
                <span className="font-medium">15</span>
              </div>
              <div className="flex justify-between">
                <span>عدد العيادات:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span>المديرين النشطين:</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">معلومات تقنية</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>إصدار النظام:</span>
                <span className="font-medium">v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span>قاعدة البيانات:</span>
                <span className="font-medium">SQLite</span>
              </div>
              <div className="flex justify-between">
                <span>آخر تحديث:</span>
                <span className="font-medium">2024-06-10</span>
              </div>
              <div className="flex justify-between">
                <span>حالة النظام:</span>
                <span className="font-medium text-green-600">يعمل بشكل طبيعي</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">أدوات النظام</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="p-4 h-auto flex-col">
            <Database className="w-6 h-6 mb-2" />
            <span>نسخ احتياطي</span>
          </Button>
          
          <Button variant="outline" className="p-4 h-auto flex-col">
            <Download className="w-6 h-6 mb-2" />
            <span>تصدير البيانات</span>
          </Button>
          
          <Button variant="outline" className="p-4 h-auto flex-col">
            <RefreshCw className="w-6 h-6 mb-2" />
            <span>إعادة تشغيل النظام</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default App

