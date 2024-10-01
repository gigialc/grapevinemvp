import { NextResponse } from 'next/server'
import { connectDB } from '../../../../mongodb'
import UserModel from '../../../../models/UserModel'

export async function POST(req) {
  try {
    await connectDB()
    const { name, email, password } = await req.json()
    const user = await UserModel.register(name, email, password)
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Registration failed', error: error.message }, { status: 400 })
  }
}