import Navbar from '../components/navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="text-center p-20">
        <h1 className="text-4xl font-bold">Welcome to the Casting Platform</h1>
        <p className="mt-4 text-gray-600">Find and apply for the best casting calls.</p>
      </div>
    </div>
  );
}