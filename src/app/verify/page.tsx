"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ScanBarcode, UserCheck, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PendingUser {
  id: string
  student_name: string
  student_id: string
}

export default function VerifyPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)
  const [barcode, setBarcode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)

  // 1. Fetch the list of students waiting for verification
  const fetchPending = async () => {
    try {
      const res = await fetch('/api/admin/pending-users')
      if (res.ok) {
        setPendingUsers(await res.json())
      }
    } catch (e) {
      console.error("Failed to load users")
    }
  }

  useEffect(() => { fetchPending() }, [])

  // 2. Auto-focus the barcode input when a student is clicked
  useEffect(() => {
    if (selectedUser && inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedUser])

  // 3. Handle the Barcode Scan (Submit)
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !barcode.trim()) return

    setIsLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/admin/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: selectedUser.id, 
          barcode: barcode.trim() 
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed")

      // Success Logic
      setStatus({ type: 'success', msg: `Successfully verified ${selectedUser.student_name}!` })
      
      // Remove verified user from the list
      setPendingUsers(prev => prev.filter(u => u.id !== selectedUser.id))
      
      // Reset form
      setSelectedUser(null)
      setBarcode("")
      
    } catch (error) {
      setStatus({ type: 'error', msg: error instanceof Error ? error.message : "Verification failed" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Student Verification</h1>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: List of Pending Students */}
          <Card className="h-[calc(100vh-150px)] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Pending Queue
                <Badge variant="secondary" className="ml-2">{pendingUsers.length}</Badge>
              </CardTitle>
              <CardDescription>Select a student to verify their ID card</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2 space-y-2">
              {pendingUsers.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No pending signups found.
                </div>
              ) : (
                pendingUsers.map(user => (
                  <div 
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user)
                      setStatus(null)
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm
                      ${selectedUser?.id === user.id 
                        ? 'bg-primary/5 border-primary ring-1 ring-primary' 
                        : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">{user.student_name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{user.student_id}</p>
                      </div>
                      {selectedUser?.id === user.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary animate-in zoom-in" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* RIGHT COLUMN: Scanning Action Area */}
          <div className="space-y-6">
            <Card className="border-2 border-dashed">
              <CardHeader>
                <CardTitle>Verification Station</CardTitle>
                <CardDescription>
                  {selectedUser 
                    ? `Ready to scan card for ${selectedUser.student_name}`
                    : "Waiting for selection..."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedUser ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/50">
                    <ScanBarcode className="h-24 w-24 mb-4 opacity-20" />
                    <p className="text-lg">Select a student from the left to begin</p>
                  </div>
                ) : (
                  <form onSubmit={handleVerify} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    
                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 text-center">
                      <p className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">Verifying Student</p>
                      <h2 className="text-3xl font-bold mt-1 text-primary">{selectedUser.student_name}</h2>
                      <p className="text-xl font-mono mt-1 text-foreground/80">{selectedUser.student_id}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Scan ID Card Barcode</label>
                      <div className="relative">
                        <ScanBarcode className="absolute left-3 top-3 h-6 w-6 text-muted-foreground" />
                        <Input 
                          ref={inputRef}
                          value={barcode}
                          onChange={e => setBarcode(e.target.value)}
                          placeholder="Focus here and scan..."
                          className="pl-12 h-12 text-lg font-mono"
                          autoComplete="off"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Scanner should automatically press Enter. If not, press Enter manually.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg" 
                      disabled={isLoading || !barcode}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Link Card & Confirm"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Status Messages */}
            {status && (
              <Alert variant={status.type === 'error' ? "destructive" : "default"} 
                     className={status.type === 'success' ? "bg-green-50 border-green-200 text-green-900" : ""}>
                {status.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-green-600" />}
                <AlertDescription className="font-medium">
                  {status.msg}
                </AlertDescription>
              </Alert>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}