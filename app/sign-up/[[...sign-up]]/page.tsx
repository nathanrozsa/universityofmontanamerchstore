import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-maroon-950 flex items-center justify-center py-16 px-4">
      <SignUp />
    </div>
  );
}
