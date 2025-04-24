'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    ageFrom: '',
    ageTo: '',
    ageExact: '',
    gender: '',
    location: '',
    mobile: '',
  });

  // Protect route
  useEffect(() => {
    if (status !== 'loading' && (!session || session.user.role !== 'admin')) {
      router.push('/');
    }
  }, [session, status, router]);

  // Fetch users
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetch('/api/users')
        .then(res => res.json())
        .then(data => {
          const nonAdminUsers = data.filter(u => u.role !== 'admin');
          setUsers(nonAdminUsers);
          setFilteredUsers(nonAdminUsers);
          setIsLoadingUsers(false);
        });
    }
  }, [session]);

  // Filter users
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = users.filter(user => {
      const matchSearch =
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);

      let matchAge = true;
      const age = parseInt(user.age);
      if (filters.ageExact) {
        matchAge = age === parseInt(filters.ageExact);
      } else {
        if (filters.ageFrom && age < parseInt(filters.ageFrom)) matchAge = false;
        if (filters.ageTo && age > parseInt(filters.ageTo)) matchAge = false;
      }

      const matchGender = filters.gender ? user.gender === filters.gender : true;
      const matchLocation = filters.location
        ? user.location.toLowerCase().includes(filters.location.toLowerCase())
        : true;

      return matchSearch && matchAge && matchGender && matchLocation;
    });

    setFilteredUsers(filtered);
  }, [search, filters, users]);

  // CSV export
  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Age', 'Gender', 'Location'];
    const rows = filteredUsers.map(u => [u.name, u.email, u.mobile, u.age, u.gender, u.location]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'users.csv');
  };

  // PDF export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'Email', 'Phone', 'Age', 'Gender', 'Location']],
      body: filteredUsers.map(u => [u.name, u.email, u.mobile, u.age, u.gender, u.location]),
    });
    doc.save('users.pdf');
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilters({
      ageFrom: '',
      ageTo: '',
      ageExact: '',
      gender: '',
      location: '',
      mobile: '',
    });
  };

  if (status === 'loading' || isLoadingUsers) {
    return <p className="p-6 text-white">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-neutral ">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="p-2 rounded-lg w-full bg-white text-black border"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="From Age"
              value={filters.ageFrom}
              onChange={e => setFilters({ ...filters, ageFrom: e.target.value, ageExact: '' })}
              className="p-2 rounded-lg w-1/2 bg-white text-black border"
            />
            <input
              type="number"
              placeholder="To Age"
              value={filters.ageTo}
              onChange={e => setFilters({ ...filters, ageTo: e.target.value, ageExact: '' })}
              className="p-2 rounded-lg w-1/2 bg-white text-black border"
            />
          </div>
          <input
            type="number"
            placeholder="Exact Age"
            value={filters.ageExact}
            onChange={e => setFilters({ ...filters, ageExact: e.target.value, ageFrom: '', ageTo: '' })}
            className="p-2 rounded-lg w-full bg-white text-black border"
          />
          <select
            value={filters.gender}
            onChange={e => setFilters({ ...filters, gender: e.target.value })}
            className="p-2 rounded-lg w-full bg-white text-black border"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Filter by location"
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
            className="p-2 rounded-lg w-full bg-white text-black border"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            Export CSV
          </button>
          <button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            Export PDF
          </button>
          <button
            onClick={() => router.push('/admin/casting-status')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Go to Casting Status
          </button>
          <button
            onClick={handleResetFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-600 text-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 border border-gray-600">Name</th>
                <th className="px-4 py-3 border border-gray-600">Email</th>
                <th className="px-4 py-3 border border-gray-600">Phone</th>
                <th className="px-4 py-3 border border-gray-600">Age</th>
                <th className="px-4 py-3 border border-gray-600">Gender</th>
                <th className="px-4 py-3 border border-gray-600">Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={idx} className="text-center even:bg-gray-700 odd:bg-gray-800">
                  <td className="px-4 py-2 border border-gray-600">{user.name}</td>
                  <td className="px-4 py-2 border border-gray-600">{user.email}</td>
                  <td className="px-4 py-2 border border-gray-600">{user.mobile}</td>
                  <td className="px-4 py-2 border border-gray-600">{user.age}</td>
                  <td className="px-4 py-2 border border-gray-600">{user.gender}</td>
                  <td className="px-4 py-2 border border-gray-600">{user.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}