'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    age: '', height: '', weight: '',
    languages: [], mobile: '',
    gender: '', location: ''
  });

  const [languageOpen, setLanguageOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  const languageRef = useRef(null);
  const genderRef = useRef(null);

  const languagesList = ['Hindi', 'English', 'Tamil', 'Telugu', 'Punjabi', 'Marathi', 'Gujarati'];
  const genderOptions = ['Male', 'Female', 'Other'];

  const toggleLanguage = (lang) => {
    setForm((prev) => {
      const exists = prev.languages.includes(lang);
      return {
        ...prev,
        languages: exists ? prev.languages.filter(l => l !== lang) : [...prev.languages, lang],
      };
    });
  };

  const selectGender = (gender) => {
    setForm({ ...form, gender });
    setGenderOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || 'Signup successful!');
      router.push('/login');
    } else {
      alert(data.message || 'Signup failed.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (languageRef.current && !languageRef.current.contains(e.target)) {
        setLanguageOpen(false);
      }
      if (genderRef.current && !genderRef.current.contains(e.target)) {
        setGenderOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4 py-10 mt-5">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 md:p-10 space-y-6">
        <h2 className="text-3xl font-bold text-center text-[#5B408C]">Create an Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Name" onChange={handleChange} />
          <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
          <Input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <Input name="age" type="number" placeholder="Age" onChange={handleChange} />
          <Input name="height" type="text" placeholder="Height (e.g., 5'8 or 172 cm)" onChange={handleChange} />
          <Input name="weight" type="text" placeholder="Weight (e.g., 60 kg)" onChange={handleChange} />

          {/* Language Dropdown */}
          <div className="relative" ref={languageRef}>
            <label className="block mb-1 font-semibold text-gray-700">Languages</label>
            <button
              type="button"
              onClick={() => setLanguageOpen(!languageOpen)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center bg-white focus:outline-none"
            >
              <span className="text-gray-700">
                {form.languages.length > 0 ? form.languages.join(', ') : 'Select languages'}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
            {languageOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {languagesList.map((lang) => (
                  <label
                    key={lang}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.languages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="mr-2"
                    />
                    {lang}
                  </label>
                ))}
              </div>
            )}
          </div>

          <Input name="mobile" placeholder="Mobile Number" onChange={handleChange} />

          {/* Gender Dropdown */}
          <div className="relative" ref={genderRef}>
            <label className="block mb-1 font-semibold text-gray-700">Gender</label>
            <button
              type="button"
              onClick={() => setGenderOpen(!genderOpen)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center bg-white focus:outline-none"
            >
              <span className="text-gray-700">{form.gender || 'Select gender'}</span>
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
            {genderOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                {genderOptions.map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => selectGender(gender)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {gender}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Input name="location" placeholder="Location (City, State)" onChange={handleChange} />

          <button
            type="submit"
            className="w-full py-3 bg-[#5B408C] text-white font-semibold rounded-lg hover:bg-[#4A3577] transition-all"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Input({ name, type = "text", placeholder, onChange }) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B408C] transition-all text-sm"
    />
  );
}