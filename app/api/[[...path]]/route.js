import { NextResponse } from 'next/server'

// Mock database for demo purposes
let mockTransactions = [
  {
    id: '1',
    userId: 'demo_user_1',
    description: 'SWIGGY FOOD DELIVERY',
    amount: -450,
    merchant: 'Swiggy',
    transactionDate: '2024-01-15',
    categoryId: 'cat_food_dining',
    category: 'Food & Dining',
    type: 'expense',
    dedupeHash: 'hash_swiggy_450_20240115',
    source: 'sms',
    mlCategory: 'Food & Dining',
    mlConfidence: 95,
    mlExplanation: 'Food delivery service transaction',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: 'demo_user_1', 
    description: 'SALARY CREDIT',
    amount: 75000,
    merchant: 'TCS Ltd',
    transactionDate: '2024-01-01',
    categoryId: 'cat_income',
    category: 'Income',
    type: 'income',
    dedupeHash: 'hash_salary_75000_20240101',
    source: 'email',
    mlCategory: 'Income',
    mlConfidence: 100,
    mlExplanation: 'Monthly salary deposit',
    createdAt: new Date().toISOString()
  }
]

let mockCategories = [
  { id: 'cat_food_dining', name: 'Food & Dining', color: '#ef4444' },
  { id: 'cat_shopping', name: 'Shopping', color: '#8b5cf6' },
  { id: 'cat_transportation', name: 'Transportation', color: '#06b6d4' },
  { id: 'cat_travel', name: 'Travel', color: '#10b981' },
  { id: 'cat_entertainment', name: 'Entertainment', color: '#f59e0b' },
  { id: 'cat_bills_utilities', name: 'Bills & Utilities', color: '#6b7280' },
  { id: 'cat_health_fitness', name: 'Health & Fitness', color: '#ec4899' },
  { id: 'cat_education', name: 'Education', color: '#3b82f6' },
  { id: 'cat_personal_care', name: 'Personal Care', color: '#a855f7' },
  { id: 'cat_home', name: 'Home', color: '#059669' },
  { id: 'cat_gifts_donations', name: 'Gifts & Donations', color: '#dc2626' },
  { id: 'cat_business', name: 'Business Expenses', color: '#7c3aed' },
  { id: 'cat_income', name: 'Income', color: '#16a34a' },
  { id: 'cat_transfer', name: 'Transfer', color: '#64748b' },
  { id: 'cat_other', name: 'Other', color: '#78716c' }
]

// AI Categorization function using Emergent LLM
async function categorizeTransaction(description, amount, merchant = null) {
  try {
    // For demo purposes, we'll use rule-based categorization
    // In production, this would call the AI service
    
    const desc = description.toLowerCase()
    let category = 'Other'
    let confidence = 60
    let explanation = 'Basic rule-based categorization'

    if (desc.includes('swiggy') || desc.includes('zomato') || desc.includes('food') || desc.includes('restaurant')) {
      category = 'Food & Dining'
      confidence = 95
      explanation = 'Food delivery or dining transaction'
    } else if (desc.includes('uber') || desc.includes('ola') || desc.includes('metro') || desc.includes('taxi')) {
      category = 'Transportation'
      confidence = 90
      explanation = 'Transportation service'
    } else if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('shopping') || desc.includes('myntra')) {
      category = 'Shopping'
      confidence = 88
      explanation = 'E-commerce or retail purchase'
    } else if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('movie') || desc.includes('entertainment')) {
      category = 'Entertainment'
      confidence = 92
      explanation = 'Entertainment or subscription service'
    } else if (desc.includes('salary') || desc.includes('income') || amount > 10000) {
      category = 'Income'
      confidence = 98
      explanation = 'Income or salary transaction'
    } else if (desc.includes('electricity') || desc.includes('gas') || desc.includes('water') || desc.includes('bill')) {
      category = 'Bills & Utilities'
      confidence = 85
      explanation = 'Utility bill payment'
    }

    return {
      category,
      confidence,
      explanation
    }
  } catch (error) {
    console.error('Error in AI categorization:', error)
    return {
      category: 'Other',
      confidence: 0,
      explanation: 'Error during categorization'
    }
  }
}

// Generate unique hash for deduplication
function generateDedupeHash(description, amount, date) {
  const cleanDesc = description.replace(/\s+/g, '').toLowerCase()
  const cleanAmount = Math.abs(amount).toString()
  const cleanDate = date.replace(/-/g, '')
  return `hash_${cleanDesc}_${cleanAmount}_${cleanDate}_${Date.now()}`
}

export async function GET(request) {
  try {
    const { pathname, searchParams } = new URL(request.url)
    
    // Parse path segments
    const pathSegments = pathname.split('/').filter(Boolean).slice(1) // Remove 'api'
    
    // Routes
    if (pathSegments[0] === 'transactions') {
      if (pathSegments[1] === 'categories') {
        // GET /api/transactions/categories
        return NextResponse.json({ categories: mockCategories })
      }
      
      if (pathSegments[1] === 'summary') {
        // GET /api/transactions/summary
        const categorySum = mockCategories.map(cat => {
          const categoryTransactions = mockTransactions.filter(t => t.categoryId === cat.id && t.type === 'expense')
          const total = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
          const count = categoryTransactions.length
          const avgConfidence = count > 0 
            ? categoryTransactions.reduce((sum, t) => sum + (t.mlConfidence || 0), 0) / count 
            : 0
          
          return {
            category: cat.name,
            total,
            count,
            avg_confidence: avgConfidence
          }
        }).filter(item => item.total > 0)
        
        return NextResponse.json({ summary: categorySum })
      }
      
      // GET /api/transactions (with filters)
      let filteredTransactions = [...mockTransactions]
      
      const category = searchParams.get('category')
      const startDate = searchParams.get('start_date')
      const endDate = searchParams.get('end_date')
      const minConfidence = searchParams.get('min_confidence')
      const limit = parseInt(searchParams.get('limit')) || 50
      const skip = parseInt(searchParams.get('skip')) || 0
      
      if (category) {
        filteredTransactions = filteredTransactions.filter(t => t.category === category)
      }
      
      if (startDate) {
        filteredTransactions = filteredTransactions.filter(t => t.transactionDate >= startDate)
      }
      
      if (endDate) {
        filteredTransactions = filteredTransactions.filter(t => t.transactionDate <= endDate)
      }
      
      if (minConfidence) {
        filteredTransactions = filteredTransactions.filter(t => (t.mlConfidence || 0) >= parseFloat(minConfidence))
      }
      
      // Sort by date (newest first)
      filteredTransactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
      
      // Apply pagination
      const paginatedTransactions = filteredTransactions.slice(skip, skip + limit)
      
      return NextResponse.json({
        transactions: paginatedTransactions,
        count: paginatedTransactions.length,
        total: filteredTransactions.length
      })
    }
    
    if (pathSegments[0] === 'categorize') {
      // This should be a POST, but handling GET for testing
      const description = searchParams.get('description') || 'Test transaction'
      const amount = parseFloat(searchParams.get('amount')) || 100
      const merchant = searchParams.get('merchant')
      
      const categorization = await categorizeTransaction(description, amount, merchant)
      
      return NextResponse.json({
        transaction: { description, amount, merchant },
        categorization
      })
    }
    
    // Default health check
    return NextResponse.json({ 
      message: 'Expense Tracker API is running',
      timestamp: new Date().toISOString(),
      endpoints: [
        'GET /api/transactions',
        'POST /api/transactions', 
        'GET /api/transactions/categories',
        'GET /api/transactions/summary',
        'POST /api/transactions/categorize'
      ]
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message }, 
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { pathname } = new URL(request.url)
    const pathSegments = pathname.split('/').filter(Boolean).slice(1)
    
    if (pathSegments[0] === 'transactions') {
      if (pathSegments[1] === 'categorize') {
        // POST /api/transactions/categorize
        const { description, amount, merchant, date } = body
        
        if (!description || amount === undefined) {
          return NextResponse.json(
            { error: 'Description and amount are required' }, 
            { status: 400 }
          )
        }
        
        const categorization = await categorizeTransaction(description, amount, merchant)
        
        return NextResponse.json({
          transaction: { description, amount, merchant, date },
          categorization
        })
      }
      
      // POST /api/transactions (create new transaction)
      const { description, amount, merchant, date, userId = 'demo_user_1', autoCategorize = true } = body
      
      if (!description || amount === undefined) {
        return NextResponse.json(
          { error: 'Description and amount are required' }, 
          { status: 400 }
        )
      }
      
      const transactionDate = date || new Date().toISOString().split('T')[0]
      let categorization = null
      
      if (autoCategorize) {
        categorization = await categorizeTransaction(description, amount, merchant)
      }
      
      const newTransaction = {
        id: `txn_${Date.now()}`,
        userId,
        description,
        amount: parseFloat(amount),
        merchant: merchant || null,
        transactionDate,
        categoryId: categorization ? `cat_${categorization.category.toLowerCase().replace(/\s+/g, '_').replace(/&/g, '')}` : 'cat_other',
        category: categorization?.category || 'Other',
        type: amount > 0 ? 'income' : 'expense',
        dedupeHash: generateDedupeHash(description, amount, transactionDate),
        source: 'manual',
        mlCategory: categorization?.category,
        mlConfidence: categorization?.confidence,
        mlExplanation: categorization?.explanation,
        createdAt: new Date().toISOString()
      }
      
      // Add to mock database
      mockTransactions.unshift(newTransaction)
      
      return NextResponse.json({
        success: true,
        transaction: newTransaction
      })
    }
    
    return NextResponse.json(
      { error: 'Endpoint not found' }, 
      { status: 404 }
    )
    
  } catch (error) {
    console.error('API POST Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message }, 
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { pathname } = new URL(request.url)
    const pathSegments = pathname.split('/').filter(Boolean).slice(1)
    
    if (pathSegments[0] === 'transactions' && pathSegments[2] === 'category') {
      // PUT /api/transactions/{id}/category
      const transactionId = pathSegments[1]
      const { category, confidence = 100, explanation = 'Manually categorized' } = body
      
      const transactionIndex = mockTransactions.findIndex(t => t.id === transactionId)
      
      if (transactionIndex === -1) {
        return NextResponse.json(
          { error: 'Transaction not found' }, 
          { status: 404 }
        )
      }
      
      // Update transaction
      mockTransactions[transactionIndex] = {
        ...mockTransactions[transactionIndex],
        category,
        mlCategory: category,
        mlConfidence: confidence,
        mlExplanation: explanation,
        userCorrected: true,
        updatedAt: new Date().toISOString()
      }
      
      return NextResponse.json({
        success: true,
        transaction: mockTransactions[transactionIndex]
      })
    }
    
    return NextResponse.json(
      { error: 'Endpoint not found' }, 
      { status: 404 }
    )
    
  } catch (error) {
    console.error('API PUT Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { pathname } = new URL(request.url)
    const pathSegments = pathname.split('/').filter(Boolean).slice(1)
    
    if (pathSegments[0] === 'transactions' && pathSegments[1]) {
      // DELETE /api/transactions/{id}
      const transactionId = pathSegments[1]
      
      const transactionIndex = mockTransactions.findIndex(t => t.id === transactionId)
      
      if (transactionIndex === -1) {
        return NextResponse.json(
          { error: 'Transaction not found' }, 
          { status: 404 }
        )
      }
      
      // Remove transaction
      const deletedTransaction = mockTransactions.splice(transactionIndex, 1)[0]
      
      return NextResponse.json({
        success: true,
        message: 'Transaction deleted successfully',
        transaction: deletedTransaction
      })
    }
    
    return NextResponse.json(
      { error: 'Endpoint not found' }, 
      { status: 404 }
    )
    
  } catch (error) {
    console.error('API DELETE Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message }, 
      { status: 500 }
    )
  }
}