"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Loader2, ScanBarcode, Package, ArrowUpRight, 
  ArrowDownLeft, LogOut, UserCheck, AlertCircle 
} from "lucide-react"

// Types
interface Item {
  id: number
  name: string
  quantity: number
  price: number
}

interface Student {
  student_name: string
  student_id: string
}

export default function Dashboard() {
  const router = useRouter()
  
  // State
  const [items, setItems] = useState<Item[]>([])
  const [student, setStudent] = useState<Student | null>(null)
  const [barcode, setBarcode] = useState("")
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [actionType, setActionType] = useState<"borrow" | "return" | null>(null)
  const [quantity, setQuantity] = useState(1)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  // 1. Initial Data Load
  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items')
      if (res.ok) setItems(await res.json())
    } catch (e) {
      setError("Failed to load inventory")
    }
  }

  // 2. Handle Logout
  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    router.push("/login")
  }

  // 3. Scan Student Barcode
  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcode.trim()) return

    setIsLoading(true)
    setError(null)
    setStudent(null)

    try {
      const res = await fetch(`/api/users/${encodeURIComponent(barcode.trim())}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Scan failed")

      setStudent(data)
      setBarcode("")
      setSuccess(`Student Identified: ${data.student_name}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed")
    } finally {
      setIsLoading(false)
    }
  }

  // 4. Handle Borrow/Return Transaction
  const handleTransaction = async () => {
    if (!student || !selectedItem || !actionType) return

    setIsLoading(true)
    setError(null)

    try {
      const endpoint = actionType === "borrow" ? "/api/borrow-item" : "/api/return-item"
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.student_id,
          itemName: selectedItem.name,
          quantity: quantity
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Transaction failed")

      // Success!
      setSuccess(`Successfully ${actionType}ed ${quantity}x ${selectedItem.name}`)
      setSelectedItem(null)
      setActionType(null)
      setQuantity(1)
      fetchItems() // Refresh inventory numbers

    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lab Inventory</h1>
          <p className="text-muted-foreground">Manage loans and returns</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/verify')}>
            <UserCheck className="mr-2 h-4 w-4" />
            Verify Students
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT PANEL: Student Scanner */}
        <div className="lg:col-span-1 space-y-6">
          <Card className={student ? "border-green-500 ring-1 ring-green-500" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanBarcode className="h-5 w-5" />
                Student Identification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!student ? (
                <form onSubmit={handleScan} className="space-y-2">
                  <Input 
                    ref={barcodeInputRef}
                    placeholder="Scan Student ID..." 
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    autoFocus
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Identify Student"}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4 animate-in fade-in">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-bold uppercase">Active Session</p>
                    <h2 className="text-2xl font-bold">{student.student_name}</h2>
                    <p className="font-mono text-gray-500">{student.student_id}</p>
                  </div>
                  <Button variant="outline" onClick={() => setStudent(null)} className="w-full">
                    End Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-50 text-green-900 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* RIGHT PANEL: Inventory Grid */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-150px)] flex flex-col">
            <CardHeader>
              <CardTitle>Available Items</CardTitle>
              <CardDescription>Select an item to borrow or return</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => student && setSelectedItem(item)}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md
                      ${selectedItem?.id === item.id ? 'ring-2 ring-primary bg-primary/5' : 'bg-white'}
                      ${!student ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Package className="h-5 w-5 text-gray-400" />
                      <Badge variant={item.quantity > 0 ? "secondary" : "destructive"}>
                        x{item.quantity}
                      </Badge>
                    </div>
                    <p className="font-semibold truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            
            {/* ACTION FOOTER */}
            {selectedItem && student && (
              <div className="p-6 border-t bg-gray-50 animate-in slide-in-from-bottom-10">
                <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Item:</p>
                    <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Qty:</label>
                    <Input 
                      type="number" 
                      min="1" 
                      max={selectedItem.quantity}
                      value={quantity}
                      onChange={e => setQuantity(parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <Button 
                      onClick={() => { setActionType("return"); handleTransaction(); }}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={isLoading}
                    >
                      <ArrowDownLeft className="mr-2 h-4 w-4" /> Return
                    </Button>
                    <Button 
                      onClick={() => { setActionType("borrow"); handleTransaction(); }}
                      className="flex-1"
                      disabled={isLoading || selectedItem.quantity < 1}
                    >
                      <ArrowUpRight className="mr-2 h-4 w-4" /> Borrow
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  )
}