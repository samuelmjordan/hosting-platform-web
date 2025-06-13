import { exec } from 'child_process'
import { NextRequest, NextResponse } from 'next/server'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  
  if (!address) {
    return NextResponse.json({ 
      status: 'down', 
      error: 'address parameter required' 
    }, { status: 400 })
  }

  try {
    console.log("ping")
    const { stdout } = await execAsync(`ping -c 1 -W 3 ${address}`)
    const isAlive = stdout.includes('bytes of data')
    
    return NextResponse.json({ 
      status: isAlive ? 'up' : 'down',
      method: 'ping'
    })
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'down', 
      error: error.message,
      method: 'ping'
    })
  }
}