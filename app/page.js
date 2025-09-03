'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Upload, 
  Brain, 
  PieChart, 
  TrendingUp, 
  CreditCard, 
  Smartphone, 
  Mail, 
  FileText, 
  Target, 
  Bell, 
  Settings,
  DollarSign,
  Calendar,
  Filter,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Users,
  BarChart3
} from 'lucide-react'

export default function ExpenseTracker() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    merchant: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Sample transactions for demo
  const demoTransactions = [
    {
      id: '1',
      description: 'SWIGGY FOOD DELIVERY',
      amount: -450,
      merchant: 'Swiggy',
      date: '2024-06-15',
      category: 'Food & Dining',
      confidence: 95,
      explanation: 'Food delivery service transaction',
      source: 'SMS'
    },
    {
      id: '2', 
      description: 'SALARY CREDIT',
      amount: 75000,
      merchant: 'TCS Ltd',
      date: '2024-06-01',
      category: 'Income',
      confidence: 100,
      explanation: 'Monthly salary deposit',
      source: 'Email'
    },
    {
      id: '3',
      description: 'UBER RIDE',
      amount: -180,
      merchant: 'Uber',
      date: '2024-06-14',
      category: 'Transportation',
      confidence: 98,
      explanation: 'Ride-sharing service',
      source: 'SMS'
    },
    {
      id: '4',
      description: 'AMAZON PURCHASE',
      amount: -2299,
      merchant: 'Amazon',
      date: '2024-06-13',
      category: 'Shopping',
      confidence: 90,
      explanation: 'E-commerce purchase',
      source: 'Email'
    },
    {
      id: '5',
      description: 'NETFLIX SUBSCRIPTION',
      amount: -799,
      merchant: 'Netflix',
      date: '2024-06-12',
      category: 'Entertainment',
      confidence: 100,
      explanation: 'Streaming service subscription',
      source: 'Email'
    },
    {
      id: '6',
      description: 'METRO CARD RECHARGE',
      amount: -500,
      merchant: 'Delhi Metro',
      date: '2024-06-11',
      category: 'Transportation',
      confidence: 95,
      explanation: 'Public transport card recharge',
      source: 'Manual'
    },
    {
      id: '7',
      description: 'ZOMATO GOLD',
      amount: -399,
      merchant: 'Zomato',
      date: '2024-06-10',
      category: 'Food & Dining',
      confidence: 92,
      explanation: 'Food delivery subscription',
      source: 'Email'
    }
  ]

  const categoryStats = [
    { name: 'Food & Dining', amount: 15000, color: 'bg-red-500', percentage: 30 },
    { name: 'Shopping', amount: 12000, color: 'bg-purple-500', percentage: 24 },
    { name: 'Transportation', amount: 8000, color: 'bg-blue-500', percentage: 16 },
    { name: 'Entertainment', amount: 6000, color: 'bg-yellow-500', percentage: 12 },
    { name: 'Bills & Utilities', amount: 5000, color: 'bg-gray-500', percentage: 10 },
    { name: 'Others', amount: 4000, color: 'bg-green-500', percentage: 8 },
  ]

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 border-green-300'
    if (confidence >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Math.abs(amount))
  }

  const handleAddTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount) return

    setLoading(true)
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newTransaction.description,
          amount: parseFloat(newTransaction.amount),
          merchant: newTransaction.merchant,
          date: newTransaction.date,
          autoCategorize: true
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setTransactions([result.transaction, ...transactions])
        setNewTransaction({
          description: '',
          amount: '',
          merchant: '',
          date: new Date().toISOString().split('T')[0]
        })
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    setUploadFile(file)

    // Simulate file processing with more realistic demo data
    setTimeout(() => {
      const mockTransactions = [
        {
          id: 'csv_1',
          description: 'HDFC ATM WITHDRAWAL',
          amount: -5000,
          merchant: 'HDFC Bank',
          date: '2024-06-10',
          category: 'Transfer',
          confidence: 85,
          explanation: 'ATM cash withdrawal transaction',
          source: 'CSV Upload'
        },
        {
          id: 'csv_2',
          description: 'GROCERY SHOPPING',
          amount: -3250,
          merchant: 'Big Bazaar',
          date: '2024-06-09',
          category: 'Food & Dining',
          confidence: 88,
          explanation: 'Grocery and household items',
          source: 'CSV Upload'
        },
        {
          id: 'csv_3',
          description: 'FUEL PAYMENT',
          amount: -2800,
          merchant: 'Indian Oil',
          date: '2024-06-08',
          category: 'Transportation',
          confidence: 95,
          explanation: 'Vehicle fuel purchase',
          source: 'CSV Upload'
        }
      ]
      
      setTransactions([...mockTransactions, ...transactions])
      setLoading(false)
      setUploadFile(null)
    }, 3000)
  }

  // Landing page component
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Where Did My Money Go?
              </span>
            </div>
            <Button 
              onClick={() => setCurrentView('dashboard')} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
            >
              Launch App
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Smart Expense Tracking for <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Students & Young Professionals
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Automatically categorize expenses using AI, track spending patterns, and get insights 
                from SMS, emails, and file uploads. Built specifically for India's financial ecosystem.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Start Tracking Free
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-xl"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-600">Everything you need to manage your finances smarter</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="inline-flex p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">AI-Powered Categorization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automatically categorize transactions with 95%+ accuracy using advanced ML models. 
                  Save hours of manual work.
                </p>
              </Card>
              
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="inline-flex p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-6">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">SMS & Email Integration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Import transactions from bank SMS and email notifications automatically. 
                  Works with all major Indian banks.
                </p>
              </Card>
              
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="inline-flex p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Beautiful Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Visualize spending patterns with interactive charts and insights. 
                  Make better financial decisions.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-blue-100">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">₹50Cr+</div>
                <div className="text-blue-100">Transactions Tracked</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.8★</div>
                <div className="text-blue-100">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Where Did My Money Go?</span>
            </div>
            <p className="text-gray-600 mb-8">Built with ❤️ for Indian students and young professionals</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700">Terms of Service</a>
              <a href="#" className="hover:text-gray-700">Support</a>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Main app interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl cursor-pointer"
              onClick={() => setCurrentView('landing')}
            >
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Expense Tracker</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              ₹50,000 Budget Remaining
            </Badge>
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={currentView} onValueChange={setCurrentView} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Upload
            </TabsTrigger>
            <TabsTrigger value="rules" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Rules
            </TabsTrigger>
            <TabsTrigger value="budgets" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Budgets
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            <div className="grid gap-6">
              {/* Stats Overview */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <ArrowDownRight className="h-4 w-4 mr-2 text-red-500" />
                      This Month Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">₹42,000</div>
                    <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-2 text-green-500" />
                      Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">₹75,000</div>
                    <p className="text-sm text-gray-500 mt-1">Salary & freelance</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <p className="text-sm text-gray-500 mt-1">95% auto-categorized</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                      <Target className="h-4 w-4 mr-2 text-purple-500" />
                      Savings Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">44%</div>
                    <p className="text-sm text-gray-500 mt-1">₹33,000 saved</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                      Spending by Category
                    </CardTitle>
                    <CardDescription>This month's expense breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryStats.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                            <span className="font-medium text-sm">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm">{formatCurrency(category.amount)}</div>
                            <div className="text-xs text-gray-500">{category.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest transactions with AI categorization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...transactions, ...demoTransactions].slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                              {transaction.source === 'SMS' && <Smartphone className="h-4 w-4 text-blue-600" />}
                              {transaction.source === 'Email' && <Mail className="h-4 w-4 text-purple-600" />}
                              {transaction.source === 'CSV Upload' && <FileText className="h-4 w-4 text-orange-600" />}
                              {transaction.source === 'Manual' && <CreditCard className="h-4 w-4 text-gray-600" />}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{transaction.description}</p>
                              <p className="text-xs text-gray-500">{transaction.merchant} • {transaction.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">{transaction.category}</Badge>
                              <Badge className={`text-xs ${getConfidenceColor(transaction.confidence)}`}>
                                {transaction.confidence}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions">
            <div className="space-y-6">
              {/* Add Transaction */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-blue-600" />
                    Add New Transaction
                  </CardTitle>
                  <CardDescription>Manually add a transaction with AI-powered categorization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        placeholder="e.g., SWIGGY FOOD DELIVERY"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        placeholder="Enter amount"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="merchant">Merchant</Label>
                      <Input
                        id="merchant"
                        value={newTransaction.merchant}
                        onChange={(e) => setNewTransaction({...newTransaction, merchant: e.target.value})}
                        placeholder="Merchant name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleAddTransaction} 
                    disabled={loading || !newTransaction.description || !newTransaction.amount}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        AI Categorizing...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Add & Categorize with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Transaction List */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-green-600" />
                        All Transactions
                      </CardTitle>
                      <CardDescription>Complete transaction history with AI insights</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-1" />
                        Search
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...transactions, ...demoTransactions].map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                            {transaction.source === 'SMS' && <Smartphone className="h-5 w-5 text-blue-600" />}
                            {transaction.source === 'Email' && <Mail className="h-5 w-5 text-purple-600" />}
                            {transaction.source === 'CSV Upload' && <FileText className="h-5 w-5 text-orange-600" />}
                            {transaction.source === 'Manual' && <CreditCard className="h-5 w-5 text-gray-600" />}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                              {transaction.merchant} • {transaction.date} • {transaction.source}
                            </p>
                            {transaction.explanation && (
                              <p className="text-xs text-gray-400 mt-1 max-w-md">{transaction.explanation}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-lg ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">{transaction.category}</Badge>
                            <Badge className={`text-xs ${getConfidenceColor(transaction.confidence)}`}>
                              AI {transaction.confidence}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Upload */}
          <TabsContent value="upload">
            <div className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-purple-600" />
                    Upload & Process Transactions
                  </CardTitle>
                  <CardDescription>Import transactions from CSV files, bank statements, or connect email/SMS</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gradient-to-br from-gray-50 to-blue-50">
                    {loading ? (
                      <div className="space-y-4">
                        <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
                        <p className="text-xl font-medium">Processing {uploadFile?.name}</p>
                        <p className="text-gray-500">AI is analyzing and categorizing your transactions...</p>
                        <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="inline-flex p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
                          <Upload className="h-12 w-12 text-white" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-900">Upload your transaction file</p>
                          <p className="text-gray-500 mt-2">Supports CSV, PDF, Excel files up to 10MB</p>
                        </div>
                        <div>
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".csv,.pdf,.xlsx,.xls"
                            onChange={handleFileUpload}
                          />
                          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            <label htmlFor="file-upload" className="cursor-pointer">
                              <Upload className="mr-2 h-5 w-5" />
                              Choose File to Upload
                            </label>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
                      <div className="inline-flex p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-4">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">CSV & Excel Files</h3>
                      <p className="text-sm text-gray-600">Bank statement exports and spreadsheets</p>
                    </Card>
                    
                    <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-0">
                      <div className="inline-flex p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mb-4">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email Integration</h3>
                      <p className="text-sm text-gray-600">Auto-import from Gmail bank notifications</p>
                    </Card>
                    
                    <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-0">
                      <div className="inline-flex p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl mb-4">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">SMS Parsing</h3>
                      <p className="text-sm text-gray-600">Extract data from bank SMS alerts</p>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Upload History */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-orange-600" />
                    Processing History
                  </CardTitle>
                  <CardDescription>Recent file uploads and processing status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-medium">bank_statement_june2024.csv</p>
                          <p className="text-sm text-gray-500">Processed 67 transactions • AI categorized 63 • 2 hours ago</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                        <div>
                          <p className="font-medium">credit_card_statement.pdf</p>
                          <p className="text-sm text-gray-500">Processing 124 transactions with AI categorization...</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">Processing</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                        <div>
                          <p className="font-medium">incomplete_data.xlsx</p>
                          <p className="text-sm text-gray-500">Failed - Invalid format or missing columns • 1 day ago</p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-300">Failed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rules */}
          <TabsContent value="rules">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-indigo-600" />
                  Smart Categorization Rules
                </CardTitle>
                <CardDescription>Create custom rules to automatically categorize transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label>If description contains</Label>
                      <Input placeholder="e.g., SWIGGY, ZOMATO, UBER EATS" className="mt-1" />
                    </div>
                    <div>
                      <Label>Then categorize as</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food & Dining</SelectItem>
                          <SelectItem value="transport">Transportation</SelectItem>
                          <SelectItem value="shopping">Shopping</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                        Add Rule
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4 text-gray-900">Active Rules</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div>
                          <p className="font-medium">Food Delivery → Food & Dining</p>
                          <p className="text-sm text-gray-500">Matches: SWIGGY, ZOMATO, UBER EATS, DUNZO</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">78 matches</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div>
                          <p className="font-medium">Transport Services → Transportation</p>
                          <p className="text-sm text-gray-500">Matches: UBER, OLA, METRO, RAPIDO</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">42 matches</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div>
                          <p className="font-medium">E-commerce → Shopping</p>
                          <p className="text-sm text-gray-500">Matches: AMAZON, FLIPKART, MYNTRA, AJIO</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">89 matches</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budgets */}
          <TabsContent value="budgets">
            <div className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-emerald-600" />
                    Monthly Budget Tracker
                  </CardTitle>
                  <CardDescription>Set spending limits and receive smart alerts when approaching limits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label>Category</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="food">Food & Dining</SelectItem>
                            <SelectItem value="transport">Transportation</SelectItem>
                            <SelectItem value="shopping">Shopping</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Monthly Limit (₹)</Label>
                        <Input type="number" placeholder="15000" className="mt-1" />
                      </div>
                      <div>
                        <Label>Alert at (%)</Label>
                        <Input type="number" placeholder="80" className="mt-1" />
                      </div>
                      <div className="flex items-end">
                        <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                          Set Budget
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4 text-gray-900">Current Budget Status</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-6 bg-gradient-to-r from-orange-50 to-red-50">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-gray-900">Food & Dining</span>
                            <span className="text-sm text-gray-600">₹15,000 / ₹20,000</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-orange-700 font-medium">75% used - Approaching limit</p>
                            <Badge className="bg-orange-100 text-orange-800 border-orange-300">⚠️ Warning</Badge>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-gray-900">Transportation</span>
                            <span className="text-sm text-gray-600">₹8,000 / ₹15,000</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{width: '53%'}}></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-green-700 font-medium">53% used - On track</p>
                            <Badge className="bg-green-100 text-green-800 border-green-300">✅ Good</Badge>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-6 bg-gradient-to-r from-red-50 to-pink-50">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-gray-900">Shopping</span>
                            <span className="text-sm text-gray-600">₹12,500 / ₹10,000</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full" style={{width: '100%'}}></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-red-700 font-medium">125% used - Over budget!</p>
                            <Badge className="bg-red-100 text-red-800 border-red-300">🚨 Alert</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Smart Alerts */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-yellow-600" />
                    Smart Budget Alerts
                  </CardTitle>
                  <CardDescription>AI-powered spending notifications and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 border rounded-lg bg-red-50">
                      <div className="p-2 bg-red-100 rounded-full">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-red-800">Shopping budget exceeded</p>
                        <p className="text-sm text-red-600 mt-1">
                          You've spent ₹12,500 out of your ₹10,000 monthly budget. Consider reducing shopping expenses.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 border rounded-lg bg-orange-50">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Bell className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-orange-800">Food budget approaching limit</p>
                        <p className="text-sm text-orange-600 mt-1">
                          You've used 75% of your food budget. ₹5,000 remaining for this month.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">5 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 border rounded-lg bg-blue-50">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Info className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-800">Weekly spending insight</p>
                        <p className="text-sm text-blue-600 mt-1">
                          You spent ₹8,500 this week, 20% more than last week. Most increase was in entertainment.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">1 day ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 border rounded-lg bg-green-50">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-800">Great job on transportation!</p>
                        <p className="text-sm text-green-600 mt-1">
                          You're 47% under your transportation budget. Keep up the good work!
                        </p>
                        <p className="text-xs text-gray-500 mt-2">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}