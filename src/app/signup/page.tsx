"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", studentId: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.studentId.trim()) return

    try {
      setIsLoading(true)
      setStatus(null)
      
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Signup failed")

      setStatus({ type: 'success', msg: "Registration successful! Please see the Lab Admin to verify your ID." })
      setFormData({ name: "", studentId: "" }) // Clear form
    } catch (err) {
      setStatus({ type: 'error', msg: err instanceof Error ? err.message : "Signup failed" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Lab Registration</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create a student account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {status && (
              <Alert variant={status.type === 'error' ? "destructive" : "default"} 
                     className={status.type === 'success' ? "bg-green-50 text-green-900 border-green-200" : ""}>
                {status.type === 'success' && <CheckCircle2 className="h-4 w-4 mr-2" />}
                <AlertDescription>{status.msg}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input 
                id="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="studentId" className="text-sm font-medium">Student ID</label>
              <Input 
                id="studentId"
                placeholder="S123456"
                value={formData.studentId}
                onChange={e => setFormData({...formData, studentId: e.target.value})}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Register
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Are you an Admin? Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
