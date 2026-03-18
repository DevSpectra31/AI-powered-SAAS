import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
  <div className="w-full max-w-md">
    <SignUp/>
  </div>
</div>
  )
}