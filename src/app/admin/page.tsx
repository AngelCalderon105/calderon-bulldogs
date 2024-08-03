"use client";
import { FormEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

     // To be removed after integrating with db
     const validEmail = "user@example.com";
     const validPassword = "password123";
 
     if (email !== validEmail || password !== validPassword) {
       setErrorMessage('Invalid email or password.');
       setIsLoggedIn(false);
     } else {
       setIsLoggedIn(true);
       setErrorMessage('');  
     }
   }

  return (
      <main className="flex min-h-screen flex-col items-center justify-center text-black">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h5 className="text-lg font-bold tracking-tight sm:text-[5rem]">
            Login
          </h5>
          {isLoggedIn ? (
          <p className="text-green-500">Login Successful!</p>
        ) : (
          errorMessage && <p className="text-red-500">{errorMessage}</p>
        )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm">
          <div className="flex flex-col">
            <label htmlFor="email"> Email </label>
              <input 
                id="email"
                type="email" 
                value={email} 
                placeholder="Enter your email" 
                onChange={e => setEmail(e.target.value)} 
                required
                className="p-2 border border-gray-300 rounded">
              </input>
            </div>
            <div className="flex flex-col">
           <label htmlFor="password"> Password </label>
              <input 
                id="password"
                type="password" 
                value={password} 
                placeholder="Enter your password" 
                onChange={e => setPassword(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded">  
                </input>
          </div>
          <button type="submit" className="bg-gray-500 text-white p-2 rounded justify-center items-center"> Sign In</button>
          </form>
        </div>
        
      </main>
  );
}